import { get } from '/@/utils/http/axios';

export interface DashboardQuery {
  startDate?: string;
  endDate?: string;
  category?: string;
  channel?: string;
  realtime?: boolean;
}

export interface SummaryMetric {
  key: string;
  label: string;
  value: number;
  unit?: string;
  delta?: number;
}

export interface TrendSeriesPoint {
  label: string;
  pv: number;
  uv: number;
}

export interface CategoryBarDatum {
  name: string;
  orders: number;
  revenue: number;
}

export interface ChannelPieDatum {
  name: string;
  value: number;
}

export interface DashboardStatPayload {
  summary: SummaryMetric[];
  trend: TrendSeriesPoint[];
  categories: CategoryBarDatum[];
  channels: ChannelPieDatum[];
  updatedAt: string;
}

enum URL {
  statistics = '/api/dashboard/statistics',
}

export const fetchDashboardStats = async (params: DashboardQuery) =>
  get<{ data: DashboardStatPayload }>({ url: URL.statistics, params, data: {}, headers: {} });

export type { DashboardQuery as DashboardFilters };
