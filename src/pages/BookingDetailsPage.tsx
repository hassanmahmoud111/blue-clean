import { useEffect, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  BedDouble,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Edit3,
  Mail,
  MessageCircle,
  Phone,
  RefreshCw,
  Sparkles,
  Trash2,
  UserRound,
  UsersRound,
} from 'lucide-react';
import type { BookingItem } from '../types/clientBooking';
import { deleteClientBooking, fetchBookingDetail } from '../services/clientBookingService';
import './reference-pages.css';
import './details-pages.css';
import './system-completion.css';

export default function BookingDetailsPage() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail(bookingId)
        .then(res => setBooking(res))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [bookingId]);

  const handleDelete = async () => {
    if (!booking) return;
    if (window.confirm('هل أنت متأكد من حذف هذا الحجز؟')) {
      await deleteClientBooking(booking.id);
      navigate('/app/bookings');
    }
  };

  if (loading) {
    return (
      <div className="reference-page details-page">
        <div style={{ padding: 40, textAlign: 'center' }}>جارٍ تحميل تفاصيل الحجز...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="reference-page details-page">
        <div style={{ padding: 40, textAlign: 'center' }}>الحجز غير موجود</div>
      </div>
    );
  }

  const timeline = booking.timeline || [
    {
      id: 1,
      title: 'تم إنشاء الحجز',
      description: `المصدر: ${booking.source_sync?.booking_source_label || booking.source_sync?.booking_source || 'حجز مباشر'}`,
      timestamp: booking.created_at || 'الآن',
      status: 'completed',
    },
    {
      id: 2,
      title: 'تم تأكيد توفر الوحدة',
      description: 'لا يوجد تعارض في التقويم',
      timestamp: 'مكتمل',
      status: 'completed',
    },
    {
      id: 3,
      title: 'وصول الضيف',
      description: `بانتظار موعد تسجيل الدخول (${booking.stay.check_in_time})`,
      timestamp: booking.stay.check_in_date_formatted || booking.stay.check_in_date,
      status: 'completed',
    },
  ];

  const scheduledMsgs = booking.scheduled_messages || [
    {
      id: 1,
      title: 'تم إرسال تأكيد الحجز',
      status: 'تم التسليم',
      time_ago: 'منذ يومين',
    },
    {
      id: 2,
      title: 'تعليمات الدخول',
      status: 'مجدولة',
      time_ago: 'مجدولة قبل الوصول',
    },
  ];

  const statusLabel =
    booking.status_label ||
    (booking.status === 'confirmed'
      ? 'مؤكد'
      : booking.status === 'active'
        ? 'قيد الإقامة'
        : booking.status);

  const sourceLabel =
    booking.source_sync?.booking_source_label ||
    booking.source_sync?.booking_source ||
    'حجز مباشر';

  const paymentStatusLabel =
    booking.payment.payment_status_label || booking.payment.payment_status || 'غير مدفوع';

  const isPaid =
    booking.payment.payment_status === 'paid' ||
    booking.payment.payment_status === 'مدفوع';

  const unitLinkTarget = booking.unit.code || booking.unit.id;
  const cleaningCode =
    booking.cleaning_order?.code || booking.automation.cleaning_task?.code;

  return (
    <div className="reference-page details-page booking-details-page">
      <header className="detail-page-header">
        <div>
          <div className="reference-breadcrumb">
            <Link to="/app/bookings">الحجوزات والتقويم</Link>
            <ChevronLeft size={13} />
            <span>{booking.booking_code}</span>
          </div>
          <div className="operation-detail-heading">
            <span>
              <BedDouble size={25} />
            </span>
            <div>
              <h1>
                {booking.guest.name}
                <small>{booking.booking_code}</small>
              </h1>
              <p>
                {booking.unit.name} · {booking.unit.property_name}
              </p>
            </div>
            <span className="reference-chip green">{statusLabel}</span>
          </div>
        </div>

        <div className="detail-header-actions">
          <Link className="reference-secondary" to="/app/support">
            <MessageCircle size={16} />
            طلب دعم للحجز
          </Link>
          <Link className="reference-secondary" to={`/app/bookings/${booking.id}/edit`}>
            <Edit3 size={16} />
            تعديل الحجز
          </Link>
          <Link className="reference-primary" to={`/app/new/cleaning?unit=${booking.unit.id}`}>
            <Sparkles size={16} />
            إنشاء مهمة تنظيف
          </Link>
          <button
            type="button"
            className="reference-secondary"
            style={{ color: '#dc2626' }}
            onClick={handleDelete}
          >
            <Trash2 size={16} />
            حذف
          </button>
        </div>
      </header>

      {/* Detail Metrics Row */}
      <section className="detail-metrics">
        <Metric
          icon={<CalendarDays size={22} />}
          label="مدة الإقامة"
          value={`${booking.stay.nights_count} ليالٍ`}
          tone="blue"
        />
        <Metric
          icon={<UsersRound size={22} />}
          label="عدد الضيوف"
          value={`${booking.guest.total_guests ?? booking.guest.adults_count} ضيوف`}
          tone="violet"
        />
        <Metric
          icon={<CircleDollarSign size={22} />}
          label="إجمالي الحجز"
          value={`${Number(booking.payment.total_amount).toLocaleString()} ر.س`}
          tone="green"
        />
        <Metric
          icon={<RefreshCw size={22} />}
          label="المصدر"
          value={sourceLabel}
          tone="orange"
        />
      </section>

      <div className="booking-detail-layout">
        {/* Main Column */}
        <main className="detail-main-column">
          {/* Stay Details */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<CalendarDays size={19} />} title="تفاصيل الإقامة" subtitle="المواعيد والوحدة المرتبطة بالحجز" />
            <div className="booking-stay-hero">
              <Link to={`/app/units/${unitLinkTarget}`}>
                <span
                  className="ref-thumbnail u1"
                  style={
                    booking.unit.image
                      ? { backgroundImage: `url(${booking.unit.image})`, backgroundSize: 'cover' }
                      : undefined
                  }
                />
                <div>
                  <small>الوحدة</small>
                  <b>{booking.unit.name}</b>
                  <p>
                    <Building2 size={13} />
                    {booking.unit.property_name} · {booking.unit.city?.name_ar || 'الرياض'}
                  </p>
                </div>
                <ChevronLeft size={17} />
              </Link>
              <div className="stay-dates">
                <DateBlock
                  label="تسجيل الدخول"
                  date={booking.stay.check_in_date_formatted || booking.stay.check_in_date}
                  time={booking.stay.check_in_time}
                />
                <i />
                <DateBlock
                  label="تسجيل المغادرة"
                  date={booking.stay.check_out_date_formatted || booking.stay.check_out_date}
                  time={booking.stay.check_out_time}
                />
              </div>
            </div>
          </section>

          {/* Automation & Tasks */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<Sparkles size={19} />} title="الأتمتة والتشغيل" subtitle="الإجراءات والمهام المجدولة تلقائيًا" />
            <div className="booking-automation-list">
              <div>
                <span className={booking.automation.block_calendar_dates ? 'on' : ''}>
                  {booking.automation.block_calendar_dates && <Check size={14} />}
                </span>
                <div>
                  <b>حجب التقويم</b>
                  <small>يمنع تعارض الحجوزات على المنصات</small>
                </div>
                <em>{booking.automation.block_calendar_dates ? 'مفعّل' : 'متوقف'}</em>
              </div>
              <div>
                <span className={booking.automation.send_welcome_message ? 'on' : ''}>
                  {booking.automation.send_welcome_message && <Check size={14} />}
                </span>
                <div>
                  <b>رسالة الترحيب الآلية</b>
                  <small>تُرسل عبر الرسائل القصيرة أو الواتساب</small>
                </div>
                <em>{booking.automation.send_welcome_message ? 'مفعّل' : 'متوقف'}</em>
              </div>
              <div>
                <span className={booking.automation.auto_clean_on_checkout ? 'on' : ''}>
                  {booking.automation.auto_clean_on_checkout && <Check size={14} />}
                </span>
                <div>
                  <b>تنظيف بعد المغادرة</b>
                  <small>{cleaningCode ? `مهمة ${cleaningCode}` : 'مجدولة تلقائيًا'}</small>
                </div>
                <em>{booking.automation.auto_clean_on_checkout ? 'مفعّل' : 'متوقف'}</em>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<Clock3 size={19} />} title="سجل الحجز" subtitle="خط زمني لأبرز أحداث وتحديثات الحجز" />
            <div className="operation-timeline">
              {timeline.map((item, index) => (
                <div className={item.status === 'completed' ? 'done' : ''} key={item.id || index}>
                  <span>{item.status === 'completed' ? <Check size={14} /> : index + 1}</span>
                  <div>
                    <b>{item.title}</b>
                    <small>{item.description}</small>
                  </div>
                  <time>{item.timestamp_formatted || item.time_ago || item.timestamp}</time>
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Sidebar Column */}
        <aside className="detail-side-column">
          {/* Guest Profile */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<UserRound size={19} />} title="بيانات الضيف" />
            <div className="guest-profile">
              <span>{booking.guest.name ? booking.guest.name[0] : 'ض'}</span>
              <div>
                <b>{booking.guest.name}</b>
                <small>
                  {booking.guest.adults_count} بالغين · {booking.guest.children_count || 0} أطفال
                </small>
              </div>
            </div>
            <div className="compact-info-list">
              <InfoRow icon={<Phone size={16} />} label="الجوال" value={booking.guest.phone || '—'} />
              <InfoRow icon={<Mail size={16} />} label="البريد" value={booking.guest.email || '—'} />
            </div>
          </section>

          {/* Payment Card */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<CreditCard size={19} />} title="الدفع والتحصيل" />
            <div className="payment-summary">
              <strong>{Number(booking.payment.total_amount).toLocaleString()} ر.س</strong>
              <span className={`reference-chip ${isPaid ? 'green' : 'orange'}`}>
                {paymentStatusLabel}
              </span>
            </div>
            <div className="compact-info-list">
              <InfoRow icon={<Check size={16} />} label="المدفوع" value={`${Number(booking.payment.paid_amount || 0).toLocaleString()} ر.س`} />
              <InfoRow icon={<Clock3 size={16} />} label="المتبقي" value={`${Number(booking.payment.remaining_amount ?? booking.payment.total_amount).toLocaleString()} ر.س`} />
              <InfoRow icon={<CreditCard size={16} />} label="الطريقة" value={booking.payment.payment_method || 'مباشر'} />
            </div>
          </section>

          {/* Sync Card */}
          <section className="reference-panel detail-card sync-source-note">
            <RefreshCw size={20} />
            <div>
              <b>{sourceLabel}</b>
              <p>{booking.source_sync?.sync_label || booking.source_sync?.sync_status || 'لا توجد مزامنة'}</p>
              {booking.source_sync?.platform_reference && (
                <small>مرجع المنصة: {booking.source_sync.platform_reference}</small>
              )}
              <Link to="/app/settings/integrations">عرض صحة المزامنة</Link>
            </div>
          </section>

          {/* Scheduled Messages */}
          <section className="reference-panel detail-card">
            <CardTitle icon={<MessageCircle size={19} />} title="الرسائل المجدولة" />
            <div className="booking-message-list">
              {scheduledMsgs.map((item, i) => (
                <div key={item.id || i}>
                  <span>
                    <b>{item.title}</b>
                    <small>{item.time_ago}</small>
                  </span>
                  <em>{item.status}</em>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
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
}: {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="detail-card-title">
      <span>{icon}</span>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
    </header>
  );
}

function DateBlock({
  label,
  date,
  time,
}: {
  label: string;
  date: string;
  time: string;
}) {
  return (
    <div>
      <span>{label}</span>
      <b>{date}</b>
      <small>{time}</small>
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
