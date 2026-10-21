import { useState } from 'react';
import { Globe2, Home, Instagram, Linkedin, LogIn, Menu, Rocket, X, Youtube } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { publicNavigation } from '../data/publicPages';
import { useLanguage } from '../context/LanguageContext';

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();
  return <>
    <header className="reference-header">
      <div className="reference-header-inner">
        <ReferenceLogo />
        <nav className="reference-nav" aria-label="التنقل الرئيسي">
          {publicNavigation.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {lang === 'en' ? item.labelEn : item.label}
            </NavLink>
          ))}
        </nav>
        
        <div className="reference-actions">
          <button className="language-button" type="button" onClick={toggleLang} title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}>
            <Globe2 size={16}/>{lang === 'ar' ? 'العربية' : 'English'}<span>⌄</span>
          </button>
          <Link className="login-button" to="/login">
            {lang === 'en' && <LogIn size={15} />}
            {lang === 'en' ? 'Sign in' : 'تسجيل الدخول'}
          </Link>
          <Link className="start-button" to="/register">
            {lang === 'ar' && <Rocket size={15} />}
            {lang === 'en' ? 'Get started' : 'ابدأ الآن'}
          </Link>
        </div>
        <button className="reference-menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label="فتح القائمة"><Menu size={22}/></button>
      </div>
    </header>
    {menuOpen && (
      <div className="reference-mobile-overlay" onClick={() => setMenuOpen(false)}>
        <aside className="reference-mobile-menu" onClick={event => event.stopPropagation()}>
          <div className="reference-mobile-head">
            <ReferenceLogo/>
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="إغلاق القائمة"><X size={22}/></button>
          </div>
          <nav>
            {publicNavigation.map(item => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setMenuOpen(false)}>
                {lang === 'en' ? item.labelEn : item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mobile-auth-actions">
            <Link className="login-button" to="/login"><LogIn size={16}/>{lang === 'en' ? 'Sign In' : 'تسجيل الدخول'}</Link>
            <Link className="start-button" to="/register"><Rocket size={16}/>{lang === 'en' ? 'Get Started' : 'ابدأ الآن'}</Link>
          </div>
        </aside>
      </div>
    )}
  </>;
}

export function PublicFooter() {
  const { lang } = useLanguage();
  return (
    <footer className="reference-footer">
      <div className="reference-footer-inner">
        <ReferenceLogo compact/>
        <nav className="reference-footer-links">
          <Link to="/contact">{lang === 'en' ? 'Contact Us' : 'تواصل معنا'}</Link>
          <Link to="/features">{lang === 'en' ? 'Features' : 'المميزات'}</Link>
          <Link to="/pricing">{lang === 'en' ? 'Pricing' : 'الأسعار'}</Link>
          <Link to="/about">{lang === 'en' ? 'About Us' : 'من نحن'}</Link>
        </nav>
        <div className="reference-footer-left">
          <div className="reference-socials">
            <a href="#" aria-label="إنستغرام"><Instagram size={17}/></a>
            <a href="#" aria-label="إكس">𝕏</a>
            <a href="#" aria-label="لينكدإن"><Linkedin size={17} fill="currentColor"/></a>
            <a href="#" aria-label="يوتيوب"><Youtube size={18} fill="currentColor"/></a>
          </div>
          <p className="copyright">
            {lang === 'en' ? '© 2026 BluClean. All rights reserved.' : '© 2026 BluClean جميع الحقوق محفوظة.'}
          </p>
        </div>
      </div>
    </footer>
  );
}

export function ReferenceLogo({ compact = false }: { compact?: boolean }) {
  return <Link className={`reference-logo ${compact ? 'compact' : ''}`} to="/" aria-label="BluClean الرئيسية"><span className="reference-logo-mark"><Home size={25} strokeWidth={2.6}/><i/></span><span className="reference-logo-copy"><b>BluClean</b><small>Clean Stays. Better Hosting.</small></span></Link>;
}
