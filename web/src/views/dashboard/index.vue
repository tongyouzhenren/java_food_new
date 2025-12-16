<template>
  <div class="dashboard-page">
    <a-card class="filter-card" title="仪表盘筛选">
      <template #extra>
        <a-space>
          <span class="meta">上次刷新：{{ lastUpdatedDisplay }}</span>
          <a-tooltip title="手动刷新一次最新数据">
            <a-button type="link" size="small" @click="refresh">刷新</a-button>
          </a-tooltip>
        </a-space>
      </template>
      <a-form layout="inline" class="filter-form">
        <a-form-item label="时间范围">
          <a-range-picker v-model:value="dateRange" @change="onDateChange" />
        </a-form-item>
        <a-form-item label="分类">
          <a-select v-model:value="dashboardStore.filters.category" style="min-width: 140px" @change="onFilterChange">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option v-for="item in categoryOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="渠道">
          <a-select v-model:value="dashboardStore.filters.channel" style="min-width: 140px" @change="onFilterChange">
            <a-select-option value="all">全部</a-select-option>
            <a-select-option v-for="item in channelOptions" :key="item" :value="item">{{ item }}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="实时模式">
          <a-radio-group
            v-model:value="dashboardStore.filters.realtimeMode"
            button-style="solid"
            @change="onRealtimeModeChange"
          >
            <a-radio-button value="polling">轮询</a-radio-button>
            <a-radio-button value="websocket">WebSocket</a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="自动刷新">
          <a-switch v-model:checked="dashboardStore.filters.autoRefresh" @change="onAutoRefreshChange" />
        </a-form-item>
      </a-form>
    </a-card>

    <a-row :gutter="[16, 16]" class="summary-row">
      <a-col v-for="metric in dashboardStore.summary" :key="metric.key" :xs="24" :sm="12" :md="6">
        <a-card size="small">
          <div class="metric">
            <span class="metric-label">{{ metric.label }}</span>
            <div class="metric-value">{{ metric.value }}<span class="metric-unit">{{ metric.unit }}</span></div>
            <div class="metric-trend" :class="{ up: metric.delta && metric.delta > 0 }">环比 {{ metric.delta || 0 }}%</div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="16">
        <a-card title="访问趋势" :loading="dashboardStore.loading">
          <template #extra>
            <a-badge :status="dashboardStore.filters.realtimeMode === 'websocket' ? 'processing' : 'success'" />
            <span class="hint">鼠标滑过折线可联动其他图表</span>
          </template>
          <LineChart
            :data="dashboardStore.trend"
            :highlighted-name="dashboardStore.highlight.name"
            @hover="handleHighlight"
            @leave="clearHighlight"
          />
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="渠道占比" :loading="dashboardStore.loading">
          <template #extra>
            <span class="hint">支持悬浮提示与联动</span>
          </template>
          <PieChart
            :data="dashboardStore.channels"
            :highlighted-name="dashboardStore.highlight.name"
            @hover="handleHighlight"
            @leave="clearHighlight"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="24">
        <a-card title="品类表现" :loading="dashboardStore.loading">
          <template #extra>
            <span class="hint">点击或悬浮可与其他图表联动</span>
          </template>
          <BarChart
            :data="dashboardStore.categories"
            :highlighted-name="dashboardStore.highlight.name"
            @hover="handleHighlight"
            @leave="clearHighlight"
          />
        </a-card>
      </a-col>
    </a-row>

    <a-alert
      message="支持定时轮询或 WebSocket 实时更新，筛选条件会影响三种图表并保持联动高亮。"
      type="info"
      show-icon
      class="tips"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import BarChart from './components/BarChart.vue';
import LineChart from './components/LineChart.vue';
import PieChart from './components/PieChart.vue';
import { useDashboardStore } from '/@/store';

const dashboardStore = useDashboardStore();
const dateRange = ref<string[]>([...dashboardStore.filters.dateRange]);

const lastUpdatedDisplay = computed(() => {
  return dashboardStore.lastUpdated ? new Date(dashboardStore.lastUpdated).toLocaleString() : '未加载';
});

const categoryOptions = computed(() => dashboardStore.categories.map((item) => item.name));
const channelOptions = computed(() => dashboardStore.channels.map((item) => item.name));

const refresh = () => dashboardStore.refreshWithFilters();
const onFilterChange = () => dashboardStore.refreshWithFilters();
const onDateChange = (_dates: any, dateStrings: string[]) => {
  dateRange.value = dateStrings;
  dashboardStore.refreshWithFilters({ dateRange: dateStrings });
};

const onRealtimeModeChange = (evt: any) => {
  dashboardStore.toggleRealtimeMode(evt.target.value);
};

const onAutoRefreshChange = (checked: boolean) => {
  dashboardStore.toggleAutoRefresh(checked);
};

const handleHighlight = (payload: { type: 'line' | 'bar' | 'pie'; name: string }) => {
  dashboardStore.setHighlight(payload);
};

const clearHighlight = () => dashboardStore.clearHighlight();

onMounted(() => {
  dashboardStore.refreshWithFilters();
});

onBeforeUnmount(() => {
  dashboardStore.stopRealtime();
});
</script>

<style scoped lang="less">
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-card {
  .filter-form {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
  }

  .meta {
    color: #888;
    font-size: 12px;
  }
}

.summary-row {
  .metric {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .metric-label {
    color: #888;
  }

  .metric-value {
    font-size: 24px;
    font-weight: bold;
  }

  .metric-unit {
    margin-left: 4px;
    font-size: 14px;
    color: #999;
  }

  .metric-trend {
    color: #52c41a;
    font-size: 12px;

    &.up {
      color: #f5222d;
    }
  }
}

.hint {
  color: #999;
  margin-left: 8px;
}

.tips {
  background: #f7f9ff;
}
</style>
