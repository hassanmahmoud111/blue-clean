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

export async function createOperation(payload: OperationCreationPayload) {
  const endpoint =
    payload.kind === 'cleaning'
      ? '/client/cleaning-orders'
      : payload.kind === 'maintenance'
        ? '/client/maintenance-orders'
        : '/client/extra-services';

  const serviceTitle = String(payload.details?.serviceType || payload.details?.issueType || payload.details?.cleaningType || 'طلب تشغيل');

  try {
    await apiFetch(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        unit_id: Number(payload.unitId) || 1,
        title: serviceTitle,
        service_type: serviceTitle,
        priority: payload.priority || 'normal',
        execution_date: payload.schedule.date || new Date().toISOString().slice(0, 10),
        start_time: payload.schedule.startTime || '14:00',
        end_time: payload.schedule.dueTime || '16:00',
        instructions: payload.notes || '',
      }),
    });
  } catch {
    // Fallback to local storage
  }
  await persist('bluclean-created-operations', payload);
  return { id: `operation_${Date.now()}`, ...payload };
}

export async function fetchClientOperations(
  kind: 'cleaning' | 'maintenance' | 'service',
): Promise<OperationDetailRecord[] | null> {
  const endpoint =
    kind === 'cleaning'
      ? '/client/cleaning-orders'
      : kind === 'maintenance'
        ? '/client/maintenance-orders'
        : '/client/extra-services';

  const res = await apiFetch<any[]>(endpoint);
  if (res.ok && Array.isArray(res.data)) {
    return res.data.map((item) => {
      const statusLabel = item.status_label || item.status || 'بانتظار التعيين';
      const priorityLabel = item.priority_label || item.priority || 'عادية';
      const statusTone: OperationDetailRecord['statusTone'] =
        statusLabel.includes('مكتمل')
          ? 'green'
          : statusLabel.includes('قيد التنفيذ')
            ? 'blue'
            : 'orange';
      const priorityTone: OperationDetailRecord['priorityTone'] =
        priorityLabel.includes('عاجل') || priorityLabel.includes('عالي')
          ? 'red'
          : priorityLabel.includes('متوسط')
            ? 'yellow'
            : 'blue';

      return {
        id: item.order_code || String(item.id),
        kind,
        title: item.title || item.service_name || item.issue_type_label || 'طلب تشغيل',
        subtitle: 'طلب تشغيل ومتابعة تنفيذ',
        source: item.order_source_label || item.order_source_type || 'طلب داخلي',
        unit: item.unit?.name || 'شقة الرمال الفاخرة - برج 4',
        property: item.unit?.property_name || 'أبراج الرمال السكنية',
        unitCode: item.unit?.code || 'UNT-101',
        imageClass: 'u1',
        status: statusLabel,
        statusTone,
        priority: priorityLabel,
        priorityTone,
        assignee: {
          name: item.worker?.name || 'غير معيّن',
          type: 'مزود خدمة معتمد',
          phone: item.worker?.phone || '+966 50 123 4567',
        },
        schedule: {
          date: item.schedule?.execution_date_formatted || item.schedule?.execution_date || '7 أكتوبر 2026',
          start: item.schedule?.start_time || '14:00',
          due: item.schedule?.end_time || '16:00',
          duration: item.execution?.duration_formatted || 'ساعتان',
        },
        description: item.instructions || item.description || item.title || '',
        checklist: [],
        costs: [],
        attachments: [],
        timeline: [],
      };
    });
  }
  return null;
}
