import type { BookingCreationPayload, OperationCreationPayload } from '../types/workflows';
import type { OperationDetailRecord } from '../types/details';
import { apiFetch } from './apiClient';

async function persist<T>(key: string, payload: T) {
  const current = JSON.parse(window.localStorage.getItem(key) ?? '[]') as T[];
  window.localStorage.setItem(key, JSON.stringify([...current, payload]));
}

export async function createBooking(payload: BookingCreationPayload) {
  try {
    await apiFetch('/client/bookings', {
      method: 'POST',
      body: JSON.stringify({
        unit_id: Number(payload.unitId) || 1,
        guest_name: payload.guest.name || 'ضيف جديد',
        guest_phone: payload.guest.phone || '+966501234567',
        guest_email: payload.guest.email || 'guest@example.com',
        check_in_date: payload.stay.checkInDate,
        check_out_date: payload.stay.checkOutDate,
        adults_count: Number(payload.guest.adults) || 2,
        children_count: Number(payload.guest.children) || 0,
        total_amount: Number(payload.pricing.total) || 500,
        booking_source: payload.origin.channel || 'direct',
        notes: payload.notes || '',
      }),
    });
  } catch {
    // Fallback to local storage
  }
  await persist('bluclean-created-bookings', payload);
  return { id: `booking_${Date.now()}`, ...payload };
}

export interface CreatedOperationPayloadWithMeta extends OperationCreationPayload {
  unitName?: string;
  unitCode?: string;
  propertyName?: string;
}

function mapPayloadToDetailRecord(
  payload: CreatedOperationPayloadWithMeta,
  createdId: string,
): OperationDetailRecord {
  const serviceTitle = String(
    payload.details?.serviceType ||
    payload.details?.issueType ||
    payload.details?.cleaningType ||
    (payload.kind === 'cleaning' ? 'تنظيف دوري' : payload.kind === 'maintenance' ? 'صيانة عامة' : 'خدمة إضافية')
  );

  const priorityMap: Record<string, { label: string; tone: string }> = {
    urgent: { label: 'عاجلة', tone: 'red' },
    high: { label: 'عالية', tone: 'orange' },
    medium: { label: 'متوسطة', tone: 'yellow' },
    normal: { label: 'عادية', tone: 'blue' },
  };
  const prio = priorityMap[payload.priority] || { label: 'عادية', tone: 'blue' };

  const sourceLabels: Record<string, string> = {
    reservation: 'حجز متزامن',
    'guest-request': 'طلب ضيف',
    inspection: 'نتيجة فحص',
    manual: 'يدوي',
  };

  const unitName = payload.unitName || `وحدة #${payload.unitId}`;
  const unitCode = payload.unitCode || payload.unitId || 'U-101';
  const property = payload.propertyName || 'البرج السكني';

  return {
    id: createdId,
    kind: payload.kind,
    title: serviceTitle,
    subtitle: String(payload.notes || payload.details?.description || 'طلب تشغيلي جديد'),
    unit: unitName,
    unitCode,
    property,
    imageClass: 'unit-img-1',
    status: 'بانتظار التعيين',
    statusTone: 'orange',
    priority: prio.label,
    priorityTone: prio.tone,
    source: sourceLabels[payload.source?.mode] || 'يدوي',
    schedule: {
      date: payload.schedule?.date || new Date().toISOString().slice(0, 10),
      start: payload.schedule?.startTime || '11:00',
      due: payload.schedule?.dueTime || '13:00',
      duration: 'ساعتان',
    },
    assignee: {
      name: payload.assignment?.mode === 'auto' ? 'تعيين تلقائي' : 'غير معيّن',
      type: 'طاقم داخلي',
      phone: '+966 50 123 4567',
    },
    description: String(payload.details?.description || payload.notes || ''),
    checklist: Array.isArray(payload.details?.checklist)
      ? payload.details.checklist.map((c: any) => ({
          title: typeof c === 'string' ? c : c.title || '',
          done: false,
        }))
      : [],
    costs: payload.details?.cost
      ? [{ label: 'التكلفة التقديرية', value: `${payload.details.cost} ر.س` }]
      : [{ label: 'تكلفة الخدمة', value: '150 ر.س' }],
    attachments: (payload.attachments?.fileNames || []).map((name) => ({ name, type: 'image' })),
    timeline: [
      {
        title: 'تم إنشاء الطلب',
        detail: 'تم حفظ وتأكيد الطلب بنجاح',
        time: 'الآن',
        done: true,
      },
    ],
  };
}

