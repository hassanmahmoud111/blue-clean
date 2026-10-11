import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpLeft,
  ArrowUpRight,
  CalendarCheck2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudCog,
  Mail,
  Phone,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { companyValues, contactChannels, featureCards, howSteps, plans } from '../data/publicPages';
import { useLanguage } from '../context/LanguageContext';
import './landing-reference.css';
import './public-pages.css';

export type PublicPageKind = 'features' | 'how' | 'pricing' | 'about' | 'contact';

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
    eyebrowEn: 'We Are Here to Help',
    titleAr: 'تواصل معنا',
    titleEn: 'Contact Our Team',
    descAr: 'أرسل سؤالك أو اطلب عرضًا توضيحيًا، وسيتواصل معك الفريق في أقرب وقت.',
    descEn: 'Send us your inquiry or request a demo, and our team will get back to you promptly.',
  },
};

export default function PublicPage({ kind }: { kind: PublicPageKind }) {
  const { lang, isRTL } = useLanguage();
  const meta = pageMeta[kind];

  return (
    <div className="reference-landing public-site-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <PublicHeader />
      <main>
        <section className={`public-page-hero ${kind}`}>
          <div>
            <span>{lang === 'en' ? meta.eyebrowEn : meta.eyebrowAr}</span>
            <h1>{lang === 'en' ? meta.titleEn : meta.titleAr}</h1>
            <p>{lang === 'en' ? meta.descEn : meta.descAr}</p>
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

        {kind === 'features' && <FeaturesContent />}
        {kind === 'how' && <HowContent />}
        {kind === 'pricing' && <PricingContent />}
        {kind === 'about' && <AboutContent />}
        {kind === 'contact' && <ContactContent />}
      </main>
      <PublicFooter />
    </div>
  );
}

