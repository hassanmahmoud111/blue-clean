export type UnitCreationMode = 'manual' | 'import';
export type UnitManagementMode = 'operations-only' | 'channel-sync' | 'hybrid';
export type IntegrationProvider = 'booking' | 'airbnb' | 'gathern';
export type UnitStatus = 'draft' | 'ready' | 'cleaning' | 'maintenance';

export type ExternalUnitReference = {
  provider: IntegrationProvider;
  listingId: string;
  listingName: string;
  syncMode: 'full' | 'reservations';
};

export type UnitCreationPayload = {
  schemaVersion: 1;
  source: {
    mode: UnitCreationMode;
    importedFrom?: IntegrationProvider;
    externalListingId?: string;
  };
  identity: {
    name: string;
    code: string;
    propertyId: string;
    propertyName: string;
    type: string;
    status: UnitStatus;
    description: string;
  };
  location: {
    city: string;
    district: string;
    address: string;
  };
  capacity: {
    maxGuests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  operations: {
    managementMode: UnitManagementMode;
    checkInTime: string;
    checkOutTime: string;
    cleaningDurationMinutes: number;
    accessType: string;
    cleaningTeamId: string;
    autoCleaningAfterCheckout: boolean;
    arrivalReminder: boolean;
    notes: string;
  };
  integrations: ExternalUnitReference[];
  importOptions: {
    details: boolean;
    photos: boolean;
    reservations: boolean;
  };
  media: {
    fileNames: string[];
  };
};

export type UnitDraft = UnitCreationPayload & {
  selectedListingId: string;
};
