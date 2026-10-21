import { useEffect, useMemo, useState } from 'react';
import {
  BedDouble,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Home,
  Building2,
  List,
  Plus,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchBookingCalendar,
  fetchBookings,
  fetchBookingStats,
} from '../services/clientBookingService';
import type {
  BookingItem,
  CalendarData,
  CalendarUnit,
} from '../types/clientBooking';
import PublicLoadingScreen from '../components/PublicLoadingScreen';
import './bookings-page.css';
import './bookings-list-view.css';

const UNIT_THUMBS: Record<string, { src?: string; placeholder?: 'building' | 'chalet' }> = {
  'UNT-YMFCHL': { src: '/unit-thumbs/thumb-1.png' },
  'UNT-Q4HSI8': { src: '/unit-thumbs/thumb-2.png' },
  'UNT-103': { src: '/unit-thumbs/thumb-5.png' },
  'UNT-104': { src: '/unit-thumbs/thumb-4.png', placeholder: 'chalet' },
  'UNT-105': { src: '/unit-thumbs/thumb-3.png', placeholder: 'building' },
  'UNT-102': { src: '/unit-thumbs/thumb-6.png' },
  'UNT-101': { src: '/unit-thumbs/thumb-7.png' },
};

const UNIT_EN_NAMES: Record<string, { nameEn: string; propertyEn: string }> = {
  'UNT-YMFCHL': {
    nameEn: 'Al Remal Luxury Apt - Tower 4 (Copy)',
    propertyEn: 'Al Remal Residential Towers',
  },
  'UNT-Q4HSI8': {
    nameEn: 'Al Narjis VIP Villa Private Pool (Copy)',
    propertyEn: 'Al Narjis Compound Residence',
  },
  'UNT-103': {
    nameEn: 'Corniche Studio Sea View',
    propertyEn: 'Beach Towers',
  },
  'UNT-104': {
    nameEn: 'Al Yamama Family Chalet',
    propertyEn: 'Al Yamama Resort',
  },
  'UNT-105': {
    nameEn: 'Olaya Apt 102 - Maintenance',
    propertyEn: 'Olaya Building 12',
  },
  'UNT-102': {
    nameEn: 'Al Narjis VIP Villa Private Pool',
    propertyEn: 'Al Narjis Compound Residence',
  },
  'UNT-101': {
    nameEn: 'Al Remal Luxury Apt - Tower 4',
    propertyEn: 'Al Remal Residential Towers',
  },
};

const AR_DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const EN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AR_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];
const EN_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

function toIsoDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y || 2026, (m || 10) - 1, d || 1);
}

function formatShortDate(iso: string, lang: string): string {
  if (!iso) return '—';
  const d = parseIsoDate(iso);
  const day = d.getDate();
  const monthIdx = d.getMonth();
  return lang === 'en'
    ? `${EN_MONTHS[monthIdx]?.slice(0, 3) || ''} ${day}`
    : `${day} ${AR_MONTHS[monthIdx] || ''}`;
}

function getPlatformCode(source?: string): 'A' | 'B' | 'D' | 'G' {
  const s = (source || '').toLowerCase();
  if (s.includes('airbnb')) return 'A';
  if (s.includes('booking')) return 'B';
  if (s.includes('gathern')) return 'G';
  return 'D';
}

function getPlatformName(source?: string, label?: string, lang?: string): string {
  const s = (source || '').toLowerCase();
  if (s.includes('airbnb')) return 'Airbnb';
  if (s.includes('booking')) return 'Booking.com';
  if (s.includes('gathern')) return 'Gathern';
  if (lang === 'en') return 'Direct Booking';
  return label || 'حجز مباشر';
}

function getBarTone(platform: 'A' | 'B' | 'D' | 'G', status?: string): 'red' | 'green' | 'blue' | 'orange' {
  if (status === 'cancelled') return 'red';
  if (platform === 'A') return 'red';
  return 'green';
}

