import { useState, useEffect, type ChangeEvent, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BrushCleaning, CalendarDays, Check, CheckCircle2, ChevronLeft, CircleAlert,
  ClipboardCheck, ImagePlus, LoaderCircle, MessageSquareText, Save, Settings2,
  Sparkles, UserRoundCheck, Wrench,
} from 'lucide-react';
import { getOperationDetail } from '../data/detailRecords';
import { operationFlowConfig, relatedReservations, staffOptions, workflowUnits } from '../data/workflows';
import { createOperation } from '../services/workflowService';
import { fetchClientUnits, type ApiClientUnit } from '../services/unitService';
import { SearchableSelect } from '../components/SearchableSelect';
import type { OperationCreationPayload, OperationKind, OperationSource } from '../types/workflows';
import { getTodayIso } from '../utils/dateUtils';
import { FAST_PROTOTYPE_MODE } from '../config/prototype';
import './reference-pages.css';
import './workflow-pages.css';

const steps = ['مصدر الطلب','تفاصيل الخدمة','الجدولة والتعيين','المراجعة'];
const kindIcons = { cleaning: BrushCleaning, maintenance: Wrench, service: Settings2 };
const kindPaths = { cleaning: '/app/operations/cleaning', maintenance: '/app/operations/maintenance', service: '/app/operations/services' };

const initialOperation = (kind: OperationKind): OperationCreationPayload => ({
  schemaVersion: 1,
  idempotencyKey: crypto.randomUUID(),
  kind,
  source: { mode: kind === 'cleaning' ? 'reservation' : kind === 'service' ? 'guest-request' : 'manual' },
  unitId: '',
  schedule: { date: getTodayIso(), startTime: '11:00', dueTime: '13:00' },
  assignment: { mode: 'auto' },
  priority: 'normal',
  details: { serviceType: operationFlowConfig[kind].serviceOptions[0], description: '', checklist: [] },
  notifications: { assignee: true, manager: true, guest: kind === 'service' },
  attachments: { fileNames: [] },
  notes: '',
});

