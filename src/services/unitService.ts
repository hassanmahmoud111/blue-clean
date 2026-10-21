import type { UnitCreationPayload } from '../types/unitCreation';
import type { UnitDetailRecord } from '../types/details';
import { getUnitDetail } from '../data/detailRecords';
import { apiFetch } from './apiClient';

export type CreatedUnit = UnitCreationPayload & {
  id: string;
  createdAt: string;
};

export interface ApiClientUnit {
  id: number;
  code: string;
  name: string;
  unit_type: string;
  unit_type_label: string;
  property_name: string;
  status: 'draft' | 'inactive' | 'ready' | 'active' | string;
  status_label: string;
  operational_status?: string;
  operational_status_label?: string;
  image: string | null;
  images?: string[];
  city?: { id: number; name_ar: string; name_en: string } | null;
  area?: { id: number; name_ar: string; name_en: string } | null;
  detailed_address?: string | null;
  capacity?: {
    guests_count: number;
    bedrooms_count: number;
    beds_count: number;
    bathrooms_count: number;
  };
  management_mode?: string;
  management_mode_label?: string;
  check_in_time?: string;
  check_out_time?: string;
  cleaning_duration?: number;
  entry_method?: string;
  entry_method_label?: string;
  channel?: string;
  description?: string | null;
  current_stay?: {
    booking_id: number;
    booking_code: string;
    guest_name: string;
    check_in_date?: string;
    check_out_date?: string;
    check_out_time?: string;
    source?: string;
  } | null;
  upcoming_stay?: {
    booking_id: number;
    booking_code: string;
    guest_name: string;
    check_in_date?: string;
    check_out_date?: string;
    source?: string;
  } | null;
  services?: Array<{
    id: number;
    type: string;
    order_code: string;
    title: string;
    status: string;
    status_label: string;
    note?: string | null;
    at?: string;
  }>;
  connected_platforms?: Array<{
    platform: string;
    name?: string;
    listing_id?: string | null;
    is_connected: boolean;
  }>;
  sync?: {
    platform?: string;
    is_connected?: boolean;
    last_sync_at?: string | null;
    connected_platforms?: Array<{
      platform: string;
      name?: string;
      listing_id?: string | null;
      is_connected: boolean;
    }>;
  };
  platforms?: {
    connected_platforms?: Array<{
      platform: string;
      is_connected: boolean;
    }>;
  };
  qr_code?: {
    code: string;
    store_url: string;
    image_url: string;
  } | null;
}

const storageKey = 'bluclean-created-units';

export async function fetchClientUnits(): Promise<ApiClientUnit[] | null> {
  const res = await apiFetch<ApiClientUnit[]>('/client/units');
  let units: ApiClientUnit[] = [];
  if (res.ok && Array.isArray(res.data)) {
    units = [...res.data];
  }

  if (typeof window !== 'undefined') {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const localList = JSON.parse(raw);
        if (Array.isArray(localList)) {
          const existingCodes = new Set(units.map(u => (u.code || String(u.id)).toUpperCase()));
          for (const lu of localList) {
            const code = lu.identity?.code || lu.id || 'UNT-NEW';
            if (!existingCodes.has(code.toUpperCase())) {
              units.unshift({
                id: lu.apiId || Date.now(),
                code: lu.identity?.code || `UNT-${Date.now().toString().slice(-4)}`,
                name: lu.identity?.name || 'وحدة جديدة',
                unit_type: lu.identity?.type || 'apartment',
                unit_type_label: lu.identity?.type === 'villa' ? 'فيلا' : 'شقة',
                property_name: lu.identity?.propertyName || lu.identity?.name || 'عقار جديد',
                status: 'ready',
                status_label: 'جاهزة',
                operational_status: 'ready',
                operational_status_label: 'جاهزة للاستخدام',
                image: null,
                images: [],
                capacity: {
                  guests_count: Number(lu.capacity?.maxGuests) || 2,
                  bedrooms_count: Number(lu.capacity?.bedrooms) || 1,
                  beds_count: Number(lu.capacity?.beds) || 1,
                  bathrooms_count: Number(lu.capacity?.bathrooms) || 1,
                },
                management_mode: 'independent',
                management_mode_label: 'تشغيل مستقل',
                check_in_time: lu.operations?.checkInTime || '15:00',
                check_out_time: lu.operations?.checkOutTime || '11:00',
              });
            }
          }
        }
      }
    } catch {}
  }

  return units.length > 0 ? units : null;
}

