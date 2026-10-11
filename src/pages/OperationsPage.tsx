import { useState, useRef, useEffect } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  List,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Wrench,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import { operationDetails } from '../data/detailRecords';
import type { OperationDetailRecord } from '../types/details';
import { useLanguage } from '../context/LanguageContext';
import { fetchClientOperations } from '../services/workflowService';
import './operations-page.css';

type OperationPageKind = OperationDetailRecord['kind'];

function BroomIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2v7" />
      <path d="M7 9h10l-1.5 12h-7L7 9Z" />
      <path d="M10 16v5" />
      <path d="M14 16v5" />
    </svg>
  );
}

function ServiceIcon({ size = 20, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M6 12h5a4 4 0 0 0 4-4V6" />
      <path d="M6 12h5a4 4 0 0 1 4 4v2" />
      <circle cx="6" cy="12" r="2.5" />
    </svg>
  );
}

const pageConfig = {
  cleaning: {
    title: 'النظافة',
    description: 'إدارة طلبات التنظيف الدورية والمرتبطة بمغادرة الضيوف',
    icon: BroomIcon,
    iconColor: '#0c7c8a',
    create: '/app/new/cleaning',
    createLabel: 'طلب تنظيف جديد',
    route: 'cleaning',
    popular: 'أكثر الوحدات طلباً للتنظيف',
    noun: 'طلب تنظيف',
  },
  maintenance: {
    title: 'الصيانة',
    description: 'متابعة البلاغات والإصلاحات والفحوصات الوقائية لكل وحدة',
    icon: ({ size = 20, color = '#f97316' }: { size?: number; color?: string }) => (
      <Wrench size={size} color={color} />
    ),
    iconColor: '#f97316',
    create: '/app/new/maintenance',
    createLabel: 'إنشاء طلب صيانة',
    route: 'maintenance',
    popular: 'أكثر الوحدات طلباً للصيانة',
    noun: 'طلب صيانة',
  },
  service: {
    title: 'الخدمات الإضافية',
    description: 'إدارة التعقيم والغسيل وتجهيز الضيافة والخدمات المخصصة',
    icon: ServiceIcon,
    iconColor: '#8b5cf6',
    create: '/app/new/service',
    createLabel: 'طلب خدمة جديدة',
    route: 'services',
    popular: 'أكثر الوحدات طلباً للخدمات',
    noun: 'طلب خدمة',
  },
} as const;

// 3 Default Service Tasks matching media_1791373487600.png
const serviceDefaultTasks: OperationDetailRecord[] = [
  {
    id: 'SRV-6763',
    kind: 'service',
    title: 'تجهيز ضيافة إضافية',
    subtitle: 'طلب تشغيل ومتابعة تنفيذ',
    source: 'طلب داخلي',
    unit: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    property: 'أبراج الرمال السكنية',
    unitCode: 'UNT-YMFCHL',
    imageClass: 'u1',
    status: 'بانتظار التعيين',
    statusTone: 'orange',
    priority: 'عادية',
    priorityTone: 'blue',
    assignee: { name: 'غير معيّن', type: 'مزود خدمة معتمد', phone: '+966 50 123 4567' },
    schedule: { date: '7 أكتوبر 2026', start: '02:42 PM', due: '13:00', duration: 'ساعتان' },
    description: 'تجهيز باقة ضيافة وترتيب سرير إضافي',
    checklist: [],
    costs: [],
    attachments: [],
    timeline: [],
  },
  {
    id: 'SRV-1523',
    kind: 'service',
    title: 'تعقيم',
    subtitle: 'طلب تشغيل ومتابعة تنفيذ',
    source: 'guest_request',
    unit: 'شقة الرمال الفاخرة - برج 4',
    property: 'أبراج الرمال السكنية',
    unitCode: 'UNT-101',
    imageClass: 'u1',
    status: 'بانتظار التعيين',
    statusTone: 'orange',
    priority: 'عادية',
    priorityTone: 'blue',
    assignee: { name: 'غير معيّن', type: 'مزود خدمة معتمد', phone: '+966 50 123 4567' },
    schedule: { date: '12 أكتوبر 2026', start: '12:40 AM', due: '13:00', duration: 'ساعة' },
    description: 'تعقيم شامل قبل الوصول',
    checklist: [],
    costs: [],
    attachments: [],
    timeline: [],
  },
  {
    id: 'EXT-261002-01',
    kind: 'service',
    title: 'غسيل كنب',
    subtitle: 'طلب تشغيل ومتابعة تنفيذ',
    source: 'guest_request',
    unit: 'شقة الرمال الفاخرة - برج 4',
    property: 'أبراج الرمال السكنية',
    unitCode: 'UNT-101',
    imageClass: 'u1',
    status: 'مجدول',
    statusTone: 'orange',
    priority: 'متوسط',
    priorityTone: 'yellow',
    assignee: { name: 'محمد محمد', type: 'مزود خدمة معتمد', phone: '+966 50 987 6543' },
    schedule: { date: '2 أكتوبر 2026', start: '16:00', due: '17:30', duration: 'ساعة ونصف' },
    description: 'تنظيف وغسيل الكنب',
    checklist: [],
    costs: [],
    attachments: [],
    timeline: [],
  },
];

