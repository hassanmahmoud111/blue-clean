import type {
  BookingItem,
  BookingStats,
  BookingsListResponse,
  CalendarData,
  CityInfo,
  CreateBookingPayload,
} from '../types/clientBooking';

const fallbackStats: BookingStats = {
  total_bookings: 4,
  check_ins_this_week: 0,
  check_outs_this_week: 1,
  upcoming_bookings: 0,
};

const fallbackBookings: BookingItem[] = [
  {
    id: 4,
    booking_code: 'BK-261006-197',
    status: 'confirmed',
    status_label: 'مؤكد',
    guest: {
      name: 'ahmed',
      phone: '+966501234567',
      email: 'ahmed@example.com',
      adults_count: 1,
      children_count: 0,
      total_guests: 1,
    },
    unit: {
      id: 5,
      name: 'شقة العليا 102 - صيانة دورية',
      property_name: 'عمارة العليا 12',
      code: 'UNT-105',
      unit_type: 'شقة',
      city: { id: 1, name_ar: 'الرياض', name_en: 'Riyadh' },
      area: { id: 4, name_ar: 'العليا', name_en: 'Al Olaya' },
      image: '/unit-thumbs/thumb-3.png',
      images: ['/unit-thumbs/thumb-3.png'],
    },
    stay: {
      check_in_date: '2026-10-06',
      check_in_date_formatted: '6 أكتوبر 2026',
      check_in_time: '01:03 PM',
      check_out_date: '2026-10-14',
      check_out_date_formatted: '14 أكتوبر 2026',
      check_out_time: '01:03 PM',
      nights_count: 8,
    },
    payment: {
      total_amount: 0,
      paid_amount: 0,
      remaining_amount: 0,
      payment_status: 'unpaid',
      payment_status_label: 'غير مدفوع',
      payment_method: 'direct',
    },
    source_sync: {
      booking_type: 'direct',
      booking_source: 'direct',
      booking_source_label: 'حجز مباشر',
      sync_status: 'none',
      sync_label: 'لا توجد مزامنة',
      platform_reference: null,
    },
    automation: {
      block_calendar_dates: true,
      send_welcome_message: true,
      auto_clean_on_checkout: true,
    },
    notes: null,
  },
  {
    id: 3,
    booking_code: 'BK-261002-03',
    status: 'confirmed',
    status_label: 'مؤكد',
    guest: {
      name: 'سلطان القحطاني',
      phone: '+966503334455',
      email: 'sultan@example.com',
      adults_count: 2,
      children_count: 0,
      total_guests: 2,
    },
    unit: {
      id: 3,
      name: 'استوديو الكورنيش بإطلالة بحرية',
      property_name: 'أبراج الشاطئ',
      code: 'UNT-103',
      unit_type: 'استوديو',
      city: { id: 2, name_ar: 'جدة', name_en: 'Jeddah' },
      area: { id: 7, name_ar: 'الشاطئ', name_en: 'Al Shati' },
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    },
    stay: {
      check_in_date: '2026-10-03',
      check_in_date_formatted: '3 أكتوبر 2026',
      check_in_time: '14:00',
      check_out_date: '2026-10-06',
      check_out_date_formatted: '6 أكتوبر 2026',
      check_out_time: '11:00',
      nights_count: 3,
    },
    payment: {
      total_amount: 1200,
      paid_amount: 500,
      remaining_amount: 700,
      payment_status: 'partially_paid',
      payment_status_label: 'مدفوع جزئياً',
      payment_method: 'bank_transfer',
    },
    source_sync: {
      booking_type: 'direct',
      booking_source: 'direct',
      booking_source_label: 'حجز مباشر',
      sync_status: 'none',
      sync_label: 'لا توجد مزامنة',
      platform_reference: null,
    },
    automation: {
      block_calendar_dates: true,
      send_welcome_message: true,
      auto_clean_on_checkout: true,
    },
    notes: null,
  },
  {
    id: 2,
    booking_code: 'BK-261002-02',
    status: 'active',
    status_label: 'قيد الإقامة',
    guest: {
      name: 'خالد المطيري',
      phone: '+966502223344',
      email: 'khaled@example.com',
      adults_count: 4,
      children_count: 2,
      total_guests: 6,
    },
    unit: {
      id: 2,
      name: 'فيلا النرجس VIP مسبح خاص',
      property_name: 'كمباوند النرجس ريزيدنس',
      code: 'UNT-102',
      unit_type: 'فيلا',
      city: { id: 1, name_ar: 'الرياض', name_en: 'Riyadh' },
      area: { id: 1, name_ar: 'النرجس', name_en: 'Al Narjis' },
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800'],
    },
    stay: {
      check_in_date: '2026-09-30',
      check_in_date_formatted: '30 سبتمبر 2026',
      check_in_time: '16:00',
      check_out_date: '2026-10-02',
      check_out_date_formatted: '2 أكتوبر 2026',
      check_out_time: '11:00',
      nights_count: 2,
    },
    payment: {
      total_amount: 2400,
      paid_amount: 2400,
      remaining_amount: 0,
      payment_status: 'paid',
      payment_status_label: 'مدفوع',
      payment_method: 'mastercard',
    },
    source_sync: {
      booking_type: 'platform',
      booking_source: 'booking',
      booking_source_label: 'Booking.com',
      sync_status: 'synced',
      sync_label: 'تمت المزامنة',
      platform_reference: 'BK-449102',
    },
    automation: {
      block_calendar_dates: true,
      send_welcome_message: true,
      auto_clean_on_checkout: true,
    },
    notes: null,
  },
  {
    id: 1,
    booking_code: 'BK-261002-01',
    status: 'confirmed',
    status_label: 'مؤكد',
    guest: {
      name: 'فهد السبيعي',
      phone: '+966501112233',
      email: 'fahad@example.com',
      adults_count: 2,
      children_count: 1,
      total_guests: 3,
    },
    unit: {
      id: 1,
      name: 'شقة الرمال الفاخرة - برج 4',
      property_name: 'أبراج الرمال السكنية',
      code: 'UNT-101',
      unit_type: 'شقة',
      city: { id: 1, name_ar: 'الرياض', name_en: 'Riyadh' },
      area: { id: 4, name_ar: 'العليا', name_en: 'Al Olaya' },
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    },
    stay: {
      check_in_date: '2026-10-02',
      check_in_date_formatted: '2 أكتوبر 2026',
      check_in_time: '15:00',
      check_out_date: '2026-10-05',
      check_out_date_formatted: '5 أكتوبر 2026',
      check_out_time: '11:00',
      nights_count: 3,
    },
    payment: {
      total_amount: 1350,
      paid_amount: 1350,
      remaining_amount: 0,
      payment_status: 'paid',
      payment_status_label: 'مدفوع',
      payment_method: 'visa',
    },
    source_sync: {
      booking_type: 'platform',
      booking_source: 'airbnb',
      booking_source_label: 'Airbnb',
      sync_status: 'synced',
      sync_label: 'تمت المزامنة',
      platform_reference: 'HM98721X',
    },
    automation: {
      block_calendar_dates: true,
      send_welcome_message: true,
      auto_clean_on_checkout: true,
      cleaning_task: {
        code: 'CLN-2031',
        name: 'تنظيف بعد المغادرة',
        status: 'مجدولة',
      },
    },
    notes: null,
  },
];

