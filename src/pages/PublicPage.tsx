import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, ArrowUpLeft, CalendarCheck2, Check, CheckCircle2, ChevronLeft,
  CloudCog, Mail, Phone, RefreshCw, Send, Sparkles,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import { companyValues, contactChannels, featureCards, howSteps, plans } from '../data/publicPages';
import './landing-reference.css';
import './public-pages.css';

export type PublicPageKind = 'features' | 'how' | 'pricing' | 'about' | 'contact';

const pageMeta: Record<PublicPageKind,{eyebrow:string;title:string;description:string}> = {
  features: { eyebrow: 'كل أدوات التشغيل في مكان واحد', title: 'مميزات تساعدك على إدارة وحداتك بوضوح', description: 'من الحجز وحتى التنظيف والتقارير، صُممت كل خطوة لتكون بسيطة وقابلة للمتابعة.' },
  how: { eyebrow: 'إعداد واضح وتشغيل مرن', title: 'كيف يعمل BluClean؟', description: 'اختر بين المزامنة مع منصات الحجز أو التشغيل المستقل، ويمكنك الجمع بينهما دون تعارض.' },
  pricing: { eyebrow: 'خطط واضحة دون تعقيد', title: 'اختر الباقة المناسبة لحجم أعمالك', description: 'ابدأ بما تحتاجه اليوم، ويمكنك الترقية عندما يزيد عدد وحداتك أو فريقك.' },
  about: { eyebrow: 'نبني تشغيلًا أكثر هدوءًا', title: 'من نحن', description: 'BluClean منصة عربية تساعد المضيفين ومديري العقارات على توحيد الحجوزات والخدمات اليومية.' },
  contact: { eyebrow: 'فريقنا قريب منك', title: 'تواصل معنا', description: 'أرسل سؤالك أو اطلب عرضًا توضيحيًا، وسيتواصل معك الفريق في أقرب وقت.' },
};

export default function PublicPage({kind}:{kind:PublicPageKind}) {
  const meta = pageMeta[kind];
  return <div className="reference-landing public-site-page" dir="rtl">
    <PublicHeader/>
    <main>
      <section className={`public-page-hero ${kind}`}><div><span>{meta.eyebrow}</span><h1>{meta.title}</h1><p>{meta.description}</p>{kind !== 'contact' && <div><Link to="/register" className="public-main-cta">ابدأ الآن<ArrowLeft size={17}/></Link><Link to="/contact" className="public-ghost-cta">تحدث مع فريقنا</Link></div>}</div><HeroVisual kind={kind}/></section>
      {kind === 'features' && <FeaturesContent/>}
      {kind === 'how' && <HowContent/>}
      {kind === 'pricing' && <PricingContent/>}
      {kind === 'about' && <AboutContent/>}
      {kind === 'contact' && <ContactContent/>}
    </main>
    <PublicFooter/>
  </div>;
}

function HeroVisual({kind}:{kind:PublicPageKind}) {
  const labels = kind === 'pricing' ? ['باقة مرنة','بدون رسوم مخفية','ترقية في أي وقت'] : kind === 'contact' ? ['دعم عربي','رد سريع','فريق متخصص'] : ['حجوزات موحدة','تشغيل منظم','تقارير واضحة'];
  return <div className="public-hero-visual"><span className="public-hero-orbit"><i/><i/><i/></span><div className="public-hero-window"><header><b>BluClean</b><span/><span/><span/></header>{labels.map((label,index)=><div key={label}><i className={`tone-${index}`}><Check size={13}/></i><span><b>{label}</b><small>{index === 0 ? 'كل التفاصيل في مكان واحد' : 'مصمم ليناسب طريقة عملك'}</small></span></div>)}</div></div>;
}

function FeaturesContent() {
  return <><section className="public-section"><SectionTitle eyebrow="منظومة متكاملة" title="كل ما يحتاجه فريق إدارة الوحدات" text="مكونات مستقلة ومترابطة يمكن ربطها بالخدمات الخلفية لاحقًا بسهولة."/><div className="public-feature-grid">{featureCards.map(({icon:Icon,title,text})=><article key={title}><span><Icon size={24}/></span><h2>{title}</h2><p>{text}</p><Link to="/register">جرّب الميزة<ChevronLeft size={14}/></Link></article>)}</div></section><PublicCta title="ابدأ بإدارة وحداتك من مكان واحد"/></>;
}

function HowContent() {
  return <><section className="public-section"><SectionTitle eyebrow="خمس خطوات" title="من إضافة الوحدة إلى متابعة الأداء" text="دورة عمل واضحة تدعم الوحدات المتزامنة والوحدات التي تحتاج خدمات دورية فقط."/><div className="how-steps">{howSteps.map(step=><article key={step.number}><span>{step.number}</span><div><h2>{step.title}</h2><p>{step.text}</p></div></article>)}</div></section><section className="management-modes"><SectionTitle eyebrow="طريقتان للعمل" title="المزامنة والتشغيل المستقل معًا"/><div><ModeCard icon={<RefreshCw size={26}/>} title="وحدات مرتبطة بالمنصات" points={['استقبال الحجوزات من القنوات المدعومة','منع التكرار والتعارض','إنشاء مهام مرتبطة بالمغادرة']}/><ModeCard icon={<Sparkles size={26}/>} title="وحدات تشغيل وخدمات فقط" points={['إضافة الوحدة يدويًا','جداول تنظيف وصيانة دورية','لا تحتاج حسابًا في منصة حجز']}/></div></section><PublicCta title="اختر أسلوب الإدارة المناسب لكل وحدة"/></>;
}