function HeroVisual({ kind }: { kind: PublicPageKind }) {
  const { lang } = useLanguage();

  const labels =
    kind === 'pricing'
      ? lang === 'en'
        ? ['Flexible Plans', 'No Hidden Fees', 'Upgrade Anytime']
        : ['باقة مرنة', 'بدون رسوم مخفية', 'ترقية في أي وقت']
      : kind === 'contact'
      ? lang === 'en'
        ? ['Bilingual Support', 'Rapid Response', 'Dedicated Team']
        : ['دعم عربي', 'رد سريع', 'فريق متخصص']
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

function FeaturesContent() {
  const { lang, isRTL } = useLanguage();

  return (
    <>
      <section className="public-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Integrated Ecosystem' : 'منظومة متكاملة'}
          title={lang === 'en' ? 'Everything Your Property Team Needs' : 'كل ما يحتاجه فريق إدارة الوحدات'}
          text={
            lang === 'en'
              ? 'Modular components working in harmony to streamline hosting operations.'
              : 'مكونات مستقلة ومترابطة يمكن ربطها بالخدمات الخلفية لاحقًا بسهولة.'
          }
        />
        <div className="public-feature-grid">
          {featureCards.map(({ icon: Icon, title, titleEn, text, textEn }) => (
            <article key={title}>
              <span>
                <Icon size={24} />
              </span>
              <h2>{lang === 'en' ? titleEn : title}</h2>
              <p>{lang === 'en' ? textEn : text}</p>
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

function HowContent() {
  const { lang } = useLanguage();

  return (
    <>
      <section className="public-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Five Easy Steps' : 'خمس خطوات'}
          title={lang === 'en' ? 'From Adding a Unit to Tracking Performance' : 'من إضافة الوحدة إلى متابعة الأداء'}
          text={
            lang === 'en'
              ? 'A straightforward workflow supporting both synced OTAs and standalone operational units.'
              : 'دورة عمل واضحة تدعم الوحدات المتزامنة والوحدات التي تحتاج خدمات دورية فقط.'
          }
        />
        <div className="how-steps">
          {howSteps.map(step => (
            <article key={step.number}>
              <span>{step.number}</span>
              <div>
                <h2>{lang === 'en' ? step.titleEn : step.title}</h2>
                <p>{lang === 'en' ? step.textEn : step.text}</p>
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

function PricingContent() {
  const { lang, isRTL } = useLanguage();

  return (
    <>
      <section className="public-section pricing-section">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Monthly Subscription' : 'اشتراك شهري'}
          title={lang === 'en' ? 'Plans That Grow With Your Business' : 'باقات تنمو مع أعمالك'}
          text={
            lang === 'en'
              ? 'Transparent pricing with full operational control. Upgrade or modify tiers whenever you scale.'
              : 'الأسعار المعروضة تجريبية للواجهة حاليًا ويمكن ربطها بنظام الفوترة لاحقًا.'
          }
        />
        <div className="pricing-grid">
          {plans.map(plan => (
            <article className={plan.featured ? 'featured' : ''} key={plan.name}>
              {plan.featured && <em>{lang === 'en' ? 'Most Popular' : 'الأكثر اختيارًا'}</em>}
              <h2>{lang === 'en' ? plan.nameEn : plan.name}</h2>
              <p>{lang === 'en' ? plan.descriptionEn : plan.description}</p>
              <div className="plan-price">
                {plan.price === 'تواصل معنا' ? (
                  <strong>{lang === 'en' ? 'Contact Us' : 'تواصل معنا'}</strong>
                ) : (
                  <>
                    <strong>{plan.price}</strong>
                    <span>{lang === 'en' ? 'SAR / month' : 'ر.س / شهريًا'}</span>
                  </>
                )}
              </div>
              <b className="plan-units">{lang === 'en' ? plan.unitsEn : plan.units}</b>
              <ul>
                {(lang === 'en' ? plan.featuresEn : plan.features).map(feature => (
                  <li key={feature}>
                    <CheckCircle2 size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={plan.price === 'تواصل معنا' ? '/contact' : '/register'}>
                <span>
                  {plan.price === 'تواصل معنا'
                    ? lang === 'en'
                      ? 'Request a Quote'
                      : 'اطلب عرضًا'
                    : lang === 'en'
                    ? 'Get Started'
                    : 'ابدأ الآن'}
                </span>
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

function AboutContent() {
  const { lang } = useLanguage();

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
          {companyValues.map(({ icon: Icon, title, titleEn, text, textEn }) => (
            <article key={title}>
              <Icon size={25} />
              <h3>{lang === 'en' ? titleEn : title}</h3>
              <p>{lang === 'en' ? textEn : text}</p>
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

function ContactContent() {
  const { lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="public-section contact-layout">
      <div className="contact-channels">
        <SectionTitle
          eyebrow={lang === 'en' ? 'Get in Touch' : 'طرق التواصل'}
          title={lang === 'en' ? 'Choose the Most Convenient Channel' : 'اختر الطريقة الأنسب لك'}
          text={
            lang === 'en'
              ? 'Send your inquiry and our dedicated team will assist you shortly.'
              : 'أرسل استفسارك وسيتواصل معك فريقنا المتخصص لمساعدتك.'
          }
        />
        {contactChannels.map(({ icon: Icon, title, titleEn, value, note, noteEn }) => (
          <article key={title}>
            <span>
              <Icon size={21} />
            </span>
            <div>
              <h2>{lang === 'en' ? titleEn : title}</h2>
              <b>{value}</b>
              <p>{lang === 'en' ? noteEn : note}</p>
            </div>
          </article>
        ))}
        <div className="contact-quick">
          <Phone size={20} />
          <span>
            <b>{lang === 'en' ? 'Need a Quick Callback?' : 'هل تحتاج ردًا سريعًا؟'}</b>
            <p>
              {lang === 'en'
                ? 'Leave your contact details and we will schedule an intro call.'
                : 'اترك بياناتك وسنرتب مكالمة تعريفية.'}
            </p>
          </span>
        </div>
      </div>

      <form className="contact-form" onSubmit={submit}>
        <header>
          <Mail size={24} />
          <div>
            <h2>{lang === 'en' ? 'Send Us a Message' : 'أرسل رسالتك'}</h2>
            <p>
              {lang === 'en'
                ? 'Fill in your details and our team will be in touch.'
                : 'املأ البيانات وسنتواصل معك.'}
            </p>
          </div>
        </header>

        <label>
          {lang === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
          <input required placeholder={lang === 'en' ? 'Enter your full name' : 'اكتب اسمك'} />
        </label>

        <div>
          <label>
            {lang === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}
            <input required type="email" placeholder="name@example.com" />
          </label>
          <label>
            {lang === 'en' ? 'Phone Number *' : 'رقم الجوال *'}
            <input required type="tel" placeholder="+966 5X XXX XXXX" />
          </label>
        </div>

        <label>
          {lang === 'en' ? 'Inquiry Type *' : 'نوع الطلب *'}
          <select defaultValue="" required>
            <option value="" disabled>
              {lang === 'en' ? 'Select inquiry type' : 'اختر نوع الطلب'}
            </option>
            <option>{lang === 'en' ? 'Platform Demo' : 'عرض توضيحي'}</option>
            <option>{lang === 'en' ? 'Pricing & Plans' : 'استفسار عن الأسعار'}</option>
            <option>{lang === 'en' ? 'Support & Help' : 'دعم ومساعدة'}</option>
            <option>{lang === 'en' ? 'Partnership' : 'شراكة'}</option>
          </select>
        </label>

        <label>
          {lang === 'en' ? 'Message *' : 'الرسالة *'}
          <textarea required placeholder={lang === 'en' ? 'How can we assist you?' : 'كيف يمكننا مساعدتك؟'} />
        </label>

        <button type="submit">
          <Send size={17} />
          {submitted
            ? lang === 'en'
              ? 'Message Received'
              : 'تم استلام الرسالة'
            : lang === 'en'
            ? 'Send Message'
            : 'إرسال الرسالة'}
        </button>

        {submitted && (
          <p className="form-success">
            <CheckCircle2 size={16} />
            {lang === 'en'
              ? 'Your message has been received! Our team will contact you shortly.'
              : 'تم استلام رسالتك بنجاح، سيتواصل معك فريقنا قريباً.'}
          </p>
        )}
      </form>
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
