export type SupportTicketStatus = 'مفتوحة' | 'بانتظار ردك' | 'قيد المعالجة' | 'مغلقة';
export type SupportTicketPriority = 'عادية' | 'متوسطة' | 'عاجلة';

export type SupportTicketMessage = {
  id: number;
  sender: 'customer' | 'support';
  author: string;
  body: string;
  time: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: string;
  status: SupportTicketStatus;
  priority: SupportTicketPriority;
  createdAt: string;
  updatedAt: string;
  relatedTo?: string;
  requester: string;
  messages: SupportTicketMessage[];
};

export const supportTickets: SupportTicket[] = [
  {
    id: 'SUP-1048', subject: 'تأخر مزامنة حجز من Booking.com', category: 'الربط والمزامنة', status: 'قيد المعالجة', priority: 'عاجلة',
    createdAt: '10 سبتمبر، 09:18 ص', updatedAt: 'منذ 12 دقيقة', relatedTo: 'Booking.com · شقة 102', requester: 'محمد القحطاني',
    messages: [
      { id: 1, sender: 'customer', author: 'محمد القحطاني', body: 'الحجز ظاهر في Booking.com لكنه لم يظهر داخل المنصة حتى الآن.', time: '09:18 ص' },
      { id: 2, sender: 'support', author: 'فريق دعم BluClean', body: 'استلمنا البلاغ وراجعنا سجل المزامنة. توجد محاولة متأخرة ونعمل على إعادة تشغيلها بأمان.', time: '09:31 ص' },
      { id: 3, sender: 'support', author: 'فريق دعم BluClean', body: 'تمت استعادة الاتصال، ونعمل الآن على مطابقة الحجز مع الوحدة قبل إغلاق التذكرة.', time: '10:04 ص' },
    ],
  },
  {
    id: 'SUP-1047', subject: 'تعديل صلاحية مسؤول التشغيل', category: 'الحساب والصلاحيات', status: 'بانتظار ردك', priority: 'متوسطة',
    createdAt: '9 سبتمبر، 03:40 م', updatedAt: 'منذ ساعتين', relatedTo: 'المستخدم: أحمد سالم', requester: 'محمد القحطاني',
    messages: [
      { id: 1, sender: 'customer', author: 'محمد القحطاني', body: 'أحتاج أن يتمكن مسؤول التشغيل من تحديث حالة المهام دون الوصول إلى الفواتير.', time: 'أمس، 03:40 م' },
      { id: 2, sender: 'support', author: 'فريق دعم BluClean', body: 'يمكننا مساعدتك. هل ترغب بتطبيق الصلاحية على أحمد سالم فقط أم على دور مسؤول التشغيل بالكامل؟', time: 'اليوم، 08:12 ص' },
    ],
  },
  {
    id: 'SUP-1043', subject: 'استفسار عن إضافة وحدات مستقلة', category: 'الوحدات', status: 'مغلقة', priority: 'عادية',
    createdAt: '6 سبتمبر، 11:05 ص', updatedAt: 'منذ 3 أيام', relatedTo: 'إضافة الوحدات', requester: 'محمد القحطاني',
    messages: [
      { id: 1, sender: 'customer', author: 'محمد القحطاني', body: 'هل يمكن إضافة وحدة غير مرتبطة بمنصة حجز واستخدام التنظيف الدوري فقط؟', time: '6 سبتمبر، 11:05 ص' },
      { id: 2, sender: 'support', author: 'فريق دعم BluClean', body: 'نعم، اختر الإضافة اليدوية ثم نمط التشغيل المستقل. يمكنك بعدها إنشاء جدول تنظيف دوري للوحدة.', time: '6 سبتمبر، 11:22 ص' },
    ],
  },
  {
    id: 'SUP-1039', subject: 'الفاتورة لا تظهر بعد التجديد', category: 'الفواتير والاشتراك', status: 'مفتوحة', priority: 'متوسطة',
    createdAt: '5 سبتمبر، 01:16 م', updatedAt: 'منذ 4 أيام', relatedTo: 'اشتراك الباقة الاحترافية', requester: 'محمد القحطاني',
    messages: [{ id: 1, sender: 'customer', author: 'محمد القحطاني', body: 'تم تجديد الاشتراك ولكن فاتورة هذا الشهر لا تظهر في صفحة الفواتير.', time: '5 سبتمبر، 01:16 م' }],
  },
];
