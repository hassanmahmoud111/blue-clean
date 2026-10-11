import type { BookingDetailRecord, OperationDetailRecord, UnitDetailRecord } from '../types/details';

const realUnits: UnitDetailRecord[] = [
  {
    id: 'UNT-YMFCHL',
    apiId: 7,
    number: '1204',
    name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    code: 'UNT-YMFCHL',
    property: 'أبراج الرمال السكنية',
    city: 'الرياض',
    district: 'العليا',
    address: 'طريق الملك فهد، حي العليا، برج 4، الدور 12، شقة 1204',
    status: 'مسودة',
    statusTone: 'orange',
    type: 'شقة',
    imageClass: 'u1',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      '/unit-thumbs/thumb-1.png',
    ],
    description: 'شقة فاخرة بتصميم مودرن بالقرب من مراكز الأعمال في العليا.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-YMFCHL',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-YMFCHL',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 2 },
    stayDefaults: { checkIn: '15:00', checkOut: '11:00', cleaningMinutes: 120, access: 'قفل ذكي' },
    metrics: { occupancy: '72%', revenue: '8,400 ر.س', completedTasks: '14', rating: '4.9' },
    integrations: [
      { name: 'Airbnb', status: 'متصل', listingId: 'AIR-YMFCHL', lastSync: 'منذ 5 دقائق', tone: 'green' },
    ],
    upcomingOperations: [
      { id: 'CLN-6091', type: 'تنظيف دوري', date: '2026-10-12 01:00', assignee: 'تعيين تلقائي', status: 'قيد التنفيذ', tone: 'blue' },
    ],
    notes: [
      'شقة فاخرة بتصميم مودرن بالقرب من مراكز الأعمال في العليا.',
      'تعليمات الدخول عبر القفل الذكي تُرسل تلقائيًا للضيف قبل الوصول.',
    ],
    activity: [
      { title: 'تم إنشاء مهمة تنظيف دوري (CLN-6091)', time: 'منذ ساعتين', tone: 'blue' },
      { title: 'تمت مزامنة حالة الوحدة مع Airbnb', time: 'منذ 5 دقائق', tone: 'green' },
    ],
  },
  {
    id: 'UNT-Q4HSI8',
    apiId: 6,
    number: '18',
    name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
    code: 'UNT-Q4HSI8',
    property: 'كمباوند النرجس ريزيدنس',
    city: 'الرياض',
    district: 'النرجس',
    address: 'حي النرجس، شارع عثمان بن عفان، فيلا 18',
    status: 'مسودة',
    statusTone: 'orange',
    type: 'فيلا',
    imageClass: 'u2',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      '/unit-thumbs/thumb-2.png',
    ],
    description: 'فيلا واسعة مع مسبح خاص وحديقة للعائلات.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-Q4HSIB',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-Q4HSIB',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 8, bedrooms: 4, beds: 6, bathrooms: 4 },
    stayDefaults: { checkIn: '16:00', checkOut: '12:00', cleaningMinutes: 180, access: 'صندوق مفاتيح' },
    metrics: { occupancy: '68%', revenue: '14,200 ر.س', completedTasks: '11', rating: '4.9' },
    integrations: [
      { name: 'Booking.com', status: 'متصل', listingId: 'BK-Q4HSIB', lastSync: 'منذ 10 دقائق', tone: 'green' },
    ],
    upcomingOperations: [
      { id: 'CLN-2032', type: 'تنظيف وتجهيز', date: 'غدًا، 12:00 م', assignee: 'أحمد سالم', status: 'مجدولة', tone: 'blue' },
    ],
    notes: [
      'فيلا واسعة مع مسبح خاص وحديقة للعائلات.',
      'يرجى فحص مستوى تعقيم المسبح والحديقة قبل كل تسجيل دخول.',
    ],
    activity: [
      { title: 'تم تحديث بيانات الفيلا', time: 'منذ 30 دقيقة', tone: 'blue' },
      { title: 'تمت مزامنة الحجوزات من Booking.com', time: 'منذ ساعة', tone: 'green' },
    ],
  },
  {
    id: 'UNT-105',
    apiId: 5,
    number: '105',
    name: 'شقة العليا 102 - صيانة دورية',
    code: 'UNT-105',
    property: 'عمارة العليا 12',
    city: 'الرياض',
    district: 'العليا',
    address: 'حي العليا، شارع التحلية',
    status: 'غير نشطة',
    statusTone: 'red',
    type: 'شقة',
    imageClass: 'u3',
    imageUrl: '/unit-thumbs/thumb-3.png',
    images: ['/unit-thumbs/thumb-3.png'],
    description: 'شقة فندقية في حي العليا بشارع التحلية خاضعة للصيانة الدورية.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-105',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-105',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 3, bedrooms: 1, beds: 2, bathrooms: 1 },
    stayDefaults: { checkIn: '15:00', checkOut: '11:00', cleaningMinutes: 120, access: 'مفتاح مع الحارس' },
    currentBooking: {
      id: 'BK-261006-197',
      guest: 'ahmed',
      channel: 'مباشر',
      checkIn: '2026-10-10',
      checkOut: '2026-10-14',
      guests: 3,
      amount: '1,650 ر.س',
    },
    metrics: { occupancy: '60%', revenue: '5,200 ر.س', completedTasks: '9', rating: '4.7' },
    integrations: [],
    upcomingOperations: [
      { id: 'MNT-0881', type: 'صيانة', date: 'اليوم، 02:00 م', assignee: 'خالد منصور', status: 'قيد التنفيذ', tone: 'orange' },
    ],
    notes: [
      'المفتاح متوفر لدى حارس العمارة.',
      'توجد صيانة دورية مجدولة للتكييف والإضاءة.',
    ],
    activity: [
      { title: 'تسجيل إقامة حالية (BK-261006-197)', time: 'نشط الآن', tone: 'blue' },
      { title: 'تحويل الحالة إلى صيانة دورية', time: 'منذ ساعتين', tone: 'orange' },
    ],
  },
  {
    id: 'UNT-104',
    apiId: 4,
    number: '104',
    name: 'شاليه اليمامة للعائلات',
    code: 'UNT-104',
    property: 'منتجع اليمامة',
    city: 'الرياض',
    district: 'العليا',
    address: 'شمال الرياض، مخرج 6',
    status: 'مسودة',
    statusTone: 'orange',
    type: 'شاليه',
    imageClass: 'u4',
    imageUrl: '/unit-thumbs/thumb-4.png',
    images: ['/unit-thumbs/thumb-4.png'],
    description: 'شاليه عائلي متكامل في منتجع اليمامة مناسب للعطلات والمناسبات.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-104',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-104',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 10, bedrooms: 3, beds: 5, bathrooms: 3 },
    stayDefaults: { checkIn: '15:00', checkOut: '11:00', cleaningMinutes: 150, access: 'استقبال' },
    metrics: { occupancy: '75%', revenue: '11,800 ر.س', completedTasks: '13', rating: '4.8' },
    integrations: [],
    upcomingOperations: [
      { id: 'CLN-2031', type: 'تنظيف وتجهيز', date: 'اليوم، 01:00 م', assignee: 'أحمد سالم', status: 'مجدولة', tone: 'blue' },
    ],
    notes: [
      'تسليم واستلام المفاتيح عبر مكتب الاستقبال في المنتجع.',
      'تجهيز الجلسات الخارجية قبل وصول العائلات.',
    ],
    activity: [
      { title: 'تم فحص جاهزية الشاليه', time: 'منذ 45 دقيقة', tone: 'green' },
    ],
  },
  {
    id: 'UNT-103',
    apiId: 3,
    number: '103',
    name: 'استوديو الكورنيش بإطلالة بحرية',
    code: 'UNT-103',
    property: 'أبراج الشاطئ',
    city: 'جدة',
    district: 'الشاطئ',
    address: 'طريق الكورنيش، حي الشاطئ، الدور 8',
    status: 'جاهزة للضيف',
    statusTone: 'green',
    type: 'استوديو',
    imageClass: 'u5',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      '/unit-thumbs/thumb-5.png',
    ],
    description: 'استوديو أنيق ومجهز بالكامل للعرسان ورجال الأعمال بإطلالة مباشرة على الكورنيش.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-103',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-103',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 2, bedrooms: 1, beds: 1, bathrooms: 1 },
    stayDefaults: { checkIn: '14:00', checkOut: '11:00', cleaningMinutes: 90, access: 'قفل ذكي' },
    metrics: { occupancy: '84%', revenue: '7,900 ر.س', completedTasks: '19', rating: '4.9' },
    integrations: [
      { name: 'Gathern', status: 'متصل', listingId: 'GTH-103', lastSync: 'منذ 4 دقائق', tone: 'green' },
    ],
    upcomingOperations: [
      { id: 'SRV-1034', type: 'خدمة إضافية', date: 'اليوم، 02:30 م', assignee: 'أحمد سالم', status: 'مكتملة', tone: 'green' },
    ],
    notes: [
      'استوديو أنيق ومجهز بالكامل للعرسان ورجال الأعمال.',
      'التأكد من تجهيز ركن القهوة وإطلالة الشرفة قبل كل حجز.',
    ],
    activity: [
      { title: 'الوحدة جاهزة لاستقبال الضيوف', time: 'منذ 20 دقيقة', tone: 'green' },
      { title: 'تمت مزامنة التقويم مع Gathern', time: 'منذ 4 دقائق', tone: 'blue' },
    ],
  },
  {
    id: 'UNT-102',
    apiId: 2,
    number: '102',
    name: 'فيلا النرجس VIP مسبح خاص',
    code: 'UNT-102',
    property: 'كمباوند النرجس ريزيدنس',
    city: 'الرياض',
    district: 'النرجس',
    address: 'حي النرجس، شارع عثمان بن عفان، فيلا 18',
    status: 'جاهزة للضيف',
    statusTone: 'green',
    type: 'فيلا',
    imageClass: 'u6',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      '/unit-thumbs/thumb-6.png',
    ],
    description: 'فيلا واسعة مع مسبح خاص وحديقة للعائلات.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-102',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-102',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 8, bedrooms: 4, beds: 6, bathrooms: 4 },
    stayDefaults: { checkIn: '16:00', checkOut: '12:00', cleaningMinutes: 180, access: 'صندوق مفاتيح' },
    nextBooking: {
      id: 'RES-2026-1842',
      guest: 'عبدالله محمد',
      channel: 'Booking.com',
      checkIn: '15 أكتوبر 2026',
      checkOut: '18 أكتوبر 2026',
    },
    metrics: { occupancy: '88%', revenue: '18,600 ر.س', completedTasks: '22', rating: '4.9' },
    integrations: [
      { name: 'Booking.com', status: 'متصل', listingId: 'BK-983402', lastSync: 'منذ دقيقتين', tone: 'green' },
    ],
    upcomingOperations: [
      { id: 'CLN-2040', type: 'تنظيف وتجهيز', date: 'اليوم، 12:30 م', assignee: 'أحمد سالم', status: 'مكتملة', tone: 'green' },
    ],
    notes: [
      'فيلا واسعة مع مسبح خاص وحديقة للعائلات.',
      'صندوق المفاتيح بجانب البوابة الرئيسية للفيلا.',
    ],
    activity: [
      { title: 'اكتملت مهمة التنظيف والتعقيم', time: 'منذ 15 دقيقة', tone: 'green' },
      { title: 'تمت مزامنة الحجوزات مع Booking.com', time: 'منذ دقيقتين', tone: 'blue' },
    ],
  },
  {
    id: 'UNT-101',
    apiId: 1,
    number: '101',
    name: 'شقة الرمال الفاخرة - برج 4',
    code: 'UNT-101',
    property: 'أبراج الرمال السكنية',
    city: 'الرياض',
    district: 'العليا',
    address: 'طريق الملك فهد، حي العليا، برج 4، الدور 12، شقة 1204',
    status: 'جاهزة للضيف',
    statusTone: 'green',
    type: 'شقة',
    imageClass: 'u7',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      '/unit-thumbs/thumb-7.png',
    ],
    description: 'شقة فاخرة بتصميم مودرن بالقرب من مراكز الأعمال في العليا.',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https%3A%2F%2Fblueclean.backend2.kazamiza.com%2Fguest%2Fstore%2FUNT-101',
    storeUrl: 'https://blueclean.backend2.kazamiza.com/guest/store/UNT-101',
    managementMode: 'تشغيل مستقل',
    capacity: { guests: 4, bedrooms: 2, beds: 3, bathrooms: 2 },
    stayDefaults: { checkIn: '15:00', checkOut: '11:00', cleaningMinutes: 120, access: 'قفل ذكي' },
    nextBooking: {
      id: 'RES-2026-1845',
      guest: 'سارة أحمد',
      channel: 'Airbnb',
      checkIn: '14 أكتوبر 2026',
      checkOut: '17 أكتوبر 2026',
    },
    metrics: { occupancy: '91%', revenue: '12,400 ر.س', completedTasks: '26', rating: '4.9' },
    integrations: [
      { name: 'Airbnb', status: 'متصل', listingId: 'AIR-77420', lastSync: 'منذ 5 دقائق', tone: 'green' },
    ],
    upcomingOperations: [
      { id: 'CLN-2029', type: 'تنظيف وتجهيز', date: 'اليوم، 11:00 ص', assignee: 'أحمد سالم', status: 'مكتملة', tone: 'green' },
    ],
    notes: [
      'شقة فاخرة بتصميم مودرن بالقرب من مراكز الأعمال في العليا.',
      'تعليمات الدخول موجودة في تطبيق القفل الذكي وتُرسل للضيف تلقائيًا.',
    ],
    activity: [
      { title: 'تم تحديث حالة الوحدة إلى جاهزة للضيف', time: 'منذ 18 دقيقة', tone: 'green' },
      { title: 'تمت مزامنة بيانات الحجز مع Airbnb', time: 'منذ 35 دقيقة', tone: 'blue' },
    ],
  },
];

