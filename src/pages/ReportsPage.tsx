import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  BedDouble,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  Coins,
  Download,
  Eye,
  FileChartColumn,
  Filter,
  House,
  Percent,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import type { ClientReportsData, ClientReportsFilterParams } from '../types/clientReports';
import { fetchClientReports } from '../services/clientReportsService';
import './reference-pages.css';

export default function ReportsPage() {
  const [data, setData] = useState<ClientReportsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [period, setPeriod] = useState<string>('last_30_days');
  const [bookingSource, setBookingSource] = useState<string>('all');
  const [propertyName, setPropertyName] = useState<string>('all');
  const [chartView, setChartView] = useState<'monthly' | 'weekly' | 'daily'>('monthly');

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchClientReports({
        period,
        booking_source: bookingSource,
        property_name: propertyName,
        chart_view: chartView,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [period, bookingSource, propertyName, chartView]);

  const kpis = data?.summary_kpis;
  const charts = data?.charts;
  const unitsPerf = data?.units_performance || [];
  const executedServices = data?.executed_services || [];

  // Computed Conic Gradient for Booking Sources
  const bookingSourcesDonut = useMemo(() => {
    const slices = charts?.booking_sources.slices || [];
    const colors = ['#ff7181', '#4093ef', '#8d43dc', '#aebbc6', '#26b779'];
    let currentPct = 0;
    const gradientParts: string[] = [];
    const items: Array<[string, string, string]> = [];

    slices.forEach((slice, idx) => {
      const color = colors[idx % colors.length];
      const start = currentPct;
      const end = currentPct + slice.percentage;
      gradientParts.push(`${color} ${start}% ${end}%`);
      items.push([slice.source, `${slice.count} (${slice.percentage}%)`, color]);
      currentPct = end;
    });

    return {
      gradient: gradientParts.length > 0 ? `conic-gradient(${gradientParts.join(', ')})` : undefined,
      items,
      total: charts?.booking_sources.total_bookings ?? 0,
    };
  }, [charts?.booking_sources]);

  // Computed Conic Gradient for Units Status
  const unitsStatusDonut = useMemo(() => {
    const slices = charts?.units_status.slices || [];
    const colorMap: Record<string, string> = {
      occupied: '#076689',
      ready: '#44bf78',
      pending_cleaning: '#ffb348',
      maintenance: '#ff5963',
    };
    let currentPct = 0;
    const gradientParts: string[] = [];
    const items: Array<[string, string, string]> = [];

    slices.forEach(slice => {
      const color = colorMap[slice.key] || '#718799';
      const start = currentPct;
      const end = currentPct + slice.percentage;
      gradientParts.push(`${color} ${start}% ${end}%`);
      items.push([slice.label, `${slice.count} (${slice.percentage}%)`, color]);
      currentPct = end;
    });

    return {
      gradient: gradientParts.length > 0 ? `conic-gradient(${gradientParts.join(', ')})` : undefined,
      items,
      total: charts?.units_status.total_units ?? 0,
    };
  }, [charts?.units_status]);

  // Revenue bars height calculation
  const revenueBars = useMemo(() => {
    const bars = charts?.revenue_trend.bars || [];
    const maxRev = Math.max(...bars.map(b => b.revenue), 50000);
    return bars.map(bar => ({
      ...bar,
      heightPx: Math.max(30, Math.round((bar.revenue / maxRev) * 160)),
    }));
  }, [charts?.revenue_trend.bars]);

  // Export report to CSV
  const handleExport = () => {
    if (!data) return;
    let csv = 'الوحدة,العقار,نسبة الإشغال,عدد الحجوزات,الإيرادات,آخر حجز\n';
    unitsPerf.forEach(u => {
      csv += `"${u.name}","${u.property_name}","${u.occupancy_formatted}",${u.bookings_count},"${u.revenue_formatted}","${u.last_booking_date}"\n`;
    });
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blueclean-reports-${period}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reference-page reports-page">
      <header className="reference-page-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to="/app">الرئيسية</Link>
            <ChevronLeft size={13} />
            <span>التقارير</span>
          </div>
          <h1>
            <FileChartColumn size={29} />
            التقارير والتحليلات
          </h1>
          <p>تحليلات شاملة لأداء وحداتك، مصادر الحجوزات، الإيرادات والخدمات المنفذة</p>
        </div>

        {/* Filter Controls Bar */}
        <div className="report-filters">
          <select
            className="reference-control"
            value={period}
            onChange={e => setPeriod(e.target.value)}
          >
            <option value="last_30_days">آخر 30 يوم</option>
            <option value="last_7_days">آخر 7 أيام</option>
            <option value="this_month">هذا الشهر</option>
            <option value="last_month">الشهر الماضي</option>
            <option value="this_year">هذا العام</option>
          </select>

          <select
            className="reference-control"
            value={bookingSource}
            onChange={e => setBookingSource(e.target.value)}
          >
            <option value="all">جميع المنصات</option>
            <option value="Airbnb">Airbnb</option>
            <option value="Booking.com">Booking.com</option>
            <option value="Gathern">Gathern</option>
            <option value="حجز مباشر">حجز مباشر</option>
          </select>

          <select
            className="reference-control"
            value={propertyName}
            onChange={e => setPropertyName(e.target.value)}
          >
            <option value="all">جميع العقارات</option>
            <option value="برج النخيل">برج النخيل</option>
            <option value="مساكن الروضة">مساكن الروضة</option>
            <option value="برج الياسمين">برج الياسمين</option>
          </select>

          <button
            type="button"
            className="reference-primary"
            onClick={loadReports}
          >
            <Filter size={17} />
            تحديث التقرير
          </button>
        </div>
      </header>

      {/* KPI Cards Row */}
      <section className="reference-stats four">
        <ReportStat
          label="إجمالي الوحدات"
          value={String(kpis?.total_units.value ?? 12)}
          note={kpis?.total_units.label || 'بدون تغيير'}
          color="blue"
          icon={House}
        />
        <ReportStat
          label="عدد الحجوزات"
          value={String(kpis?.total_bookings.value ?? 56)}
          note={kpis?.total_bookings.comparison_label || '↑ 14% مقارنة بالفترة السابقة'}
          color="sky"
          icon={CalendarDays}
        />
        <ReportStat
          label="نسبة الإشغال"
          value={kpis?.occupancy_rate.formatted || `${kpis?.occupancy_rate.value ?? 78}%`}
          note={kpis?.occupancy_rate.comparison_label || '↑ 6% مقارنة بالفترة السابقة'}
          color="orange"
          icon={Percent}
        />
        <ReportStat
          label="إجمالي الإيرادات"
          value={kpis?.total_revenue.formatted || `${kpis?.total_revenue.value ?? 48750} ر.س`}
          note={kpis?.total_revenue.comparison_label || '↑ 12% مقارنة بالفترة السابقة'}
          color="green"
          icon={Coins}
        />
      </section>

      {/* Middle Section: Revenue Trend & Donut Charts */}
      <section className="reports-charts">
        {/* Revenue Trend Chart */}
        <article className="reference-panel report-card">
          <div className="reference-panel-title">
            <h2>اتجاه الإيرادات</h2>
            <select
              className="reference-control"
              style={{ height: 34, padding: '0 10px', fontSize: 11 }}
              value={chartView}
              onChange={e => setChartView(e.target.value as any)}
            >
              <option value="monthly">شهريًا</option>
              <option value="weekly">أسبوعيًا</option>
              <option value="daily">يوميًا</option>
            </select>
          </div>
          <div className="revenue-chart">
            {revenueBars.map((bar, index) => (
              <i
                key={bar.key || index}
                className={`revenue-bar ${bar.is_current_month || index === revenueBars.length - 1 ? 'active' : ''}`}
                style={{ height: bar.heightPx }}
                title={`${bar.full_label || bar.label}: ${bar.revenue.toLocaleString()} ر.س (${bar.bookings_count} حجز)`}
              >
                <span>{bar.label}</span>
              </i>
            ))}
          </div>
        </article>

        {/* Booking Sources Donut */}
        <DonutCard
          title="مصادر الحجوزات"
          center={String(bookingSourcesDonut.total)}
          subtitle="إجمالي الحجوزات"
          gradient={
            bookingSourcesDonut.gradient ||
            'conic-gradient(#ff7181 0 43%,#4093ef 43% 75%,#8d43dc 75% 93%,#aebbc6 93%)'
          }
          items={bookingSourcesDonut.items}
        />

        {/* Units Status Donut */}
        <DonutCard
          title="حالة الوحدات"
          center={String(unitsStatusDonut.total)}
          subtitle="إجمالي الوحدات"
          gradient={
            unitsStatusDonut.gradient ||
            'conic-gradient(#076689 0 67%,#44bf78 67% 84%,#ffb348 84% 92%,#ff5963 92%)'
          }
          items={unitsStatusDonut.items}
        />
      </section>

      {/* Bottom Section: Units Performance, Executed Services & Export */}
      <section className="report-bottom">
        {/* Units Performance Table */}
        <article className="reference-panel performance-card">
          <div className="reference-panel-title">
            <h2>أداء الوحدات</h2>
            <Link to="/app/units" className="reference-link">
              عرض كل الوحدات
            </Link>
          </div>
          <table className="performance-table">
            <thead>
              <tr>
                <th>الوحدة</th>
                <th>نسبة الإشغال</th>
                <th>عدد الحجوزات</th>
                <th>الإيرادات</th>
                <th>آخر حجز</th>
                <th style={{ textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {unitsPerf.map((unit, index) => (
                <tr key={unit.id || index}>
                  <td>
                    <div className="performance-unit">
                      <span className={`ref-thumbnail u${(index % 8) + 1}`} />
                      <span>
                        <strong>{unit.name}</strong>
                        <small>{unit.property_name}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="occupancy">
                      <b>{unit.occupancy_formatted}</b>
                      <i style={{ '--value': `${unit.occupancy_rate}%` } as CSSProperties} />
                    </span>
                  </td>
                  <td>
                    <b>{unit.bookings_count}</b>
                  </td>
                  <td>
                    <strong>{unit.revenue_formatted}</strong>
                  </td>
                  <td>{unit.last_booking_date}</td>
                  <td>
                    <div className="table-actions-cell">
                      <Tooltip text="عرض تفاصيل الوحدة">
                        <Link
                          to={`/app/units/${unit.code || unit.id}`}
                          className="table-icon-btn primary"
                          aria-label={`عرض تفاصيل ${unit.name}`}
                        >
                          <Eye size={15} />
                        </Link>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        {/* Executed Services Card */}
        <article className="reference-panel services-card">
          <div className="reference-panel-title">
            <h2>الخدمات المنفذة</h2>
            <Link to="/app/operations/cleaning" className="reference-link">
              عرض العمليات
            </Link>
          </div>
          {executedServices.map((svc, idx) => (
            <ServiceResult
              key={idx}
              label={svc.service_name}
              value={String(svc.count)}
              mark={svc.comparison_label || (svc.change_percentage ? `↑ ${svc.change_percentage}%` : '')}
            />
          ))}
        </article>

        {/* Expenses & Export Box */}
        <div className="costs-stack">
          <DonutCard
            title="التكاليف والمصروفات"
            center="12,450"
            subtitle="ر.س إجمالي المصروفات"
            gradient="conic-gradient(#066486 0 42%,#4897ef 42% 73%,#ffbd54 73% 90%,#b7c1c9 90%)"
            items={[
              ['مواد تنظيف', '5,200 (42%)', '#066486'],
              ['رواتب العمال', '3,800 (31%)', '#4897ef'],
              ['الصيانة', '2,100 (17%)', '#ffbd54'],
              ['أخرى', '1,350 (11%)', '#b7c1c9'],
            ]}
          />
          <article className="reference-panel export-report">
            <div>
              <h3>تصدير التقارير</h3>
              <p>احصل على تقارير مفصلة بصيغة Excel أو PDF</p>
              <button
                type="button"
                className="reference-primary"
                onClick={handleExport}
              >
                <Download size={14} />
                تصدير التقرير
              </button>
            </div>
            <FileChartColumn size={46} color="#0877a4" />
          </article>
        </div>
      </section>
    </div>
  );
}

function ReportStat({
  label,
  value,
  note,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  color: string;
  icon: typeof House;
}) {
  return (
    <article className="reference-stat">
      <span className={`reference-stat-icon ${color}`}>
        <Icon size={29} />
      </span>
      <div className="reference-stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small className={note.includes('↑') ? 'up' : ''}>{note}</small>
      </div>
    </article>
  );
}

function DonutCard({
  title,
  center,
  subtitle,
  gradient,
  items,
}: {
  title: string;
  center: string;
  subtitle: string;
  gradient: string;
  items: Array<[string, string, string]>;
}) {
  return (
    <article className="reference-panel report-card">
      <h2>{title}</h2>
      <div className="donut-content">
        <div className="donut" style={{ background: gradient }}>
          <span className="donut-center">
            <strong>{center}</strong>
            {subtitle}
          </span>
        </div>
        <div className="donut-legend">
          {items.map(([label, value, color]) => (
            <span key={label}>
              <i style={{ background: color }} />
              <b>{label}</b>
              <strong>{value}</strong>
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function ServiceResult({ label, value, mark }: { label: string; value: string; mark: string }) {
  return (
    <div className="service-result">
      <i>✧</i>
      <b>{label}</b>
      <strong>
        {value} {mark && <small>{mark}</small>}
      </strong>
    </div>
  );
}