const fallbackCalendar: CalendarData = {
  calendar_info: {
    view_mode: 'week',
    base_date: '2026-10-05',
    from_date: '2026-10-03',
    to_date: '2026-10-08',
  },
  stats: fallbackStats,
  units: [
    {
      id: 7,
      name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
      property_name: 'أبراج الرمال السكنية',
      code: 'UNT-YMFCHL',
      unit_type: 'شقة',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      bookings: [],
    },
    {
      id: 6,
      name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
      property_name: 'كمباوند النرجس ريزيدنس',
      code: 'UNT-Q4HSIB',
      unit_type: 'فيلا',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      bookings: [],
    },
    {
      id: 3,
      name: 'استوديو الكورنيش بإطلالة بحرية',
      property_name: 'أبراج الشاطئ',
      code: 'UNT-103',
      unit_type: 'استوديو',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      bookings: [
        {
          id: 3,
          booking_code: 'BK-261002-03',
          guest_name: 'سلطان القحطاني',
          check_in_date: '2026-10-03',
          check_out_date: '2026-10-06',
          nights_count: 3,
          status: 'confirmed',
          booking_source: 'direct',
        },
      ],
    },
    {
      id: 4,
      name: 'شاليه اليمامة للعائلات',
      property_name: 'منتجع اليمامة',
      code: 'UNT-104',
      unit_type: 'شاليه',
      image: null,
      bookings: [],
    },
    {
      id: 5,
      name: 'شقة العليا 102 - صيانة دورية',
      property_name: 'عمارة العليا 12',
      code: 'UNT-105',
      unit_type: 'شقة',
      image: null,
      bookings: [
        {
          id: 4,
          booking_code: 'BK-261006-197',
          guest_name: 'ahmed',
          check_in_date: '2026-10-06',
          check_out_date: '2026-10-14',
          nights_count: 8,
          status: 'confirmed',
          booking_source: 'direct',
        },
      ],
    },
    {
      id: 2,
      name: 'فيلا النرجس VIP مسبح خاص',
      property_name: 'كمباوند النرجس ريزيدنس',
      code: 'UNT-102',
      unit_type: 'فيلا',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      bookings: [],
    },
    {
      id: 1,
      name: 'شقة الرمال الفاخرة - برج 4',
      property_name: 'أبراج الرمال السكنية',
      code: 'UNT-101',
      unit_type: 'شقة',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      bookings: [
        {
          id: 1,
          booking_code: 'BK-261002-01',
          guest_name: 'فهد السبيعي',
          check_in_date: '2026-10-02',
          check_out_date: '2026-10-05',
          nights_count: 3,
          status: 'confirmed',
          booking_source: 'airbnb',
        },
      ],
    },
  ],
  upcoming_bookings: [],
  platform_distribution: [
    { source: 'airbnb', count: 1, percentage: 25 },
    { source: 'booking', count: 1, percentage: 25 },
    { source: 'direct', count: 2, percentage: 50 },
  ],
};

