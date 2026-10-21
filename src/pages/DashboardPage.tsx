import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  Calendar,
  CheckCircle2,
  Clock3,
  Headphones,
  Home,
  LogIn,
  LogOut,
  MoreHorizontal,
  Plus,
  Sparkles,
  Wrench,
} from 'lucide-react';
import {
  fallbackClientDashboardOverview,
  fetchClientDashboardOverview,
} from '../services/clientDashboardService';
import type {
  ClientDashboardOverviewData,
  ClientDashboardRecentAlert,
} from '../types/clientDashboard';
import PublicLoadingScreen from '../components/PublicLoadingScreen';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedPropertyName, getLocalizedUnitName } from '../utils/unitTranslations';
import './dashboard-page.css';

function formatTimeFromIso(iso: string | null | undefined, lang: 'ar' | 'en'): string {
  if (!iso) return lang === 'en' ? '04:01 PM' : '04:01 م';
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return String(iso);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const isPm = hours >= 12;
    hours = hours % 12 || 12;
    const hh = String(hours).padStart(2, '0');
    if (lang === 'en') {
      return `${hh}:${minutes} ${isPm ? 'PM' : 'AM'}`;
    }
    return `${hh}:${minutes} ${isPm ? 'م' : 'ص'}`;
  } catch {
    return String(iso);
  }
}

function getAlertLabel(alert: ClientDashboardRecentAlert, lang: 'ar' | 'en'): string {
  const rawSubject =
    typeof alert?.subject === 'string' && alert.subject.trim()
      ? alert.subject.trim()
      : alert?.guest_name
        ? `حجز مؤكد للضيف ${alert.guest_name}`
        : alert?.unit_name || '';

  if (!rawSubject) {
    return lang === 'en' ? 'Confirmed booking notification' : 'حجز مؤكد جديد';
  }
  if (lang === 'ar') return rawSubject;

  if (rawSubject.includes('ahmed')) return 'Confirmed booking for guest Ahmed';
  if (rawSubject.includes('فهد السبيعي')) return 'Confirmed booking for Fahad Al-Subaie';
  if (rawSubject.includes('خالد المطيري')) return 'Confirmed booking for Khaled Al-Mutairi';
  if (rawSubject.includes('Airbnb')) return 'Inquiry regarding Airbnb channel connection';
  if (rawSubject.includes('تقرير شهري')) return 'Monthly unit & invoice report request';
  if (rawSubject.includes('حجز مؤكد للضيف')) {
    const guest = rawSubject.replace('حجز مؤكد للضيف', '').trim();
    return `Confirmed booking for guest ${guest}`;
  }
  return rawSubject;
}

