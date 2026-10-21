import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  BedDouble,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock3,
  CloudDownload,
  CreditCard,
  LoaderCircle,
  MessageCircle,
  RefreshCw,
  Save,
  UserRound,
} from 'lucide-react';
import { SearchableSelect } from '../components/ui';
import { channelConnections, syncedReservations } from '../data/workflows';
import { useLanguage } from '../context/LanguageContext';
import {
  createClientBooking,
  fetchBookingCalendar,
  fetchBookingDetail,
  updateClientBooking,
} from '../services/clientBookingService';
import type { CalendarUnit, CreateBookingPayload } from '../types/clientBooking';
import { getTodayIso, getFutureDateIso, getNextDayIso } from '../utils/dateUtils';
import { getLocalizedPropertyName, getLocalizedUnitName } from '../utils/unitTranslations';
import './reference-pages.css';
import './workflow-pages.css';

const initialBookingPayload = (): CreateBookingPayload => ({
  unit_id: '',
  booking_type: 'direct',
  booking_source: 'حجز مباشر: هاتف، واتساب أو موقع',
  guest_name: '',
  guest_phone: '',
  guest_email: '',
  adults_count: 2,
  check_in_date: getTodayIso(),
  check_in_time: '03:00 PM',
  check_out_date: getFutureDateIso(3),
  check_out_time: '11:00 AM',
  total_amount: 1860,
  payment_status: 'غير مدفوع',
  block_calendar_dates: true,
  send_welcome_message: true,
  auto_clean_on_checkout: true,
  notes: '',
});

