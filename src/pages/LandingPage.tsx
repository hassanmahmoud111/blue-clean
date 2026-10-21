import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Headphones,
  Home,
  MessageSquareText,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UsersRound,
  Wrench,
  X,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { PublicLoadingScreen } from '../components/PublicLoadingScreen';
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
  type ApiPackageItem,
  type GlobalNewSettingsData,
} from '../services/landingService';
import './landing-reference.css';

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

const defaultFeatures = [
  {
    icon: Home,
    title: 'إدارة الوحدات',
    titleEn: 'Unit management',
    text: 'إدارة جميع عقاراتك ووحداتك من مكان واحد',
    textEn: 'Manage all your properties and units from one place',
  },
  {
    icon: CalendarDays,
    title: 'تقويم موحد',
    titleEn: 'Unified calendar',
    text: 'عرض جميع الحجوزات في تقويم واحد',
    textEn: 'See every booking in a single calendar',
  },
  {
    icon: Sparkles,
    title: 'إدارة التنظيف',
    titleEn: 'Cleaning management',
    text: 'طلبات تنظيف تلقائية وتتبع التنفيذ بالصور',
    textEn: 'Automatic cleaning requests with photo-tracked completion',
  },
  {
    icon: Wrench,
    title: 'صيانة وخدمات إضافية',
    titleEn: 'Maintenance & extra services',
    text: 'إدارة طلبات الصيانة والخدمات بسهولة ومرونة',
    textEn: 'Handle maintenance and service requests easily and flexibly',
  },
  {
    icon: Headphones,
    title: 'محادثات موحدة',
    titleEn: 'Unified conversations',
    text: 'كل رسائل الضيوف من جميع المنصات في صندوق واحد',
    textEn: 'Every guest message from every platform in one inbox',
  },
  {
    icon: BarChart3,
    title: 'تقارير وتحليلات',
    titleEn: 'Reports & analytics',
    text: 'تابع الأداء والإشغال والتكاليف بشكل مبسط وواضح',
    textEn: 'Track performance, occupancy and costs simply and clearly',
  },
];

const fallbackPricingPlans = [
  {
    id: 'basic',
    name: 'الأساسية',
    subtitle: 'للمضيف الفردي والوحدات القليلة',
    price: '199 ر.س / شهرياً',
    badge: null as string | null,
    units: 'حتى 5 وحدات',
    features: [
      'إدارة الوحدات والحجوزات',
      'تقويم موحد',
      'طلبات تشغيل يدوية',
      'تقارير أساسية',
    ],
    buttonText: 'ابدأ الآن',
    isHighlighted: false,
    isCustomPrice: false,
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    subtitle: 'للمنشآت والشركات المتوسطة',
    price: '599 ر.س / شهرياً',
    badge: 'الأكثر اختيارًا',
    units: 'حتى 50 وحدة',
    features: [
      'جميع مميزات الباقة الأساسية',
      'ربط منصات الحجز تلقائياً',
      'تشغيل تلقائي بعد المغادرة',
      'تقارير متقدمة ودعم أولوية',
    ],
    buttonText: 'ابدأ الآن',
    isHighlighted: true,
    isCustomPrice: false,
  },
  {
    id: 'enterprise',
    name: 'الأعمال',
    subtitle: 'للشركات والمحافظ الكبيرة',
    price: 'تواصل معنا',
    badge: null as string | null,
    units: 'وحدات غير محدودة',
    features: [
      'إعداد مخصص للمنشأة',
      'صلاحيات فرق متقدمة',
      'تكاملات وتقارير مخصصة',
      'مدير نجاح مخصص',
    ],
    buttonText: 'اطلب عرضًا',
    isHighlighted: false,
    isCustomPrice: true,
  },
];

