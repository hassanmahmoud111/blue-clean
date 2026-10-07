import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle, Bell, BedDouble, CalendarDays, Check, Clock3, Home, LogIn,
  LogOut, MoreHorizontal, Plus, Settings2, Sparkles, Wrench,
} from 'lucide-react';
import {
  fallbackClientDashboardOverview,
  fetchClientDashboardOverview,
} from '../services/clientDashboardService';
import type { ClientDashboardOverviewData } from '../types/clientDashboard';
import './dashboard-reference.css';

const platforms: Record<string, { name: string; short: string; className: string }> = {
  booking: { name: 'Booking.com', short: 'B.', className: 'booking' },
  'booking.com': { name: 'Booking.com', short: 'B.', className: 'booking' },
  airbnb: { name: 'Airbnb', short: 'A', className: 'airbnb' },
  gathern: { name: 'Gathern', short: 'G', className: 'gathern' },
  'جاذر': { name: 'Gathern', short: 'G', className: 'gathern' },
  direct: { name: 'مباشر', short: 'M', className: 'direct' },
  'مباشر': { name: 'مباشر', short: 'M', className: 'direct' },
};

function getPlatformMeta(source?: string | null) {
  const key = (source || '').toLowerCase().trim();
  return platforms[key] || { name: source || 'مباشر', short: 'M', className: 'direct' };
}

function formatTimelineTime(timeStr?: string) {
  if (!timeStr) return '';
  if (timeStr.includes(':')) {
    const [h, m] = timeStr.split(':');
    const hour = parseInt(h, 10);
    const suffix = hour >= 12 ? 'م' : 'ص';
    const hour12 = hour % 12 || 12;
    return `${String(hour12).padStart(2, '0')}:${m} ${suffix}`;
  }
  return timeStr;
}