export async function createOperation(payload: CreatedOperationPayloadWithMeta) {
  const endpoint =
    payload.kind === 'cleaning'
      ? '/client/cleaning-orders'
      : payload.kind === 'maintenance'
        ? '/client/maintenance-orders'
        : '/client/extra-services';

  const serviceTitle = String(
    payload.details?.serviceType ||
    payload.details?.issueType ||
    payload.details?.cleaningType ||
    (payload.kind === 'cleaning' ? 'تنظيف دوري' : payload.kind === 'maintenance' ? 'صيانة عامة' : 'خدمة إضافية')
  );

  let backendOrder: any = null;

  try {
    const unitIdNum = Number(payload.unitId);
    const validUnitId = (!isNaN(unitIdNum) && unitIdNum > 0) ? unitIdNum : 1;

    let requestBody: any = {};
    if (payload.kind === 'cleaning') {
      requestBody = {
        order_source_type: payload.source?.mode === 'reservation' ? 'after_checkout' : 'manual',
        unit_id: validUnitId,
        service_type: serviceTitle,
        instructions: payload.details?.description || payload.notes || serviceTitle,
        execution_scope: [
          'bedrooms',
          'bathrooms',
          'kitchen',
          'floors',
          'furnishings',
          'supplies_check',
        ],
        execution_date: payload.schedule?.date || new Date().toISOString().slice(0, 10),
        start_time: payload.schedule?.startTime || '11:00 AM',
        end_time: payload.schedule?.dueTime || '01:00 PM',
        priority: payload.priority || 'normal',
        assignment_method: payload.assignment?.mode || 'auto',
        notify_worker: payload.notifications?.assignee ?? true,
        notify_supervisor: payload.notifications?.manager ?? true,
        notify_guest: payload.notifications?.guest ?? false,
        internal_notes: payload.notes || '',
      };
      if (payload.source?.reservationId) {
        requestBody.booking_id = Number(payload.source.reservationId) || 1;
      }
    } else if (payload.kind === 'maintenance') {
      requestBody = {
        order_source_type: payload.source?.mode === 'guest-request' ? 'guest_report' : payload.source?.mode === 'inspection' ? 'inspection' : 'manual',
        unit_id: validUnitId,
        issue_category: serviceTitle,
        description: payload.details?.description || payload.notes || serviceTitle,
        allow_entry: true,
        block_unit_temporarily: false,
        require_technical_report: false,
        execution_date: payload.schedule?.date || new Date().toISOString().slice(0, 10),
        start_time: payload.schedule?.startTime || '02:00 PM',
        end_time: payload.schedule?.dueTime || '04:00 PM',
        priority: payload.priority || 'normal',
        assignment_method: payload.assignment?.mode || 'auto',
        notify_worker: payload.notifications?.assignee ?? true,
        notify_supervisor: payload.notifications?.manager ?? true,
        notify_guest: payload.notifications?.guest ?? false,
        internal_notes: payload.notes || '',
      };
    } else {
      requestBody = {
        order_source_type: payload.source?.mode === 'guest-request' ? 'guest_request' : 'internal_request',
        unit_id: validUnitId,
        service_type: serviceTitle,
        quantity: Number(payload.details?.quantity) || 1,
        estimated_cost: Number(payload.details?.cost) || 150.0,
        instructions: payload.details?.description || payload.notes || serviceTitle,
        add_cost_to_booking: false,
        send_confirmation_to_guest: false,
        require_manager_approval: false,
        execution_date: payload.schedule?.date || new Date().toISOString().slice(0, 10),
        start_time: payload.schedule?.startTime || '09:00 AM',
        end_time: payload.schedule?.dueTime || '11:00 AM',
        priority: payload.priority || 'normal',
        assignment_method: payload.assignment?.mode || 'auto',
        notify_worker: payload.notifications?.assignee ?? true,
        notify_supervisor: payload.notifications?.manager ?? true,
        notify_guest: payload.notifications?.guest ?? false,
        internal_notes: payload.notes || '',
      };
    }

    const res = await apiFetch<any>(endpoint, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    if (res.ok && res.data) {
      backendOrder = res.data.order || res.data;
    }
  } catch {
    // Fallback to local storage persistence
  }

  const prefix = payload.kind === 'cleaning' ? 'CLN' : payload.kind === 'maintenance' ? 'MNT' : 'SRV';
  const createdId =
    backendOrder?.order_code ||
    backendOrder?.code ||
    (backendOrder?.id ? `${prefix}-${backendOrder.id}` : null) ||
    `${prefix}-${Date.now().toString().slice(-6)}`;

  const detailRecord = mapPayloadToDetailRecord(payload, createdId);

  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean-created-operations') : null;
    const currentSaved: OperationDetailRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = currentSaved.filter((item) => item.id !== createdId);
    window.localStorage.setItem('bluclean-created-operations', JSON.stringify([detailRecord, ...filtered]));
  } catch {}

  return { id: createdId, ...payload };
}