const testimonials = [
  {
    quote: 'BluClean وفّر علينا وقت كبير وساعدنا في تقديم تجربة أفضل لضيوفنا.',
    quoteEn: 'BluClean saved us immense time and helped us deliver a superior guest experience.',
    author: 'أحد عملائنا',
    authorEn: 'One of our hosts',
  },
  {
    quote: 'إدارة عمليات النظافة والصيانة أصبحت مؤتمتة وسريعة بشكل لا يصدق.',
    quoteEn: 'Cleaning and maintenance workflows are now remarkably automated and prompt.',
    author: 'مدير تشغيل عقارات',
    authorEn: 'Property Operations Manager',
  },
  {
    quote: 'التقويم الموحد منع أي تعارض في الحجوزات بين المنصات المختلفة.',
    quoteEn: 'The unified calendar completely eliminated booking conflicts across channels.',
    author: 'مستثمر شقق فندقية',
    authorEn: 'Serviced Apartments Owner',
  },
  {
    quote: 'فريق الدعم الفني باللغة العربية متجاوب ومحترف لأقصى درجة.',
    quoteEn: 'The Arabic and English support team is incredibly responsive and professional.',
    author: 'مضيف معتمد',
    authorEn: 'Superhost',
  },
  {
    quote: 'التقارير المالية والتشغيلية منحتنا رؤية شاملة ودقيقة لأداء كل وحدة.',
    quoteEn: 'Operational reports gave us complete visibility into the revenue of each unit.',
    author: 'شركة إدارة أملاك',
    authorEn: 'Property Management Firm',
  },
];