let localBookingsStore: BookingItem[] = [...fallbackBookings];

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

export async function fetchBookingStats(): Promise<BookingStats> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/bookings/stats`, {
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
    // fallback
  }

  return fallbackStats;
}

export async function fetchBookingCalendar(params?: {
  view_mode?: string;
  date?: string;
  unit_id?: number | string;
}): Promise<CalendarData> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const query = new URLSearchParams();
    if (params?.view_mode) query.set('view_mode', params.view_mode);
    if (params?.date) query.set('date', params.date);
    if (params?.unit_id && params.unit_id !== 'all') query.set('unit_id', String(params.unit_id));

    const endpoints = [
      `${baseUrl}/client/bookings/calendar?${query.toString()}`,
      `${baseUrl}/client/bookings?view=calendar&${query.toString()}`,
    ];

    for (const ep of endpoints) {
      try {
        const response = await fetch(ep, {
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
        // try next
      }
    }
  } catch {
    // fallback
  }

  return fallbackCalendar;
}

export async function fetchBookings(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  channel?: string;
  status?: string;
}): Promise<BookingsListResponse> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', String(params.page));
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.search) query.set('search', params.search);
    if (params?.channel && params.channel !== 'all') query.set('booking_source', params.channel);
    if (params?.status && params.status !== 'all') query.set('status', params.status);

    const response = await fetch(`${baseUrl}/client/bookings?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        if (!params?.search && (!params?.channel || params.channel === 'all') && (!params?.status || params.status === 'all')) {
          localBookingsStore = json.data;
        }
        return {
          data: json.data,
          meta: json.meta || {
            current_page: params?.page || 1,
            last_page: 1,
            per_page: params?.per_page || json.data.length,
            total: json.data.length,
          },
          links: json.links,
        };
      }
    }
  } catch {
    // fallback
  }

  const filtered = localBookingsStore.filter(b => {
    if (params?.search) {
      const q = params.search.toLowerCase();
      const match = `${b.guest.name} ${b.booking_code} ${b.unit.name} ${b.unit.property_name}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (params?.channel && params.channel !== 'all') {
      if (!b.source_sync.booking_source.includes(params.channel) && !b.source_sync.booking_type.includes(params.channel)) {
        return false;
      }
    }
    if (params?.status && params.status !== 'all' && b.status !== params.status) {
      return false;
    }
    return true;
  });

  return {
    data: filtered,
    meta: {
      current_page: params?.page || 1,
      last_page: 1,
      per_page: params?.per_page || 15,
      total: filtered.length,
    },
  };
}

export async function fetchBookingDetail(id: number | string): Promise<BookingItem> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();
  const trimmed = String(id).trim();

  if (/^\d+$/.test(trimmed)) {
    try {
      const response = await fetch(`${baseUrl}/client/bookings/${trimmed}`, {
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
      // fallback
    }
  } else {
    // Resolve booking code (e.g. BK-261002-01) via /client/bookings
    try {
      const list = await fetchBookings();
      const matched = list.data.find(
        (b) =>
          String(b.id) === trimmed ||
          b.booking_code.toLowerCase() === trimmed.toLowerCase()
      );
      if (matched) {
        const detailRes = await fetch(`${baseUrl}/client/bookings/${matched.id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
        });
        if (detailRes.ok) {
          const json = await detailRes.json();
          if (json.success && json.data) {
            return json.data;
          }
        }
        return matched;
      }
    } catch {
      // fallback
    }
  }

  const found = localBookingsStore.find(
    b => String(b.id) === trimmed || b.booking_code.toLowerCase() === trimmed.toLowerCase()
  );
  return found || localBookingsStore[0];
}

