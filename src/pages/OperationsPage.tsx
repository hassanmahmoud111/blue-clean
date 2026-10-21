import { useState, useRef, useEffect, useMemo } from 'react';
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
import { Link, useSearchParams } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import type { OperationDetailRecord } from '../types/details';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchClientOperations,
  fetchClientOperationStats,
  type OperationStatsData,
} from '../services/workflowService';
import { fetchClientUnits, type ApiClientUnit } from '../services/unitService';
import {
  getLocalizedPropertyName,
  getLocalizedUnitName,
} from '../utils/unitTranslations';
import PublicLoadingScreen from '../components/PublicLoadingScreen';
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

  // View mode switcher: 'list' | 'calendar' synchronized with URL (?view=calendar)
  const [searchParams, setSearchParams] = useSearchParams();
  const viewParam = searchParams.get('view');
  const [view, setView] = useState<'list' | 'calendar'>(viewParam === 'calendar' ? 'calendar' : 'list');

  useEffect(() => {
    if (viewParam === 'calendar' || viewParam === 'list') {
      setView(viewParam);
    }
  }, [viewParam]);

  const handleViewChange = (newView: 'list' | 'calendar') => {
    setView(newView);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newView === 'calendar') {
        next.set('view', 'calendar');
      } else {
        next.delete('view');
      }
      return next;
    });
  };

  // Calendar states
  const [calendarMode, setCalendarMode] = useState<'day' | 'week' | 'month'>('week');
  const [calendarDate, setCalendarDate] = useState<Date>(() => new Date());
  const [selectedCalendarUnit, setSelectedCalendarUnit] = useState<string>('all');
  const [clientUnits, setClientUnits] = useState<ApiClientUnit[]>([]);

  useEffect(() => {
    fetchClientUnits()
      .then((res) => {
        if (res && res.length > 0) setClientUnits(res);
      })
      .catch(() => {});
  }, []);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const dateInputRef = useRef<HTMLInputElement>(null);

  const todayIso = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }, []);

  const formattedDateFilter = useMemo(() => {
    if (!dateFilter) return '';
    const parts = dateFilter.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateFilter;
  }, [dateFilter]);

  const handleOpenDatePicker = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.filter-date-clear')) return;
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        try {
          dateInputRef.current.showPicker();
          return;
        } catch {}
      }
      dateInputRef.current.focus();
    }
  };

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

  // Live tasks and stats loaded from real API
  const [tasks, setTasks] = useState<OperationDetailRecord[]>([]);
  const [stats, setStats] = useState<OperationStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      fetchClientOperations(kind),
      fetchClientOperationStats(kind),
    ])
      .then(([apiTasks, apiStats]) => {
        if (active) {
          setTasks(apiTasks || []);
          setStats(apiStats || null);
        }
      })
      .catch(() => {
        if (active) {
          setTasks([]);
          setStats(null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [kind]);

  // Dynamically compute popular units from real API tasks
  const popularUnits = useMemo(() => {
    const counts: Record<string, { unit: string; property: string; unitCode: string; count: number; thumb: string }> = {};
    for (const t of tasks) {
      if (!t.unit || t.unit === 'الوحدة') continue;
      const key = t.unitCode || t.unit;
      if (!counts[key]) {
        counts[key] = {
          unit: t.unit,
          property: t.property,
          unitCode: t.unitCode,
          count: 0,
          thumb: '/unit-thumbs/thumb-1.png',
        };
      }
      counts[key].count++;
    }
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [tasks]);

  // Dynamically compute recent activities from real API tasks
  const recentActivities = useMemo(() => {
    return tasks.slice(0, 5).map((t) => ({
      color: t.statusTone || 'blue',
      text: `تم تحديث طلب ${t.title} في ${t.unit}`,
      textEn: `Updated ${t.title} in ${getLocalizedUnitName(t.unit, t.unitCode, 'en')}`,
      time: t.schedule.date || (lang === 'en' ? 'Recently' : 'حديثاً'),
      timeEn: t.schedule.date || 'Recently',
    }));
  }, [tasks, lang]);

  // Units for calendar view
  const allAvailableUnits = useMemo(() => {
    const map = new Map<string, { code: string; name: string; property: string; thumb: string }>();
    for (const u of clientUnits) {
      const code = u.code || `UNT-${u.id}`;
      map.set(code, {
        code,
        name: u.name,
        property: u.property_name || u.name,
        thumb: u.image || '/unit-thumbs/thumb-1.png',
      });
    }
    for (const t of tasks) {
      if (t.unit && t.unit !== 'الوحدة') {
        const code = t.unitCode || t.unit;
        if (!map.has(code)) {
          map.set(code, {
            code,
            name: t.unit,
            property: t.property,
            thumb: '/unit-thumbs/thumb-1.png',
          });
        }
      }
    }
    return Array.from(map.values());
  }, [clientUnits, tasks]);

  const calendarDisplayUnits = useMemo(() => {
    if (selectedCalendarUnit === 'all') return allAvailableUnits;
    return allAvailableUnits.filter((u) => u.code === selectedCalendarUnit);
  }, [allAvailableUnits, selectedCalendarUnit]);

  // Calendar days header
  const daysHeader = useMemo(() => {
    const arWeekDays = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
    const enWeekDays = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (calendarMode === 'day') {
      const d = calendarDate;
      const dayIdx = (d.getDay() + 1) % 7;
      const isoDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return [
        {
          date: d.getDate(),
          day: lang === 'en' ? enWeekDays[dayIdx] : arWeekDays[dayIdx],
          isoDate,
          isToday: isoDate === todayIso,
        },
      ];
    }

    if (calendarMode === 'month') {
      const year = calendarDate.getFullYear();
      const month = calendarDate.getMonth();
      const totalDays = new Date(year, month + 1, 0).getDate();
      return Array.from({ length: totalDays }, (_, i) => {
        const d = new Date(year, month, i + 1);
        const dayIdx = (d.getDay() + 1) % 7;
        const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
        return {
          date: d.getDate(),
          day: lang === 'en' ? enWeekDays[dayIdx] : arWeekDays[dayIdx],
          isoDate,
          isToday: isoDate === todayIso,
        };
      });
    }

    // Default 'week' (from Saturday to Friday)
    const d = new Date(calendarDate);
    const dayOfWeek = (d.getDay() + 1) % 7;
    const startOfWeek = new Date(d);
    startOfWeek.setDate(d.getDate() - dayOfWeek);

    return Array.from({ length: 7 }, (_, i) => {
      const curr = new Date(startOfWeek);
      curr.setDate(startOfWeek.getDate() + i);
      const isoDate = `${curr.getFullYear()}-${String(curr.getMonth() + 1).padStart(2, '0')}-${String(curr.getDate()).padStart(2, '0')}`;
      return {
        date: curr.getDate(),
        day: lang === 'en' ? enWeekDays[i] : arWeekDays[i],
        isoDate,
        isToday: isoDate === todayIso,
      };
    });
  }, [calendarMode, calendarDate, lang]);

  const currentMonthTitle = useMemo(() => {
    const monthsAr = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const m = calendarDate.getMonth();
    const y = calendarDate.getFullYear();
    return lang === 'en' ? `${monthsEn[m]} ${y}` : `${monthsAr[m]} ${y}`;
  }, [calendarDate, lang]);

  const shiftCalendarDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCalendarDate(new Date());
      return;
    }
    setCalendarDate((prev) => {
      const next = new Date(prev);
      const sign = direction === 'next' ? 1 : -1;
      if (calendarMode === 'day') {
        next.setDate(next.getDate() + sign);
      } else if (calendarMode === 'week') {
        next.setDate(next.getDate() + sign * 7);
      } else {
        next.setMonth(next.getMonth() + sign);
      }
      return next;
    });
  };

  // Date filter matcher
  const matchesDateFilter = (schedDateStr: string, filterIso: string): boolean => {
    if (!filterIso) return true;
    if (!schedDateStr) return false;
    const s = schedDateStr.trim();
    if (s.includes(filterIso)) return true;

    const [y, m, d] = filterIso.split('-');
    if (!y || !m || !d) return false;

    const dayNum = parseInt(d, 10);
    const monthNum = parseInt(m, 10);

    const slashDate = `${d}/${m}/${y}`;
    const slashDateShort = `${dayNum}/${monthNum}/${y}`;
    if (s.includes(slashDate) || s.includes(slashDateShort)) return true;

    const arabicMonths = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const englishMonths = [
      'jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
    ];

    const arMonth = arabicMonths[monthNum - 1];
    const enMonth = englishMonths[monthNum - 1];

    const tokens = s.toLowerCase().split(/[\s,./-]+/);
    const hasDay = tokens.some((tok) => tok === String(dayNum) || tok === d);

    if (arMonth && s.includes(arMonth) && hasDay) {
      if (s.includes(y) || !tokens.some((tok) => /^\d{4}$/.test(tok))) return true;
    }
    if (enMonth && s.toLowerCase().includes(enMonth) && hasDay) {
      if (s.includes(y) || !tokens.some((tok) => /^\d{4}$/.test(tok))) return true;
    }

    const parsed = Date.parse(s);
    if (!isNaN(parsed)) {
      const pd = new Date(parsed);
      const pIso = `${pd.getFullYear()}-${String(pd.getMonth() + 1).padStart(2, '0')}-${String(pd.getDate()).padStart(2, '0')}`;
      if (pIso === filterIso) return true;
    }

    return false;
  };

  type CanonicalStatus = 'pending' | 'scheduled' | 'in_progress' | 'in_review' | 'completed' | 'cancelled';
  type CanonicalPriority = 'urgent' | 'high' | 'medium' | 'normal';

  const getCanonicalStatusKey = (s?: string): CanonicalStatus | 'other' => {
    if (!s) return 'other';
    const norm = s.trim().toLowerCase();
    if (
      norm === 'بانتظار التعيين' ||
      norm === 'في انتظار التعيين' ||
      norm === 'pending_assignment' ||
      norm === 'pending' ||
      norm.includes('انتظار')
    ) {
      return 'pending';
    }
    if (
      norm === 'مجدول' ||
      norm === 'تم إسناد العامل' ||
      norm === 'تم اسناد العامل' ||
      norm === 'assigned' ||
      norm === 'scheduled' ||
      norm.includes('إسناد') ||
      norm.includes('اسناد')
    ) {
      return 'scheduled';
    }
    if (
      norm === 'قيد التنفيذ' ||
      norm === 'قيد الإصلاح والتنفيذ' ||
      norm === 'قيد الاصلاح والتنفيذ' ||
      norm === 'in_progress' ||
      norm.includes('تنفيذ')
    ) {
      return 'in_progress';
    }
    if (
      norm === 'قيد المراجعة' ||
      norm === 'in_review' ||
      norm.includes('مراجعة')
    ) {
      return 'in_review';
    }
    if (
      norm === 'مكتملة' ||
      norm === 'مكتمل' ||
      norm === 'completed' ||
      norm.includes('مكتمل')
    ) {
      return 'completed';
    }
    if (
      norm === 'ملغاة' ||
      norm === 'ملغي' ||
      norm === 'cancelled' ||
      norm === 'canceled'
    ) {
      return 'cancelled';
    }
    return 'other';
  };

  const getCanonicalPriorityKey = (p?: string): CanonicalPriority | 'other' => {
    if (!p) return 'other';
    const norm = p.trim().toLowerCase();
    if (norm === 'عاجل' || norm === 'عاجلة' || norm === 'urgent') return 'urgent';
    if (norm === 'عال' || norm === 'عالي' || norm === 'عالية' || norm === 'high') return 'high';
    if (norm === 'متوسط' || norm === 'متوسطة' || norm === 'medium') return 'medium';
    if (norm === 'عادي' || norm === 'عادية' || norm === 'منخفض' || norm === 'منخفضة' || norm === 'normal' || norm === 'low') return 'normal';
    return 'other';
  };

  const matchesStatusFilter = (taskStatus: string, filter: string): boolean => {
    if (!filter || filter === 'all') return true;
    const taskCanon = getCanonicalStatusKey(taskStatus);
    const filterCanon = getCanonicalStatusKey(filter);
    if (filterCanon !== 'other') {
      return taskCanon === filterCanon;
    }
    return taskStatus.trim().toLowerCase() === filter.trim().toLowerCase();
  };

  const matchesPriorityFilter = (taskPriority: string, filter: string): boolean => {
    if (!filter || filter === 'all') return true;
    const taskCanon = getCanonicalPriorityKey(taskPriority);
    const filterCanon = getCanonicalPriorityKey(filter);
    if (filterCanon !== 'other') {
      return taskCanon === filterCanon;
    }
    return taskPriority.trim().toLowerCase() === filter.trim().toLowerCase();
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (!matchesStatusFilter(task.status, statusFilter)) return false;
    if (!matchesPriorityFilter(task.priority, priorityFilter)) return false;
    if (dateFilter) {
      const schedDate = task.schedule?.date || '';
      if (!matchesDateFilter(schedDate, dateFilter)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const unit = (task.unit || '').toLowerCase();
      const unitCode = (task.unitCode || '').toLowerCase();
      const prop = (task.property || '').toLowerCase();
      const title = (task.title || '').toLowerCase();
      const id = (task.id || '').toLowerCase();
      const assignee = (task.assignee?.name || '').toLowerCase();
      if (
        !unit.includes(q) &&
        !unitCode.includes(q) &&
        !prop.includes(q) &&
        !title.includes(q) &&
        !id.includes(q) &&
        !assignee.includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const countByStatus = (status: string) => {
    const key = getCanonicalStatusKey(status);
    if (stats) {
      if (key === 'pending' && typeof stats.pending_assignment === 'number') return stats.pending_assignment;
      if (key === 'in_progress' && typeof stats.in_progress === 'number') return stats.in_progress;
      if (key === 'in_review' && typeof stats.in_review === 'number') return stats.in_review;
      if (key === 'completed' && typeof stats.completed === 'number') return stats.completed;
    }
    return tasks.filter((task) => getCanonicalStatusKey(task.status) === key).length;
  };

  const statusOptions = [
    { value: 'all', label: lang === 'en' ? 'All Statuses' : 'جميع الحالات' },
    { value: 'pending', label: lang === 'en' ? 'Pending Assignment' : 'في انتظار التعيين' },
    { value: 'scheduled', label: lang === 'en' ? 'Worker Assigned' : 'تم إسناد العامل' },
    { value: 'in_progress', label: lang === 'en' ? 'In Progress' : 'قيد التنفيذ' },
    { value: 'in_review', label: lang === 'en' ? 'In Review' : 'قيد المراجعة' },
    { value: 'completed', label: lang === 'en' ? 'Completed' : 'مكتملة' },
  ];

  const priorityOptions = [
    { value: 'all', label: lang === 'en' ? 'All Priorities' : 'كل الأولويات' },
    { value: 'urgent', label: lang === 'en' ? 'Urgent' : 'عاجلة' },
    { value: 'high', label: lang === 'en' ? 'High' : 'عالية' },
    { value: 'medium', label: lang === 'en' ? 'Medium' : 'متوسطة' },
    { value: 'normal', label: lang === 'en' ? 'Normal' : 'عادية' },
  ];

  const translateStatus = (s: string) => {
    const canon = getCanonicalStatusKey(s);
    if (lang === 'en') {
      switch (canon) {
        case 'pending': return 'Pending Assignment';
        case 'scheduled': return 'Worker Assigned';
        case 'in_progress': return 'In Progress';
        case 'in_review': return 'In Review';
        case 'completed': return 'Completed';
        case 'cancelled': return 'Cancelled';
        default: return s;
      }
    }
    switch (canon) {
      case 'pending': return 'في انتظار التعيين';
      case 'scheduled': return 'تم إسناد العامل';
      case 'in_progress': return 'قيد التنفيذ';
      case 'in_review': return 'قيد المراجعة';
      case 'completed': return 'مكتملة';
      case 'cancelled': return 'ملغاة';
      default: return s;
    }
  };

  const translatePriority = (p: string) => {
    const canon = getCanonicalPriorityKey(p);
    if (lang === 'en') {
      switch (canon) {
        case 'urgent': return 'Urgent';
        case 'high': return 'High';
        case 'medium': return 'Medium';
        case 'normal': return 'Normal';
        default: return p;
      }
    }
    switch (canon) {
      case 'urgent': return 'عاجلة';
      case 'high': return 'عالية';
      case 'medium': return 'متوسطة';
      case 'normal': return 'عادية';
      default: return p;
    }
  };

  const currentStatusLabel =
    statusOptions.find((opt) => opt.value === statusFilter)?.label ||
    (statusFilter !== 'all' ? translateStatus(statusFilter) : (lang === 'en' ? 'All Statuses' : 'جميع الحالات'));

  const currentPriorityLabel =
    priorityOptions.find((opt) => opt.value === priorityFilter)?.label ||
    (priorityFilter !== 'all' ? translatePriority(priorityFilter) : (lang === 'en' ? 'All Priorities' : 'كل الأولويات'));

  const translateTaskTitle = (t: string) => {
    if (lang !== 'en') return t;
    switch (t) {
      case 'تجهيز ضيافة إضافية': return 'Extra Hospitality Setup';
      case 'تعقيم': return 'Sanitization';
      case 'غسيل كنب': return 'Sofa Washing';
      case 'تنظيف دوري': return 'Periodic Cleaning';
      case 'تنظيف بعد المغادرة': return 'Turnover Cleaning';
      case 'صيانة سباكة': return 'Plumbing Maintenance';
      case 'صيانة مكيف': return 'AC Maintenance';
      default: return t;
    }
  };

  const translateSource = (s: string) => {
    if (lang !== 'en') return s;
    if (s === 'طلب داخلي' || s === 'internal_request') return 'Internal Request';
    if (s === 'guest_request' || s === 'طلب ضيف') return 'Guest Request';
    if (s === 'manual' || s === 'يدوي') return 'Manual';
    if (s === 'reservation' || s === 'مرتبط بحجز') return 'Linked to Reservation';
    return s;
  };

  const translateUnit = (u: string, code?: string) => {
    return getLocalizedUnitName(u, code, lang);
  };

  const translateProperty = (p: string, code?: string) => {
    return getLocalizedPropertyName(p, code, lang);
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

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div
      className={`operations-page-container operation-category-${kind} ${isRTL ? 'rtl' : 'ltr'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
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
              className={`operations-view-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => handleViewChange('calendar')}
            >
              <CalendarDays size={16} />
              <span>{lang === 'en' ? 'Calendar' : 'التقويم'}</span>
            </button>
            <button
              type="button"
              className={`operations-view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => handleViewChange('list')}
            >
              <List size={16} />
              <span>{lang === 'en' ? 'List' : 'القائمة'}</span>
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
        <div
          className={`operation-stat-card ${statusFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter((prev) => (prev === 'pending' ? 'all' : 'pending'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStatusFilter((prev) => (prev === 'pending' ? 'all' : 'pending'));
            }
          }}
          title={lang === 'en' ? 'Filter by Pending Assignment' : 'تصفية حسب في انتظار التعيين'}
        >
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('pending')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'Pending Assignment' : 'في انتظار التعيين'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Clock3 size={20} />
          </div>
        </div>

        {/* 2. In Progress */}
        <div
          className={`operation-stat-card ${statusFilter === 'in_progress' ? 'active' : ''}`}
          onClick={() => setStatusFilter((prev) => (prev === 'in_progress' ? 'all' : 'in_progress'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStatusFilter((prev) => (prev === 'in_progress' ? 'all' : 'in_progress'));
            }
          }}
          title={lang === 'en' ? 'Filter by In Progress' : 'تصفية حسب قيد التنفيذ'}
        >
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('in_progress')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'In Progress' : 'قيد التنفيذ'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Clock3 size={20} />
          </div>
        </div>

        {/* 3. In Review */}
        <div
          className={`operation-stat-card ${statusFilter === 'in_review' ? 'active' : ''}`}
          onClick={() => setStatusFilter((prev) => (prev === 'in_review' ? 'all' : 'in_review'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStatusFilter((prev) => (prev === 'in_review' ? 'all' : 'in_review'));
            }
          }}
          title={lang === 'en' ? 'Filter by In Review' : 'تصفية حسب قيد المراجعة'}
        >
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('in_review')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'In Review' : 'قيد المراجعة'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <Eye size={20} />
          </div>
        </div>

        {/* 4. Completed */}
        <div
          className={`operation-stat-card ${statusFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter((prev) => (prev === 'completed' ? 'all' : 'completed'))}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStatusFilter((prev) => (prev === 'completed' ? 'all' : 'completed'));
            }
          }}
          title={lang === 'en' ? 'Filter by Completed' : 'تصفية حسب مكتملة'}
        >
          <div className="operation-stat-info">
            <strong className="operation-stat-value">{countByStatus('completed')}</strong>
            <span className="operation-stat-label">
              {lang === 'en' ? 'Completed' : 'مكتملة'}
            </span>
          </div>
          <div className="operation-stat-icon-wrap">
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* 5. Total Requests */}
        <div
          className={`operation-stat-card ${statusFilter === 'all' ? 'active' : ''}`}
          onClick={() => setStatusFilter('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStatusFilter('all');
            }
          }}
          title={lang === 'en' ? 'Show all requests' : 'عرض كل الطلبات'}
        >
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
                {lang === 'en'
                  ? `${popularUnits.length} ${popularUnits.length === 1 ? 'unit' : 'units'}`
                  : `${popularUnits.length} وحدات`}
              </span>
            </div>
            {popularUnits.length > 0 ? (
              <div className="popular-units-list">
                {popularUnits.map((u, i) => (
                  <Link key={i} to={`/app/units/${u.unitCode || ''}`} className="popular-unit-row">
                    <div className="popular-unit-info">
                      <div className="popular-unit-thumb">
                        <img src={u.thumb} alt={u.unit} />
                      </div>
                      <div className="popular-unit-details">
                        <strong>{getLocalizedUnitName(u.unit, u.unitCode, lang)}</strong>
                        <small>{getLocalizedPropertyName(u.property, u.unitCode, lang)}</small>
                      </div>
                    </div>
                    <span className="popular-unit-count">
                      {lang === 'en' ? `${u.count} ${u.count === 1 ? 'request' : 'requests'}` : `${u.count} طلبات`}
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
            {recentActivities.length > 0 ? (
              <div className="activities-list">
                {recentActivities.map((act, i) => (
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

        {/* Left Column: Calendar View OR Main Table Panel */}
        {view === 'calendar' ? (
          <section className="calendar-card">
            {/* Calendar Toolbar */}
            <div className="calendar-toolbar">
              <div className="calendar-nav-controls">
                <div className="calendar-unit-select-wrap">
                  <ChevronDown size={14} className="calendar-unit-select-icon" />
                  <select
                    className="calendar-unit-select"
                    value={selectedCalendarUnit}
                    onChange={(e) => setSelectedCalendarUnit(e.target.value)}
                    aria-label={lang === 'en' ? 'Filter by unit' : 'تصفية حسب الوحدة'}
                  >
                    <option value="all">{lang === 'en' ? 'All Units' : 'جميع الوحدات'}</option>
                    {allAvailableUnits.map((u) => (
                      <option key={u.code} value={u.code}>
                        {getLocalizedUnitName(u.name, u.code, lang)}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={() => shiftCalendarDate('today')}
                >
                  {lang === 'en' ? 'Today' : 'اليوم'}
                </button>

                <div className="calendar-date-nav-pill">
                  <button
                    type="button"
                    className="calendar-date-nav-btn"
                    aria-label={lang === 'en' ? 'Previous' : 'السابق'}
                    onClick={() => shiftCalendarDate('prev')}
                  >
                    {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                  </button>

                  <span className="calendar-month-title">{currentMonthTitle}</span>

                  <button
                    type="button"
                    className="calendar-date-nav-btn"
                    aria-label={lang === 'en' ? 'Next' : 'التالي'}
                    onClick={() => shiftCalendarDate('next')}
                  >
                    {isRTL ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                  </button>
                </div>
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
                        style={{ width: 'calc((100% - 220px) / 7)' }}
                      >
                        <div className="cal-th-day-name">{d.day}</div>
                        {d.isToday ? (
                          <span className="today-num-badge">{d.date}</span>
                        ) : (
                          <div className="cal-th-day-num">{d.date}</div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calendarDisplayUnits.length === 0 ? (
                    <tr>
                      <td className="calendar-empty-unit-cell">
                        {lang === 'en' ? 'No units available' : 'لا توجد وحدات متاحة'}
                      </td>
                      {daysHeader.map((d) => (
                        <td
                          key={d.isoDate}
                          className={`calendar-empty-day-cell ${d.isToday ? 'today-cell' : ''}`}
                        />
                      ))}
                    </tr>
                  ) : (
                    calendarDisplayUnits.map((unit) => (
                      <tr key={unit.code}>
                        <td>
                          <div className="cal-unit-cell">
                            <div className="cal-unit-thumb">
                              <img
                                src={unit.thumb || '/unit-thumbs/thumb-1.png'}
                                alt={unit.name}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                            <div className="cal-unit-info">
                              <Link
                                to={`/app/units/${unit.code}`}
                                className="cal-unit-title"
                              >
                                {getLocalizedUnitName(unit.name, unit.code, lang)}
                              </Link>
                              <span className="cal-unit-prop">
                                {getLocalizedPropertyName(unit.property, unit.code, lang)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {daysHeader.map((d) => {
                          const dayTasks = filteredTasks.filter((t) => {
                            const unitMatches =
                              t.unitCode === unit.code ||
                              t.unit === unit.name;
                            if (!unitMatches) return false;
                            const schedDate = t.schedule.date || '';
                            return (
                              schedDate.includes(d.isoDate) ||
                              schedDate.includes(`${d.date} `) ||
                              schedDate === String(d.date)
                            );
                          });

                          return (
                            <td key={d.isoDate} className={d.isToday ? 'today-cell' : ''}>
                              {dayTasks.map((task) => (
                                <Link
                                  key={task.id}
                                  to={`/app/operations/${config.route}/${task.id}`}
                                  className={`operation-cal-pill ${task.statusTone || 'blue'}`}
                                  title={`${task.title} - ${task.id}`}
                                >
                                  <span className="cal-pill-dot" />
                                  <span className="cal-pill-title">{translateTaskTitle(task.title)}</span>
                                </Link>
                              ))}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Legend */}
            <footer className="calendar-legend-bar">
              <div className="legend-item">
                <span className="legend-ring orange" />
                <span>{lang === 'en' ? 'Pending Assignment' : 'بانتظار التعيين'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring blue" />
                <span>{lang === 'en' ? 'In Progress' : 'قيد التنفيذ'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring purple" />
                <span>{lang === 'en' ? 'In Review' : 'قيد المراجعة'}</span>
              </div>
              <div className="legend-item">
                <span className="legend-ring green" />
                <span>{lang === 'en' ? 'Completed' : 'مكتملة'}</span>
              </div>
            </footer>
          </section>
        ) : (
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
            <div
              className={`filter-date-btn ${dateFilter ? 'has-value' : ''}`}
              onClick={handleOpenDatePicker}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleOpenDatePicker(e as unknown as React.MouseEvent);
                }
              }}
              title={lang === 'en' ? 'Filter by date' : 'تصفية حسب التاريخ'}
            >
              <CalendarDays size={16} />
              <span>{formattedDateFilter || 'dd/mm/yyyy'}</span>
              <input
                ref={dateInputRef}
                type="date"
                min={todayIso}
                value={dateFilter}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && val < todayIso) return;
                  setDateFilter(val);
                  if (val) {
                    const [y, m, d] = val.split('-').map(Number);
                    if (y && m && d) setCalendarDate(new Date(y, m - 1, d));
                  }
                }}
                className="filter-date-native-input"
                tabIndex={-1}
                aria-label={lang === 'en' ? 'Select date' : 'اختر التاريخ'}
              />
              {dateFilter && (
                <button
                  type="button"
                  className="filter-date-clear"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDateFilter('');
                  }}
                  aria-label={lang === 'en' ? 'Clear date' : 'مسح التاريخ'}
                  title={lang === 'en' ? 'Clear date' : 'مسح التاريخ'}
                >
                  <X size={12} />
                </button>
              )}
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
                          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || dateFilter
                            ? (lang === 'en' ? 'No matching tasks found' : 'لا توجد مهام تطابق خيارات التصفية')
                            : (lang === 'en' ? 'No requests in this section' : 'لا توجد طلبات في هذا القسم')}
                        </strong>
                        <p>
                          {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || dateFilter
                            ? (lang === 'en'
                                ? 'Try clearing or adjusting search, status, priority, or date filters.'
                                : 'جرّب تعديل أو مسح خيارات البحث أو التاريخ أو الحالة.')
                            : (lang === 'en'
                                ? 'You can create a new request from the button above'
                                : `يمكنك إنشاء أول ${config.noun} من الزر أعلى الصفحة`)}
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
                            <Link
                              to={`/app/units/${task.unitCode || ''}`}
                              style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                              <strong>{translateUnit(task.unit, task.unitCode)}</strong>
                            </Link>
                            <small>{translateProperty(task.property, task.unitCode)}</small>
                          </div>
                        </div>
                      </td>

                      {/* Service Type Column */}
                      <td>
                        <Link
                          to={`/app/operations/${config.route}/${task.id}`}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <strong>{translateTaskTitle(task.title)}</strong>
                        </Link>
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
      )}
    </div>
  </div>
);
}