export interface OperationStatsData {
  pending_assignment?: number;
  in_progress?: number;
  in_review?: number;
  completed?: number;
  total?: number;
  [key: string]: any;
}

function extractItemsArray(data: any, raw: any): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.orders)) return data.orders;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.records)) return data.records;
  }
  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.data)) return raw.data;
    if (raw.data && typeof raw.data === 'object' && Array.isArray(raw.data.data)) return raw.data.data;
    if (Array.isArray(raw.orders)) return raw.orders;
  }
  return [];
}

function mapApiOrderToDetail(item: any, kind: 'cleaning' | 'maintenance' | 'service'): OperationDetailRecord {
  const statusStr = String(item.status_label || item.status || 'بانتظار التعيين');
  const priorityStr = String(item.priority_label || item.priority || 'عادية');

  const statusTone: OperationDetailRecord['statusTone'] =
    statusStr.includes('مكتمل') || statusStr.toLowerCase() === 'completed'
      ? 'green'
      : statusStr.includes('قيد التنفيذ') || statusStr.toLowerCase() === 'in_progress'
        ? 'blue'
        : statusStr.includes('مراجعة') || statusStr.toLowerCase() === 'in_review'
          ? 'yellow'
          : 'orange';

  const priorityTone: OperationDetailRecord['priorityTone'] =
    priorityStr.includes('عاجل') || priorityStr.toLowerCase() === 'urgent'
      ? 'red'
      : priorityStr.includes('عالي') || priorityStr.toLowerCase() === 'high'
        ? 'orange'
        : priorityStr.includes('متوسط') || priorityStr.toLowerCase() === 'medium'
          ? 'yellow'
          : 'blue';

  const unitName =
    item.unit?.name ||
    item.unit_name ||
    (typeof item.unit === 'string' ? item.unit : '') ||
    'الوحدة';

  const propertyName =
    item.unit?.property_name ||
    item.unit?.property ||
    item.property_name ||
    'العقار';

  const unitCode =
    item.unit?.code ||
    item.unit_code ||
    (item.unit_id ? `UNT-${item.unit_id}` : 'UNT-101');

  const id =
    item.order_code ||
    item.code ||
    (item.id ? `${kind === 'cleaning' ? 'CLN' : kind === 'maintenance' ? 'MNT' : 'SRV'}-${item.id}` : `OP-${Date.now()}`);

  const title =
    item.title ||
    item.service_type ||
    item.service_name ||
    item.issue_category ||
    item.issue_type_label ||
    (kind === 'cleaning' ? 'طلب تنظيف' : kind === 'maintenance' ? 'طلب صيانة' : 'خدمة إضافية');

  const source =
    item.order_source_label ||
    item.order_source_type ||
    item.source ||
    'طلب داخلي';

  const workerName = item.worker?.name || item.assignee?.name || item.worker_name || 'غير معيّن';
  const workerPhone = item.worker?.phone || item.assignee?.phone || item.worker_phone || '';

  const scheduleDate =
    item.schedule?.execution_date_formatted ||
    item.schedule?.execution_date ||
    item.execution_date ||
    '—';

  const scheduleStart =
    item.schedule?.start_time ||
    item.start_time ||
    '—';

  const scheduleDue =
    item.schedule?.end_time ||
    item.end_time ||
    '—';

  const duration =
    item.execution?.duration_formatted ||
    item.duration ||
    'ساعتان';

  return {
    id,
    kind,
    title,
    subtitle:
      item.subtitle ||
      (kind === 'cleaning'
        ? 'طلب تنظيف وتجهيز الوحدة'
        : kind === 'maintenance'
          ? 'طلب صيانة وإصلاح'
          : 'طلب خدمة ومتابعة تنفيذ'),
    source,
    unit: unitName,
    property: propertyName,
    unitCode,
    imageClass: 'u1',
    status: statusStr,
    statusTone,
    priority: priorityStr,
    priorityTone,
    assignee: {
      name: workerName,
      type: 'مزود خدمة معتمد',
      phone: workerPhone,
    },
    schedule: {
      date: scheduleDate,
      start: scheduleStart,
      due: scheduleDue,
      duration,
    },
    description: item.instructions || item.description || item.internal_notes || '',
    checklist: Array.isArray(item.checklist)
      ? item.checklist.map((c: any) => ({
          title: typeof c === 'string' ? c : c.title || c.name || '',
          done: typeof c === 'string' ? false : Boolean(c.done ?? c.is_completed),
        }))
      : [],
    costs: Array.isArray(item.costs)
      ? item.costs
      : item.estimated_cost
        ? [{ label: 'التكلفة التقديرية', value: `${item.estimated_cost} ر.س` }]
        : [],
    attachments: Array.isArray(item.attachments) ? item.attachments : [],
    timeline: Array.isArray(item.timeline) ? item.timeline : [],
    linkedBooking: item.booking
      ? {
          id: item.booking.booking_code || String(item.booking.id),
          guest: item.booking.guest_name || 'الضيف',
          checkout: item.booking.check_out_date || '—',
          channel: item.booking.booking_source || 'direct',
        }
      : undefined,
  };
}