export async function createClientBooking(payload: CreateBookingPayload): Promise<BookingItem> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        localBookingsStore.unshift(json.data);
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const newBooking: BookingItem = {
    id: Date.now(),
    booking_code: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    status: 'confirmed',
    guest: {
      name: payload.guest_name,
      phone: payload.guest_phone || '',
      email: payload.guest_email || '',
      adults_count: payload.adults_count,
      children_count: 0,
      total_guests: payload.adults_count,
    },
    unit: {
      id: Number(payload.unit_id) || 1,
      name: `شقة ${payload.unit_id}`,
      property_name: 'برج الأندلس',
      code: `BLD-${payload.unit_id}`,
      unit_type: 'شقة',
      city: { id: 1, name_ar: 'الرياض', name_en: 'Riyadh' },
      area: { id: 1, name_ar: 'النرجس', name_en: 'Al Narjis' },
    },
    stay: {
      check_in_date: payload.check_in_date,
      check_in_date_formatted: payload.check_in_date,
      check_in_time: payload.check_in_time || '03:00 PM',
      check_out_date: payload.check_out_date,
      check_out_date_formatted: payload.check_out_date,
      check_out_time: payload.check_out_time || '11:00 AM',
      nights_count: 3,
    },
    payment: {
      total_amount: String(payload.total_amount || 0),
      paid_amount: payload.payment_status === 'مدفوع' ? String(payload.total_amount || 0) : '0.00',
      remaining_amount: payload.payment_status === 'مدفوع' ? '0.00' : String(payload.total_amount || 0),
      payment_status: payload.payment_status || 'غير مدفوع',
      payment_method: payload.booking_type === 'direct' ? 'مباشر' : payload.booking_type,
    },
    source_sync: {
      booking_type: payload.booking_type || 'direct',
      booking_source: payload.booking_source || 'حجز مباشر: هاتف، واتساب أو موقع',
      sync_status: 'لا توجد مزامنة',
      platform_reference: null,
    },
    automation: {
      block_calendar_dates: Boolean(payload.block_calendar_dates),
      send_welcome_message: Boolean(payload.send_welcome_message),
      auto_clean_on_checkout: Boolean(payload.auto_clean_on_checkout),
      cleaning_task: payload.auto_clean_on_checkout
        ? {
            code: `CLN-${Math.floor(1000 + Math.random() * 9000)}`,
            name: 'تنظيف بعد المغادرة',
            status: 'مجدولة',
          }
        : undefined,
    },
    timeline: [
      {
        id: 1,
        title: 'تم إنشاء الحجز',
        description: `المصدر: ${payload.booking_source || 'حجز مباشر'}`,
        timestamp: 'الآن',
        status: 'completed',
      },
    ],
    notes: payload.notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  localBookingsStore.unshift(newBooking);
  return newBooking;
}