const servicePopularUnits = [
  {
    unit: 'شقة الرمال الفاخرة - برج 4',
    unitEn: 'Al Remal Luxury Apt - Tower 4',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    count: '3 طلبات',
    countEn: '3 requests',
    thumb: '/unit-thumbs/thumb-1.png',
  },
  {
    unit: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    unitEn: 'Al Remal Luxury Apt - Tower 4 (Copy)',
    property: 'أبراج الرمال السكنية',
    propertyEn: 'Al Remal Residential Towers',
    count: '1 طلبات',
    countEn: '1 request',
    thumb: '/unit-thumbs/thumb-1.png',
  },
];

const serviceRecentActivities = [
  {
    color: 'green',
    text: 'تم تحديث طلب تجهيز ضيافة إضافية في شقة الرمال الفاخرة - برج 4 (نسخة)',
    textEn: 'Updated extra hospitality setup in Al Remal Luxury Apt - Tower 4 (Copy)',
    time: 'منذ يوم',
    timeEn: '1 day ago',
  },
  {
    color: 'orange',
    text: 'تم تحديث طلب تعقيم في شقة الرمال الفاخرة - برج 4',
    textEn: 'Updated sanitization in Al Remal Luxury Apt - Tower 4',
    time: 'منذ 4 أيام',
    timeEn: '4 days ago',
  },
  {
    color: 'blue',
    text: 'تم تحديث طلب غسيل كنب في شقة الرمال الفاخرة - برج 4',
    textEn: 'Updated sofa washing in Al Remal Luxury Apt - Tower 4',
    time: 'منذ 4 أيام',
    timeEn: '4 days ago',
  },
];

