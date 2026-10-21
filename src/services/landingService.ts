import { apiFetch } from './apiClient';

export interface LocalizedText {
  ar?: string | null;
  en?: string | null;
}

export interface ApiPackageItem {
  id: number;
  name: string;
  name_ar?: string | null;
  name_en?: string | null;
  slug?: string;
  description: string;
  description_ar?: string | null;
  description_en?: string | null;
  price: number | null;
  price_text?: string | null;
  price_text_ar?: string | null;
  price_text_en?: string | null;
  billing_period?: string;
  max_units?: number | null;
  is_unlimited_units?: boolean;
  max_cleaning_orders?: number | null;
  cleaning_orders_count?: number | null;
  is_unlimited_cleaning_orders?: boolean;
  is_popular?: boolean;
  badge?: string | null;
  badge_ar?: string | null;
  badge_en?: string | null;
  button_text?: string | null;
  button_text_ar?: string | null;
  button_text_en?: string | null;
  features: string[];
  features_ar?: string[];
  features_en?: string[];
  is_active?: boolean;
  sort_order?: number;
}

export interface LandingHeroBenefit {
  id: string;
  text: LocalizedText | string;
}

export interface LandingHeroSection {
  eyebrow?: LocalizedText | string;
  title?: LocalizedText | string;
  title_ar?: string | null;
  title_en?: string | null;
  description?: LocalizedText | string;
  subtitle_ar?: string | null;
  subtitle_en?: string | null;
  primaryCta?: {
    label?: LocalizedText | string;
    href?: string;
  };
  videoCta?: {
    label?: LocalizedText | string;
    videoUrl?: string | null;
  };
  benefits?: LandingHeroBenefit[];
  image?: string;
  imageAlt?: LocalizedText | string;
}

export interface LandingPlatformItem {
  id: string;
  name: string;
  mark?: string;
  logo?: string | null;
}

export interface LandingPlatformsSection {
  title?: LocalizedText | string;
  subtitle?: LocalizedText | string;
  items?: LandingPlatformItem[];
}

export interface LandingFeatureItem {
  id: string;
  icon?: string;
  title: LocalizedText | string;
  text: LocalizedText | string;
}

export interface LandingFeaturesSection {
  items?: LandingFeatureItem[];
}

export interface LandingStatItem {
  id: string;
  value: string;
  label: LocalizedText | string;
}

export interface LandingTestimonialSection {
  quote?: LocalizedText | string;
  author?: LocalizedText | string;
  rating?: number;
  stats?: LandingStatItem[];
  proof_image?: string;
}

export interface LandingAboutSection {
  hero?: {
    eyebrow?: LocalizedText | string;
    title?: LocalizedText | string;
    desc?: LocalizedText | string;
  };
  values?: Array<{
    id?: string;
    icon?: string;
    title: LocalizedText | string;
    text: LocalizedText | string;
  }>;
}

export interface LandingHowSection {
  hero?: {
    eyebrow?: LocalizedText | string;
    title?: LocalizedText | string;
    desc?: LocalizedText | string;
  };
  steps?: Array<{
    number: string;
    title: LocalizedText | string;
    text: LocalizedText | string;
  }>;
}

export interface LandingContactSection {
  hero?: {
    eyebrow?: LocalizedText | string;
    title?: LocalizedText | string;
    desc?: LocalizedText | string;
  };
  channels?: Array<{
    id?: string;
    icon?: string;
    title: LocalizedText | string;
    value: string;
    note?: LocalizedText | string;
  }>;
}

export interface GlobalNewSettingsData {
  hero_section?: LandingHeroSection;
  platforms_section?: LandingPlatformsSection;
  features_section?: LandingFeaturesSection;
  testimonial_section?: LandingTestimonialSection;
  about_us?: LandingAboutSection;
  how_it_works_section?: LandingHowSection;
  contact_us_section?: LandingContactSection;
  landing?: {
    hero?: LandingHeroSection;
    platforms?: LandingPlatformsSection;
    features?: LandingFeatureItem[];
    testimonial?: LandingTestimonialSection;
    stats?: LandingStatItem[];
    proofImage?: string;
  };
  seo_section?: {
    title?: LocalizedText | string;
    description?: LocalizedText | string;
  };
}

let cachedSettings: GlobalNewSettingsData | null = null;
let cachedPackages: ApiPackageItem[] | null = null;

export async function fetchGlobalNewSettings(): Promise<GlobalNewSettingsData | null> {
  if (cachedSettings) return cachedSettings;
  try {
    const res = await apiFetch<any>('/global/landing-page/new-settings');
    const data = res.ok && res.data ? ((res.data as any).data || res.data) : null;
    if (data && typeof data === 'object') {
      cachedSettings = data;
      if (typeof window !== 'undefined') {
        try {
          window.localStorage.setItem('bluclean_new_settings', JSON.stringify(data));
        } catch {
          // ignore storage quota errors
        }
      }
      return data;
    }
  } catch (err) {
    console.warn('Failed to fetch new-settings:', err);
  }

  // fallback to localStorage cache if network fails
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem('bluclean_new_settings');
      if (saved) {
        cachedSettings = JSON.parse(saved);
        return cachedSettings;
      }
    } catch {
      // ignore parse error
    }
  }

  return null;
}

