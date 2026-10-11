import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Headphones,
  Home,
  Sparkles,
  Wrench,
  X,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { useLanguage } from '../context/LanguageContext';
import './landing-reference.css';

interface FeatureItem {
  icon: typeof Home;
  title: string;
  titleEn: string;
  text: string;
  textEn: string;
}

const features: FeatureItem[] = [
  {
    icon: Home,
    title: 'إدارة الوحدات',
    titleEn: 'Unit Management',
    text: 'إدارة جميع عقاراتك ووحداتك من مكان واحد',
    textEn: 'Manage all your properties and units in one place',
  },
  {
    icon: CalendarDays,
    title: 'تقويم موحد',
    titleEn: 'Unified Calendar',
    text: 'عرض جميع الحجوزات في تقويم واحد',
    textEn: 'View all bookings across platforms in one calendar',
  },
  {
    icon: Sparkles,
    title: 'إدارة التنظيف',
    titleEn: 'Cleaning Management',
    text: 'طلبات تنظيف تلقائية وتتبع التنفيذ بالصور',
    textEn: 'Automated cleaning orders with photo verification',
  },
  {
    icon: Wrench,
    title: 'صيانة وخدمات إضافية',
    titleEn: 'Maintenance & Services',
    text: 'إدارة طلبات الصيانة والخدمات بسهولة ومرونة',
    textEn: 'Effortlessly manage maintenance orders and add-ons',
  },
  {
    icon: Headphones,
    title: 'محادثات موحدة',
    titleEn: 'Unified Inbox',
    text: 'كل رسائل الضيوف من جميع المنصات في صندوق واحد',
    textEn: 'All guest messages from every channel in one inbox',
  },
  {
    icon: BarChart3,
    title: 'تقارير وتحليلات',
    titleEn: 'Reports & Analytics',
    text: 'تابع الأداء والإشغال والتكاليف بشكل مبسط وواضح',
    textEn: 'Track performance, occupancy, and costs clearly',
  },
];