const unitSeeds = [
  ['101','برج النخيل','الرياض','مشغولة','blue','u1','إدارة مختلطة'],
  ['102','برج النخيل','الرياض','بانتظار التنظيف','orange','u2','مزامنة حجوزات'],
  ['203','مساكن الروضة','الرياض','قيد الصيانة','red','u3','تشغيل مستقل'],
  ['304','برج الياسمين','جدة','بانتظار التنظيف','orange','u4','مزامنة حجوزات'],
  ['405','مساكن النخيل','الرياض','جاهزة للضيف','green','u5','تشغيل مستقل'],
  ['501','برج الروضة','الرياض','مشغولة','blue','u6','إدارة مختلطة'],
  ['602','برج النخيل','الرياض','جاهزة للضيف','green','u7','تشغيل مستقل'],
  ['701','برج الياسمين','جدة','خارج الخدمة','gray','u8','تشغيل مستقل'],
] as const;

const unitOperationIds = ['CLN-2029','CLN-2032','MNT-0881','CLN-2031','SRV-1034','CLN-2040','CLN-2042','MNT-0887'] as const;

const legacyUnitDetails: UnitDetailRecord[] = unitSeeds.map(([number,property,city,status,statusTone,imageClass,managementMode],index) => ({
  id: `BLD-${number}`,
  number,
  name: `شقة ${number}`,
  code: `BLD-${number}`,
  property,
  city,
  district: city === 'جدة' ? 'حي الياسمين' : index === 2 ? 'حي الروضة' : 'حي النخيل',
  address: city === 'جدة' ? 'شارع الأمير سلطان، الدور الرابع' : 'طريق الملك فهد، المدخل الشمالي',
  status,
  statusTone,
  type: index % 3 === 0 ? '3 غرف وصالة' : index % 2 === 0 ? 'استوديو' : 'غرفتان وصالة',
  imageClass,
  managementMode,
  capacity: { guests: index % 3 + 3, bedrooms: index % 3 + 1, beds: index % 3 + 2, bathrooms: index % 2 + 1 },
  stayDefaults: { checkIn: '03:00 م', checkOut: '11:00 ص', cleaningMinutes: 120, access: index % 2 ? 'صندوق مفاتيح' : 'قفل ذكي' },
  currentBooking: status === 'مشغولة' ? { id: `RES-2026-${1842+index}`, guest: index ? 'سارة محمد' : 'أحمد العتيبي', channel: index ? 'Airbnb' : 'Booking.com', checkIn: '10 سبتمبر 2026', checkOut: '13 سبتمبر 2026', guests: 3, amount: '1,860 ر.س' } : undefined,
  nextBooking: status !== 'خارج الخدمة' ? { id: `RES-2026-${1900+index}`, guest: ['نورة سالم','خالد العتيبي','فهد الشمري'][index%3], channel: ['Booking.com','Airbnb','مباشر'][index%3], checkIn: `${12+index} سبتمبر 2026`, checkOut: `${15+index} سبتمبر 2026` } : undefined,
  metrics: { occupancy: `${54+index*5}%`, revenue: `${4_300+index*1_350} ر.س`, completedTasks: `${8+index}`, rating: index%2?'4.8':'4.9' },
  integrations: managementMode === 'تشغيل مستقل' ? [] : [
    { name: 'Booking.com', status: 'متصل', listingId: `BK-${983401+index}`, lastSync: 'منذ دقيقتين', tone: 'green' },
    ...(managementMode === 'إدارة مختلطة' ? [{ name: 'Airbnb', status: 'متصل', listingId: `AIR-${77420+index}`, lastSync: 'منذ 5 دقائق', tone: 'green' }] : []),
  ],
  upcomingOperations: [
    { id: unitOperationIds[index], type: index === 2 || index === 7 ? 'صيانة' : index === 4 ? 'خدمة إضافية' : 'تنظيف وتجهيز', date: 'اليوم، 11:00 ص', assignee: index%2?'تعيين تلقائي':'أحمد سالم', status: index%2?'بانتظار التعيين':'قيد التنفيذ', tone: index%2?'orange':'blue' },
  ],
  notes: ['تعليمات الدخول موجودة داخل صندوق المفاتيح.', 'يرجى فحص مستلزمات الضيافة بعد كل مغادرة.'],
  activity: [
    { title: 'تم تحديث حالة الوحدة', time: 'منذ 18 دقيقة', tone: 'blue' },
    { title: 'تمت مزامنة بيانات الحجز', time: 'منذ 35 دقيقة', tone: 'green' },
    { title: 'تم إنشاء مهمة تنظيف', time: 'منذ ساعة', tone: 'orange' },
  ],
}));

