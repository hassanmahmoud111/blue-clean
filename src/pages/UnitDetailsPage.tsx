import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Activity, BedDouble, Building2, CalendarDays, CheckCircle2, ChevronLeft,
  Clock3, CreditCard, DoorOpen, ExternalLink, FileText, KeyRound, MapPin,
  MessageCircle, Plus, RefreshCw, Sparkles, Star, UsersRound,
} from 'lucide-react';
import { getUnitDetail } from '../data/detailRecords';
import './reference-pages.css';
import './details-pages.css';

export default function UnitDetailsPage() {
  const { unitId } = useParams();
  const unit = getUnitDetail(unitId);
  if (!unit) return <Navigate to="/app/units" replace/>;

  return <div className="reference-page details-page unit-details-page">
    <header className="detail-page-header"><div><div className="reference-breadcrumb"><Link to="/app/units">الوحدات</Link><ChevronLeft size={13}/><span>{unit.name}</span></div><div className="detail-title-row"><span className={`ref-thumbnail ${unit.imageClass}`}/><div><h1>{unit.name}<small>{unit.code}</small></h1><p><Building2 size={13}/>{unit.property}<i/> <MapPin size={13}/>{unit.city}، {unit.district}</p></div><span className={`reference-chip ${unit.statusTone}`}>{unit.status}</span></div></div><div className="detail-header-actions"><Link className="reference-secondary" to={`/app/new/cleaning?unit=${unit.id}`}><Sparkles size={16}/>طلب تنظيف</Link><Link className="reference-secondary" to={`/app/new/booking?unit=${unit.id}`}><CalendarDays size={16}/>إضافة حجز</Link><Link className="reference-primary" to={`/app/units/${unit.id}/edit`}><FileText size={16}/>تعديل البيانات</Link></div></header>

    <section className="detail-metrics"><Metric icon={<Activity size={22}/>} label="نسبة الإشغال" value={unit.metrics.occupancy} tone="blue"/><Metric icon={<CreditCard size={22}/>} label="إيرادات الشهر" value={unit.metrics.revenue} tone="green"/><Metric icon={<CheckCircle2 size={22}/>} label="مهام مكتملة" value={unit.metrics.completedTasks} tone="violet"/><Metric icon={<Star size={22}/>} label="تقييم الوحدة" value={unit.metrics.rating} tone="orange"/></section>

    <div className="unit-detail-grid">
      <main className="detail-main-column">
        <section className="reference-panel detail-card unit-overview-card"><CardTitle icon={<Building2 size={19}/>} title="معلومات الوحدة" subtitle="البيانات الثابتة والتشغيلية الأساسية"/><div className="unit-gallery"><span className="unit-photo-large"><i className={`ref-thumbnail ${unit.imageClass}`}/></span><div><span className="unit-photo-small"><i className="ref-thumbnail u2"/></span><span className="unit-photo-small"><i className="ref-thumbnail u3"/></span><button>عرض كل الصور<ExternalLink size={14}/></button></div></div><div className="detail-info-grid"><Info label="نوع الوحدة" value={unit.type}/><Info label="نمط الإدارة" value={unit.managementMode}/><Info label="العقار" value={unit.property}/><Info label="العنوان" value={unit.address}/><Info label="المدينة والحي" value={`${unit.city}، ${unit.district}`}/><Info label="كود الوحدة" value={unit.code}/></div><div className="capacity-strip"><Capacity icon={<UsersRound size={20}/>} value={unit.capacity.guests} label="ضيوف"/><Capacity icon={<BedDouble size={20}/>} value={unit.capacity.bedrooms} label="غرف نوم"/><Capacity icon={<BedDouble size={20}/>} value={unit.capacity.beds} label="أسرّة"/><Capacity icon={<DoorOpen size={20}/>} value={unit.capacity.bathrooms} label="دورات مياه"/></div></section>

        <section className="reference-panel detail-card"><CardTitle icon={<CalendarDays size={19}/>} title="الحجوزات" subtitle="الحجز الحالي وأقرب حجز قادم" action={<Link to={`/app/new/booking?unit=${unit.id}`}>إضافة حجز<Plus size={14}/></Link>}/><div className="booking-detail-grid">{unit.currentBooking?<BookingCard title="الحجز الحالي" booking={unit.currentBooking} active/>:<EmptyMini text="لا يوجد ضيف حاليًا"/>}{unit.nextBooking?<BookingCard title="الحجز القادم" booking={unit.nextBooking}/>:<EmptyMini text="لا يوجد حجز قادم"/>}</div></section>

        <section className="reference-panel detail-card"><CardTitle icon={<Sparkles size={19}/>} title="التشغيل والخدمات" subtitle="المهام القادمة والمرتبطة بهذه الوحدة" action={<Link to={`/app/new/cleaning?unit=${unit.id}`}>إنشاء طلب<Plus size={14}/></Link>}/><div className="unit-operation-list">{unit.upcomingOperations.map(item=>{const section=item.type==='صيانة'?'maintenance':item.type==='خدمة إضافية'?'services':'cleaning';return <Link to={`/app/operations/${section}/${item.id}`} key={item.id}><span className="detail-operation-icon"><Sparkles size={18}/></span><div><b>{item.type}</b><small>{item.id} · {item.date}</small></div><span>{item.assignee}</span><i className={`reference-chip ${item.tone}`}>{item.status}</i><ChevronLeft size={16}/></Link>})}</div></section>
      </main>

      <aside className="detail-side-column">
        <section className="reference-panel detail-card"><CardTitle icon={<Clock3 size={19}/>} title="إعدادات الإقامة"/><div className="compact-info-list"><InfoRow icon={<Clock3 size={16}/>} label="تسجيل الدخول" value={unit.stayDefaults.checkIn}/><InfoRow icon={<Clock3 size={16}/>} label="تسجيل الخروج" value={unit.stayDefaults.checkOut}/><InfoRow icon={<Sparkles size={16}/>} label="مدة التنظيف" value={`${unit.stayDefaults.cleaningMinutes} دقيقة`}/><InfoRow icon={<KeyRound size={16}/>} label="طريقة الدخول" value={unit.stayDefaults.access}/></div></section>

        <section className="reference-panel detail-card"><CardTitle icon={<RefreshCw size={19}/>} title="المنصات والمزامنة" subtitle={unit.integrations.length?'حالة الربط وآخر مزامنة':'هذه الوحدة تعمل بدون منصات'}/>{unit.integrations.length?<div className="integration-detail-list">{unit.integrations.map(item=><div key={item.name}><span className={`platform-square ${item.name==='Booking.com'?'booking':'airbnb'}`}>{item.name==='Booking.com'?'B.':'A'}</span><div><b>{item.name}</b><small>{item.listingId}</small></div><span><i className={item.tone}/>{item.status}<small>{item.lastSync}</small></span></div>)}</div>:<div className="standalone-unit-state"><Sparkles size={24}/><b>تشغيل مستقل</b><p>يمكن إنشاء تنظيف وخدمات دورية من التشغيل والخدمات دون الحاجة لمزامنة حجوزات.</p></div>}</section>

        <section className="reference-panel detail-card"><CardTitle icon={<MessageCircle size={19}/>} title="ملاحظات ثابتة"/><ul className="unit-notes">{unit.notes.map(note=><li key={note}>{note}</li>)}</ul></section>

        <section className="reference-panel detail-card"><CardTitle icon={<Activity size={19}/>} title="آخر النشاطات"/><div className="detail-activity-list">{unit.activity.map(item=><div key={item.title}><i className={item.tone}/><span><b>{item.title}</b><small>{item.time}</small></span></div>)}</div></section>
      </aside>
    </div>
  </div>;
}

