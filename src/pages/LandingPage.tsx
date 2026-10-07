import { Link } from 'react-router-dom';
import {
  ArrowLeft, BarChart3, CalendarDays, Check, CirclePlay, Headphones,
  Home, Sparkles, Wrench,
} from 'lucide-react';
import { PublicFooter, PublicHeader } from '../components/PublicChrome';
import './landing-reference.css';

const features = [
  { icon: Home, title: 'إدارة الوحدات', text: 'إدارة جميع عقاراتك ووحداتك من مكان واحد' },
  { icon: CalendarDays, title: 'تقويم موحد', text: 'عرض جميع الحجوزات في تقويم واحد' },
  { icon: Sparkles, title: 'إدارة التنظيف', text: 'طلبات تنظيف تلقائية وتتبع التنفيذ بالصور' },
  { icon: Wrench, title: 'صيانة وخدمات إضافية', text: 'إدارة طلبات الصيانة والخدمات بسهولة ومرونة' },
  { icon: Headphones, title: 'محادثات موحدة', text: 'كل رسائل الضيوف من جميع المنصات في صندوق واحد' },
  { icon: BarChart3, title: 'تقارير وتحليلات', text: 'تابع الأداء والإشغال والتكاليف بشكل مبسط وواضح' },
];

export default function LandingPage() {
  return (
    <div className="reference-landing" dir="rtl">
      <PublicHeader/>

      <main id="top">
        <section className="reference-hero">
          <div className="reference-hero-copy">
            <span className="reference-eyebrow">المنصة المتكاملة لإدارة وتشغيل الوحدات السكنية</span>
            <h1>إدارة وحداتك أسهل<br />وتشغيلها أكثر احترافية</h1>
            <p><b>BluClean</b> يساعدك على إدارة حجوزاتك من جميع المنصات،<br className="desktop-only" /> وتنظيم أعمال التنظيف والصيانة والتواصل مع الضيوف في مكان واحد.</p>
            <div className="reference-hero-buttons"><Link className="reference-primary-cta" to="/register">ابدأ الآن <ArrowLeft size={17} /></Link><button className="reference-video-cta" type="button"><CirclePlay size={21} /> شاهد الفيديو</button></div>
            <div className="reference-benefits"><span><i><Check size={12} /></i> بدون تعقيد</span><span><i><Check size={12} /></i> إعداد سريع</span><span><i><Check size={12} /></i> دعم باللغة العربية</span></div>
          </div>
          <div className="reference-hero-visual" aria-label="معاينة لوحة BluClean على الحاسوب والهاتف"><img src="/bluclean-home-reference.png" alt="لوحة BluClean على الحاسوب والهاتف داخل وحدة سكنية" /></div>
        </section>

        <section id="how" className="reference-platforms-wrap"><div className="reference-platforms"><div className="platform-title"><h2>تتكامل مع أهم منصات الحجز</h2><p>اجمع كل حجوزاتك في مكان واحد</p></div><div className="platform-separator" /><div className="platform-logos"><div className="platform-card booking"><span className="booking-mark">B.</span><b>Booking<span>.com</span></b></div><div className="platform-card airbnb"><span className="airbnb-mark">⌂</span><b>airbnb</b></div><div className="platform-card gathern"><span className="gathern-mark">G</span><b>Gathern</b></div></div></div></section>

        <section id="features" className="reference-features">{features.map(({ icon: Icon, title, text }) => <article key={title}><Icon size={31} strokeWidth={1.9} /><h3>{title}</h3><p>{text}</p></article>)}</section>

        <section id="about" className="reference-proof">
          <div className="proof-quote"><span className="quote-mark">”</span><div><blockquote>“BluClean وفّر علينا وقت كبير<br />وساعدنا في تقديم تجربة أفضل لضيوفنا.”</blockquote><p>أحد عملائنا</p><div className="quote-dots"><i /><i /><i /><i /><i /></div></div></div>
          <div className="proof-stats"><div><strong>+99%</strong><span>معدل رضا العملاء</span></div><div><strong>+50,000</strong><span>ضيف سعيد</span></div><div><strong>+10,000</strong><span>مهمة تنظيف مكتملة</span></div><div><strong>+500</strong><span>مضيف يثق بنا</span></div></div>
          <div className="proof-photo" aria-hidden="true"><img src="/bluclean-home-reference.png" alt="" /></div>
        </section>
        <span id="pricing" />
      </main>

      <PublicFooter/>
    </div>
  );
}
