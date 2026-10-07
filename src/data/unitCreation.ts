import type { IntegrationProvider, UnitDraft } from '../types/unitCreation';

export const unitCreationSteps = [
  { id: 1, title: 'طريقة الإضافة', description: 'يدوي أو من منصة متصلة' },
  { id: 2, title: 'بيانات الوحدة', description: 'التعريف والموقع والسعة' },
  { id: 3, title: 'إعدادات الوحدة والمزامنة', description: 'الإقامة والقواعد والمنصات' },
  { id: 4, title: 'المراجعة', description: 'تأكيد البيانات والحفظ' },
] as const;

export const properties = [
  { id: 'palm-tower', name: 'برج النخيل', city: 'الرياض' },
  { id: 'yasmin-tower', name: 'برج الياسمين', city: 'جدة' },
  { id: 'rawda-residence', name: 'مساكن الروضة', city: 'الرياض' },
];

export const integrationProviders: Array<{
  id: IntegrationProvider;
  name: string;
  shortName: string;
  connected: boolean;
  units: number;
  description: string;
}> = [
  { id: 'booking', name: 'Booking.com', shortName: 'B.', connected: true, units: 7, description: 'استيراد بيانات الوحدة والحجوزات' },
  { id: 'airbnb', name: 'Airbnb', shortName: 'A', connected: true, units: 5, description: 'استيراد الإعلان والصور والحجوزات' },
  { id: 'gathern', name: 'Gathern', shortName: 'G', connected: false, units: 0, description: 'لا يوجد تكامل عام موثّق حاليًا' },
];

export const importedListings = [
  { id: 'BKG-983401', provider: 'booking' as const, name: 'شقة عصرية بإطلالة على المدينة', propertyName: 'برج النخيل', propertyId: 'palm-tower', city: 'الرياض', district: 'حي النخيل', address: 'طريق الملك فهد، برج النخيل', type: 'شقة', maxGuests: 4, bedrooms: 2, beds: 3, bathrooms: 2, imageClass: 'u1' },
  { id: 'BKG-983427', provider: 'booking' as const, name: 'استوديو هادئ قريب من البوليفارد', propertyName: 'مساكن الروضة', propertyId: 'rawda-residence', city: 'الرياض', district: 'حي الروضة', address: 'شارع الحسن بن علي', type: 'استوديو', maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1, imageClass: 'u3' },
  { id: 'AIR-77420', provider: 'airbnb' as const, name: 'شقة فاخرة في قلب الياسمين', propertyName: 'برج الياسمين', propertyId: 'yasmin-tower', city: 'جدة', district: 'حي الياسمين', address: 'شارع الأمير سلطان، برج الياسمين', type: 'شقة', maxGuests: 6, bedrooms: 3, beds: 4, bathrooms: 2, imageClass: 'u4' },
  { id: 'AIR-77435', provider: 'airbnb' as const, name: 'وحدة مريحة للعائلات', propertyName: 'برج النخيل', propertyId: 'palm-tower', city: 'الرياض', district: 'حي النخيل', address: 'طريق الملك فهد، برج النخيل', type: 'شقة', maxGuests: 5, bedrooms: 2, beds: 3, bathrooms: 2, imageClass: 'u6' },
];

export const emptyUnitDraft: UnitDraft = {
  schemaVersion: 1,
  source: { mode: 'manual' },
  identity: { name: '', code: '', propertyId: '', propertyName: '', type: 'شقة', status: 'draft', description: '' },
  location: { city: 'الرياض', district: '', address: '' },
  capacity: { maxGuests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
  operations: { managementMode: 'operations-only', checkInTime: '15:00', checkOutTime: '11:00', cleaningDurationMinutes: 120, accessType: 'smart-lock', cleaningTeamId: 'auto', autoCleaningAfterCheckout: false, arrivalReminder: false, notes: '' },
  integrations: [],
  media: { fileNames: [] },
  selectedListingId: '',
  importOptions: { details: true, photos: true, reservations: true },
};