export const unitDetails: UnitDetailRecord[] = [...realUnits, ...legacyUnitDetails];

export const operationDetails: OperationDetailRecord[] = [
  operation('CLN-2031','cleaning','تنظيف بعد المغادرة','تنظيف كامل وتجهيز قبل وصول الضيف التالي','304','برج الياسمين','u4','قيد التنفيذ','blue','عاجلة','red','حجز متزامن'),
  operation('MNT-0881','maintenance','فحص جهاز التكييف','تشخيص ضعف التبريد وفحص الوحدة الداخلية والخارجية','203','مساكن الروضة','u3','قيد التنفيذ','blue','عالية','red','بلاغ يدوي'),
  operation('CLN-2029','cleaning','تنظيف وتجهيز','تنظيف كامل مع فحص المستلزمات','101','برج النخيل','u1','مكتملة','green','عادية','gray','حجز متزامن'),
  operation('SRV-1034','service','تجهيز ضيافة إضافية','تجهيز باقة ضيافة وترتيب سرير إضافي قبل الوصول','405','مساكن النخيل','u5','قيد المراجعة','blue','متوسطة','orange','طلب ضيف'),
  operation('CLN-2042','cleaning','تنظيف دوري','تنظيف أسبوعي مجدول','602','برج النخيل','u7','بانتظار التعيين','orange','متوسطة','orange','جدول دوري'),
  operation('CLN-2032','cleaning','تنظيف دوري','تنظيف دوري شامل للمطبخ والحمامات والمفروشات','102','برج النخيل','u2','بانتظار التعيين','orange','متوسطة','orange','جدول دوري'),
  operation('CLN-2040','cleaning','تنظيف وتجهيز','تنظيف الوحدة وفحص جاهزيتها للحجز القادم','501','برج الروضة','u6','قيد التنفيذ','blue','عاجلة','red','حجز متزامن'),
  operation('MNT-0887','maintenance','معالجة تسريب مياه','فحص مصدر التسريب وإصلاحه قبل إعادة الوحدة للخدمة','701','برج الياسمين','u8','بانتظار التعيين','orange','عاجلة','red','بلاغ يدوي'),
  operation('MNT-0888','maintenance','صيانة القفل الذكي','فحص البطارية وإعادة ضبط صلاحيات الدخول للوحدة','501','برج الروضة','u6','قيد المراجعة','blue','متوسطة','orange','بلاغ تشغيلي'),
  operation('MNT-0889','maintenance','فحص سخان المياه','تنفيذ فحص وقائي للسخان وتوثيق حالة عناصر السلامة','102','برج النخيل','u2','مكتملة','green','عادية','gray','جدول وقائي'),
  operation('SRV-1035','service','تعقيم شامل','تعقيم الأسطح عالية الاستخدام وتجهيز تقرير التنفيذ','304','برج الياسمين','u4','قيد التنفيذ','blue','متوسطة','orange','طلب يدوي'),
  operation('SRV-1036','service','غسيل كنب','غسيل وتجفيف كنب الصالة قبل موعد الحجز القادم','602','برج النخيل','u7','بانتظار التعيين','orange','عادية','gray','جدول دوري'),
  operation('SRV-1037','service','تجهيز مناسبة','تجهيز ديكور بسيط وباقة ضيافة حسب طلب العميل','101','برج النخيل','u1','مكتملة','green','متوسطة','orange','طلب ضيف'),
];

