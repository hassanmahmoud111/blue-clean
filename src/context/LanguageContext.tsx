import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ar' | 'en';

interface LanguageContextType {
  lang: Language;
  dir: 'rtl' | 'ltr';
  isRTL: boolean;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.dashboard': 'الرئيسية',
    'nav.units': 'الوحدات',
    'nav.bookings': 'الحجوزات والتقويم',
    'nav.reports': 'التقارير',
    'nav.billing': 'الاشتراك والفوترة',
    'nav.support': 'الدعم الفني',
    'nav.settings': 'الإعدادات',
    'nav.operations': 'العمليات والخدمات',
    'nav.cleaning': 'النظافة',
    'nav.maintenance': 'الصيانة',
    'nav.services': 'الخدمات الإضافية',
    'nav.help': 'مركز المساعدة',
    'nav.plan_title': 'الباقة الحالية',
    'nav.plan_name': 'الاحترافية',
    'nav.plan_usage': '9 من 12 وحدة مستخدمة',
    'nav.new_booking': 'إضافة حجز',
    'nav.close_menu': 'إغلاق القائمة',
    'nav.open_menu': 'فتح القائمة',

    // Topbar
    'topbar.today': 'اليوم، الخميس، 10 سبتمبر 2026',
    'topbar.search': 'ابحث عن وحدة، حجز، ضيف، طلب أو تذكر...',
    'topbar.user_name': 'عبدالله الشمري احمد',
    'topbar.user_role': 'مدير التشغيل 22',
    'topbar.notifications': 'الإشعارات',
    'topbar.new_count': '2 جديدة',
    'topbar.profile': 'الملف الشخصي',
    'topbar.billing': 'الاشتراك والفواتير',
    'topbar.help': 'مركز المساعدة',
    'topbar.logout': 'تسجيل الخروج',
    'topbar.lang_switch': 'English',
    'topbar.toggle_sidebar': 'تبديل الشريط الجانبي',

    // Dashboard
    'dashboard.welcome': 'صباح الخير',
    'dashboard.welcome_sub': 'إليك ملخص ما يحدث في وحداتك وعملياتك التشغيلية اليوم.',
    'dashboard.total_units': 'إجمالي الوحدات',
    'dashboard.occupied_units': 'الوحدات المشغولة',
    'dashboard.occupancy_rate': 'نسبة الإشغال',
    'dashboard.today_departures': 'المغادرات اليوم',
    'dashboard.today_arrivals': 'الوصول اليوم',
    'dashboard.scheduled_departures': 'مغادرة مجدولة',
    'dashboard.scheduled_arrivals': 'وصول مجدول',
    'dashboard.this_month': 'هذا الشهر',
    'dashboard.attention_required': 'يتطلب اتخاذ إجراء',
    'dashboard.today_timeline': 'الجدول الزمني لليوم',
    'dashboard.view_calendar': 'عرض التقويم بالكامل',
    'dashboard.recent_bookings': 'أحدث الحجوزات',
    'dashboard.view_all_bookings': 'عرض كل الحجوزات',
    'dashboard.units_status': 'حالة الوحدات المباشرة',
    'dashboard.active_alerts': 'تنبيهات وتحديثات النظام',
    'dashboard.integrations_status': 'حالة المنصات والربط',
    'dashboard.urgent': 'عاجل',
    'dashboard.medium': 'متوسط',

    // Billing
    'billing.title': 'الفواتير والاشتراك',
    'billing.subtitle': 'إدارة خطة اشتراك BluClean الخاصة بك وتفاصيل الدفع والفواتير.',
    'billing.tab_subscription': 'الاشتراك الحالي',
    'billing.tab_invoices': 'سجل الفواتير والمدفوعات',
    'billing.tab_methods': 'طرق الدفع',
    'billing.upgrade_plan': 'ترقية الباقة',
    'billing.download_invoices': 'تحميل جميع الفواتير',

    // Support
    'support.title': 'الدعم الفني والمساعدة',
    'support.subtitle': 'فريق BluClean جاهز لمساعدتك على مدار الساعة لضمان تجربة تشغيل سلسة.',
    'support.tab_tickets': 'التذاكر الحالية والسابقة',
    'support.tab_faqs': 'الأسئلة الشائعة والمساعدة',
    'support.tab_contact': 'تواصل معنا مباشرة',
    'support.new_ticket': 'تذكرة جديدة',

    // Settings
    'settings.title': 'إعدادات الحساب والنظام',
    'settings.subtitle': 'إدارة الملف الشخصي، تفضيلات الحساب، الأمان، وإعدادات الفريق.',
    'settings.tab_profile': 'الملف الشخصي',
    'settings.tab_security': 'الأمان وتسجيل الدخول',
    'settings.tab_company': 'بيانات الشركة والفرع',
    'settings.tab_notifications': 'إعدادات الإشعارات',
    'settings.save': 'حفظ التعديلات',
    'settings.cancel': 'إلغاء',

    // Operations
    'operations.title': 'التشغيل والخدمات',
    'operations.subtitle': 'متابعة وإسناد مهام النظافة، الصيانة، والخدمات الإضافية لجميع الوحدات.',
    'operations.tab_cleaning': 'مهام النظافة والتعقيم',
    'operations.tab_maintenance': 'الصيانة الدورية والطارئة',
    'operations.tab_services': 'الخدمات الإضافية والضيافة',
    'operations.create_task': 'إنشاء مهمة جديدة',

    // Reports
    'reports.title': 'التقارير ومؤشرات الأداء',
    'reports.subtitle': 'تحليلات تفصيلية عن الإشغال، الإيرادات، جودة النظافة وسرعة الاستجابة.',
    'reports.export': 'تصدير التقرير (PDF/Excel)',
    'reports.filter_period': 'الفترة الزمنية',

