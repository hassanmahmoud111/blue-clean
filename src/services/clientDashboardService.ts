import type {
  ClientDashboardOverviewData,
  ClientDashboardOverviewResponse,
} from '../types/clientDashboard';

export const fallbackClientDashboardOverview: ClientDashboardOverviewData = {
  user: {
    id: 2,
    name: 'محمد القحطاني',
    facility_name: 'مؤسسة السكن المميز',
    job_title: 'مدير الحساب',
    email: 'm.alqahtani@example.com',
    phone: '+966501234567',
    avatar: 'users/avatars/x.png',
    avatar_url: 'http://localhost:8000/storage/users/avatars/x.png',
  },
  kpis: {
    total_units: 12,
    new_units_this_month: 2,
    occupied_units: 8,
    occupancy_rate: 66.7,
    today_departures: 3,
    today_arrivals: 4,
    today_afternoon_arrivals: 3,
  },
  units_status_breakdown: {
    total: 12,
    occupied: 8,
    ready: 2,
    pending_cleaning: 1,
    maintenance: 1,
    percentages: {
      occupied: 66.7,
      ready: 16.7,
      pending_cleaning: 8.3,
      maintenance: 8.3,
    },
  },
  attention_units: [
    {
      id: 1,
      type: 'cleaning',
      priority: 'urgent',
      status: 'pending',
      unit_id: 304,
      unit_name: 'شقة 304',
      property_name: 'برج الياسمين',
      worker_id: null,
      worker_name: null,
      next_booking_id: 15,
      next_booking_check_in: '2026-09-29 15:00:00',
      created_at: '2026-09-29T10:00:00+00:00',
    },
    {
      id: 2,
      type: 'maintenance',
      priority: 'medium',
      status: 'in_progress',
      unit_id: 203,
      unit_name: 'شقة 203',
      property_name: 'مساكن الروضة',
      worker_id: 4,
      worker_name: 'خالد منصور',
      next_booking_id: null,
      next_booking_check_in: null,
      created_at: '2026-09-29T11:00:00+00:00',
    },
    {
      id: 3,
      type: 'cleaning',
      priority: 'medium',
      status: 'pending',
      unit_id: 102,
      unit_name: 'شقة 102',
      property_name: 'برج النخيل',
      worker_id: null,
      worker_name: null,
      next_booking_id: null,
      next_booking_check_in: null,
      created_at: '2026-09-29T11:30:00+00:00',
    },
  ],
  today_timeline: [
    {
      id: 12,
      type: 'departure',
      time: '09:30:00',
      unit_id: 102,
      unit_name: 'شقة 102',
      property_name: 'برج النخيل',
      guest_name: 'سعد الدوسري',
      booking_source: 'Airbnb',
      status: 'completed',
    },
    {
      id: 13,
      type: 'cleaning',
      time: '11:00:00',
      unit_id: 304,
      unit_name: 'شقة 304',
      property_name: 'برج الياسمين',
      guest_name: null,
      booking_source: null,
      status: 'in_progress',
    },
    {
      id: 14,
      type: 'inspection',
      time: '13:30:00',
      unit_id: 101,
      unit_name: 'شقة 101',
      property_name: 'برج النخيل',
      guest_name: null,
      booking_source: null,
      status: 'completed',
    },
    {
      id: 15,
      type: 'arrival',
      time: '15:00:00',
      unit_id: 304,
      unit_name: 'شقة 304',
      property_name: 'برج الياسمين',
      guest_name: 'نورة سالم',
      booking_source: 'Booking.com',
      status: 'scheduled',
    },
  ],
  recent_alerts: [
    {
      id: 1,
      entity_type: 'support_ticket',
      ticket_number: 'TCK-1001',
      subject: 'استفسار بخصوص الحجز',
      priority: 'urgent',
      status: 'in_progress',
      created_at: '2026-09-29T12:00:00+00:00',
      updated_at: '2026-09-29T12:30:00+00:00',
    },
    {
      id: 2,
      entity_type: 'cleaning_delay',
      ticket_number: 'CLN-2031',
      subject: 'تأخر بدء تنظيف شقة 304',
      priority: 'high',
      status: 'open',
      created_at: '2026-09-29T11:45:00+00:00',
      updated_at: '2026-09-29T11:45:00+00:00',
    },
    {
      id: 3,
      entity_type: 'sync_warning',
      ticket_number: 'SYNC-802',
      subject: 'تحديث بيانات الحجز من Airbnb',
      priority: 'normal',
      status: 'resolved',
      created_at: '2026-09-29T09:15:00+00:00',
      updated_at: '2026-09-29T09:20:00+00:00',
    },
  ],
  upcoming_bookings: [
    {
      id: 101,
      booking_code: 'BKG-101',
      guest_name: 'عبدالله محمد',
      guest_phone: '+966501112233',
      guest_email: 'guest@example.com',
      unit_id: 1,
      unit_name: 'شقة 102',
      property_name: 'برج النخيل',
      check_in_date: '2026-09-29',
      check_in_time: '14:00:00',
      check_out_date: '2026-10-02',
      check_out_time: '12:00:00',
      nights_count: 3,
      total_amount: 1500.0,
      booking_source: 'Booking.com',
      status: 'confirmed',
    },
    {
      id: 102,
      booking_code: 'BKG-102',
      guest_name: 'نورة سالم',
      guest_phone: '+966502223344',
      guest_email: 'noura@example.com',
      unit_id: 4,
      unit_name: 'شقة 304',
      property_name: 'برج الياسمين',
      check_in_date: '2026-09-29',
      check_in_time: '15:00:00',
      check_out_date: '2026-10-03',
      check_out_time: '11:00:00',
      nights_count: 4,
      total_amount: 2240.0,
      booking_source: 'Airbnb',
      status: 'confirmed',
    },
    {
      id: 103,
      booking_code: 'BKG-103',
      guest_name: 'خالد العتيبي',
      guest_phone: '+966503334455',
      guest_email: 'khaled@example.com',
      unit_id: 3,
      unit_name: 'شقة 203',
      property_name: 'مساكن الروضة',
      check_in_date: '2026-09-30',
      check_in_time: '16:00:00',
      check_out_date: '2026-10-03',
      check_out_time: '12:00:00',
      nights_count: 3,
      total_amount: 1520.0,
      booking_source: 'Gathern',
      status: 'pending',
    },
    {
      id: 104,
      booking_code: 'BKG-104',
      guest_name: 'سارة أحمد',
      guest_phone: '+966504445566',
      guest_email: 'sara@example.com',
      unit_id: 1,
      unit_name: 'شقة 101',
      property_name: 'برج النخيل',
      check_in_date: '2026-10-01',
      check_in_time: '14:00:00',
      check_out_date: '2026-10-04',
      check_out_time: '11:00:00',
      nights_count: 3,
      total_amount: 1740.0,
      booking_source: 'Airbnb',
      status: 'confirmed',
    },
  ],
  channel_integrations: [
    {
      platform: 'booking',
      is_connected: true,
      last_sync_at: '2026-09-29T15:58:00+00:00',
    },
    {
      platform: 'airbnb',
      is_connected: true,
      last_sync_at: '2026-09-29T15:56:00+00:00',
    },
    {
      platform: 'gathern',
      is_connected: false,
      last_sync_at: null,
    },
  ],
};

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('bluclean_token') ||
    window.localStorage.getItem('bluclean_client_token') ||
    document.cookie
      .split('; ')
      .find(row => row.startsWith('bluclean_token=') || row.startsWith('token='))
      ?.split('=')[1] ||
    null
  );
}

export async function fetchClientDashboardOverview(): Promise<ClientDashboardOverviewData> {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'https://blueclean.backend2.kazamiza.com/api/v1').replace(/\/$/, '');
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/dashboard/overview`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const result: ClientDashboardOverviewResponse = await response.json();
      if (result && result.success && result.data) {
        return result.data;
      }
    }
  } catch {
    // Graceful fallback to rich local state when offline or in prototype demo
  }

  return fallbackClientDashboardOverview;
}