export const bookingDetails: BookingDetailRecord[] = [
  booking('RES-2026-1842','عبدالله محمد','BLD-102','شقة 102','برج النخيل','u2','Booking.com','3918427711','مؤكد','green','10 سبتمبر 2026','13 سبتمبر 2026',3,'1,860 ر.س','مدفوعة'),
  booking('RES-2026-1843','نورة سالم','BLD-304','شقة 304','برج الياسمين','u4','Airbnb','HMA3K29FQ8','مؤكد','green','10 سبتمبر 2026','14 سبتمبر 2026',4,'2,240 ر.س','تحصيل بواسطة المنصة'),
  booking('RES-2026-1844','خالد العتيبي','BLD-203','شقة 203','مساكن الروضة','u3','Gathern',undefined,'قيد المراجعة','orange','11 سبتمبر 2026','14 سبتمبر 2026',3,'1,520 ر.س','غير مدفوعة'),
  booking('RES-2026-1845','سارة أحمد','BLD-101','شقة 101','برج النخيل','u1','Airbnb','HMZ8P61KL2','مؤكد','green','12 سبتمبر 2026','15 سبتمبر 2026',3,'1,740 ر.س','تحصيل بواسطة المنصة'),
  booking('RES-2026-1846','محمد إبراهيم','BLD-501','شقة 501','برج الروضة','u6','Booking.com','3918427790','مؤكد','green','15 سبتمبر 2026','18 سبتمبر 2026',3,'2,100 ر.س','مدفوعة'),
  booking('RES-2026-1847','ليلى حسن','BLD-602','شقة 602','مساكن الواحة','u7','مباشر',undefined,'مؤكد','green','16 سبتمبر 2026','18 سبتمبر 2026',2,'980 ر.س','مدفوعة'),
];

