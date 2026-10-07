export type BookingChannel = 'direct' | 'booking' | 'airbnb' | 'gathern';
export type BookingCreationMode = 'manual' | 'sync';

export type BookingCreationPayload = {
  schemaVersion: 1;
  idempotencyKey: string;
  origin: {
    mode: BookingCreationMode;
    channel: BookingChannel;
    externalReservationId?: string;
    syncEventId?: string;
  };
  unitId: string;
  guest: { name: string; phone: string; email: string; adults: number; children: number };
  stay: { checkInDate: string; checkInTime: string; checkOutDate: string; checkOutTime: string };
  pricing: { currency: 'SAR'; total: number; paymentStatus: 'unpaid' | 'partial' | 'paid' | 'platform' };
  automation: { createCleaningTask: boolean; sendWelcomeMessage: boolean; blockCalendar: boolean };
  notes: string;
};

export type OperationKind = 'cleaning' | 'maintenance' | 'service';
export type OperationSource = 'manual' | 'reservation' | 'guest-request' | 'inspection';

export type OperationCreationPayload = {
  schemaVersion: 1;
  idempotencyKey: string;
  kind: OperationKind;
  source: {
    mode: OperationSource;
    reservationId?: string;
    externalEventId?: string;
  };
  unitId: string;
  schedule: { date: string; startTime: string; dueTime: string };
  assignment: { mode: 'auto' | 'manual'; assigneeId?: string };
  priority: 'normal' | 'medium' | 'high' | 'urgent';
  details: Record<string, string | number | boolean | string[]>;
  notifications: { assignee: boolean; manager: boolean; guest: boolean };
  attachments: { fileNames: string[] };
  notes: string;
};
