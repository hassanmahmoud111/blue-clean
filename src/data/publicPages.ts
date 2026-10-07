import {
  BarChart3, CalendarCheck2, CheckCircle2, Headphones, HeartHandshake, Home,
  Layers3, MessageSquareText, RefreshCw, ShieldCheck, Sparkles, UsersRound, Wrench,
} from 'lucide-react';

export const publicNavigation = [
  { to: '/', label: 'الرئيسية' },
  { to: '/features', label: 'المميزات' },
  { to: '/how-it-works', label: 'كيف يعمل' },
  { to: '/pricing', label: 'الأسعار' },
  { to: '/about', label: 'من نحن' },
  { to: '/contact', label: 'تواصل معنا' },
];

export const featureCards = [
  { icon: Home, title: 'إدارة الوحدات', text: 'ملف موحد لكل وحدة يشمل بياناتها وحالتها وحجوزاتها وتشغيلها.' },
  { icon: CalendarCheck2, title: 'الحجوزات والتقويم', text: 'تقويم مركزي للحجوزات اليدوية والمتزامنة مع منع التعارض.' },
  { icon: RefreshCw, title: 'المزامنة', text: 'متابعة اتصال Booking.com وAirbnb وGathern وحالة كل عملية مزامنة.' },
  { icon: Sparkles, title: 'إدارة النظافة', text: 'إنشاء طلبات تلقائية بعد المغادرة أو جداول تنظيف دورية مستقلة.' },
  { icon: Wrench, title: 'الصيانة والخدمات', text: 'طلبات مخصصة، تعيين مسؤول، قائمة فحص، تكلفة وسجل تنفيذ كامل.' },
  { icon: MessageSquareText, title: 'تواصل موحد', text: 'تنظيم رسائل الضيوف والمتابعة من مكان بسيط وواضح.' },
  { icon: BarChart3, title: 'تقارير دقيقة', text: 'مؤشرات الإشغال والإيرادات والتكاليف وأداء الوحدات والخدمات.' },
  { icon: ShieldCheck, title: 'صلاحيات وأمان', text: 'تجهيز الأدوار والصلاحيات وسجل النشاط للتوسع لاحقًا بأمان.' },
];

export const howSteps = [
  { number: '01', title: 'أضف وحداتك', text: 'أضف الوحدة يدويًا أو اختر ربطها بمنصة حجز مدعومة.' },
  { number: '02', title: 'حدّد أسلوب الإدارة', text: 'مزامنة حجوزات، تشغيل مستقل، أو إدارة مختلطة تجمع الاثنين.' },
  { number: '03', title: 'نظّم الحجوزات', text: 'راجع الحجوزات المتزامنة وأضف الحجوزات المباشرة دون تعارض.' },
  { number: '04', title: 'شغّل الخدمات', text: 'حوّل المغادرات إلى تنظيف، وأنشئ الصيانة والخدمات الدورية.' },
  { number: '05', title: 'تابع الأداء', text: 'راقب التنفيذ والإشغال والتكاليف من لوحة واحدة.' },
];

export const plans = [
  { name: 'الأساسية', price: '199', description: 'للمضيف الفردي والوحدات القليلة', units: 'حتى 5 وحدات', featured: false, features: ['إدارة الوحدات والحجوزات','تقويم موحد','طلبات تشغيل يدوية','تقارير أساسية'] },
  { name: 'الاحترافية', price: '599', description: 'للمضيفين ومديري العقارات', units: 'حتى 50 وحدة', featured: true, features: ['كل مميزات الباقة الأساسية','ربط منصات الحجز','تشغيل تلقائي بعد المغادرة','تقارير متقدمة ودعم أولوية'] },
  { name: 'الأعمال', price: 'تواصل معنا', description: 'للشركات والمحافظ الكبيرة', units: 'وحدات غير محدودة', featured: false, features: ['إعداد مخصص للمنشأة','صلاحيات فرق متقدمة','تكاملات وتقارير مخصصة','مدير نجاح مخصص'] },
];

export const companyValues = [
  { icon: Layers3, title: 'البساطة أولًا', text: 'نبني أدوات واضحة تقلل العمل اليومي بدل أن تضيف تعقيدًا جديدًا.' },
  { icon: CheckCircle2, title: 'تشغيل يمكن الوثوق به', text: 'كل طلب وحجز وتغيير له حالة واضحة وسجل قابل للمراجعة.' },
  { icon: HeartHandshake, title: 'نجاح العميل', text: 'نقيس نجاحنا بالوقت الذي نوفره وجودة تجربة الضيوف.' },
  { icon: UsersRound, title: 'مصمم للفرق العربية', text: 'واجهة عربية RTL وتجربة تناسب المضيفين وفرق التشغيل المحلية.' },
];

export const contactChannels = [
  { icon: Headphones, title: 'فريق المبيعات', value: 'sales@bluclean.sa', note: 'للخطط وعروض الشركات' },
  { icon: MessageSquareText, title: 'الدعم والمساعدة', value: 'support@bluclean.sa', note: 'نرد خلال ساعات العمل' },
  { icon: Home, title: 'المكتب', value: 'الرياض، المملكة العربية السعودية', note: 'الأحد إلى الخميس' },
];