function booking(id:string,guestName:string,unitId:string,unitName:string,property:string,imageClass:string,channel:BookingDetailRecord['channel'],externalId:string|undefined,status:string,statusTone:string,checkIn:string,checkOut:string,nights:number,total:string,paymentStatus:string):BookingDetailRecord {
  const synced = channel === 'Booking.com' || channel === 'Airbnb';
  return {
    id,externalId,guest:{name:guestName,phone:'+966 50 123 4567',email:'guest@example.com',adults:2,children:1},
    unit:{id:unitId,name:unitName,property,city:property.includes('الياسمين')?'جدة':'الرياض',imageClass},channel,
    sourceMode:synced?'مزامنة تلقائية':'إدخال يدوي',status,statusTone,
    stay:{checkIn,checkOut,nights,arrivalTime:'03:00 م',departureTime:'11:00 ص'},
    payment:{total,paid:paymentStatus==='غير مدفوعة'?'0 ر.س':total,remaining:paymentStatus==='غير مدفوعة'?total:'0 ر.س',method:synced?'تحصيل بواسطة المنصة':'بطاقة ائتمانية',status:paymentStatus,statusTone:paymentStatus==='غير مدفوعة'?'orange':'green'},
    automations:[{title:'حجب التواريخ',detail:'منع الحجوزات المتعارضة على القنوات المتاحة',enabled:true},{title:'رسالة تعليمات الدخول',detail:'تُرسل قبل الوصول بـ 24 ساعة',enabled:true},{title:'مهمة تنظيف بعد المغادرة',detail:'تتبع أي تعديل على موعد المغادرة',enabled:true}],
    operations:[{id:'CLN-2031',title:'تنظيف بعد المغادرة',status:'مجدولة',tone:'blue',route:'/app/operations/cleaning/CLN-2031'}],
    messages:[{title:'تم إرسال تأكيد الحجز',time:'منذ يومين',status:'تم التسليم'},{title:'تعليمات الدخول',time:'مجدولة قبل الوصول',status:'مجدولة'}],
    sync:{state:synced?'متزامن':'يدوي',lastSync:synced?'منذ 4 دقائق':'لا توجد مزامنة',eventId:synced?`evt-${id}`:undefined,canWriteBack:synced},
    notes:'يرجى تجهيز سرير إضافي والتأكد من توفر مستلزمات الضيافة قبل الوصول.',
    activity:[{title:'تم إنشاء الحجز',detail:`المصدر: ${channel}`,time:'8 سبتمبر، 09:30 ص',done:true},{title:'تم تأكيد توفر الوحدة',detail:'لا يوجد تعارض في التقويم',time:'8 سبتمبر، 09:31 ص',done:true},{title:'تم إنشاء مهمة ما بعد المغادرة',detail:'مرتبطة بموعد المغادرة الحالي',time:'8 سبتمبر، 09:32 ص',done:true},{title:'وصول الضيف',detail:'بانتظار موعد تسجيل الدخول',time:checkIn,done:false}],
  };
}