export default function CreateOperationPage({ kind }: { kind: OperationKind }) {
  const { operationId } = useParams<{ operationId?: string }>();
  const existing = operationId ? getOperationDetail(operationId) : undefined;
  const isEdit = Boolean(existing);
  const activeKind = existing?.kind ?? kind;
  const config = operationFlowConfig[activeKind];
  const Icon = kindIcons[activeKind];
  const [step, setStep] = useState(isEdit ? 2 : 1);
  const [draft, setDraft] = useState<OperationCreationPayload>((): OperationCreationPayload => {
    if (existing) {
      const matchedUnit = workflowUnits.find(u => u.id === existing.unitCode || u.name === existing.unit);
      const priorityMap: Record<string, OperationCreationPayload['priority']> = {
        'عاجلة': 'urgent',
        'عالية': 'high',
        'متوسطة': 'medium',
        'عادية': 'normal',
      };
      const sourceMap: Record<string, OperationSource> = {
        'حجز متزامن': 'reservation',
        'طلب ضيف': 'guest-request',
        'نتيجة فحص': 'inspection',
      };
      return {
        schemaVersion: 1,
        idempotencyKey: crypto.randomUUID(),
        kind: existing.kind ?? kind,
        source: {
          mode: sourceMap[existing.source] ?? 'manual',
          reservationId: existing.linkedBooking?.id,
        },
        unitId: matchedUnit?.id ?? 'u1',
        schedule: { date: getTodayIso(), startTime: '11:00', dueTime: '13:00' },
        assignment: {
          mode: existing.assignee?.name === 'غير معيّن' || existing.assignee?.name === 'تعيين تلقائي' ? 'auto' : 'manual',
          assigneeId: staffOptions.find(s => s.name === existing.assignee?.name)?.id,
        },
        priority: priorityMap[existing.priority] ?? 'normal',
        details: {
          serviceType: existing.title,
          description: existing.description,
          checklist: existing.checklist?.map(c => c.title) ?? [],
        },
        notifications: { assignee: true, manager: true, guest: existing.kind === 'service' },
        attachments: { fileNames: existing.attachments?.map(a => a.name) ?? [] },
        notes: '',
      };
    }
    return initialOperation(kind);
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [createdId, setCreatedId] = useState('');
  const [draftSaved, setDraftSaved] = useState(false);
  const [unitsList, setUnitsList] = useState<Array<{ id: string; name: string; property: string; code?: string }>>(workflowUnits);

  useEffect(() => {
    fetchClientUnits()
      .then((records: ApiClientUnit[] | null) => {
        if (records && records.length > 0) {
          const mapped = records.map((r: ApiClientUnit) => ({
            id: String(r.id),
            code: r.code || String(r.id),
            name: r.name,
            property: r.property_name || r.name,
          }));
          setUnitsList(mapped);
        }
      })
      .catch(() => {
        // keep fallback
      });
  }, []);

  const unit = unitsList.find(item => item.id === draft.unitId || item.code === draft.unitId) || workflowUnits.find(item => item.id === draft.unitId);
  const reservation = relatedReservations.find(item => item.id === draft.source.reservationId);

  const chooseSource = (mode: OperationSource) => {
    setDraft(current => ({ ...current, source: { mode }, unitId: '', idempotencyKey: crypto.randomUUID() }));
    setError('');
  };

  const chooseReservation = (reservationId: string) => {
    const item = relatedReservations.find(reservation => reservation.id === reservationId);
    if (!item) return;
    setDraft(current => ({ ...current, source: { ...current.source, reservationId, externalEventId: `event_${reservationId}` }, unitId: item.unitId }));
  };

  const update = <K extends keyof OperationCreationPayload>(key: K, value: OperationCreationPayload[K]) => setDraft(current => ({ ...current, [key]: value }));
  const updateDetail = (key: string, value: string | number | boolean | string[]) => setDraft(current => ({ ...current, details: { ...current.details, [key]: value } }));

  const upload = (event: ChangeEvent<HTMLInputElement>) => update('attachments', { fileNames: Array.from(event.target.files ?? []).map(file => file.name) });

  const validate = () => {
    if (draft.schedule?.date && draft.schedule.date < getTodayIso()) {
      return 'لا يمكن تسجيل طلب في تاريخ قديم (تاريخ فات). يرجى اختيار تاريخ اليوم أو تاريخ قادم.';
    }
    if (FAST_PROTOTYPE_MODE) return '';
    if (step === 2 && draft.source.mode !== 'manual' && !draft.source.reservationId) return 'اختر الحجز المرتبط بالطلب.';
    if (step === 2 && !draft.unitId) return 'اختر الوحدة قبل المتابعة.';
    if (step === 2 && !String(draft.details.description).trim()) return 'أضف وصفًا واضحًا لما يجب تنفيذه.';
    if (step === 3 && !draft.schedule.date) return 'حدد تاريخ التنفيذ.';
    return '';
  };

  const next = () => { const message = validate(); if (message) { setError(message); return; } setError(''); setStep(current => Math.min(4,current+1)); window.scrollTo({top:0,behavior:'smooth'}); };
  const submit = async () => {
    if (draft.schedule?.date && draft.schedule.date < getTodayIso()) {
      setError('لا يمكن تسجيل طلب في تاريخ قديم (تاريخ فات). يرجى اختيار تاريخ اليوم أو تاريخ قادم.');
      return;
    }
    setSaving(true);
    try {
      const created = await createOperation({
        ...draft,
        unitName: unit?.name,
        unitCode: unit?.code || unit?.id || draft.unitId,
        propertyName: unit?.property,
      });
      setCreatedId(created.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };
  const saveDraft = () => { window.localStorage.setItem(`bluclean-${kind}-draft`,JSON.stringify(draft)); setDraftSaved(true); window.setTimeout(()=>setDraftSaved(false),1800); };

  if (createdId) return <div className="reference-page workflow-page"><section className={`workflow-success reference-panel ${config.accent}`}><span><Icon size={42}/></span><p>{isEdit ? `تم تعديل ${config.singular}` : `تم إنشاء ${config.singular}`}</p><h1>{String(draft.details.serviceType)}</h1><small>{unit?.name} · {draft.schedule.date} · {assignmentLabel(draft)}</small><div><Link className="reference-primary" to={kindPaths[activeKind]}>عرض الطلبات</Link><button className="reference-secondary" onClick={()=>{setDraft(initialOperation(activeKind));setCreatedId('');setStep(1)}}>إضافة طلب آخر</button></div></section></div>;

  return <div className={`reference-page workflow-page operation-workflow ${config.accent}`}>
    <header className="reference-page-header workflow-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><Link to={kindPaths[activeKind]}>التشغيل والخدمات</Link><ChevronLeft size={13}/><span>{isEdit ? `تعديل ${config.singular}` : config.title}</span></div><h1><Icon size={29}/>{isEdit ? `تعديل ${config.singular}` : config.title}</h1><p>{config.description}</p></div><button className={`workflow-draft ${draftSaved?'saved':''}`} onClick={saveDraft}>{draftSaved?<Check size={16}/>:<Save size={16}/>} {draftSaved?'تم حفظ المسودة':'حفظ كمسودة'}</button></header>
    <OperationStepper step={step} onStep={setStep}/>
    <div className="workflow-layout"><main className="workflow-main reference-panel">
      {step===1&&<OperationSourceStep config={config} selected={draft.source.mode} onChoose={chooseSource}/>} 
      {step===2&&<OperationDetailsStep kind={activeKind} config={config} draft={draft} update={update} updateDetail={updateDetail} chooseReservation={chooseReservation} upload={upload} unitsList={unitsList}/>} 
      {step===3&&<OperationScheduleStep kind={activeKind} draft={draft} update={update}/>} 
      {step===4&&<OperationReview config={config} draft={draft} unitName={unit?.name} reservation={reservation}/>} 
      {error&&<div className="workflow-error"><CircleAlert size={17}/>{error}</div>}
      <footer className="workflow-actions"><button className="reference-secondary" onClick={()=>step===1?history.back():setStep(current=>current-1)}>{step===1?'إلغاء':'السابق'}</button><span>الخطوة {step} من 4</span>{step<4?<button className="reference-primary" onClick={next}>التالي<ChevronLeft size={16}/></button>:<button className="reference-primary" disabled={saving} onClick={submit}>{saving?<LoaderCircle className="workflow-spinner" size={17}/>:<Check size={17}/>} {saving?'جارٍ الحفظ...':isEdit?'حفظ التعديلات':`إنشاء ${config.singular}`}</button>}</footer>
    </main><aside className="workflow-aside"><section className="reference-panel reality-card"><span><Sparkles size={21}/></span><h2>مبدأ التشغيل الصحيح</h2><p>المنصات لا تُنشئ طلب صيانة أو تنظيف مباشرة. الحجز المتزامن يوفّر حدث الوصول أو المغادرة، ومنه ينشئ BluClean المهمة وفق قاعدة تشغيل.</p><Status label="مصدر الطلب" value={sourceLabel(draft.source.mode)}/><Status label="مرتبط بحجز" value={reservation?'نعم':'لا'}/><Status label="منع التكرار" value="مفعّل" tone="good"/></section><section className="reference-panel workflow-summary"><h2>ملخص الطلب</h2><Status label="النوع" value={String(draft.details.serviceType)}/><Status label="الوحدة" value={unit?.name??'لم تحدد'}/><Status label="التاريخ" value={draft.schedule.date||'لم يحدد'}/><Status label="التعيين" value={assignmentLabel(draft)}/></section></aside></div>
  </div>;
}

function OperationSourceStep({ config, selected, onChoose }: { config: typeof operationFlowConfig[OperationKind]; selected: OperationSource; onChoose: (mode: OperationSource)=>void }) { return <section className="workflow-content"><Heading icon={<ClipboardCheck size={22}/>} title="كيف بدأ الطلب؟" description="اختيار المصدر يحافظ على أثر واضح للطلب ويمنع تكرار المهام الآلية."/><div className={`operation-source-grid cols-${config.sources.length}`}>{config.sources.map((source,index)=><button key={source.id} className={selected===source.id?'selected':''} onClick={()=>onChoose(source.id)}><span>{source.id==='reservation'?<CalendarDays size={24}/>:source.id==='guest-request'?<MessageSquareText size={24}/>:source.id==='inspection'?<ClipboardCheck size={24}/>:<IconForIndex index={index}/>}</span><i>{selected===source.id&&<Check size={14}/>}</i><h3>{source.title}</h3><p>{source.description}</p></button>)}</div><div className="workflow-info"><CircleAlert size={17}/><p>ربط المهمة بحجز متزامن لا يعني أن منصة الحجز أنشأت المهمة؛ BluClean ينشئها داخليًا من حدث موثوق مثل المغادرة أو طلب الضيف.</p></div></section>; }

function OperationDetailsStep({ kind, config, draft, update, updateDetail, chooseReservation, upload, unitsList }: { kind:OperationKind;config:typeof operationFlowConfig[OperationKind];draft:OperationCreationPayload;update:<K extends keyof OperationCreationPayload>(key:K,value:OperationCreationPayload[K])=>void;updateDetail:(key:string,value:string|number|boolean|string[])=>void;chooseReservation:(id:string)=>void;upload:(event:ChangeEvent<HTMLInputElement>)=>void;unitsList:Array<{ id:string;name:string;property:string }> }) { const checklist=(draft.details.checklist as string[])??[]; return <section className="workflow-content"><Heading icon={<Settings2 size={22}/>} title="تفاصيل الطلب" description="الحقول هنا مخصصة حسب نوع الخدمة وليست نموذجًا عامًا."/>{draft.source.mode!=='manual'&&<div className="related-bookings"><h3>اختر الحجز المرتبط</h3>{relatedReservations.map(item=><button key={item.id} className={draft.source.reservationId===item.id?'selected':''} onClick={()=>chooseReservation(item.id)}><span className="channel-logo channel-direct">{item.channel[0]}</span><div><b>{item.guest}</b><small>{item.unit} · مغادرة {item.checkOut}</small></div><i>{draft.source.reservationId===item.id&&<Check size={14}/>}</i></button>)}</div>}<div className="workflow-form-grid"><Field label="الوحدة" required><SearchableSelect disabled={draft.source.mode!=='manual'&&!!draft.source.reservationId} value={draft.unitId} onChange={val=>update('unitId',val)} options={unitsList.map(item=>({ value: item.id, label: `${item.name} · ${item.property}` }))} placeholder="اختر الوحدة..."/></Field><Field label={kind==='maintenance'?'تصنيف المشكلة':'نوع الخدمة'}><SearchableSelect value={String(draft.details.serviceType)} onChange={val=>updateDetail('serviceType',val)} options={config.serviceOptions.map(item=>({ value: item, label: item }))} placeholder="اختر النوع..."/></Field>{kind==='service'&&<><Field label="الكمية"><input type="number" min="1" value={Number(draft.details.quantity??1)} onChange={event=>updateDetail('quantity',Number(event.target.value))}/></Field><Field label="التكلفة المتوقعة"><input type="number" min="0" value={Number(draft.details.cost??0)} onChange={event=>updateDetail('cost',Number(event.target.value))}/></Field></>}<Field label={kind==='maintenance'?'وصف المشكلة':'تعليمات التنفيذ'} required full><textarea rows={4} value={String(draft.details.description)} onChange={event=>updateDetail('description',event.target.value)} placeholder={kind==='maintenance'?'اشرح المشكلة ومتى ظهرت وأي تفاصيل تساعد الفني...':'اكتب تفاصيل واضحة لفريق التنفيذ...'}/></Field></div><div className="service-checklist"><h3>{kind==='maintenance'?'إعدادات البلاغ':'نطاق التنفيذ'}</h3><div>{config.checklist.map(item=><button key={item} className={checklist.includes(item)?'active':''} onClick={()=>updateDetail('checklist',checklist.includes(item)?checklist.filter(value=>value!==item):[...checklist,item])}><span><Check size={13}/></span>{item}</button>)}</div></div><label className="workflow-upload"><input type="file" multiple accept="image/*" onChange={upload}/><ImagePlus size={22}/><span><b>{draft.attachments.fileNames.length?`${draft.attachments.fileNames.length} ملفات مرفقة`:'إضافة صور أو مرفقات'}</b><small>تفيد العامل في فهم المطلوب قبل الوصول</small></span><em>اختيار الملفات</em></label></section>; }

function OperationScheduleStep({ kind, draft, update }: { kind:OperationKind;draft:OperationCreationPayload;update:<K extends keyof OperationCreationPayload>(key:K,value:OperationCreationPayload[K])=>void }) { return <section className="workflow-content"><Heading icon={<CalendarDays size={22}/>} title="الجدولة والتعيين" description="حدد الموعد والمسؤول والإشعارات المرتبطة بالتنفيذ."/><div className="workflow-form-grid"><Field label="تاريخ التنفيذ" required><input type="date" min={getTodayIso()} value={draft.schedule.date} onChange={event=>{const val=event.target.value;if(val&&val<getTodayIso()){update('schedule',{...draft.schedule,date:getTodayIso()});return;}update('schedule',{...draft.schedule,date:val});}}/></Field><Field label="وقت البدء"><input type="time" value={draft.schedule.startTime} onChange={event=>update('schedule',{...draft.schedule,startTime:event.target.value})}/></Field><Field label="وقت الإنجاز المطلوب"><input type="time" value={draft.schedule.dueTime} onChange={event=>update('schedule',{...draft.schedule,dueTime:event.target.value})}/></Field><Field label="الأولوية"><SearchableSelect value={draft.priority} onChange={val=>update('priority',val as OperationCreationPayload['priority'])} options={[{ value: 'normal', label: 'عادية' }, { value: 'medium', label: 'متوسطة' }, { value: 'high', label: 'عالية' }, { value: 'urgent', label: 'عاجلة' }]} placeholder="اختر الأولوية..."/></Field><Field label="طريقة التعيين"><SearchableSelect value={draft.assignment.mode} onChange={val=>update('assignment',{mode:val as 'auto'|'manual'})} options={[{ value: 'auto', label: 'تعيين تلقائي حسب المنطقة والتوفر' }, { value: 'manual', label: 'تعيين يدوي' }]} placeholder="اختر طريقة التعيين..."/></Field>{draft.assignment.mode==='manual'&&<Field label="العامل أو المزود"><SearchableSelect value={draft.assignment.assigneeId??''} onChange={val=>update('assignment',{mode:'manual',assigneeId:val})} options={staffOptions.slice(1).map(item=>({ value: item.id, label: item.name }))} placeholder="اختر المسؤول..."/></Field>}</div><div className="automation-list"><NotifyRow title="إشعار المسؤول عن التنفيذ" checked={draft.notifications.assignee} onChange={value=>update('notifications',{...draft.notifications,assignee:value})}/><NotifyRow title="إشعار مدير التشغيل" checked={draft.notifications.manager} onChange={value=>update('notifications',{...draft.notifications,manager:value})}/><NotifyRow title={kind==='service'?'إرسال تأكيد للضيف':'إبلاغ الضيف عند الحاجة'} checked={draft.notifications.guest} onChange={value=>update('notifications',{...draft.notifications,guest:value})}/></div><Field label="ملاحظات داخلية" full><textarea rows={3} value={draft.notes} onChange={event=>update('notes',event.target.value)} placeholder="أي تعليمات إضافية لا تظهر للضيف..."/></Field></section>; }

function OperationReview({ config, draft, unitName, reservation }: { config:typeof operationFlowConfig[OperationKind];draft:OperationCreationPayload;unitName?:string;reservation?:typeof relatedReservations[number] }) { return <section className="workflow-content"><Heading icon={<CheckCircle2 size={22}/>} title="راجع الطلب قبل الإنشاء" description="سيُحفظ الطلب داخليًا، وتبقى علاقته بالحجز قابلة للتتبع."/><div className="operation-review-hero"><span>{String(draft.details.serviceType).slice(0,1)}</span><div><small>{config.singular}</small><h2>{String(draft.details.serviceType)}</h2><p>{unitName} · {draft.schedule.date}</p></div><b>{priorityLabel(draft.priority)}</b></div><div className="workflow-review-grid"><Review title="المصدر" rows={[['طريقة الإنشاء',sourceLabel(draft.source.mode)],['الحجز المرتبط',reservation?.id??'غير مرتبط'],['الضيف',reservation?.guest??'—'],['منع التكرار','مفعّل']]}/><Review title="التنفيذ" rows={[['التاريخ',draft.schedule.date],['الوقت',`${draft.schedule.startTime} - ${draft.schedule.dueTime}`],['التعيين',assignmentLabel(draft)],['الأولوية',priorityLabel(draft.priority)]]}/><Review title="النطاق" rows={[[draft.kind==='maintenance'?'المشكلة':'الخدمة',String(draft.details.serviceType)],['العناصر',`${((draft.details.checklist as string[])??[]).length} محددة`],['المرفقات',`${draft.attachments.fileNames.length} ملفات`]]}/></div></section>; }

function OperationStepper({step,onStep}:{step:number;onStep:(step:number)=>void}){return <nav className="workflow-stepper" aria-label="خطوات الإنشاء">{steps.map((label,index)=><button key={label} className={`${step===index+1?'active':''} ${step>index+1?'done':''}`} onClick={()=>index+1<step&&onStep(index+1)}><span>{step>index+1?<Check size={15}/>:index+1}</span><b>{label}</b></button>)}</nav>}
function Heading({icon,title,description}:{icon:ReactNode;title:string;description:string}){return <div className="workflow-heading"><span>{icon}</span><div><h2>{title}</h2><p>{description}</p></div></div>}
function Field({label,required,full,children}:{label:string;required?:boolean;full?:boolean;children:ReactNode}){return <label className={`workflow-field ${full?'full':''}`}><span>{label}{required&&<em>*</em>}</span>{children}</label>}
function NotifyRow({title,checked,onChange}:{title:string;checked:boolean;onChange:(value:boolean)=>void}){return <button className="workflow-toggle-row" onClick={()=>onChange(!checked)}><span><UserRoundCheck size={19}/></span><div><b>{title}</b><small>{checked?'سيتم الإشعار عند إنشاء الطلب':'لن يتم إرسال إشعار'}</small></div><i className={checked?'on':''}/></button>}
function Status({label,value,tone}:{label:string;value:string;tone?:string}){return <div className="workflow-status-line"><span>{label}</span><b className={tone}>{value}</b></div>}
function Review({title,rows}:{title:string;rows:string[][]}){return <section><h3>{title}</h3>{rows.map(([label,value])=><div key={label}><span>{label}</span><b>{value||'—'}</b></div>)}</section>}
function IconForIndex({index}:{index:number}){return index%2?<UserRoundCheck size={24}/>:<Sparkles size={24}/>}
function sourceLabel(value:OperationSource){return ({manual:'يدوي',reservation:'مرتبط بحجز', 'guest-request':'طلب ضيف',inspection:'نتيجة فحص'} as const)[value]}
function priorityLabel(value:OperationCreationPayload['priority']){return ({normal:'عادية',medium:'متوسطة',high:'عالية',urgent:'عاجلة'} as const)[value]}
function assignmentLabel(draft:OperationCreationPayload){if(draft.assignment.mode==='auto')return 'تعيين تلقائي';return staffOptions.find(item=>item.id===draft.assignment.assigneeId)?.name??'غير معيّن'}