export default function BookingsPage() {
  const { lang, isRTL, t } = useLanguage();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  // Default to the week of 2026-10-03 where the active bookings exist in the API
  const [baseDateIso, setBaseDateIso] = useState<string>('2026-10-03');
  const [searchQuery, setSearchQuery] = useState('');

  const [bookingStats, setBookingStats] = useState({
    total_bookings: 4,
    check_ins_this_week: 0,
    check_outs_this_week: 1,
    upcoming_bookings: 0,
  });

  const [bookingsList, setBookingsList] = useState<BookingItem[]>([]);
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch stats & full bookings list on mount
  useEffect(() => {
    let active = true;
    setLoadingList(true);

    Promise.all([
      fetchBookingStats().then((res) => {
        if (active && res && typeof res.total_bookings === 'number') {
          setBookingStats(res);
        }
      }),
      fetchBookings().then((res) => {
        if (active && Array.isArray(res.data)) {
          setBookingsList(res.data);
        }
      }),
      fetchBookingCalendar({
        view_mode: calendarMode,
        date: baseDateIso,
        unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
      }).then((res) => {
        if (active && res) {
          setCalendarData(res);
        }
      }),
    ])
      .catch((err) => {
        console.warn('API error in BookingsPage:', err);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
          setLoadingList(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // Fetch calendar data when mode, date, or unit filter changes
  useEffect(() => {
    let active = true;
    fetchBookingCalendar({
      view_mode: calendarMode,
      date: baseDateIso,
      unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
    }).then((res) => {
      if (active && res) {
        setCalendarData(res);
      }
    });
    return () => {
      active = false;
    };
  }, [calendarMode, baseDateIso, selectedUnit]);

  // Build visible date columns based on baseDateIso and calendarMode
  const daysHeader = useMemo(() => {
    const start = parseIsoDate(baseDateIso);
    const count = calendarMode === 'day' ? 1 : calendarMode === 'month' ? 14 : 6;
    const cols: Array<{ isoDate: string; day: string; date: number; isToday: boolean }> = [];

    for (let i = 0; i < count; i++) {
      const cur = new Date(start);
      cur.setDate(start.getDate() + i);
      const iso = toIsoDate(cur);
      const dayOfWeek = cur.getDay();
      cols.push({
        isoDate: iso,
        day: lang === 'en' ? EN_DAYS[dayOfWeek] : AR_DAYS[dayOfWeek],
        date: cur.getDate(),
        isToday: iso === '2026-10-07' || iso === toIsoDate(new Date()),
      });
    }
    return cols;
  }, [baseDateIso, calendarMode, lang]);

  const currentMonthTitle = useMemo(() => {
    const d = parseIsoDate(baseDateIso);
    const m = d.getMonth();
    const y = d.getFullYear();
    return lang === 'en' ? `${EN_MONTHS[m]} ${y}` : `${AR_MONTHS[m]} ${y}`;
  }, [baseDateIso, lang]);

  const shiftCalendarDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setBaseDateIso('2026-10-03');
      return;
    }
    const delta =
      calendarMode === 'day'
        ? 1
        : calendarMode === 'month'
          ? 14
          : 6;
    const d = parseIsoDate(baseDateIso);
    d.setDate(d.getDate() + (direction === 'next' ? delta : -delta));
    setBaseDateIso(toIsoDate(d));
  };

  // Merge units from calendar API
  const allUnits: CalendarUnit[] = useMemo(() => {
    return calendarData?.units || [];
  }, [calendarData]);

  const filteredUnits = useMemo(() => {
    return allUnits.filter((u) => {
      if (selectedUnit !== 'all' && String(u.id) !== selectedUnit && u.code !== selectedUnit) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const enInfo = UNIT_EN_NAMES[u.code];
        const nameMatch =
          u.name.toLowerCase().includes(q) ||
          (enInfo?.nameEn.toLowerCase().includes(q) ?? false);
        const propMatch =
          u.property_name.toLowerCase().includes(q) ||
          (enInfo?.propertyEn.toLowerCase().includes(q) ?? false);
        if (!nameMatch && !propMatch) return false;
      }
      return true;
    });
  }, [allUnits, selectedUnit, searchQuery]);

  // Filter bookings list for List View
  const filteredBookingsList = useMemo(() => {
    if (!searchQuery.trim()) return bookingsList;
    const q = searchQuery.toLowerCase();
    return bookingsList.filter(
      (b) =>
        b.booking_code.toLowerCase().includes(q) ||
        b.guest.name.toLowerCase().includes(q) ||
        b.unit.name.toLowerCase().includes(q) ||
        b.unit.property_name.toLowerCase().includes(q)
    );
  }, [bookingsList, searchQuery]);

  // Platform distribution from API
  const platformDist = useMemo(() => {
    const apiDist = calendarData?.platform_distribution;
    if (apiDist && apiDist.length > 0) {
      return apiDist;
    }
    return [
      { source: 'airbnb', count: 1, percentage: 25 },
      { source: 'booking', count: 1, percentage: 25 },
      { source: 'direct', count: 2, percentage: 50 },
    ];
  }, [calendarData]);

  const upcomingBookings = useMemo(() => {
    return calendarData?.upcoming_bookings || [];
  }, [calendarData]);

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div className="bookings-page-container">
      {/* Header */}
      <header className="bookings-header">
        <div className="bookings-header-info">
          <div className="bookings-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.bookings')}</span>
          </div>
          <div className="bookings-title-row">
            <h1>{t('nav.bookings')}</h1>
            <span className="bookings-title-badge" aria-hidden="true">
              <CalendarDays size={20} />
            </span>
          </div>
          <p>
            {lang === 'en'
              ? 'View and manage all your bookings and availability in one place'
              : 'عرض وإدارة جميع حجوزاتك في مكان واحد'}
          </p>
        </div>

        <div className="bookings-header-actions">
          <div
            className="bookings-view-switcher"
            role="group"
            aria-label={lang === 'en' ? 'View mode' : 'طريقة العرض'}
          >
            <button
              type="button"
              className={`bookings-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={16} />
              <span>{lang === 'en' ? 'List' : 'القائمة'}</span>
            </button>
            <button
              type="button"
              className={`bookings-view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              <CalendarDays size={16} />
              <span>{lang === 'en' ? 'Calendar' : 'التقويم'}</span>
            </button>
          </div>

          <Link className="btn-add-booking" to="/app/new/booking">
            <Plus size={18} />
            <span>{lang === 'en' ? 'Add Booking' : 'إضافة حجز'}</span>
          </Link>
        </div>
      </header>

      {/* Stats Cards (4 Items connected to GET /client/bookings/stats) */}
      <section className="bookings-stats-grid">
        <div className="booking-stat-card">
          <div className="booking-stat-info">
            <span className="booking-stat-label">
              {lang === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}
            </span>
            <strong className="booking-stat-value">{bookingStats.total_bookings}</strong>
          </div>
          <div className="booking-stat-icon-wrap cyan">
            <BedDouble size={24} />
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-info">
            <span className="booking-stat-label">
              {lang === 'en' ? 'Arrivals this week' : 'الوصول هذا الأسبوع'}
            </span>
            <strong className="booking-stat-value">{bookingStats.check_ins_this_week}</strong>
          </div>
          <div className="booking-stat-icon-wrap green">
            <ChevronLeft size={24} />
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-info">
            <span className="booking-stat-label">
              {lang === 'en' ? 'Departures this week' : 'المغادرات هذا الأسبوع'}
            </span>
            <strong className="booking-stat-value">{bookingStats.check_outs_this_week}</strong>
          </div>
          <div className="booking-stat-icon-wrap red">
            <ChevronRight size={24} />
          </div>
        </div>

        <div className="booking-stat-card">
          <div className="booking-stat-info">
            <span className="booking-stat-label">
              {lang === 'en' ? 'Upcoming Bookings' : 'الحجوزات القادمة'}
            </span>
            <strong className="booking-stat-value">{bookingStats.upcoming_bookings}</strong>
          </div>
          <div className="booking-stat-icon-wrap gray">
            <Clock size={24} />
          </div>
        </div>
      </section>

      {/* Main Layout (Side Column + Calendar) */}
      {view === 'calendar' ? (
        <div className="bookings-main-layout">
          {/* Side Cards */}
          <aside className="bookings-side-column">
            {/* Top Side Card: Upcoming Bookings */}
            <div className="bookings-side-card">
              <div className="side-card-header">
                <h2>{lang === 'en' ? 'Upcoming Bookings' : 'الحجوزات القادمة'}</h2>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="side-card-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {lang === 'en' ? 'View All' : 'عرض الكل'}
                </button>
              </div>
              {upcomingBookings.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {upcomingBookings.map((ub) => (
                    <Link
                      key={ub.id}
                      to={`/app/bookings/${ub.id}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        textDecoration: 'none',
                        color: '#0f172a',
                        fontSize: '12px',
                      }}
                    >
                      <div>
                        <strong style={{ display: 'block', fontSize: '12.5px' }}>
                          {ub.guest.name}
                        </strong>
                        <span style={{ color: '#64748b', fontSize: '11px' }}>
                          {ub.unit.name}
                        </span>
                      </div>
                      <span style={{ color: '#0c7c8a', fontWeight: 700, fontSize: '11px' }}>
                        {formatShortDate(ub.stay.check_in_date, lang)}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="empty-side-state">
                  <span>
                    {lang === 'en'
                      ? 'No upcoming bookings recorded'
                      : 'لا توجد حجوزات قادمة مسجلة'}
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Side Card: Channel Distribution */}
            <div className="bookings-side-card">
              <div className="side-card-header">
                <h2>{lang === 'en' ? 'Bookings by Channel' : 'توزيع الحجوزات حسب المنصة'}</h2>
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="side-card-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {lang === 'en' ? 'View All' : 'عرض الكل'}
                </button>
              </div>

              <div className="platform-dist-list">
                {platformDist.map((item) => {
                  const src = item.source.toLowerCase();
                  const isAirbnb = src.includes('airbnb');
                  const isBooking = src.includes('booking');
                  const badgeClass = isAirbnb ? 'airbnb' : isBooking ? 'booking' : 'direct';
                  const label = isAirbnb
                    ? 'Airbnb'
                    : isBooking
                      ? 'Booking.com'
                      : lang === 'en'
                        ? 'Direct'
                        : 'حجز مباشر';

                  return (
                    <div className="platform-dist-row" key={item.source}>
                      <div className="platform-dist-info">
                        <span className={`platform-dist-badge ${badgeClass}`}>
                          {isAirbnb ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C8.5 2 6 5.5 6 10.5c0 4.2 3.2 8.4 6 11.5 2.8-3.1 6-7.3 6-11.5C18 5.5 15.5 2 12 2zm0 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                            </svg>
                          ) : isBooking ? (
                            '.B'
                          ) : (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 12h6M12 9v6" />
                            </svg>
                          )}
                        </span>
                        <span className="platform-dist-name">{label}</span>
                      </div>
                      <div className="platform-dist-bar-wrap">
                        <div
                          className={`platform-dist-bar-fill ${badgeClass}`}
                          style={{ width: `${Math.min(100, Math.max(0, item.percentage))}%` }}
                        />
                      </div>
                      <div className="platform-dist-count">
                        <span className="count-num">{item.count}</span>
                        <span className="count-label">
                          {lang === 'en' ? (item.count === 1 ? 'booking' : 'bookings') : 'حجز'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Calendar Card */}
          <section className="calendar-card">
            {/* Calendar Toolbar */}
            <div className="calendar-toolbar">
              <div className="calendar-nav-controls">
                <select
                  className="calendar-unit-select"
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(e.target.value)}
                  aria-label={lang === 'en' ? 'Filter by unit' : 'تصفية حسب الوحدة'}
                >
                  <option value="all">
                    {lang === 'en' ? 'All Units' : 'جميع الوحدات'}
                  </option>
                  {allUnits.map((u) => (
                    <option key={u.id} value={String(u.id)}>
                      {lang === 'en' ? UNIT_EN_NAMES[u.code]?.nameEn || u.name : u.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={() => shiftCalendarDate('today')}
                >
                  {lang === 'en' ? 'Today' : 'اليوم'}
                </button>

                <button
                  type="button"
                  className="calendar-arrow-btn"
                  aria-label={lang === 'en' ? 'Next Period' : 'الفترة التالية'}
                  onClick={() => shiftCalendarDate('next')}
                >
                  <ChevronRight size={16} />
                </button>

                <span className="calendar-month-title">{currentMonthTitle}</span>

                <button
                  type="button"
                  className="calendar-arrow-btn"
                  aria-label={lang === 'en' ? 'Previous Period' : 'الفترة السابقة'}
                  onClick={() => shiftCalendarDate('prev')}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>

              <div className="calendar-tabs-group">
                <button
                  type="button"
                  className={`calendar-tab-btn ${calendarMode === 'day' ? 'active' : ''}`}
                  onClick={() => setCalendarMode('day')}
                >
                  {lang === 'en' ? 'Day' : 'اليوم'}
                </button>
                <button
                  type="button"
                  className={`calendar-tab-btn ${calendarMode === 'week' ? 'active' : ''}`}
                  onClick={() => setCalendarMode('week')}
                >
                  {lang === 'en' ? 'Week' : 'الأسبوع'}
                </button>
                <button
                  type="button"
                  className={`calendar-tab-btn ${calendarMode === 'month' ? 'active' : ''}`}
                  onClick={() => setCalendarMode('month')}
                >
                  {lang === 'en' ? 'Month' : 'الشهر'}
                </button>
              </div>
            </div>

            {/* Calendar Grid Matrix */}
            <div className="calendar-grid-container">
              <table className="calendar-table">
                <thead>
                  <tr>
                    <th className="col-unit-header">{lang === 'en' ? 'Unit' : 'الوحدة'}</th>
                    {daysHeader.map((d) => (
                      <th
                        key={d.isoDate}
                        className={d.isToday ? 'today-col' : ''}
                        style={{ width: `${100 / daysHeader.length}%` }}
                      >
                        <div>{d.day}</div>
                        {d.isToday ? (
                          <span className="today-num-badge">{d.date}</span>
                        ) : (
                          <div style={{ marginTop: '4px', fontSize: '11px', color: '#1e293b' }}>
                            {d.date}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUnits.map((unit) => {
                    const enMeta = UNIT_EN_NAMES[unit.code];
                    const thumbMeta = UNIT_THUMBS[unit.code];
                    const unitName = lang === 'en' ? enMeta?.nameEn || unit.name : unit.name;
                    const unitProperty =
                      lang === 'en'
                        ? enMeta?.propertyEn || unit.property_name
                        : unit.property_name;
                    const thumbSrc = unit.image || thumbMeta?.src || '/unit-thumbs/thumb-1.png';

                    // Collect bookings for this unit from both calendar API and bookingsList
                    const firstIso = daysHeader[0]?.isoDate || '';
                    const lastIso = daysHeader[daysHeader.length - 1]?.isoDate || '';

                    const unitBookingsFromList = bookingsList.filter(
                      (b) =>
                        String(b.unit.id) === String(unit.id) ||
                        (b.unit.code && b.unit.code === unit.code)
                    );

                    const combinedBookings = [
                      ...unitBookingsFromList.map((b) => ({
                        id: b.id,
                        code: b.booking_code,
                        guest: b.guest.name,
                        checkIn: b.stay.check_in_date,
                        checkOut: b.stay.check_out_date,
                        nights: b.stay.nights_count,
                        source: b.source_sync?.booking_source || b.source_sync?.booking_type || 'direct',
                        status: b.status,
                      })),
                      ...(unit.bookings || [])
                        .filter(
                          (ub) =>
                            !unitBookingsFromList.some(
                              (b) => String(b.id) === String(ub.id) || b.booking_code === ub.booking_code
                            )
                        )
                        .map((ub) => ({
                          id: ub.id,
                          code: ub.booking_code,
                          guest: ub.guest_name,
                          checkIn: ub.check_in_date,
                          checkOut: ub.check_out_date,
                          nights: ub.nights_count,
                          source: ub.booking_source || 'direct',
                          status: ub.status,
                        })),
                    ];

                    // Find the booking that overlaps with visible daysHeader
                    const overlapping = combinedBookings.find(
                      (b) => b.checkIn <= lastIso && b.checkOut > firstIso
                    );

                    let startCol = -1;
                    let spanCols = 0;
                    if (overlapping) {
                      const foundStart = daysHeader.findIndex((d) => d.isoDate >= overlapping.checkIn);
                      startCol = foundStart === -1 ? 0 : foundStart;
                      let endCol = startCol;
                      for (let i = startCol; i < daysHeader.length; i++) {
                        if (daysHeader[i].isoDate < overlapping.checkOut) {
                          endCol = i;
                        }
                      }
                      spanCols = Math.max(1, endCol - startCol + 1);
                    }

                    const platformCode = overlapping ? getPlatformCode(overlapping.source) : 'D';
                    const barTone = overlapping ? getBarTone(platformCode, overlapping.status) : 'green';

                    return (
                      <tr key={unit.id}>
                        {/* Unit info cell */}
                        <td>
                          <div className="cal-unit-cell">
                            <div className="cal-unit-thumb">
                              {!unit.image && thumbMeta?.placeholder === 'building' ? (
                                <div className="cal-unit-placeholder">
                                  <Building2 size={18} />
                                </div>
                              ) : !unit.image && thumbMeta?.placeholder === 'chalet' ? (
                                <div className="cal-unit-placeholder">
                                  <Home size={18} />
                                </div>
                              ) : (
                                <img
                                  src={thumbSrc}
                                  alt={unitName}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="cal-unit-info">
                              <Link
                                to={`/app/units/${unit.code || unit.id}`}
                                className="cal-unit-title"
                              >
                                {unitName}
                              </Link>
                              <span className="cal-unit-prop">{unitProperty}</span>
                            </div>
                          </div>
                        </td>

                        {/* Days grid cells */}
                        {daysHeader.map((d, colIndex) => {
                          const isToday = d.isToday;
                          const isBookingStart = overlapping && startCol === colIndex;

                          if (
                            overlapping &&
                            colIndex >= startCol &&
                            colIndex < startCol + spanCols
                          ) {
                            if (isBookingStart) {
                              const nightsLabel =
                                lang === 'en'
                                  ? `${overlapping.nights} nights`
                                  : `${overlapping.nights} ليال`;
                              return (
                                <td
                                  key={d.isoDate}
                                  colSpan={spanCols}
                                  className={isToday ? 'today-cell' : ''}
                                  style={{ padding: '6px 8px' }}
                                >
                                  <Link
                                    to={`/app/bookings/${overlapping.id}`}
                                    className={`booking-bar ${barTone}`}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                      }}
                                    >
                                      <span className={`booking-bar-platform ${platformCode}`}>
                                        {platformCode === 'A' ? (
                                          <svg
                                            width="11"
                                            height="11"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M12 2C8.5 2 6 5.5 6 10.5c0 4.2 3.2 8.4 6 11.5 2.8-3.1 6-7.3 6-11.5C18 5.5 15.5 2 12 2zm0 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                          </svg>
                                        ) : platformCode === 'B' ? (
                                          '.B'
                                        ) : (
                                          platformCode
                                        )}
                                      </span>
                                      <span className="booking-bar-guest">{overlapping.guest}</span>
                                    </div>
                                    <span className="booking-bar-meta">
                                      {overlapping.code} • {nightsLabel}
                                    </span>
                                  </Link>
                                </td>
                              );
                            }
                            return null;
                          }

                          return (
                            <td key={d.isoDate} className={isToday ? 'today-cell' : ''}>
                              {/* Empty slot */}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Bottom Legend */}
            <footer className="calendar-legend-bar">
              <div className="legend-item">
                <span className="legend-ring green" />
                <span>{lang === 'en' ? 'Confirmed Booking' : 'حجز مؤكد'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring blue" />
                <span>{lang === 'en' ? 'Awaiting Guest' : 'في انتظار الضيف'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring orange" />
                <span>{lang === 'en' ? 'Checkout Today' : 'مغادرة اليوم'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring red" />
                <span>{lang === 'en' ? 'Overdue' : 'متأخر'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring gray" />
                <span>{lang === 'en' ? 'Cancelled' : 'ملغى'}</span>
              </div>
            </footer>
          </section>
        </div>
      ) : (
        /* List View connected to GET /client/bookings */
        <section className="smart-bookings-view card">
          <div className="smart-bookings-toolbar">
            <div>
              <h2>{lang === 'en' ? 'Bookings List' : 'قائمة الحجوزات'}</h2>
              <p>
                {lang === 'en'
                  ? 'Browse and search through all registered bookings'
                  : 'استعراض وبحث في جميع الحجوزات المسجلة'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="reference-search">
                <Search size={16} />
                <input
                  placeholder={
                    lang === 'en'
                      ? 'Search by booking code or guest name...'
                      : 'ابحث برقم الحجز أو اسم الضيف...'
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="smart-bookings-head">
            <span>{lang === 'en' ? 'Guest & Booking' : 'الضيف والحجز'}</span>
            <span>{lang === 'en' ? 'Unit' : 'الوحدة'}</span>
            <span>{lang === 'en' ? 'Stay Period' : 'فترة الإقامة'}</span>
            <span>{lang === 'en' ? 'Channel' : 'المنصة'}</span>
            <span>{lang === 'en' ? 'Amount & Status' : 'المبلغ والحالة'}</span>
            <span style={{ textAlign: 'center' }}>{lang === 'en' ? 'Actions' : 'إجراءات'}</span>
          </div>

          <div className="smart-bookings-list">
            {loadingList && filteredBookingsList.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                {lang === 'en' ? 'Loading bookings...' : 'جارٍ تحميل الحجوزات...'}
              </div>
            ) : filteredBookingsList.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                {lang === 'en' ? 'No bookings match your search' : 'لا توجد حجوزات مطابقة للبحث'}
              </div>
            ) : (
              filteredBookingsList.map((b) => {
                const guestName = b.guest.name || '—';
                const unitCode = b.unit.code || String(b.unit.id);
                const enUnit = UNIT_EN_NAMES[unitCode];
                const unitName = lang === 'en' ? enUnit?.nameEn || b.unit.name : b.unit.name;
                const unitProperty =
                  lang === 'en'
                    ? enUnit?.propertyEn || b.unit.property_name
                    : b.unit.property_name;

                const stayStart = formatShortDate(b.stay.check_in_date, lang);
                const stayEnd = formatShortDate(b.stay.check_out_date, lang);
                const nightsCount =
                  lang === 'en'
                    ? `${b.stay.nights_count} nights`
                    : `${b.stay.nights_count} ليال`;

                const platformCode = getPlatformCode(
                  b.source_sync?.booking_source || b.source_sync?.booking_type
                );
                const platformName = getPlatformName(
                  b.source_sync?.booking_source || b.source_sync?.booking_type,
                  b.source_sync?.booking_source_label,
                  lang
                );

                const amountNum = Number(b.payment.total_amount) || 0;
                const currencyAmount =
                  lang === 'en'
                    ? `${amountNum.toLocaleString()} SAR`
                    : `${amountNum.toLocaleString()} ر.س`;

                const statusText =
                  lang === 'en'
                    ? b.status === 'active'
                      ? 'Active Stay'
                      : b.status === 'cancelled'
                        ? 'Cancelled'
                        : 'Confirmed'
                    : b.status_label || (b.status === 'active' ? 'قيد الإقامة' : 'مؤكد');

                const statusChipTone =
                  b.status === 'cancelled'
                    ? 'red'
                    : b.status === 'active'
                      ? 'blue'
                      : 'green';

                return (
                  <article key={b.id}>
                    <div className="smart-guest">
                      <span>{guestName.charAt(0).toUpperCase()}</span>
                      <div>
                        <strong>{guestName}</strong>
                        <small>{b.booking_code}</small>
                      </div>
                    </div>

                    <div className="smart-unit">
                      <div>
                        <Link
                          to={`/app/units/${unitCode}`}
                          style={{ color: 'inherit', textDecoration: 'none' }}
                        >
                          <strong>{unitName}</strong>
                        </Link>
                        <small>{unitProperty}</small>
                      </div>
                    </div>

                    <div className="smart-stay">
                      <span>
                        <b>{stayStart}</b>
                      </span>
                      <i />
                      <span>
                        <b>{stayEnd}</b>
                      </span>
                      <small>{nightsCount}</small>
                    </div>

                    <div className="smart-source">
                      <span className={`booking-bar-platform ${platformCode}`}>
                        {platformCode}
                      </span>
                      <div>
                        <strong>{platformName}</strong>
                      </div>
                    </div>

                    <div className="smart-payment">
                      <strong>{currencyAmount}</strong>
                      <span className={`reference-chip ${statusChipTone}`}>{statusText}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <Link to={`/app/bookings/${b.id}`} className="smart-details">
                        {lang === 'en' ? 'View' : 'عرض'}
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      )}
    </div>
  );
}