function operation(id:string,kind:OperationDetailRecord['kind'],title:string,description:string,unit:string,property:string,imageClass:string,status:string,statusTone:string,priority:string,priorityTone:string,source:string):OperationDetailRecord {
  const checklists = {
    cleaning: ['غرف النوم والمفروشات','المطبخ والأجهزة','دورات المياه','الأرضيات والنوافذ','فحص مستلزمات الضيافة'],
    maintenance: ['تأكيد وصف العطل','فحص السلامة قبل العمل','تشخيص السبب','تنفيذ الإصلاح','اختبار التشغيل وتوثيق النتيجة'],
    service: ['مراجعة تفاصيل الطلب','تأكيد الكمية والمقاس','تجهيز المستلزمات','تنفيذ الخدمة','تصوير النتيجة وإغلاق الطلب'],
  };
  const assigneeType = kind === 'cleaning' ? 'عامل نظافة معتمد' : kind === 'maintenance' ? 'فني صيانة معتمد' : 'مزود خدمة معتمد';
  return {
    id,kind,title,subtitle:'طلب تشغيل ومتابعة تنفيذ',unit:`شقة ${unit}`,unitCode:`BLD-${unit}`,property,imageClass,status,statusTone,priority,priorityTone,source,
    linkedBooking: source==='حجز متزامن'?{id:'RES-2026-1843',guest:'سارة العتيبي',channel:'Airbnb',checkout:'10 سبتمبر، 10:30 ص'}:undefined,
    schedule:{date:'10 سبتمبر 2026',start:'11:00 ص',due:'01:00 م',duration:'ساعتان'},
    assignee:{name:status==='بانتظار التعيين'?'غير معيّن':kind === 'maintenance' ? 'خالد منصور' : 'أحمد سالم',type:assigneeType,phone:'+966 50 123 4567'},
    description,
    checklist:checklists[kind].map((item,index)=>({title:item,done:index < (status === 'مكتملة' ? 5 : status === 'قيد التنفيذ' ? 2 : status === 'قيد المراجعة' ? 4 : 0)})),
    costs:[{label:'تكلفة الخدمة',value:'120 ر.س'},{label:'مواد ومستلزمات',value:'25 ر.س'},{label:'الإجمالي',value:'145 ر.س'}],
    attachments:[{name:'صورة قبل التنفيذ 01.jpg',type:'صورة'},{name:'تعليمات الوحدة.pdf',type:'مستند'}],
    timeline:[{title:'تم إنشاء الطلب',detail:`المصدر: ${source}`,time:'09:42 ص',done:true},{title:'تم تعيين المسؤول',detail:'تعيين حسب نوع الخدمة والمنطقة',time:'09:45 ص',done:status!=='بانتظار التعيين'},{title:'بدأ تنفيذ المهمة',detail:'تم تسجيل الوصول إلى الوحدة',time:'11:04 ص',done:status==='قيد التنفيذ'||status==='قيد المراجعة'||status==='مكتملة'},{title:'الفحص والإغلاق',detail:'بانتظار تقرير التنفيذ',time:'—',done:status==='مكتملة'}],
  };
}

export const getUnitDetail = (id?: string) => {
  if (!id) return unitDetails[0];
  const normalized = id.trim().toUpperCase();
  const alias = normalized === 'UNT-Q4HSIB' ? 'UNT-Q4HSI8' : normalized;
  return (
    unitDetails.find(
      (unit) =>
        unit.id.toUpperCase() === normalized ||
        unit.code.toUpperCase() === normalized ||
        unit.id.toUpperCase() === alias ||
        unit.code.toUpperCase() === alias ||
        String(unit.apiId) === normalized ||
        unit.number === normalized
    ) ||
    unitDetails.find(
      (unit) =>
        unit.id.toUpperCase().endsWith(normalized) ||
        unit.code.toUpperCase().includes(normalized)
    ) ||
    unitDetails[0]
  );
};
export const getOperationDetail = (id?: string) => operationDetails.find(operation => operation.id === id);
export const getBookingDetail = (id?: string) => bookingDetails.find(booking => booking.id === id);

