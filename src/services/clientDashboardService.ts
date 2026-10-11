import type {
  ClientDashboardOverviewData,
} from '../types/clientDashboard';
import { apiFetch, setStoredUser } from './apiClient';

export const fallbackClientDashboardOverview: ClientDashboardOverviewData = {
  user: {
    id: 2,
    name: 'عبدالله الشمري احمد',
    facility_name: 'مؤسسة إيواء الفندقية 11',
    job_title: 'مدير التشغيل 22',
    email: 'client@blueclean.com',
    phone: '+966551234567',
    avatar: null,
    avatar_url: null,
  },
  kpis: {
    total_units: 7,
    new_units_this_month: 7,
    occupied_units: 1,
    occupancy_rate: 14.3,
    today_departures: 0,
    today_arrivals: 0,
    today_afternoon_arrivals: 0,
  },
  units_status_breakdown: {
    total: 7,
    occupied: 1,
    ready: 6,
    pending_cleaning: 0,
    maintenance: 0,
    percentages: {
      occupied: 14.3,
      ready: 85.7,
      pending_cleaning: 0,
      maintenance: 0,
    },
  },
  attention_units: [],
  today_timeline: [],
  recent_alerts: [
    {
      id: 1,
      entity_type: 'booking',
      ticket_number: '',
      subject: 'حجز مؤكد للضيف ahmed',
      priority: 'normal',
      status: 'confirmed',
      created_at: '2026-09-10T16:01:00+03:00',
      updated_at: '2026-09-10T16:01:00+03:00',
    },
    {
      id: 2,
      entity_type: 'booking',
      ticket_number: '',
      subject: 'حجز مؤكد للضيف فهد السبيعي',
      priority: 'high',
      status: 'confirmed',
      created_at: '2026-09-10T15:39:00+03:00',
      updated_at: '2026-09-10T15:39:00+03:00',
    },
    {
      id: 3,
      entity_type: 'booking',
      ticket_number: '',
      subject: 'حجز مؤكد للضيف خالد المطيري',
      priority: 'normal',
      status: 'confirmed',
      created_at: '2026-09-10T15:39:00+03:00',
      updated_at: '2026-09-10T15:39:00+03:00',
    },
    {
      id: 4,
      entity_type: 'support_ticket',
      ticket_number: '',
      subject: 'استفسار عن ربط حساب منصة Airbnb مع النظام',
      priority: 'urgent',
      status: 'in_progress',
      created_at: '2026-09-10T15:39:00+03:00',
      updated_at: '2026-09-10T15:39:00+03:00',
    },
  ],
  upcoming_bookings: [],
  channel_integrations: [
    {
      platform: 'booking',
      is_connected: true,
      last_sync_at: '2026-09-10T16:01:00+03:00',
    },
    {
      platform: 'airbnb',
      is_connected: true,
      last_sync_at: '2026-09-10T16:11:00+03:00',
    },
    {
      platform: 'gathern',
      is_connected: true,
      last_sync_at: '2026-09-10T16:08:00+03:00',
    },
  ],
};

export async function fetchClientDashboardOverview(): Promise<ClientDashboardOverviewData> {
  const res = await apiFetch<ClientDashboardOverviewData>('/client/dashboard/overview');
  if (res.ok && res.data) {
    if (res.data.user) {
      setStoredUser(res.data.user);
    }
    return res.data;
  }

  return fallbackClientDashboardOverview;
}