interface PricingPlan {
  id: string;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  price: string;
  priceEn: string;
  badge?: string;
  badgeEn?: string;
  units: string;
  unitsEn: string;
  features: { ar: string; en: string }[];
  isHighlighted?: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'الأساسية',
    nameEn: 'Basic',
    subtitle: 'للمضيف الفردي والوحدات القليلة',
    subtitleEn: 'For individual hosts and small properties',
    price: '199 ر.س / شهرياً',
    priceEn: '199 SAR / month',
    units: 'حتى 5 وحدات',
    unitsEn: 'Up to 5 units',
    features: [
      { ar: 'إدارة الوحدات والحجوزات', en: 'Units & Bookings Management' },
      { ar: 'تقويم موحد', en: 'Unified Calendar' },
      { ar: 'طلبات تشغيل يدوية', en: 'Manual Operation Orders' },
      { ar: 'تقارير أساسية', en: 'Basic Reports' },
    ],
  },
  {
    id: 'pro',
    name: 'الاحترافية',
    nameEn: 'Professional',
    subtitle: 'للمنشآت والشركات المتوسطة',
    subtitleEn: 'For growing hosts and property firms',
    price: '12500 ر.س / شهرياً',
    priceEn: '12,500 SAR / month',
    badge: 'مهم جداً',
    badgeEn: 'Most Popular',
    isHighlighted: true,
    units: 'حتى 14 وحدات',
    unitsEn: 'Up to 14 units',
    features: [
      { ar: 'جميع مميزات الباقة الأساسية', en: 'All Basic Plan features' },
      { ar: 'ربط منصات الحجز تلقائياً', en: 'Automatic channel sync' },
      { ar: 'تشغيل تلقائي بعد المغادرة', en: 'Auto cleaning on checkout' },
      { ar: 'تقارير متقدمة ودعم أولوية', en: 'Advanced reports & priority support' },
    ],
  },
  {
    id: 'enterprise',
    name: 'الأعمال',
    nameEn: 'Enterprise',
    subtitle: 'للشركات والمحافظ الكبيرة',
    subtitleEn: 'For large portfolios and enterprises',
    price: '1 ر.س / شهرياً',
    priceEn: 'Custom / month',
    units: 'وحدات غير محدودة',
    unitsEn: 'Unlimited units',
    features: [
      { ar: 'إعداد مخصص للمنشأة', en: 'Custom organizational setup' },
      { ar: 'صلاحيات فرق متقدمة', en: 'Advanced team permissions' },
      { ar: 'تكاملات وتقارير مخصصة', en: 'Custom integrations & reports' },
      { ar: 'مدير نجاح مخصص', en: 'Dedicated account manager' },
    ],
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
  const [pricingDot, setPricingDot] = useState(3);

  const activeTestimonial = testimonials[testimonialIdx];

  return (
    <div className="reference-landing" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />

      <main id="top">
        {/* HERO SECTION - Centered per screenshot media_1791383493058.png */}
        <section className="reference-hero-centered">
          <div className="reference-hero-container">
            <div className="reference-eyebrow-pill">
              {lang === 'en'
                ? 'The Integrated Platform for Residential Unit Management & Operations'
                : 'المنصة المتكاملة لإدارة وتشغيل الوحدات السكنية'}
            </div>

            <h1 className="reference-hero-title">
              Easier unit management,
              <br />
              more professional operations
            </h1>

            <p className="reference-hero-desc">
              BluClean helps you manage bookings from every platform and organize cleaning, maintenance and guest communication in one place.
            </p>

            <div className="reference-hero-cta-row">
              <Link className="reference-btn-primary" to="/register">
                <span>{lang === 'en' ? 'Get Started' : 'ابدأ الآن'}</span>
                {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
              </Link>
              <button
                className="reference-btn-video"
                type="button"
                onClick={() => setShowVideoModal(true)}
              >
                <CirclePlay size={18} />
                <span>{lang === 'en' ? 'Watch Video' : 'شاهد الفيديو'}</span>
              </button>
            </div>

            <div className="reference-trust-list">
              <span className="trust-item">
                <i className="trust-icon"><Check size={12} strokeWidth={3} /></i>
                <span>{lang === 'en' ? 'No Complexity' : 'بدون تعقيد'}</span>
              </span>
              <span className="trust-item">
                <i className="trust-icon"><Check size={12} strokeWidth={3} /></i>
                <span>{lang === 'en' ? 'Quick Setup' : 'إعداد سريع'}</span>
              </span>
              <span className="trust-item">
                <i className="trust-icon"><Check size={12} strokeWidth={3} /></i>
                <span>{lang === 'en' ? 'Arabic & English Support' : 'دعم باللغة العربية'}</span>
              </span>
            </div>
          </div>
        </section>

        {/* PLATFORMS INTEGRATION BOX */}
        <section id="how" className="reference-platforms-section">
          <div className="reference-platforms-card">
            <div className="platforms-heading">
              <h2>{lang === 'en' ? 'Integrated with Top Booking Channels' : 'تكامل مع أهم منصات الحجز'}</h2>
              <p>{lang === 'en' ? 'Consolidate all your bookings in one place' : 'اجمع كل حجوزاتك في مكان واحد'}</p>
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
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="reference-feature-col">
                  <div className="feature-icon-circle">
                    <Icon size={26} strokeWidth={1.8} />
                  </div>
                  <h3>{lang === 'en' ? feat.titleEn : feat.title}</h3>
                  <p>{lang === 'en' ? feat.textEn : feat.text}</p>
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
                <p className="proof-quote-text">
                  {lang === 'en' ? activeTestimonial.quoteEn : activeTestimonial.quote}
                </p>
                <span className="proof-quote-author">
                  {lang === 'en' ? activeTestimonial.authorEn : activeTestimonial.author}
                </span>
                <div className="proof-dots-row">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`proof-dot ${i === testimonialIdx ? 'active' : ''}`}
                      onClick={() => setTestimonialIdx(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="proof-vertical-divider" />

            {/* Stats block */}
            <div className="proof-stats-grid">
              <div className="proof-stat-item">
                <strong className="stat-number">+99%</strong>
                <span className="stat-label">{lang === 'en' ? 'Customer Satisfaction' : 'معدل رضا العملاء'}</span>
              </div>
              <div className="proof-stat-item">
                <strong className="stat-number">+50,000</strong>
                <span className="stat-label">{lang === 'en' ? 'Happy Guests' : 'ضيف سعيد'}</span>
              </div>
              <div className="proof-stat-item">
                <strong className="stat-number">+10,000</strong>
                <span className="stat-label">{lang === 'en' ? 'Completed Cleanings' : 'مهمة تنظيف مكتملة'}</span>
              </div>
              <div className="proof-stat-item">
                <strong className="stat-number">+500</strong>
                <span className="stat-label">{lang === 'en' ? 'Trusted Hosts' : 'مضيف يثق بنا'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING SECTION - Matches screenshot media_1791383493058.png */}
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

            {/* 3 Pricing Cards */}
            <div className="pricing-cards-grid">
              {pricingPlans.map(plan => (
                <div
                  key={plan.id}
                  className={`pricing-card ${plan.isHighlighted ? 'highlighted' : ''}`}
                >
                  {plan.badge && (
                    <div className="pricing-badge-pill">
                      <Sparkles size={12} />
                      <span>{lang === 'en' ? plan.badgeEn : plan.badge}</span>
                    </div>
                  )}

                  <div className="pricing-card-top">
                    <h3 className="plan-name">{lang === 'en' ? plan.nameEn : plan.name}</h3>
                    <p className="plan-sub">{lang === 'en' ? plan.subtitleEn : plan.subtitle}</p>
                  </div>

                  <div className="pricing-card-price">
                    <strong>{lang === 'en' ? plan.priceEn : plan.price}</strong>
                  </div>

                  <div className="plan-unit-limit">
                    <span>{lang === 'en' ? plan.unitsEn : plan.units}</span>
                  </div>

                  <ul className="plan-features-list">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx}>
                        <i className="feature-check"><Check size={12} strokeWidth={2.5} /></i>
                        <span>{lang === 'en' ? feat.en : feat.ar}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pricing-card-btn-wrap">
                    <Link
                      to="/register"
                      className="pricing-card-btn"
                    >
                      <span>
                        {plan.id === 'basic'
                          ? (lang === 'en' ? 'Start Now' : 'ابدأ الآن')
                          : (lang === 'en' ? 'Subscribe Now' : 'اشترك الآن')}
                      </span>
                      {isRTL ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls per screenshot */}
            <div className="pricing-pagination-row">
              <button
                type="button"
                className="pricing-arrow-btn"
                onClick={() => setPricingDot(prev => (prev > 0 ? prev - 1 : 3))}
                aria-label="Previous plans"
              >
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <div className="pricing-dots-group">
                {[0, 1, 2, 3].map(d => (
                  <button
                    key={d}
                    type="button"
                    className={`pricing-dot ${d === pricingDot ? 'active' : ''}`}
                    onClick={() => setPricingDot(d)}
                    aria-label={`Page ${d + 1}`}
                  />
                ))}
              </div>
              <button
                type="button"
                className="pricing-arrow-btn"
                onClick={() => setPricingDot(prev => (prev < 3 ? prev + 1 : 0))}
                aria-label="Next plans"
              >
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
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
