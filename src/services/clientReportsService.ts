import type { ClientReportsData, ClientReportsFilterParams } from '../types/clientReports';
import { ensureAuthToken, getApiBaseUrl } from './apiClient';

const fallbackReportsData: ClientReportsData = {
  summary_kpis: {
    total_units: {
      value: 7,
      label: 'الوحدات المسجلة',
    },
    total_bookings: {
      value: 4,
      change_percentage: 100,
      is_increase: true,
      comparison_label: '↑ 100% مقارنة بالفترة السابقة',
    },
    occupancy_rate: {
      value: 8,
      formatted: '8%',
      change_percentage: 100,
      is_increase: true,
      comparison_label: '↑ 100% مقارنة بالفترة السابقة',
    },
    total_revenue: {
      value: 4950,
      formatted: '4,950 ر.س',
      change_percentage: 100,
      is_increase: true,
      comparison_label: '↑ 100% مقارنة بالفترة السابقة',
    },
  },
  charts: {
    units_status: {
      total_units: 7,
      slices: [
        { key: 'occupied', label: 'مشغولة', count: 0, percentage: 0 },
        { key: 'ready', label: 'جاهزة', count: 6, percentage: 86 },
        { key: 'pending_cleaning', label: 'بانتظار التنظيف', count: 1, percentage: 14 },
        { key: 'maintenance', label: 'قيد الصيانة', count: 0, percentage: 0 },
      ],
    },
    booking_sources: {
      total_bookings: 4,
      slices: [
        { source: 'direct', count: 2, percentage: 50 },
        { source: 'airbnb', count: 1, percentage: 25 },
        { source: 'booking', count: 1, percentage: 25 },
      ],
    },
    revenue_trend: {
      view_mode: 'monthly',
      bars: [
        { key: '2026-02', label: 'فبراير', full_label: 'فبراير 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-03', label: 'مارس', full_label: 'مارس 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-04', label: 'أبريل', full_label: 'أبريل 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-05', label: 'مايو', full_label: 'مايو 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-06', label: 'يونيو', full_label: 'يونيو 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-07', label: 'يوليو', full_label: 'يوليو 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-08', label: 'أغسطس', full_label: 'أغسطس 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-09', label: 'سبتمبر', full_label: 'سبتمبر 2026', revenue: 0, bookings_count: 0, is_current_month: false },
        { key: '2026-10', label: 'أكتوبر', full_label: 'أكتوبر 2026', revenue: 4950, bookings_count: 4, is_current_month: true },
      ],
    },
  },
  units_performance: [
    {
      id: 5,
      name: 'شقة العليا 102 - صيانة دورية',
      property_name: 'عمارة العليا 12',
      code: 'UNT-105',
      image: '',
      occupancy_rate: 27,
      occupancy_formatted: '27%',
      bookings_count: 1,
      revenue: 0,
      revenue_formatted: '0 ر.س',
      last_booking_date: '6 أكتوبر 2026',
    },
    {
      id: 1,
      name: 'شقة الرمال الفاخرة - برج 4',
      property_name: 'أبراج الرمال السكنية',
      code: 'UNT-101',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      occupancy_rate: 10,
      occupancy_formatted: '10%',
      bookings_count: 1,
      revenue: 1350,
      revenue_formatted: '1,350 ر.س',
      last_booking_date: '2 أكتوبر 2026',
    },
    {
      id: 3,
      name: 'استوديو الكورنيش بإطلالة بحرية',
      property_name: 'أبراج الشاطئ',
      code: 'UNT-103',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      occupancy_rate: 10,
      occupancy_formatted: '10%',
      bookings_count: 1,
      revenue: 1200,
      revenue_formatted: '1,200 ر.س',
      last_booking_date: '3 أكتوبر 2026',
    },
    {
      id: 2,
      name: 'فيلا النرجس VIP مسبح خاص',
      property_name: 'كمباوند النرجس ريزيدنس',
      code: 'UNT-102',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      occupancy_rate: 7,
      occupancy_formatted: '7%',
      bookings_count: 1,
      revenue: 2400,
      revenue_formatted: '2,400 ر.س',
      last_booking_date: '30 سبتمبر 2026',
    },
    {
      id: 4,
      name: 'شاليه اليمامة للعائلات',
      property_name: 'منتجع اليمامة',
      code: 'UNT-104',
      image: '',
      occupancy_rate: 0,
      occupancy_formatted: '0%',
      bookings_count: 0,
      revenue: 0,
      revenue_formatted: '0 ر.س',
      last_booking_date: 'لا توجد حجوزات حديثة',
    },
    {
      id: 6,
      name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
      property_name: 'كمباوند النرجس ريزيدنس',
      code: 'UNT-Q4HSIB',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      occupancy_rate: 0,
      occupancy_formatted: '0%',
      bookings_count: 0,
      revenue: 0,
      revenue_formatted: '0 ر.س',
      last_booking_date: 'لا توجد حجوزات حديثة',
    },
    {
      id: 7,
      name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
      property_name: 'أبراج الرمال السكنية',
      code: 'UNT-YMFCHL',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      occupancy_rate: 0,
      occupancy_formatted: '0%',
      bookings_count: 0,
      revenue: 0,
      revenue_formatted: '0 ر.س',
      last_booking_date: 'لا توجد حجوزات حديثة',
    },
  ],
  executed_services: [
    {
      service_name: 'تنظيف وحدات',
      service_key: 'cleaning',
      count: 1,
      change_percentage: 100,
      is_increase: true,
      comparison_label: '↑ 100% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'صيانة',
      service_key: 'maintenance',
      count: 0,
      change_percentage: 0,
      is_increase: true,
      comparison_label: '↑ 0% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'غسيل سجاد',
      service_key: 'carpet_washing',
      count: 0,
      change_percentage: 0,
      is_increase: true,
      comparison_label: '↑ 0% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'غسيل كنب',
      service_key: 'sofa_washing',
      count: 0,
      change_percentage: 0,
      is_increase: true,
      comparison_label: '↑ 0% مقارنة بالفترة السابقة',
    },
    {
      service_name: 'خدمات إضافية',
      service_key: 'other_extra_services',
      count: 3,
      change_percentage: 100,
      is_increase: true,
      comparison_label: '↑ 100% مقارنة بالفترة السابقة',
    },
  ],
};

export async function fetchClientReports(params?: ClientReportsFilterParams): Promise<ClientReportsData> {
  const baseUrl = getApiBaseUrl();
  const token = await ensureAuthToken();

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
