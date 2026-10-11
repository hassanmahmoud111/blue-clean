import type { UnitCreationPayload } from '../types/unitCreation';
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
  status: 'draft' | 'inactive' | 'ready' | string;
  status_label: string;
  image: string | null;
  city?: { id: number; name_ar: string; name_en: string } | null;
  area?: { id: number; name_ar: string; name_en: string } | null;
  capacity?: {
    guests_count: number;
    bedrooms_count: number;
    beds_count: number;
    bathrooms_count: number;
  };
  check_in_time?: string;
  check_out_time?: string;
  platforms?: {
    connected_platforms?: Array<{
      platform: string;
      is_connected: boolean;
    }>;
  };
}

const storageKey = 'bluclean-created-units';

export async function fetchClientUnits(): Promise<ApiClientUnit[] | null> {
  const res = await apiFetch<ApiClientUnit[]>('/client/units');
  if (res.ok && Array.isArray(res.data)) {
    return res.data;
  }
  return null;
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
