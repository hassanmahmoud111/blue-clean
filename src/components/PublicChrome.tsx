import { useState } from 'react';
import { Globe2, Home, Instagram, Linkedin, LogIn, Menu, Rocket, X, Youtube } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { publicNavigation } from '../data/publicPages';

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  return <>
    <header className="reference-header">
      <div className="reference-header-inner">
        <ReferenceLogo />
        <nav className="reference-nav" aria-label="التنقل الرئيسي">
          {publicNavigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'}>{item.label}</NavLink>)}
        </nav>
        <div className="reference-actions">
          <button className="language-button" type="button"><Globe2 size={16}/>العربية<span>⌄</span></button>
          <Link className="login-button" to="/login"><LogIn size={16}/>تسجيل الدخول</Link>
          <Link className="start-button" to="/register"><Rocket size={16}/>ابدأ الآن</Link>
        </div>
        <button className="reference-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="فتح القائمة"><Menu size={22}/></button>
      </div>
    </header>
    {menuOpen && <div className="reference-mobile-overlay" onClick={() => setMenuOpen(false)}><aside className="reference-mobile-menu" onClick={event => event.stopPropagation()}><div className="reference-mobile-head"><ReferenceLogo/><button type="button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة"><X size={22}/></button></div><nav>{publicNavigation.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)}>{item.label}</NavLink>)}</nav><div className="mobile-auth-actions"><Link className="login-button" to="/login"><LogIn size={16}/>تسجيل الدخول</Link><Link className="start-button" to="/register"><Rocket size={16}/>ابدأ الآن</Link></div></aside></div>}
  </>;
}

export function PublicFooter() {
  return <footer className="reference-footer"><div className="reference-footer-inner"><p className="copyright">© 2026 BluClean جميع الحقوق محفوظة.</p><div className="reference-socials"><a href="#" aria-label="إنستغرام"><Instagram size={17}/></a><a href="#" aria-label="إكس">𝕏</a><a href="#" aria-label="لينكدإن"><Linkedin size={17} fill="currentColor"/></a><a href="#" aria-label="يوتيوب"><Youtube size={18} fill="currentColor"/></a></div><nav className="reference-footer-links"><Link to="/contact">تواصل معنا</Link><Link to="/features">المميزات</Link><Link to="/pricing">الأسعار</Link><Link to="/about">من نحن</Link></nav><ReferenceLogo compact/></div></footer>;
}

export function ReferenceLogo({ compact = false }: { compact?: boolean }) {
  return <Link className={`reference-logo ${compact ? 'compact' : ''}`} to="/" aria-label="BluClean الرئيسية"><span className="reference-logo-mark"><Home size={25} strokeWidth={2.6}/><i/></span><span className="reference-logo-copy"><b>BluClean</b><small>Clean Stays. Better Hosting.</small></span></Link>;
}
