import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  BarChart3,
  CalendarCheck2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Headphones,
  Home,
  Layers3,
  LoaderCircle,
  Mail,
  MessageSquareText,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { PublicLoadingScreen } from '../components/PublicLoadingScreen';
import { companyValues, contactChannels, featureCards, howSteps, plans } from '../data/publicPages';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchGlobalNewSettings,
  fetchGlobalPackages,
  formatPackageBadge,
  formatPackagePrice,
  formatPackageUnits,
  getPackageButtonText,
  getPackageFeatures,
  resolveLocalized,
  submitContactUs,
  type ApiPackageItem,
  type GlobalNewSettingsData,
} from '../services/landingService';
import './landing-reference.css';
import './public-pages.css';

export type PublicPageKind = 'features' | 'how' | 'pricing' | 'about' | 'contact';

function getFeatureIcon(name?: string) {
  if (!name) return Sparkles;
  const n = name.toLowerCase();
  if (n.includes('house') || n.includes('home')) return Home;
  if (n.includes('calendar')) return CalendarDays;
  if (n.includes('sparkle') || n.includes('spray') || n.includes('clean')) return Sparkles;
  if (n.includes('wrench') || n.includes('tool') || n.includes('screwdriver')) return Wrench;
  if (n.includes('headset') || n.includes('phone') || n.includes('support')) return Headphones;
  if (n.includes('chart') || n.includes('bar') || n.includes('report') || n.includes('column')) return BarChart3;
  if (n.includes('shield') || n.includes('lock') || n.includes('security')) return ShieldCheck;
  if (n.includes('sync') || n.includes('refresh')) return RefreshCw;
  if (n.includes('message') || n.includes('chat')) return MessageSquareText;
  if (n.includes('user') || n.includes('team')) return UsersRound;
  return Sparkles;
}

