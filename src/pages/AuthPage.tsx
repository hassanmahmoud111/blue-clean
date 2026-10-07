import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, CalendarDays, Check, Eye, EyeOff, Home, LoaderCircle, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import './auth-page.css';

export default function AuthPage() {
  const register = useLocation().pathname === '/register';
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => navigate('/app'), 650);
  };

  return <main className="auth-page" dir="rtl">
    <section className="auth-form-side">
      <Link className="auth-logo" to="/"><span className="auth-logo-mark"><Home size={27}/><i/></span><span><b>BluClean</b><small>Clean Stays. Better Hosting.</small></span></Link>
      <div className="auth-form-wrap">
        <div className="auth-heading"><span>{register?<Sparkles size={19}/>:<LockKeyhole size={19}/>}</span><h1>{register?'ابدأ مع BluClean':'مرحبًا بعودتك'}</h1><p>{register?'أنشئ حسابك وابدأ إدارة وحداتك بسهولة.':'سجّل دخولك للوصول إلى لوحة إدارة وحداتك.'}</p></div>
        <form className="auth-form" onSubmit={submit}>
          {register&&<div className="auth-two-columns"><AuthField label="الاسم الكامل" name="name" placeholder="محمد القحطاني"/><AuthField label="اسم المنشأة" name="company" placeholder="مؤسسة السكن المميز"/></div>}
          <AuthField label="البريد الإلكتروني" name="email" type="email" placeholder="name@example.com" icon={<Mail size={17}/>} />
          {register&&<AuthField label="رقم الجوال" name="phone" type="tel" placeholder="+966 5X XXX XXXX"/>}
          <label className="auth-field"><span>كلمة المرور</span><div className="auth-input-wrap"><LockKeyhole size={17}/><input required minLength={6} name="password" type={passwordVisible?'text':'password'} placeholder={register?'6 أحرف على الأقل':'أدخل كلمة المرور'}/><button type="button" onClick={()=>setPasswordVisible(value=>!value)} aria-label="إظهار كلمة المرور">{passwordVisible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
          {!register&&<div className="auth-options"><label><input type="checkbox"/>تذكرني</label><button type="button">نسيت كلمة المرور؟</button></div>}
          {register&&<label className="auth-terms"><input required type="checkbox"/><span>أوافق على <a href="#">الشروط والأحكام</a> و<a href="#">سياسة الخصوصية</a></span></label>}
          <button className="auth-submit" disabled={loading}>{loading?<LoaderCircle className="auth-spinner" size={19}/>:null}{loading?'جارٍ المتابعة...':register?'إنشاء الحساب':'تسجيل الدخول'}{!loading&&<ArrowLeft size={18}/>}</button>
        </form>
        <div className="auth-switch">{register?'لديك حساب بالفعل؟':'ليس لديك حساب؟'} <Link to={register?'/login':'/register'}>{register?'تسجيل الدخول':'ابدأ الآن'}</Link></div>
        {!register&&<div className="auth-demo"><ShieldCheck size={16}/><span>للمعاينة يمكنك استخدام أي بريد وكلمة مرور.</span></div>}
      </div>
      <p className="auth-copyright">© 2026 BluClean جميع الحقوق محفوظة</p>
    </section>
    <section className="auth-visual-side">
      <div className="auth-visual-content"><span className="auth-pill"><Check size={14}/>إدارة أسهل، تشغيل أذكى</span><h2>كل ما تحتاجه لإدارة<br/>وحداتك في مكان واحد</h2><p>تابع الحجوزات والتشغيل والتواصل والتقارير من لوحة عربية واضحة.</p><div className="auth-preview"><div className="auth-preview-top"><span/><span/><span/></div><div className="auth-preview-grid"><article><Home size={20}/><small>إجمالي الوحدات</small><strong>12</strong></article><article><CalendarDays size={20}/><small>الحجوزات</small><strong>56</strong></article><article><BarChart3 size={20}/><small>نسبة الإشغال</small><strong>78%</strong></article></div><div className="auth-preview-chart">{[36,55,44,72,60,86,67,94].map((height,index)=><i key={index} style={{height:`${height}%`}}/>)}</div></div><div className="auth-benefits"><span><Check size={14}/>إعداد سريع</span><span><Check size={14}/>دون بطاقة بنكية</span><span><Check size={14}/>دعم عربي</span></div></div>
    </section>
  </main>;
}

function AuthField({label,name,type='text',placeholder,icon}:{label:string;name:string;type?:string;placeholder:string;icon?:React.ReactNode}){return <label className="auth-field"><span>{label}</span><div className="auth-input-wrap">{icon}<input required name={name} type={type} placeholder={placeholder}/></div></label>}
