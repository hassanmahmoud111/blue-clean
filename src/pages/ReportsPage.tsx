import { useEffect, useMemo, useState } from 'react';
import {
  Armchair,
  BrushCleaning,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Coins,
  FileChartColumn,
  Home,
  Percent,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { fetchClientReports } from '../services/clientReportsService';
import type { ClientReportsData } from '../types/clientReports';
import './reports-page.css';

const UNIT_THUMBS: Record<string, string> = {
  'UNT-YMFCHL': '/unit-thumbs/thumb-1.png',
  'UNT-Q4HSI8': '/unit-thumbs/thumb-2.png',
  'UNT-Q4HSIB': '/unit-thumbs/thumb-2.png',
  'UNT-103': '/unit-thumbs/thumb-5.png',
  'UNT-104': '/unit-thumbs/thumb-4.png',
  'UNT-105': '/unit-thumbs/thumb-3.png',
  'UNT-102': '/unit-thumbs/thumb-6.png',
  'UNT-101': '/unit-thumbs/thumb-7.png',
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
  'UNT-Q4HSIB': {
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

const MONTH_EN_MAP: Record<string, string> = {
  يناير: 'Jan',
  فبراير: 'Feb',
  مارس: 'Mar',
  أبريل: 'Apr',
  مايو: 'May',
  يونيو: 'Jun',
  يوليو: 'Jul',
  أغسطس: 'Aug',
  سبتمبر: 'Sep',
  أكتوبر: 'Oct',
  نوفمبر: 'Nov',
  ديسمبر: 'Dec',
};

const STATUS_COLORS: Record<string, string> = {
  occupied: '#0284c7',
  ready: '#22c55e',
  pending_cleaning: '#f97316',
  maintenance: '#ef4444',
};

const STATUS_LABELS_EN: Record<string, string> = {
  occupied: 'Occupied',
  ready: 'Ready',
  pending_cleaning: 'Needs Cleaning',
  maintenance: 'Maintenance',
};

const SOURCE_COLORS: Record<string, string> = {
  direct: '#0284c7',
  airbnb: '#ef4444',
  booking: '#8b5cf6',
  gathern: '#10b981',
};

const SERVICE_META: Record<
  string,
  { titleEn: string; icon: typeof BrushCleaning }
> = {
  cleaning: { titleEn: 'Turnover Cleaning', icon: BrushCleaning },
  maintenance: { titleEn: 'Maintenance', icon: Wrench },
  carpet_washing: { titleEn: 'Carpet Cleaning', icon: Sparkles },
  sofa_washing: { titleEn: 'Sofa Cleaning', icon: Armchair },
  other_extra_services: { titleEn: 'Extra Services', icon: Sparkles },
};

function buildConicGradient(
  items: Array<{ percentage: number; color: string }>,
  fallbackColor = '#22c55e'
): string {
  const nonZero = items.filter((item) => item.percentage > 0);
  if (nonZero.length === 0) return fallbackColor;
  if (nonZero.length === 1) return nonZero[0].color;

  let acc = 0;
  const stops = nonZero.map((item, idx) => {
    const start = acc;
    const end = idx === nonZero.length - 1 ? 100 : Math.min(100, acc + item.percentage);
    acc = end;
    return `${item.color} ${start}% ${end}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

export default function ReportsPage() {
  const { lang, isRTL, t } = useLanguage();

  const [period, setPeriod] = useState<string>('last_30_days');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [chartView, setChartView] = useState<'monthly' | 'weekly'>('monthly');
  const [reportsData, setReportsData] = useState<ClientReportsData | null>(null);
  const [allProperties, setAllProperties] = useState<string[]>([]);
  const [allUnitsList, setAllUnitsList] = useState<Array<{ id: number; code?: string; name: string }>>([]);

  useEffect(() => {
    let active = true;
    fetchClientReports({
      period,
      property_name: selectedProperty !== 'all' ? selectedProperty : undefined,
      unit_id: selectedUnit !== 'all' ? selectedUnit : undefined,
      chart_view: chartView,
    }).then((data) => {
      if (active && data) {
        setReportsData(data);
        if (selectedProperty === 'all' && selectedUnit === 'all' && Array.isArray(data.units_performance)) {
          const props = Array.from(
            new Set(data.units_performance.map((u) => u.property_name).filter(Boolean))
          );
          setAllProperties(props);
          setAllUnitsList(
            data.units_performance.map((u) => ({
              id: u.id,
              code: u.code,
              name: u.name,
            }))
          );
        }
      }
    });
    return () => {
      active = false;
    };
  }, [period, selectedProperty, selectedUnit, chartView]);

  // Summary KPIs
  const summaryKpis = reportsData?.summary_kpis;
  const totalUnitsVal = summaryKpis?.total_units?.value ?? 7;
  const totalBookingsVal = summaryKpis?.total_bookings?.value ?? 4;
  const bookingsPct = summaryKpis?.total_bookings?.change_percentage ?? 100;
  const bookingsUp = summaryKpis?.total_bookings?.is_increase ?? true;

  const occupancyVal = summaryKpis?.occupancy_rate?.value ?? 8;
  const occupancyPct = summaryKpis?.occupancy_rate?.change_percentage ?? 100;
  const occupancyUp = summaryKpis?.occupancy_rate?.is_increase ?? true;

  const revenueRaw = summaryKpis?.total_revenue?.value ?? 4950;
  const revenueFormattedNum = Number(revenueRaw).toLocaleString('en-US');
  const revenueDisplay =
    lang === 'en'
      ? `${revenueFormattedNum} SAR`
      : summaryKpis?.total_revenue?.formatted || `${revenueFormattedNum} ر.س`;
  const revenuePct = summaryKpis?.total_revenue?.change_percentage ?? 100;
  const revenueUp = summaryKpis?.total_revenue?.is_increase ?? true;

  // Chart 1: Unit Status
  const unitStatusChart = useMemo(() => {
    const raw = reportsData?.charts?.units_status;
    const slices = raw?.slices || [
      { key: 'occupied', label: 'مشغولة', count: 0, percentage: 0 },
      { key: 'ready', label: 'جاهزة', count: 6, percentage: 86 },
      { key: 'pending_cleaning', label: 'بانتظار التنظيف', count: 1, percentage: 14 },
      { key: 'maintenance', label: 'قيد الصيانة', count: 0, percentage: 0 },
    ];
    const total = raw?.total_units ?? totalUnitsVal;
    const gradient = buildConicGradient(
      slices.map((s) => ({
        percentage: s.percentage,
        color: STATUS_COLORS[s.key] || '#94a3b8',
      })),
      '#22c55e'
    );
    return { total, slices, gradient };
  }, [reportsData, totalUnitsVal]);

  // Chart 2: Booking Sources
  const bookingSourcesChart = useMemo(() => {
    const raw = reportsData?.charts?.booking_sources;
    const slices = raw?.slices || [
      { source: 'direct', count: 2, percentage: 50 },
      { source: 'airbnb', count: 1, percentage: 25 },
      { source: 'booking', count: 1, percentage: 25 },
    ];
    const total = raw?.total_bookings ?? totalBookingsVal;
    const gradient = buildConicGradient(
      slices.map((s) => {
        const key = s.source.toLowerCase();
        const color = key.includes('airbnb')
          ? SOURCE_COLORS.airbnb
          : key.includes('booking')
            ? SOURCE_COLORS.booking
            : key.includes('gathern')
              ? SOURCE_COLORS.gathern
              : SOURCE_COLORS.direct;
        return { percentage: s.percentage, color };
      }),
      '#0284c7'
    );
    return { total, slices, gradient };
  }, [reportsData, totalBookingsVal]);

  // Chart 3: Revenue Trend Bars
  const revenueBars = useMemo(() => {
    const bars = reportsData?.charts?.revenue_trend?.bars || [];
    if (bars.length === 0) {
      return [
        { label: 'أكتوبر 2026', labelEn: 'Oct 2026', height: '88%', active: true, revenue: 4950 },
        { label: 'سبتمبر', labelEn: 'Sep', height: '6px', active: false, revenue: 0 },
        { label: 'أغسطس', labelEn: 'Aug', height: '6px', active: false, revenue: 0 },
        { label: 'يوليو', labelEn: 'Jul', height: '6px', active: false, revenue: 0 },
        { label: 'يونيو', labelEn: 'Jun', height: '6px', active: false, revenue: 0 },
        { label: 'مايو', labelEn: 'May', height: '6px', active: false, revenue: 0 },
        { label: 'أبريل', labelEn: 'Apr', height: '6px', active: false, revenue: 0 },
        { label: 'مارس', labelEn: 'Mar', height: '6px', active: false, revenue: 0 },
        { label: 'فبراير', labelEn: 'Feb', height: '6px', active: false, revenue: 0 },
      ];
    }

    const maxRev = Math.max(...bars.map((b) => Number(b.revenue) || 0), 1);
    // Reverse so newest month is first in RTL layout (on the right)
    return [...bars].reverse().map((b) => {
      const rev = Number(b.revenue) || 0;
      const pct = rev > 0 ? Math.max(14, Math.round((rev / maxRev) * 88)) : 0;
      const enShort = MONTH_EN_MAP[b.label] || b.label;
      const yearPart = b.key?.split('-')[0] || '';
      const labelAr = b.is_current_month ? b.full_label || b.label : b.label;
      const labelEn = b.is_current_month && yearPart ? `${enShort} ${yearPart}` : enShort;
      return {
        label: labelAr,
        labelEn,
        height: rev > 0 ? `${pct}%` : '6px',
        active: Boolean(b.is_current_month),
        revenue: rev,
      };
    });
  }, [reportsData]);

  // Executed Services
  const executedServices = useMemo(() => {
    const raw = reportsData?.executed_services || [];
    const totalOps = raw.reduce((sum, item) => sum + (Number(item.count) || 0), 0);
    const items = raw.map((svc) => {
      const meta = SERVICE_META[svc.service_key] || {
        titleEn: svc.service_name,
        icon: Sparkles,
      };
      const pct = svc.change_percentage ?? 0;
      const arrow = svc.is_increase === false ? '↓' : '↑';
      return {
        title: svc.service_name,
        titleEn: meta.titleEn,
        count: svc.count,
        note: svc.comparison_label || `${arrow} ${pct}% مقارنة بالفترة السابقة`,
        noteEn: `${arrow} ${pct}% vs previous period`,
        isUp: Boolean(svc.is_increase && pct > 0),
        icon: meta.icon,
      };
    });
    return { totalOps, items };
  }, [reportsData]);

  // Units Performance
  const unitsPerformance = useMemo(() => {
    return reportsData?.units_performance || [];
  }, [reportsData]);

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

      {/* Filter Card Bar connected to API query params */}
      <section className="reports-filter-bar">
        <select
          className="reports-filter-select"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          aria-label={lang === 'en' ? 'Period' : 'الفترة الزمنية'}
        >
          <option value="last_30_days">{lang === 'en' ? 'Last 30 Days' : 'آخر 30 يوم'}</option>
          <option value="last_7_days">{lang === 'en' ? 'Last 7 Days' : 'آخر 7 أيام'}</option>
          <option value="this_month">{lang === 'en' ? 'This Month' : 'هذا الشهر'}</option>
          <option value="last_month">{lang === 'en' ? 'Last Month' : 'الشهر الماضي'}</option>
          <option value="this_year">{lang === 'en' ? 'This Year' : 'هذا العام'}</option>
        </select>

        <select
          className="reports-filter-select"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
          aria-label={lang === 'en' ? 'Property' : 'العقار'}
        >
          <option value="all">{lang === 'en' ? 'All Properties' : 'جميع العقارات'}</option>
          {allProperties.map((prop) => (
            <option key={prop} value={prop}>
              {prop}
            </option>
          ))}
        </select>

        <select
          className="reports-filter-select"
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          aria-label={lang === 'en' ? 'Unit' : 'الوحدة'}
        >
          <option value="all">{lang === 'en' ? 'All Units' : 'جميع الوحدات'}</option>
          {allUnitsList.map((u) => (
            <option key={u.id} value={String(u.id)}>
              {lang === 'en' ? UNIT_EN_NAMES[u.code || '']?.nameEn || u.name : u.name}
            </option>
          ))}
        </select>
      </section>

      {/* 4 KPI Stats Grid */}
      <section className="reports-stats-grid">
        {/* 1. Total Units */}
        <div className="report-stat-card">
          <div className="report-stat-info">
            <span className="report-stat-label">
              {lang === 'en' ? 'Total Units' : 'إجمالي الوحدات'}
            </span>
            <strong className="report-stat-value">{totalUnitsVal}</strong>
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
            <strong className="report-stat-value">{totalBookingsVal}</strong>
            <span className={`report-stat-sub ${bookingsUp ? 'up' : ''}`}>
              {lang === 'en'
                ? `${bookingsUp ? '↑' : '↓'} ${bookingsPct}% vs previous period`
                : `${bookingsUp ? '↑' : '↓'} ${bookingsPct}% مقارنة بالفترة السابقة`}
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
            <strong className="report-stat-value">{occupancyVal}%</strong>
            <span className={`report-stat-sub ${occupancyUp ? 'up' : ''}`}>
              {lang === 'en'
                ? `${occupancyUp ? '↑' : '↓'} ${occupancyPct}% vs previous period`
                : `${occupancyUp ? '↑' : '↓'} ${occupancyPct}% مقارنة بالفترة السابقة`}
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
            <strong className="report-stat-value">{revenueDisplay}</strong>
            <span className={`report-stat-sub ${revenueUp ? 'up' : ''}`}>
              {lang === 'en'
                ? `${revenueUp ? '↑' : '↓'} ${revenuePct}% vs previous period`
                : `${revenueUp ? '↑' : '↓'} ${revenuePct}% مقارنة بالفترة السابقة`}
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
                background: unitStatusChart.gradient,
              }}
            >
              <div className="donut-hole">
                <strong>{unitStatusChart.total}</strong>
                <small>{lang === 'en' ? 'Total Units' : 'إجمالي الوحدات'}</small>
              </div>
            </div>

            <div className="donut-legend-list">
              {unitStatusChart.slices.map((s) => (
                <div className="donut-legend-row" key={s.key}>
                  <div className="donut-legend-info">
                    <span
                      className="donut-legend-dot"
                      style={{ background: STATUS_COLORS[s.key] || '#94a3b8' }}
                    />
                    <span>{lang === 'en' ? STATUS_LABELS_EN[s.key] || s.label : s.label}</span>
                  </div>
                  <span className="donut-legend-count">
                    {s.count} ({s.percentage}%)
                  </span>
                </div>
              ))}
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
                background: bookingSourcesChart.gradient,
              }}
            >
              <div className="donut-hole">
                <strong>{bookingSourcesChart.total}</strong>
                <small>{lang === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}</small>
              </div>
            </div>

            <div className="donut-legend-list">
              {bookingSourcesChart.slices.map((s) => {
                const key = s.source.toLowerCase();
                const dotColor = key.includes('airbnb')
                  ? SOURCE_COLORS.airbnb
                  : key.includes('booking')
                    ? SOURCE_COLORS.booking
                    : key.includes('gathern')
                      ? SOURCE_COLORS.gathern
                      : SOURCE_COLORS.direct;
                return (
                  <div className="donut-legend-row" key={s.source}>
                    <div className="donut-legend-info">
                      <span className="donut-legend-dot" style={{ background: dotColor }} />
                      <span>{s.source}</span>
                    </div>
                    <span className="donut-legend-count">
                      {s.count} ({s.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart 3: Revenue Trend */}
        <div className="report-chart-card">
          <div className="chart-card-header">
            <h2>{lang === 'en' ? 'Revenue Trends' : 'اتجاه الإيرادات'}</h2>
            <button
              type="button"
              className="chart-view-pill"
              onClick={() => setChartView((prev) => (prev === 'monthly' ? 'weekly' : 'monthly'))}
            >
              {chartView === 'monthly'
                ? lang === 'en'
                  ? 'Monthly'
                  : 'شهرياً'
                : lang === 'en'
                  ? 'Weekly'
                  : 'أسبوعياً'}
            </button>
          </div>
          <div className="revenue-bar-chart">
            {revenueBars.map((m, i) => (
              <div
                key={i}
                className={`rev-bar-col ${m.active ? 'active' : ''}`}
                title={`${m.revenue.toLocaleString()} ${lang === 'en' ? 'SAR' : 'ر.س'}`}
              >
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
              {lang === 'en'
                ? `${executedServices.totalOps} operations`
                : `${executedServices.totalOps} عملية`}
            </span>
          </div>

          {executedServices.items.map((svc, i) => {
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
              {lang === 'en'
                ? `${unitsPerformance.length} units`
                : `${unitsPerformance.length} وحدات`}
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
                {unitsPerformance.map((u) => {
                  const unitCode = u.code || String(u.id);
                  const enMeta = UNIT_EN_NAMES[unitCode];
                  const unitName = lang === 'en' ? enMeta?.nameEn || u.name : u.name;
                  const unitProperty =
                    lang === 'en' ? enMeta?.propertyEn || u.property_name : u.property_name;
                  const revNum = Number(u.revenue) || 0;
                  const revenueVal =
                    lang === 'en'
                      ? `${revNum.toLocaleString('en-US')} SAR`
                      : u.revenue_formatted || `${revNum.toLocaleString('en-US')} ر.س`;
                  const lastBookingVal =
                    lang === 'en' && u.last_booking_date === 'لا توجد حجوزات حديثة'
                      ? 'No recent bookings'
                      : u.last_booking_date || '—';
                  const thumbSrc = u.image || UNIT_THUMBS[unitCode];

                  return (
                    <tr key={u.id}>
                      {/* Unit */}
                      <td>
                        <div className="perf-unit-cell">
                          <div className="perf-unit-thumb">
                            {thumbSrc ? (
                              <img
                                src={thumbSrc}
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
                            <Link
                              to={`/app/units/${unitCode}`}
                              className="perf-unit-title"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <strong>{unitName}</strong>
                            </Link>
                            <span className="perf-unit-prop">{unitProperty}</span>
                          </div>
                        </div>
                      </td>

                      {/* Occupancy */}
                      <td>
                        <div className="occupancy-cell">
                          <span className="occupancy-val">{u.occupancy_rate}%</span>
                          <div className="occupancy-bar-bg">
                            <div
                              className="occupancy-bar-fill"
                              style={{ width: `${Math.min(100, Math.max(0, u.occupancy_rate))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Bookings Count */}
                      <td>
                        <strong>{u.bookings_count}</strong>
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
