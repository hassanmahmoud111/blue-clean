import { useEffect, useState } from 'react';
import {
  Armchair,
  BrushCleaning,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileChartColumn,
  Home,
  Percent,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { fetchClientReports } from '../services/clientReportsService';
import './reports-page.css';

interface UnitPerformanceItem {
  id: string;
  name: string;
  nameEn: string;
  property: string;
  propertyEn: string;
  occupancyRate: number;
  bookingsCount: number;
  revenue: string;
  revenueEn: string;
  lastBooking: string;
  lastBookingEn: string;
  thumbSrc?: string;
}

const unitsPerformanceData: UnitPerformanceItem[] = [
  {
    id: 'UNT-105',
    name: 'شقة العليا 102 - صيانة دورية',
    nameEn: 'Olaya Apt 102 - Maintenance',
    property: 'عمارة العليا 12',
    propertyEn: 'Olaya Building 12',
    occupancyRate: 27,
    bookingsCount: 1,
    revenue: '0 ر.س',
    revenueEn: '0 SAR',
    lastBooking: '6 أكتوبر 2026',
    lastBookingEn: 'Oct 6, 2026',
    thumbSrc: '/unit-thumbs/thumb-3.png',
  },
  {
    id: 'UNT-101',
    name: 'شقة الرمال الفاخرة - برج 4',
    nameEn: 'Al Remal Luxury Apt - Tower 4',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    occupancyRate: 10,
    bookingsCount: 1,
    revenue: '1,350 ر.س',
    revenueEn: '1,350 SAR',
    lastBooking: '2 أكتوبر 2026',
    lastBookingEn: 'Oct 2, 2026',
    thumbSrc: '/unit-thumbs/thumb-7.png',
  },
  {
    id: 'UNT-103',
    name: 'استوديو الكورنيش بإطلالة بحرية',
    nameEn: 'Corniche Studio Sea View',
    property: 'أبراج الشاطئ',
    propertyEn: 'Beach Towers',
    occupancyRate: 10,
    bookingsCount: 1,
    revenue: '1,200 ر.س',
    revenueEn: '1,200 SAR',
    lastBooking: '3 أكتوبر 2026',
    lastBookingEn: 'Oct 3, 2026',
    thumbSrc: '/unit-thumbs/thumb-5.png',
  },
  {
    id: 'UNT-102',
    name: 'فيلا النرجس VIP مسبح خاص',
    nameEn: 'Al Narjis VIP Villa Private Pool',
    property: 'كمباوند النرجس ريزيدنس',
    propertyEn: 'Al Narjis Compound Residence',
    occupancyRate: 7,
    bookingsCount: 1,
    revenue: '2,400 ر.س',
    revenueEn: '2,400 SAR',
    lastBooking: '30 سبتمبر 2026',
    lastBookingEn: 'Sep 30, 2026',
    thumbSrc: '/unit-thumbs/thumb-6.png',
  },
  {
    id: 'UNT-104',
    name: 'شاليه اليمامة للعائلات',
    nameEn: 'Al Yamama Family Chalet',
    property: 'منتجع اليمامة',
    propertyEn: 'Al Yamama Resort',
    occupancyRate: 0,
    bookingsCount: 0,
    revenue: '0 ر.س',
    revenueEn: '0 SAR',
    lastBooking: 'لا توجد حجوزات حديثة',
    lastBookingEn: 'No recent bookings',
    thumbSrc: '/unit-thumbs/thumb-4.png',
  },
  {
    id: 'UNT-Q4HSI8',
    name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
    nameEn: 'Al Narjis VIP Villa Private Pool (Copy)',
    property: 'كمباوند النرجس ريزيدنس',
    propertyEn: 'Al Narjis Compound Residence',
    occupancyRate: 0,
    bookingsCount: 0,
    revenue: '0 ر.س',
    revenueEn: '0 SAR',
    lastBooking: 'لا توجد حجوزات حديثة',
    lastBookingEn: 'No recent bookings',
    thumbSrc: '/unit-thumbs/thumb-2.png',
  },
  {
    id: 'UNT-YMFCHL',
    name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    nameEn: 'Al Remal Luxury Apt - Tower 4 (Copy)',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    occupancyRate: 0,
    bookingsCount: 0,
    revenue: '0 ر.س',
    revenueEn: '0 SAR',
    lastBooking: 'لا توجد حجوزات حديثة',
    lastBookingEn: 'No recent bookings',
    thumbSrc: '/unit-thumbs/thumb-1.png',
  },
];

const executedServicesData = [
  {
    title: 'تنظيف وحدات',
    titleEn: 'Turnover Cleaning',
    count: 0,
    note: '↑ 0% مقارنة بالفترة السابقة',
    noteEn: '↑ 0% vs previous period',
    isUp: false,
    icon: BrushCleaning,
  },
  {
    title: 'صيانة',
    titleEn: 'Maintenance',
    count: 0,
    note: '↑ 0% مقارنة بالفترة السابقة',
    noteEn: '↑ 0% vs previous period',
    isUp: false,
    icon: Wrench,
  },
  {
    title: 'غسيل سجاد',
    titleEn: 'Carpet Cleaning',
    count: 0,
    note: '↑ 0% مقارنة بالفترة السابقة',
    noteEn: '↑ 0% vs previous period',
    isUp: false,
    icon: Sparkles,
  },
  {
    title: 'غسيل كنب',
    titleEn: 'Sofa Cleaning',
    count: 0,
    note: '↑ 0% مقارنة بالفترة السابقة',
    noteEn: '↑ 0% vs previous period',
    isUp: false,
    icon: Armchair,
  },
  {
    title: 'خدمات إضافية',
    titleEn: 'Extra Services',
    count: 3,
    note: '↑ 100% مقارنة بالفترة السابقة',
    noteEn: '↑ 100% vs previous period',
    isUp: true,
    icon: Sparkles,
  },
];

const revenueMonths = [
  { label: 'أكتوبر 2026', labelEn: 'Oct 2026', height: '88%', active: true },
  { label: 'سبتمبر', labelEn: 'Sep', height: '6px', active: false },
  { label: 'أغسطس', labelEn: 'Aug', height: '6px', active: false },
  { label: 'يوليو', labelEn: 'Jul', height: '6px', active: false },
  { label: 'يونيو', labelEn: 'Jun', height: '6px', active: false },
  { label: 'مايو', labelEn: 'May', height: '6px', active: false },
  { label: 'أبريل', labelEn: 'Apr', height: '6px', active: false },
  { label: 'مارس', labelEn: 'Mar', height: '6px', active: false },
  { label: 'فبراير', labelEn: 'Feb', height: '6px', active: false },
];

export default function ReportsPage() {
  const { lang, isRTL, t } = useLanguage();
  const [period] = useState(lang === 'en' ? 'Last 30 Days' : 'آخر 30 يوم');
  const [selectedProperty] = useState(lang === 'en' ? 'All Properties' : 'جميع العقارات');
  const [selectedUnit] = useState(lang === 'en' ? 'All Units' : 'جميع الوحدات');
  const [kpis, setKpis] = useState({
    totalUnits: 7,
    totalBookings: 4,
    occupancyRate: 8,
    totalRevenueAr: '4,950 ر.س',
    totalRevenueEn: '4,950 SAR',
  });

  useEffect(() => {
    let active = true;
    fetchClientReports({ period: 'last_30_days' }).then((data) => {
      if (active && data?.summary_kpis) {
        const revVal = data.summary_kpis.total_revenue?.value;
        const revFormatted =
          typeof revVal === 'number'
            ? revVal.toLocaleString('en-US')
            : '4,950';
        setKpis({
          totalUnits: data.summary_kpis.total_units?.value ?? 7,
          totalBookings: data.summary_kpis.total_bookings?.value ?? 4,
          occupancyRate: data.summary_kpis.occupancy_rate?.value ?? 8,
          totalRevenueAr: data.summary_kpis.total_revenue?.formatted || `${revFormatted} ر.س`,
          totalRevenueEn: `${revFormatted} SAR`,
        });
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="reports-page-container">
      {/* Header */}
      <header className="reports-header">
        <div className="reports-header-info">
          <div className="reports-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.reports')}</span>
          </div>
          <div className="reports-title-row">
            <h1>{lang === 'en' ? 'Reports & Analytics' : 'التقارير والتحليلات'}</h1>
            <span className="reports-title-badge" aria-hidden="true">
              <FileChartColumn size={20} />
            </span>
          </div>
          <p>
            {lang === 'en'
              ? 'Comprehensive analytics on unit performance, revenue, and completed services.'
              : 'تحليلات شاملة لأداء الوحدات، الإيرادات والخدمات المنفذة'}
          </p>
        </div>
      </header>

      {/* Filter Card Bar */}
      <section className="reports-filter-bar">
        <button type="button" className="reports-filter-select">
          <span>{lang === 'en' ? 'Last 30 Days' : period}</span>
          <ChevronDown size={14} />
        </button>

        <button type="button" className="reports-filter-select">
          <span>{lang === 'en' ? 'All Properties' : selectedProperty}</span>
          <ChevronDown size={14} />
        </button>

        <button type="button" className="reports-filter-select">
          <span>{lang === 'en' ? 'All Units' : selectedUnit}</span>
          <ChevronDown size={14} />
        </button>
      </section>

      {/* 4 KPI Stats Grid */}
      <section className="reports-stats-grid">
        {/* 1. Total Units */}
        <div className="report-stat-card">
          <div className="report-stat-info">
            <span className="report-stat-label">
              {lang === 'en' ? 'Total Units' : 'إجمالي الوحدات'}
            </span>
            <strong className="report-stat-value">{kpis.totalUnits}</strong>
            <span className="report-stat-sub">
              {lang === 'en' ? 'Registered Units' : 'الوحدات المسجلة'}
            </span>
          </div>
          <div className="report-stat-icon-wrap blue">
            <Home size={22} />
          </div>
        </div>

        {/* 2. Total Bookings */}
        <div className="report-stat-card">
          <div className="report-stat-info">
            <span className="report-stat-label">
              {lang === 'en' ? 'Total Bookings' : 'عدد الحجوزات'}
            </span>
            <strong className="report-stat-value">{kpis.totalBookings}</strong>
            <span className="report-stat-sub up">
              {lang === 'en' ? '↑ 100% vs previous period' : '↑ 100% مقارنة بالفترة السابقة'}
            </span>
          </div>
          <div className="report-stat-icon-wrap blue">
            <CalendarDays size={22} />
          </div>
        </div>

        {/* 3. Occupancy Rate */}
        <div className="report-stat-card">
          <div className="report-stat-info">
            <span className="report-stat-label">
              {lang === 'en' ? 'Occupancy Rate' : 'نسبة الإشغال'}
            </span>
            <strong className="report-stat-value">{kpis.occupancyRate}%</strong>
            <span className="report-stat-sub up">
              {lang === 'en' ? '↑ 100% vs previous period' : '↑ 100% مقارنة بالفترة السابقة'}
            </span>
          </div>
          <div className="report-stat-icon-wrap amber">
            <Percent size={22} />
          </div>
        </div>

        {/* 4. Total Revenue */}
        <div className="report-stat-card">
          <div className="report-stat-info">
            <span className="report-stat-label">
              {lang === 'en' ? 'Total Revenue' : 'إجمالي الإيرادات'}
            </span>
            <strong className="report-stat-value">
              {lang === 'en' ? kpis.totalRevenueEn : kpis.totalRevenueAr}
            </strong>
            <span className="report-stat-sub up">
              {lang === 'en' ? '↑ 100% vs previous period' : '↑ 100% مقارنة بالفترة السابقة'}
            </span>
          </div>
          <div className="report-stat-icon-wrap green">
            <Coins size={22} />
          </div>
        </div>
      </section>

      {/* Middle Section: 3 Charts */}
      <section className="reports-charts-grid">
        {/* Chart 1: Unit Status */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2>{lang === 'en' ? 'Unit Status' : 'حالة الوحدات'}</h2>
          </div>
          <div className="donut-chart-wrap">
            <div
              className="donut-circle"
              style={{
                background: '#22c55e',
              }}
            >
              <div className="donut-hole">
                <strong>7</strong>
                <small>{lang === 'en' ? 'Total Units' : 'إجمالي الوحدات'}</small>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#0284c7' }} />
                  <span>{lang === 'en' ? 'Occupied' : 'مشغولة'}</span>
                </div>
                <span className="donut-legend-count">0 (0%)</span>
              </div>

              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#22c55e' }} />
                  <span>{lang === 'en' ? 'Ready' : 'جاهزة'}</span>
                </div>
                <span className="donut-legend-count">7 (100%)</span>
              </div>

              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#f97316' }} />
                  <span>{lang === 'en' ? 'Needs Cleaning' : 'بانتظار التنظيف'}</span>
                </div>
                <span className="donut-legend-count">0 (0%)</span>
              </div>

              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#ef4444' }} />
                  <span>{lang === 'en' ? 'Maintenance' : 'قيد الصيانة'}</span>
                </div>
                <span className="donut-legend-count">0 (0%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Booking Channels */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2>{lang === 'en' ? 'Booking Channels' : 'مصادر الحجوزات'}</h2>
          </div>
          <div className="donut-chart-wrap">
            <div
              className="donut-circle"
              style={{
                background:
                  'conic-gradient(#0284c7 0% 50%, #ef4444 50% 75%, #8b5cf6 75% 100%)',
              }}
            >
              <div className="donut-hole">
                <strong>4</strong>
                <small>{lang === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}</small>
              </div>
            </div>

            <div className="donut-legend-list">
              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#0284c7' }} />
                  <span>{lang === 'en' ? 'Direct' : 'direct'}</span>
                </div>
                <span className="donut-legend-count">2 (50%)</span>
              </div>

              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#ef4444' }} />
                  <span>{lang === 'en' ? 'Airbnb' : 'airbnb'}</span>
                </div>
                <span className="donut-legend-count">1 (25%)</span>
              </div>

              <div className="donut-legend-row">
                <div className="donut-legend-info">
                  <span className="donut-legend-dot" style={{ background: '#8b5cf6' }} />
                  <span>{lang === 'en' ? 'Booking.com' : 'booking'}</span>
                </div>
                <span className="donut-legend-count">1 (25%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Revenue Trend */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2>{lang === 'en' ? 'Revenue Trends' : 'اتجاه الإيرادات'}</h2>
            <button type="button" className="chart-view-pill">
              {lang === 'en' ? 'Monthly' : 'شهرياً'}
            </button>
          </div>
          <div className="revenue-bar-chart">
            {revenueMonths.map((m, i) => (
              <div key={i} className={`rev-bar-col ${m.active ? 'active' : ''}`}>
                <div className="rev-bar-pillar" style={{ height: m.height }} />
                <span className="rev-bar-label">{lang === 'en' ? m.labelEn : m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Section: Executed Services (Right) + Units Performance (Left) */}
      <section className="reports-bottom-grid">
        {/* Services Column */}
        <aside className="services-card-panel">
          <div className="chart-card-header" style={{ marginBottom: 4 }}>
            <h2>{lang === 'en' ? 'Executed Services' : 'الخدمات المنفذة'}</h2>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {lang === 'en' ? '3 operations' : '3 عملية'}
            </span>
          </div>

          {executedServicesData.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div key={i} className="service-exec-item">
                <span className="service-exec-val">{svc.count}</span>
                <div className="service-exec-info">
                  <strong className="service-exec-title">
                    {lang === 'en' ? svc.titleEn : svc.title}
                  </strong>
                  <span className={`service-exec-note ${svc.isUp ? 'up' : ''}`}>
                    {lang === 'en' ? svc.noteEn : svc.note}
                  </span>
                </div>
                <div className="service-exec-icon">
                  <Icon size={18} />
                </div>
              </div>
            );
          })}
        </aside>

        {/* Units Performance Column */}
        <section className="units-perf-panel">
          <div className="chart-card-header">
            <h2>{lang === 'en' ? 'Units Performance' : 'أداء الوحدات'}</h2>
            <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>
              {lang === 'en' ? '7 units' : '7 وحدات'}
            </span>
          </div>

          <div className="units-perf-table-wrap">
            <table className="units-perf-table">
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Unit' : 'الوحدة'}</th>
                  <th>{lang === 'en' ? 'Occupancy Rate' : 'نسبة الإشغال'}</th>
                  <th>{lang === 'en' ? 'Bookings' : 'عدد الحجوزات'}</th>
                  <th>{lang === 'en' ? 'Revenue' : 'الإيرادات'}</th>
                  <th>{lang === 'en' ? 'Last Booking' : 'آخر حجز'}</th>
                </tr>
              </thead>
              <tbody>
                {unitsPerformanceData.map((u) => {
                  const unitName = lang === 'en' ? u.nameEn : u.name;
                  const unitProperty = lang === 'en' ? u.propertyEn : u.property;
                  const revenueVal = lang === 'en' ? u.revenueEn : u.revenue;
                  const lastBookingVal = lang === 'en' ? u.lastBookingEn : u.lastBooking;

                  return (
                    <tr key={u.id}>
                      {/* Unit */}
                      <td>
                        <div className="perf-unit-cell">
                          <div className="perf-unit-thumb">
                            {u.thumbSrc ? (
                              <img
                                src={u.thumbSrc}
                                alt={unitName}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <Home size={18} color="#94a3b8" />
                            )}
                          </div>
                          <div className="perf-unit-info">
                            <strong className="perf-unit-title">{unitName}</strong>
                            <span className="perf-unit-prop">{unitProperty}</span>
                          </div>
                        </div>
                      </td>

                      {/* Occupancy */}
                      <td>
                        <div className="occupancy-cell">
                          <span className="occupancy-val">{u.occupancyRate}%</span>
                          <div className="occupancy-bar-bg">
                            <div
                              className="occupancy-bar-fill"
                              style={{ width: `${u.occupancyRate}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Bookings Count */}
                      <td>
                        <strong>{u.bookingsCount}</strong>
                      </td>

                      {/* Revenue */}
                      <td>
                        <strong>{revenueVal}</strong>
                      </td>

                      {/* Last Booking */}
                      <td>
                        <span style={{ color: '#475569' }}>{lastBookingVal}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </div>
  );
}
