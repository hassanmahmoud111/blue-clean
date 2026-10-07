import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Building2, Camera, Check, ChevronLeft, Globe2, Link2, Lock, Monitor, Moon, Palette, Save, Sun, UserPlus, UserRound, UsersRound } from 'lucide-react';
import './settings-simple.css';

const navItems = [
  { id: 'profile', label: 'الحساب الشخصي', icon: UserRound },
  { id: 'preferences', label: 'الإشعارات والمظهر', icon: Palette },
  { id: 'security', label: 'الأمان', icon: Lock },
  { id: 'team', label: 'الفريق والصلاحيات', icon: UsersRound },
];

export default function SettingsPage() {
  const [active, setActive] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [toggles, setToggles] = useState({ email: true, sms: true, browser: true, marketing: false });
  const [theme, setTheme] = useState('light');

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return <div className="simple-settings-page">
    <header className="simple-settings-header"><div><span>الرئيسية <ChevronLeft size={13}/> الإعدادات</span><h1>الإعدادات</h1><p>إدارة بيانات حسابك وتفضيلات المنصة بسهولة.</p></div><button form="settings-form" className={`simple-save ${saved?'saved':''}`}><Save size={17}/>{saved?'تم الحفظ':'حفظ التغييرات'}</button></header>
    <div className="simple-settings-layout">
      <aside className="simple-settings-nav"><h2>الإعدادات</h2><nav>{navItems.map(({id,label,icon:Icon})=><button key={id} className={active===id?'active':''} onClick={()=>goTo(id)}><Icon size={18}/><span>{label}</span><ChevronLeft size={14}/></button>)}</nav><div className="simple-company"><span><Building2 size={21}/></span><div><strong>مؤسسة السكن المميز</strong><small>الباقة الاحترافية</small></div></div></aside>
      <form id="settings-form" className="simple-settings-content" onSubmit={save}>
        <section id="settings-profile" className="simple-settings-card"><CardTitle title="البيانات الشخصية" text="بيانات الحساب الأساسية ومعلومات التواصل."/><div className="simple-profile"><span className="simple-settings-avatar"/><div><strong>محمد القحطاني</strong><small>مدير الحساب</small><button type="button"><Camera size={14}/>تغيير الصورة</button></div></div><div className="simple-fields"><Field label="الاسم الكامل" value="محمد القحطاني"/><Field label="البريد الإلكتروني" value="m.alqahtani@example.com" type="email"/><Field label="رقم الجوال" value="+966 50 123 4567"/><Field label="المسمى الوظيفي" value="مدير الحساب"/></div></section>
        <section id="settings-preferences" className="simple-settings-card"><CardTitle title="الإشعارات والمظهر" text="اختر طريقة التواصل والشكل المريح لك."/><div className="simple-preferences-grid"><div className="simple-preference-block"><h3><Bell size={17}/>الإشعارات</h3><Toggle label="البريد الإلكتروني" note="الحجوزات والتقارير والفواتير" on={toggles.email} onClick={()=>setToggles({...toggles,email:!toggles.email})}/><Toggle label="الرسائل النصية" note="التنبيهات المهمة والعاجلة" on={toggles.sms} onClick={()=>setToggles({...toggles,sms:!toggles.sms})}/><Toggle label="داخل المنصة" note="جميع تحديثات الحساب" on={toggles.browser} onClick={()=>setToggles({...toggles,browser:!toggles.browser})}/><Toggle label="الرسائل التسويقية" note="العروض والميزات الجديدة" on={toggles.marketing} onClick={()=>setToggles({...toggles,marketing:!toggles.marketing})}/></div><div className="simple-preference-block"><h3><Palette size={17}/>مظهر الواجهة</h3><div className="simple-theme-options"><ThemeButton icon={Sun} label="فاتح" active={theme==='light'} onClick={()=>setTheme('light')}/><ThemeButton icon={Moon} label="داكن" active={theme==='dark'} onClick={()=>setTheme('dark')}/><ThemeButton icon={Monitor} label="النظام" active={theme==='system'} onClick={()=>setTheme('system')}/></div><label className="simple-select-label"><span><Globe2 size={16}/>اللغة</span><select defaultValue="العربية"><option>العربية</option><option>English</option></select></label><label className="simple-select-label"><span>المنطقة الزمنية</span><select defaultValue="الرياض"><option>الرياض (GMT+3)</option><option>القاهرة (GMT+3)</option></select></label></div></div></section>
        <div className="simple-settings-row"><section id="settings-security" className="simple-settings-card compact"><span className="simple-card-icon"><Lock size={20}/></span><div><h2>الأمان وكلمة المرور</h2><p>آخر تغيير لكلمة المرور كان منذ 42 يومًا.</p><button type="button">تغيير كلمة المرور</button></div></section><section id="settings-team" className="simple-settings-card compact"><span className="simple-card-icon"><UsersRound size={20}/></span><div><h2>الفريق والصلاحيات</h2><p>3 مستخدمين لديهم وصول إلى هذا الحساب.</p><Link to="/app/new/user"><UserPlus size={15}/>إضافة مستخدم</Link></div></section><section className="simple-settings-card compact"><span className="simple-card-icon"><Link2 size={20}/></span><div><h2>الربط والمزامنة</h2><p>راجع المنصات المتصلة وسجل المزامنة والأخطاء.</p><Link to="/app/settings/integrations">إدارة الربط</Link></div></section></div>
      </form>
    </div>
  </div>;
}

function CardTitle({title,text}:{title:string;text:string}){return <div className="simple-card-title"><h2>{title}</h2><p>{text}</p></div>}
function Field({label,value,type='text'}:{label:string;value:string;type?:string}){return <label className="simple-field"><span>{label}</span><input type={type} defaultValue={value}/></label>}
function Toggle({label,note,on,onClick}:{label:string;note:string;on:boolean;onClick:()=>void}){return <div className="simple-toggle-row"><div><strong>{label}</strong><small>{note}</small></div><button type="button" className={on?'on':''} onClick={onClick} aria-label={label}><i/></button></div>}
function ThemeButton({icon:Icon,label,active,onClick}:{icon:typeof Sun;label:string;active:boolean;onClick:()=>void}){return <button type="button" className={active?'active':''} onClick={onClick}><Icon size={20}/>{label}{active&&<Check size={13}/>}</button>}
