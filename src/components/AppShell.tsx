import { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, Bell, BellRing, BrushCleaning, Building2, CalendarDays, CheckCircle2, ChevronDown, ChevronLeft, CircleHelp,
  CreditCard, Headphones, Home, LogOut, Menu, Plus, Search, Settings, Settings2, Sparkles, TriangleAlert, UserRound, Wrench, X,
} from 'lucide-react';
import { notifications } from '../data/mockData';
import { Badge } from './ui';
import './app-shell-reference.css';

const navItems = [
  { to: '/app', label: 'الرئيسية', icon: Home, end: true },
  { to: '/app/units', label: 'الوحدات', icon: Building2 },
  { to: '/app/bookings', label: 'الحجوزات والتقويم', icon: CalendarDays },
  { to: '/app/reports', label: 'التقارير', icon: BarChart3 },
  { to: '/app/billing', label: 'الفواتير والاشتراك', icon: CreditCard },
  { to: '/app/support', label: 'الدعم الفني', icon: Headphones, count: 2 },
  { to: '/app/settings', label: 'الإعدادات', icon: Settings },
];

const notificationIcons = {
  success: CheckCircle2,
  brand: BellRing,
  warning: CalendarDays,
  danger: TriangleAlert,
};

function ShellLogo() {
  return <div className="shell-logo" aria-label="BluClean"><span className="shell-logo-mark"><Home size={27} strokeWidth={2.5} /><i /></span><span><b>BluClean</b><small>Clean Stays. Better Hosting.</small></span></div>;
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const operationsActive = location.pathname.startsWith('/app/operations') || location.pathname.startsWith('/app/new/cleaning') || location.pathname.startsWith('/app/new/maintenance') || location.pathname.startsWith('/app/new/service');
  const [operationsOpen, setOperationsOpen] = useState(operationsActive);
  useEffect(() => { if (operationsActive) setOperationsOpen(true); }, [operationsActive]);
  return <>
    <div className="shell-logo-row"><ShellLogo /></div>
    <nav className="shell-nav" aria-label="التنقل الرئيسي">
      {navItems.slice(0,3).map(({to,label,icon:Icon,count,end}) => <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({isActive}) => isActive ? 'active' : ''}><Icon size={21} strokeWidth={1.9}/><span>{label}</span>{count ? <em>{count}</em> : null}</NavLink>)}
      <div className={`shell-nav-group ${operationsActive?'active':''} ${operationsOpen?'open':''}`}><button type="button" onClick={() => setOperationsOpen(value => !value)} aria-expanded={operationsOpen}><Sparkles size={21} strokeWidth={1.9}/><span>التشغيل والخدمات</span><ChevronDown size={16}/></button>{operationsOpen&&<div className="shell-nav-submenu"><NavLink to="/app/operations/cleaning" onClick={onNavigate}><BrushCleaning size={17}/><span>النظافة</span></NavLink><NavLink to="/app/operations/maintenance" onClick={onNavigate}><Wrench size={17}/><span>الصيانة</span></NavLink><NavLink to="/app/operations/services" onClick={onNavigate}><Settings2 size={17}/><span>الخدمات الإضافية</span></NavLink></div>}</div>
      {navItems.slice(3).map(({to,label,icon:Icon,count,end}) => <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({isActive}) => isActive ? 'active' : ''}><Icon size={21} strokeWidth={1.9}/><span>{label}</span>{count ? <em>{count}</em> : null}</NavLink>)}
    </nav>
    <div className="shell-sidebar-bottom"><button className="shell-help"><CircleHelp size={19} /><span>مركز المساعدة</span></button><div className="shell-plan"><p>الباقة الحالية</p><strong>الاحترافية</strong><span>9 من 12 وحدة مستخدمة</span><div><i /></div><ChevronLeft size={16} /></div></div>
  </>;
}

export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setDrawerOpen(false); setNotificationsOpen(false); setAccountOpen(false); window.scrollTo({top:0}); }, [location.pathname]);
  useEffect(() => { const close = (event: MouseEvent) => { const target = event.target as Node; if (popoverRef.current && !popoverRef.current.contains(target)) setNotificationsOpen(false); if (accountRef.current && !accountRef.current.contains(target)) setAccountOpen(false); }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close); }, []);

  return <div dir="rtl" className="reference-app-shell">
    <aside className="app-sidebar"><SidebarContent /></aside>
    {drawerOpen && <div className="app-drawer-overlay" onClick={() => setDrawerOpen(false)}><aside className="app-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label="إغلاق القائمة"><X size={19} /></button><SidebarContent onNavigate={() => setDrawerOpen(false)} /></aside></div>}
    <div className="app-frame">
      <header className="app-topbar">
        <div className="topbar-date"><CalendarDays size={16} /><span>اليوم، الخميس، 10 سبتمبر 2026</span></div>
        <label className="topbar-search"><Search size={18} /><input placeholder="ابحث عن وحدة، حجز أو ضيف ..." /></label>
        <div className="topbar-user">
          <button className="topbar-menu" onClick={() => setDrawerOpen(true)} aria-label="فتح القائمة"><Menu size={20} /></button>
          <div className="account-wrap" ref={accountRef}><button className="account-trigger" onClick={() => { setAccountOpen(value => !value); setNotificationsOpen(false); }} aria-expanded={accountOpen}><span className="user-chevron"><ChevronDown size={16} /></span><div className="shell-user-avatar"/><div className="user-copy"><strong>محمد القحطاني</strong><span>مدير الحساب</span></div></button>{accountOpen&&<div className="shell-account-menu"><div className="account-menu-head"><span className="shell-user-avatar"/><div><strong>محمد القحطاني</strong><small>m.alqahtani@example.com</small></div></div><button onClick={()=>navigate('/app/settings')}><UserRound size={17}/>الملف الشخصي</button><button onClick={()=>navigate('/app/billing')}><CreditCard size={17}/>الاشتراك والفواتير</button><button><CircleHelp size={17}/>مركز المساعدة</button><hr/><button className="logout" onClick={()=>navigate('/login')}><LogOut size={17}/>تسجيل الخروج</button></div>}</div>
          <div className="notification-wrap" ref={popoverRef}><button className="topbar-notification" onClick={() => { setNotificationsOpen((value) => !value); setAccountOpen(false); }} aria-label="الإشعارات"><Bell size={19}/><em>2</em></button>{notificationsOpen && <div className="shell-notifications"><div><h3>الإشعارات</h3><Badge tone="danger">2 جديدة</Badge></div>{notifications.map((item) => { const NotificationIcon = notificationIcons[item.tone]; return <article key={item.text}><i className={`notification-type-icon ${item.tone}`}><NotificationIcon size={17} strokeWidth={2}/></i><span><b>{item.text}</b><small>{item.time}</small></span></article>; })}</div>}</div>
        </div>
      </header>
      <main className="app-content"><Outlet /></main>
    </div>
    <nav className="shell-mobile-nav" aria-label="تنقل الجوال">{[...navItems.slice(0,3),{to:'/app/operations/cleaning',label:'التشغيل',icon:Sparkles,end:false},{to:'/app/support',label:'الدعم',icon:Headphones,end:false}].map(({to,label,icon:Icon,end}) => <NavLink key={to} to={to} end={end} className={({isActive}) => isActive ? 'active' : ''}><Icon size={18}/><span>{label.replace(' والتقويم','')}</span></NavLink>)}</nav>
    {location.pathname !== '/app/support' && <button className="shell-floating-add" onClick={() => navigate('/app/new/booking')} aria-label="إضافة حجز"><Plus size={20} /></button>}
  </div>;
}