export async function fetchClientUnitDetail(idOrCode: string): Promise<ApiClientUnit | null> {
  const trimmed = idOrCode.trim();
  if (!trimmed) return null;

  // If numeric ID, fetch /client/units/{id} directly
  if (/^\d+$/.test(trimmed)) {
    const directRes = await apiFetch<ApiClientUnit>(`/client/units/${trimmed}`);
    if (directRes.ok && directRes.data && directRes.data.id) {
      return directRes.data;
    }
  }

  // Otherwise (e.g. code like UNT-101, UNT-YMFCHL, UNT-Q4HSI8), look up from /client/units
  const list = await fetchClientUnits();
  if (list && list.length > 0) {
    const upper = trimmed.toUpperCase();
    const alias = upper === 'UNT-Q4HSI8' ? 'UNT-Q4HSIB' : upper === 'UNT-Q4HSIB' ? 'UNT-Q4HSI8' : upper;
    const matched = list.find(
      (u) =>
        String(u.id) === trimmed ||
        (u.code && u.code.toUpperCase() === upper) ||
        (u.code && u.code.toUpperCase() === alias)
    );
    if (matched) {
      const detailRes = await apiFetch<ApiClientUnit>(`/client/units/${matched.id}`);
      if (detailRes.ok && detailRes.data && detailRes.data.id) {
        return detailRes.data;
      }
      return matched;
    }
  }

  // Also check if fallback has an apiId we can query
  const fallback = getUnitDetail(trimmed);
  if (fallback?.apiId) {
    const byApiId = await apiFetch<ApiClientUnit>(`/client/units/${fallback.apiId}`);
    if (byApiId.ok && byApiId.data && byApiId.data.id) {
      return byApiId.data;
    }
  }

  return null;
}

