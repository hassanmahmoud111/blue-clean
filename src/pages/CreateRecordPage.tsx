import { useState, type FormEvent } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { BedDouble, BrushCleaning, Building2, Check, CheckCircle2, ChevronLeft, CircleDollarSign, CreditCard, FilePlus2, Info, LoaderCircle, Save, UserPlus, Wrench } from 'lucide-react';
import { createForms, type CreateField } from '../data/createForms';
import { getTodayIso } from '../utils/dateUtils';
import './reference-pages.css';
import './create-page.css';

const resourceMeta = {
  unit: { icon: Building2, label: 'وحدة', href: '/app/new/unit' },
  booking: { icon: BedDouble, label: 'حجز', href: '/app/new/booking' },
  cleaning: { icon: BrushCleaning, label: 'تنظيف', href: '/app/new/cleaning' },
  maintenance: { icon: Wrench, label: 'صيانة', href: '/app/new/maintenance' },
  service: { icon: FilePlus2, label: 'خدمة إضافية', href: '/app/new/service' },
  user: { icon: UserPlus, label: 'مستخدم', href: '/app/new/user' },
  payment: { icon: CreditCard, label: 'طريقة دفع', href: '/app/new/payment' },
  invoice: { icon: CircleDollarSign, label: 'فاتورة', href: '/app/new/invoice' },
} as const;

export default function CreateRecordPage() {
  const { resource = '' } = useParams();
  const config = createForms[resource];
  const meta = resourceMeta[resource as keyof typeof resourceMeta];
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!config || !meta) return <Navigate to="/app" replace />;
  const Icon = meta.icon;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    window.setTimeout(() => { setSaving(false); setSaved(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }, 550);
  };

  if (saved) return <div className="reference-page create-page"><section className="create-success reference-panel"><span><CheckCircle2 size={42}/></span><h1>تم حفظ {config.singular} بنجاح</h1><p>تمت إضافة البيانات محليًا كنسخة تجريبية، ويمكن ربط الحفظ بالـ Backend لاحقًا.</p><div><Link className="reference-primary" to={config.backTo}>العودة إلى القائمة</Link><button className="reference-secondary" onClick={() => setSaved(false)}>إضافة عنصر آخر</button></div></section></div>;

  return <div className="reference-page create-page">
    <header className="reference-page-header create-page-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><Link to={config.backTo}>العودة للقائمة</Link><ChevronLeft size={13}/><span>إنشاء جديد</span></div><h1><Icon size={29}/>{config.title}</h1><p>{config.description}</p></div></header>
    <div className="create-layout">
      <form className="create-form" onSubmit={submit}>
        {config.sections.map((section, sectionIndex) => <section className="reference-panel create-section" key={section.title}><div className="create-section-head"><span>{sectionIndex + 1}</span><div><h2>{section.title}</h2><p>{section.description}</p></div></div><div className="create-fields">{section.fields.map(field => <Field key={field.name} field={field}/>)}</div></section>)}
        <footer className="reference-panel create-actions"><Link className="reference-secondary" to={config.backTo}>إلغاء</Link><button type="button" className="reference-secondary"><FilePlus2 size={16}/>حفظ كمسودة</button><button className="reference-primary" disabled={saving}>{saving?<LoaderCircle className="create-spinner" size={18}/>:<Save size={17}/>} {saving?'جارٍ الحفظ...':`حفظ ${config.singular}`}</button></footer>
      </form>
      <aside className="create-aside">
        <section className="reference-panel create-tip"><span><Info size={22}/></span><h2>نموذج بسيط وسريع</h2><p>ابدأ بالحقول المطلوبة فقط. يمكنك الرجوع لاحقًا لإكمال بقية التفاصيل.</p><ul><li><Check size={14}/>الحقول المعلّمة مطلوبة</li><li><Check size={14}/>يمكن تعديل البيانات لاحقًا</li><li><Check size={14}/>لن يتم الإرسال قبل المراجعة</li></ul></section>
        <section className="reference-panel create-shortcuts"><h2>إنشاء سريع</h2><div>{Object.entries(resourceMeta).map(([key,item])=>{const ItemIcon=item.icon;return <Link key={key} className={key===resource?'active':''} to={item.href}><ItemIcon size={17}/>{item.label}<ChevronLeft size={14}/></Link>})}</div></section>
      </aside>
    </div>
  </div>;
}

function Field({ field }: { field: CreateField }) {
  const className = `create-field ${field.full ? 'full' : ''}`;
  return <label className={className}><span>{field.label}{field.required && <em>*</em>}</span>{field.type === 'select' ? <select name={field.name} required={field.required} defaultValue=""><option value="" disabled>اختر {field.label}</option>{field.options?.map(option=><option key={option}>{option}</option>)}</select> : field.type === 'textarea' ? <textarea name={field.name} required={field.required} placeholder={field.placeholder} rows={4}/> : <input name={field.name} required={field.required} type={field.type ?? 'text'} min={field.type === 'date' ? getTodayIso() : undefined} placeholder={field.placeholder}/>}</label>;
}
