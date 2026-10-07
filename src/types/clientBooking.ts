export interface BookingStats {
  total_bookings: number;
  check_ins_this_week: number;
  check_outs_this_week: number;
  upcoming_bookings: number;
}

export interface CalendarInfo {
  view_mode: 'day' | 'week' | 'month' | string;
  base_date: string;
  from_date: string;
  to_date: string;
}

export interface CalendarUnitBooking {
  id: number | string;
  booking_code: string;
  guest_name: string;
  check_in_date: string;
  check_out_date: string;
  status: string;
  booking_source: string;
  color_tone?: string;
  start_day_index?: number;
  span_days?: number;
}

export interface CalendarUnit {
  id: number;
  name: string;
  property_name: string;
  code: string;
  unit_type: string;
  image?: string | null;
  bookings: CalendarUnitBooking[];
}

export interface PlatformDistributionItem {
  source: string;
  count: number;
  percentage: number;
}

export interface CalendarData {
  calendar_info: CalendarInfo;
  stats: BookingStats;
  units: CalendarUnit[];
  upcoming_bookings: BookingItem[];
  platform_distribution: PlatformDistributionItem[];
}

export interface BookingGuest {
  name: string;
  phone?: string;
  email?: string;
  adults_count: number;
  children_count?: number;
  total_guests?: number;
}

export interface CityInfo {
  id: number;
  name_ar: string;
  name_en?: string;
}

export interface AreaInfo {
  id: number;
  name_ar: string;
  name_en?: string;
}

export interface BookingUnit {
  id: number;
  name: string;
  property_name: string;
  code: string;
  unit_type?: string;
  city?: CityInfo;
  area?: AreaInfo;
  image?: string | null;
  images?: string[];
}

export interface BookingStay {
  check_in_date: string;
  check_in_date_formatted?: string;
  check_in_time: string;
  check_out_date: string;
  check_out_date_formatted?: string;
  check_out_time: string;
  nights_count: number;
}

export interface BookingPayment {
  total_amount: string | number;
  paid_amount: string | number;
  remaining_amount: string | number;
  payment_status: string;
  payment_method: string;
}

export interface BookingSourceSync {
  booking_type: string;
  booking_source: string;
  sync_status: string;
  platform_reference?: string | null;
}

export interface CleaningTaskInfo {
  code: string;
  name: string;
  status: string;
}

export interface BookingAutomation {
  block_calendar_dates: boolean;
  send_welcome_message: boolean;
  auto_clean_on_checkout: boolean;
  cleaning_task?: CleaningTaskInfo;
}

export interface BookingTimelineItem {
  id: number | string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | string;
}

export interface BookingScheduledMessage {
  id: number | string;
  title: string;
  status: string;
  time_ago: string;
}

export interface BookingItem {
  id: number;
  booking_code: string;
  status: 'confirmed' | 'pending' | 'canceled' | 'checked_in' | 'completed' | string;
  guest: BookingGuest;
  unit: BookingUnit;
  stay: BookingStay;
  payment: BookingPayment;
  source_sync: BookingSourceSync;
  automation: BookingAutomation;
  timeline?: BookingTimelineItem[];
  scheduled_messages?: BookingScheduledMessage[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BookingsListResponse {
  data: BookingItem[];
  links?: Record<string, any>;
  meta?: {
    current_page: number;
    from?: number;
    last_page: number;
    per_page: number;
    to?: number;
    total: number;
  };
}

export interface CreateBookingPayload {
  unit_id: number | string;
  booking_type: string;
  booking_source: string;
  guest_name: string;
  guest_phone?: string;
  guest_email?: string;
  adults_count: number;
  check_in_date: string;
  check_in_time: string;
  check_out_date: string;
  check_out_time: string;
  total_amount: number;
  payment_status: string;
  block_calendar_dates: boolean;
  send_welcome_message: boolean;
  auto_clean_on_checkout: boolean;
  notes?: string;
}