export async function fetchGlobalPackages(): Promise<ApiPackageItem[] | null> {
  if (cachedPackages && cachedPackages.length > 0) return cachedPackages;

  const endpoints = ['/global/packages', '/packages', '/client/packages'];
  for (const endpoint of endpoints) {
    try {
      const res = await apiFetch<any>(endpoint);
      if (res.ok && res.data) {
        const raw = (res.data as any).data || res.data;
        const list: ApiPackageItem[] = Array.isArray(raw) ? raw : [];
        if (list.length > 0) {
          const activeList = list
            .filter(item => item.is_active !== false)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
          cachedPackages = activeList;
          if (typeof window !== 'undefined') {
            try {
              window.localStorage.setItem('bluclean_packages', JSON.stringify(activeList));
            } catch {
              // ignore
            }
          }
          return activeList;
        }
      }
    } catch {
      // try next endpoint
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem('bluclean_packages');
      if (saved) {
        cachedPackages = JSON.parse(saved);
        return cachedPackages;
      }
    } catch {
      // ignore
    }
  }

  return null;
}

export function resolveLocalized(val: LocalizedText | string | undefined | null, lang: 'ar' | 'en'): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (lang === 'en') return val.en || val.ar || '';
  return val.ar || val.en || '';
}

export function formatPackageBadge(pkg: ApiPackageItem, lang: 'ar' | 'en'): string | null {
  const isEn = lang === 'en';
  const hasArabic = (s: string) => /[\u0600-\u06FF]/.test(s);
  const badges = [pkg.badge_en, pkg.badge_ar, pkg.badge].filter(Boolean).map(s => String(s).trim());
  const combined = badges.join(' ').toLowerCase();

  if (combined.includes('شارك') || combined.includes('اشترك') || combined.includes('join') || combined.includes('subscribe')) {
    return isEn ? 'Join Now' : 'شارك الآن';
  }
  if (combined.includes('الأكثر') || combined.includes('شعبية') || combined.includes('شائع') || combined.includes('popular')) {
    return isEn ? 'Most Popular' : 'الأكثر اختيارًا';
  }
  if (combined.includes('مهم') || combined.includes('مميز') || combined.includes('featured')) {
    return isEn ? 'Featured' : 'مميز';
  }
  if (combined.includes('جديد') || combined.includes('new')) {
    return isEn ? 'New' : 'جديد';
  }
  if (combined.includes('موصى') || combined.includes('recommended')) {
    return isEn ? 'Recommended' : 'موصى به';
  }
  if (combined.includes('أفضل') || combined.includes('best')) {
    return isEn ? 'Best Value' : 'أفضل قيمة';
  }
  if (combined.includes('عرض خاص') || combined.includes('offer')) {
    return isEn ? 'Special Offer' : 'عرض خاص';
  }
  if (combined.includes('خصم') || combined.includes('discount')) {
    return isEn ? 'Special Discount' : 'خصم خاص';
  }

  if (isEn) {
    if (pkg.badge_en && !hasArabic(pkg.badge_en)) return pkg.badge_en.trim();
    const nonAr = badges.find(b => !hasArabic(b));
    return nonAr || (pkg.is_popular ? 'Most Popular' : (badges[0] ? 'Join Now' : null));
  } else {
    if (pkg.badge_ar && hasArabic(pkg.badge_ar)) return pkg.badge_ar.trim();
    if (pkg.badge && hasArabic(pkg.badge)) return pkg.badge.trim();
    const arBadge = badges.find(b => hasArabic(b));
    return arBadge || (pkg.is_popular ? 'الأكثر اختيارًا' : (badges[0] || null));
  }
}

export function formatPackageUnits(pkg: ApiPackageItem, lang: 'ar' | 'en'): string {
  if (pkg.is_unlimited_units) {
    return lang === 'en' ? 'Unlimited units' : 'وحدات غير محدودة';
  }
  if (pkg.max_units) {
    return lang === 'en' ? `Up to ${pkg.max_units} units` : `حتى ${pkg.max_units} وحدة`;
  }
  return '';
}

export function formatPackagePrice(pkg: ApiPackageItem, lang: 'ar' | 'en'): string {
  if (pkg.price === null) {
    const raw = lang === 'en' ? (pkg.price_text_en || pkg.price_text) : (pkg.price_text_ar || pkg.price_text);
    return raw || (lang === 'en' ? 'Contact Us' : 'تواصل معنا');
  }
  if (lang === 'en') {
    return pkg.price_text_en || `${pkg.price} SAR / month`;
  }
  return pkg.price_text_ar || pkg.price_text || `${pkg.price} ر.س / شهرياً`;
}

export function getPackageFeatures(pkg: ApiPackageItem, lang: 'ar' | 'en'): string[] {
  if (lang === 'en') {
    return (pkg.features_en && pkg.features_en.length > 0) ? pkg.features_en : (pkg.features || []);
  }
  return (pkg.features_ar && pkg.features_ar.length > 0) ? pkg.features_ar : (pkg.features || []);
}

export function getPackageButtonText(pkg: ApiPackageItem, lang: 'ar' | 'en'): string {
  if (lang === 'en') {
    return pkg.button_text_en || pkg.button_text || (pkg.price === null ? 'Request a Quote' : 'Get Started');
  }
  return pkg.button_text_ar || pkg.button_text || (pkg.price === null ? 'اطلب عرضًا' : 'ابدأ الآن');
}

export interface ContactUsPayload {
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
}

export interface ContactUsResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export async function submitContactUs(payload: ContactUsPayload): Promise<ContactUsResponse> {
  try {
    const res = await apiFetch<any>('/global/contact-us', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (res.ok && res.data && res.data.success !== false) {
      return {
        success: true,
        message: res.data.message || 'تم إرسال رسالتك بنجاح، وسنتواصل معك في أقرب وقت.',
      };
    }

    const errorData = res.data;
    return {
      success: false,
      message: errorData?.message || 'حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى.',
      errors: errorData?.errors,
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'تعذر الاتصال بالخادم، يرجى المحاولة لاحقاً.',
    };
  }
}