export default function OperationsPage({ kind }: { kind: OperationPageKind }) {
  const { lang, isRTL, t } = useLanguage();
  const config = pageConfig[kind];
  const PageIcon = config.icon;

  const pageTitle =
    lang === 'en'
      ? (kind === 'cleaning' ? 'Cleaning' : kind === 'maintenance' ? 'Maintenance' : 'Extra Services')
      : config.title;

  const pageDescription =
    lang === 'en'
      ? (kind === 'cleaning'
          ? 'Manage regular turnovers and checkout cleaning requests.'
          : kind === 'maintenance'
          ? 'Track work orders, repairs, and preventative maintenance for each unit.'
          : 'Manage sanitization, laundry, hospitality kits, and specialized services.')
      : config.description;

  const createBtnLabel =
    lang === 'en'
      ? (kind === 'cleaning'
          ? 'New Cleaning Task'
          : kind === 'maintenance'
          ? 'New Maintenance Request'
          : 'New Service Request')
      : config.createLabel;

  // View mode switcher: 'list' | 'calendar'
  const [view, setView] = useState<'list' | 'calendar'>('list');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter] = useState('');

  // Dropdown open states
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);

  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target as Node)
      ) {
        setPriorityDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize tasks based on kind:
  // - service: 3 tasks matching media_1791373487600.png
  // - cleaning & maintenance: 0 tasks matching media_1791371269856.png and media_1791373318009.png
  const [tasks, setTasks] = useState<OperationDetailRecord[]>(() => {
    if (kind === 'service') {
      return serviceDefaultTasks;
    }
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('demo') === '1') {
        return operationDetails.filter((task) => task.kind === kind);
      }
    }
    return [];
  });

  useEffect(() => {
    let active = true;
    fetchClientOperations(kind).then((apiTasks) => {
      if (active && apiTasks) {
        if (apiTasks.length > 0 || kind !== 'service') {
          setTasks(apiTasks);
        }
      }
    });
    return () => {
      active = false;
    };
  }, [kind]);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (
      searchQuery &&
      !task.unit.includes(searchQuery) &&
      !task.title.includes(searchQuery) &&
      !task.id.includes(searchQuery)
    ) {
      return false;
    }
    return true;
  });

  const countByStatus = (status: string) =>
    tasks.filter((task) => task.status === status).length;

  const statusOptions = [
    { value: 'all', label: lang === 'en' ? 'All Statuses' : 'جميع الحالات' },
    { value: 'بانتظار التعيين', label: lang === 'en' ? 'Pending Assignment' : 'بانتظار التعيين' },
    { value: 'مجدول', label: lang === 'en' ? 'Scheduled' : 'مجدول' },
    { value: 'قيد التنفيذ', label: lang === 'en' ? 'In Progress' : 'قيد التنفيذ' },
    { value: 'قيد المراجعة', label: lang === 'en' ? 'In Review' : 'قيد المراجعة' },
    { value: 'مكتملة', label: lang === 'en' ? 'Completed' : 'مكتملة' },
  ];

  const priorityOptions = [
    { value: 'all', label: lang === 'en' ? 'All Priorities' : 'كل الأولويات' },
    { value: 'عاجلة', label: lang === 'en' ? 'Urgent' : 'عاجلة' },
    { value: 'عالية', label: lang === 'en' ? 'High' : 'عالية' },
    { value: 'متوسطة', label: lang === 'en' ? 'Medium' : 'متوسطة' },
    { value: 'عادية', label: lang === 'en' ? 'Normal' : 'عادية' },
  ];

  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === statusFilter)?.label || (lang === 'en' ? 'All Statuses' : 'جميع الحالات');
  const currentPriorityLabel =
    priorityOptions.find((opt) => opt.value === priorityFilter)?.label || (lang === 'en' ? 'All Priorities' : 'كل الأولويات');

  const translateStatus = (s: string) => {
    if (lang !== 'en') return s;
    switch (s) {
      case 'بانتظار التعيين': return 'Pending Assignment';
      case 'مجدول': return 'Scheduled';
      case 'قيد التنفيذ': return 'In Progress';
      case 'قيد المراجعة': return 'In Review';
      case 'مكتملة': return 'Completed';
      default: return s;
    }
  };

  const translatePriority = (p: string) => {
    if (lang !== 'en') return p;
    switch (p) {
      case 'عاجلة': return 'Urgent';
      case 'عالية': return 'High';
      case 'متوسط':
      case 'متوسطة': return 'Medium';
      case 'عادية': return 'Normal';
      default: return p;
    }
  };

  const translateTaskTitle = (t: string) => {
    if (lang !== 'en') return t;
    switch (t) {
      case 'تجهيز ضيافة إضافية': return 'Extra Hospitality Setup';
      case 'تعقيم': return 'Sanitization';
      case 'غسيل كنب': return 'Sofa Washing';
      default: return t;
    }
  };

  const translateSource = (s: string) => {
    if (lang !== 'en') return s;
    if (s === 'طلب داخلي') return 'Internal Request';
    if (s === 'guest_request') return 'Guest Request';
    return s;
  };

  const translateUnit = (u: string) => {
    if (lang !== 'en') return u;
    if (u.includes('نسخة')) return 'Al Remal Luxury Apt - Tower 4 (Copy)';
    if (u.includes('شقة الرمال')) return 'Al Remal Luxury Apt - Tower 4';
    return u;
  };

  const translateProperty = (p: string) => {
    if (lang !== 'en') return p;
    if (p.includes('أبراج الرمال')) return 'Al Remal Residential Towers';
    return p;
  };

  const translateDate = (d: string) => {
    if (lang !== 'en') return d;
    return d.replace('أكتوبر 2026', 'Oct 2026');
  };

  const sidePopularHeader =
    lang === 'en'
      ? (kind === 'cleaning'
          ? 'Most Cleaned Units'
          : kind === 'maintenance'
          ? 'Most Maintained Units'
          : 'Most Requested Units')
      : config.popular;

  return (
    <div className={`operations-page-container operation-category-${kind}`}>
      {/* Top Header */}
      <header className="operations-header">
        <div className="operations-header-info">
          <div className="operations-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.operations')}</span>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{pageTitle}</span>
          </div>
          <div className="operations-title-row">
            <h1>{pageTitle}</h1>
            <span className="operations-title-icon" aria-hidden="true">
              <PageIcon size={24} color={config.iconColor} />
            </span>
          </div>
          <p>{pageDescription}</p>
        </div>

        <div className="operations-header-actions">
          <div className="operations-view-switcher" role="group" aria-label={lang === 'en' ? 'View mode' : 'طريقة العرض'}>
            <button
              type="button"
              className={`operations-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <List size={16} />
              <span>{lang === 'en' ? 'List' : 'القائمة'}</span>
            </button>
            <button
              type="button"
              className={`operations-view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              <CalendarDays size={16} />
              <span>{lang === 'en' ? 'Calendar' : 'التقويم'}</span>
            </button>
          </div>

          <Link className="btn-add-operation" to={config.create}>
            <Plus size={18} />
            <span>{createBtnLabel}</span>
          </Link>
        </div>
      </header>

      {/* 5 KPI Stat Cards */}
      <section className="operations-stats-grid">
        {/* 1. Pending Assignment */}
        <div className="operation-stat-card">
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('بانتظار التعيين')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'Pending Assignment' : 'بانتظار التعيين'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Clock3 size={20} />
          </div>
        </div>

        {/* 2. In Progress */}
        <div className="operation-stat-card">
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('قيد التنفيذ')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'In Progress' : 'قيد التنفيذ'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Clock3 size={20} />
          </div>
        </div>

        {/* 3. In Review */}
        <div className="operation-stat-card">
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('قيد المراجعة')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'In Review' : 'قيد المراجعة'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Eye size={20} />
          </div>
        </div>

        {/* 4. Completed */}
        <div className="operation-stat-card">
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('مكتملة')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'Completed' : 'مكتملة'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* 5. Total Requests */}
        <div className="operation-stat-card">
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{tasks.length}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'Total Requests' : 'إجمالي الطلبات'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <ListChecks size={20} />
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <div className="operations-main-layout">
        {/* Right Column: 3 Side Cards */}
        <aside className="operations-side-column">
          {/* Card 1: Performance */}
          <div className="operations-side-card">
            <div className="side-card-header">
              <h2>{lang === 'en' ? "This Month's Performance" : `أداء ${config.title} هذا الشهر`}</h2>
              <span className="side-badge-pill">
                {lang === 'en' ? `${tasks.length} requests` : `${tasks.length} طلب`}
              </span>
            </div>
            <div className="perf-chart-box">
              {kind === 'service' ? (
                <div className="mini-chart-service">
                  <div className="chart-bar-group">
                    <div className="chart-bar green" style={{ height: '24%' }} />
                    <div className="chart-bar orange" style={{ height: '68%' }} />
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar blue" style={{ height: '18%' }} />
                    <div className="chart-bar orange" style={{ height: '82%' }} />
                  </div>
                  <div className="chart-bar-group">
                    <div className="chart-bar blue" style={{ height: '22%' }} />
                    <div className="chart-bar orange" style={{ height: '58%' }} />
                  </div>
                </div>
              ) : (
                <div className="perf-chart-area">
                  <div className="perf-grid-line" />
                  <div className="perf-grid-line" />
                  <div className="perf-baseline" />
                </div>
              )}

              <div className="perf-legend-row">
                <div className="perf-legend-item">
                  <span className="legend-box blue" />
                  <span>{lang === 'en' ? 'In Progress' : 'قيد التنفيذ'}</span>
                </div>
                <div className="perf-legend-item">
                  <span className="legend-box orange" />
                  <span>{lang === 'en' ? 'Pending' : 'بانتظار التعيين'}</span>
                </div>
                <div className="perf-legend-item">
                  <span className="legend-box green" />
                  <span>{lang === 'en' ? 'Completed' : 'مكتملة'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Popular Units */}
          <div className="operations-side-card">
            <div className="side-card-header">
              <h2>{sidePopularHeader}</h2>
              <span className="side-header-count">
                {kind === 'service'
                  ? (lang === 'en' ? `${servicePopularUnits.length} units` : `${servicePopularUnits.length} وحدات`)
                  : (lang === 'en' ? '0 units' : '0 وحدات')}
              </span>
            </div>
            {kind === 'service' ? (
              <div className="popular-units-list">
                {servicePopularUnits.map((u, i) => (
                  <Link key={i} to="/app/units" className="popular-unit-row">
                    <div className="popular-unit-info">
                      <div className="popular-unit-thumb">
                        <img src={u.thumb} alt={lang === 'en' ? u.unitEn : u.unit} />
                      </div>
                      <div className="popular-unit-details">
                        <strong>{lang === 'en' ? u.unitEn : u.unit}</strong>
                        <small>{lang === 'en' ? u.propertyEn : u.property}</small>
                      </div>
                    </div>
                    <span className="popular-unit-count">
                      {lang === 'en' ? u.countEn : u.count}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-side-box">
                <span>{lang === 'en' ? 'No units recorded' : 'لا توجد وحدات مسجلة'}</span>
              </div>
            )}
          </div>

          {/* Card 3: Recent Activities */}
          <div className="operations-side-card">
            <div className="side-card-header">
              <h2>{lang === 'en' ? 'Recent Activities' : 'أحدث الأنشطة'}</h2>
            </div>
            {kind === 'service' ? (
              <div className="activities-list">
                {serviceRecentActivities.map((act, i) => (
                  <div key={i} className="activity-item-row">
                    <span className={`activity-dot-badge ${act.color}`} />
                    <div className="activity-content">
                      <span className="activity-text">{lang === 'en' ? act.textEn : act.text}</span>
                      <span className="activity-time">{lang === 'en' ? act.timeEn : act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-side-box">
                <span>{lang === 'en' ? 'No recent activities' : 'لا توجد أنشطة حديثة'}</span>
              </div>
            )}
          </div>
        </aside>

        {/* Left Column: Main Table Panel */}
        <section className="operations-panel">
          {/* Filter Toolbar */}
          <div className="operations-filter-bar">
            {/* 1. Search Box */}
            <div className="filter-search-wrap">
              <input
                type="text"
                className="filter-search-input"
                placeholder={lang === 'en' ? 'Search by request # or unit...' : '... ابحث برقم الطلب أو الوحدة'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search size={16} className="filter-search-icon" />
            </div>

            {/* 2. Status Dropdown */}
            <div className="filter-dropdown-wrap" ref={statusDropdownRef}>
              <button
                type="button"
                className="filter-btn"
                onClick={() => {
                  setStatusDropdownOpen((prev) => !prev);
                  setPriorityDropdownOpen(false);
                }}
              >
                {statusFilter !== 'all' && (
                  <span
                    className="filter-clear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStatusFilter('all');
                    }}
                    title={lang === 'en' ? 'Clear filter' : 'إلغاء التصفية'}
                  >
                    <X size={12} />
                  </span>
                )}
                <span>{currentStatusLabel}</span>
                <ChevronDown size={14} />
              </button>

              {statusDropdownOpen && (
                <div className="filter-dropdown-menu">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`filter-menu-item ${statusFilter === opt.value ? 'active' : ''}`}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setStatusDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Priority Dropdown */}
            <div className="filter-dropdown-wrap" ref={priorityDropdownRef}>
              <button
                type="button"
                className="filter-btn"
                onClick={() => {
                  setPriorityDropdownOpen((prev) => !prev);
                  setStatusDropdownOpen(false);
                }}
              >
                {priorityFilter !== 'all' && (
                  <span
                    className="filter-clear-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPriorityFilter('all');
                    }}
                    title={lang === 'en' ? 'Clear filter' : 'إلغاء التصفية'}
                  >
                    <X size={12} />
                  </span>
                )}
                <span>{currentPriorityLabel}</span>
                <ChevronDown size={14} />
              </button>

              {priorityDropdownOpen && (
                <div className="filter-dropdown-menu">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`filter-menu-item ${priorityFilter === opt.value ? 'active' : ''}`}
                      onClick={() => {
                        setPriorityFilter(opt.value);
                        setPriorityDropdownOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. Date Picker Input */}
            <div className="filter-date-btn">
              <CalendarDays size={16} />
              <span>{dateFilter || (lang === 'en' ? 'dd/mm/yyyy' : 'dd/mm/yyyy')}</span>
            </div>
          </div>

          {/* Table Area */}
          <div className="operations-table-wrap">
            <table className="operations-table">
              <thead>
                <tr>
                  <th>{lang === 'en' ? 'Unit' : 'الوحدة'}</th>
                  <th>{lang === 'en' ? 'Service Type' : 'نوع الخدمة'}</th>
                  <th>{lang === 'en' ? 'Assignee' : 'المسؤول'}</th>
                  <th>{lang === 'en' ? 'Scheduled Time' : 'الوقت المجدول'}</th>
                  <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                  <th>{lang === 'en' ? 'Priority' : 'الأولوية'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 0 }}>
                      <div className="operations-empty-state">
                        <div className="empty-icon-wrap">
                          <PageIcon size={44} color="#94a3b8" />
                        </div>
                        <strong>
                          {lang === 'en' ? 'No requests in this section' : 'لا توجد طلبات في هذا القسم'}
                        </strong>
                        <p>
                          {lang === 'en'
                            ? 'You can create a new request from the button above'
                            : `يمكنك إنشاء أول ${config.noun} من الزر أعلى الصفحة`}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>
                      {/* Unit Column */}
                      <td>
                        <div className="table-unit-cell">
                          <div className="table-unit-thumb">
                            <img
                              src="/unit-thumbs/thumb-1.png"
                              alt={task.unit}
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>
                          <div className="table-unit-info">
                            <strong>{translateUnit(task.unit)}</strong>
                            <small>{translateProperty(task.property)}</small>
                          </div>
                        </div>
                      </td>

                      {/* Service Type Column */}
                      <td>
                        <strong>{translateTaskTitle(task.title)}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {task.id} · {translateSource(task.source)}
                        </div>
                      </td>

                      {/* Assignee Column */}
                      <td>
                        {task.assignee.name === 'غير معيّن' ? (
                          <span style={{ color: '#94a3b8' }}>-</span>
                        ) : (
                          <div className="table-assignee-cell">
                            <span className="table-assignee-avatar">
                              {task.assignee.name[0]}
                            </span>
                            <span>{task.assignee.name}</span>
                          </div>
                        )}
                      </td>

                      {/* Scheduled Time Column */}
                      <td>
                        <strong>{translateDate(task.schedule.date)}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {task.schedule.start} - {task.schedule.due}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td>
                        <span className={`table-chip ${task.statusTone || 'orange'}`}>
                          {translateStatus(task.status)}
                        </span>
                      </td>

                      {/* Priority Column */}
                      <td>
                        <span
                          className={`table-chip ${
                            task.priority === 'متوسط' || task.priority === 'متوسطة'
                              ? 'yellow'
                              : task.priorityTone || 'blue'
                          }`}
                        >
                          {translatePriority(task.priority)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {filteredTasks.length > 0 && (
            <footer className="operations-pagination-bar">
              <div className="pagination-right-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{lang === 'en' ? 'Items per page' : 'عدد العناصر في الصفحة'}</span>
                  <input type="text" className="page-size-input" value="15" readOnly />
                </div>
                <span>
                  {lang === 'en'
                    ? `Showing 1 - ${filteredTasks.length} of ${filteredTasks.length} requests`
                    : `عرض 1 - ${filteredTasks.length} من ${filteredTasks.length} طلب`}
                </span>
              </div>
              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-arrow-btn"
                  aria-label={lang === 'en' ? 'Previous page' : 'الصفحة السابقة'}
                >
                  {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
                <button type="button" className="pagination-num-btn active">
                  1
                </button>
                <button
                  type="button"
                  className="pagination-arrow-btn"
                  aria-label={lang === 'en' ? 'Next page' : 'الصفحة التالية'}
                >
                  {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                </button>
              </div>
            </footer>
          )}
        </section>
      </div>
    </div>
  );
}