function formatRelativeTime(dateStr?: string | null) {
  if (!dateStr) return '—';
  try {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'الآن';
    if (diff < 60) return `منذ ${diff} دقيقة`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return 'منذ يوم';
  } catch {
    return 'منذ دقائق';
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<ClientDashboardOverviewData>(fallbackClientDashboardOverview);

  useEffect(() => {
    let active = true;
    fetchClientDashboardOverview().then(res => {
      if (active && res) {
        setData(res);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const { user, kpis, units_status_breakdown, attention_units, today_timeline, recent_alerts, upcoming_bookings, channel_integrations } = data;

  const metricCards = [
    { label: 'إجمالي الوحدات', value: `${kpis.total_units}`, note: `+${kpis.new_units_this_month} هذا الشهر`, icon: Home, tone: 'blue' },
    { label: 'الوحدات المشغولة', value: `${kpis.occupied_units}`, note: `${kpis.occupancy_rate}% نسبة الإشغال`, icon: BedDouble, tone: 'red' },
    { label: 'المغادرات اليوم', value: `${kpis.today_departures}`, note: 'بحاجة إلى تنظيف', icon: LogOut, tone: 'orange' },
    { label: 'الوصول اليوم', value: `${kpis.today_arrivals}`, note: `${kpis.today_afternoon_arrivals} بعد الظهر`, icon: LogIn, tone: 'yellow' },
  ];

  return <div className="dashboard-reference-page">
    <header className="dashboard-welcome">
      <div><h1>صباح الخير، {user.name.split(' ')[0]} <span>👋</span></h1><p>إليك ملخص ما يحدث في وحداتك اليوم ({user.facility_name}).</p></div>
      <Link to="/app/new/booking" className="dashboard-add-booking"><Plus size={18} />إضافة حجز</Link>
    </header>

    <section className="dashboard-metrics">{metricCards.map(({label,value,note,icon:Icon,tone}) => <article key={label}><span className={`metric-icon ${tone}`}><Icon size={25} strokeWidth={1.9} /></span><div><h2>{label}</h2><strong>{value}</strong><p className={label === 'إجمالي الوحدات' ? 'positive' : ''}>{note}{label === 'إجمالي الوحدات' && ' ↑'}{label !== 'إجمالي الوحدات' && <Clock3 size={11} />}</p></div></article>)}</section>

    <section className="dashboard-columns">
      <aside className="dashboard-attention dashboard-panel">
        <div className="panel-head"><h2>وحدات تحتاج انتباه</h2><Link to="/app/operations/cleaning">عرض الكل</Link></div>
        <div className="attention-list">{attention_units.map((item, index) => {
          const Icon = item.type === 'maintenance' ? Wrench : item.type === 'service' ? Settings2 : Sparkles;
          const isUrgent = item.priority === 'urgent';
          const priorityLabel = isUrgent ? 'عاجل' : item.priority === 'high' ? 'عالية' : 'متوسطة';
          const statusLabel = item.status === 'pending' ? 'بانتظار التنظيف' : item.status === 'in_progress' ? 'قيد التنفيذ' : 'جاهزة للتعيين';
          const timeLabel = item.next_booking_check_in ? `الحجز التالي: ${formatTimelineTime(item.next_booking_check_in.split(' ')[1])}` : '';
          const actionLabel = item.worker_name ? `المسؤول: ${item.worker_name}` : item.type === 'cleaning' ? 'لم يتم تعيين عامل تنظيف بعد' : 'مشكلة وبلاغ صيانة مفتوح';
          return <article key={item.id}><div className="attention-title"><span className={`attention-icon a${index % 3}`}><Icon size={19} /></span><div><h3>{item.unit_name}</h3><p>{item.property_name}</p></div><em className={isUrgent ? 'urgent' : 'medium'}>{priorityLabel}</em></div><span className={`attention-status s${index % 3}`}>{statusLabel}</span>{timeLabel && <p className="attention-time">{timeLabel}</p>}<p className="attention-note">{actionLabel}</p><Link to={`/app/units/${item.unit_id}`} className="attention-button text-center flex items-center justify-center">عرض التفاصيل</Link></article>;
        })}</div>
      </aside>

      <div className="dashboard-middle-column">
        <section className="dashboard-timeline dashboard-panel"><div className="panel-head"><h2>حركة اليوم</h2><Link to="/app/operations/cleaning">عرض كل الأحداث</Link></div><p className="panel-subtitle">تسلسل عمليات الوصول والمغادرة والتنظيف لليوم</p><div className="timeline-list">{today_timeline.map((item, index) => {
          const Icon = item.type === 'departure' ? LogOut : item.type === 'arrival' ? LogIn : item.type === 'cleaning' ? Sparkles : Check;
          const title = item.type === 'departure' ? `مغادرة ${item.unit_name}` : item.type === 'arrival' ? `وصول ${item.unit_name}` : item.type === 'cleaning' ? `تنظيف ${item.unit_name}` : `فحص ${item.unit_name}`;
          const detail = `${item.property_name}${item.guest_name ? ` · ${item.guest_name}` : ''}`;
          const statusText = item.status === 'completed' ? 'مكتمل' : item.status === 'in_progress' ? 'قيد التنفيذ' : 'مجدول';
          const meta = `${statusText}${item.booking_source ? ` · ${item.booking_source}` : ''}`;
          return <article key={item.id}><time>{formatTimelineTime(item.time)}</time><span className={`timeline-icon t${index % 5}`}><Icon size={17} /></span><div><h3>{title}</h3><p>{detail}</p><small>{meta}</small></div></article>;
        })}</div></section>
        <section className="dashboard-reservations dashboard-panel"><div className="panel-head"><h2>الحجوزات القادمة</h2><Link to="/app/bookings">عرض كل الحجوزات</Link></div><div>{upcoming_bookings.slice(0, 4).map((booking) => {
          const platform = getPlatformMeta(booking.booking_source);
          return <article key={booking.id}><span className={`reservation-platform ${platform.className}`}>{platform.short}</span><div className="reservation-guest"><strong>{booking.guest_name}</strong><small>{booking.unit_name} · {booking.property_name}</small></div><div className="reservation-dates"><span>دخول: {booking.check_in_date}</span><small>مغادرة: {booking.check_out_date}</small></div><em className={booking.status === 'pending' ? 'waiting' : ''}>{booking.status === 'confirmed' ? 'مؤكد' : 'قيد الانتظار'}</em></article>;
        })}</div></section>
      </div>

      <div className="dashboard-left-column">
        <section className="dashboard-status dashboard-panel"><div className="panel-head"><h2>حالة الوحدات</h2><button aria-label="المزيد"><MoreHorizontal size={18} /></button></div><div className="status-bar"><i style={{ width: `${units_status_breakdown.percentages.occupied}%` }} /><i style={{ width: `${units_status_breakdown.percentages.ready}%` }} /><i style={{ width: `${units_status_breakdown.percentages.pending_cleaning}%` }} /><i style={{ width: `${units_status_breakdown.percentages.maintenance}%` }} /></div><div className="status-numbers"><span><strong>{units_status_breakdown.occupied}</strong><small>مشغولة</small></span><span><strong>{units_status_breakdown.ready}</strong><small>جاهزة</small></span><span><strong>{units_status_breakdown.pending_cleaning}</strong><small>بانتظار التنظيف</small></span><span><strong>{units_status_breakdown.maintenance}</strong><small>قيد الصيانة</small></span></div></section>
        <section className="dashboard-alerts dashboard-panel"><div className="panel-head"><h2>آخر التنبيهات</h2><Link to="/app/support">عرض الكل</Link></div><div>{recent_alerts.map((item, index) => <article key={item.id}><span className={`alert-icon n${index % 4}`}>{item.priority === 'urgent' ? <AlertTriangle size={17} /> : item.priority === 'high' ? <Bell size={17} /> : <Check size={17} />}</span><div><p>{item.subject}{item.ticket_number ? ` (${item.ticket_number})` : ''}</p><small>{formatRelativeTime(item.created_at)}</small></div></article>)}</div></section>
        <section className="dashboard-integrations dashboard-panel"><div className="panel-head"><h2>حالة الربط</h2><Link to="/app/settings/integrations">إدارة الربط</Link></div><div>{channel_integrations.map((item) => {
          const platform = getPlatformMeta(item.platform);
          return <article key={item.platform}><span className={`reservation-platform ${platform.className}`}>{platform.short}</span><div><strong>{platform.name}</strong><p className={item.is_connected ? '' : 'manual'}><i />{item.is_connected ? 'متصل' : 'إدخال يدوي'}</p><small>{item.is_connected ? `آخر مزامنة: ${formatRelativeTime(item.last_sync_at)}` : 'API غير موثقة حاليًا'}</small></div></article>;
        })}</div></section>
      </div>
    </section>

    <Link to="/app/operations/services" className="season-banner" aria-label="اكتشف الخدمات الإضافية"><span>مستعد لموسم أفضل؟</span><small>حافظ على جاهزية وحداتك وقدم تجربة استثنائية لضيوفك.</small><b>اكتشف الخدمات الإضافية</b></Link>
  </div>;
}

