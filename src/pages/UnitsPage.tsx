import { useState, useRef, useEffect } from 'react';
import {
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  DoorClosed,
  Download,
  Eye,
  Grid2X2,
  Home,
  List,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { fetchClientUnits } from '../services/unitService';
import PublicLoadingScreen from '../components/PublicLoadingScreen';
import './units-page.css';

interface UnitRowData {
  id: string;
  code: string;
  name: string;
  type: string;
  property: string;
  location: string;
  status: 'draft' | 'inactive' | 'ready';
  statusLabel: string;
  capacity: {
    guests: number;
    rooms: number;
    beds: number;
    baths: number;
  };
  checkOut: string;
  checkIn: string;
  platform: 'airbnb' | 'booking' | 'direct' | 'gathern';
  platformLetter: 'A' | 'B' | 'D' | 'G';
  thumbSrc?: string;
  thumbPlaceholder?: 'building' | 'chalet';
}

const initialUnits: UnitRowData[] = [
  {
    id: 'UNT-YMFCHL',
    code: 'UNT-YMFCHL',
    name: 'شقة الرمال الفاخرة - برج 4 (نسخة)',
    type: 'شقة',
    property: 'أبراج الرمال السكنية',
    location: 'الرياض - العليا',
    status: 'draft',
    statusLabel: 'مسودة',
    capacity: { guests: 4, rooms: 2, beds: 3, baths: 2 },
    checkOut: '11:00',
    checkIn: '15:00',
    platform: 'airbnb',
    platformLetter: 'A',
    thumbSrc: '/unit-thumbs/thumb-1.png',
  },
  {
    id: 'UNT-Q4HSI8',
    code: 'UNT-Q4HSI8',
    name: 'فيلا النرجس VIP مسبح خاص (نسخة)',
    type: 'فيلا',
    property: 'كمباوند النرجس ريزيدنس',
    location: 'الرياض - النرجس',
    status: 'draft',
    statusLabel: 'مسودة',
    capacity: { guests: 8, rooms: 4, beds: 6, baths: 4 },
    checkOut: '12:00',
    checkIn: '16:00',
    platform: 'booking',
    platformLetter: 'B',
    thumbSrc: '/unit-thumbs/thumb-2.png',
  },
  {
    id: 'UNT-105',
    code: 'UNT-105',
    name: 'شقة العليا 102 - صيانة دورية',
    type: 'شقة',
    property: 'عمارة العليا 12',
    location: 'الرياض - العليا',
    status: 'inactive',
    statusLabel: 'غير نشطة',
    capacity: { guests: 3, rooms: 1, beds: 2, baths: 1 },
    checkOut: '11:00',
    checkIn: '15:00',
    platform: 'direct',
    platformLetter: 'D',
    thumbSrc: '/unit-thumbs/thumb-3.png',
    thumbPlaceholder: 'building',
  },
  {
    id: 'UNT-104',
    code: 'UNT-104',
    name: 'شاليه اليمامة للعائلات',
    type: 'شاليه',
    property: 'منتجع اليمامة',
    location: 'الرياض - العليا',
    status: 'draft',
    statusLabel: 'مسودة',
    capacity: { guests: 10, rooms: 3, beds: 5, baths: 3 },
    checkOut: '11:00',
    checkIn: '15:00',
    platform: 'direct',
    platformLetter: 'D',
    thumbSrc: '/unit-thumbs/thumb-4.png',
    thumbPlaceholder: 'chalet',
  },
  {
    id: 'UNT-103',
    code: 'UNT-103',
    name: 'استوديو الكورنيش بإطلالة بحرية',
    type: 'استوديو',
    property: 'أبراج الشاطئ',
    location: 'جدة - الشاطئ',
    status: 'ready',
    statusLabel: 'جاهزة للضيف',
    capacity: { guests: 2, rooms: 1, beds: 1, baths: 1 },
    checkOut: '11:00',
    checkIn: '14:00',
    platform: 'gathern',
    platformLetter: 'G',
    thumbSrc: '/unit-thumbs/thumb-5.png',
  },
  {
    id: 'UNT-102',
    code: 'UNT-102',
    name: 'فيلا النرجس VIP مسبح خاص',
    type: 'فيلا',
    property: 'كمباوند النرجس ريزيدنس',
    location: 'الرياض - النرجس',
    status: 'ready',
    statusLabel: 'جاهزة للضيف',
    capacity: { guests: 8, rooms: 4, beds: 6, baths: 4 },
    checkOut: '12:00',
    checkIn: '16:00',
    platform: 'booking',
    platformLetter: 'B',
    thumbSrc: '/unit-thumbs/thumb-6.png',
  },
  {
    id: 'UNT-101',
    code: 'UNT-101',
    name: 'شقة الرمال الفاخرة - برج 4',
    type: 'شقة',
    property: 'أبراج الرمال السكنية',
    location: 'الرياض - العليا',
    status: 'ready',
    statusLabel: 'جاهزة للضيف',
    capacity: { guests: 4, rooms: 2, beds: 3, baths: 2 },
    checkOut: '11:00',
    checkIn: '15:00',
    platform: 'airbnb',
    platformLetter: 'A',
    thumbSrc: '/unit-thumbs/thumb-7.png',
  },
];


const cityOptions = [
  'جميع المدن',
  'fdrgtbr',
  'أبوظبي',
  'الخبر',
  'الدمام',
  'الرياض',
  'جدة',
  'دبي',
  'شسشسس',
  'مكة المكرمة',
];

const typeOptions = [
  'جميع الأنواع',
  'شقة',
  'شقة فندقية',
  'فيلا',
  'استوديو',
  'تاون هاوس',
  'شاليه',
  'مكتب',
  'أخرى',
];

const statusOptions = [
  'جميع الحالات',
  'جاهزة للضيف',
  'مسودة',
  'غير نشطة',
];

interface FilterDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

function FilterDropdown({
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  onClose,
}: FilterDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="custom-filter-dropdown" ref={dropdownRef}>
      <button
        className={`custom-filter-trigger ${isOpen ? 'open' : ''}`}
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="custom-filter-trigger-text">{value}</span>
        <ChevronDown size={14} className="custom-filter-chevron" />
      </button>

      {isOpen && (
        <div className="custom-filter-menu" role="listbox">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              className={`custom-filter-item ${option === value ? 'active' : ''}`}
              onClick={() => {
                onChange(option);
                onClose();
              }}
              role="option"
              aria-selected={option === value}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnitsPage() {
  const { lang, isRTL, t } = useLanguage();

  const allStatusesLabel = lang === 'en' ? 'All Statuses' : 'جميع الحالات';
  const allTypesLabel = lang === 'en' ? 'All Types' : 'جميع الأنواع';
  const allCitiesLabel = lang === 'en' ? 'All Cities' : 'جميع المدن';

  const localizedStatusOptions = [
    allStatusesLabel,
    lang === 'en' ? 'Guest Ready' : 'جاهزة للضيف',
    lang === 'en' ? 'Draft' : 'مسودة',
    lang === 'en' ? 'Inactive' : 'غير نشطة',
  ];

  const localizedTypeOptions = [
    allTypesLabel,
    lang === 'en' ? 'Apartment' : 'شقة',
    lang === 'en' ? 'Hotel Apartment' : 'شقة فندقية',
    lang === 'en' ? 'Villa' : 'فيلا',
    lang === 'en' ? 'Studio' : 'استوديو',
    lang === 'en' ? 'Townhouse' : 'تاون هاوس',
    lang === 'en' ? 'Chalet' : 'شاليه',
    lang === 'en' ? 'Office' : 'مكتب',
    lang === 'en' ? 'Other' : 'أخرى',
  ];

  const localizedCityOptions = [
    allCitiesLabel,
    lang === 'en' ? 'Riyadh' : 'الرياض',
    lang === 'en' ? 'Jeddah' : 'جدة',
    lang === 'en' ? 'Dammam' : 'الدمام',
    lang === 'en' ? 'Al Khobar' : 'الخبر',
    lang === 'en' ? 'Makkah' : 'مكة المكرمة',
    lang === 'en' ? 'Dubai' : 'دبي',
    lang === 'en' ? 'Abu Dhabi' : 'أبوظبي',
  ];

  const [unitsList, setUnitsList] = useState<UnitRowData[]>(initialUnits);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [selectedStatus, setSelectedStatus] = useState<string>(allStatusesLabel);
  const [selectedType, setSelectedType] = useState<string>(allTypesLabel);
  const [selectedCity, setSelectedCity] = useState<string>(allCitiesLabel);
  const [activeDropdown, setActiveDropdown] = useState<'status' | 'type' | 'city' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchClientUnits().then((apiUnits) => {
      if (active && apiUnits && apiUnits.length > 0) {
        const mapped: UnitRowData[] = apiUnits.map((u, idx) => {
          const fallbackThumb = initialUnits[idx % initialUnits.length]?.thumbSrc || '/unit-thumbs/thumb-1.png';
          const connected = u.platforms?.connected_platforms?.find((p) => p.is_connected)?.platform;
          const platform: UnitRowData['platform'] =
            connected === 'airbnb'
              ? 'airbnb'
              : connected === 'booking'
                ? 'booking'
                : connected === 'gathern'
                  ? 'gathern'
                  : initialUnits[idx % initialUnits.length]?.platform || 'direct';
          const platformLetter: UnitRowData['platformLetter'] =
            platform === 'airbnb'
              ? 'A'
              : platform === 'booking'
                ? 'B'
                : platform === 'gathern'
                  ? 'G'
                  : 'D';
          const normalizedStatus: UnitRowData['status'] =
            u.status === 'ready' || u.status === 'active'
              ? 'ready'
              : u.status === 'inactive' || u.status === 'maintenance'
                ? 'inactive'
                : 'draft';
          const cityAr = u.city?.name_ar || 'الرياض';
          const areaAr = u.area?.name_ar || 'العليا';
          return {
            id: u.code || String(u.id),
            code: u.code || `UNT-${u.id}`,
            name: u.name,
            type: u.unit_type_label || 'شقة',
            property: u.property_name || 'عقار',
            location: `${cityAr} - ${areaAr}`,
            status: normalizedStatus,
            statusLabel: u.status_label || (normalizedStatus === 'ready' ? 'جاهزة للضيف' : normalizedStatus === 'inactive' ? 'غير نشطة' : 'مسودة'),
            capacity: {
              guests: u.capacity?.guests_count ?? 4,
              rooms: u.capacity?.bedrooms_count ?? 2,
              beds: u.capacity?.beds_count ?? 2,
              baths: u.capacity?.bathrooms_count ?? 1,
            },
            checkOut: u.check_out_time || '11:00',
            checkIn: u.check_in_time || '15:00',
            platform,
            platformLetter,
            thumbSrc: u.image || fallbackThumb,
          };
        });
        setUnitsList(mapped);
      }
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const getUnitStatusLabel = (status: string) => {
    if (lang === 'en') {
      switch (status) {
        case 'ready': return 'Guest Ready';
        case 'draft': return 'Draft';
        case 'inactive': return 'Inactive';
        default: return status;
      }
    }
    switch (status) {
      case 'ready': return 'جاهزة للضيف';
      case 'draft': return 'مسودة';
      case 'inactive': return 'غير نشطة';
      default: return status;
    }
  };

  const getUnitTypeName = (type: string) => {
    if (lang === 'en') {
      switch (type) {
        case 'شقة': return 'Apartment';
        case 'فيلا': return 'Villa';
        case 'استوديو': return 'Studio';
        case 'شاليه': return 'Chalet';
        default: return type;
      }
    }
    return type;
  };

  const filteredUnits = unitsList.filter((unit) => {
    const matchesSearch =
      unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unit.property.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === allStatusesLabel ||
      unit.statusLabel === selectedStatus ||
      getUnitStatusLabel(unit.status) === selectedStatus;

    const matchesType =
      selectedType === allTypesLabel ||
      unit.type === selectedType ||
      getUnitTypeName(unit.type) === selectedType;

    const matchesCity =
      selectedCity === allCitiesLabel || unit.location.includes(selectedCity);

    return matchesSearch && matchesStatus && matchesType && matchesCity;
  });


  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredUnits.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredUnits.map((u) => u.id));
    }
  };

  if (loading) {
    return <PublicLoadingScreen />;
  }

  return (
    <div className="units-page-container">
      {/* Header */}
      <header className="units-header">
        <div className="units-header-info">
          <div className="units-breadcrumb">
            <span>{t('nav.dashboard')}</span>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.units')}</span>
          </div>
          <div className="units-title-row">
            <h1>{lang === 'en' ? 'Units' : 'الوحدات'}</h1>
            <span className="units-title-badge" aria-hidden="true">
              <Building2 size={20} />
            </span>
          </div>
          <p>
            {lang === 'en'
              ? 'Manage all your properties and units in one place'
              : 'إدارة جميع عقاراتك ووحداتك في مكان واحد'}
          </p>
        </div>

        <div className="units-header-actions">
          <Link className="btn-add-unit" to="/app/new/unit">
            <Plus size={18} />
            <span>{lang === 'en' ? 'Add New Unit' : 'إضافة وحدة جديدة'}</span>
          </Link>
          <button className="btn-export" type="button">
            <Download size={17} />
            <span>{lang === 'en' ? 'Export' : 'تصدير'}</span>
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="units-stats-grid">
        <div className="unit-stat-card">
          <div className="stat-info">
            <span className="stat-label">{lang === 'en' ? 'Total Units' : 'إجمالي الوحدات'}</span>
            <strong className="stat-value">{unitsList.length}</strong>
          </div>
          <div className="stat-icon-wrap cyan">
            <Building2 size={24} />
          </div>
        </div>

        <div className="unit-stat-card">
          <div className="stat-info">
            <span className="stat-label">{lang === 'en' ? 'Guest Ready' : 'جاهزة للضيف'}</span>
            <strong className="stat-value">{unitsList.filter((u) => u.status === 'ready').length}</strong>
          </div>
          <div className="stat-icon-wrap green">
            <BedDouble size={24} />
          </div>
        </div>

        <div className="unit-stat-card">
          <div className="stat-info">
            <span className="stat-label">{lang === 'en' ? 'Draft' : 'مسودة'}</span>
            <strong className="stat-value">{unitsList.filter((u) => u.status === 'draft').length}</strong>
          </div>
          <div className="stat-icon-wrap orange">
            <Wrench size={24} />
          </div>
        </div>

        <div className="unit-stat-card">
          <div className="stat-info">
            <span className="stat-label">{lang === 'en' ? 'Inactive' : 'غير نشطة'}</span>
            <strong className="stat-value">{unitsList.filter((u) => u.status === 'inactive').length}</strong>
          </div>
          <div className="stat-icon-wrap red">
            <ShieldAlert size={24} />
          </div>
        </div>
      </section>

      {/* Toolbar / Filters */}
      <section className="units-toolbar-card">
        <div className="toolbar-filters-group">
          <div className="units-search-input-wrap">
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search by unit, code, or property...' : 'ابحث عن وحدة أو كود أو عقار...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="search-icon" />
          </div>

          <FilterDropdown
            value={selectedStatus}
            options={localizedStatusOptions}
            onChange={(val) => setSelectedStatus(val)}
            isOpen={activeDropdown === 'status'}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === 'status' ? null : 'status'))
            }
            onClose={() => setActiveDropdown(null)}
          />

          <FilterDropdown
            value={selectedType}
            options={localizedTypeOptions}
            onChange={(val) => setSelectedType(val)}
            isOpen={activeDropdown === 'type'}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === 'type' ? null : 'type'))
            }
            onClose={() => setActiveDropdown(null)}
          />

          <FilterDropdown
            value={selectedCity}
            options={localizedCityOptions}
            onChange={(val) => setSelectedCity(val)}
            isOpen={activeDropdown === 'city'}
            onToggle={() =>
              setActiveDropdown((prev) => (prev === 'city' ? null : 'city'))
            }
            onClose={() => setActiveDropdown(null)}
          />
        </div>

        <div className="view-toggle-wrap">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            type="button"
          >
            <Grid2X2 size={16} />
            <span>{lang === 'en' ? 'Cards' : 'بطاقات'}</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            type="button"
          >
            <List size={16} />
            <span>{lang === 'en' ? 'List' : 'قائمة'}</span>
          </button>
        </div>
      </section>

      {/* View Content (List Table or Cards Grid) */}
      {viewMode === 'list' ? (
        <section className="units-table-card">
          <div className="units-table-scroll">
            <table className="units-table">
              <thead>
                <tr>
                  <th style={{ width: '310px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        className="unit-checkbox"
                        checked={
                          selectedIds.length === filteredUnits.length &&
                          filteredUnits.length > 0
                        }
                        onChange={toggleSelectAll}
                        aria-label={lang === 'en' ? 'Select All' : 'تحديد الكل'}
                      />
                      <span>{lang === 'en' ? 'Unit' : 'الوحدة'}</span>
                    </div>
                  </th>
                  <th>{lang === 'en' ? 'Property' : 'العقار'}</th>
                  <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                  <th>{lang === 'en' ? 'Capacity' : 'السعة'}</th>
                  <th>{lang === 'en' ? 'Check-out' : 'المغادرة'}</th>
                  <th>{lang === 'en' ? 'Check-in' : 'الدخول'}</th>
                  <th>{lang === 'en' ? 'Channel' : 'المصدر / المنصة'}</th>
                  <th className="col-actions">{lang === 'en' ? 'Actions' : 'الإجراءات'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      style={{
                        textAlign: 'center',
                        padding: '48px 20px',
                        color: '#64748b',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      {lang === 'en'
                        ? 'No units match the selected filters.'
                        : 'لا توجد وحدات تطابق معايير التصفية المحددة.'}
                    </td>
                  </tr>
                ) : (
                  filteredUnits.map((unit) => (
                    <tr key={unit.id}>
                      {/* Unit */}
                      <td>
                        <div className="unit-cell-wrap">
                          <input
                            type="checkbox"
                            className="unit-checkbox"
                            checked={selectedIds.includes(unit.id)}
                            onChange={() => toggleSelect(unit.id)}
                            aria-label={`Select ${unit.name}`}
                          />

                          <Link
                            to={`/app/units/${unit.code}`}
                            className="unit-thumb-box"
                            aria-label={unit.name}
                          >
                            {unit.thumbPlaceholder === 'building' ? (
                              <div className="unit-thumb-placeholder">
                                <Building2 size={18} />
                              </div>
                            ) : unit.thumbPlaceholder === 'chalet' ? (
                              <div className="unit-thumb-placeholder">
                                <Home size={18} />
                              </div>
                            ) : (
                              <img
                                src={unit.thumbSrc}
                                alt={unit.name}
                                className="unit-thumb-img"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            )}
                          </Link>

                          <div className="unit-meta">
                            <Link
                              to={`/app/units/${unit.code}`}
                              className="unit-title-link"
                            >
                              {unit.name}
                            </Link>
                            <div className="unit-sub-badges">
                              <span className="unit-type-tag">{getUnitTypeName(unit.type)}</span>
                              <span className="unit-code-tag">{unit.code}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td>
                        <div className="property-cell-wrap">
                          <span className="property-title">{unit.property}</span>
                          <span className="property-location">
                            <MapPin size={11} />
                            {unit.location}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`status-pill ${unit.status}`}>
                          {getUnitStatusLabel(unit.status)}
                        </span>
                      </td>

                      {/* Capacity */}
                      <td>
                        <div className="capacity-cell">
                          <span className="capacity-item">
                            <UserRound size={13} />
                            {unit.capacity.guests}
                          </span>
                          <span className="capacity-item">
                            <BedDouble size={13} />
                            {unit.capacity.beds}
                          </span>
                          <span className="capacity-item">
                            <Bath size={13} />
                            {unit.capacity.baths}
                          </span>
                        </div>
                      </td>

                      {/* Check-out */}
                      <td>
                        <span className="time-val">{unit.checkOut}</span>
                      </td>

                      {/* Check-in */}
                      <td>
                        <span className="time-val">{unit.checkIn}</span>
                      </td>

                      {/* Channel */}
                      <td>
                        <div
                          className={`platform-square-box ${unit.platformLetter}`}
                        >
                          {unit.platformLetter}
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="actions-cell-wrap">
                          <Tooltip text={lang === 'en' ? 'View Details' : 'عرض التفاصيل'}>
                            <Link
                              to={`/app/units/${unit.code}`}
                              className="action-round-btn"
                              aria-label={`View ${unit.name}`}
                            >
                              <Eye size={15} />
                            </Link>
                          </Tooltip>

                          <Tooltip text={lang === 'en' ? 'New Booking' : 'إضافة حجز'}>
                            <Link
                              to={`/app/new/booking?unit=${unit.code}`}
                              className="action-round-btn"
                              aria-label={`Add booking for ${unit.name}`}
                            >
                              <CalendarDays size={15} />
                            </Link>
                          </Tooltip>

                          <Tooltip text={lang === 'en' ? 'Cleaning Task' : 'طلب تنظيف'}>
                            <Link
                              to={`/app/new/cleaning?unit=${unit.code}`}
                              className="action-round-btn"
                              aria-label={`Clean ${unit.name}`}
                            >
                              <Sparkles size={15} />
                            </Link>
                          </Tooltip>

                          <Tooltip text={lang === 'en' ? 'Maintenance Request' : 'طلب صيانة'}>
                            <Link
                              to={`/app/new/maintenance?unit=${unit.code}`}
                              className="action-round-btn"
                              aria-label={`Maintenance for ${unit.name}`}
                            >
                              <Wrench size={15} />
                            </Link>
                          </Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer in Table Card */}
          <footer className="units-pagination-bar">
            <div className="page-size-selector">
              <span>{lang === 'en' ? 'Items per page' : 'عدد العناصر في الصفحة'}</span>
              <div className="page-size-box">15</div>
            </div>

            <div className="pagination-counter">
              <span>
                {lang === 'en'
                  ? `Showing 1 - ${filteredUnits.length} of ${unitsList.length} units`
                  : `عرض 1 - ${filteredUnits.length} من ${unitsList.length} وحدة`}
              </span>
            </div>

            <div className="pagination-controls">
              <button className="pagination-nav-btn" type="button" aria-label={lang === 'en' ? 'Previous' : 'السابق'}>
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
              <button className="pagination-nav-btn active" type="button">
                1
              </button>
              <button className="pagination-nav-btn" type="button" aria-label={lang === 'en' ? 'Next' : 'التالي'}>
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </footer>
        </section>
      ) : (
        /* Cards / Grid View */
        <section className="units-cards-container">
          <div className="units-cards-grid">
            {filteredUnits.length === 0 ? (
              <div
                style={{
                  gridColumn: '1 / -1',
                  textAlign: 'center',
                  padding: '54px 20px',
                  background: '#fff',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {lang === 'en'
                  ? 'No units match the selected filters.'
                  : 'لا توجد وحدات تطابق معايير التصفية المحددة.'}
              </div>
            ) : (
              filteredUnits.map((unit) => (
                <article className="unit-grid-card" key={unit.id}>
                  {/* Top: Status Pill on left, Code/Type and Thumbnail on right */}
                  <div className="card-header-row">
                    <span className={`status-pill ${unit.status}`}>
                      {getUnitStatusLabel(unit.status)}
                    </span>

                    <div className="card-unit-info">
                      <div className="card-code-type">
                        <span className="card-code-badge">{unit.code}</span>
                        <span className="card-type-text">{getUnitTypeName(unit.type)}</span>
                      </div>
                      <Link
                        to={`/app/units/${unit.code}`}
                        className="card-thumb-box"
                        aria-label={unit.name}
                      >
                        {unit.thumbPlaceholder === 'building' ? (
                          <div className="card-thumb-placeholder">
                            <Building2 size={20} />
                          </div>
                        ) : unit.thumbPlaceholder === 'chalet' ? (
                          <div className="card-thumb-placeholder">
                            <Home size={20} />
                          </div>
                        ) : (
                          <img
                            src={unit.thumbSrc}
                            alt={unit.name}
                            className="card-thumb-img"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        )}
                      </Link>
                    </div>
                  </div>

                  {/* Body: Title, Property, Location */}
                  <div className="card-body-meta">
                    <Link to={`/app/units/${unit.code}`} className="card-unit-title">
                      {unit.name}
                    </Link>
                    <span className="card-property-name">{unit.property}</span>
                    <span className="card-location">
                      <MapPin size={11} />
                      {unit.location}
                    </span>
                  </div>

                  {/* Capacity Strip (4 stats) */}
                  <div className="card-capacity-box">
                    <div className="card-capacity-item">
                      <UserRound size={14} />
                      <span className="card-capacity-num">{unit.capacity.guests}</span>
                      <span className="card-capacity-label">{lang === 'en' ? 'guests' : 'ضيوف'}</span>
                    </div>
                    <div className="card-capacity-item">
                      <DoorClosed size={14} />
                      <span className="card-capacity-num">{unit.capacity.rooms}</span>
                      <span className="card-capacity-label">{lang === 'en' ? 'rooms' : 'غرف'}</span>
                    </div>
                    <div className="card-capacity-item">
                      <BedDouble size={14} />
                      <span className="card-capacity-num">{unit.capacity.beds}</span>
                      <span className="card-capacity-label">{lang === 'en' ? 'beds' : 'أسرة'}</span>
                    </div>
                    <div className="card-capacity-item">
                      <Bath size={14} />
                      <span className="card-capacity-num">{unit.capacity.baths}</span>
                      <span className="card-capacity-label">{lang === 'en' ? 'baths' : 'حمام'}</span>
                    </div>
                  </div>

                  {/* Times Row */}
                  <div className="card-times-row">
                    <div className="card-time-item">
                      <Clock size={12} />
                      <span>{lang === 'en' ? 'Check-in:' : 'الدخول:'} <strong>{unit.checkIn}</strong></span>
                    </div>
                    <div className="card-time-item">
                      <Clock size={12} />
                      <span>{lang === 'en' ? 'Check-out:' : 'المغادرة:'} <strong>{unit.checkOut}</strong></span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="card-actions-row">
                    <Link to={`/app/units/${unit.code}`} className="card-btn-details">
                      <Eye size={15} />
                      <span>{lang === 'en' ? 'View Details' : 'عرض التفاصيل'}</span>
                    </Link>

                    <Tooltip text={lang === 'en' ? 'New Booking' : 'إضافة حجز'}>
                      <Link
                        to={`/app/new/booking?unit=${unit.code}`}
                        className="card-action-icon-btn"
                        aria-label={`Add booking for ${unit.name}`}
                      >
                        <CalendarDays size={14} />
                      </Link>
                    </Tooltip>

                    <Tooltip text={lang === 'en' ? 'Cleaning Task' : 'طلب تنظيف'}>
                      <Link
                        to={`/app/new/cleaning?unit=${unit.code}`}
                        className="card-action-icon-btn"
                        aria-label={`Clean ${unit.name}`}
                      >
                        <Sparkles size={14} />
                      </Link>
                    </Tooltip>

                    <Tooltip text={lang === 'en' ? 'Maintenance Request' : 'طلب صيانة'}>
                      <Link
                        to={`/app/new/maintenance?unit=${unit.code}`}
                        className="card-action-icon-btn"
                        aria-label={`Maintenance for ${unit.name}`}
                      >
                        <Wrench size={14} />
                      </Link>
                    </Tooltip>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination Footer for Cards View */}
          <footer
            className="units-pagination-bar"
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div className="page-size-selector">
              <span>{lang === 'en' ? 'Items per page' : 'عدد العناصر في الصفحة'}</span>
              <div className="page-size-box">15</div>
            </div>

            <div className="pagination-counter">
              <span>
                {lang === 'en'
                  ? `Showing 1 - ${filteredUnits.length} of ${initialUnits.length} units`
                  : `عرض 1 - ${filteredUnits.length} من ${initialUnits.length} وحدة`}
              </span>
            </div>

            <div className="pagination-controls">
              <button className="pagination-nav-btn" type="button" aria-label={lang === 'en' ? 'Previous' : 'السابق'}>
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
              <button className="pagination-nav-btn active" type="button">
                1
              </button>
              <button className="pagination-nav-btn" type="button" aria-label={lang === 'en' ? 'Next' : 'التالي'}>
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
            </div>
          </footer>
        </section>
      )}
    </div>
  );
}
