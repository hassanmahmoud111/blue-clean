import { useEffect, useRef, useState } from 'react';
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3, Bell, BellRing, BrushCleaning, Building2, CalendarDays, CheckCircle2, ChevronDown, CircleHelp,
  CreditCard, Globe, Headphones, Home, LogOut, Menu, PanelRight, Plus, Search, Settings, Settings2, Sparkles, TriangleAlert, UserRound, Wrench, X,
} from 'lucide-react';
import { notifications as fallbackNotifications } from '../data/mockData';
import { Badge } from './ui';
import { useLanguage } from '../context/LanguageContext';
import {
  ensureAuthToken,
  fetchClientMe,
  fetchClientNotifications,
  fetchGlobalNewSettings,
  getStoredUser,
  isAuthenticated,
  logoutClient,
  markAllClientNotificationsRead,
  type ApiNotificationItem,
  type StoredClientUser,
} from '../services/apiClient';
import './app-shell-reference.css';

const navItemDefs = [
  { to: '/app', labelKey: 'nav.dashboard', icon: Home, end: true },
  { to: '/app/units', labelKey: 'nav.units', icon: Building2 },
  { to: '/app/bookings', labelKey: 'nav.bookings', icon: CalendarDays },
  { to: '/app/reports', labelKey: 'nav.reports', icon: BarChart3 },
  { to: '/app/billing', labelKey: 'nav.billing', icon: CreditCard },
  { to: '/app/support', labelKey: 'nav.support', icon: Headphones },
  { to: '/app/settings', labelKey: 'nav.settings', icon: Settings },
];

const notificationIcons = {
  success: CheckCircle2,
  brand: BellRing,
  warning: CalendarDays,
  danger: TriangleAlert,
};

function mapNotificationTone(type: string): keyof typeof notificationIcons {
  if (type.includes('completed') || type.includes('approved')) return 'success';
  if (type.includes('booking')) return 'warning';
  if (type.includes('invoice') || type.includes('urgent')) return 'danger';
  return 'brand';
}

