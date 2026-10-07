import type { BookingCreationPayload, OperationCreationPayload } from '../types/workflows';

async function persist<T>(key: string, payload: T) {
  await new Promise(resolve => window.setTimeout(resolve, 650));
  const current = JSON.parse(window.localStorage.getItem(key) ?? '[]') as T[];
  window.localStorage.setItem(key, JSON.stringify([...current, payload]));
}

export async function createBooking(payload: BookingCreationPayload) {
  await persist('bluclean-created-bookings', payload);
  return { id: `booking_${Date.now()}`, ...payload };
}

export async function createOperation(payload: OperationCreationPayload) {
  await persist('bluclean-created-operations', payload);
  return { id: `operation_${Date.now()}`, ...payload };
}