function PricingContent() {
  return <><section className="public-section pricing-section"><SectionTitle eyebrow="اشتراك شهري" title="باقات تنمو مع أعمالك" text="الأسعار المعروضة تجريبية للواجهة حاليًا ويمكن ربطها بنظام الفوترة لاحقًا."/><div className="pricing-grid">{plans.map(plan=><article className={plan.featured?'featured':''} key={plan.name}>{plan.featured&&<em>الأكثر اختيارًا</em>}<h2>{plan.name}</h2><p>{plan.description}</p><div className="plan-price">{plan.price === 'تواصل معنا' ? <strong>{plan.price}</strong> : <><strong>{plan.price}</strong><span>ر.س / شهريًا</span></>}</div><b className="plan-units">{plan.units}</b><ul>{plan.features.map(feature=><li key={feature}><CheckCircle2 size={16}/>{feature}</li>)}</ul><Link to={plan.price === 'تواصل معنا'?'/contact':'/register'}>{plan.price === 'تواصل معنا'?'اطلب عرضًا':'ابدأ الآن'}<ArrowLeft size={16}/></Link></article>)}</div></section><div className="pricing-note"><CloudCog size={23}/><div><b>التكاملات تعتمد على الصلاحيات المتاحة من مزود الخدمة</b><p>يتم تفعيل كل قناة بعد التحقق من طريقة الربط الرسمية وحساب العميل.</p></div></div></>;
}

function AboutContent() {
  return <><section className="public-section about-story"><div><span>قصتنا</span><h2>بدأنا من مشكلة يومية بسيطة</h2><p>إدارة عدة وحدات تعني حجوزات متفرقة، فرق تنظيف، بلاغات صيانة ورسائل ضيوف في أماكن مختلفة. لذلك صممنا BluClean ليجمع هذه العمليات في واجهة عربية واحدة وواضحة.</p><p>هدفنا ليس إضافة شاشة جديدة، بل تقليل الخطوات اليدوية وتوفير صورة دقيقة لما يحدث داخل كل وحدة.</p></div><aside><strong>+500</strong><span>مضيف ومدير عقار</span><strong>+10,000</strong><span>مهمة تشغيل مكتملة</span><strong>+99%</strong><span>معدل رضا العملاء</span></aside></section><section className="public-section"><SectionTitle eyebrow="قيمنا" title="المبادئ التي نبني عليها المنتج"/><div className="values-grid">{companyValues.map(({icon:Icon,title,text})=><article key={title}><Icon size={25}/><h3>{title}</h3><p>{text}</p></article>)}</div></section><PublicCta title="انضم إلى تجربة تشغيل أكثر بساطة"/></>;
}

function ContactContent() {
  const [submitted,setSubmitted] = useState(false);
  function submit(event:FormEvent){event.preventDefault();setSubmitted(true)}
  return <section className="public-section contact-layout"><div className="contact-channels"><SectionTitle eyebrow="طرق التواصل" title="اختر الطريقة الأنسب لك" text="هذه واجهة أمامية حاليًا وسيتم ربط الإرسال بالخدمة الخلفية لاحقًا."/>{contactChannels.map(({icon:Icon,title,value,note})=><article key={title}><span><Icon size={21}/></span><div><h2>{title}</h2><b>{value}</b><p>{note}</p></div></article>)}<div className="contact-quick"><Phone size={20}/><span><b>هل تحتاج ردًا سريعًا؟</b><p>اترك بياناتك وسنرتب مكالمة تعريفية.</p></span></div></div><form className="contact-form" onSubmit={submit}><header><Mail size={24}/><div><h2>أرسل رسالتك</h2><p>املأ البيانات وسنتواصل معك.</p></div></header><label>الاسم الكامل<input required placeholder="اكتب اسمك"/></label><div><label>البريد الإلكتروني<input required type="email" placeholder="name@example.com"/></label><label>رقم الجوال<input required type="tel" placeholder="+966 5X XXX XXXX"/></label></div><label>نوع الطلب<select defaultValue=""><option value="" disabled>اختر نوع الطلب</option><option>عرض توضيحي</option><option>استفسار عن الأسعار</option><option>دعم ومساعدة</option><option>شراكة</option></select></label><label>الرسالة<textarea required placeholder="كيف يمكننا مساعدتك؟"/></label><button type="submit"><Send size={17}/>{submitted?'تم استلام الرسالة':'إرسال الرسالة'}</button>{submitted&&<p className="form-success"><CheckCircle2 size={16}/>تم حفظ الرسالة تجريبيًا داخل الواجهة.</p>}</form></section>;
}

function SectionTitle({eyebrow,title,text}:{eyebrow:string;title:string;text?:string}) {return <header className="public-section-title"><span>{eyebrow}</span><h2>{title}</h2>{text&&<p>{text}</p>}</header>}
function ModeCard({icon,title,points}:{icon:ReactNode;title:string;points:string[]}) {return <article><span>{icon}</span><h3>{title}</h3>{points.map(point=><p key={point}><Check size={14}/>{point}</p>)}</article>}
function PublicCta({title}:{title:string}) {return <section className="public-bottom-cta"><div><span><CalendarCheck2 size={22}/></span><h2>{title}</h2><p>ابدأ بخطوات بسيطة، ثم أضف المزامنة والخدمات عندما تحتاجها.</p></div><Link to="/register">ابدأ تجربتك<ArrowUpLeft size={17}/></Link></section>}