function ShellLogo() {
  return (
    <div className="shell-logo" aria-label="BluClean">
      <span className="shell-logo-mark"><Home size={24} strokeWidth={2.4} /><i /></span>
      <span><b>BluClean</b><small>Clean Stays. Better Hosting.</small></span>
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useLanguage();
  const location = useLocation();
  const operationsActive =
    location.pathname.startsWith('/app/operations') ||
    location.pathname.startsWith('/app/new/cleaning') ||
    location.pathname.startsWith('/app/new/maintenance') ||
    location.pathname.startsWith('/app/new/service');
  const [operationsOpen, setOperationsOpen] = useState(operationsActive);

  useEffect(() => {
    if (operationsActive) setOperationsOpen(true);
  }, [operationsActive]);

  return (
    <>
      <div className="shell-logo-row"><ShellLogo /></div>
      <nav className="shell-nav" aria-label={t('nav.open_menu', 'التنقل الرئيسي')}>
        {navItemDefs.slice(0, 3).map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={20} strokeWidth={2} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
        <div className={`shell-nav-group ${operationsActive ? 'active' : ''} ${operationsOpen ? 'open' : ''}`}>
          <button type="button" onClick={() => setOperationsOpen((value) => !value)} aria-expanded={operationsOpen}>
            <Sparkles size={20} strokeWidth={2} />
            <span>{t('nav.operations')}</span>
            <ChevronDown size={17} strokeWidth={2.2} />
          </button>
          {operationsOpen && (
            <div className="shell-nav-submenu">
              <NavLink to="/app/operations/cleaning" onClick={onNavigate}>
                <BrushCleaning size={16} strokeWidth={2} />
                <span>{t('nav.cleaning')}</span>
              </NavLink>
              <NavLink to="/app/operations/maintenance" onClick={onNavigate}>
                <Wrench size={16} strokeWidth={2} />
                <span>{t('nav.maintenance')}</span>
              </NavLink>
              <NavLink to="/app/operations/services" onClick={onNavigate}>
                <Settings2 size={16} strokeWidth={2} />
                <span>{t('nav.services')}</span>
              </NavLink>
            </div>
          )}
        </div>
        {navItemDefs.slice(3).map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={20} strokeWidth={2} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>
      <div className="shell-sidebar-bottom">
        <NavLink
          to="/app/support"
          onClick={onNavigate}
          className={({ isActive }) => `shell-help-btn ${isActive ? 'active' : ''}`}
        >
          <CircleHelp size={20} strokeWidth={2} />
          <span>{t('nav.help')}</span>
        </NavLink>
      </div>
    </>
  );
}

export default function AppShell() {
  const { lang, dir, isRTL, toggleLang, t } = useLanguage();
  const [authed, setAuthed] = useState<boolean>(() => isAuthenticated());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<StoredClientUser | null>(() => getStoredUser());
  const [apiNotifications, setApiNotifications] = useState<ApiNotificationItem[] | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const popoverRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthed(isAuthenticated());
    setDrawerOpen(false);
    setNotificationsOpen(false);
    setAccountOpen(false);
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      const currentAuth = isAuthenticated();
      setAuthed(currentAuth);
      if (!currentAuth) {
        navigate('/login', { replace: true });
      }
    };

    window.addEventListener('bluclean:auth-changed', syncAuth);
    window.addEventListener('popstate', syncAuth);
    window.addEventListener('pageshow', syncAuth);
    return () => {
      window.removeEventListener('bluclean:auth-changed', syncAuth);
      window.removeEventListener('popstate', syncAuth);
      window.removeEventListener('pageshow', syncAuth);
    };
  }, [navigate]);

  useEffect(() => {
    if (!authed) return;
    let active = true;
    ensureAuthToken().then((token) => {
      if (!active || !token) return;
      const stored = getStoredUser();
      if (stored) setUserProfile(stored);

      fetchGlobalNewSettings().catch(() => {});

      fetchClientMe().then((me) => {
        if (active && me) {
          setUserProfile(me);
        }
      });

      fetchClientNotifications().then((res) => {
        if (active && res) {
          setApiNotifications(res.notifications);
          setUnreadCount(res.unread_count ?? res.notifications.filter((n) => !n.is_read).length);
        }
      });
    });

    const handleUserUpdate = (e: Event) => {
      const custom = e as CustomEvent<StoredClientUser>;
      if (custom.detail) setUserProfile(custom.detail);
    };
    window.addEventListener('bluclean:user-updated', handleUserUpdate);
    return () => {
      active = false;
      window.removeEventListener('bluclean:user-updated', handleUserUpdate);
    };
  }, [authed]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as Node;
      if (popoverRef.current && !popoverRef.current.contains(target)) setNotificationsOpen(false);
      if (accountRef.current && !accountRef.current.contains(target)) setAccountOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!authed || !isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const displayUserName =
    lang === 'en'
      ? userProfile?.name && !userProfile.name.includes('عبدالله')
        ? userProfile.name
        : t('topbar.user_name')
      : userProfile?.name || t('topbar.user_name');

  const displayUserRole =
    lang === 'en'
      ? t('topbar.user_role')
      : userProfile?.job_title || t('topbar.user_role');

  const displayUserEmail = userProfile?.email || 'client@blueclean.com';

  const handleOpenNotifications = () => {
    const nextState = !notificationsOpen;
    setNotificationsOpen(nextState);
    setAccountOpen(false);
    if (nextState && unreadCount > 0) {
      markAllClientNotificationsRead().then((ok) => {
        if (ok) setUnreadCount(0);
      });
    }
  };

  const handleLogout = async () => {
    await logoutClient();
    setAuthed(false);
    navigate('/login', { replace: true });
  };

  return (
    <div dir={dir} className={`reference-app-shell ${dir === 'ltr' ? 'shell-ltr' : ''}`}>
      <aside className="app-sidebar"><SidebarContent /></aside>
      {drawerOpen && (
        <div className="app-drawer-overlay" onClick={() => setDrawerOpen(false)}>
          <aside className="app-drawer" onClick={(event) => event.stopPropagation()}>
            <button className="drawer-close" onClick={() => setDrawerOpen(false)} aria-label={t('nav.close_menu', 'إغلاق القائمة')}>
              <X size={19} />
            </button>
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}
      <div className="app-frame">
        <header className="app-topbar">
          <div className="topbar-right-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="topbar-toggle-btn"
              type="button"
              aria-label={t('topbar.toggle_sidebar', 'تبديل الشريط الجانبي')}
              style={{ display: 'grid', placeItems: 'center', width: '32px', height: '32px', border: '1px solid #cbd5e1', borderRadius: '6px', background: '#fff', color: '#475569', cursor: 'pointer' }}
            >
              <PanelRight size={16} />
            </button>
            <div className="topbar-date">
              <CalendarDays size={16} />
              <span>{t('topbar.today')}</span>
            </div>
          </div>

          <label className="topbar-search" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search size={16} style={{ color: '#94a3b8' }} />
            <input
              placeholder={t('topbar.search')}
              style={{
                flex: 1,
                paddingRight: isRTL ? '6px' : '50px',
                paddingLeft: isRTL ? '50px' : '6px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                [isRTL ? 'left' : 'right']: '8px',
                fontSize: '10px',
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                color: '#64748b',
                padding: '1px 5px',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              Ctrl K
            </span>
          </label>

          <div className="topbar-user" style={{ display: 'flex', alignItems: 'center', gap: '12px', direction: 'ltr' }}>
            <button className="topbar-menu" onClick={() => setDrawerOpen(true)} aria-label={t('nav.open_menu', 'فتح القائمة')}>
              <Menu size={20} />
            </button>

            <div className="account-wrap" ref={accountRef}>
              <button
                className="account-trigger"
                onClick={() => {
                  setAccountOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                aria-expanded={accountOpen}
              >
                <span className="user-chevron"><ChevronDown size={14} /></span>
                <div
                  className="shell-user-avatar"
                  style={{
                    background: userProfile?.avatar_url
                      ? `url(${userProfile.avatar_url}) center/cover no-repeat`
                      : '#0f172a',
                    borderRadius: '6px',
                    width: '32px',
                    height: '32px',
                  }}
                />
                <div className="user-copy" style={{ textAlign: isRTL ? 'right' : 'left', direction: dir }}>
                  <strong style={{ fontSize: '12px', color: '#0f172a' }}>{displayUserName}</strong>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>{displayUserRole}</span>
                </div>
              </button>
              {accountOpen && (
                <div className="shell-account-menu" style={{ direction: dir, [isRTL ? 'left' : 'right']: 0 }}>
                  <div className="account-menu-head">
                    <div
                      className="shell-user-avatar"
                      style={{
                        background: userProfile?.avatar_url
                          ? `url(${userProfile.avatar_url}) center/cover no-repeat`
                          : '#0f172a',
                        borderRadius: '6px',
                      }}
                    />
                    <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                      <strong>{displayUserName}</strong>
                      <small>{displayUserEmail}</small>
                    </div>
                  </div>
                  <button onClick={() => navigate('/app/settings?tab=profile')}>
                    <UserRound size={17} />
                    {t('topbar.profile')}
                  </button>
                  <button onClick={() => navigate('/app/billing')}>
                    <CreditCard size={17} />
                    {t('topbar.billing')}
                  </button>
                  <button onClick={() => navigate('/app/support')}>
                    <CircleHelp size={17} />
                    {t('topbar.help')}
                  </button>
                  <hr />
                  <button className="logout" onClick={handleLogout}>
                    <LogOut size={17} />
                    {t('topbar.logout')}
                  </button>
                </div>
              )}
            </div>

            <div className="notification-wrap" ref={popoverRef}>
              <button
                className="topbar-notification"
                onClick={handleOpenNotifications}
                aria-label={t('topbar.notifications')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
              >
                <Bell size={18} />
                <em style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', position: 'absolute', top: '2px', right: '4px', border: 'none' }} />
              </button>
              {notificationsOpen && (
                <div className="shell-notifications" style={{ direction: dir, [isRTL ? 'left' : 'right']: 0 }}>
                  <div>
                    <h3>{t('topbar.notifications')}</h3>
                    <Badge tone="danger">
                      {apiNotifications
                        ? `${apiNotifications.length} ${lang === 'en' ? 'alerts' : 'تنبيهات'}`
                        : t('topbar.new_count')}
                    </Badge>
                  </div>
                  {apiNotifications && apiNotifications.length > 0
                    ? apiNotifications.slice(0, 5).map((item) => {
                        const tone = mapNotificationTone(item.type || '');
                        const NotificationIcon = notificationIcons[tone];
                        return (
                          <article key={item.id}>
                            <i className={`notification-type-icon ${tone}`}>
                              <NotificationIcon size={17} strokeWidth={2} />
                            </i>
                            <span style={{ textAlign: isRTL ? 'right' : 'left' }}>
                              <b>{item.title || item.message}</b>
                              <small>{item.time_ago || item.message}</small>
                            </span>
                          </article>
                        );
                      })
                    : fallbackNotifications.map((item) => {
                        const NotificationIcon = notificationIcons[item.tone];
                        return (
                          <article key={item.text}>
                            <i className={`notification-type-icon ${item.tone}`}><NotificationIcon size={17} strokeWidth={2} /></i>
                            <span style={{ textAlign: isRTL ? 'right' : 'left' }}>
                              <b>{item.text}</b>
                              <small>{item.time}</small>
                            </span>
                          </article>
                        );
                      })}
                </div>
              )}
            </div>

            <button
              type="button"
              className="topbar-lang-btn"
              onClick={toggleLang}
              title={lang === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                height: '32px',
                padding: '0 10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#334155',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Globe size={14} />
              <span>{lang === 'ar' ? 'English' : 'العربية'}</span>
            </button>
          </div>
        </header>
        <main className="app-content"><Outlet /></main>
      </div>
      <nav className="shell-mobile-nav" aria-label="تنقل الجوال">
        {[
          ...navItemDefs.slice(0, 3),
          { to: '/app/operations/cleaning', labelKey: 'nav.operations', icon: Sparkles, end: false },
          { to: '/app/support', labelKey: 'nav.support', icon: Headphones, end: false },
        ].map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon size={18} />
            <span>{t(labelKey).replace(' والتقويم', '').replace(' & calendar', '').replace(' & Calendar', '')}</span>
          </NavLink>
        ))}
      </nav>
      {location.pathname !== '/app/support' && (
        <button className="shell-floating-add" onClick={() => navigate('/app/new/booking')} aria-label={t('nav.new_booking')}>
          <Plus size={20} />
        </button>
      )}
    </div>
  );
}
