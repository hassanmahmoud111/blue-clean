import type { ReactNode } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  Activity, BrushCleaning, Building2, CalendarDays, Check, CheckCircle2, ChevronLeft, CircleDollarSign,
  ClipboardCheck, Edit3, FileImage, FileText, MapPin, Phone, Plus, RefreshCw, Settings2, UserRound, Wrench,
} from 'lucide-react';
import { getOperationDetail } from '../data/detailRecords';
import './reference-pages.css';
import './details-pages.css';

export default function OperationDetailsPage(){
  const { operationId }=useParams();
  const task=getOperationDetail(operationId);
  if(!task)return <Navigate to="/app/operations" replace/>;
  const TaskIcon = task.kind === 'cleaning' ? BrushCleaning : task.kind === 'maintenance' ? Wrench : Settings2;
  const section = task.kind === 'cleaning' ? {slug:'cleaning',label:'النظافة'} : task.kind === 'maintenance' ? {slug:'maintenance',label:'الصيانة'} : {slug:'services',label:'الخدمات الإضافية'};
  return <div className={`reference-page details-page operation-details-page ${task.kind}`}>
    <header className="detail-page-header"><div><div className="reference-breadcrumb"><span>التشغيل والخدمات</span><ChevronLeft size={13}/><Link to={`/app/operations/${section.slug}`}>{section.label}</Link><ChevronLeft size={13}/><span>{task.id}</span></div><div className="operation-detail-heading"><span><TaskIcon size={25}/></span><div><h1>{task.title}<small>{task.id}</small></h1><p>{task.subtitle}</p></div><span className={`reference-chip ${task.statusTone}`}>{task.status}</span><span className={`reference-chip ${task.priorityTone}`}>{task.priority}</span></div></div><div className="detail-header-actions"><Link className="reference-secondary" to={`/app/new/${task.kind}?unit=${task.unitCode}`}><Plus size={16}/>إنشاء طلب مشابه</Link><Link className="reference-secondary" to={`/app/operations/${section.slug}/${task.id}/edit`}><Edit3 size={16}/>تعديل الطلب</Link><button className="reference-primary"><CheckCircle2 size={16}/>تحديث الحالة</button></div></header>
    <section className="operation-status-strip"><div><span>الحالة الحالية</span><b>{task.status}</b></div><i/><div><span>موعد التنفيذ</span><b>{task.schedule.date} · {task.schedule.start}</b></div><i/><div><span>المسؤول</span><b>{task.assignee.name}</b></div><i/><div><span>مصدر الطلب</span><b>{task.source}</b></div></section>
    <div className="operation-detail-grid"><main className="detail-main-column">
      <section className="reference-panel detail-card"><CardTitle icon={<ClipboardCheck size={19}/>} title="تفاصيل الطلب" subtitle="المعلومات المطلوبة لإتمام التنفيذ"/><div className="operation-description"><p>{task.description}</p></div><div className="detail-info-grid"><Info label="نوع الخدمة" value={task.title}/><Info label="الأولوية" value={task.priority}/><Info label="تاريخ التنفيذ" value={task.schedule.date}/><Info label="وقت البدء" value={task.schedule.start}/><Info label="وقت الإنجاز" value={task.schedule.due}/><Info label="المدة المتوقعة" value={task.schedule.duration}/></div></section>
      <section className="reference-panel detail-card"><CardTitle icon={<Check size={19}/>} title="نطاق التنفيذ وقائمة الفحص" subtitle={`${task.checklist.filter(item=>item.done).length} من ${task.checklist.length} عناصر مكتملة`}/><div className="detail-checklist">{task.checklist.map(item=><div className={item.done?'done':''} key={item.title}><span>{item.done&&<Check size={15}/>}</span><b>{item.title}</b><small>{item.done?'تم التنفيذ':'بانتظار التنفيذ'}</small></div>)}</div></section>
      <section className="reference-panel detail-card"><CardTitle icon={<Activity size={19}/>} title="سجل الطلب" subtitle="كل تغيير محفوظ بترتيبه الزمني"/><div className="operation-timeline">{task.timeline.map((item,index)=><div className={item.done?'done':''} key={item.title}><span>{item.done?<Check size={14}/>:index+1}</span><div><b>{item.title}</b><small>{item.detail}</small></div><time>{item.time}</time></div>)}</div></section>
    </main><aside className="detail-side-column">
      <section className="reference-panel detail-card unit-link-card"><CardTitle icon={<Building2 size={19}/>} title="الوحدة المرتبطة"/><Link to={`/app/units/${task.unitCode}`}><span className={`ref-thumbnail ${task.imageClass}`}/><div><b>{task.unit}</b><small>{task.property}</small><em><MapPin size={12}/>عرض بيانات الوحدة</em></div><ChevronLeft size={16}/></Link></section>
      <section className="reference-panel detail-card"><CardTitle icon={<UserRound size={19}/>} title="المسؤول عن التنفيذ"/><div className="assignee-detail"><span>{task.assignee.name[0]}</span><div><b>{task.assignee.name}</b><small>{task.assignee.type}</small></div></div><a className="contact-assignee" href={`tel:${task.assignee.phone}`}><Phone size={15}/>{task.assignee.phone}</a></section>
      {task.linkedBooking&&<section className="reference-panel detail-card"><CardTitle icon={<CalendarDays size={19}/>} title="الحجز المرتبط"/><div className="linked-booking"><span>{task.linkedBooking.channel}</span><b>{task.linkedBooking.guest}</b><small>{task.linkedBooking.id}</small><p>المغادرة: {task.linkedBooking.checkout}</p></div></section>}
      <section className="reference-panel detail-card"><CardTitle icon={<CircleDollarSign size={19}/>} title="التكاليف"/><div className="cost-list">{task.costs.map((item,index)=><div className={index===task.costs.length-1?'total':''} key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}</div></section>
      <section className="reference-panel detail-card"><CardTitle icon={<FileImage size={19}/>} title="المرفقات"/><div className="attachment-list">{task.attachments.map(item=><button key={item.name}>{item.type==='صورة'?<FileImage size={17}/>:<FileText size={17}/>}<span><b>{item.name}</b><small>{item.type}</small></span></button>)}</div></section>
      <section className="reference-panel sync-source-note"><RefreshCw size={19}/><div><b>مصدر موثوق وقابل للتتبع</b><p>{task.source==='حجز متزامن'?'تم إنشاء الطلب من حدث حجز مع الاحتفاظ بمعرّف الحدث لمنع التكرار.':'تم إنشاء الطلب داخل BluClean ولا يعتمد على مزامنة منصة خارجية.'}</p></div></section>
    </aside></div>
  </div>
}

function CardTitle({icon,title,subtitle}:{icon:ReactNode;title:string;subtitle?:string}){return <header className="detail-card-title"><span>{icon}</span><div><h2>{title}</h2>{subtitle&&<p>{subtitle}</p>}</div></header>}
function Info({label,value}:{label:string;value:string}){return <div className="detail-info"><span>{label}</span><b>{value}</b></div>}