function Metric({icon,label,value,tone}:{icon:ReactNode;label:string;value:string;tone:string}){return <article className="reference-panel"><span className={tone}>{icon}</span><div><small>{label}</small><strong>{value}</strong></div></article>}
function CardTitle({icon,title,subtitle,action}:{icon:ReactNode;title:string;subtitle?:string;action?:ReactNode}){return <header className="detail-card-title"><span>{icon}</span><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div>{action}</header>}
function Info({label,value}:{label:string;value:string}){return <div className="detail-info"><span>{label}</span><b>{value}</b></div>}
function Capacity({icon,value,label}:{icon:ReactNode;value:number;label:string}){return <div>{icon}<span><b>{value}</b><small>{label}</small></span></div>}
function InfoRow({icon,label,value}:{icon:ReactNode;label:string;value:string}){return <div>{icon}<span>{label}</span><b>{value}</b></div>}
function EmptyMini({text}:{text:string}){return <div className="detail-empty-mini"><CalendarDays size={23}/><b>{text}</b></div>}
function BookingCard({title,booking,active}:{title:string;booking:{id:string;guest:string;channel:string;checkIn:string;checkOut:string;guests?:number;amount?:string};active?:boolean}){return <article className={active?'active':''}><header><span>{title}</span><i>{booking.channel}</i></header><h3>{booking.guest}</h3><small>{booking.id}</small><div><span>الوصول<b>{booking.checkIn}</b></span><span>المغادرة<b>{booking.checkOut}</b></span></div>{booking.amount&&<footer><span>{booking.guests} ضيوف</span><strong>{booking.amount}</strong></footer>}</article>}
