import { useEffect, useState } from 'react';
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
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
import { Tooltip } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { fetchBookingStats } from '../services/clientBookingService';
import './bookings-page.css';
import './bookings-list-view.css';

interface CalendarUnit {
  id: string;
  name: string;
  nameEn: string;
  property: string;
  propertyEn: string;
  thumbSrc?: string;
  thumbPlaceholder?: 'building' | 'chalet';
}

const calendarUnits: CalendarUnit[] = [
  {
    id: 'UNT-YMFCHL',
    name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    nameEn: 'Al Remal Luxury Apt - Tower 4 (Copy)',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    thumbSrc: '/unit-thumbs/thumb-1.png',
  },
  {
    id: 'UNT-Q4HSI8',
    name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
    nameEn: 'Al Narjis VIP Villa Private Pool (Copy)',
    property: 'كمباوند النرجس ريزيدنس',
    propertyEn: 'Al Narjis Compound Residence',
    thumbSrc: '/unit-thumbs/thumb-2.png',
  },
  {
    id: 'UNT-103',
    name: 'استوديو الكورنيش بإطلالة بحرية',
    nameEn: 'Corniche Studio Sea View',
    property: 'أبراج الشاطئ',
    propertyEn: 'Beach Towers',
    thumbSrc: '/unit-thumbs/thumb-5.png',
  },
  {
    id: 'UNT-104',
    name: 'شاليه اليمامة للعائلات',
    nameEn: 'Al Yamama Family Chalet',
    property: 'منتجع اليمامة',
    propertyEn: 'Al Yamama Resort',
    thumbSrc: '/unit-thumbs/thumb-4.png',
    thumbPlaceholder: 'chalet',
  },
  {
    id: 'UNT-105',
    name: 'شقة العليا 102 - صيانة دورية',
    nameEn: 'Olaya Apt 102 - Maintenance',
    property: 'عمارة العليا 12',
    propertyEn: 'Olaya Building 12',
    thumbSrc: '/unit-thumbs/thumb-3.png',
    thumbPlaceholder: 'building',
  },
  {
    id: 'UNT-102',
    name: 'فيلا النرجس VIP مسبح خاص',
    nameEn: 'Al Narjis VIP Villa Private Pool',
    property: 'كمباوند النرجس ريزيدنس',
    propertyEn: 'Al Narjis Compound Residence',
    thumbSrc: '/unit-thumbs/thumb-6.png',
  },
  {
    id: 'UNT-101',
    name: 'شقة الرمال الفاخرة - برج 4',
    nameEn: 'Al Remal Luxury Apt - Tower 4',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    thumbSrc: '/unit-thumbs/thumb-7.png',
  },
];

interface CalendarBooking {
  id: string;
  unitId: string;
  guest: string;
  guestEn: string;
  code: string;
  nights: number;
  platform: 'A' | 'B' | 'D' | 'G';
  tone: 'red' | 'green' | 'blue' | 'orange';
  startCol: number; // 0: Sat, 1: Sun, 2: Mon, 3: Tue, 4: Wed, 5: Thu
  spanCols: number;
}

const calendarBookings: CalendarBooking[] = [
  {
    id: 'BK-261002-01',
    unitId: 'UNT-YMFCHL',
    guest: 'فهد السبيعي',
    guestEn: 'Fahad Al-Subaie',
    code: 'BK-261002-01',
    nights: 3,
    platform: 'A',
    tone: 'red',
    startCol: 1, // Sun 4
    spanCols: 2, // Sun & Mon
  },
  {
    id: 'BK-261002-03',
    unitId: 'UNT-103',
    guest: 'سلطان القحطاني',
    guestEn: 'Sultan Al-Qahtani',
    code: 'BK-261002-03',
    nights: 3,
    platform: 'B',
    tone: 'green',
    startCol: 2, // Mon 5
    spanCols: 3, // Mon, Tue & Wed
  },
  {
    id: 'BK-261006-197',
    unitId: 'UNT-105',
    guest: 'أحمد حسن',
    guestEn: 'Ahmed Hassan',
    code: 'BK-261006-197',
    nights: 5,
    platform: 'D',
    tone: 'green',
    startCol: 3, // Tue 6
    spanCols: 3, // Tue, Wed & Thu
  },
];

