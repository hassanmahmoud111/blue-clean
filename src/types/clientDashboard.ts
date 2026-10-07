export interface ClientDashboardUser {
  id: number;
  name: string;
  facility_name: string;
  job_title: string;
  email: string;
  phone: string;
  avatar: string | null;
  avatar_url: string | null;
}

export interface ClientDashboardKpis {
  total_units: number;
  new_units_this_month: number;
  occupied_units: number;
  occupancy_rate: number;
  today_departures: number;
  today_arrivals: number;
  today_afternoon_arrivals: number;
}

export interface ClientDashboardUnitsStatusBreakdown {
  total: number;
  occupied: number;
  ready: number;
  pending_cleaning: number;
  maintenance: number;
  percentages: {
    occupied: number;
    ready: number;
    pending_cleaning: number;
    maintenance: number;
  };
}

export interface ClientDashboardAttentionUnit {
  id: number;
  type: 'cleaning' | 'maintenance' | 'service' | string;
  priority: 'urgent' | 'medium' | 'normal' | 'high' | string;
  status: string;
  unit_id: number | string;
  unit_name: string;
  property_name: string;
  worker_id: number | null;
  worker_name: string | null;
  next_booking_id: number | null;
  next_booking_check_in: string | null;
  created_at: string;
}

export interface ClientDashboardTodayTimeline {
  id: number;
  type: 'departure' | 'arrival' | 'cleaning' | 'maintenance' | 'service' | string;
  time: string;
  unit_id: number | string;
  unit_name: string;
  property_name: string;
  guest_name?: string | null;
  booking_source?: string | null;
  status: string;
}

export interface ClientDashboardRecentAlert {
  id: number;
  entity_type: string;
  ticket_number?: string;
  subject: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ClientDashboardUpcomingBooking {
  id: number;
  booking_code: string;
  guest_name: string;
  guest_phone: string;
  guest_email: string;
  unit_id: number | string;
  unit_name: string;
  property_name: string;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  nights_count: number;
  total_amount: number;
  booking_source: string;
  status: string;
}

export interface ClientDashboardChannelIntegration {
  platform: 'booking' | 'airbnb' | 'gathern' | string;
  is_connected: boolean;
  last_sync_at: string | null;
}

export interface ClientDashboardOverviewData {
  user: ClientDashboardUser;
  kpis: ClientDashboardKpis;
  units_status_breakdown: ClientDashboardUnitsStatusBreakdown;
  attention_units: ClientDashboardAttentionUnit[];
  today_timeline: ClientDashboardTodayTimeline[];
  recent_alerts: ClientDashboardRecentAlert[];
  upcoming_bookings: ClientDashboardUpcomingBooking[];
  channel_integrations: ClientDashboardChannelIntegration[];
}

export interface ClientDashboardOverviewResponse {
  success: boolean;
  data: ClientDashboardOverviewData;
  message: string;
}