export async function fetchClientOperations(
  kind: 'cleaning' | 'maintenance' | 'service',
): Promise<OperationDetailRecord[]> {
  const endpoint =
    kind === 'cleaning'
      ? '/client/cleaning-orders'
      : kind === 'maintenance'
        ? '/client/maintenance-orders'
        : '/client/extra-services';

  let remoteItems: OperationDetailRecord[] = [];
  try {
    const res = await apiFetch<any>(endpoint);
    if (res.ok) {
      const items = extractItemsArray(res.data, res.raw);
      remoteItems = items.map(item => mapApiOrderToDetail(item, kind));
    }
  } catch {
    // fallback
  }

  // Read locally created operations from localStorage
  let localItems: OperationDetailRecord[] = [];
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean-created-operations') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localItems = parsed.filter(item => item && item.kind === kind);
      }
    }
  } catch {}

  // Merge unique by ID
  const remoteIds = new Set(remoteItems.map(r => r.id));
  const uniqueLocal = localItems.filter(l => !remoteIds.has(l.id));

  return [...uniqueLocal, ...remoteItems];
}

export async function fetchClientOperationStats(
  kind: 'cleaning' | 'maintenance' | 'service',
): Promise<OperationStatsData | null> {
  const endpoint =
    kind === 'cleaning'
      ? '/client/cleaning-orders/stats'
      : kind === 'maintenance'
        ? '/client/maintenance-orders/stats'
        : '/client/extra-services/stats';

  let stats: OperationStatsData = {
    pending_assignment: 0,
    in_progress: 0,
    in_review: 0,
    completed: 0,
    total: 0,
  };

  try {
    const res = await apiFetch<any>(endpoint);
    if (res.ok && res.data) {
      stats = { ...stats, ...res.data };
    }
  } catch {
    // fallback
  }

  // Count local items
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean-created-operations') : null;
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const localItems = parsed.filter(item => item && item.kind === kind);
        for (const item of localItems) {
          const s = item.status;
          if (s === 'بانتظار التعيين' || s === 'pending_assignment') stats.pending_assignment = (stats.pending_assignment || 0) + 1;
          else if (s === 'قيد التنفيذ' || s === 'in_progress') stats.in_progress = (stats.in_progress || 0) + 1;
          else if (s === 'قيد المراجعة' || s === 'in_review') stats.in_review = (stats.in_review || 0) + 1;
          else if (s === 'مكتملة' || s === 'completed') stats.completed = (stats.completed || 0) + 1;
          stats.total = (stats.total || 0) + 1;
        }
      }
    }
  } catch {}

  return stats;
}

export async function fetchClientOperationDetail(
  idOrCode: string,
  kindHint?: 'cleaning' | 'maintenance' | 'service',
): Promise<OperationDetailRecord | null> {
  const kinds: Array<'cleaning' | 'maintenance' | 'service'> = kindHint
    ? [kindHint]
    : idOrCode.startsWith('CLN')
      ? ['cleaning']
      : idOrCode.startsWith('MNT')
        ? ['maintenance']
        : idOrCode.startsWith('SRV') || idOrCode.startsWith('EXT')
          ? ['service']
          : ['cleaning', 'maintenance', 'service'];

  for (const k of kinds) {
    const endpoint =
      k === 'cleaning'
        ? '/client/cleaning-orders'
        : k === 'maintenance'
          ? '/client/maintenance-orders'
          : '/client/extra-services';

    try {
      const direct = await apiFetch<any>(`${endpoint}/${idOrCode}`);
      if (direct.ok && direct.data) {
        return mapApiOrderToDetail(direct.data, k);
      }
    } catch {
      // ignore
    }

    try {
      const list = await fetchClientOperations(k);
      if (list && list.length > 0) {
        const found = list.find(item => item.id === idOrCode || item.id.includes(idOrCode));
        if (found) return found;
      }
    } catch {
      // ignore
    }
  }

  return null;
}