export default function AddBookingPage() {
  const { lang, isRTL } = useLanguage();
  const isEn = lang === 'en';
  const currencyLabel = isEn ? 'SAR' : 'ر.س';

  const steps = isEn
    ? ['Booking Source', 'Stay & Guest Details', 'Payment & Operations', 'Review']
    : ['مصدر الحجز', 'بيانات الحجز', 'الدفع والتشغيل', 'المراجعة'];

  const { bookingId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEdit = Boolean(bookingId);

  const [step, setStep] = useState(isEdit ? 2 : 1);
  const [mode, setMode] = useState<'manual' | 'sync'>('manual');
  const [syncChannel, setSyncChannel] = useState('booking');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [form, setForm] = useState<CreateBookingPayload>(initialBookingPayload);
  const [units, setUnits] = useState<CalendarUnit[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    fetchBookingCalendar().then(res => {
      setUnits(res.units || []);
    });

    const preselectedUnit = searchParams.get('unit');
    if (preselectedUnit) {
      setForm(prev => ({ ...prev, unit_id: preselectedUnit }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail(bookingId).then(b => {
        if (b) {
          setForm({
            unit_id: b.unit.id,
            booking_type: b.source_sync.booking_type || 'direct',
            booking_source: b.source_sync.booking_source || 'حجز مباشر: هاتف، واتساب أو موقع',
            guest_name: b.guest.name,
            guest_phone: b.guest.phone || '',
            guest_email: b.guest.email || '',
            adults_count: b.guest.adults_count || 2,
            check_in_date: b.stay.check_in_date,
            check_in_time: b.stay.check_in_time || '03:00 PM',
            check_out_date: b.stay.check_out_date,
            check_out_time: b.stay.check_out_time || '11:00 AM',
            total_amount: Number(b.payment.total_amount) || 1860,
            payment_status: b.payment.payment_status || 'غير مدفوع',
            block_calendar_dates: b.automation.block_calendar_dates,
            send_welcome_message: b.automation.send_welcome_message,
            auto_clean_on_checkout: b.automation.auto_clean_on_checkout,
            notes: b.notes || '',
          });
          setStep(2);
        }
      });
    }
  }, [bookingId]);

  const unitOptions = useMemo(() => {
    return units.map(u => ({
      value: String(u.id),
      label: `${getLocalizedUnitName(u.name, lang)} · ${getLocalizedPropertyName(u.property_name, lang)}`,
    }));
  }, [units, lang]);

  const sourceOptions = [
    {
      value: 'حجز مباشر: هاتف، واتساب أو موقع',
      label: isEn ? 'Direct Booking: Phone, WhatsApp or Website' : 'حجز مباشر: هاتف، واتساب أو موقع',
    },
    { value: 'Booking.com', label: 'Booking.com' },
    { value: 'Airbnb', label: 'Airbnb' },
    { value: 'Gathern', label: 'Gathern' },
  ];

  const paymentStatusOptions = [
    { value: 'غير مدفوع', label: isEn ? 'Unpaid' : 'غير مدفوع' },
    { value: 'مدفوع جزئيًا', label: isEn ? 'Partially Paid' : 'مدفوع جزئيًا' },
    { value: 'مدفوع', label: isEn ? 'Paid' : 'مدفوع' },
    { value: 'تحصيل بواسطة المنصة', label: isEn ? 'Collected by Platform' : 'تحصيل بواسطة المنصة' },
  ];

  const selectedUnitObj = units.find(u => String(u.id) === String(form.unit_id));
  const selectedUnitName = selectedUnitObj ? getLocalizedUnitName(selectedUnitObj.name, lang) : '';

  const getLocalizedSource = (src: string) => {
    if (src === 'حجز مباشر: هاتف، واتساب أو موقع') {
      return isEn ? 'Direct Booking' : 'حجز مباشر';
    }
    return src;
  };

  const getLocalizedPaymentStatus = (status: string) => {
    const match = paymentStatusOptions.find(opt => opt.value === status);
    return match ? match.label : status;
  };

  const update = <K extends keyof CreateBookingPayload>(key: K, value: CreateBookingPayload[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const chooseMode = (m: 'manual' | 'sync') => {
    setMode(m);
    if (m === 'manual') {
      update('booking_type', 'direct');
      update('booking_source', 'حجز مباشر: هاتف، واتساب أو موقع');
    }
    setError('');
  };

  const importReservation = (eventId: string) => {
    const reservation = syncedReservations.find(item => item.eventId === eventId);
    if (!reservation) return;
    setSelectedEvent(eventId);
    setForm(prev => ({
      ...prev,
      booking_type: reservation.channel,
      booking_source: reservation.channel === 'booking' ? 'Booking.com' : 'Airbnb',
      guest_name: reservation.guest,
      adults_count: reservation.guests,
      check_in_date: reservation.checkIn,
      check_out_date: reservation.checkOut,
      total_amount: reservation.total,
      payment_status: 'تحصيل بواسطة المنصة',
    }));
    setError('');
  };

  const validate = () => {
    if (step === 2 && !form.unit_id) return isEn ? 'Please select a unit first.' : 'يرجى اختيار الوحدة أولاً.';
    if (step === 2 && !form.guest_name.trim()) return isEn ? 'Please enter guest name.' : 'يرجى إدخال اسم الضيف.';
    if (step === 2 && (!form.check_in_date || !form.check_out_date))
      return isEn ? 'Please specify check-in and check-out dates.' : 'يرجى تحديد مواعيد الوصول والمغادرة.';
    if (step === 2 && form.check_in_date < getTodayIso())
      return isEn ? 'Booking date cannot be in the past.' : 'لا يمكن حجز موعد في تاريخ سابق لتاريخ اليوم.';
    if (step === 2 && form.check_out_date <= form.check_in_date)
      return isEn ? 'Check-out date must be after check-in date.' : 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.';
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep(prev => Math.min(4, prev + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setSaving(true);
    try {
      if (isEdit && bookingId) {
        await updateClientBooking(bookingId, form);
        navigate(`/app/bookings/${bookingId}`);
      } else {
        const created = await createClientBooking(form);
        setCreatedId(String(created.id));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = () => {
    window.localStorage.setItem('bluclean-booking-draft', JSON.stringify(form));
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 1800);
  };

  if (createdId) {
    return (
      <WorkflowSuccess
        icon={<BedDouble size={42} />}
        eyebrow={
          isEdit
            ? (isEn ? 'Booking updated successfully' : 'تم تحديث الحجز بنجاح')
            : (isEn ? 'Booking created successfully' : 'تم إنشاء الحجز بنجاح')
        }
        title={form.guest_name}
        description={`${selectedUnitName || (isEn ? 'Unit' : 'الوحدة')} · ${form.check_in_date} ${isEn ? 'to' : 'إلى'} ${form.check_out_date}`}
        primary={isEn ? 'View Booking Details' : 'عرض تفاصيل الحجز'}
        primaryTo={`/app/bookings/${createdId}`}
        secondary={isEn ? 'Add Another Booking' : 'إضافة حجز آخر'}
        onSecondary={() => {
          setForm(initialBookingPayload());
          setCreatedId('');
          setStep(1);
        }}
      />
    );
  }

  return (
    <div className="reference-page workflow-page booking-workflow">
      <header className="reference-page-header workflow-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to="/app/bookings">{isEn ? 'Bookings & Calendar' : 'الحجوزات والتقويم'}</Link>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>
              {isEdit
                ? (isEn ? 'Edit Booking' : 'تعديل الحجز')
                : (isEn ? 'Add Booking' : 'إضافة حجز')}
            </span>
          </div>
          <h1>
            <BedDouble size={29} />
            {isEdit
              ? `${isEn ? 'Edit Booking: ' : 'تعديل الحجز: '}${form.guest_name || ''}`
              : (isEn ? 'Add New Booking' : 'إضافة حجز جديد')}
          </h1>
          <p>
            {isEdit
              ? (isEn
                  ? 'Edit guest details, stay dates, booking total, and automation settings.'
                  : 'تعديل بيانات الضيف ومواعيد الإقامة ومبلغ الحجز وإعدادات الأتمتة.')
              : (isEn
                  ? 'Add a direct booking or review a reservation received from a connected platform.'
                  : 'أضف حجزًا مباشرًا أو راجع حجزًا وصل من منصة متصلة.')}
          </p>
        </div>
        <button
          type="button"
          className={`workflow-draft ${draftSaved ? 'saved' : ''}`}
          onClick={saveDraft}
        >
          {draftSaved ? <Check size={16} /> : <Save size={16} />}
          {draftSaved
            ? (isEn ? 'Draft Saved' : 'تم حفظ المسودة')
            : (isEn ? 'Save as Draft' : 'حفظ كمسودة')}
        </button>
      </header>

      <WorkflowStepper step={step} labels={steps} onStep={setStep} />

      <div className="workflow-layout">
        <main className="workflow-main reference-panel">
          {/* STEP 1 */}
          {step === 1 && <BookingSourceStep mode={mode} onChoose={chooseMode} isEn={isEn} />}

          {/* STEP 2 */}
          {step === 2 && mode === 'manual' && (
            <section className="workflow-content">
              <WorkflowHeading
                icon={<CalendarDays size={22} />}
                title={isEn ? 'Stay & Guest Details' : 'بيانات الإقامة والضيف'}
                description={
                  isEn
                    ? 'Select unit, guest, and dates to verify availability.'
                    : 'حدد الوحدة والضيف والمواعيد للتحقق من التوفر.'
                }
              />
              <div className="workflow-form-grid">
                <Field label={isEn ? 'Unit' : 'الوحدة'} required>
                  <SearchableSelect
                    options={unitOptions}
                    value={form.unit_id}
                    onChange={val => update('unit_id', val)}
                    placeholder={isEn ? 'Select unit...' : 'اختر الوحدة...'}
                    searchPlaceholder={isEn ? 'Search by unit or property name...' : 'ابحث باسم الوحدة أو العقار...'}
                  />
                </Field>

                <Field label={isEn ? 'Booking Source' : 'مصدر الحجز'}>
                  <SearchableSelect
                    options={sourceOptions}
                    value={form.booking_source}
                    onChange={val => {
                      update('booking_source', val);
                      update('booking_type', val.includes('Booking') ? 'booking' : val.includes('Airbnb') ? 'airbnb' : 'direct');
                    }}
                    placeholder={isEn ? 'Select source...' : 'اختر المصدر...'}
                  />
                </Field>

                <Field label={isEn ? 'Guest Name' : 'اسم الضيف'} required>
                  <input
                    value={form.guest_name}
                    onChange={e => update('guest_name', e.target.value)}
                    placeholder={isEn ? 'Full name' : 'الاسم الكامل'}
                  />
                </Field>

                <Field label={isEn ? 'Mobile Number' : 'رقم الجوال'}>
                  <input
                    dir="ltr"
                    value={form.guest_phone}
                    onChange={e => update('guest_phone', e.target.value)}
                    placeholder="+966 5X XXX XXXX"
                  />
                </Field>

                <Field label={isEn ? 'Email' : 'البريد الإلكتروني'}>
                  <input
                    type="email"
                    value={form.guest_email}
                    onChange={e => update('guest_email', e.target.value)}
                    placeholder="guest@example.com"
                  />
                </Field>

                <Field label={isEn ? 'Adults Count' : 'عدد البالغين'}>
                  <input
                    type="number"
                    min="1"
                    value={form.adults_count}
                    onChange={e => update('adults_count', Number(e.target.value))}
                  />
                </Field>

                <Field label={isEn ? 'Check-in Date' : 'تاريخ الوصول'} required>
                  <input
                    type="date"
                    min={getTodayIso()}
                    value={form.check_in_date}
                    onChange={e => {
                      const newCheckIn = e.target.value;
                      update('check_in_date', newCheckIn);
                      if (form.check_out_date && form.check_out_date <= newCheckIn) {
                        update('check_out_date', getNextDayIso(newCheckIn));
                      }
                    }}
                  />
                </Field>

                <Field label={isEn ? 'Check-in Time' : 'وقت الوصول'}>
                  <input
                    type="text"
                    value={form.check_in_time}
                    onChange={e => update('check_in_time', e.target.value)}
                    placeholder="03:00 PM"
                  />
                </Field>

                <Field label={isEn ? 'Check-out Date' : 'تاريخ المغادرة'} required>
                  <input
                    type="date"
                    min={form.check_in_date ? getNextDayIso(form.check_in_date) : getTodayIso()}
                    value={form.check_out_date}
                    onChange={e => update('check_out_date', e.target.value)}
                  />
                </Field>

                <Field label={isEn ? 'Check-out Time' : 'وقت المغادرة'}>
                  <input
                    type="text"
                    value={form.check_out_time}
                    onChange={e => update('check_out_time', e.target.value)}
                    placeholder="11:00 AM"
                  />
                </Field>
              </div>
            </section>
          )}

          {step === 2 && mode === 'sync' && (
            <SyncBookingStep
              channel={syncChannel}
              selectedEvent={selectedEvent}
              onChannel={setSyncChannel}
              onSelect={importReservation}
              isEn={isEn}
              currencyLabel={currencyLabel}
            />
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <section className="workflow-content">
              <WorkflowHeading
                icon={<CreditCard size={22} />}
                title={isEn ? 'Payment & Operations Automation' : 'الدفع وأتمتة التشغيل'}
                description={
                  isEn
                    ? 'Specify booking total, payment status, sync settings, and tasks.'
                    : 'حدد مبلغ الحجز وحالة السداد وإعدادات المزامنة والمهام.'
                }
              />
              <div className="workflow-form-grid">
                <Field label={isEn ? 'Total Amount' : 'إجمالي الحجز'}>
                  <div className="money-input">
                    <input
                      type="number"
                      min="0"
                      value={form.total_amount}
                      onChange={e => update('total_amount', Number(e.target.value))}
                    />
                    <span>{currencyLabel}</span>
                  </div>
                </Field>

                <Field label={isEn ? 'Payment Status' : 'حالة الدفع'}>
                  <SearchableSelect
                    options={paymentStatusOptions}
                    value={form.payment_status}
                    onChange={val => update('payment_status', val)}
                    placeholder={isEn ? 'Select payment status...' : 'اختر حالة الدفع...'}
                  />
                </Field>
              </div>

              <div className="automation-list">
                <ToggleRow
                  icon={<CalendarDays size={19} />}
                  title={isEn ? 'Block calendar dates' : 'حجب التواريخ في التقويم'}
                  description={
                    isEn
                      ? 'Prevents direct bookings from conflicting with other channels'
                      : 'يمنع تعارض الحجز المباشر مع الحجوزات الأخرى'
                  }
                  checked={form.block_calendar_dates}
                  onChange={val => update('block_calendar_dates', val)}
                />
                <ToggleRow
                  icon={<MessageCircle size={19} />}
                  title={isEn ? 'Send welcome message' : 'إرسال رسالة ترحيب'}
                  description={
                    isEn
                      ? 'Scheduled automatically upon confirming guest contact info'
                      : 'تُجدول بعد تأكيد بيانات التواصل'
                  }
                  checked={form.send_welcome_message}
                  onChange={val => update('send_welcome_message', val)}
                />
                <ToggleRow
                  icon={<RefreshCw size={19} />}
                  title={isEn ? 'Create cleaning task after checkout' : 'إنشاء مهمة تنظيف بعد المغادرة'}
                  description={
                    isEn
                      ? 'Links to booking and creates a scheduled cleaning task immediately'
                      : 'ترتبط بالحجز وتُنشئ مهمة تنظيف مجدولة فورًا'
                  }
                  checked={form.auto_clean_on_checkout}
                  onChange={val => update('auto_clean_on_checkout', val)}
                />
              </div>

              <Field label={isEn ? 'Booking Notes' : 'ملاحظات الحجز'} full>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => update('notes', e.target.value)}
                  placeholder={
                    isEn
                      ? 'Payment notes or check-in instructions...'
                      : 'ملاحظات الدفع أو تعليمات الوصول...'
                  }
                />
              </Field>
            </section>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <section className="workflow-content">
              <WorkflowHeading
                icon={<CheckCircle2 size={22} />}
                title={isEn ? 'Review Booking Before Saving' : 'راجع الحجز قبل الحفظ'}
                description={
                  isEn
                    ? 'Verify guest and stay details before confirming.'
                    : 'تأكد من صحة بيانات الضيف والإقامة قبل الاعتماد.'
                }
              />
              <div className="booking-review-hero">
                <span className="channel-logo channel-direct">
                  {isEn ? 'D' : 'م'}
                </span>
                <div>
                  <small>{getLocalizedSource(form.booking_source)}</small>
                  <h2>{form.guest_name}</h2>
                  <p>
                    {selectedUnitName || (isEn ? 'Unit' : 'الوحدة')} · {form.check_in_date} {isEn ? 'to' : 'إلى'} {form.check_out_date}
                  </p>
                </div>
                <strong>{form.total_amount} {currencyLabel}</strong>
              </div>

              <div className="workflow-review-grid">
                <ReviewBlock
                  title={isEn ? 'Stay' : 'الإقامة'}
                  rows={[
                    [isEn ? 'Unit' : 'الوحدة', selectedUnitName || '—'],
                    [isEn ? 'Check-in' : 'الوصول', `${form.check_in_date} · ${form.check_in_time}`],
                    [isEn ? 'Check-out' : 'المغادرة', `${form.check_out_date} · ${form.check_out_time}`],
                    [isEn ? 'Guests' : 'الضيوف', `${form.adults_count} ${isEn ? 'adults' : 'بالغين'}`],
                  ]}
                />
                <ReviewBlock
                  title={isEn ? 'Source & Payment' : 'المصدر والدفع'}
                  rows={[
                    [isEn ? 'Source' : 'المصدر', getLocalizedSource(form.booking_source)],
                    [isEn ? 'Payment Status' : 'حالة الدفع', getLocalizedPaymentStatus(form.payment_status)],
                    [isEn ? 'Total' : 'الإجمالي', `${form.total_amount} ${currencyLabel}`],
                  ]}
                />
                <ReviewBlock
                  title={isEn ? 'Automation' : 'الأتمتة'}
                  rows={[
                    [
                      isEn ? 'Calendar Blocking' : 'حجب التقويم',
                      form.block_calendar_dates ? (isEn ? 'Enabled' : 'مفعّل') : (isEn ? 'Disabled' : 'متوقف'),
                    ],
                    [
                      isEn ? 'Welcome Message' : 'رسالة ترحيب',
                      form.send_welcome_message ? (isEn ? 'Enabled' : 'مفعّل') : (isEn ? 'Disabled' : 'متوقف'),
                    ],
                    [
                      isEn ? 'Cleaning Task' : 'مهمة تنظيف',
                      form.auto_clean_on_checkout ? (isEn ? 'Enabled' : 'مفعّل') : (isEn ? 'Disabled' : 'متوقف'),
                    ],
                  ]}
                />
              </div>
            </section>
          )}

          {error && (
            <div className="workflow-error">
              <CircleAlert size={17} />
              {error}
            </div>
          )}

          <WorkflowActions
            step={step}
            saving={saving}
            onBack={() => (step === 1 ? navigate(-1) : setStep(prev => prev - 1))}
            onNext={next}
            onSubmit={submit}
            submitLabel={
              isEdit
                ? (isEn ? 'Save Changes' : 'حفظ التعديلات')
                : (isEn ? 'Create Booking' : 'إنشاء الحجز')
            }
            isEn={isEn}
            isRTL={isRTL}
          />
        </main>

        <aside className="workflow-aside">
          <section className="reference-panel reality-card">
            <span>
              <RefreshCw size={21} />
            </span>
            <h2>{isEn ? 'Conflict-Free Sync' : 'مزامنة بدون تكرار'}</h2>
            <p>
              {isEn
                ? 'Verifies calendar availability and prevents double bookings or overlapping stays.'
                : 'يتم التحقق من عدم وجود أي تعارض في جدول التقويم ومواعيد تسجيل الدخول والخروج.'}
            </p>
          </section>

          <section className="reference-panel workflow-summary">
            <h2>{isEn ? 'Booking Summary' : 'ملخص الحجز'}</h2>
            <StatusLine label={isEn ? 'Source' : 'المصدر'} value={getLocalizedSource(form.booking_source)} />
            <StatusLine
              label={isEn ? 'Unit' : 'الوحدة'}
              value={selectedUnitName || (isEn ? 'Not selected' : 'لم تحدد')}
            />
            <StatusLine
              label={isEn ? 'Guest' : 'الضيف'}
              value={form.guest_name || (isEn ? 'Not specified' : 'لم يحدد')}
            />
            <StatusLine label={isEn ? 'Total' : 'الإجمالي'} value={`${form.total_amount} ${currencyLabel}`} />
          </section>
        </aside>
      </div>
    </div>
  );
}

function BookingSourceStep({
  mode,
  onChoose,
  isEn,
}: {
  mode: 'manual' | 'sync';
  onChoose: (mode: 'manual' | 'sync') => void;
  isEn?: boolean;
}) {
  return (
    <section className="workflow-content">
      <WorkflowHeading
        icon={<BedDouble size={22} />}
        title={isEn ? 'What is the booking source?' : 'ما مصدر الحجز؟'}
        description={
          isEn
            ? 'Connected platforms sync reservations automatically, while direct/phone bookings are entered manually.'
            : 'المنصات المتصلة تُزامن حجوزاتها، أما الحجز الهاتفي أو المباشر فيُدخل يدويًا.'
        }
      />
      <div className="workflow-source-grid">
        <SourceChoice
          selected={mode === 'manual'}
          icon={<UserRound size={28} />}
          title={isEn ? 'Direct Booking' : 'حجز مباشر'}
          description={
            isEn
              ? 'For bookings via phone, WhatsApp, website, or walk-in.'
              : 'للحجوزات عبر الهاتف، واتساب، الموقع أو الاستقبال.'
          }
          items={
            isEn
              ? ['Instant unit availability check', 'Automatic calendar date blocking']
              : ['تحقق فوري من توفر الوحدة', 'حجب التواريخ تلقائيًا']
          }
          onClick={() => onChoose('manual')}
        />
        <SourceChoice
          selected={mode === 'sync'}
          icon={<CloudDownload size={28} />}
          title={isEn ? 'Connected Platform' : 'منصة متصلة'}
          description={
            isEn
              ? 'Review a booking received from Booking.com or Airbnb.'
              : 'راجع حجزًا وصل من Booking.com أو Airbnb.'
          }
          items={
            isEn
              ? ['No need to re-enter platform data', 'Supports modifications and cancellations']
              : ['لا تعيد كتابة بيانات المنصة', 'يدعم التعديلات والإلغاءات']
          }
          onClick={() => onChoose('sync')}
        />
      </div>
    </section>
  );
}

function SyncBookingStep({
  channel,
  selectedEvent,
  onChannel,
  onSelect,
  isEn,
  currencyLabel,
}: {
  channel: string;
  selectedEvent: string;
  onChannel: (channel: string) => void;
  onSelect: (eventId: string) => void;
  isEn?: boolean;
  currencyLabel?: string;
}) {
  return (
    <section className="workflow-content">
      <WorkflowHeading
        icon={<CloudDownload size={22} />}
        title={isEn ? 'Synced Reservations Inbox' : 'صندوق الحجوزات المتزامنة'}
        description={
          isEn
            ? 'Confirm the booking after verifying the linked unit.'
            : 'اعتمد الحجز بعد التأكد من ربط الوحدة الصحيحة.'
        }
      />
      <div className="sync-channel-tabs">
        {channelConnections
          .filter(item => item.id !== 'direct')
          .map(item => (
            <button
              key={item.id}
              type="button"
              disabled={item.status === 'unavailable'}
              className={`${channel === item.id ? 'active' : ''} channel-${item.id}`}
              onClick={() => onChannel(item.id)}
            >
              <span>{item.shortName}</span>
              <div>
                <b>{item.name}</b>
                <small>{item.syncMethod}</small>
              </div>
              <i>
                {item.status === 'unavailable'
                  ? (isEn ? 'Unavailable' : 'غير متاح')
                  : (isEn ? 'Connected' : 'متصل')}
              </i>
            </button>
          ))}
      </div>
      <div className="sync-reservations">
        {syncedReservations
          .filter(item => item.channel === channel)
          .map(item => (
            <button
              key={item.eventId}
              type="button"
              className={selectedEvent === item.eventId ? 'selected' : ''}
              onClick={() => onSelect(item.eventId)}
            >
              <span className={`channel-logo channel-${item.channel}`}>
                {item.channel === 'booking' ? 'B.' : 'A'}
              </span>
              <div>
                <h3>{item.guest}</h3>
                <p>
                  {item.unit} · {item.property}
                </p>
                <small>
                  {item.checkIn} ← {item.checkOut} · {item.guests} {isEn ? 'guests' : 'ضيوف'}
                </small>
              </div>
              <div>
                <b>{item.total} {currencyLabel || (isEn ? 'SAR' : 'ر.س')}</b>
                <small>{item.received}</small>
              </div>
              <i>{selectedEvent === item.eventId && <Check size={15} />}</i>
            </button>
          ))}
      </div>
    </section>
  );
}

function WorkflowStepper({
  step,
  labels,
  onStep,
}: {
  step: number;
  labels: string[];
  onStep: (step: number) => void;
}) {
  return (
    <nav className="workflow-stepper" aria-label="خطوات الإنشاء">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          className={`${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`}
          onClick={() => index + 1 < step && onStep(index + 1)}
        >
          <span>{step > index + 1 ? <Check size={15} /> : index + 1}</span>
          <b>{label}</b>
        </button>
      ))}
    </nav>
  );
}

function WorkflowHeading({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="workflow-heading">
      <span>{icon}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

function SourceChoice({
  selected,
  icon,
  title,
  description,
  items,
  onClick,
}: {
  selected: boolean;
  icon: ReactNode;
  title: string;
  description: string;
  items: string[];
  onClick: () => void;
}) {
  return (
    <button type="button" className={selected ? 'selected' : ''} onClick={onClick}>
      <span>{icon}</span>
      <i>{selected && <Check size={14} />}</i>
      <h3>{title}</h3>
      <p>{description}</p>
      <ul>
        {items.map(item => (
          <li key={item}>
            <Check size={13} />
            {item}
          </li>
        ))}
      </ul>
    </button>
  );
}

function Field({
  label,
  required,
  full,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={`workflow-field ${full ? 'full' : ''}`}>
      <span>
        {label}
        {required && <em>*</em>}
      </span>
      {children}
    </label>
  );
}

function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      className="workflow-toggle-row"
      onClick={() => onChange(!checked)}
    >
      <span>{icon}</span>
      <div>
        <b>{title}</b>
        <small>{description}</small>
      </div>
      <i className={checked ? 'on' : ''} />
    </button>
  );
}

function StatusLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="workflow-status-line">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

function ReviewBlock({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <section>
      <h3>{title}</h3>
      {rows.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </div>
      ))}
    </section>
  );
}

function WorkflowActions({
  step,
  saving,
  onBack,
  onNext,
  onSubmit,
  submitLabel,
  isEn,
  isRTL = true,
}: {
  step: number;
  saving: boolean;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  submitLabel: string;
  isEn?: boolean;
  isRTL?: boolean;
}) {
  return (
    <footer className="workflow-actions">
      <button type="button" className="reference-secondary" onClick={onBack}>
        {step === 1 ? (isEn ? 'Cancel' : 'إلغاء') : (isEn ? 'Back' : 'السابق')}
      </button>
      <span>
        {isEn ? `Step ${step} of 4` : `الخطوة ${step} من 4`}
      </span>
      {step < 4 ? (
        <button type="button" className="reference-primary" onClick={onNext}>
          {isEn ? 'Next' : 'التالي'}
          {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      ) : (
        <button
          type="button"
          className="reference-primary"
          disabled={saving}
          onClick={onSubmit}
        >
          {saving ? <LoaderCircle className="workflow-spinner" size={17} /> : <Check size={17} />}
          {saving ? (isEn ? 'Saving...' : 'جارٍ الحفظ...') : submitLabel}
        </button>
      )}
    </footer>
  );
}

function WorkflowSuccess({
  icon,
  eyebrow,
  title,
  description,
  primary,
  primaryTo,
  secondary,
  onSecondary,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  primary: string;
  primaryTo: string;
  secondary: string;
  onSecondary: () => void;
}) {
  return (
    <div className="reference-page workflow-page">
      <section className="workflow-success reference-panel">
        <span>{icon}</span>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <small>{description}</small>
        <div>
          <Link className="reference-primary" to={primaryTo}>
            {primary}
          </Link>
          <button type="button" className="reference-secondary" onClick={onSecondary}>
            {secondary}
          </button>
        </div>
      </section>
    </div>
  );
}