export async function updateClientBooking(
  id: number | string,
  payload: Partial<CreateBookingPayload>
): Promise<BookingItem> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        localBookingsStore = localBookingsStore.map(b => (String(b.id) === String(id) ? json.data : b));
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const existing = await fetchBookingDetail(id);
  const updated: BookingItem = {
    ...existing,
    guest: {
      ...existing.guest,
      name: payload.guest_name ?? existing.guest.name,
      phone: payload.guest_phone ?? existing.guest.phone,
      email: payload.guest_email ?? existing.guest.email,
      adults_count: payload.adults_count ?? existing.guest.adults_count,
    },
    stay: {
      ...existing.stay,
      check_in_date: payload.check_in_date ?? existing.stay.check_in_date,
      check_in_time: payload.check_in_time ?? existing.stay.check_in_time,
      check_out_date: payload.check_out_date ?? existing.stay.check_out_date,
      check_out_time: payload.check_out_time ?? existing.stay.check_out_time,
    },
    payment: {
      ...existing.payment,
      total_amount: payload.total_amount ? String(payload.total_amount) : existing.payment.total_amount,
      payment_status: payload.payment_status ?? existing.payment.payment_status,
    },
    notes: payload.notes ?? existing.notes,
    updated_at: new Date().toISOString(),
  };

  localBookingsStore = localBookingsStore.map(b => (String(b.id) === String(id) ? updated : b));
  return updated;
}

export async function deleteClientBooking(id: number | string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/bookings/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        localBookingsStore = localBookingsStore.filter(b => String(b.id) !== String(id));
        return true;
      }
    }
  } catch {
    // fallback
  }

  localBookingsStore = localBookingsStore.filter(b => String(b.id) !== String(id));
  return true;
}

export async function fetchCities(): Promise<CityInfo[]> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  const endpoints = [`${baseUrl}/client/cities`, `${baseUrl}/cities`];
  for (const ep of endpoints) {
    try {
      const response = await fetch(ep, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch {
      // try next
    }
  }

  return [
    { id: 1, name_ar: 'الرياض', name_en: 'Riyadh' },
    { id: 2, name_ar: 'جدة', name_en: 'Jeddah' },
    { id: 3, name_ar: 'الدمام', name_en: 'Dammam' },
    { id: 4, name_ar: 'الخبر', name_en: 'Khobar' },
    { id: 5, name_ar: 'مكة المكرمة', name_en: 'Makkah' },
    { id: 6, name_ar: 'المدينة المنورة', name_en: 'Madinah' },
  ];
}
