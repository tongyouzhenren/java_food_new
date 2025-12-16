import { defineStore } from 'pinia';
import type {
  CategoryBarDatum,
  ChannelPieDatum,
  DashboardFilters,
  DashboardStatPayload,
  SummaryMetric,
  TrendSeriesPoint,
} from '/@/api/statistics';
import { fetchDashboardStats } from '/@/api/statistics';

interface HighlightState {
  type: 'line' | 'bar' | 'pie' | null;
  name: string | null;
}

interface DashboardState {
  loading: boolean;
  summary: SummaryMetric[];
  trend: TrendSeriesPoint[];
  categories: CategoryBarDatum[];
  channels: ChannelPieDatum[];
  lastUpdated: string;
  filters: {
    dateRange: string[];
    category: string;
    channel: string;
    realtimeMode: 'polling' | 'websocket';
    autoRefresh: boolean;
  };
  highlight: HighlightState;
  timer: number | null;
  socket: WebSocket | null;
  loadErrorCount: number;
}

const DEFAULT_WS = 'ws://localhost:8080/api/ws/dashboard';

const buildDefaultRange = (): string[] => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)];
};

const fallbackData: DashboardStatPayload = {
  summary: [
    { key: 'orders', label: '订单量', value: 1290, unit: '单', delta: 4.2 },
    { key: 'revenue', label: '营业额', value: 582300, unit: '元', delta: 6.8 },
    { key: 'customers', label: '用户数', value: 860, unit: '人', delta: 3.1 },
    { key: 'conversion', label: '转化率', value: 18.4, unit: '%', delta: 1.2 },
  ],
  trend: [
    { label: '周一', pv: 320, uv: 220 },
    { label: '周二', pv: 402, uv: 281 },
    { label: '周三', pv: 501, uv: 334 },
    { label: '周四', pv: 634, uv: 390 },
    { label: '周五', pv: 690, uv: 420 },
    { label: '周六', pv: 520, uv: 330 },
    { label: '周日', pv: 450, uv: 300 },
  ],
  categories: [
    { name: '川菜', orders: 320, revenue: 138000 },
    { name: '粤菜', orders: 280, revenue: 126000 },
    { name: '江浙菜', orders: 210, revenue: 88000 },
    { name: '湘菜', orders: 190, revenue: 76000 },
    { name: '西式简餐', orders: 165, revenue: 64000 },
  ],
  channels: [
    { name: '小程序', value: 42 },
    { name: 'APP', value: 26 },
    { name: '公众号', value: 18 },
    { name: '到店', value: 8 },
    { name: '其他', value: 6 },
  ],
  updatedAt: new Date().toISOString(),
};

const buildFallbackPayload = (): DashboardStatPayload => ({
  summary: fallbackData.summary.map((item) => ({ ...item })),
  trend: fallbackData.trend.map((item) => ({ ...item })),
  categories: fallbackData.categories.map((item) => ({ ...item })),
  channels: fallbackData.channels.map((item) => ({ ...item })),
  updatedAt: new Date().toISOString(),
});

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    loading: false,
    summary: [],
    trend: [],
    categories: [],
    channels: [],
    lastUpdated: '',
    filters: {
      dateRange: buildDefaultRange(),
      category: 'all',
      channel: 'all',
      realtimeMode: 'polling',
      autoRefresh: true,
    },
    highlight: {
      type: null,
      name: null,
    },
    timer: null,
    socket: null,
    loadErrorCount: 0,
  }),
  actions: {
    applyPayload(payload: DashboardStatPayload) {
      this.summary = payload.summary;
      this.trend = payload.trend;
      this.categories = payload.categories;
      this.channels = payload.channels;
      this.lastUpdated = payload.updatedAt || new Date().toISOString();
    },
    async loadStats() {
      if (this.loading) return;
      this.loading = true;
      try {
        const [startDate, endDate] = this.filters.dateRange;
        const params: DashboardFilters = {
          startDate,
          endDate,
          category: this.filters.category === 'all' ? undefined : this.filters.category,
          channel: this.filters.channel === 'all' ? undefined : this.filters.channel,
          realtime: this.filters.realtimeMode === 'websocket',
        };
        const response = await fetchDashboardStats(params);
        const payload: DashboardStatPayload = (response as any).data ?? (response as any).result ?? fallbackData;
        this.applyPayload(payload);
        this.loadErrorCount = 0;
      } catch (error) {
        console.warn('加载统计数据失败，使用本地占位数据。', error);
        this.applyPayload(buildFallbackPayload());
        this.loadErrorCount += 1;
        if (this.loadErrorCount >= 3) {
          this.filters.autoRefresh = false;
          this.stopRealtime();
        }
      } finally {
        this.loading = false;
      }
    },
    refreshWithFilters(partial?: Partial<DashboardState['filters']>) {
      if (partial) {
        this.filters = { ...this.filters, ...partial };
      }
      this.loadStats();
      if (!this.filters.autoRefresh) {
        this.stopRealtime();
        return;
      }
      if (this.filters.realtimeMode === 'websocket') {
        this.startWebSocket();
      } else {
        this.startPolling();
      }
    },
    startPolling(interval = 20000) {
      if (!this.filters.autoRefresh) return;
      this.stopPolling();
      this.timer = window.setInterval(() => this.loadStats(), interval);
    },
    stopPolling() {
      if (this.timer) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
    },
    startWebSocket(url: string = DEFAULT_WS) {
      if (!this.filters.autoRefresh) return;
      this.stopPolling();
      this.closeWebSocket();
      try {
        const socket = new WebSocket(url);
        this.socket = socket;
        socket.onmessage = (event) => {
          try {
            const payload: DashboardStatPayload = JSON.parse(event.data);
            if (payload) {
              this.applyPayload(payload);
            }
          } catch (err) {
            console.warn('解析实时消息失败', err);
          }
        };
        socket.onclose = () => {
          if (this.filters.realtimeMode === 'websocket') {
            this.startPolling();
          }
        };
        socket.onerror = () => {
          this.startPolling();
        };
      } catch (error) {
        console.warn('WebSocket 初始化失败，自动切换到轮询。', error);
        this.startPolling();
      }
    },
    closeWebSocket() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    },
    stopRealtime() {
      this.stopPolling();
      this.closeWebSocket();
    },
    toggleRealtimeMode(mode: 'polling' | 'websocket') {
      this.filters.realtimeMode = mode;
      if (!this.filters.autoRefresh) {
        this.stopRealtime();
        return;
      }
      if (mode === 'websocket') {
        this.startWebSocket();
      } else {
        this.startPolling();
      }
    },
    toggleAutoRefresh(enabled: boolean) {
      this.filters.autoRefresh = enabled;
      if (enabled) {
        if (this.filters.realtimeMode === 'websocket') {
          this.startWebSocket();
        } else {
          this.startPolling();
        }
      } else {
        this.stopRealtime();
      }
    },
    setHighlight(payload: HighlightState) {
      this.highlight = payload;
    },
    clearHighlight() {
      this.highlight = { type: null, name: null };
    },
  },
});
