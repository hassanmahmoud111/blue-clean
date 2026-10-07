import type { ReactNode } from 'react';
import { BrushCleaning, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Clock3, Eye, ListChecks, Pencil, Plus, Search, Settings2, Sparkles, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import { operationDetails } from '../data/detailRecords';
import type { OperationDetailRecord } from '../types/details';
import './reference-pages.css';

type OperationPageKind = OperationDetailRecord['kind'];

const pageConfig = {
  cleaning: { title:'النظافة', description:'إدارة طلبات التنظيف الدورية والمرتبطة بمغادرة الضيوف', icon:BrushCleaning, create:'/app/new/cleaning', createLabel:'طلب تنظيف جديد', route:'cleaning', popular:'أكثر الوحدات طلبًا للتنظيف', noun:'طلب تنظيف' },
  maintenance: { title:'الصيانة', description:'متابعة البلاغات والإصلاحات والفحوصات الوقائية لكل وحدة', icon:Wrench, create:'/app/new/maintenance', createLabel:'إنشاء طلب صيانة', route:'maintenance', popular:'أكثر الوحدات طلبًا للصيانة', noun:'طلب صيانة' },
  service: { title:'الخدمات الإضافية', description:'إدارة التعقيم والغسيل وتجهيز الضيافة والخدمات المخصصة', icon:Settings2, create:'/app/new/service', createLabel:'طلب خدمة جديدة', route:'services', popular:'أكثر الوحدات طلبًا للخدمات', noun:'طلب خدمة' },
} as const;

export default function OperationsPage({kind}:{kind:OperationPageKind}){
  const config=pageConfig[kind];
  const PageIcon=config.icon;
  const tasks=operationDetails.filter(task=>task.kind===kind);
  const count=(status:string)=>tasks.filter(task=>task.status===status).length;
  return <div className={`reference-page operations-page operation-category-page ${kind}`}>
    <header className="reference-page-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><span>الرئيسية</span><ChevronLeft size={13}/><span>التشغيل والخدمات</span><ChevronLeft size={13}/><span>{config.title}</span></div><h1><PageIcon size={28}/>{config.title}</h1><p>{config.description}</p></div><div className="reference-page-actions"><Link className="reference-primary" to={config.create}><Plus size={19}/>{config.createLabel}</Link></div></header>
    <div className="operations-layout">
      <section className="reference-panel operations-table-card">
        <div className="operations-metrics"><OperationMetric label="بانتظار التعيين" value={`${count('بانتظار التعيين')}`} icon={<Clock3 size={20}/>}/><OperationMetric label="قيد التنفيذ" value={`${count('قيد التنفيذ')}`} icon={<Clock3 size={20}/>}/><OperationMetric label="قيد المراجعة" value={`${count('قيد المراجعة')}`} icon={<Eye size={20}/>}/><OperationMetric label="مكتملة" value={`${count('مكتملة')}`} icon={<CheckCircle2 size={20}/>}/><OperationMetric label="إجمالي الطلبات" value={`${tasks.length}`} icon={<ListChecks size={20}/>}/></div>
        <div className="operations-filters"><button className="reference-control">اختر التاريخ<Clock3 size={16}/></button><label className="reference-search"><Search size={17}/><input placeholder="ابحث عن وحدة أو عنوان ..."/></label><button className="reference-control">جميع العقارات<ChevronDown size={14}/></button><button className="reference-control">جميع الحالات<ChevronDown size={14}/></button><button className="reference-control">كل الأولويات<ChevronDown size={14}/></button></div>
        <table className="reference-table">
          <thead>
            <tr>
              <th>الوحدة</th>
              <th>نوع الخدمة</th>
              <th>المسؤول</th>
              <th>الوقت المجدول</th>
              <th>الحالة</th>
              <th>الأولوية</th>
              <th style={{ textAlign: 'center' }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>
                  <div className="operation-unit">
                    <span className={`ref-thumbnail ${task.imageClass}`} />
                    <span>
                      <strong>{task.unit}</strong>
                      <small>{task.property}</small>
                    </span>
                  </div>
                </td>
                <td>
                  <strong>{task.title}</strong>
                  <small>{task.id} · {task.source}</small>
                </td>
                <td>
                  {task.assignee.name === 'غير معيّن' ? (
                    '-'
                  ) : (
                    <span className="worker">
                      <i className="worker-avatar">{task.assignee.name[0]}</i>
                      <strong>{task.assignee.name}</strong>
                    </span>
                  )}
                </td>
                <td>
                  <strong>{task.schedule.date}</strong>
                  <small>{task.schedule.start} - {task.schedule.due}</small>
                </td>
                <td>
                  <span className={`reference-chip ${task.statusTone}`}>{task.status}</span>
                </td>
                <td>
                  <span className={`reference-chip ${task.priorityTone}`}>{task.priority}</span>
                </td>
                <td>
                  <div className="table-actions-cell">
                    <Tooltip text="عرض التفاصيل">
                      <Link
                        to={`/app/operations/${config.route}/${task.id}`}
                        className="table-icon-btn primary"
                        aria-label={`عرض تفاصيل الطلب ${task.id}`}
                      >
                        <Eye size={16} />
                      </Link>
                    </Tooltip>
                    <Tooltip text="تعديل الطلب">
                      <Link
                        to={`/app/operations/${config.route}/${task.id}/edit`}
                        className="table-icon-btn edit"
                        aria-label={`تعديل الطلب ${task.id}`}
                      >
                        <Pencil size={15} />
                      </Link>
                    </Tooltip>
                    <Tooltip text="طلب جديد للوحدة">
                      <Link
                        to={`${config.create}?unit=${task.unitCode}`}
                        className="table-icon-btn clean"
                        aria-label={`إنشاء طلب جديد للوحدة ${task.unitCode}`}
                      >
                        <Plus size={15} />
                      </Link>
                    </Tooltip>
                    <Tooltip text="عرض الوحدة">
                      <Link
                        to={`/app/units/${task.unitCode}`}
                        className="table-icon-btn maintenance"
                        aria-label={`عرض الوحدة ${task.unitCode}`}
                      >
                        <Sparkles size={15} />
                      </Link>
                    </Tooltip>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tasks.length===0&&<div className="operations-empty"><PageIcon size={28}/><b>لا توجد طلبات في هذا القسم</b><p>يمكنك إنشاء أول {config.noun} من الزر أعلى الصفحة.</p></div>}
        <footer className="reference-pagination"><div className="page-size">عدد العناصر في الصفحة <button className="reference-control">5<ChevronDown size={14}/></button></div><span>عرض 1 - {tasks.length} من {tasks.length} طلب</span><div className="pagination-buttons"><button><ChevronLeft size={16}/></button><button className="active">1</button><button><ChevronRight size={16}/></button></div></footer>
      </section>
      <aside className="operations-side">
        <section className="reference-panel mini-side-card"><div className="reference-panel-title"><h2>أداء {config.title} هذا الشهر</h2><small>طلب</small></div><div className="mini-chart">{[[25,38,31],[43,70,35],[28,65,45]].map((bars,index)=><div className="mini-chart-group" key={index}>{bars.map((height,i)=><i key={i} style={{height:`${height}%`,background:['#e5f1fb','#45bed0','#09658b'][i]}}/>)}</div>)}</div></section>
        <section className="reference-panel mini-side-card"><div className="reference-panel-title"><h2>{config.popular}</h2><small>طلب</small></div>{tasks.slice(0,3).map(task=><Link className="popular-unit" to={`/app/units/${task.unitCode}`} key={task.id}><span className={`ref-thumbnail ${task.imageClass}`}/><span><strong>{task.unit}</strong><small>{task.property}</small></span></Link>)}</section>
        <section className="reference-panel mini-side-card"><div className="reference-panel-title"><h2>أحدث الأنشطة</h2><button className="reference-link">عرض الكل</button></div>{tasks.slice(0,4).map((task,index)=><Activity key={task.id} color={['green','orange','blue','red'][index%4]} text={`تم تحديث ${task.title} في ${task.unit}`} time={index===0?'منذ 10 دقائق':`منذ ${index+1} ساعة`}/>)}</section>
      </aside>
    </div>
  </div>
}

function OperationMetric({label,value,icon}:{label:string;value:string;icon:ReactNode}){return <div className="operation-metric"><span><strong>{value}</strong>{label}</span><i>{icon}</i></div>}
function Activity({color,text,time}:{color:string;text:string;time:string}){return <div className="activity-row"><i className={`activity-dot ${color}`}>•</i><div><b>{text}</b><small>{time}</small></div></div>}
