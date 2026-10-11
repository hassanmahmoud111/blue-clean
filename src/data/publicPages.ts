import {
  BarChart3, CalendarCheck2, CheckCircle2, Headphones, HeartHandshake, Home,
  Layers3, MessageSquareText, RefreshCw, ShieldCheck, Sparkles, UsersRound, Wrench,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  labelEn: string;
}

export const publicNavigation: NavItem[] = [
  { to: '/', label: 'الرئيسية', labelEn: 'Home' },
  { to: '/features', label: 'المميزات', labelEn: 'Features' },
  { to: '/how-it-works', label: 'كيف يعمل', labelEn: 'How It Works' },
  { to: '/pricing', label: 'الأسعار', labelEn: 'Pricing' },
  { to: '/about', label: 'من نحن', labelEn: 'About Us' },
  { to: '/contact', label: 'تواصل معنا', labelEn: 'Contact Us' },
];

export interface FeatureCard {
  icon: typeof Home;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

export const featureCards: FeatureCard[] = [
  {
    icon: Home,
    title: 'إدارة الوحدات',
    titleEn: 'Unit Management',
    text: 'ملف موحد لكل وحدة يشمل بياناتها وحالتها وحجوزاتها وتشغيلها.',
    textEn: 'A unified profile for each unit covering property details, live status, bookings, and turnover.',
  },
  {
    icon: CalendarCheck2,
    title: 'الحجوزات والتقويم',
    titleEn: 'Bookings & Calendar',
    text: 'تقويم مركزي للحجوزات اليدوية والمتزامنة مع منع التعارض.',
    textEn: 'Central calendar for manual and synchronized reservations with zero double-booking conflicts.',
  },
  {
    icon: RefreshCw,
    title: 'المزامنة',
    titleEn: 'Channel Sync',
    text: 'متابعة اتصال Booking.com وAirbnb وGathern وحالة كل عملية مزامنة.',
    textEn: 'Real-time synchronization with Booking.com, Airbnb, and Gathern with automatic rate parity.',
  },
  {
    icon: Sparkles,
    title: 'إدارة النظافة',
    titleEn: 'Cleaning Management',
    text: 'إنشاء طلبات تلقائية بعد المغادرة أو جداول تنظيف دورية مستقلة.',
    textEn: 'Automated turnover cleaning tasks upon checkout with photo inspection and quality checklists.',
  },
  {
    icon: Wrench,
    title: 'الصيانة والخدمات',
    titleEn: 'Maintenance & Services',
    text: 'طلبات مخصصة، تعيين مسؤول، قائمة فحص، تكلفة وسجل تنفيذ كامل.',
    textEn: 'Custom work orders, vendor assignments, checklist items, and full expense tracking.',
  },
  {
    icon: MessageSquareText,
    title: 'تواصل موحد',
    titleEn: 'Unified Inbox',
    text: 'تنظيم رسائل الضيوف والمتابعة من مكان بسيط وواضح.',
    textEn: 'Organize guest messages from all booking channels in one clean, centralized dashboard.',
  },
  {
    icon: BarChart3,
    title: 'تقارير دقيقة',
    titleEn: 'Reports & Analytics',
    text: 'مؤشرات الإشغال والإيرادات والتكاليف وأداء الوحدات والخدمات.',
    textEn: 'Occupancy rates, revenue breakdowns, operational expenses, and unit performance KPIs.',
  },
  {
    icon: ShieldCheck,
    title: 'صلاحيات وأمان',
    titleEn: 'Permissions & Security',
    text: 'تجهيز الأدوار والصلاحيات وسجل النشاط للتوسع لاحقًا بأمان.',
    textEn: 'Granular role-based access control, activity logs, and secure organizational management.',
  },
];

export interface HowStep {
  number: string;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

export const howSteps: HowStep[] = [
  {
    number: '01',
    title: 'أضف وحداتك',
    titleEn: 'Add Your Units',
    text: 'أضف الوحدة يدويًا أو اختر ربطها بمنصة حجز مدعومة.',
    textEn: 'Create units manually or connect them directly to supported booking platforms.',
  },
  {
    number: '02',
    title: 'حدّد أسلوب الإدارة',
    titleEn: 'Choose Management Mode',
    text: 'مزامنة حجوزات، تشغيل مستقل، أو إدارة مختلطة تجمع الاثنين.',
    textEn: 'Select between full channel sync, standalone operations, or a hybrid setup.',
  },
  {
    number: '03',
    title: 'نظّم الحجوزات',
    titleEn: 'Organize Bookings',
    text: 'راجع الحجوزات المتزامنة وأضف الحجوزات المباشرة دون تعارض.',
    textEn: 'Review synchronized reservations and add direct guest bookings without calendar clashes.',
  },
  {
    number: '04',
    title: 'شغّل الخدمات',
    titleEn: 'Automate Services',
    text: 'حوّل المغادرات إلى تنظيف، وأنشئ الصيانة والخدمات الدورية.',
    textEn: 'Automatically convert checkouts into cleaning orders and schedule regular maintenance.',
  },
  {
    number: '05',
    title: 'تابع الأداء',
    titleEn: 'Monitor Performance',
    text: 'راقب التنفيذ والإشغال والتكاليف من لوحة واحدة.',
    textEn: 'Track operational progress, unit occupancy rates, and revenue from a single dashboard.',
  },
];

export interface PlanItem {
  name: string;
  nameEn: string;
  price: string;
  priceEn: string;
  description: string;
  descriptionEn: string;
  units: string;
  unitsEn: string;
  featured: boolean;
  features: string[];
  featuresEn: string[];
}

export const plans: PlanItem[] = [
  {
    name: 'الأساسية',
    nameEn: 'Basic Plan',
    price: '199',
    priceEn: '199',
    description: 'للمضيف الفردي والوحدات القليلة',
    descriptionEn: 'For individual hosts and small property portfolios',
    units: 'حتى 5 وحدات',
    unitsEn: 'Up to 5 units',
    featured: false,
    features: ['إدارة الوحدات والحجوزات', 'تقويم موحد', 'طلبات تشغيل يدوية', 'تقارير أساسية'],
    featuresEn: ['Units & Bookings Management', 'Unified Calendar', 'Manual Operation Orders', 'Basic Reports'],
  },
  {
    name: 'الاحترافية',
    nameEn: 'Professional Plan',
    price: '599',
    priceEn: '599',
    description: 'للمضيفين ومديري العقارات',
    descriptionEn: 'For growing hosts and property managers',
    units: 'حتى 50 وحدة',
    unitsEn: 'Up to 50 units',
    featured: true,
    features: ['كل مميزات الباقة الأساسية', 'ربط منصات الحجز', 'تشغيل تلقائي بعد المغادرة', 'تقارير متقدمة ودعم أولوية'],
    featuresEn: ['All Basic Plan features', 'OTA Channel integrations', 'Automated turnover upon checkout', 'Advanced analytics & priority support'],
  },
  {
    name: 'الأعمال',
    nameEn: 'Enterprise Plan',
    price: 'تواصل معنا',
    priceEn: 'Contact Us',
    description: 'للشركات والمحافظ الكبيرة',
    descriptionEn: 'For large portfolios and property enterprises',
    units: 'وحدات غير محدودة',
    unitsEn: 'Unlimited units',
    featured: false,
    features: ['إعداد مخصص للمنشأة', 'صلاحيات فرق متقدمة', 'تكاملات وتقارير مخصصة', 'مدير نجاح مخصص'],
    featuresEn: ['Tailored enterprise onboarding', 'Advanced role permissions', 'Custom integrations & reports', 'Dedicated success manager'],
  },
];

export interface CompanyValue {
  icon: typeof Layers3;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

export const companyValues: CompanyValue[] = [
  {
    icon: Layers3,
    title: 'البساطة أولًا',
    titleEn: 'Simplicity First',
    text: 'نبني أدوات واضحة تقلل العمل اليومي بدل أن تضيف تعقيدًا جديدًا.',
    textEn: 'We design straightforward tools that eliminate daily friction instead of adding complexity.',
  },
  {
    icon: CheckCircle2,
    title: 'تشغيل يمكن الوثوق به',
    titleEn: 'Dependable Operations',
    text: 'كل طلب وحجز وتغيير له حالة واضحة وسجل قابل للمراجعة.',
    textEn: 'Every order, reservation, and status change has an auditable log you can rely on.',
  },
  {
    icon: HeartHandshake,
    title: 'نجاح العميل',
    titleEn: 'Client Success',
    text: 'نقيس نجاحنا بالوقت الذي نوفره وجودة تجربة الضيوف.',
    textEn: 'We measure our success by the hours saved for hosts and the satisfaction of their guests.',
  },
  {
    icon: UsersRound,
    title: 'مصمم للفرق العربية والعالمية',
    titleEn: 'Designed for Modern Teams',
    text: 'واجهة عربية أصيلة وتجربة تناسب المضيفين وفرق التشغيل المحلية.',
    textEn: 'Full bilingual Arabic and English experience tailored for hosts and local operational teams.',
  },
];

export interface ContactChannel {
  icon: typeof Headphones;
  title: string;
  titleEn: string;
  value: string;
  note: string;
  noteEn: string;
}

export const contactChannels: ContactChannel[] = [
  {
    icon: Headphones,
    title: 'فريق المبيعات',
    titleEn: 'Sales Team',
    value: 'sales@bluclean.sa',
    note: 'للخطط وعروض الشركات',
    noteEn: 'For plans and enterprise inquiries',
  },
  {
    icon: MessageSquareText,
    title: 'الدعم والمساعدة',
    titleEn: 'Support & Help',
    value: 'support@bluclean.sa',
    note: 'نرد خلال ساعات العمل',
    noteEn: 'Prompt replies during business hours',
  },
  {
    icon: Home,
    title: 'المكتب',
    titleEn: 'Headquarters',
    value: 'الرياض، المملكة العربية السعودية',
    note: 'الأحد إلى الخميس',
    noteEn: 'Sunday to Thursday (9am - 6pm)',
  },
];