const daysHeaderAr = [
  { day: 'السبت', date: 3, isToday: false },
  { day: 'الأحد', date: 4, isToday: false },
  { day: 'الإثنين', date: 5, isToday: false },
  { day: 'الثلاثاء', date: 6, isToday: false },
  { day: 'الأربعاء', date: 7, isToday: true },
  { day: 'الخميس', date: 8, isToday: false },
];

const daysHeaderEn = [
  { day: 'Sat', date: 3, isToday: false },
  { day: 'Sun', date: 4, isToday: false },
  { day: 'Mon', date: 5, isToday: false },
  { day: 'Tue', date: 6, isToday: false },
  { day: 'Wed', date: 7, isToday: true },
  { day: 'Thu', date: 8, isToday: false },
];

export default function BookingsPage() {
  const { lang, isRTL, t } = useLanguage();
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('week');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState(lang === 'en' ? 'October 2026' : 'أكتوبر 2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingStats, setBookingStats] = useState({
    total_bookings: 4,
    check_ins_this_week: 2,
    check_outs_this_week: 2,
    upcoming_bookings: 0,
  });

  useEffect(() => {
    let active = true;
    fetchBookingStats().then((res) => {
      if (active && res && typeof res.total_bookings === 'number') {
        setBookingStats(res);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const daysHeader = lang === 'en' ? daysHeaderEn : daysHeaderAr;

  const filteredUnits = calendarUnits.filter((u) => {
    if (selectedUnit !== 'all' && u.id !== selectedUnit) return false;
    const nameMatch = lang === 'en' ? u.nameEn : u.name;
    const propMatch = lang === 'en' ? u.propertyEn : u.property;
    if (searchQuery && !nameMatch.toLowerCase().includes(searchQuery.toLowerCase()) && !propMatch.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

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
          <div className="bookings-view-switcher" role="group" aria-label={lang === 'en' ? 'View mode' : 'طريقة العرض'}>
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

      {/* Stats Cards (4 Items matching the screenshot) */}
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
                <Link to="/app/bookings" className="side-card-link">
                  {lang === 'en' ? 'View All' : 'عرض الكل'}
                </Link>
              </div>
              <div className="empty-side-state">
                <span>
                  {lang === 'en'
                    ? 'No upcoming bookings recorded'
                    : 'لا توجد حجوزات قادمة مسجلة'}
                </span>
              </div>
            </div>

            {/* Bottom Side Card: Channel Distribution */}
            <div className="bookings-side-card">
              <div className="side-card-header">
                <h2>{lang === 'en' ? 'Bookings by Channel' : 'توزيع الحجوزات حسب المنصة'}</h2>
                <Link to="/app/bookings" className="side-card-link">
                  {lang === 'en' ? 'View All' : 'عرض الكل'}
                </Link>
              </div>

              <div className="platform-dist-list">
                {/* Airbnb */}
                <div className="platform-dist-row">
                  <div className="platform-dist-info">
                    <span className="platform-dist-badge airbnb">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.5 2 6 5.5 6 10.5c0 4.2 3.2 8.4 6 11.5 2.8-3.1 6-7.3 6-11.5C18 5.5 15.5 2 12 2zm0 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                      </svg>
                    </span>
                    <span className="platform-dist-name">Airbnb</span>
                  </div>
                  <div className="platform-dist-bar-wrap">
                    <div className="platform-dist-bar-fill airbnb" style={{ width: '25%' }} />
                  </div>
                  <div className="platform-dist-count">
                    <span className="count-num">1</span>
                    <span className="count-label">{lang === 'en' ? 'booking' : 'حجز'}</span>
                  </div>
                </div>

                {/* Booking */}
                <div className="platform-dist-row">
                  <div className="platform-dist-info">
                    <span className="platform-dist-badge booking">.B</span>
                    <span className="platform-dist-name">Booking.com</span>
                  </div>
                  <div className="platform-dist-bar-wrap">
                    <div className="platform-dist-bar-fill booking" style={{ width: '25%' }} />
                  </div>
                  <div className="platform-dist-count">
                    <span className="count-num">1</span>
                    <span className="count-label">{lang === 'en' ? 'booking' : 'حجز'}</span>
                  </div>
                </div>

                {/* Direct */}
                <div className="platform-dist-row">
                  <div className="platform-dist-info">
                    <span className="platform-dist-badge direct">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 12h6M12 9v6" />
                      </svg>
                    </span>
                    <span className="platform-dist-name">{lang === 'en' ? 'Direct' : 'حجز مباشر'}</span>
                  </div>
                  <div className="platform-dist-bar-wrap">
                    <div className="platform-dist-bar-fill direct" style={{ width: '50%' }} />
                  </div>
                  <div className="platform-dist-count">
                    <span className="count-num">2</span>
                    <span className="count-label">{lang === 'en' ? 'bookings' : 'حجز'}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Calendar Card */}
          <section className="calendar-card">
            {/* Calendar Toolbar */}
            <div className="calendar-toolbar">
              <div className="calendar-nav-controls">
                <button
                  type="button"
                  className="calendar-unit-select"
                  onClick={() =>
                    setSelectedUnit((prev) => (prev === 'all' ? 'UNT-YMFCHL' : 'all'))
                  }
                >
                  <span>
                    {selectedUnit === 'all'
                      ? (lang === 'en' ? 'All Units' : 'جميع الوحدات')
                      : (lang === 'en' ? 'Selected Unit' : 'وحدة محددة')}
                  </span>
                  <ChevronDown size={14} />
                </button>

                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={() => setCurrentMonth(lang === 'en' ? 'October 2026' : 'أكتوبر 2026')}
                >
                  {lang === 'en' ? 'Today' : 'اليوم'}
                </button>

                <button
                  type="button"
                  className="calendar-arrow-btn"
                  aria-label={lang === 'en' ? 'Next Month' : 'الشهر التالي'}
                  onClick={() => setCurrentMonth(lang === 'en' ? 'November 2026' : 'نوفمبر 2026')}
                >
                  {isRTL ? <ChevronRight size={16} /> : <ChevronRight size={16} />}
                </button>

                <span className="calendar-month-title">{currentMonth}</span>

                <button
                  type="button"
                  className="calendar-arrow-btn"
                  aria-label={lang === 'en' ? 'Previous Month' : 'الشهر السابق'}
                  onClick={() => setCurrentMonth(lang === 'en' ? 'September 2026' : 'سبتمبر 2026')}
                >
                  {isRTL ? <ChevronLeft size={16} /> : <ChevronLeft size={16} />}
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
                        key={d.date}
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
                    const booking = calendarBookings.find((b) => b.unitId === unit.id);
                    const unitName = lang === 'en' ? unit.nameEn : unit.name;
                    const unitProperty = lang === 'en' ? unit.propertyEn : unit.property;

                    return (
                      <tr key={unit.id}>
                        {/* Unit info cell */}
                        <td>
                          <div className="cal-unit-cell">
                            <div className="cal-unit-thumb">
                              {unit.thumbPlaceholder === 'building' ? (
                                <div className="cal-unit-placeholder">
                                  <Building2 size={18} />
                                </div>
                              ) : unit.thumbPlaceholder === 'chalet' ? (
                                <div className="cal-unit-placeholder">
                                  <Home size={18} />
                                </div>
                              ) : (
                                <img
                                  src={unit.thumbSrc}
                                  alt={unitName}
                                  onError={(e) => {
                                    (e.target as HTMLElement).style.display = 'none';
                                  }}
                                />
                              )}
                            </div>
                            <div className="cal-unit-info">
                              <Link to={`/app/units/${unit.id}`} className="cal-unit-title">
                                {unitName}
                              </Link>
                              <span className="cal-unit-prop">{unitProperty}</span>
                            </div>
                          </div>
                        </td>

                        {/* Days grid cells */}
                        {daysHeader.map((d, colIndex) => {
                          const isToday = d.isToday;
                          const isBookingStart = booking && booking.startCol === colIndex;

                          if (booking && colIndex >= booking.startCol && colIndex < booking.startCol + booking.spanCols) {
                            if (isBookingStart) {
                              const guestName = lang === 'en' ? booking.guestEn : booking.guest;
                              const nightsLabel = lang === 'en' ? `${booking.nights} nights` : `${booking.nights} ليال`;
                              return (
                                <td
                                  key={d.date}
                                  colSpan={booking.spanCols}
                                  className={isToday ? 'today-cell' : ''}
                                  style={{ padding: '6px 8px' }}
                                >
                                  <Link
                                    to={`/app/bookings/${booking.code}`}
                                    className={`booking-bar ${booking.tone}`}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span className={`booking-bar-platform ${booking.platform}`}>
                                        {booking.platform === 'A' ? (
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 2C8.5 2 6 5.5 6 10.5c0 4.2 3.2 8.4 6 11.5 2.8-3.1 6-7.3 6-11.5C18 5.5 15.5 2 12 2zm0 11.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                          </svg>
                                        ) : booking.platform === 'B' ? (
                                          '.B'
                                        ) : (
                                          'D'
                                        )}
                                      </span>
                                      <span className="booking-bar-guest">{guestName}</span>
                                    </div>
                                    <span className="booking-bar-meta">
                                      {booking.code} • {nightsLabel}
                                    </span>
                                  </Link>
                                </td>
                              );
                            }
                            // Handled by colSpan
                            return null;
                          }

                          return (
                            <td key={d.date} className={isToday ? 'today-cell' : ''}>
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
        /* List View */
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
            {calendarBookings.map((b) => {
              const u = calendarUnits.find((unit) => unit.id === b.unitId);
              const guestName = lang === 'en' ? b.guestEn : b.guest;
              const unitName = lang === 'en' ? (u?.nameEn || u?.name) : u?.name;
              const unitProperty = lang === 'en' ? (u?.propertyEn || u?.property) : u?.property;
              const stayStart = lang === 'en' ? 'Oct 3' : '3 أكتوبر';
              const stayEnd = lang === 'en' ? 'Oct 6' : '6 أكتوبر';
              const nightsCount = lang === 'en' ? `${b.nights} nights` : `${b.nights} ليال`;
              const platformName = b.platform === 'A' ? 'Airbnb' : b.platform === 'B' ? 'Booking.com' : (lang === 'en' ? 'Direct Booking' : 'حجز مباشر');
              const currencyAmount = lang === 'en' ? '1,200 SAR' : '1,200 ر.س';
              const confirmedText = lang === 'en' ? 'Confirmed' : 'مؤكد';

              return (
                <article key={b.id}>
                  <div className="smart-guest">
                    <span>{guestName.charAt(0)}</span>
                    <div>
                      <strong>{guestName}</strong>
                      <small>{b.code}</small>
                    </div>
                  </div>

                  <div className="smart-unit">
                    <div>
                      <strong>{unitName}</strong>
                      <small>{unitProperty}</small>
                    </div>
                  </div>

                  <div className="smart-stay">
                    <span><b>{stayStart}</b></span>
                    <i />
                    <span><b>{stayEnd}</b></span>
                    <small>{nightsCount}</small>
                  </div>

                  <div className="smart-source">
                    <span className={`booking-bar-platform ${b.platform}`}>{b.platform}</span>
                    <div>
                      <strong>{platformName}</strong>
                    </div>
                  </div>

                  <div className="smart-payment">
                    <strong>{currencyAmount}</strong>
                    <span className="reference-chip green">{confirmedText}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Link to={`/app/bookings/${b.code}`} className="smart-details">
                      {lang === 'en' ? 'View' : 'عرض'}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
