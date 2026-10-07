import type { OperationTask, Reservation, Unit } from '../types';

export const metrics = [
  { label: 'إجمالي الوحدات', value: '12', note: '+2 هذا الشهر', icon: 'Building2', tone: 'brand' },
  { label: 'الوحدات المشغولة', value: '8', note: 'نسبة إشغال 67%', icon: 'BedDouble', tone: 'info' },
  { label: 'المغادرات اليوم', value: '3', note: 'تمت مغادرة واحدة', icon: 'LogOut', tone: 'warning' },
  { label: 'الوصول اليوم', value: '4', note: 'أقرب وصول 2:00 م', icon: 'LogIn', tone: 'success' },
] as const;

export const timeline = [
  { time: '09:30 ص', title: 'مغادرة ضيف', detail: 'شقة 102 – برج النخيل', meta: 'Airbnb', tone: 'warning' },
  { time: '10:00 ص', title: 'بدء التنظيف', detail: 'شقة 102 – برج النخيل', meta: 'العامل: أحمد سالم', tone: 'info' },
  { time: '12:30 م', title: 'الوحدة جاهزة', detail: 'شقة 205 – مساكن الروضة', meta: 'تم الفحص', tone: 'success' },
  { time: '02:00 م', title: 'وصول ضيف', detail: 'شقة 102 – برج النخيل', meta: 'Booking.com', tone: 'brand' },
  { time: '04:30 م', title: 'وصول ضيف', detail: 'شقة 304 – برج الياسمين', meta: 'جاذر', tone: 'brand' },
] as const;

export const attentionUnits = [
  { unit: 'شقة 304', property: 'برج الياسمين', status: 'بانتظار التنظيف', note: 'متبقي ساعتان على دخول الضيف', tone: 'danger' },
  { unit: 'شقة 203', property: 'مساكن النخيل', status: 'صيانة', note: 'بلاغ مفتوح بخصوص المكيف', tone: 'warning' },
  { unit: 'شقة 405', property: 'برج الروضة', status: 'غير معيّنة', note: 'لم يتم تعيين عامل تنظيف بعد', tone: 'info' },
] as const;

export const reservations: Reservation[] = [
  { id: 'RES-2026-1842', guest: 'عبدالله محمد', unit: 'شقة 102', platform: 'Booking.com', checkIn: 'اليوم، 02:00 م', checkOut: '13 سبتمبر', guests: 3, status: 'مؤكد', tone: 'success' },
  { id: 'RES-2026-1843', guest: 'سارة العتيبي', unit: 'شقة 304', platform: 'Airbnb', checkIn: 'اليوم، 04:30 م', checkOut: '15 سبتمبر', guests: 2, status: 'مؤكد', tone: 'success' },
  { id: 'RES-2026-1844', guest: 'تركي الدوسري', unit: 'شقة 205', platform: 'جاذر', checkIn: 'غدًا، 01:00 م', checkOut: '14 سبتمبر', guests: 4, status: 'بانتظار الدفع', tone: 'warning' },
  { id: 'RES-2026-1845', guest: 'نورة الحربي', unit: 'شقة 401', platform: 'مباشر', checkIn: '12 سبتمبر، 03:00 م', checkOut: '17 سبتمبر', guests: 2, status: 'مؤكد', tone: 'success' },
  { id: 'RES-2026-1846', guest: 'فهد الشمري', unit: 'شقة 203', platform: 'Booking.com', checkIn: '13 سبتمبر، 02:00 م', checkOut: '16 سبتمبر', guests: 5, status: 'طلب تعديل', tone: 'info' },
];

