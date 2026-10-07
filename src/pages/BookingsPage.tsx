import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Eye,
  List,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { SearchableSelect, Tooltip } from '../components/ui';
import type { BookingItem, BookingStats, CalendarData } from '../types/clientBooking';
import {
  deleteClientBooking,
  fetchBookingCalendar,
  fetchBookings,
  fetchBookingStats,
} from '../services/clientBookingService';
import './reference-pages.css';
import './bookings-list-view.css';

export default function BookingsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState('2026-09-10');

  const [stats, setStats] = useState<BookingStats>({
    total_bookings: 0,
    check_ins_this_week: 0,
    check_outs_this_week: 0,
    upcoming_bookings: 0,
  });

  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [bookingsList, setBookingsList] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters for list view
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState('all');
  const [selectedUnit, setSelectedUnit] = useState('all');

  const loadData = async () => {
    try {
      const [sRes, cRes, bRes] = await Promise.all([
        fetchBookingStats(),
        fetchBookingCalendar({ view_mode: calendarMode, date: currentDate, unit_id: selectedUnit }),
        fetchBookings({ search: query, channel, per_page: 50 }),
      ]);
      setStats(sRes);
      setCalendarData(cRes);
      setBookingsList(bRes.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [calendarMode, currentDate, channel, selectedUnit, query]);

  const handleDelete = async (id: number | string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      await deleteClientBooking(id);
      await loadData();
    }
  };

  const statCards = [
    { label: 'إجمالي الحجوزات', value: String(stats.total_bookings ?? 0), note: '↑ 8%', icon: BedDouble, color: 'sky' },
    { label: 'الوصول هذا الأسبوع', value: String(stats.check_ins_this_week ?? 0), note: '', icon: ChevronLeft, color: 'green' },
    { label: 'المغادرات هذا الأسبوع', value: String(stats.check_outs_this_week ?? 0), note: '', icon: ChevronRight, color: 'red' },
    { label: 'الحجوزات القادمة', value: String(stats.upcoming_bookings ?? 0), note: '↑ 12%', icon: BedDouble, color: 'blue' },
  ];

  const channelOptions = [
    { value: 'all', label: 'جميع المصادر' },
    { value: 'Booking.com', label: 'Booking.com' },
    { value: 'Airbnb', label: 'Airbnb' },
    { value: 'Gathern', label: 'Gathern' },
    { value: 'direct', label: 'حجز مباشر' },
  ];

  const unitOptions = useMemo(() => {
    const list = [{ value: 'all', label: 'جميع الوحدات' }];
    calendarData?.units.forEach(u => {
      list.push({ value: String(u.id), label: `${u.name} · ${u.property_name}` });
    });
    return list;
  }, [calendarData]);

  const unitsList = calendarData?.units || [];
  const upcoming = calendarData?.upcoming_bookings || bookingsList.slice(0, 6);
  const platformDist = calendarData?.platform_distribution || [
    { source: 'حجز مباشر: هاتف، واتساب أو موقع', count: 1, percentage: 100 },
  ];

  return (
    <div className="reference-page bookings-page">
      <header className="reference-page-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to="/app">الرئيسية</Link>
            <ChevronLeft size={13} />
            <span>الحجوزات والتقويم</span>
          </div>
          <h1>
            <CalendarDays size={29} />
            الحجوزات والتقويم
          </h1>
          <p>عرض وإدارة جميع حجوزاتك، التقويم التفاعلي ومصادر الحجز</p>
        </div>
        <div className="reference-page-actions">
          <div className="booking-display-switch" aria-label="طريقة عرض الحجوزات">
            <button
              type="button"
              className={view === 'calendar' ? 'active' : ''}
              onClick={() => setView('calendar')}
            >
              <CalendarDays size={17} />
              التقويم
            </button>
            <button
              type="button"
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              <List size={17} />
              القائمة
            </button>
          </div>
          <Link className="reference-primary" to="/app/new/booking">
            <Plus size={20} />
            إضافة حجز
          </Link>
        </div>
      </header>

      {/* KPI Stats */}
      <section className="reference-stats four">
        {statCards.map(({ label, value, note, icon: Icon, color }) => (
          <article className="reference-stat" key={label}>
            <span className={`reference-stat-icon ${color}`}>
              <Icon size={28} />
            </span>
            <div className="reference-stat-copy">
              <span>{label}</span>
              <strong>{value}</strong>
              {note && <small className="up">{note}</small>}
            </div>
          </article>
        ))}
      </section>

      {/* CALENDAR VIEW */}
      {view === 'calendar' ? (
        <div className="bookings-main">
          <section className="reference-panel calendar-card">
            <div className="calendar-toolbar">
              <div className="calendar-toolbar-group" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 170 }}>
                  <SearchableSelect
                    options={unitOptions}
                    value={selectedUnit}
                    onChange={val => setSelectedUnit(val || 'all')}
                    placeholder="جميع الوحدات"
                  />
                </div>
                <button
                  type="button"
                  className="reference-control"
                  onClick={() => setCurrentDate('2026-09-10')}
                >
                  اليوم
                </button>
                <button
                  type="button"
                  className="reference-control"
                  aria-label="الشهر التالي"
                  onClick={() => setCurrentDate('2026-10-10')}
                >
                  <ChevronRight size={17} />
                </button>
                <strong className="calendar-month">سبتمبر 2026</strong>
                <button
                  type="button"
                  className="reference-control"
                  aria-label="الشهر السابق"
                  onClick={() => setCurrentDate('2026-08-10')}
                >
                  <ChevronLeft size={17} />
                </button>
              </div>
              <div className="calendar-view-tabs">
                <button
                  type="button"
                  className={calendarMode === 'day' ? 'active' : ''}
                  onClick={() => setCalendarMode('day')}
                >
                  اليوم
                </button>
                <button
                  type="button"
                  className={calendarMode === 'week' ? 'active' : ''}
                  onClick={() => setCalendarMode('week')}
                >
                  الأسبوع
                </button>
                <button
                  type="button"
                  className={calendarMode === 'month' ? 'active' : ''}
                  onClick={() => setCalendarMode('month')}
                >
                  الشهر
                </button>
              </div>
            </div>

            <div className="calendar-body">
              <aside className="calendar-units">
                {unitsList.map((unit, index) => (
                  <div className="calendar-unit" key={unit.id}>
                    <span className={`ref-thumbnail u${(index % 8) + 1}`} />
                    <div>
                      <strong>{unit.name}</strong>
                      <small>{unit.property_name}</small>
                    </div>
                  </div>
                ))}
              </aside>

              <div className="calendar-grid-wrap">
                <div className="calendar-days">
                  <span className="calendar-day">الوقت</span>
                  {['الإثنين 7', 'الثلاثاء 8', 'الأربعاء 9', 'الخميس 10', 'الجمعة 11', 'السبت 12', 'الأحد 13'].map(
                    (day, index) => (
                      <span className={`calendar-day ${index === 3 ? 'today' : ''}`} key={day}>
                        {day.split(' ')[0]}
                        <b>{day.split(' ')[1]}</b>
                      </span>
                    )
                  )}
                </div>

                <div className="calendar-time-grid">
                  <div className="calendar-hours">
                    {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(
                      time => (
                        <span key={time}>{time}</span>
                      )
                    )}
                  </div>
                  {Array.from({ length: 7 }, (_, index) => (
                    <div className={`calendar-column ${index === 3 ? 'today' : ''}`} key={index} />
                  ))}

                  {/* Render Bookings across units */}
                  {unitsList.flatMap(u => u.bookings || []).map((b, idx) => (
                    <CalendarBooking
                      key={b.id || idx}
                      className={b.color_tone || 'blue'}
                      text={b.guest_name}
                      platform={b.booking_source === 'airbnb' ? '⌂' : b.booking_source === 'gathern' ? 'G' : 'B.'}
                      style={{
                        top: 54 + idx * 46,
                        right: `${15 + (idx % 3) * 25}%`,
                        width: '28%',
                      }}
                    />
                  ))}
                  {unitsList.every(u => !u.bookings?.length) && (
                    <CalendarBooking
                      className="blue"
                      text="عبدالله محمد (شقة 801)"
                      platform="م"
                      style={{ top: 54, right: '15%', width: '32%' }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="calendar-legend">
              <span style={{ color: '#29ae63' }}>
                <i />
                حجز مؤكد
              </span>
              <span style={{ color: '#398ff0' }}>
                <i />
                في انتظار الضيف
              </span>
              <span style={{ color: '#f49b25' }}>
                <i />
                مغادرة اليوم
              </span>
              <span style={{ color: '#ff5563' }}>
                <i />
                متأخر
              </span>
              <span style={{ color: '#8da0b0' }}>
                <i />
                ملغي
              </span>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="bookings-side">
            <section className="reference-panel upcoming-card">
              <div className="reference-panel-title">
                <h2>الحجوزات القادمة</h2>
                <button type="button" className="reference-link" onClick={() => setView('list')}>
                  عرض الكل
                </button>
              </div>
              <div className="upcoming-list">
                {upcoming.map(item => (
                  <div className="upcoming-row" key={item.id}>
                    <span className={`platform-square ${platformClass(item.source_sync?.booking_source || '')}`}>
                      {platformShort(item.source_sync?.booking_source || '')}
                    </span>
                    <div className="upcoming-row-copy">
                      <strong>{item.guest.name}</strong>
                      <small>{item.unit.name} · {item.unit.property_name}</small>
                    </div>
                    <span className="reference-chip green">
                      {item.status === 'confirmed' ? 'مؤكد' : item.status}
                    </span>
                    <div className="table-actions-cell">
                      <Tooltip text="عرض تفاصيل الحجز">
                        <Link
                          className="table-icon-btn primary"
                          to={`/app/bookings/${item.id}`}
                          aria-label={`عرض حجز ${item.guest.name}`}
                        >
                          <Eye size={15} />
                        </Link>
                      </Tooltip>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="reference-panel booking-sources">
              <div className="reference-panel-title">
                <h2>توزيع الحجوزات حسب المنصة</h2>
              </div>
              <div style={{ marginTop: 15 }}>
                {platformDist.map(dist => (
                  <SourceRow
                    key={dist.source}
                    name={dist.source}
                    platform={platformClass(dist.source)}
                    count={String(dist.count)}
                    width={`${dist.percentage}%`}
                  />
                ))}
              </div>
            </section>
          </aside>
        </div>
      ) : (
        /* LIST VIEW */
        <section className="reference-panel smart-bookings-view">
          <header className="smart-bookings-toolbar">
            <div>
              <h2>قائمة الحجوزات</h2>
              <p>عرض تشغيلي سريع للحجوزات والمواعيد وحالة الدفع والمزامنة.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <label className="reference-search" style={{ width: 260 }}>
                <Search size={17} />
                <input
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder="ابحث باسم الضيف أو الوحدة..."
                />
              </label>
              <div style={{ width: 170 }}>
                <SearchableSelect
                  options={channelOptions}
                  value={channel}
                  onChange={val => setChannel(val || 'all')}
                  placeholder="جميع المصادر"
                />
              </div>
            </div>
          </header>

          <div className="smart-bookings-head">
            <span>الحجز والضيف</span>
            <span>الوحدة</span>
            <span>الإقامة</span>
            <span>الدفع</span>
            <span>المصدر والمزامنة</span>
            <span style={{ textAlign: 'center' }}>الإجراءات</span>
          </div>

          <div className="smart-bookings-list">
            {bookingsList.map(booking => (
              <article key={booking.id}>
                <div className="smart-guest">
                  <span>{booking.guest.name ? booking.guest.name[0] : 'ض'}</span>
                  <div>
                    <strong>{booking.guest.name}</strong>
                    <small>
                      {booking.booking_code} · <UsersRound size={11} />
                      {booking.guest.total_guests ?? booking.guest.adults_count} ضيوف
                    </small>
                  </div>
                </div>

                <div className="smart-unit">
                  <span className="ref-thumbnail u1" />
                  <div>
                    <strong>{booking.unit.name}</strong>
                    <small>{booking.unit.property_name}</small>
                  </div>
                </div>

                <div className="smart-stay">
                  <span>
                    <CalendarDays size={14} />
                    <b>{booking.stay.check_in_date_formatted || booking.stay.check_in_date}</b>
                  </span>
                  <i />
                  <span>
                    <Clock3 size={14} />
                    <b>{booking.stay.check_out_date_formatted || booking.stay.check_out_date}</b>
                  </span>
                  <small>{booking.stay.nights_count} ليالٍ</small>
                </div>

                <div className="smart-payment">
                  <strong>{booking.payment.total_amount} ر.س</strong>
                  <span className={`reference-chip ${booking.payment.payment_status === 'مدفوع' ? 'green' : 'orange'}`}>
                    {booking.payment.payment_status}
                  </span>
                </div>

                <div className="smart-source">
                  <span className={`platform-square ${platformClass(booking.source_sync?.booking_source || '')}`}>
                    {platformShort(booking.source_sync?.booking_source || '')}
                  </span>
                  <div>
                    <strong>{booking.source_sync?.booking_source || 'حجز مباشر'}</strong>
                    <small>
                      <RefreshCw size={11} />
                      {booking.source_sync?.sync_status || 'لا توجد مزامنة'}
                    </small>
                  </div>
                </div>

                <div className="table-actions-cell">
                  <Tooltip text="عرض التفاصيل">
                    <Link
                      to={`/app/bookings/${booking.id}`}
                      className="table-icon-btn primary"
                      aria-label="عرض التفاصيل"
                    >
                      <Eye size={15} />
                    </Link>
                  </Tooltip>
                  <Tooltip text="تعديل الحجز">
                    <Link
                      to={`/app/bookings/${booking.id}/edit`}
                      className="table-icon-btn edit"
                      aria-label="تعديل الحجز"
                    >
                      <Pencil size={15} />
                    </Link>
                  </Tooltip>
                  <Tooltip text="حذف الحجز">
                    <button
                      type="button"
                      className="table-icon-btn danger"
                      aria-label="حذف الحجز"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </Tooltip>
                </div>
              </article>
            ))}

            {bookingsList.length === 0 && (
              <div className="smart-bookings-empty">
                <Search size={25} />
                <b>لا توجد حجوزات مطابقة</b>
                <p>جرّب كلمة بحث أخرى أو اختر جميع المصادر.</p>
              </div>
            )}
          </div>

          <footer className="smart-bookings-footer">
            <span>عرض {bookingsList.length} حجوزات</span>
            <div>
              <button type="button" disabled>
                <ChevronRight size={15} />
              </button>
              <button type="button" className="active">
                1
              </button>
              <button type="button" disabled>
                <ChevronLeft size={15} />
              </button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}

function CalendarBooking({
  className,
  text,
  platform,
  style,
}: {
  className: string;
  text: string;
  platform: string;
  style: CSSProperties;
}) {
  return (
    <div className={`calendar-booking ${className}`} style={style}>
      <span
        className={`platform-square ${
          platform === 'B.' ? 'booking' : platform === 'G' ? 'gathern' : platform === '⌂' ? 'airbnb' : 'direct'
        }`}
        style={{ width: 22, height: 22, fontSize: 11 }}
      >
        {platform}
      </span>
      {text}
    </div>
  );
}

function SourceRow({
  name,
  platform,
  count,
  width,
}: {
  name: string;
  platform: string;
  count: string;
  width: string;
}) {
  return (
    <div className="source-row">
      <span className="source-name">
        <i
          className={`platform-square ${platform}`}
          style={{ width: 21, height: 21, fontSize: 11 }}
        >
          {platform === 'booking' ? 'B.' : platform === 'airbnb' ? '⌂' : platform === 'gathern' ? 'G' : '◇'}
        </i>
        {name}
      </span>
      <span className="source-bar">
        <i className={platform} style={{ width }} />
      </span>
      <strong>{count}</strong>
    </div>
  );
}

function platformClass(channel: string) {
  if (channel.includes('Booking') || channel === 'booking') return 'booking';
  if (channel.includes('Airbnb') || channel === 'airbnb') return 'airbnb';
  if (channel.includes('Gathern') || channel === 'gathern') return 'gathern';
  return 'direct';
}

function platformShort(channel: string) {
  if (channel.includes('Booking') || channel === 'booking') return 'B.';
  if (channel.includes('Airbnb') || channel === 'airbnb') return 'A';
  if (channel.includes('Gathern') || channel === 'gathern') return 'G';
  return 'م';
}
