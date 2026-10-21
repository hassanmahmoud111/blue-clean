import { useState, useEffect, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import {
  Activity, BrushCleaning, Building2, CalendarDays, Check, CheckCircle2, ChevronLeft, ChevronRight, CircleDollarSign,
  ClipboardCheck, Edit3, FileImage, FileText, MapPin, Phone, Plus, RefreshCw, Settings2, UserRound, Wrench,
} from 'lucide-react';
import { getOperationDetail } from '../data/detailRecords';
import { fetchClientOperationDetail } from '../services/workflowService';
import type { OperationDetailRecord } from '../types/details';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedUnitName, getLocalizedPropertyName } from '../utils/unitTranslations';
import PublicLoadingScreen from '../components/PublicLoadingScreen';
import './reference-pages.css';
import './details-pages.css';

export default function OperationDetailsPage() {
  const { operationId } = useParams<{ operationId: string }>();
  const location = useLocation();
  const { lang, isRTL } = useLanguage();

  const kindHint: 'cleaning' | 'maintenance' | 'service' | undefined = location.pathname.includes('/cleaning')
    ? 'cleaning'
    : location.pathname.includes('/maintenance')
      ? 'maintenance'
      : location.pathname.includes('/services')
        ? 'service'
        : undefined;

  const initialRecord = operationId ? getOperationDetail(operationId) ?? null : null;
  const [task, setTask] = useState<OperationDetailRecord | null>(initialRecord);
  const [loading, setLoading] = useState<boolean>(!initialRecord && Boolean(operationId));

  useEffect(() => {
    if (!operationId) return;
    let active = true;

    fetchClientOperationDetail(operationId, kindHint)
      .then((record) => {
        if (active && record) {
          setTask(record);
        }
      })
      .catch(() => {
        // keep initial if any
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [operationId, kindHint]);

  if (loading) {
    return <PublicLoadingScreen />;
  }

  if (!task) {
    return <Navigate to="/app/operations" replace />;
  }

  const TaskIcon = task.kind === 'cleaning' ? BrushCleaning : task.kind === 'maintenance' ? Wrench : Settings2;
  const section =
    task.kind === 'cleaning'
      ? { slug: 'cleaning', label: lang === 'en' ? 'Cleaning' : 'النظافة' }
      : task.kind === 'maintenance'
        ? { slug: 'maintenance', label: lang === 'en' ? 'Maintenance' : 'الصيانة' }
        : { slug: 'services', label: lang === 'en' ? 'Extra Services' : 'الخدمات الإضافية' };

  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className={`reference-page details-page operation-details-page ${task.kind}`}>
      <header className="detail-page-header">
        <div>
          <div className="reference-breadcrumb">
            <span>{lang === 'en' ? 'Operations & Services' : 'التشغيل والخدمات'}</span>
            <Chevron size={13} />
            <Link to={`/app/operations/${section.slug}`}>{section.label}</Link>
            <Chevron size={13} />
            <span>{task.id}</span>
          </div>
          <div className="operation-detail-heading">
            <span>
              <TaskIcon size={25} />
            </span>
            <div>
              <h1>
                {task.title}
                <small>{task.id}</small>
              </h1>
              <p>{task.subtitle}</p>
            </div>
            <span className={`reference-chip ${task.statusTone || 'blue'}`}>{task.status}</span>
            <span className={`reference-chip ${task.priorityTone || 'blue'}`}>{task.priority}</span>
          </div>
        </div>
        <div className="detail-header-actions">
          <Link className="reference-secondary" to={`/app/new/${task.kind}?unit=${task.unitCode || ''}`}>
            <Plus size={16} />
            {lang === 'en' ? 'Create Similar' : 'إنشاء طلب مشابه'}
          </Link>
          <Link className="reference-secondary" to={`/app/operations/${section.slug}/${task.id}/edit`}>
            <Edit3 size={16} />
            {lang === 'en' ? 'Edit Request' : 'تعديل الطلب'}
          </Link>
          <button className="reference-primary" type="button">
            <CheckCircle2 size={16} />
            {lang === 'en' ? 'Update Status' : 'تحديث الحالة'}
          </button>
        </div>
      </header>

      <section className="operation-status-strip">
        <div>
          <span>{lang === 'en' ? 'Current Status' : 'الحالة الحالية'}</span>
          <b>{task.status}</b>
        </div>
        <i />
        <div>
          <span>{lang === 'en' ? 'Scheduled Time' : 'موعد التنفيذ'}</span>
          <b>
            {task.schedule.date} · {task.schedule.start}
          </b>
        </div>
        <i />
        <div>
          <span>{lang === 'en' ? 'Assignee' : 'المسؤول'}</span>
          <b>{task.assignee.name}</b>
        </div>
        <i />
        <div>
          <span>{lang === 'en' ? 'Source' : 'مصدر الطلب'}</span>
          <b>{task.source}</b>
        </div>
      </section>

      <div className="operation-detail-grid">
        <main className="detail-main-column">
          <section className="reference-panel detail-card">
            <CardTitle
              icon={<ClipboardCheck size={19} />}
              title={lang === 'en' ? 'Request Details' : 'تفاصيل الطلب'}
              subtitle={lang === 'en' ? 'Required information to complete execution' : 'المعلومات المطلوبة لإتمام التنفيذ'}
            />
            <div className="operation-description">
              <p>{task.description}</p>
            </div>
            <div className="detail-info-grid">
              <Info label={lang === 'en' ? 'Service Type' : 'نوع الخدمة'} value={task.title} />
              <Info label={lang === 'en' ? 'Priority' : 'الأولوية'} value={task.priority} />
              <Info label={lang === 'en' ? 'Execution Date' : 'تاريخ التنفيذ'} value={task.schedule.date} />
              <Info label={lang === 'en' ? 'Start Time' : 'وقت البدء'} value={task.schedule.start} />
              <Info label={lang === 'en' ? 'Due Time' : 'وقت الإنجاز'} value={task.schedule.due} />
              <Info label={lang === 'en' ? 'Duration' : 'المدة المتوقعة'} value={task.schedule.duration} />
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<Check size={19} />}
              title={lang === 'en' ? 'Checklist & Scope' : 'نطاق التنفيذ وقائمة الفحص'}
              subtitle={
                lang === 'en'
                  ? `${task.checklist.filter((item) => item.done).length} of ${task.checklist.length} items completed`
                  : `${task.checklist.filter((item) => item.done).length} من ${task.checklist.length} عناصر مكتملة`
              }
            />
            <div className="detail-checklist">
              {task.checklist.map((item) => (
                <div className={item.done ? 'done' : ''} key={item.title}>
                  <span>{item.done && <Check size={15} />}</span>
                  <b>{item.title}</b>
                  <small>
                    {item.done
                      ? lang === 'en'
                        ? 'Completed'
                        : 'تم التنفيذ'
                      : lang === 'en'
                        ? 'Pending'
                        : 'بانتظار التنفيذ'}
                  </small>
                </div>
              ))}
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle
              icon={<Activity size={19} />}
              title={lang === 'en' ? 'Activity Timeline' : 'سجل الطلب'}
              subtitle={lang === 'en' ? 'Chronological timeline of changes' : 'كل تغيير محفوظ بترتيبه الزمني'}
            />
            <div className="operation-timeline">
              {task.timeline.map((item, index) => (
                <div className={item.done ? 'done' : ''} key={item.title}>
                  <span>{item.done ? <Check size={14} /> : index + 1}</span>
                  <div>
                    <b>{item.title}</b>
                    <small>{item.detail}</small>
                  </div>
                  <time>{item.time}</time>
                </div>
              ))}
            </div>
          </section>
        </main>

        <aside className="detail-side-column">
          <section className="reference-panel detail-card unit-link-card">
            <CardTitle icon={<Building2 size={19} />} title={lang === 'en' ? 'Linked Unit' : 'الوحدة المرتبطة'} />
            <Link to={`/app/units/${task.unitCode || ''}`}>
              <span className={`ref-thumbnail ${task.imageClass || 'ph-living'}`} />
              <div>
                <b>{getLocalizedUnitName(task.unit, task.unitCode, lang)}</b>
                <small>{getLocalizedPropertyName(task.property, task.unitCode, lang)}</small>
                <em>
                  <MapPin size={12} />
                  {lang === 'en' ? 'View Unit' : 'عرض بيانات الوحدة'}
                </em>
              </div>
              <Chevron size={16} />
            </Link>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle icon={<UserRound size={19} />} title={lang === 'en' ? 'Assignee' : 'المسؤول عن التنفيذ'} />
            <div className="assignee-detail">
              <span>{task.assignee.name[0] || '—'}</span>
              <div>
                <b>{task.assignee.name}</b>
                <small>{task.assignee.type}</small>
              </div>
            </div>
            {task.assignee.phone && (
              <a className="contact-assignee" href={`tel:${task.assignee.phone}`}>
                <Phone size={15} />
                {task.assignee.phone}
              </a>
            )}
          </section>

          {task.linkedBooking && (
            <section className="reference-panel detail-card">
              <CardTitle icon={<CalendarDays size={19} />} title={lang === 'en' ? 'Linked Booking' : 'الحجز المرتبط'} />
              <div className="linked-booking">
                <span>{task.linkedBooking.channel}</span>
                <b>{task.linkedBooking.guest}</b>
                <small>{task.linkedBooking.id}</small>
                <p>
                  {lang === 'en' ? 'Checkout: ' : 'المغادرة: '}
                  {task.linkedBooking.checkout}
                </p>
              </div>
            </section>
          )}

          <section className="reference-panel detail-card">
            <CardTitle icon={<CircleDollarSign size={19} />} title={lang === 'en' ? 'Costs' : 'التكاليف'} />
            <div className="cost-list">
              {task.costs.map((item, index) => (
                <div className={index === task.costs.length - 1 ? 'total' : ''} key={item.label}>
                  <span>{item.label}</span>
                  <b>{item.value}</b>
                </div>
              ))}
            </div>
          </section>

          <section className="reference-panel detail-card">
            <CardTitle icon={<FileImage size={19} />} title={lang === 'en' ? 'Attachments' : 'المرفقات'} />
            <div className="attachment-list">
              {task.attachments.length > 0 ? (
                task.attachments.map((item) => (
                  <button type="button" key={item.name}>
                    {item.type === 'صورة' ? <FileImage size={17} /> : <FileText size={17} />}
                    <span>
                      <b>{item.name}</b>
                      <small>{item.type}</small>
                    </span>
                  </button>
                ))
              ) : (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {lang === 'en' ? 'No attachments' : 'لا توجد مرفقات'}
                </span>
              )}
            </div>
          </section>

          <section className="reference-panel sync-source-note">
            <RefreshCw size={19} />
            <div>
              <b>{lang === 'en' ? 'Reliable & Traceable Source' : 'مصدر موثوق وقابل للتتبع'}</b>
              <p>
                {task.source === 'حجز متزامن' || task.source === 'مرتبط بحجز'
                  ? lang === 'en'
                    ? 'Created from a reservation event with deduplication keys.'
                    : 'تم إنشاء الطلب من حدث حجز مع الاحتفاظ بمعرّف الحدث لمنع التكرار.'
                  : lang === 'en'
                    ? 'Created inside BluClean platform.'
                    : 'تم إنشاء الطلب داخل BluClean ولا يعتمد على مزامنة منصة خارجية.'}
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function CardTitle({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
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

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="detail-info">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}