export default function LandingPage() {
  const { lang, isRTL } = useLanguage();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [pricingDot, setPricingDot] = useState(0);

  const [settings, setSettings] = useState<GlobalNewSettingsData | null>(null);
  const [packages, setPackages] = useState<ApiPackageItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchGlobalNewSettings(), fetchGlobalPackages()])
      .then(([s, p]) => {
        if (!mounted) return;
        if (s) setSettings(s);
        if (p && p.length > 0) setPackages(p);
      })
      .catch(err => {
        console.warn('API fetch error on LandingPage:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const seoTitle = resolveLocalized(settings?.seo_section?.title, lang);
    if (seoTitle) {
      document.title = seoTitle;
    }
  }, [settings, lang]);

  const activeTestimonial = testimonials[testimonialIdx];

  // Dynamic hero texts
  const heroEyebrow =
    resolveLocalized(settings?.hero_section?.eyebrow, lang) ||
    (lang === 'en'
      ? 'The all-in-one platform to manage and operate residential units'
      : 'المنصة المتكاملة لإدارة وتشغيل الوحدات السكنية');

  const heroTitle =
    lang === 'ar'
      ? (settings?.hero_section?.title_ar ||
         resolveLocalized(settings?.landing?.hero?.title || settings?.hero_section?.title, 'ar') ||
         'إدارة وحداتك أسهل\nوتشغيلها أكثر احترافية')
      : (settings?.hero_section?.title_en ||
         resolveLocalized(settings?.landing?.hero?.title || settings?.hero_section?.title, 'en') ||
         'Easier unit management,\nmore professional operations');

  const heroDesc =
    lang === 'ar'
      ? (settings?.hero_section?.subtitle_ar ||
         resolveLocalized(settings?.landing?.hero?.description || settings?.hero_section?.description, 'ar') ||
         'BluClean يساعدك على إدارة حجوزاتك من جميع المنصات، وتنظيم أعمال التنظيف والصيانة والتواصل مع الضيوف في مكان واحد.')
      : (settings?.hero_section?.subtitle_en ||
         resolveLocalized(settings?.landing?.hero?.description || settings?.hero_section?.description, 'en') ||
         'BluClean helps you manage bookings from every platform and organize cleaning, maintenance and guest communication in one place.');

  const heroCtaLabel = lang === 'en' ? 'Get started' : 'ابدأ الآن';
  const heroCtaHref = settings?.hero_section?.primaryCta?.href || '/register';

  const heroBenefits =
    lang === 'ar'
      ? ['دعم باللغة العربية', 'إعداد سريع', 'بدون تعقيد']
      : ['No complexity', 'Quick setup', 'Arabic-language support'];

  const heroImage =
    settings?.hero_section?.image ||
    settings?.landing?.hero?.image ||
    '/bluclean-home-reference.png';

  const heroImageAlt =
    lang === 'en'
      ? 'The BluClean dashboard on a laptop and phone inside a residential unit'
      : 'لوحة BluClean على الحاسوب والهاتف داخل وحدة سكنية';

  // Dynamic platforms
  const platformsTitle =
    lang === 'ar'
      ? (resolveLocalized(settings?.platforms_section?.title, 'ar') || 'تتكامل مع أهم منصات الحجز')
      : (resolveLocalized(settings?.platforms_section?.title, 'en') || 'Integrates with the leading booking platforms');

  const platformsSubtitle =
    lang === 'ar'
      ? (resolveLocalized(settings?.platforms_section?.subtitle, 'ar') || 'اجمع كل حجوزاتك في مكان واحد')
      : (resolveLocalized(settings?.platforms_section?.subtitle, 'en') || 'Bring all your bookings into one place');

  // Dynamic features
  const displayFeatures =
    settings?.features_section?.items && settings.features_section.items.length > 0
      ? settings.features_section.items.map(item => ({
          icon: getFeatureIcon(item.icon),
          title: resolveLocalized(item.title, lang),
          text: resolveLocalized(item.text, lang),
        }))
      : defaultFeatures.map(item => ({
          icon: item.icon,
          title: lang === 'en' ? item.titleEn : item.title,
          text: lang === 'en' ? item.textEn : item.text,
        }));

  // Dynamic proof & stats
  const proofStats =
    settings?.testimonial_section?.stats && settings.testimonial_section.stats.length > 0
      ? settings.testimonial_section.stats.map(s => ({
          id: s.id,
          value: s.value,
          label: resolveLocalized(s.label, lang),
        }))
      : [
          { id: '1', value: '+99%', label: lang === 'en' ? 'Customer Satisfaction' : 'معدل رضا العملاء' },
          { id: '2', value: '+50,000', label: lang === 'en' ? 'Happy Guests' : 'ضيف سعيد' },
          { id: '3', value: '+10,000', label: lang === 'en' ? 'Completed Cleanings' : 'مهمة تنظيف مكتملة' },
          { id: '4', value: '+500', label: lang === 'en' ? 'Trusted Hosts' : 'مضيف يثق بنا' },
        ];

  const proofQuote =
    resolveLocalized(settings?.testimonial_section?.quote, lang) ||
    (lang === 'en' ? activeTestimonial.quoteEn : activeTestimonial.quote);

  const proofAuthor =
    resolveLocalized(settings?.testimonial_section?.author, lang) ||
    (lang === 'en' ? activeTestimonial.authorEn : activeTestimonial.author);

  // Dynamic packages
  const displayPlans =
    packages && packages.length > 0
      ? packages.map(pkg => ({
          id: String(pkg.id),
          name: (lang === 'en' ? pkg.name_en : pkg.name_ar) || pkg.name,
          subtitle: (lang === 'en' ? pkg.description_en : pkg.description_ar) || pkg.description || '',
          price: formatPackagePrice(pkg, lang),
          badge: formatPackageBadge(pkg, lang),
          units: formatPackageUnits(pkg, lang),
          features: getPackageFeatures(pkg, lang),
          buttonText: getPackageButtonText(pkg, lang),
          isHighlighted: !!pkg.is_popular,
          isCustomPrice: pkg.price === null,
        }))
      : fallbackPricingPlans;

  const [containerWidth, setContainerWidth] = useState(0);
  const pricingContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!pricingContainerRef.current) return;
    const el = pricingContainerRef.current;
    const updateWidth = () => {
      setContainerWidth(el.clientWidth);
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading]);

  const getCardsPerView = (w: number) => {
    if (w < 680) return 1;
    if (w < 1024) return 2;
    return 3;
  };

  const cardsPerView = containerWidth > 0 ? getCardsPerView(containerWidth) : 3;
  const pricingGap = containerWidth > 0 && containerWidth < 680 ? 16 : 24;
  const cardWidth =
    containerWidth > 0
      ? Math.floor((containerWidth - (cardsPerView - 1) * pricingGap) / cardsPerView)
      : 0;

  const maxIndex = Math.max(0, displayPlans.length - cardsPerView);
  const totalPages = maxIndex + 1;
  const activeDot = Math.min(pricingDot, maxIndex);
  const shiftPx = activeDot * (cardWidth + pricingGap);

  const handleNextPlan = () => {
    setPricingDot(prev => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrevPlan = () => {
    setPricingDot(prev => (prev > 0 ? prev - 1 : maxIndex));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        if (isRTL) handleNextPlan();
        else handlePrevPlan();
      } else {
        if (isRTL) handlePrevPlan();
        else handleNextPlan();
      }
    }
  };

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div className="reference-landing" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      <main id="top">
        {/* HERO SECTION - Split 2-Column Layout Matching Screenshots */}
        <section className="reference-hero">
          <div className="reference-hero-copy">
            <span className="reference-eyebrow">{heroEyebrow}</span>

            <h1 style={{ whiteSpace: 'pre-line' }}>
              {heroTitle}
            </h1>

            <p style={{ whiteSpace: 'pre-line' }}>
              {heroDesc}
            </p>

            <div className="reference-hero-buttons">
              <Link className="reference-primary-cta" to={heroCtaHref}>
                <span>{heroCtaLabel}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
            </div>

            <div className="reference-benefits">
              {heroBenefits.map((benefit, bIdx) => (
                <span key={bIdx}>
                  <i><Check size={12} strokeWidth={3} /></i>
                  <span>{benefit}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="reference-hero-visual" aria-label={heroImageAlt}>
            <img src={heroImage} alt={heroImageAlt} />
          </div>
        </section>

        {/* PLATFORMS INTEGRATION BOX */}
        <section id="how" className="reference-platforms-section">
          <div className="reference-platforms-card">
            <div className="platforms-heading">
              <h2>{platformsTitle}</h2>
              <p>{platformsSubtitle}</p>
            </div>

            <div className="platforms-divider" />

            <div className="platforms-badges-row">
              <div className="platform-pill booking">
                <span className="platform-icon-booking">B.</span>
                <span className="platform-name">Booking<b>.com</b></span>
              </div>
              <div className="platform-pill airbnb">
                <span className="platform-icon-airbnb">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.12 2.5 7.66 6.07 9.17.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A10.02 10.02 0 0022 12c0-5.52-4.48-10-10-10z" />
                  </svg>
                </span>
                <span className="platform-name">airbnb</span>
              </div>
              <div className="platform-pill gathern">
                <span className="platform-icon-gathern">G</span>
                <span className="platform-name">Gathern</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6 FEATURES GRID IN SINGLE ROW */}
        <section id="features" className="reference-features-section">
          <div className="reference-features-row">
            {displayFeatures.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="reference-feature-col">
                  <div className="feature-icon-circle">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <h3>{feat.title}</h3>
                  <p>{feat.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SOCIAL PROOF & STATS STRIP */}
        <section id="about" className="reference-proof-strip">
          <div className="reference-proof-container">
            {/* Quote block */}
            <div className="proof-quote-block">
              <span className="proof-quote-symbol">”</span>
              <div className="proof-quote-content">
                <p className="proof-quote-text">{proofQuote}</p>
                <span className="proof-quote-author">{proofAuthor}</span>
              </div>
            </div>

            <div className="proof-vertical-divider" />

            {/* Stats block */}
            <div className="proof-stats-grid">
              {proofStats.map(stat => (
                <div key={stat.id} className="proof-stat-item">
                  <strong className="stat-number">{stat.value}</strong>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section id="pricing" className="reference-pricing-section">
          <div className="reference-pricing-container">
            <div className="pricing-section-header">
              <span className="pricing-eyebrow-tag">
                {lang === 'en' ? 'Plans & Pricing' : 'الباقات والأسعار'}
              </span>
              <h2>{lang === 'en' ? 'Choose the Plan that Fits Your Business' : 'اختر الباقة المناسبة لحجم أعمالك'}</h2>
              <p>
                {lang === 'en'
                  ? 'Start with what you need today, and upgrade seamlessly as your unit count or team grows.'
                  : 'ابدأ بما تحتاجه اليوم، ويمكنك الترقية عندما يزيد عدد وحداتك أو فريقك.'}
              </p>
            </div>

            {/* Pricing Cards Carousel */}
            <div
              className="pricing-carousel-wrapper"
              ref={pricingContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="pricing-cards-track"
                style={{
                  transform: isRTL ? `translateX(${shiftPx}px)` : `translateX(-${shiftPx}px)`,
                  transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)',
                  gap: `${pricingGap}px`,
                }}
              >
                {displayPlans.map(plan => (
                  <div
                    key={plan.id}
                    className={`pricing-card ${plan.isHighlighted ? 'highlighted' : ''}`}
                    style={
                      cardWidth > 0
                        ? {
                            width: `${cardWidth}px`,
                            flex: `0 0 ${cardWidth}px`,
                            minWidth: `${cardWidth}px`,
                            maxWidth: `${cardWidth}px`,
                          }
                        : undefined
                    }
                  >
                    {plan.badge && (
                      <div className="pricing-badge-pill">
                        <Sparkles size={12} />
                        <span>{plan.badge}</span>
                      </div>
                    )}

                    <div className="pricing-card-top">
                      <h3 className="plan-name">{plan.name}</h3>
                      {plan.subtitle && <p className="plan-sub">{plan.subtitle}</p>}
                    </div>

                    <div className="pricing-card-price">
                      <strong>{plan.price}</strong>
                    </div>

                    {plan.units && (
                      <div className="plan-unit-limit">
                        <span>{plan.units}</span>
                      </div>
                    )}

                    <ul className="plan-features-list">
                      {plan.features.map((feat, fIdx) => (
                        <li key={fIdx}>
                          <i className="feature-check"><Check size={12} strokeWidth={2.5} /></i>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="pricing-card-btn-wrap">
                      <Link
                        to={plan.isCustomPrice ? '/contact' : '/register'}
                        className="pricing-card-btn"
                      >
                        <span>{plan.buttonText}</span>
                        {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pricing-pagination-row">
                <button
                  type="button"
                  className="pricing-arrow-btn"
                  onClick={handlePrevPlan}
                  aria-label="Previous plans"
                >
                  {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
                <div className="pricing-dots-group">
                  {Array.from({ length: totalPages }).map((_, d) => (
                    <button
                      key={d}
                      type="button"
                      className={`pricing-dot ${d === activeDot ? 'active' : ''}`}
                      onClick={() => setPricingDot(d)}
                      aria-label={`Page ${d + 1}`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="pricing-arrow-btn"
                  onClick={handleNextPlan}
                  aria-label="Next plans"
                >
                  {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* Video Modal */}
      {showVideoModal && (
        <div className="reference-video-modal-overlay" onClick={() => setShowVideoModal(false)}>
          <div className="reference-video-modal-body" onClick={e => e.stopPropagation()}>
            <div className="video-modal-head">
              <h3>{lang === 'en' ? 'BluClean Platform Walkthrough' : 'جولة تعريفية حول منصة BluClean'}</h3>
              <button
                type="button"
                className="video-modal-close"
                onClick={() => setShowVideoModal(false)}
                aria-label="إغلاق الفيديو"
              >
                <X size={18} />
              </button>
            </div>
            <div className="video-modal-player-wrap">
              <div className="video-placeholder-content">
                <CirclePlay size={56} className="play-pulse-icon" />
                <h4>{lang === 'en' ? 'Smart Unit & Booking Operations' : 'تشغيل ذكي للوحدات والحجوزات'}</h4>
                <p>
                  {lang === 'en'
                    ? 'Watch how BluClean automates checkouts, cleaning tasks, and unified guest communication.'
                    : 'شاهد كيف تدير الوحدات، تجدول التنظيف والصيانة تلقائياً، وتوحد رسائل الضيوف في مكان واحد.'}
                </p>
                <Link to="/register" className="video-modal-action-btn" onClick={() => setShowVideoModal(false)}>
                  {lang === 'en' ? 'Start Free Trial' : 'ابدأ تجربتك المجانية'}
                  {isRTL ? <ArrowLeft size={15} /> : <ArrowRight size={15} />}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