    // Common
    'common.search': 'بحث...',
    'common.filter': 'تصفية',
    'common.all': 'الكل',
    'common.active': 'نشط',
    'common.pending': 'قيد الانتظار',
    'common.completed': 'مكتمل',
    'common.status': 'الحالة',
    'common.actions': 'الإجراءات',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.back': 'رجوع',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.view': 'عرض',
  },
  en: {
    // Navigation
    'nav.dashboard': 'Home',
    'nav.units': 'Units',
    'nav.bookings': 'Bookings & calendar',
    'nav.reports': 'Reports',
    'nav.billing': 'Billing & subscription',
    'nav.support': 'Support',
    'nav.settings': 'Settings',
    'nav.operations': 'Operations & services',
    'nav.cleaning': 'Cleaning',
    'nav.maintenance': 'Maintenance',
    'nav.services': 'Extra services',
    'nav.help': 'Help center',
    'nav.plan_title': 'Current Plan',
    'nav.plan_name': 'Professional',
    'nav.plan_usage': '9 of 12 units used',
    'nav.new_booking': 'New Booking',
    'nav.close_menu': 'Close Menu',
    'nav.open_menu': 'Open Menu',

    // Topbar
    'topbar.today': 'Today, Thursday, Sep 10, 2026',
    'topbar.search': 'Search unit, booking, guest, request or ticket...',
    'topbar.user_name': 'Abdullah Al-Shammari',
    'topbar.user_role': 'Operations Manager',
    'topbar.notifications': 'Notifications',
    'topbar.new_count': '2 New',
    'topbar.profile': 'Profile',
    'topbar.billing': 'Subscription & Billing',
    'topbar.help': 'Help Center',
    'topbar.logout': 'Sign Out',
    'topbar.lang_switch': 'العربية',
    'topbar.toggle_sidebar': 'Toggle Sidebar',

    // Dashboard
    'dashboard.welcome': 'Good morning',
    'dashboard.welcome_sub': "Here's a summary of your units and operations today.",
    'dashboard.total_units': 'Total Units',
    'dashboard.occupied_units': 'Occupied Units',
    'dashboard.occupancy_rate': 'Occupancy Rate',
    'dashboard.today_departures': 'Departures Today',
    'dashboard.today_arrivals': 'Arrivals Today',
    'dashboard.scheduled_departures': 'scheduled departures',
    'dashboard.scheduled_arrivals': 'scheduled arrivals',
    'dashboard.this_month': 'this month',
    'dashboard.attention_required': 'Action Required',
    'dashboard.today_timeline': "Today's Timeline",
    'dashboard.view_calendar': 'View Full Calendar',
    'dashboard.recent_bookings': 'Recent Bookings',
    'dashboard.view_all_bookings': 'View All Bookings',
    'dashboard.units_status': 'Live Units Status',
    'dashboard.active_alerts': 'System Alerts & Updates',
    'dashboard.integrations_status': 'Channel & Sync Status',
    'dashboard.urgent': 'Urgent',
    'dashboard.medium': 'Medium',

    // Billing
    'billing.title': 'Billing & Subscription',
    'billing.subtitle': 'Manage your BluClean plan, payment details, and invoices.',
    'billing.tab_subscription': 'Current Subscription',
    'billing.tab_invoices': 'Invoices & Payments',
    'billing.tab_methods': 'Payment Methods',
    'billing.upgrade_plan': 'Upgrade Plan',
    'billing.download_invoices': 'Download All Invoices',

    // Support
    'support.title': 'Help & Support',
    'support.subtitle': 'The BluClean team is here 24/7 to ensure smooth hospitality operations.',
    'support.tab_tickets': 'Support Tickets',
    'support.tab_faqs': 'FAQs & Documentation',
    'support.tab_contact': 'Contact Us Directly',
    'support.new_ticket': 'New Ticket',

    // Settings
    'settings.title': 'Account & System Settings',
    'settings.subtitle': 'Manage your profile, account preferences, security, and team settings.',
    'settings.tab_profile': 'Profile',
    'settings.tab_security': 'Security & Login',
    'settings.tab_company': 'Company & Branch',
    'settings.tab_notifications': 'Notifications',
    'settings.save': 'Save Changes',
    'settings.cancel': 'Cancel',

    // Operations
    'operations.title': 'Operations & Services',
    'operations.subtitle': 'Monitor and assign cleaning, maintenance, and extra services across all units.',
    'operations.tab_cleaning': 'Cleaning & Sanitization',
    'operations.tab_maintenance': 'Regular & Emergency Maintenance',
    'operations.tab_services': 'Extra Services & Hospitality',
    'operations.create_task': 'Create New Task',

    // Reports
    'reports.title': 'Reports & Performance Metrics',
    'reports.subtitle': 'In-depth analytics on occupancy, revenue, cleanliness quality, and response speed.',
    'reports.export': 'Export Report (PDF/Excel)',
    'reports.filter_period': 'Time Period',

    // Common
    'common.search': 'Search...',
    'common.filter': 'Filter',
    'common.all': 'All',
    'common.active': 'Active',
    'common.pending': 'Pending',
    'common.completed': 'Completed',
    'common.status': 'Status',
    'common.actions': 'Actions',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.back': 'Back',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.view': 'View',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('bluclean_lang');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {
      // Ignore localStorage errors
    }
    return 'ar';
  });

  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  const isRTL = lang === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('bluclean_lang', lang);
    } catch {
      // Ignore localStorage errors
    }
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string, fallback?: string): string => {
    return translations[lang]?.[key] ?? fallback ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, dir, isRTL, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
