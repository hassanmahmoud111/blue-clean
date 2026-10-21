import { useEffect, useState, type ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Activity,
  BedDouble,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  CreditCard,
  DoorOpen,
  ExternalLink,
  FileText,
  KeyRound,
  MapPin,
  MessageCircle,
  Plus,
  QrCode,
  RefreshCw,
  Sparkles,
  Star,
  UsersRound,
  X,
} from 'lucide-react';
import { getUnitDetail } from '../data/detailRecords';
import { useLanguage } from '../context/LanguageContext';
import { fetchClientUnitDetail, mapApiUnitToDetailRecord } from '../services/unitService';
import {
  getLocalizedUnitName,
  getLocalizedPropertyName,
  getLocalizedCity,
  getLocalizedDistrict,
} from '../utils/unitTranslations';
import type { UnitDetailRecord } from '../types/details';
import './reference-pages.css';
import './details-pages.css';

export default function UnitDetailsPage() {
  const { unitId } = useParams();
  const { lang, isRTL } = useLanguage();
  const [unit, setUnit] = useState<UnitDetailRecord>(() => getUnitDetail(unitId));
  const [showGalleryModal, setShowGalleryModal] = useState(false);

  useEffect(() => {
    const fallback = getUnitDetail(unitId);
    setUnit(fallback);

    if (!unitId) return;
    let active = true;
    fetchClientUnitDetail(unitId).then((apiUnit) => {
      if (active && apiUnit) {
        setUnit(mapApiUnitToDetailRecord(apiUnit, fallback));
      }
    });
    return () => {
      active = false;
    };
  }, [unitId]);

  if (!unit) return <Navigate to="/app/units" replace />;

  const photos =
    unit.images && unit.images.length > 0
      ? unit.images
      : unit.imageUrl
        ? [unit.imageUrl]
        : ['/unit-thumbs/thumb-1.png', '/unit-thumbs/thumb-2.png', '/unit-thumbs/thumb-5.png'];

  const primaryPhoto = unit.imageUrl || photos[0];
  const secondaryPhoto1 = photos[1] || photos[0];
  const secondaryPhoto2 = photos[2] || photos[0];

  const translateStatus = (st: string) => {
    if (lang !== 'en') return st;
    if (st === 'جاهزة للضيف' || st === 'نشطة' || st === 'جاهزة') return 'Guest Ready';
    if (st === 'مسودة') return 'Draft';
    if (st === 'غير نشطة' || st === 'خارج الخدمة') return 'Inactive';
    if (st === 'مشغولة') return 'Occupied';
    if (st === 'بانتظار التنظيف') return 'Needs Cleaning';
    if (st === 'قيد الصيانة') return 'In Maintenance';
    return st;
  };

  const translateType = (tp: string) => {
    if (lang !== 'en') return tp;
    if (tp === 'شقة') return 'Apartment';
    if (tp === 'فيلا') return 'Villa';
    if (tp === 'استوديو') return 'Studio';
    if (tp === 'شاليه') return 'Chalet';
    return tp;
  };

  const translateMode = (mode: string) => {
    if (lang !== 'en') return mode;
    if (mode === 'تشغيل مستقل') return 'Independent Operation';
    if (mode === 'مزامنة حجوزات') return 'Booking Sync';
    if (mode === 'إدارة مختلطة') return 'Hybrid Management';
    return mode;
  };

  return (
    <div className="reference-page details-page unit-details-page" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="detail-page-header">
        <div>
          <div className="reference-breadcrumb">
            <Link to="/app/units">{lang === 'en' ? 'Units' : 'الوحدات'}</Link>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{getLocalizedUnitName(unit.name, unit.code, lang)}</span>
          </div>
          <div className="detail-title-row">
            {primaryPhoto ? (
              <img
                src={primaryPhoto}
                alt={getLocalizedUnitName(unit.name, unit.code, lang)}
                style={{
                  width: '74px',
                  height: '62px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  border: '1px solid #dce7ed',
                  flexShrink: 0,
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/unit-thumbs/thumb-1.png';
                }}
              />
            ) : (
              <span className={`ref-thumbnail ${unit.imageClass}`} />
            )}
            <div>
              <h1>
                {getLocalizedUnitName(unit.name, unit.code, lang)}
                <small>{unit.code}</small>
              </h1>
              <p>
                <Building2 size={13} />
                {getLocalizedPropertyName(unit.property, unit.code, lang)}
                <i /> <MapPin size={13} />
                {getLocalizedCity(unit.city, unit.code, lang)}، {getLocalizedDistrict(unit.district, unit.code, lang)}
              </p>
            </div>
            <span className={`reference-chip ${unit.statusTone}`}>
              {translateStatus(unit.status)}
            </span>
          </div>
        </div>
        <div className="detail-header-actions">
          <Link className="reference-secondary" to={`/app/new/cleaning?unit=${unit.code}`}>
            <Sparkles size={16} />
            {lang === 'en' ? 'Cleaning Task' : 'طلب تنظيف'}
          </Link>
          <Link className="reference-secondary" to={`/app/new/booking?unit=${unit.code}`}>
            <CalendarDays size={16} />
            {lang === 'en' ? 'Add Booking' : 'إضافة حجز'}
          </Link>
          <Link className="reference-primary" to={`/app/units/${unit.code}/edit`}>
            <FileText size={16} />
            {lang === 'en' ? 'Edit Details' : 'تعديل البيانات'}
          </Link>
        </div>
      </header>

      <section className="detail-metrics">
        <Metric
          icon={<Activity size={22} />}
          label={lang === 'en' ? 'Occupancy Rate' : 'نسبة الإشغال'}
          value={unit.metrics.occupancy}
          tone="blue"
        />
        <Metric
          icon={<CreditCard size={22} />}
          label={lang === 'en' ? 'Monthly Revenue' : 'إيرادات الشهر'}
          value={unit.metrics.revenue}
          tone="green"
        />
        <Metric
          icon={<CheckCircle2 size={22} />}
          label={lang === 'en' ? 'Completed Tasks' : 'مهام مكتملة'}
          value={unit.metrics.completedTasks}
          tone="violet"
        />
        <Metric
          icon={<Star size={22} />}
          label={lang === 'en' ? 'Unit Rating' : 'تقييم الوحدة'}
          value={unit.metrics.rating}
          tone="orange"
        />
      </section>

      <div className="unit-detail-grid">
        <main className="detail-main-column">
          <section className="reference-panel detail-card unit-overview-card">
            <CardTitle
              icon={<Building2 size={19} />}
              title={lang === 'en' ? 'Unit Information' : 'معلومات الوحدة'}
              subtitle={
                lang === 'en'
                  ? 'Core property details and operational specifications'
                  : 'البيانات الثابتة والتشغيلية الأساسية'
              }
            />
            <div className="unit-gallery">
              <span className="unit-photo-large">
                {primaryPhoto ? (
                  <img
                    src={primaryPhoto}
                    alt={unit.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/unit-thumbs/thumb-1.png';
                    }}
                  />
                ) : (
                  <i className={`ref-thumbnail ${unit.imageClass}`} />
                )}
              </span>
              <div>
                <span className="unit-photo-small">
                  {secondaryPhoto1 ? (
                    <img
                      src={secondaryPhoto1}
                      alt={unit.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/unit-thumbs/thumb-2.png';
                      }}
                    />
                  ) : (
                    <i className="ref-thumbnail u2" />
                  )}
                </span>
                <span className="unit-photo-small">
                  {secondaryPhoto2 ? (
                    <img
                      src={secondaryPhoto2}
                      alt={unit.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/unit-thumbs/thumb-5.png';
                      }}
                    />
                  ) : (
                    <i className="ref-thumbnail u3" />
                  )}
                </span>
                <button type="button" onClick={() => setShowGalleryModal(true)}>
                  {lang === 'en' ? 'View All Photos' : 'عرض كل الصور'}
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>

            {unit.description && (
              <div
                style={{
                  marginBottom: '14px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: '#f6fafc',
                  border: '1px solid #e2edf2',
                  color: '#35566e',
                  fontSize: '11.5px',
                  lineHeight: 1.7,
                }}
              >
                {unit.description}
              </div>
            )}

            <div className="detail-info-grid">
              <Info
                label={lang === 'en' ? 'Unit Type' : 'نوع الوحدة'}
                value={translateType(unit.type)}
              />
              <Info
                label={lang === 'en' ? 'Management Mode' : 'نمط الإدارة'}
                value={translateMode(unit.managementMode)}
              />
              <Info label={lang === 'en' ? 'Property' : 'العقار'} value={unit.property} />
              <Info label={lang === 'en' ? 'Address' : 'العنوان'} value={unit.address} />
              <Info
                label={lang === 'en' ? 'City & District' : 'المدينة والحي'}
                value={`${unit.city}، ${unit.district}`}
              />
              <Info label={lang === 'en' ? 'Unit Code' : 'كود الوحدة'} value={unit.code} />
            </div>

            <div className="capacity-strip">
              <Capacity
                icon={<UsersRound size={20} />}
                value={unit.capacity.guests}
                label={lang === 'en' ? 'Guests' : 'ضيوف'}
              />
              <Capacity
                icon={<BedDouble size={20} />}
                value={unit.capacity.bedrooms}
                label={lang === 'en' ? 'Bedrooms' : 'غرف نوم'}
              />
              <Capacity
                icon={<BedDouble size={20} />}
                value={unit.capacity.beds}
                label={lang === 'en' ? 'Beds' : 'أسرّة'}
              />
              <Capacity
                icon={<DoorOpen size={20} />}
                value={unit.capacity.bathrooms}
                label={lang === 'en' ? 'Bathrooms' : 'دورات مياه'}
              />
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<CalendarDays size={19} />}
              title={lang === 'en' ? 'Bookings' : 'الحجوزات'}
              subtitle={
                lang === 'en'
                  ? 'Current guest stay and next upcoming reservation'
                  : 'الحجز الحالي وأقرب حجز قادم'
              }
              action={
                <Link to={`/app/new/booking?unit=${unit.code}`}>
                  {lang === 'en' ? 'Add Booking' : 'إضافة حجز'}
                  <Plus size={14} />
                </Link>
              }
            />
            <div className="booking-detail-grid">
              {unit.currentBooking ? (
                <BookingCard
                  title={lang === 'en' ? 'Current Booking' : 'الحجز الحالي'}
                  booking={unit.currentBooking}
                  active
                  lang={lang}
                />
              ) : (
                <EmptyMini text={lang === 'en' ? 'No current guest stay' : 'لا يوجد ضيف حاليًا'} />
              )}
              {unit.nextBooking ? (
                <BookingCard
                  title={lang === 'en' ? 'Upcoming Booking' : 'الحجز القادم'}
                  booking={unit.nextBooking}
                  lang={lang}
                />
              ) : (
                <EmptyMini
                  text={lang === 'en' ? 'No upcoming reservation' : 'لا يوجد حجز قادم'}
                />
              )}
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<Sparkles size={19} />}
              title={lang === 'en' ? 'Operations & Services' : 'التشغيل والخدمات'}
              subtitle={
                lang === 'en'
                  ? 'Upcoming tasks linked to this unit'
                  : 'المهام القادمة والمرتبطة بهذه الوحدة'
              }
              action={
                <Link to={`/app/new/cleaning?unit=${unit.code}`}>
                  {lang === 'en' ? 'Create Request' : 'إنشاء طلب'}
                  <Plus size={14} />
                </Link>
              }
            />
            <div className="unit-operation-list">
              {unit.upcomingOperations.map((item) => {
                const section =
                  item.type === 'صيانة'
                    ? 'maintenance'
                    : item.type === 'خدمة إضافية'
                      ? 'services'
                      : 'cleaning';
                return (
                  <Link to={`/app/operations/${section}/${item.id}`} key={item.id}>
                    <span className="detail-operation-icon">
                      <Sparkles size={18} />
                    </span>
                    <div>
                      <b>{item.type}</b>
                      <small>
                        {item.id} · {item.date}
                      </small>
                    </div>
                    <span>{item.assignee}</span>
                    <i className={`reference-chip ${item.tone}`}>{item.status}</i>
                    {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </div>
          </section>
        </main>

        <aside className="detail-side-column">
          <section className="reference-panel detail-card">
            <CardTitle
              icon={<Clock3 size={19} />}
              title={lang === 'en' ? 'Stay Settings' : 'إعدادات الإقامة'}
            />
            <div className="compact-info-list">
              <InfoRow
                icon={<Clock3 size={16} />}
                label={lang === 'en' ? 'Check-in' : 'تسجيل الدخول'}
                value={unit.stayDefaults.checkIn}
              />
              <InfoRow
                icon={<Clock3 size={16} />}
                label={lang === 'en' ? 'Check-out' : 'تسجيل الخروج'}
                value={unit.stayDefaults.checkOut}
              />
              <InfoRow
                icon={<Sparkles size={16} />}
                label={lang === 'en' ? 'Cleaning Duration' : 'مدة التنظيف'}
                value={
                  lang === 'en'
                    ? `${unit.stayDefaults.cleaningMinutes} mins`
                    : `${unit.stayDefaults.cleaningMinutes} دقيقة`
                }
              />
              <InfoRow
                icon={<KeyRound size={16} />}
                label={lang === 'en' ? 'Access Method' : 'طريقة الدخول'}
                value={unit.stayDefaults.access}
              />
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<RefreshCw size={19} />}
              title={lang === 'en' ? 'Platforms & Sync' : 'المنصات والمزامنة'}
              subtitle={
                unit.integrations.length
                  ? lang === 'en'
                    ? 'Connection status and latest sync'
                    : 'حالة الربط وآخر مزامنة'
                  : lang === 'en'
                    ? 'This unit operates without external platforms'
                    : 'هذه الوحدة تعمل بدون منصات'
              }
            />
            {unit.integrations.length ? (
              <div className="integration-detail-list">
                {unit.integrations.map((item) => (
                  <div key={item.name}>
                    <span
                      className={`platform-square ${
                        item.name === 'Booking.com' ? 'booking' : 'airbnb'
                      }`}
                    >
                      {item.name === 'Booking.com'
                        ? 'B.'
                        : item.name === 'Gathern'
                          ? 'G'
                          : 'A'}
                    </span>
                    <div>
                      <b>{item.name}</b>
                      <small>{item.listingId}</small>
                    </div>
                    <span>
                      <i className={item.tone} />
                      {item.status}
                      <small>{item.lastSync}</small>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="standalone-unit-state">
                <Sparkles size={24} />
                <b>{lang === 'en' ? 'Independent Operation' : 'تشغيل مستقل'}</b>
                <p>
                  {lang === 'en'
                    ? 'You can schedule cleaning and maintenance tasks directly without channel sync.'
                    : 'يمكن إنشاء تنظيف وخدمات دورية من التشغيل والخدمات دون الحاجة لمزامنة حجوزات.'}
                </p>
              </div>
            )}
          </section>

          {unit.qrCodeUrl && (
            <section className="reference-panel detail-card">
              <CardTitle
                icon={<QrCode size={19} />}
                title={lang === 'en' ? 'Guest Store QR' : 'باركود متجر الضيف'}
                subtitle={
                  lang === 'en'
                    ? 'Quick guest access for unit services'
                    : 'رابط سريع لخدمات الضيف داخل الوحدة'
                }
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '6px 0',
                }}
              >
                <img
                  src={unit.qrCodeUrl}
                  alt={`QR ${unit.code}`}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '8px',
                    border: '1px solid #e2eaee',
                    padding: '4px',
                    background: '#fff',
                  }}
                />
                <div style={{ display: 'grid', gap: '6px' }}>
                  <b style={{ fontSize: '11px', color: '#0b3556' }}>{unit.code}</b>
                  {unit.storeUrl && (
                    <a
                      href={unit.storeUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#0879a3',
                        textDecoration: 'none',
                      }}
                    >
                      <span>{lang === 'en' ? 'Open Guest Store' : 'فتح متجر الضيف'}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<MessageCircle size={19} />}
              title={lang === 'en' ? 'Standing Notes' : 'ملاحظات ثابتة'}
            />
            <ul className="unit-notes">
              {unit.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<Activity size={19} />}
              title={lang === 'en' ? 'Recent Activity' : 'آخر النشاطات'}
            />
            <div className="detail-activity-list">
              {unit.activity.map((item) => (
                <div key={item.title}>
                  <i className={item.tone} />
                  <span>
                    <b>{item.title}</b>
                    <small>{item.time}</small>
                  </span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      {showGalleryModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setShowGalleryModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(9, 30, 52, 0.72)',
            display: 'grid',
            placeItems: 'center',
            padding: '24px',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '780px',
              width: '100%',
              padding: '20px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <strong style={{ fontSize: '15px', color: '#092f51' }}>
                {getLocalizedUnitName(unit.name, unit.code, lang)} ({unit.code})
              </strong>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  border: '1px solid #d5e2e9',
                  background: '#f8fbfc',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '12px',
              }}
            >
              {photos.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={`${getLocalizedUnitName(unit.name, unit.code, lang)} ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    borderRadius: '10px',
                    border: '1px solid #e2eaee',
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/unit-thumbs/thumb-1.png';
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <article className="reference-panel">
      <span className={tone}>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function CardTitle({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="detail-card-title">
      <span>{icon}</span>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </header>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-info">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function Capacity({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div>
      {icon}
      <span>
        <b>{value}</b>
        <small>{label}</small>
      </span>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      {icon}
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="detail-empty-mini">
      <CalendarDays size={23} />
      <b>{text}</b>
    </div>
  );
}

function BookingCard({
  title,
  booking,
  active,
  lang,
}: {
  title: string;
  booking: {
    id: string;
    guest: string;
    channel: string;
    checkIn: string;
    checkOut: string;
    guests?: number;
    amount?: string;
  };
  active?: boolean;
  lang?: string;
}) {
  return (
    <article className={active ? 'active' : ''}>
      <header>
        <span>{title}</span>
        <i>{booking.channel}</i>
      </header>
      <h3>{booking.guest}</h3>
      <small>{booking.id}</small>
      <div>
        <span>
          {lang === 'en' ? 'Check-in' : 'الوصول'}
          <b>{booking.checkIn}</b>
        </span>
        <span>
          {lang === 'en' ? 'Check-out' : 'المغادرة'}
          <b>{booking.checkOut}</b>
        </span>
      </div>
      {booking.amount && (
        <footer>
          <span>
            {booking.guests} {lang === 'en' ? 'guests' : 'ضيوف'}
          </span>
          <strong>{booking.amount}</strong>
        </footer>
      )}
    </article>
  );
}
