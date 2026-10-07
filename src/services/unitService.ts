import type { UnitCreationPayload } from '../types/unitCreation';

export type CreatedUnit = UnitCreationPayload & {
  id: string;
  createdAt: string;
};

const storageKey = 'bluclean-created-units';

export async function createUnit(payload: UnitCreationPayload): Promise<CreatedUnit> {
  await new Promise(resolve => window.setTimeout(resolve, 650));
  const createdUnit: CreatedUnit = {
    ...payload,
    id: `unit_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const current = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]') as CreatedUnit[];
  window.localStorage.setItem(storageKey, JSON.stringify([...current, createdUnit]));
  return createdUnit;
}