export default function DashboardPage() {
  const { lang, t } = useLanguage();
  const [data, setData] = useState<ClientDashboardOverviewData>(fallbackClientDashboardOverview);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchClientDashboardOverview()
      .then(res => {
        if (active && res) {
          setData(res);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const user = data?.user || fallbackClientDashboardOverview.user;
  const kpis = data?.kpis || fallbackClientDashboardOverview.kpis;
  const units_status_breakdown =
    data?.units_status_breakdown || fallbackClientDashboardOverview.units_status_breakdown;
  const attention_units = Array.isArray(data?.attention_units) ? data.attention_units : [];
  const today_timeline = Array.isArray(data?.today_timeline) ? data.today_timeline : [];
  const upcoming_bookings = Array.isArray(data?.upcoming_bookings) ? data.upcoming_bookings : [];
  const recent_alerts =
    Array.isArray(data?.recent_alerts) && data.recent_alerts.length > 0
      ? data.recent_alerts
      : fallbackClientDashboardOverview.recent_alerts;
  const channel_integrations =
    Array.isArray(data?.channel_integrations) && data.channel_integrations.length > 0
      ? data.channel_integrations
      : fallbackClientDashboardOverview.channel_integrations;

  const firstNameAr =
    typeof user?.name === 'string' && user.name.trim()
      ? user.name.trim().split(' ')[0]
      : 'عبدالله';
  const userName =
    lang === 'en'
      ? firstNameAr === 'عبدالله'
        ? 'Abdullah'
        : firstNameAr
      : firstNameAr;

  const occupancyRateRounded = Math.round((Number(kpis?.occupancy_rate) || 0) * 10) / 10;

  const platformConfig: Record<string, { label: string; badge: string; cls: string }> = {
    booking: { label: 'Booking.com', badge: 'B.', cls: 'booking' },
    airbnb: { label: 'Airbnb', badge: 'A', cls: 'airbnb' },
    gathern: { label: 'Gathern', badge: 'G', cls: 'gathern' },
  };

  const alertColors = ['green', 'red', 'blue', 'orange'] as const;

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div className="dashboard-page-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-welcome-info">
          <h1>
            {t('dashboard.welcome')}{lang === 'en' ? ', ' : '، '}{userName} <span>👋</span>
          </h1>
          <p>{t('dashboard.welcome_sub')}</p>
        </div>

        <Link to="/app/new/booking" className="btn-add-booking-primary">
          <Plus size={16} />
          {t('nav.new_booking')}
        </Link>
      </header>

      {/* Top 4 KPI Metrics */}
      <section className="dashboard-metrics-grid">
        {/* Metric 1: Total Units */}
        <article className="dashboard-metric-card">
          <div className="metric-card-top">
            <span className="metric-label">{t('dashboard.total_units')}</span>
            <div className="metric-icon-box blue">
              <Home size={18} />
            </div>
          </div>
          <strong className="metric-val">{kpis.total_units ?? 0}</strong>
          <div className="metric-bottom-note positive">
            <span>+{kpis.new_units_this_month ?? 0} {lang === 'en' ? 'this month' : 'هذا الشهر'}</span>
            <span>↑</span>
          </div>
        </article>

        {/* Metric 2: Occupied Units */}
        <article className="dashboard-metric-card">
          <div className="metric-card-top">
            <span className="metric-label">{t('dashboard.occupied_units')}</span>
            <div className="metric-icon-box red">
              <BedDouble size={18} />
            </div>
          </div>
          <strong className="metric-val">{kpis.occupied_units ?? 0}</strong>
          <div className="metric-bottom-note">
            <Clock3 size={12} />
            <span>{occupancyRateRounded}% {lang === 'en' ? 'Occupancy rate' : 'نسبة الإشغال'}</span>
          </div>
        </article>

        {/* Metric 3: Today's Departures */}
        <article className="dashboard-metric-card">
          <div className="metric-card-top">
            <span className="metric-label">{t('dashboard.today_departures')}</span>
            <div className="metric-icon-box orange">
              <LogOut size={18} />
            </div>
          </div>
          <strong className="metric-val">{kpis.today_departures ?? 0}</strong>
          <div className="metric-bottom-note">
            <Clock3 size={12} />
            <span>{lang === 'en' ? `${kpis.today_departures ?? 0} scheduled departures` : `مغادرة مجدولة ${kpis.today_departures ?? 0}`}</span>
          </div>
        </article>

        {/* Metric 4: Today's Arrivals */}
        <article className="dashboard-metric-card">
          <div className="metric-card-top">
            <span className="metric-label">{t('dashboard.today_arrivals')}</span>
            <div className="metric-icon-box yellow">
              <LogIn size={18} />
            </div>
          </div>
          <strong className="metric-val">{kpis.today_arrivals ?? 0}</strong>
          <div className="metric-bottom-note">
            <Clock3 size={12} />
            <span>{lang === 'en' ? `${kpis.today_arrivals ?? 0} scheduled arrivals` : `وصول مجدول اليوم ${kpis.today_arrivals ?? 0}`}</span>
          </div>
        </article>
      </section>

      {/* Main 3 Columns Layout (Mirrors automatically on RTL / LTR) */}
      <section className="dashboard-main-grid">
        {/* Column 1: وحدات تحتاج انتباه / Action Required */}
        <div className="dashboard-card attention-card">
          <div className="dashboard-card-head">
            <div className="card-title-group">
              <h2>{lang === 'en' ? 'Action Required' : 'وحدات تحتاج انتباه'}</h2>
            </div>
            <Link to="/app/operations/cleaning" className="card-head-link">
              {lang === 'en' ? 'View All' : 'عرض الكل'}
            </Link>
          </div>

          {attention_units.length === 0 ? (
            <div className="attention-empty-state">
              <div className="attention-check-icon">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="attention-empty-title">
                {lang === 'en' ? 'All Units Ready' : 'جميع الوحدات جاهزة'}
              </h3>
              <p className="attention-empty-subtitle">
                {lang === 'en'
                  ? 'No units require urgent attention at this moment'
                  : 'لا توجد وحدات تحتاج لانتباه عاجل حالياً'}
              </p>
            </div>
          ) : (
            <div className="dashboard-alerts-list">
              {attention_units.map((unit, idx) => (
                <Link
                  key={`${unit.type || 'unit'}-${unit.id ?? idx}`}
                  to={`/app/units/${unit.unit_id || unit.id}`}
                  className="alert-row-item"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="alert-item-info">
                    <span className="alert-item-subject">
                      {getLocalizedUnitName(unit.unit_name || '', undefined, lang)}
                    </span>
                    <span className="alert-item-time">
                      {getLocalizedPropertyName(unit.property_name || '', undefined, lang)}{' '}
                      {unit.status ? `• ${unit.status}` : ''}
                    </span>
                  </div>
                  <div className={`alert-item-icon-box ${unit.type === 'maintenance' ? 'orange' : 'blue'}`}>
                    {unit.type === 'maintenance' ? <Wrench size={15} /> : <Sparkles size={15} />}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: حركة اليوم & الحجوزات القادمة / Timeline & Recent Bookings */}
        <div className="dashboard-center-column">
          {/* Card: حركة اليوم */}
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="card-title-group">
                <h2>{lang === 'en' ? "Today's Schedule" : 'حركة اليوم'}</h2>
                <p>
                  {lang === 'en'
                    ? "Sequence of arrivals, departures, and cleaning for today"
                    : 'تسلسل عمليات الوصول والمغادرة والتنظيف لليوم'}
                </p>
              </div>
              <Link to="/app/operations/cleaning" className="card-head-link">
                {lang === 'en' ? 'View All Events' : 'عرض كل الأحداث'}
              </Link>
            </div>

            {today_timeline.length === 0 ? (
              <div className="empty-center-card">
                <Calendar size={36} className="empty-center-icon" />
                <h3 className="empty-center-title">
                  {lang === 'en' ? 'No activity recorded for today' : 'لا توجد حركة مسجلة لليوم'}
                </h3>
                <p className="empty-center-subtitle">
                  {lang === 'en'
                    ? 'Scheduled arrivals, departures, and cleaning will appear here.'
                    : 'ستظهر هنا عمليات الوصول والمغادرة والتنظيف فور جدولتها.'}
                </p>
              </div>
            ) : (
              <div className="dashboard-alerts-list">
                {today_timeline.map((item, idx) => (
                  <div key={`${item.type || 'tl'}-${item.id ?? idx}`} className="alert-row-item">
                    <div className="alert-item-info">
                      <span className="alert-item-subject">
                        {item.unit_name || ''} {item.guest_name ? `— ${item.guest_name}` : ''}
                      </span>
                      <span className="alert-item-time">
                        {item.time || ''} {item.property_name ? `• ${item.property_name}` : ''}
                      </span>
                    </div>
                    <div className="alert-item-icon-box blue">
                      <Clock3 size={15} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card: الحجوزات القادمة */}
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="card-title-group">
                <h2>{lang === 'en' ? 'Upcoming Bookings' : 'الحجوزات القادمة'}</h2>
              </div>
              <Link to="/app/bookings" className="card-head-link">
                {lang === 'en' ? 'View All Bookings' : 'عرض كل الحجوزات'}
              </Link>
            </div>

            {upcoming_bookings.length === 0 ? (
              <div className="empty-center-card">
                <Calendar size={36} className="empty-center-icon" />
                <h3 className="empty-center-title">
                  {lang === 'en' ? 'No upcoming bookings' : 'لا توجد حجوزات قادمة'}
                </h3>
                <p className="empty-center-subtitle">
                  {lang === 'en'
                    ? 'Add a booking manually or connect booking channels for instant sync.'
                    : 'يمكنك إضافة حجز يدوياً أو ربط منصات الحجز لمزامنة تلقائية.'}
                </p>
                <Link to="/app/new/booking" className="btn-add-booking-outline">
                  <Plus size={14} />
                  {lang === 'en' ? 'New Booking' : 'إضافة حجز جديد'}
                </Link>
              </div>
            ) : (
              <div className="dashboard-alerts-list">
                {upcoming_bookings.map((bk, idx) => (
                  <Link
                    key={bk.id ?? idx}
                    to={`/app/bookings/${bk.booking_code || bk.id}`}
                    className="alert-row-item"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div className="alert-item-info">
                      <span className="alert-item-subject">
                        {bk.guest_name || ''} — {bk.unit_name || ''}
                      </span>
                      <span className="alert-item-time">
                        {bk.check_in_date || ''} → {bk.check_out_date || ''} ({bk.nights_count ?? 1} {lang === 'en' ? 'nights' : 'ليالٍ'})
                      </span>
                    </div>
                    <div className="alert-item-icon-box green">
                      <Calendar size={15} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 3: حالة الوحدات & آخر التنبيهات & حالة الربط / Unit Status, Alerts & Channels */}
        <div className="dashboard-left-column">
          {/* Card 1: حالة الوحدات */}
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="card-title-group">
                <h2>{lang === 'en' ? 'Live Unit Status' : 'حالة الوحدات'}</h2>
              </div>
              <button type="button" className="btn-card-more" aria-label={lang === 'en' ? 'More' : 'المزيد'}>
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Status Progress Bar */}
            <div className="unit-status-bar">
              <div
                style={{
                  width: `${units_status_breakdown?.percentages?.occupied ?? 14.3}%`,
                  background: '#16a34a',
                }}
              />
              <div
                style={{
                  width: `${units_status_breakdown?.percentages?.ready ?? 85.7}%`,
                  background: '#0284c7',
                }}
              />
              {(units_status_breakdown?.percentages?.pending_cleaning ?? 0) > 0 && (
                <div
                  style={{
                    width: `${units_status_breakdown.percentages.pending_cleaning}%`,
                    background: '#f59e0b',
                  }}
                />
              )}
              {(units_status_breakdown?.percentages?.maintenance ?? 0) > 0 && (
                <div
                  style={{
                    width: `${units_status_breakdown.percentages.maintenance}%`,
                    background: '#ef4444',
                  }}
                />
              )}
            </div>

            {/* Status 4 Numbers */}
            <div className="unit-status-numbers">
              <div className="status-number-box">
                <strong className="status-number-val">{units_status_breakdown?.occupied ?? 0}</strong>
                <span className="status-number-label">
                  <i className="status-dot occupied" />
                  {lang === 'en' ? 'Occupied' : 'مشغولة'}
                </span>
              </div>
              <div className="status-number-box">
                <strong className="status-number-val">{units_status_breakdown?.ready ?? 0}</strong>
                <span className="status-number-label">
                  <i className="status-dot ready" />
                  {lang === 'en' ? 'Ready' : 'جاهزة'}
                </span>
              </div>
              <div className="status-number-box">
                <strong className="status-number-val">{units_status_breakdown?.pending_cleaning ?? 0}</strong>
                <span className="status-number-label">
                  <i className="status-dot cleaning" />
                  {lang === 'en' ? 'Needs Cleaning' : 'بانتظار التنظيف'}
                </span>
              </div>
              <div className="status-number-box">
                <strong className="status-number-val">{units_status_breakdown?.maintenance ?? 0}</strong>
                <span className="status-number-label">
                  <i className="status-dot maintenance" />
                  {lang === 'en' ? 'Maintenance' : 'قيد الصيانة'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: آخر التنبيهات */}
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="card-title-group">
                <h2>{lang === 'en' ? 'Recent Alerts' : 'آخر التنبيهات'}</h2>
              </div>
              <Link to="/app/support" className="card-head-link">
                {lang === 'en' ? 'View All' : 'عرض الكل'}
              </Link>
            </div>

            <div className="dashboard-alerts-list">
              {recent_alerts.slice(0, 4).map((alert, idx) => {
                const isSupport = alert?.entity_type === 'support_ticket';
                const color = isSupport ? 'orange' : alertColors[idx % alertColors.length];
                return (
                  <div key={`${alert?.entity_type || 'alert'}-${alert?.id ?? idx}-${idx}`} className="alert-row-item">
                    <div className="alert-item-info">
                      <span className="alert-item-subject">
                        {getAlertLabel(alert, lang)}
                      </span>
                      <span className="alert-item-time">
                        {formatTimeFromIso(alert?.created_at, lang)}
                      </span>
                    </div>
                    <div className={`alert-item-icon-box ${color}`}>
                      {isSupport ? <Headphones size={15} /> : <Calendar size={15} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: حالة الربط */}
          <div className="dashboard-card">
            <div className="dashboard-card-head">
              <div className="card-title-group">
                <h2>{lang === 'en' ? 'Channel Connection' : 'حالة الربط'}</h2>
              </div>
              <Link to="/app/settings/integrations" className="card-head-link">
                {lang === 'en' ? 'Manage' : 'إدارة الربط'}
              </Link>
            </div>

            <div className="dashboard-integrations-list">
              {channel_integrations.map((channel, idx) => {
                const platKey = String(channel?.platform || 'booking');
                const cfg = platformConfig[platKey] || {
                  label: platKey,
                  badge: platKey.slice(0, 1).toUpperCase(),
                  cls: 'booking',
                };
                const syncTime = formatTimeFromIso(channel?.last_sync_at, lang);
                return (
                  <div key={`${platKey}-${idx}`} className="integration-row-item">
                    <span className="integration-status-tag">
                      <i className="integration-dot" />
                      {channel?.is_connected
                        ? lang === 'en'
                          ? 'Connected'
                          : 'متصل'
                        : lang === 'en'
                          ? 'Disconnected'
                          : 'غير متصل'}
                    </span>
                    <div className="integration-item-info">
                      <strong className="integration-name">{cfg.label}</strong>
                      <span className="integration-time">
                        {lang === 'en' ? `Last sync: ${syncTime}` : `آخر مزامنة: ${syncTime}`}
                      </span>
                    </div>
                    <div className={`integration-logo-badge ${cfg.cls}`}>{cfg.badge}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Season Banner */}
      <section className="dashboard-season-banner">
        <h3 className="season-banner-title">
          {lang === 'en' ? 'Ready for a higher-revenue season?' : 'مستعد لموسم أفضل؟'}
        </h3>
        <p className="season-banner-subtitle">
          {lang === 'en'
            ? 'Keep your properties guest-ready and maximize occupancy with premium housekeeping and fast turnover.'
            : 'حافظ على جاهزية وحداتك وقدم تجربة استثنائية لضيوفك مع خدمات التنظيف والصيانة والتعقيم الشامل.'}
        </p>
        <Link to="/app/operations/services" className="btn-season-action">
          {lang === 'en' ? 'Explore Extra Services' : 'اكتشف الخدمات الإضافية'}
        </Link>
      </section>
    </div>
  );
}
