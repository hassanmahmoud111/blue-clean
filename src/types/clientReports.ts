export interface SummaryKpiItem {
  value: number;
  formatted?: string;
  label?: string;
  change_percentage?: number;
  is_increase?: boolean;
  comparison_label?: string;
}

export interface SummaryKPIs {
  total_units: SummaryKpiItem;
  total_bookings: SummaryKpiItem;
  occupancy_rate: SummaryKpiItem;
  total_revenue: SummaryKpiItem;
}

export interface UnitStatusSlice {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

export interface UnitsStatusChart {
  total_units: number;
  slices: UnitStatusSlice[];
}

export interface BookingSourceSlice {
  source: string;
  count: number;
  percentage: number;
}

export interface BookingSourcesChart {
  total_bookings: number;
  slices: BookingSourceSlice[];
}

export interface RevenueTrendBar {
  key: string;
  label: string;
  full_label?: string;
  revenue: number;
  bookings_count: number;
  is_current_month?: boolean;
}

export interface RevenueTrendChart {
  view_mode: 'monthly' | 'weekly' | 'daily' | string;
  bars: RevenueTrendBar[];
}

export interface ReportCharts {
  units_status: UnitsStatusChart;
  booking_sources: BookingSourcesChart;
  revenue_trend: RevenueTrendChart;
}

export interface UnitPerformanceItem {
  id: number;
  name: string;
  property_name: string;
  code?: string;
  image?: string;
  occupancy_rate: number;
  occupancy_formatted: string;
  bookings_count: number;
  revenue: number;
  revenue_formatted: string;
  last_booking_date: string;
}

export interface ExecutedServiceItem {
  service_name: string;
  service_key: string;
  count: number;
  change_percentage?: number;
  is_increase?: boolean;
  comparison_label?: string;
}

export interface ClientReportsData {
  summary_kpis: SummaryKPIs;
  charts: ReportCharts;
  units_performance: UnitPerformanceItem[];
  executed_services: ExecutedServiceItem[];
}

export interface ClientReportsFilterParams {
  period?: 'last_30_days' | 'last_7_days' | 'this_month' | 'last_month' | 'this_year' | 'custom' | string;
  from_date?: string;
  to_date?: string;
  property_name?: string;
  unit_id?: number | string;
  booking_source?: string;
  chart_view?: 'monthly' | 'weekly' | 'daily' | string;
}