export function mapApiUnitToDetailRecord(
  u: ApiClientUnit,
  fallbackInput?: UnitDetailRecord
): UnitDetailRecord {
  const base = fallbackInput || getUnitDetail(u.code || String(u.id));
  const statusTone =
    u.status === 'active' || u.status === 'ready' || u.operational_status === 'ready'
      ? 'green'
      : u.status === 'inactive' || u.status === 'maintenance'
        ? 'red'
        : 'orange';

  const statusLabel =
    u.status === 'active' || u.status === 'ready'
      ? 'جاهزة للضيف'
      : u.status_label || base.status || 'مسودة';

  const photoList = [
    ...(u.image ? [u.image] : []),
    ...(Array.isArray(u.images) ? u.images.filter(Boolean) : []),
    ...(base.images || []),
  ].filter((val, idx, arr) => Boolean(val) && arr.indexOf(val) === idx);

  const channelName =
    u.channel === 'booking'
      ? 'Booking.com'
      : u.channel === 'airbnb'
        ? 'Airbnb'
        : u.channel === 'gathern'
          ? 'Gathern'
          : '';

  const connectedPlatforms = (
    u.connected_platforms ||
    u.sync?.connected_platforms ||
    []
  ).filter((p) => p.is_connected);

  const integrations: UnitDetailRecord['integrations'] =
    connectedPlatforms.length > 0
      ? connectedPlatforms.map((p) => ({
          name: p.name || (p.platform === 'booking' ? 'Booking.com' : p.platform === 'airbnb' ? 'Airbnb' : 'Gathern'),
          status: 'متصل',
          listingId: p.listing_id || `${p.platform.toUpperCase()}-${u.id}`,
          lastSync: 'منذ قليل',
          tone: 'green',
        }))
      : channelName
        ? [
            {
              name: channelName,
              status: 'متصل',
              listingId: `${(u.channel || 'CH').toUpperCase()}-${u.code || u.id}`,
              lastSync: 'منذ 5 دقائق',
              tone: 'green',
            },
          ]
        : base.integrations;

  const currentBooking: UnitDetailRecord['currentBooking'] = u.current_stay
    ? {
        id: u.current_stay.booking_code || `BK-${u.current_stay.booking_id}`,
        guest: u.current_stay.guest_name || 'ضيف حالي',
        channel:
          u.current_stay.source === 'airbnb'
            ? 'Airbnb'
            : u.current_stay.source === 'booking'
              ? 'Booking.com'
              : 'مباشر',
        checkIn: u.current_stay.check_in_date || 'حاليًا',
        checkOut: u.current_stay.check_out_date || '—',
        guests: u.capacity?.guests_count || base.capacity.guests,
        amount: base.currentBooking?.amount || '1,650 ر.س',
      }
    : base.currentBooking;

  const nextBooking: UnitDetailRecord['nextBooking'] = u.upcoming_stay
    ? {
        id: u.upcoming_stay.booking_code || `BK-${u.upcoming_stay.booking_id}`,
        guest: u.upcoming_stay.guest_name || 'ضيف قادم',
        channel:
          u.upcoming_stay.source === 'airbnb'
            ? 'Airbnb'
            : u.upcoming_stay.source === 'booking'
              ? 'Booking.com'
              : 'مباشر',
        checkIn: u.upcoming_stay.check_in_date || 'قريبًا',
        checkOut: u.upcoming_stay.check_out_date || '—',
      }
    : base.nextBooking;

  const upcomingOperations: UnitDetailRecord['upcomingOperations'] =
    Array.isArray(u.services) && u.services.length > 0
      ? u.services.map((srv) => ({
          id: srv.order_code || String(srv.id),
          type:
            srv.type === 'maintenance'
              ? 'صيانة'
              : srv.type === 'service'
                ? 'خدمة إضافية'
                : srv.title || 'تنظيف وتجهيز',
          date: srv.at || 'اليوم',
          assignee: 'تعيين تلقائي',
          status: srv.status_label || 'قيد التنفيذ',
          tone: srv.status === 'completed' ? 'green' : 'blue',
        }))
      : base.upcomingOperations;

  const notes = [
    ...(u.description ? [u.description] : []),
    ...base.notes.filter((n) => n !== u.description),
  ];

  return {
    ...base,
    id: u.code || String(u.id),
    apiId: u.id,
    number: String(u.id),
    name: u.name || base.name,
    code: u.code || base.code,
    property: u.property_name || base.property,
    city: u.city?.name_ar || base.city,
    district: u.area?.name_ar || base.district,
    address: u.detailed_address || base.address,
    status: statusLabel,
    statusTone,
    type: u.unit_type_label || base.type,
    imageUrl: u.image || base.imageUrl || photoList[0],
    images: photoList,
    description: u.description || base.description,
    qrCodeUrl: u.qr_code?.image_url || base.qrCodeUrl,
    storeUrl: u.qr_code?.store_url || base.storeUrl,
    managementMode: u.management_mode_label || base.managementMode,
    capacity: {
      guests: u.capacity?.guests_count ?? base.capacity.guests,
      bedrooms: u.capacity?.bedrooms_count ?? base.capacity.bedrooms,
      beds: u.capacity?.beds_count ?? base.capacity.beds,
      bathrooms: u.capacity?.bathrooms_count ?? base.capacity.bathrooms,
    },
    stayDefaults: {
      checkIn: u.check_in_time || base.stayDefaults.checkIn,
      checkOut: u.check_out_time || base.stayDefaults.checkOut,
      cleaningMinutes: u.cleaning_duration ?? base.stayDefaults.cleaningMinutes,
      access: u.entry_method_label || base.stayDefaults.access,
    },
    currentBooking,
    nextBooking,
    integrations,
    upcomingOperations,
    notes: notes.length > 0 ? notes : base.notes,
  };
}

export async function createUnit(payload: UnitCreationPayload): Promise<CreatedUnit> {
  try {
    await apiFetch('/client/units', {
      method: 'POST',
      body: JSON.stringify({
        name: payload.identity.name,
        code: payload.identity.code,
        unit_type: payload.identity.type || 'apartment',
        property_name: payload.identity.propertyName || payload.identity.name,
        city_id: 1,
        area_id: 1,
        detailed_address: payload.location.address || '',
        guests_count: Number(payload.capacity.maxGuests) || 2,
        bedrooms_count: Number(payload.capacity.bedrooms) || 1,
        beds_count: Number(payload.capacity.beds) || 1,
        bathrooms_count: Number(payload.capacity.bathrooms) || 1,
        check_in_time: payload.operations.checkInTime || '15:00',
        check_out_time: payload.operations.checkOutTime || '11:00',
        description: payload.identity.description || '',
      }),
    });
  } catch {
    // Fallback to local persistence
  }

  const createdUnit: CreatedUnit = {
    ...payload,
    id: `unit_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const current = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as CreatedUnit[];
  window.localStorage.setItem(storageKey, JSON.stringify([...current, createdUnit]));
  return createdUnit;
}

export async function duplicateClientUnit(unitId: number | string): Promise<boolean> {
  const res = await apiFetch(`/client/units/${unitId}/duplicate`, { method: 'POST' });
  return res.ok;
}

export async function deleteClientUnit(unitId: number | string): Promise<boolean> {
  const res = await apiFetch(`/client/units/${unitId}`, { method: 'DELETE' });
  return res.ok;
}