export const units: Unit[] = [
  { id: 1, name: 'شقة 102', property: 'برج النخيل', type: 'غرفتان وصالة', city: 'الرياض', status: 'مشغولة', tone: 'info', guests: 3, nextEvent: 'مغادرة 13 سبتمبر', platform: 'Booking.com', progress: 70 },
  { id: 2, name: 'شقة 205', property: 'مساكن الروضة', type: 'استديو', city: 'الرياض', status: 'جاهزة', tone: 'success', guests: 2, nextEvent: 'وصول غدًا 1:00 م', platform: 'جاذر', progress: 100 },
  { id: 3, name: 'شقة 304', property: 'برج الياسمين', type: '3 غرف وصالة', city: 'جدة', status: 'بانتظار التنظيف', tone: 'warning', guests: 4, nextEvent: 'وصول اليوم 4:30 م', platform: 'Airbnb', progress: 35 },
  { id: 4, name: 'شقة 203', property: 'مساكن النخيل', type: 'غرفة وصالة', city: 'الرياض', status: 'قيد الصيانة', tone: 'danger', guests: 2, nextEvent: 'لا يوجد حجز قريب', progress: 20 },
  { id: 5, name: 'شقة 401', property: 'برج الروضة', type: 'غرفتان وصالة', city: 'الخبر', status: 'مشغولة', tone: 'info', guests: 2, nextEvent: 'مغادرة 17 سبتمبر', platform: 'مباشر', progress: 82 },
  { id: 6, name: 'شقة 405', property: 'برج الروضة', type: 'استديو', city: 'الخبر', status: 'جاهزة', tone: 'success', guests: 1, nextEvent: 'متاحة حتى 19 سبتمبر', progress: 100 },
];

export const operationTasks: OperationTask[] = [
  { id: 'CLN-2031', title: 'تنظيف بعد المغادرة', unit: 'شقة 304 – برج الياسمين', assignee: 'أحمد سالم', time: 'اليوم، 10:30 ص', status: 'قيد التنفيذ', priority: 'عاجلة' },
  { id: 'CLN-2032', title: 'تنظيف وتجهيز', unit: 'شقة 405 – برج الروضة', assignee: 'غير معيّن', time: 'اليوم، 12:00 م', status: 'جديدة', priority: 'عاجلة' },
  { id: 'MNT-0881', title: 'فحص جهاز التكييف', unit: 'شقة 203 – مساكن النخيل', assignee: 'مؤسسة الرؤية', time: 'اليوم، 01:30 م', status: 'قيد التنفيذ', priority: 'عادية' },
  { id: 'CLN-2029', title: 'تنظيف دوري', unit: 'شقة 205 – مساكن الروضة', assignee: 'محمد علي', time: 'اليوم، 09:00 ص', status: 'مكتملة', priority: 'عادية' },
  { id: 'SRV-1034', title: 'تجهيز ضيافة إضافية', unit: 'شقة 102 – برج النخيل', assignee: 'سارة حسن', time: 'اليوم، 11:45 ص', status: 'مكتملة', priority: 'عادية' },
];

export const notifications = [
  { text: 'تم الانتهاء من تنظيف شقة 205', time: 'منذ 8 دقائق', tone: 'success' },
  { text: 'تم استلام حجز جديد من Airbnb', time: 'منذ 21 دقيقة', tone: 'brand' },
  { text: 'تغير موعد مغادرة الضيف في شقة 304', time: 'منذ 35 دقيقة', tone: 'warning' },
  { text: 'تحتاج مزامنة Booking.com إلى مراجعة', time: 'منذ ساعة', tone: 'danger' },
] as const;

export const invoices = [
  { number: 'INV-2026-009', date: '1 سبتمبر 2026', amount: '399 ر.س', status: 'مدفوعة' },
  { number: 'INV-2026-008', date: '1 أغسطس 2026', amount: '399 ر.س', status: 'مدفوعة' },
  { number: 'INV-2026-007', date: '1 يوليو 2026', amount: '399 ر.س', status: 'مدفوعة' },
  { number: 'INV-2026-006', date: '1 يونيو 2026', amount: '399 ر.س', status: 'مدفوعة' },
];
