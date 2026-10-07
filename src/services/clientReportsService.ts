import type { ClientReportsData, ClientReportsFilterParams } from '../types/clientReports';

const fallbackReportsData: ClientReportsData = {
  summary_kpis: {
    total_units: {
      value: 12,
      label: 'بدون تغيير',
    },
    total_bookings: {
      value: 56,
      change_percentage: 14,
      is_increase: true,
      comparison_label: '↑ 14% مقارنة بالفترة السابقة',
    },
    occupancy_rate: {
      value: 78,
      formatted: '78%',
      change_percentage: 6,
      is_increase: true,
      comparison_label: '↑ 6% مقارنة بالفترة السابقة',
    },
    total_revenue: {
      value: 48750.0,
      formatted: '48,750 ر.س',
      change_percentage: 12,
      is_increase: true,
      comparison_label: '↑ 12% مقارنة بالفترة السابقة',
    },
  },
  charts: {
    units_status: {
      total_units: 12,
      slices: [
        { key: 'occupied', label: 'مشغولة', count: 8, percentage: 67 },
        { key: 'ready', label: 'جاهزة', count: 2, percentage: 17 },
        { key: 'pending_cleaning', label: 'بانتظار التنظيف', count: 1, percentage: 8 },
        { key: 'maintenance', label: 'قيد الصيانة', count: 1, percentage: 8 },
      ],
    },
    booking_sources: {
      total_bookings: 56,
      slices: [
        { source: 'Airbnb', count: 24, percentage: 43 },
        { source: 'Booking.com', count: 18, percentage: 32 },
        { source: 'Gathern', count: 10, percentage: 18 },
        { source: 'حجز مباشر', count: 4, percentage: 7 },
      ],
    },
    revenue_trend: {
      view_mode: 'monthly',
      bars: [
        { key: '2026-01', label: 'يناير', full_label: 'يناير 2026', revenue: 32000.0, bookings_count: 35, is_current_month: false },
        { key: '2026-02', label: 'فبراير', full_label: 'فبراير 2026', revenue: 34500.0, bookings_count: 38, is_current_month: false },
        { key: '2026-03', label: 'مارس', full_label: 'مارس 2026', revenue: 37200.0, bookings_count: 42, is_current_month: false },
        { key: '2026-04', label: 'أبريل', full_label: 'أبريل 2026', revenue: 41000.0, bookings_count: 48, is_current_month: false },
        { key: '2026-05', label: 'مايو', full_label: 'مايو 2026', revenue: 38900.0, bookings_count: 44, is_current_month: false },
        { key: '2026-06', label: 'يونيو', full_label: 'يونيو 2026', revenue: 39500.0, bookings_count: 45, is_current_month: false },
        { key: '2026-07', label: 'يوليو', full_label: 'يوليو 2026', revenue: 43200.0, bookings_count: 49, is_current_month: false },
        { key: '2026-08', label: 'أغسطس', full_label: 'أغسطس 2026', revenue: 45800.0, bookings_count: 52, is_current_month: false },
        { key: '2026-09', label: 'سبتمبر', full_label: 'سبتمبر 2026', revenue: 48750.0, bookings_count: 56, is_current_month: true },
      ],
    },
  },
  units_performance: [
    {
      id: 1,
      name: 'شقة 101',
      property_name: 'برج النخيل',
      code: 'UNT-101',
      image: '',
      occupancy_rate: 92,
      occupancy_formatted: '92%',
      bookings_count: 12,
      revenue: 12400.0,
      revenue_formatted: '12,400 ر.س',
      last_booking_date: '10 سبتمبر 2026',
    },
    {
      id: 2,
      name: 'شقة 102',
      property_name: 'برج النخيل',
      code: 'UNT-102',
      image: '',
      occupancy_rate: 85,
      occupancy_formatted: '85%',
      bookings_count: 10,
      revenue: 9800.0,
      revenue_formatted: '9,800 ر.س',
      last_booking_date: '9 سبتمبر 2026',
    },
    {
      id: 3,
      name: 'شقة 203',
      property_name: 'مساكن الروضة',
      code: 'UNT-203',
      image: '',
      occupancy_rate: 76,
      occupancy_formatted: '76%',
      bookings_count: 8,
      revenue: 7200.0,
      revenue_formatted: '7,200 ر.س',
      last_booking_date: '8 سبتمبر 2026',
    },
    {
      id: 4,
      name: 'شقة 304',
      property_name: 'برج الياسمين',
      code: 'UNT-304',
      image: '',
      occupancy_rate: 68,
      occupancy_formatted: '68%',
      bookings_count: 7,
      revenue: 6500.0,
      revenue_formatted: '6,500 ر.س',
      last_booking_date: '7 سبتمبر 2026',
    },
    {
      id: 5,
      name: 'شقة 405',
      property_name: 'مساكن النخيل',
      code: 'UNT-405',
      image: '',
      occupancy_rate: 54,
      occupancy_formatted: '54%',
      bookings_count: 5,
      revenue: 4300.0,
      revenue_formatted: '4,300 ر.س',
      last_booking_date: '6 سبتمبر 2026',
    },
  ],
  executed_services: [
    {
      service_name: 'تنظيف وحدات',
      service_key: 'cleaning',
      count: 28,
      change_percentage: 22,
      is_increase: true,
      comparison_label: '↑ 22% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'صيانة',
      service_key: 'maintenance',
      count: 6,
      change_percentage: 5,
      is_increase: true,
      comparison_label: '↑ 5% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'غسيل سجاد',
      service_key: 'carpet_washing',
      count: 4,
      change_percentage: 33,
      is_increase: true,
      comparison_label: '↑ 33% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'غسيل كنب',
      service_key: 'sofa_washing',
      count: 3,
      change_percentage: 50,
      is_increase: true,
      comparison_label: '↑ 50% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'خدمات إضافية',
      service_key: 'other_extra_services',
      count: 5,
      change_percentage: 25,
      is_increase: true,
      comparison_label: '↑ 25% مقارنة بالفترة السابقة',
    },
  ],
};

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('bluclean_token') ||
    window.localStorage.getItem('bluclean_client_token') ||
    null
  );
}

function getBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL || 'https://blueclean.backend2.kazamiza.com/api/v1').replace(/\/$/, '');
}

export async function fetchClientReports(params?: ClientReportsFilterParams): Promise<ClientReportsData> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const query = new URLSearchParams();
    if (params?.period) query.set('period', params.period);
    if (params?.from_date) query.set('from_date', params.from_date);
    if (params?.to_date) query.set('to_date', params.to_date);
    if (params?.property_name && params.property_name !== 'all') query.set('property_name', params.property_name);
    if (params?.unit_id && params.unit_id !== 'all') query.set('unit_id', String(params.unit_id));
    if (params?.booking_source && params.booking_source !== 'all') query.set('booking_source', params.booking_source);
    if (params?.chart_view) query.set('chart_view', params.chart_view);

    const endpoints = ['/client/reports', '/client/reports/overview'];
    for (const ep of endpoints) {
      try {
        const response = await fetch(`${baseUrl}${ep}?${query.toString()}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });

        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            return json.data;
          }
        }
      } catch {
        // try next endpoint or fallback
      }
    }
  } catch {
    // fallback
  }

  return fallbackReportsData;
}
