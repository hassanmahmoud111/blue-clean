export type CreateField = {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  options?: string[];
  required?: boolean;
  full?: boolean;
};

export type CreateFormConfig = {
  title: string;
  description: string;
  singular: string;
  backTo: string;
  sections: { title: string; description: string; fields: CreateField[] }[];
};

export const createForms: Record<string, CreateFormConfig> = {
  unit: {
    title: 'إضافة وحدة جديدة', description: 'أدخل المعلومات الأساسية للوحدة ويمكن تعديلها في أي وقت.', singular: 'الوحدة', backTo: '/app/units',
    sections: [
      { title: 'بيانات الوحدة', description: 'المعلومات التي تظهر في قائمة الوحدات.', fields: [
        { name: 'name', label: 'اسم الوحدة', placeholder: 'مثال: شقة 801', required: true },
        { name: 'code', label: 'كود الوحدة', placeholder: 'BLD-801', required: true },
        { name: 'property', label: 'العقار', type: 'select', options: ['برج النخيل','برج الياسمين','مساكن الروضة'], required: true },
        { name: 'city', label: 'المدينة', type: 'select', options: ['الرياض','جدة','الدمام'], required: true },
      ]},
      { title: 'تفاصيل التشغيل', description: 'بيانات تساعد فريق التشغيل والحجوزات.', fields: [
        { name: 'type', label: 'نوع الوحدة', type: 'select', options: ['شقة','استوديو','فيلا'] },
        { name: 'guests', label: 'الحد الأقصى للضيوف', type: 'number', placeholder: '4' },
        { name: 'status', label: 'الحالة الأولية', type: 'select', options: ['جاهزة للضيف','بانتظار التنظيف','قيد الصيانة'] },
        { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'أي معلومات إضافية عن الوحدة...', full: true },
      ]},
    ],
  },
  booking: {
    title: 'إضافة حجز جديد', description: 'سجّل بيانات الضيف والإقامة في خطوات بسيطة.', singular: 'الحجز', backTo: '/app/bookings',
    sections: [
      { title: 'بيانات الحجز', description: 'تفاصيل الوحدة وموعد الإقامة.', fields: [
        { name: 'unit', label: 'الوحدة', type: 'select', options: ['شقة 101','شقة 102','شقة 203','شقة 304'], required: true },
        { name: 'platform', label: 'مصدر الحجز', type: 'select', options: ['Booking.com','Airbnb','Gathern','حجز مباشر'], required: true },
        { name: 'checkIn', label: 'تاريخ الوصول', type: 'date', required: true },
        { name: 'checkOut', label: 'تاريخ المغادرة', type: 'date', required: true },
      ]},
      { title: 'بيانات الضيف', description: 'بيانات التواصل وعدد النزلاء.', fields: [
        { name: 'guestName', label: 'اسم الضيف', placeholder: 'الاسم الكامل', required: true },
        { name: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '+966 5X XXX XXXX', required: true },
        { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'guest@example.com' },
        { name: 'guests', label: 'عدد الضيوف', type: 'number', placeholder: '2' },
      ]},
    ],
  },
  cleaning: serviceConfig('طلب تنظيف جديد', 'التنظيف', 'تنظيف خروج'),
  maintenance: serviceConfig('إنشاء طلب صيانة', 'الصيانة', 'صيانة تكييف'),
  service: serviceConfig('طلب خدمة إضافية', 'الخدمة', 'غسيل كنب'),
  user: {
    title: 'إضافة مستخدم', description: 'أضف عضوًا جديدًا وحدد صلاحياته داخل الحساب.', singular: 'المستخدم', backTo: '/app/settings',
    sections: [
      { title: 'بيانات المستخدم', description: 'بيانات الدخول والتواصل الأساسية.', fields: [
        { name: 'name', label: 'الاسم الكامل', placeholder: 'اسم المستخدم', required: true },
        { name: 'email', label: 'البريد الإلكتروني', type: 'email', placeholder: 'name@example.com', required: true },
        { name: 'phone', label: 'رقم الجوال', type: 'tel', placeholder: '+966 5X XXX XXXX' },
        { name: 'role', label: 'الدور', type: 'select', options: ['مدير','مشرف تشغيل','موظف حجوزات','عامل خدمة'], required: true },
      ]},
    ],
  },
  payment: {
    title: 'إضافة طريقة دفع', description: 'أضف بطاقة دفع جديدة للاشتراك والخدمات.', singular: 'طريقة الدفع', backTo: '/app/billing',
    sections: [
      { title: 'بيانات البطاقة', description: 'لن يتم حفظ بيانات البطاقة الحساسة في الواجهة.', fields: [
        { name: 'holder', label: 'اسم حامل البطاقة', placeholder: 'كما يظهر على البطاقة', required: true },
        { name: 'number', label: 'رقم البطاقة', placeholder: '0000 0000 0000 0000', required: true },
        { name: 'expiry', label: 'تاريخ الانتهاء', placeholder: 'MM / YY', required: true },
        { name: 'cvv', label: 'رمز الأمان', placeholder: 'CVV', required: true },
      ]},
    ],
  },
  invoice: {
    title: 'إنشاء فاتورة يدوية', description: 'أنشئ فاتورة لخدمة إضافية أو رسوم خاصة.', singular: 'الفاتورة', backTo: '/app/billing',
    sections: [
      { title: 'بيانات الفاتورة', description: 'حدد العميل والخدمة والمبلغ.', fields: [
        { name: 'customer', label: 'العميل', placeholder: 'اسم العميل أو المنشأة', required: true },
        { name: 'date', label: 'تاريخ الفاتورة', type: 'date', required: true },
        { name: 'amount', label: 'المبلغ', type: 'number', placeholder: '0.00', required: true },
        { name: 'status', label: 'الحالة', type: 'select', options: ['مسودة','مستحقة','مدفوعة'] },
        { name: 'description', label: 'وصف الفاتورة', type: 'textarea', placeholder: 'تفاصيل الخدمة أو الرسوم...', full: true },
      ]},
    ],
  },
};

function serviceConfig(title: string, singular: string, defaultService: string): CreateFormConfig {
  return {
    title, description: 'حدد الوحدة والخدمة والموعد المطلوب، ثم احفظ الطلب.', singular, backTo: '/app/operations',
    sections: [
      { title: 'تفاصيل الطلب', description: 'المعلومات الأساسية لتنفيذ الخدمة.', fields: [
        { name: 'unit', label: 'الوحدة', type: 'select', options: ['شقة 101','شقة 102','شقة 203','شقة 304'], required: true },
        { name: 'serviceType', label: 'نوع الخدمة', type: 'select', options: [defaultService,'تنظيف دوري','تنظيف عميق','فحص وصيانة','تعقيم شامل'], required: true },
        { name: 'date', label: 'التاريخ', type: 'date', required: true },
        { name: 'time', label: 'الوقت', type: 'time', required: true },
        { name: 'priority', label: 'الأولوية', type: 'select', options: ['عادية','متوسطة','عالية','عاجلة'] },
        { name: 'assignee', label: 'العامل', type: 'select', options: ['تعيين تلقائي','أحمد سالم','فاطمة علي','محمد إبراهيم'] },
        { name: 'notes', label: 'تعليمات التنفيذ', type: 'textarea', placeholder: 'اكتب أي تعليمات يحتاجها فريق التنفيذ...', full: true },
      ]},
    ],
  };
}
