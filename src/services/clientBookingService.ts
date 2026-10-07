import type {
  BookingItem,
  BookingStats,
  BookingsListResponse,
  CalendarData,
  CityInfo,
  CreateBookingPayload,
} from '../types/clientBooking';

const fallbackStats: BookingStats = {
  total_bookings: 1,
  check_ins_this_week: 0,
  check_outs_this_week: 0,
  upcoming_bookings: 0,
};

const fallbackCalendar: CalendarData = {
  calendar_info: {
    view_mode: 'week',
    base_date: '2026-09-10',
    from_date: '2026-09-07',
    to_date: '2026-09-13',
  },
  stats: {
    total_bookings: 1,
    check_ins_this_week: 0,
    check_outs_this_week: 0,
    upcoming_bookings: 0,
  },
  units: [
    {
      id: 1,
      name: 'شقة 801',
      property_name: 'برج الأندلس',
      code: 'BLD-801',
      unit_type: 'شقة',
      image: null,
      bookings: [
        {
          id: 1,
          booking_code: 'RES-2026-6916',
          guest_name: 'عبدالله محمد',
          check_in_date: '2026-09-10',
          check_out_date: '2026-09-13',
          status: 'confirmed',
          booking_source: 'direct',
          color_tone: 'blue',
          start_day_index: 3,
          span_days: 3,
        },
      ],
    },
    {
      id: 2,
      name: 'house 1',
      property_name: 'building 1',
      code: 'UNT-WIFS3P',
      unit_type: 'شقة',
      image: null,
      bookings: [],
    },
  ],
  upcoming_bookings: [],
  platform_distribution: [
    {
      source: 'حجز مباشر: هاتف، واتساب أو موقع',
      count: 1,
      percentage: 100,
    },
  ],
};

const fallbackBookings: BookingItem[] = [
  {
    id: 1,
    booking_code: 'RES-2026-6916',
    status: 'confirmed',
    guest: {
      name: 'عبدالله محمد',
      phone: '+966501234567',
      email: 'guest@example.com',
      adults_count: 2,
      children_count: 0,
      total_guests: 2,
    },
    unit: {
      id: 1,
      name: 'شقة 801',
      property_name: 'برج الأندلس',
      code: 'BLD-801',
      unit_type: 'شقة',
      city: {
        id: 1,
        name_ar: 'الرياض',
        name_en: 'Riyadh',
      },
      area: {
        id: 1,
        name_ar: 'النرجس',
        name_en: 'Al Narjis',
      },
      image: null,
      images: [],
    },
    stay: {
      check_in_date: '2026-09-10',
      check_in_date_formatted: '10 September 2026',
      check_in_time: '03:00 PM',
      check_out_date: '2026-09-13',
      check_out_date_formatted: '13 September 2026',
      check_out_time: '11:00 AM',
      nights_count: 3,
    },
    payment: {
      total_amount: '1860.00',
      paid_amount: '0.00',
      remaining_amount: '1860.00',
      payment_status: 'غير مدفوع',
      payment_method: 'مباشر',
    },
    source_sync: {
      booking_type: 'direct',
      booking_source: 'حجز مباشر: هاتف، واتساب أو موقع',
      sync_status: 'لا توجد مزامنة',
      platform_reference: null,
    },
    automation: {
      block_calendar_dates: true,
      send_welcome_message: true,
      auto_clean_on_checkout: true,
      cleaning_task: {
        code: 'CLN-2280',
        name: 'تنظيف بعد المغادرة',
        status: 'مجدولة',
      },
    },
    timeline: [
      {
        id: 1,
        title: 'تم إنشاء الحجز',
        description: 'المصدر: حجز مباشر: هاتف، واتساب أو موقع',
        timestamp: '30 September 08:27 am',
        status: 'completed',
      },
      {
        id: 2,
        title: 'تم تأكيد توفر الوحدة',
        description: 'لا يوجد تعارض في التقويم',
        timestamp: '30 September 08:28 am',
        status: 'completed',
      },
      {
        id: 3,
        title: 'تم إنشاء مهمة ما بعد المغادرة',
        description: 'مرتبطة بموعد المغادرة الحالي (CLN-2280)',
        timestamp: '30 September 08:29 am',
        status: 'completed',
      },
      {
        id: 4,
        title: 'وصول الضيف',
        description: 'بانتظار موعد تسجيل الدخول (03:00 PM)',
        timestamp: '10 September 2026',
        status: 'completed',
      },
    ],
    scheduled_messages: [
      {
        id: 1,
        title: 'تم إرسال تأكيد الحجز',
        status: 'تم التسليم',
        time_ago: 'منذ يومين',
      },
      {
        id: 2,
        title: 'تعليمات الدخول',
        status: 'مجدولة',
        time_ago: 'مجدولة قبل الوصول',
      },
    ],
    notes: 'ملاحظات الدفع أو تعليمات الوصول',
    created_at: '2026-09-30T08:27:14+00:00',
    updated_at: '2026-09-30T08:27:14+00:00',
  },
];

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

  return {
    total_bookings: localBookingsStore.length,
    check_ins_this_week: 0,
    check_outs_this_week: 0,
    upcoming_bookings: localBookingsStore.length,
  };
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
    if (params?.channel && params.channel !== 'all') query.set('channel', params.channel);
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

  try {
    const response = await fetch(`${baseUrl}/client/bookings/${id}`, {
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

  const found = localBookingsStore.find(
    b => String(b.id) === String(id) || b.booking_code.toLowerCase() === String(id).toLowerCase()
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