interface PageMetaRecord {
  eyebrowAr: string;
  eyebrowEn: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

const pageMeta: Record<PublicPageKind, PageMetaRecord> = {
  features: {
    eyebrowAr: 'كل أدوات التشغيل في مكان واحد',
    eyebrowEn: 'All Operations Tools in One Place',
    titleAr: 'مميزات تساعدك على إدارة وحداتك بوضوح',
    titleEn: 'Features Built for Effortless Unit Management',
    descAr: 'من الحجز وحتى التنظيف والتقارير، صُممت كل خطوة لتكون بسيطة وقابلة للمتابعة.',
    descEn: 'From reservation to turnover and reporting, every step is designed to be streamlined and transparent.',
  },
  how: {
    eyebrowAr: 'إعداد واضح وتشغيل مرن',
    eyebrowEn: 'Clear Setup & Flexible Operations',
    titleAr: 'كيف يعمل BluClean؟',
    titleEn: 'How Does BluClean Work?',
    descAr: 'اختر بين المزامنة مع منصات الحجز أو التشغيل المستقل، ويمكنك الجمع بينهما دون تعارض.',
    descEn: 'Choose between booking platform sync or standalone operations, or combine both without conflict.',
  },
  pricing: {
    eyebrowAr: 'خطط واضحة دون تعقيد',
    eyebrowEn: 'Transparent Plans Without Complexity',
    titleAr: 'اختر الباقة المناسبة لحجم أعمالك',
    titleEn: 'Choose the Plan that Fits Your Portfolio',
    descAr: 'ابدأ بما تحتاجه اليوم، ويمكنك الترقية عندما يزيد عدد وحداتك أو فريقك.',
    descEn: 'Start with what you need today, and upgrade smoothly as your unit count or team expands.',
  },
  about: {
    eyebrowAr: 'نبني تشغيلًا أكثر هدوءًا',
    eyebrowEn: 'Building Smoother Hosting Operations',
    titleAr: 'من نحن',
    titleEn: 'About BluClean',
    descAr: 'BluClean منصة متكاملة تساعد المضيفين ومديري العقارات على توحيد الحجوزات والخدمات اليومية.',
    descEn: 'BluClean is an intuitive platform empowering property managers and hosts to unify bookings and daily turnovers.',
  },
  contact: {
    eyebrowAr: 'فريقنا قريب منك',
    eyebrowEn: 'Our team is close by',
    titleAr: 'تواصل معنا',
    titleEn: 'Contact us',
    descAr: 'أرسل استفسارك أو اطلب عرضاً توضيحياً وسيعاود فريقنا التواصل معك في أقرب وقت.',
    descEn: 'Send a question or request a demo, and our team will get back to you shortly.',
  },
};

export default function PublicPage({ kind }: { kind: PublicPageKind }) {
  const { lang, isRTL } = useLanguage();
  const meta = pageMeta[kind];

  const [settings, setSettings] = useState<GlobalNewSettingsData | null>(null);
  const [packages, setPackages] = useState<ApiPackageItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([fetchGlobalNewSettings(), fetchGlobalPackages()])
      .then(([s, p]) => {
        if (!active) return;
        if (s) setSettings(s);
        if (p && p.length > 0) setPackages(p);
      })
      .catch(err => {
        console.warn('API error in PublicPage:', err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Section-specific dynamic hero resolution
  let eyebrow = lang === 'en' ? meta.eyebrowEn : meta.eyebrowAr;
  let title = lang === 'en' ? meta.titleEn : meta.titleAr;
  let desc = lang === 'en' ? meta.descEn : meta.descAr;

  if (kind === 'about' && settings?.about_us?.hero) {
    eyebrow = resolveLocalized(settings.about_us.hero.eyebrow, lang) || eyebrow;
    title = resolveLocalized(settings.about_us.hero.title, lang) || title;
    desc = resolveLocalized(settings.about_us.hero.desc, lang) || desc;
  } else if (kind === 'how' && settings?.how_it_works_section?.hero) {
    eyebrow = resolveLocalized(settings.how_it_works_section.hero.eyebrow, lang) || eyebrow;
    title = resolveLocalized(settings.how_it_works_section.hero.title, lang) || title;
    desc = resolveLocalized(settings.how_it_works_section.hero.desc, lang) || desc;
  } else if (kind === 'contact' && settings?.contact_us_section?.hero) {
    eyebrow = resolveLocalized(settings.contact_us_section.hero.eyebrow, lang) || eyebrow;
    title = resolveLocalized(settings.contact_us_section.hero.title, lang) || title;
    desc = resolveLocalized(settings.contact_us_section.hero.desc, lang) || desc;
  }

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div className="reference-landing public-site-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      <main>
        <section className={`public-page-hero ${kind}`}>
          <div>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
            <p>{desc}</p>
            {kind !== 'contact' && (
              <div>
                <Link to="/register" className="public-main-cta">
                  <span>{lang === 'en' ? 'Get Started' : 'ابدأ الآن'}</span>
                  {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </Link>
                <Link to="/contact" className="public-ghost-cta">
                  {lang === 'en' ? 'Talk to Sales' : 'تحدث مع فريقنا'}
                </Link>
              </div>
            )}
          </div>
          <HeroVisual kind={kind} />
        </section>

        {kind === 'features' && <FeaturesContent settings={settings} />}
        {kind === 'how' && <HowContent settings={settings} />}
        {kind === 'pricing' && <PricingContent packages={packages} />}
        {kind === 'about' && <AboutContent settings={settings} />}
        {kind === 'contact' && <ContactContent settings={settings} />}
      </main>
      <PublicFooter />
    </div>
  );
}

function HeroVisual({ kind }: { kind: PublicPageKind }) {
  const { lang } = useLanguage();

  if (kind === 'contact') {
    const contactItems =
      lang === 'en'
        ? [
            { title: 'Arabic support', sub: 'Every detail in one place', tone: 'tone-blue' },
            { title: 'Fast response', sub: 'Designed around the way you work', tone: 'tone-green' },
            { title: 'Specialist team', sub: 'Designed around the way you work', tone: 'tone-orange' },
          ]
        : [
            { title: 'دعم باللغة العربية', sub: 'كل التفاصيل في مكان واحد', tone: 'tone-blue' },
            { title: 'استجابة سريعة', sub: 'مصمم بما يناسب طريقة عملك', tone: 'tone-green' },
            { title: 'فريق متخصص', sub: 'مصمم بما يناسب طريقة عملك', tone: 'tone-orange' },
          ];

    return (
      <div className="public-hero-visual">
        <span className="public-hero-orbit">
          <i />
          <i />
          <i />
        </span>
        <div className="public-hero-window contact-hero-card">
          <header>
            <b>BluClean</b>
            <div className="hero-card-dots">
              <i />
              <i />
              <i />
            </div>
          </header>
          {contactItems.map((item) => (
            <div key={item.title}>
              <i className={`tone-badge ${item.tone}`}>
                <Check size={14} strokeWidth={3} />
              </i>
              <span>
                <b>{item.title}</b>
                <small>{item.sub}</small>
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const labels =
    kind === 'pricing'
      ? lang === 'en'
        ? ['Flexible Plans', 'No Hidden Fees', 'Upgrade Anytime']
        : ['باقة مرنة', 'بدون رسوم مخفية', 'ترقية في أي وقت']
      : lang === 'en'
      ? ['Unified Bookings', 'Organized Turnover', 'Clear Analytics']
      : ['حجوزات موحدة', 'تشغيل منظم', 'تقارير واضحة'];

  return (
    <div className="public-hero-visual">
      <span className="public-hero-orbit">
        <i />
        <i />
        <i />
      </span>
      <div className="public-hero-window">
        <header>
          <b>BluClean</b>
          <span />
          <span />
          <span />
        </header>
        {labels.map((label, index) => (
          <div key={label}>
            <i className={`tone-${index}`}>
              <Check size={13} />
            </i>
            <span>
              <b>{label}</b>
              <small>
                {index === 0
                  ? lang === 'en'
                    ? 'All details in one place'
                    : 'كل التفاصيل في مكان واحد'
                  : lang === 'en'
                  ? 'Tailored to your workflow'
                  : 'مصمم ليناسب طريقة عملك'}
              </small>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturesContent({ settings }: { settings: GlobalNewSettingsData | null }) {
  const { lang, isRTL } = useLanguage();

  const items =
    settings?.features_section?.items && settings.features_section.items.length > 0
      ? settings.features_section.items.map(f => ({
          icon: getFeatureIcon(f.icon),
          title: resolveLocalized(f.title, lang),
          text: resolveLocalized(f.text, lang),
        }))
      : featureCards.map(f => ({
          icon: f.icon,
          title: lang === 'en' ? f.titleEn : f.title,
          text: lang === 'en' ? f.textEn : f.text,
        }));

  return (
    <>
      <section className="public-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Integrated Ecosystem' : 'منظومة متكاملة'}
          title={lang === 'en' ? 'Everything Your Property Team Needs' : 'كل ما يحتاجه فريق إدارة الوحدات'}
          text={
            lang === 'en'
              ? 'Modular components working in harmony to streamline hosting operations.'
              : 'مكونات مستقلة ومترابطة يمكن ربطها بالخدمات الخلفية بسهولة.'
          }
        />
        <div className="public-feature-grid">
          {items.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <span>
                <Icon size={24} />
              </span>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link to="/register">
                <span>{lang === 'en' ? 'Try Feature' : 'جرّب الميزة'}</span>
                {isRTL ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <PublicCta
        title={
          lang === 'en'
            ? 'Start Managing Your Units from One Central Place'
            : 'ابدأ بإدارة وحداتك من مكان واحد'
        }
      />
    </>
  );
}

function HowContent({ settings }: { settings: GlobalNewSettingsData | null }) {
  const { lang } = useLanguage();

  const steps =
    settings?.how_it_works_section?.steps && settings.how_it_works_section.steps.length > 0
      ? settings.how_it_works_section.steps.map(s => ({
          number: s.number,
          title: resolveLocalized(s.title, lang),
          text: resolveLocalized(s.text, lang),
        }))
      : howSteps.map(s => ({
          number: s.number,
          title: lang === 'en' ? s.titleEn : s.title,
          text: lang === 'en' ? s.textEn : s.text,
        }));

  return (
    <>
      <section className="public-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Easy Steps' : 'خطوات بسيطة'}
          title={lang === 'en' ? 'From Adding a Unit to Tracking Performance' : 'من إضافة الوحدة إلى متابعة الأداء'}
          text={
            lang === 'en'
              ? 'A straightforward workflow supporting both synced OTAs and standalone operational units.'
              : 'دورة عمل واضحة تدعم الوحدات المتزامنة والوحدات التي تحتاج خدمات دورية فقط.'
          }
        />
        <div className="how-steps">
          {steps.map(step => (
            <article key={step.number}>
              <span>{step.number}</span>
              <div>
                <h2>{step.title}</h2>
                <p>{step.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="management-modes">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Two Ways to Work' : 'طريقتان للعمل'}
          title={
            lang === 'en'
              ? 'Channel Sync & Standalone Operations Side by Side'
              : 'المزامنة والتشغيل المستقل معًا'
          }
        />
        <div>
          <ModeCard
            icon={<RefreshCw size={26} />}
            title={lang === 'en' ? 'Platform-Connected Units' : 'وحدات مرتبطة بالمنصات'}
            points={
              lang === 'en'
                ? [
                    'Receive bookings from supported OTA channels',
                    'Prevent duplicate reservations and conflicts',
                    'Automatically schedule checkout tasks',
                  ]
                : [
                    'استقبال الحجوزات من القنوات المدعومة',
                    'منع التكرار والتعارض',
                    'إنشاء مهام مرتبطة بالمغادرة',
                  ]
            }
          />
          <ModeCard
            icon={<Sparkles size={26} />}
            title={lang === 'en' ? 'Operations & Services Only' : 'وحدات تشغيل وخدمات فقط'}
            points={
              lang === 'en'
                ? [
                    'Add units directly without external channels',
                    'Schedule recurring cleaning and inspections',
                    'No OTA channel accounts required',
                  ]
                : [
                    'إضافة الوحدة يدويًا',
                    'جداول تنظيف وصيانة دورية',
                    'لا تحتاج حسابًا في منصة حجز',
                  ]
            }
          />
        </div>
      </section>

      <PublicCta
        title={
          lang === 'en'
            ? 'Choose the Ideal Workflow for Each Property'
            : 'اختر أسلوب الإدارة المناسب لكل وحدة'
        }
      />
    </>
  );
}

function PricingContent({ packages }: { packages: ApiPackageItem[] | null }) {
  const { lang, isRTL } = useLanguage();

  const displayPlans =
    packages && packages.length > 0
      ? packages.map(pkg => ({
          id: String(pkg.id),
          name: (lang === 'en' ? pkg.name_en : pkg.name_ar) || pkg.name,
          description: (lang === 'en' ? pkg.description_en : pkg.description_ar) || pkg.description || '',
          price: formatPackagePrice(pkg, lang),
          units: formatPackageUnits(pkg, lang),
          badge: formatPackageBadge(pkg, lang),
          features: getPackageFeatures(pkg, lang),
          buttonText: getPackageButtonText(pkg, lang),
          featured: !!pkg.is_popular,
          isCustomPrice: pkg.price === null,
        }))
      : plans.map(p => ({
          id: p.name,
          name: lang === 'en' ? p.nameEn : p.name,
          description: lang === 'en' ? p.descriptionEn : p.description,
          price: p.price === 'تواصل معنا' ? (lang === 'en' ? 'Contact Us' : 'تواصل معنا') : `${p.price} ${lang === 'en' ? 'SAR / month' : 'ر.س / شهريًا'}`,
          units: lang === 'en' ? p.unitsEn : p.units,
          badge: p.featured ? (lang === 'en' ? 'Most Popular' : 'الأكثر اختيارًا') : null,
          features: lang === 'en' ? p.featuresEn : p.features,
          buttonText: p.price === 'تواصل معنا' ? (lang === 'en' ? 'Request a Quote' : 'اطلب عرضًا') : (lang === 'en' ? 'Get Started' : 'ابدأ الآن'),
          featured: p.featured,
          isCustomPrice: p.price === 'تواصل معنا',
        }));

  return (
    <>
      <section className="public-section pricing-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Monthly Subscription' : 'اشتراك شهري'}
          title={lang === 'en' ? 'Plans That Grow With Your Business' : 'باقات تنمو مع أعمالك'}
          text={
            lang === 'en'
              ? 'Transparent pricing with full operational control. Upgrade or modify tiers whenever you scale.'
              : 'أسعار واضحة وباقات مرنة تناسب حجم محفظتك وتساعدك على التوسع بسهولة.'
          }
        />
        <div className="pricing-grid">
          {displayPlans.map(plan => (
            <article className={plan.featured ? 'featured' : ''} key={plan.id}>
              {plan.badge && <em>{plan.badge}</em>}
              <h2>{plan.name}</h2>
              {plan.description && <p>{plan.description}</p>}
              <div className="plan-price">
                <strong>{plan.price}</strong>
              </div>
              {plan.units && <b className="plan-units">{plan.units}</b>}
              <ul>
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx}>
                    <CheckCircle2 size={16} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.isCustomPrice ? '/contact' : '/register'}>
                <span>{plan.buttonText}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <div className="pricing-note">
        <CloudCog size={23} />
        <div>
          <b>
            {lang === 'en'
              ? 'Integrations depend on provider API permissions'
              : 'التكاملات تعتمد على الصلاحيات المتاحة من مزود الخدمة'}
          </b>
          <p>
            {lang === 'en'
              ? 'Each booking channel is verified through official connection protocols and host account credentials.'
              : 'يتم تفعيل كل قناة بعد التحقق من طريقة الربط الرسمية وحساب العميل.'}
          </p>
        </div>
      </div>
    </>
  );
}

function AboutContent({ settings }: { settings: GlobalNewSettingsData | null }) {
  const { lang } = useLanguage();

  const values =
    settings?.about_us?.values && settings.about_us.values.length > 0
      ? settings.about_us.values.map(v => ({
          icon: getFeatureIcon(v.icon),
          title: resolveLocalized(v.title, lang),
          text: resolveLocalized(v.text, lang),
        }))
      : companyValues.map(v => ({
          icon: v.icon,
          title: lang === 'en' ? v.titleEn : v.title,
          text: lang === 'en' ? v.textEn : v.text,
        }));

  return (
    <>
      <section className="public-section about-story">
        <div>
          <span>{lang === 'en' ? 'Our Story' : 'قصتنا'}</span>
          <h2>{lang === 'en' ? 'Born From a Real Daily Challenge' : 'بدأنا من مشكلة يومية بسيطة'}</h2>
          <p>
            {lang === 'en'
              ? 'Managing multiple rental units usually means scattered reservations, cleaning crews, maintenance alerts, and guest messages across different apps. We built BluClean to consolidate these everyday operations into one clean, seamless interface.'
              : 'إدارة عدة وحدات تعني حجوزات متفرقة، فرق تنظيف، بلاغات صيانة ورسائل ضيوف في أماكن مختلفة. لذلك صممنا BluClean ليجمع هذه العمليات في واجهة عربية واحدة وواضحة.'}
          </p>
          <p>
            {lang === 'en'
              ? 'Our goal is not just another screen, but eliminating manual friction and giving you complete, reliable visibility into every property.'
              : 'هدفنا ليس إضافة شاشة جديدة، بل تقليل الخطوات اليدوية وتوفير صورة دقيقة لما يحدث داخل كل وحدة.'}
          </p>
        </div>
        <aside>
          <strong>+500</strong>
          <span>{lang === 'en' ? 'Hosts & Property Managers' : 'مضيف ومدير عقار'}</span>
          <strong>+10,000</strong>
          <span>{lang === 'en' ? 'Completed Work Orders' : 'مهمة تشغيل مكتملة'}</span>
          <strong>+99%</strong>
          <span>{lang === 'en' ? 'Client Satisfaction' : 'معدل رضا العملاء'}</span>
        </aside>
      </section>

      <section className="public-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Our Core Values' : 'قيمنا'}
          title={lang === 'en' ? 'Principles Guiding Everything We Build' : 'المبادئ التي نبني عليها المنتج'}
        />
        <div className="values-grid">
          {values.map(({ icon: Icon, title, text }) => (
            <article key={title}>
              <Icon size={25} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <PublicCta
        title={
          lang === 'en'
            ? 'Join a Smarter, Simpler Hosting Experience'
            : 'انضم إلى تجربة تشغيل أكثر بساطة'
        }
      />
    </>
  );
}

function ContactContent({ settings }: { settings: GlobalNewSettingsData | null }) {
  const { lang, isRTL } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setFeedback(null);

    const res = await submitContactUs({
      name,
      email,
      phone,
      request_type: requestType || 'general',
      message,
    });

    setSubmitting(false);

    if (res.success) {
      setFeedback({
        type: 'success',
        message:
          lang === 'en'
            ? 'Thank you! Your message has been sent successfully. Our team will contact you shortly.'
            : (res.message || 'تم إرسال رسالتك بنجاح، وسنتواصل معك في أقرب وقت.'),
      });
      setName('');
      setEmail('');
      setPhone('');
      setRequestType('');
      setMessage('');
    } else {
      setFeedback({
        type: 'error',
        message:
          res.message ||
          (lang === 'en'
            ? 'Failed to send message, please try again.'
            : 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.'),
      });
    }
  }

  const channels = [
    {
      icon: Headphones,
      title: lang === 'en' ? 'Sales team' : 'فريق المبيعات',
      value: 'sales@bluclean.sa',
      note: lang === 'en' ? 'For plans and business offers' : 'للخطط وعروض الشركات',
    },
    {
      icon: MessageSquareText,
      title: lang === 'en' ? 'Support & help' : 'الدعم والمساعدة',
      value: 'support@bluclean.sa',
      note: lang === 'en' ? 'We reply during business hours' : 'نرد خلال ساعات العمل',
    },
    {
      icon: Home,
      title: lang === 'en' ? 'Office' : 'المكتب',
      value: lang === 'en' ? 'Riyadh, Saudi Arabia' : 'الرياض، المملكة العربية السعودية',
      note: lang === 'en' ? 'Sunday to Thursday' : 'الأحد إلى الخميس',
    },
  ];

  return (
    <section className="public-section contact-layout-grid" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="contact-left-col">
        <span className="contact-badge-pill">
          {lang === 'en' ? 'Ways to reach us' : 'طرق التواصل'}
        </span>
        <h2 className="contact-left-title">
          {lang === 'en' ? 'Pick what works best for you' : 'اختر ما يناسبك'}
        </h2>
        <p className="contact-left-subnote">
          {lang === 'en'
            ? 'This is front-end only for now; sending will be connected to the back end later.'
            : 'نسعد دائماً بتواصلكم المباشر عبر قنواتنا المعتمدة لخدمتكم فوراً.'}
        </p>

        <div className="contact-channels-list">
          {channels.map(({ icon: Icon, title, value, note }) => (
            <div key={title} className="contact-channel-card">
              <span className="contact-channel-icon">
                <Icon size={20} />
              </span>
              <div className="contact-channel-info">
                <span className="contact-channel-label">{title}</span>
                <strong className="contact-channel-val">{value}</strong>
                {note && <small className="contact-channel-note">{note}</small>}
              </div>
            </div>
          ))}
        </div>

        <div className="contact-quick-call">
          <div className="contact-quick-call-icon">
            <Phone size={18} />
          </div>
          <div className="contact-quick-call-text">
            <b>{lang === 'en' ? 'Need a quick reply?' : 'هل تحتاج رداً سريعاً؟'}</b>
            <p>
              {lang === 'en'
                ? "Leave your details and we'll arrange an intro call."
                : 'اترك بياناتك وسنرتب مكالمة تعريفية.'}
            </p>
          </div>
        </div>
      </div>

      <div className="contact-form-container">
        <header className="contact-form-header">
          <div className="contact-form-header-icon">
            <Mail size={22} />
          </div>
          <div>
            <h2 className="contact-form-header-title">
              {lang === 'en' ? 'Send your message' : 'أرسل رسالتك'}
            </h2>
            <p className="contact-form-header-sub">
              {lang === 'en'
                ? 'Fill in your details and we will get in touch.'
                : 'املأ بياناتك وسنتواصل معك.'}
            </p>
          </div>
        </header>

        <form className="contact-form-body" onSubmit={submit}>
          {feedback && (
            <div className={`contact-alert-banner ${feedback.type}`} role="alert">
              {feedback.type === 'success' ? <CheckCircle2 size={18} /> : null}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="contact-field-group">
            <label>{lang === 'en' ? 'Full name' : 'الاسم الكامل'}</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={lang === 'en' ? 'Your name' : 'اسمك الكريم'}
            />
          </div>

          <div className="contact-fields-split">
            <div className="contact-field-group">
              <label>{lang === 'en' ? 'Email' : 'البريد الإلكتروني'}</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="contact-field-group">
              <label>{lang === 'en' ? 'Mobile number' : 'رقم الجوال'}</label>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+966 5X XXX XXXX"
              />
            </div>
          </div>

          <div className="contact-field-group">
            <label>{lang === 'en' ? 'Request type' : 'نوع الطلب'}</label>
            <select
              required
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
            >
              <option value="" disabled>
                {lang === 'en' ? 'Choose a request type' : 'اختر نوع الطلب'}
              </option>
              <option value="demo">{lang === 'en' ? 'Platform demo' : 'عرض توضيحي للمنصة'}</option>
              <option value="pricing">{lang === 'en' ? 'Pricing & plans' : 'الخطط والأسعار'}</option>
              <option value="support">{lang === 'en' ? 'Technical support' : 'الدعم الفني والمساعدة'}</option>
              <option value="partnership">{lang === 'en' ? 'Partnership & business' : 'شراكة وأعمال'}</option>
              <option value="general">{lang === 'en' ? 'General inquiry' : 'استفسار عام'}</option>
            </select>
          </div>

          <div className="contact-field-group">
            <label>{lang === 'en' ? 'Message' : 'الرسالة'}</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={lang === 'en' ? 'How can we help?' : 'كيف يمكننا مساعدتك؟'}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="contact-submit-button"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                <span>{lang === 'en' ? 'Sending...' : 'جارٍ الإرسال...'}</span>
              </>
            ) : (
              <>
                <Send size={16} />
                <span>{lang === 'en' ? 'Send message' : 'إرسال الرسالة'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function SectionTitle({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <header className="public-section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </header>
  );
}

function ModeCard({
  icon,
  title,
  points,
}: {
  icon: ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <article>
      <span>{icon}</span>
      <h3>{title}</h3>
      {points.map(point => (
        <p key={point}>
          <Check size={14} />
          {point}
        </p>
      ))}
    </article>
  );
}

function PublicCta({ title }: { title: string }) {
  const { lang, isRTL } = useLanguage();

  return (
    <section className="public-bottom-cta">
      <div>
        <span>
          <CalendarCheck2 size={22} />
        </span>
        <h2>{title}</h2>
        <p>
          {lang === 'en'
            ? 'Start with simple steps, then enable sync and advanced services when you are ready.'
            : 'ابدأ بخطوات بسيطة، ثم أضف المزامنة والخدمات عندما تحتاجها.'}
        </p>
      </div>
      <Link to="/register">
        <span>{lang === 'en' ? 'Start Free Trial' : 'ابدأ تجربتك'}</span>
        {isRTL ? <ArrowUpLeft size={17} /> : <ArrowUpRight size={17} />}
      </Link>
    </section>
  );
}
