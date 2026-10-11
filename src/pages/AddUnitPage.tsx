import { useEffect, useMemo, useState, type ChangeEvent, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, ChevronLeft,
  CircleAlert, Clock3, CloudDownload, FileText, ImagePlus, Link2,
  LoaderCircle, MapPin, RefreshCw, Save, Sparkles, UsersRound,
} from 'lucide-react';
import { emptyUnitDraft, importedListings, integrationProviders, properties, unitCreationSteps } from '../data/unitCreation';
import { getUnitDetail } from '../data/detailRecords';
import { createUnit, fetchClientUnitDetail, mapApiUnitToDetailRecord, type CreatedUnit } from '../services/unitService';
import { fetchCities } from '../services/clientBookingService';
import { SearchableSelect } from '../components/SearchableSelect';
import type { CityInfo } from '../types/clientBooking';
import type { UnitDetailRecord } from '../types/details';
import type { IntegrationProvider, UnitCreationMode, UnitDraft, UnitManagementMode } from '../types/unitCreation';
import { FAST_PROTOTYPE_MODE } from '../config/prototype';
import './reference-pages.css';
import './add-unit-page.css';

const statusLabels = { draft: 'مسودة', ready: 'جاهزة للضيف', cleaning: 'بانتظار التنظيف', maintenance: 'قيد الصيانة' } as const;

export default function AddUnitPage() {
  const { unitId } = useParams();
  const isEdit = Boolean(unitId);
  const [step, setStep] = useState(isEdit ? 2 : 1);
  const [draft, setDraft] = useState<UnitDraft>(() => structuredClone(emptyUnitDraft));
  const [provider, setProvider] = useState<IntegrationProvider>('booking');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [created, setCreated] = useState<CreatedUnit | null>(null);
  const [cities, setCities] = useState<CityInfo[]>([]);

  useEffect(() => {
    fetchCities().then(setCities).catch(() => {});
  }, []);

  useEffect(() => {
    if (!unitId) return;
    const applyUnitToDraft = (unit: UnitDetailRecord) => {
      setDraft({
        schemaVersion: 1,
        selectedListingId: '',
        source: { mode: 'manual' },
        identity: {
          name: unit.name,
          code: unit.code,
          propertyId: 'p1',
          propertyName: unit.property,
          type: unit.type,
          status: unit.status === 'جاهزة للضيف' ? 'ready' : unit.status === 'قيد الصيانة' ? 'maintenance' : 'cleaning',
          description: unit.description || '',
        },
        location: {
          city: unit.city,
          district: unit.district,
          address: unit.address,
        },
        capacity: {
          maxGuests: unit.capacity.guests,
          bedrooms: unit.capacity.bedrooms,
          beds: unit.capacity.beds,
          bathrooms: unit.capacity.bathrooms,
        },
        operations: {
          managementMode: unit.managementMode === 'مزامنة حجوزات' || unit.managementMode === 'إدارة مختلطة' ? 'channel-sync' : 'operations-only',
          cleaningDurationMinutes: unit.stayDefaults.cleaningMinutes,
          checkInTime: unit.stayDefaults.checkIn,
          checkOutTime: unit.stayDefaults.checkOut,
          accessType: unit.stayDefaults.access === 'قفل ذكي' ? 'smart-lock' : 'manual',
          cleaningTeamId: 'auto',
          autoCleaningAfterCheckout: true,
          arrivalReminder: true,
          notes: unit.notes.join('\n'),
        },
        importOptions: { details: true, photos: true, reservations: true },
        integrations: unit.integrations.map(intg => ({
          provider: intg.name.toLowerCase().includes('booking') ? 'booking' : 'airbnb',
          listingId: intg.listingId,
          listingName: unit.name,
          syncMode: 'full',
        })),
        media: { fileNames: [] },
      });
      setStep(2);
    };

    const fallback = getUnitDetail(unitId);
    if (fallback) {
      applyUnitToDraft(fallback);
    }

    let active = true;
    fetchClientUnitDetail(unitId).then((apiUnit) => {
      if (active && apiUnit) {
        applyUnitToDraft(mapApiUnitToDetailRecord(apiUnit, fallback));
      }
    });
    return () => {
      active = false;
    };
  }, [unitId]);

  const selectedListing = useMemo(() => importedListings.find(item => item.id === draft.selectedListingId), [draft.selectedListingId]);
  const visibleListings = importedListings.filter(item => item.provider === provider);

  const chooseMode = (mode: UnitCreationMode) => {
    setDraft(current => ({ ...current, source: { mode }, selectedListingId: '', integrations: [], operations: { ...current.operations, managementMode: mode === 'import' ? 'channel-sync' : 'operations-only', autoCleaningAfterCheckout: mode === 'import', arrivalReminder: mode === 'import' } }));
    setError('');
  };

  const chooseListing = (listingId: string) => {
    const listing = importedListings.find(item => item.id === listingId);
    if (!listing) return;
    setDraft(current => ({
      ...current,
      source: { mode: 'import', importedFrom: listing.provider, externalListingId: listing.id },
      selectedListingId: listing.id,
      identity: { ...current.identity, name: listing.name, code: `BLD-${listing.id.slice(-3)}`, propertyId: listing.propertyId, propertyName: listing.propertyName, type: listing.type },
      location: { city: listing.city, district: listing.district, address: listing.address },
      capacity: { maxGuests: listing.maxGuests, bedrooms: listing.bedrooms, beds: listing.beds, bathrooms: listing.bathrooms },
      integrations: [{ provider: listing.provider, listingId: listing.id, listingName: listing.name, syncMode: 'full' }],
    }));
    setError('');
  };

  const updateIdentity = (key: keyof UnitDraft['identity'], value: string) => setDraft(current => ({ ...current, identity: { ...current.identity, [key]: value } }));
  const updateLocation = (key: keyof UnitDraft['location'], value: string) => setDraft(current => ({ ...current, location: { ...current.location, [key]: value } }));
  const updateCapacity = (key: keyof UnitDraft['capacity'], value: number) => setDraft(current => ({ ...current, capacity: { ...current.capacity, [key]: value } }));
  const updateOperations = (key: keyof UnitDraft['operations'], value: string | number | boolean) => setDraft(current => ({ ...current, operations: { ...current.operations, [key]: value } }));
  const updateManagementMode = (managementMode: UnitManagementMode) => setDraft(current => ({ ...current, operations: { ...current.operations, managementMode, autoCleaningAfterCheckout: managementMode === 'operations-only' ? false : current.operations.autoCleaningAfterCheckout, arrivalReminder: managementMode === 'operations-only' ? false : current.operations.arrivalReminder }, integrations: managementMode === 'operations-only' ? [] : current.integrations }));

  const updateProperty = (propertyId: string) => {
    const property = properties.find(item => item.id === propertyId);
    setDraft(current => ({ ...current, identity: { ...current.identity, propertyId, propertyName: property?.name ?? '' }, location: { ...current.location, city: property?.city ?? current.location.city } }));
  };

  const updateChannel = (channelProvider: IntegrationProvider, listingId: string) => {
    const platform = integrationProviders.find(item => item.id === channelProvider);
    setDraft(current => {
      const integrations = current.integrations.filter(item => item.provider !== channelProvider);
      if (listingId.trim()) integrations.push({ provider: channelProvider, listingId: listingId.trim(), listingName: current.identity.name || platform?.name || '', syncMode: 'reservations' });
      return { ...current, integrations };
    });
  };

  const uploadImages = (event: ChangeEvent<HTMLInputElement>) => {
    const fileNames = Array.from(event.target.files ?? []).map(file => file.name);
    setDraft(current => ({ ...current, media: { fileNames } }));
  };

  const validateStep = () => {
    if (FAST_PROTOTYPE_MODE) return '';
    if (step === 2 && draft.source.mode === 'import' && !draft.selectedListingId) return 'اختر إعلانًا واحدًا لاستيراده قبل المتابعة.';
    if (step === 2 && draft.source.mode === 'manual') {
      if (!draft.identity.name.trim() || !draft.identity.code.trim() || !draft.identity.propertyId || !draft.location.address.trim()) return 'أكمل اسم الوحدة والكود والعقار والعنوان.';
    }
    return '';
  };

  const next = () => {
    const validationError = validateStep();
    if (validationError) { setError(validationError); return; }
    setError('');
    setStep(current => Math.min(4, current + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      const { selectedListingId: _selectedListingId, ...payload } = draft;
      setCreated(await createUnit(payload));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = () => {
    window.localStorage.setItem('bluclean-unit-draft', JSON.stringify(draft));
    setDraftSaved(true);
    window.setTimeout(() => setDraftSaved(false), 1800);
  };

  if (created) return <div className="reference-page add-unit-page"><section className="unit-created reference-panel"><span><CheckCircle2 size={42}/></span><p>{isEdit ? 'تم تحديث بيانات الوحدة' : 'تم إنشاء الوحدة'}</p><h1>{created.identity.name}</h1><div className="unit-created-meta"><b>{created.identity.code}</b><i/><b>{created.identity.propertyName}</b><i/><b>{created.source.mode === 'import' ? 'مستوردة ومربوطة' : 'أضيفت يدويًا'}</b></div><small>تم حفظ نسخة تجريبية محليًا. عقد البيانات جاهز لاستبدال الحفظ المحلي بطلب API عند بناء الـ Backend.</small><div><Link className="reference-primary" to="/app/units">عرض الوحدات</Link><button className="reference-secondary" onClick={() => { setDraft(structuredClone(emptyUnitDraft)); setCreated(null); setStep(1); }}>{isEdit ? 'إغلاق' : 'إضافة وحدة أخرى'}</button></div></section></div>;

  return <div className="reference-page add-unit-page">
    <header className="reference-page-header add-unit-header"><div className="reference-page-heading"><div className="reference-breadcrumb"><Link to="/app/units">الوحدات</Link><ChevronLeft size={13}/><span>{isEdit ? 'تعديل الوحدة' : 'إضافة وحدة'}</span></div><h1><Building2 size={29}/>{isEdit ? `تعديل الوحدة: ${draft.identity.name || ''}` : 'إضافة وحدة جديدة'}</h1><p>{isEdit ? 'تعديل وتحديث مواصفات الوحدة وموقعها وسعتها وإعدادات التشغيل.' : 'أنشئ الوحدة يدويًا أو استوردها من منصة حجز متصلة، ثم أكمل إعدادات التشغيل.'}</p></div><button className={`unit-draft-button ${draftSaved ? 'saved' : ''}`} onClick={saveDraft}>{draftSaved ? <Check size={16}/> : <Save size={16}/>} {draftSaved ? 'تم حفظ المسودة' : 'حفظ كمسودة'}</button></header>

    <nav className="unit-stepper" aria-label="خطوات إضافة الوحدة">{unitCreationSteps.map(item => <button key={item.id} className={`${step === item.id ? 'active' : ''} ${step > item.id ? 'done' : ''}`} onClick={() => item.id < step && setStep(item.id)}><span>{step > item.id ? <Check size={17}/> : item.id}</span><div><b>{item.title}</b><small>{item.description}</small></div></button>)}</nav>

    <div className="unit-create-layout">
      <main className="unit-create-main reference-panel">
        {step === 1 && <SourceStep mode={draft.source.mode} onChoose={chooseMode}/>} 
        {step === 2 && draft.source.mode === 'manual' && <ManualDetailsStep draft={draft} cities={cities} updateIdentity={updateIdentity} updateLocation={updateLocation} updateCapacity={updateCapacity} updateProperty={updateProperty} uploadImages={uploadImages}/>} 
        {step === 2 && draft.source.mode === 'import' && <ImportStep provider={provider} selectedId={draft.selectedListingId} visibleListings={visibleListings} onProvider={setProvider} onSelect={chooseListing} draft={draft} setDraft={setDraft}/>} 
        {step === 3 && <OperationsStep draft={draft} updateIdentity={updateIdentity} updateOperations={updateOperations} updateManagementMode={updateManagementMode} updateChannel={updateChannel}/>} 
        {step === 4 && <ReviewStep draft={draft} selectedListingName={selectedListing?.name}/>} 
        {error && <div className="unit-form-error"><CircleAlert size={17}/>{error}</div>}
        <footer className="unit-wizard-actions"><button className="reference-secondary" onClick={() => step === 1 ? history.back() : setStep(current => current - 1)}><ArrowRight size={17}/>{step === 1 ? 'إلغاء' : 'السابق'}</button><span>الخطوة {step} من 4</span>{step < 4 ? <button className="reference-primary" onClick={next}>التالي<ArrowLeft size={17}/></button> : <button className="reference-primary" onClick={submit} disabled={saving}>{saving ? <LoaderCircle className="unit-spinner" size={18}/> : <Check size={18}/>} {saving ? 'جارٍ الحفظ...' : (isEdit ? 'حفظ التعديلات' : 'إنشاء الوحدة')}</button>}</footer>
      </main>
      <aside className="unit-create-aside">
        <section className="reference-panel unit-flow-note"><span><Sparkles size={21}/></span><h2>لماذا تتوفر طريقتان؟</h2><p>الإضافة اليدوية تناسب الوحدات الجديدة أو الحجز المباشر. الاستيراد يناسب إعلانًا موجودًا على منصة متصلة ويقلل تكرار إدخال البيانات.</p><div><Check size={15}/><b>يمكن ربط منصة لاحقًا</b></div><div><Check size={15}/><b>لا ننشئ وحدة مكررة</b></div><div><Check size={15}/><b>تراجع البيانات قبل الحفظ</b></div></section>
        <section className="reference-panel unit-draft-summary"><h2>ملخص الوحدة</h2><SummaryLine label="المصدر" value={draft.source.mode === 'manual' ? 'إضافة يدوية' : 'استيراد من منصة'}/><SummaryLine label="الاسم" value={draft.identity.name || 'لم يحدد بعد'}/><SummaryLine label="العقار" value={draft.identity.propertyName || 'لم يحدد بعد'}/><SummaryLine label="الربط" value={draft.integrations.length ? `${draft.integrations.length} منصة` : 'غير مرتبطة'}/></section>
      </aside>
    </div>
  </div>;
}

function SourceStep({ mode, onChoose }: { mode: UnitCreationMode; onChoose: (mode: UnitCreationMode) => void }) {
  return <section className="unit-step-content"><StepHeading icon={Building2} title="كيف تريد إضافة الوحدة؟" description="اختر الطريقة المناسبة الآن؛ يمكنك ربط منصات إضافية بعد إنشاء الوحدة."/><div className="source-choice-grid"><button className={mode === 'manual' ? 'selected' : ''} onClick={() => onChoose('manual')}><span className="source-choice-icon manual"><FileText size={28}/></span><i>{mode === 'manual' && <Check size={15}/>}</i><h3>إضافة يدوية</h3><p>أدخل بيانات الوحدة، الموقع، السعة وإعدادات التشغيل بنفسك.</p><ul><li><Check size={14}/>مناسبة للوحدات الجديدة</li><li><Check size={14}/>أفضل للحجز المباشر</li></ul></button><button className={mode === 'import' ? 'selected' : ''} onClick={() => onChoose('import')}><span className="source-choice-icon import"><CloudDownload size={28}/></span><i>{mode === 'import' && <Check size={15}/>}</i><h3>استيراد من منصة</h3><p>اختر إعلانًا موجودًا على حساب Booking.com أو Airbnb المتصل.</p><ul><li><Check size={14}/>استيراد البيانات والصور</li><li><Check size={14}/>ربط الحجوزات والمزامنة</li></ul></button></div><div className="source-info"><CircleAlert size={17}/><p><b>توصيتنا:</b> إذا كانت الوحدة منشورة بالفعل، استخدم الاستيراد لتجنب التكرار. الربط الفعلي يحتاج صلاحية من المنصة عند تنفيذ الـ Backend.</p></div></section>;
}

type ManualStepProps = {
  draft: UnitDraft;
  cities: CityInfo[];
  updateIdentity: (key: keyof UnitDraft['identity'], value: string) => void;
  updateLocation: (key: keyof UnitDraft['location'], value: string) => void;
  updateCapacity: (key: keyof UnitDraft['capacity'], value: number) => void;
  updateProperty: (value: string) => void;
  uploadImages: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ManualDetailsStep({ draft, cities, updateIdentity, updateLocation, updateCapacity, updateProperty, uploadImages }: ManualStepProps) {
  const cityOptions = cities.length > 0
    ? cities.map(c => ({ value: c.name_ar || c.name_en || String(c.id), label: c.name_ar || c.name_en || String(c.id) }))
    : [
        { value: 'الرياض', label: 'الرياض' },
        { value: 'جدة', label: 'جدة' },
        { value: 'الدمام', label: 'الدمام' },
        { value: 'مكة المكرمة', label: 'مكة المكرمة' },
        { value: 'المدينة المنورة', label: 'المدينة المنورة' },
        { value: 'الخبر', label: 'الخبر' },
      ];

  return <section className="unit-step-content"><StepHeading icon={Building2} title="بيانات الوحدة" description="أدخل المعلومات الأساسية التي يحتاجها فريق الحجوزات والتشغيل."/><div className="unit-form-grid"><Field label="اسم الوحدة" required><input value={draft.identity.name} onChange={event => updateIdentity('name', event.target.value)} placeholder="مثال: شقة 801"/></Field><Field label="كود الوحدة" required hint="كود داخلي فريد"><input dir="ltr" value={draft.identity.code} onChange={event => updateIdentity('code', event.target.value)} placeholder="BLD-801"/></Field><Field label="العقار" required><SearchableSelect value={draft.identity.propertyId} onChange={val => updateProperty(val)} options={properties.map(item => ({ value: item.id, label: item.name }))} placeholder="اختر العقار..."/></Field><Field label="نوع الوحدة"><SearchableSelect value={draft.identity.type} onChange={val => updateIdentity('type', val)} options={[{ value: 'شقة', label: 'شقة' }, { value: 'استوديو', label: 'استوديو' }, { value: 'فيلا', label: 'فيلا' }, { value: 'شاليه', label: 'شاليه' }]} placeholder="اختر النوع..."/></Field><Field label="المدينة" required><SearchableSelect value={draft.location.city} onChange={val => updateLocation('city', val)} options={cityOptions} placeholder="اختر المدينة..."/></Field><Field label="الحي"><input value={draft.location.district} onChange={event => updateLocation('district', event.target.value)} placeholder="مثال: حي النخيل"/></Field><Field label="العنوان التفصيلي" required full><input value={draft.location.address} onChange={event => updateLocation('address', event.target.value)} placeholder="الشارع، رقم المبنى، الدور"/></Field></div><div className="capacity-block"><h3><UsersRound size={18}/>السعة والتكوين</h3><div>{(['maxGuests','bedrooms','beds','bathrooms'] as const).map((key, index) => <Counter key={key} label={['الضيوف','غرف النوم','الأسرّة','دورات المياه'][index]} value={draft.capacity[key]} onChange={value => updateCapacity(key, value)}/>)}</div></div><label className="unit-photo-upload"><input type="file" multiple accept="image/*" onChange={uploadImages}/><ImagePlus size={24}/><span><b>{draft.media.fileNames.length ? `تم اختيار ${draft.media.fileNames.length} صور` : 'أضف صور الوحدة'}</b><small>PNG أو JPG، ويمكن استكمالها لاحقًا</small></span><em>اختيار الصور</em></label></section>;
}

function ImportStep({ provider, selectedId, visibleListings, onProvider, onSelect, draft, setDraft }: { provider: IntegrationProvider; selectedId: string; visibleListings: typeof importedListings; onProvider: (provider: IntegrationProvider) => void; onSelect: (id: string) => void; draft: UnitDraft; setDraft: Dispatch<SetStateAction<UnitDraft>> }) {
  return <section className="unit-step-content"><StepHeading icon={CloudDownload} title="اختر الوحدة المراد استيرادها" description="نعرض فقط الإعلانات المتاحة في الحسابات المتصلة حاليًا."/><div className="integration-tabs">{integrationProviders.map(item => <button key={item.id} disabled={!item.connected} className={`${provider === item.id ? 'active' : ''} provider-${item.id}`} onClick={() => item.connected && onProvider(item.id)}><span>{item.shortName}</span><div><b>{item.name}</b><small>{item.connected ? `${item.units} وحدات متاحة` : 'غير متصل'}</small></div>{item.connected ? <i className="connected">متصل</i> : <i>ربط أولًا</i>}</button>)}</div><div className="import-list">{visibleListings.map(listing => <button key={listing.id} className={selectedId === listing.id ? 'selected' : ''} onClick={() => onSelect(listing.id)}><span className={`ref-thumbnail ${listing.imageClass}`}/><div><h3>{listing.name}</h3><p><MapPin size={13}/>{listing.propertyName} · {listing.city}</p><small>{listing.id} · {listing.bedrooms} غرف · {listing.maxGuests} ضيوف</small></div><i>{selectedId === listing.id ? <Check size={16}/> : null}</i></button>)}</div><div className="import-options"><h3>ما الذي تريد استيراده؟</h3>{Object.entries({ details: 'بيانات ومواصفات الوحدة', photos: 'صور الإعلان', reservations: 'الحجوزات القادمة' }).map(([key,label]) => <label key={key}><input type="checkbox" checked={draft.importOptions[key as keyof UnitDraft['importOptions']]} onChange={event => setDraft(current => ({ ...current, importOptions: { ...current.importOptions, [key]: event.target.checked } }))}/><span><Check size={13}/></span>{label}</label>)}</div></section>;
}

function OperationsStep({ draft, updateIdentity, updateOperations, updateManagementMode, updateChannel }: { draft: UnitDraft; updateIdentity: (key: keyof UnitDraft['identity'], value: string) => void; updateOperations: (key: keyof UnitDraft['operations'], value: string | number | boolean) => void; updateManagementMode: (mode: UnitManagementMode) => void; updateChannel: (provider: IntegrationProvider, id: string) => void }) {
  const synced = draft.operations.managementMode !== 'operations-only';
  return <section className="unit-step-content"><StepHeading icon={Sparkles} title="إعدادات الوحدة والمزامنة" description="حدد طريقة إدارة الوحدة وإعداداتها الافتراضية فقط؛ طلبات التنفيذ الفعلية تُنشأ من التشغيل والخدمات."/><div className="operation-groups">
    <div><h3><RefreshCw size={18}/>نمط إدارة الوحدة</h3><div className="management-mode-grid"><button className={draft.operations.managementMode==='operations-only'?'active':''} onClick={()=>updateManagementMode('operations-only')}><span><Sparkles size={20}/></span><b>تشغيل مستقل</b><small>تنظيف وخدمات دورية بدون منصات حجز</small></button><button className={draft.operations.managementMode==='channel-sync'?'active':''} onClick={()=>updateManagementMode('channel-sync')}><span><RefreshCw size={20}/></span><b>مزامنة حجوزات</b><small>Booking.com أو Airbnb كمصدر أساسي</small></button><button className={draft.operations.managementMode==='hybrid'?'active':''} onClick={()=>updateManagementMode('hybrid')}><span><Link2 size={20}/></span><b>إدارة مختلطة</b><small>حجوزات متزامنة وتشغيل يدوي معًا</small></button></div>{!synced&&<div className="standalone-note"><CircleAlert size={16}/><p>هذه الوحدة لا تحتاج منصة حجز. بعد حفظها، أنشئ جدول التنظيف أو الخدمات الدورية من قسم <b>التشغيل والخدمات</b>.</p></div>}</div>
    <div><h3><Clock3 size={18}/>إعدادات الإقامة والتجهيز الافتراضية</h3><div className="unit-form-grid"><Field label="وقت تسجيل الدخول"><input type="time" value={draft.operations.checkInTime} onChange={event => updateOperations('checkInTime', event.target.value)}/></Field><Field label="وقت تسجيل الخروج"><input type="time" value={draft.operations.checkOutTime} onChange={event => updateOperations('checkOutTime', event.target.value)}/></Field><Field label="مدة التنظيف الافتراضية"><SearchableSelect value={String(draft.operations.cleaningDurationMinutes)} onChange={val => updateOperations('cleaningDurationMinutes', Number(val))} options={[{ value: '60', label: 'ساعة' }, { value: '90', label: 'ساعة ونصف' }, { value: '120', label: 'ساعتان' }, { value: '180', label: '3 ساعات' }]} placeholder="اختر المدة..."/></Field><Field label="الفريق الافتراضي"><SearchableSelect value={draft.operations.cleaningTeamId} onChange={val => updateOperations('cleaningTeamId', val)} options={[{ value: 'auto', label: 'تعيين تلقائي' }, { value: 'team-a', label: 'فريق النظافة A' }, { value: 'team-b', label: 'فريق النظافة B' }]} placeholder="اختر الفريق..."/></Field><Field label="طريقة الدخول"><SearchableSelect value={draft.operations.accessType} onChange={val => updateOperations('accessType', val)} options={[{ value: 'smart-lock', label: 'قفل ذكي' }, { value: 'key-box', label: 'صندوق مفاتيح' }, { value: 'reception', label: 'الاستقبال' }, { value: 'manual', label: 'تسليم يدوي' }]} placeholder="اختر طريقة الدخول..."/></Field><Field label="الحالة الأولية"><SearchableSelect value={draft.identity.status} onChange={val => updateIdentity('status', val)} options={[{ value: 'draft', label: 'مسودة' }, { value: 'ready', label: 'جاهزة للضيف' }, { value: 'cleaning', label: 'بانتظار التنظيف' }, { value: 'maintenance', label: 'قيد الصيانة' }]} placeholder="اختر الحالة..."/></Field></div></div>
    <div><h3><Sparkles size={18}/>قواعد التشغيل التلقائية <small>لا تنشئ مهمة الآن</small></h3><p className="operation-help">تُستخدم هذه القواعد لاحقًا عندما يصل حدث حجز حقيقي. أما الخدمات الدورية المستقلة فتُجدول من التشغيل والخدمات.</p><div className="unit-rule-list"><button disabled={!synced} onClick={()=>updateOperations('autoCleaningAfterCheckout',!draft.operations.autoCleaningAfterCheckout)}><span><b>إنشاء تنظيف بعد المغادرة</b><small>ينشأ الطلب عند استلام حدث المغادرة من الحجز</small></span><i className={synced&&draft.operations.autoCleaningAfterCheckout?'on':''}/></button><button disabled={!synced} onClick={()=>updateOperations('arrivalReminder',!draft.operations.arrivalReminder)}><span><b>تنبيه قبل وصول الضيف</b><small>يراجع جاهزية الوحدة قبل موعد الدخول</small></span><i className={synced&&draft.operations.arrivalReminder?'on':''}/></button></div></div>
    <div><h3><Link2 size={18}/>ربط منصات الحجز <small>{synced?'حسب الحاجة':'غير مطلوب للتشغيل المستقل'}</small></h3><p className="operation-help">أدخل معرّف الإعلان الموجود على المنصة. الربط لا ينشئ طلب تنظيف أو صيانة؛ بل يزامن الوحدة والحجوزات فقط.</p><div className="channel-link-list">{integrationProviders.map(item => <label key={item.id} className={`${!item.connected||!synced?'disabled':''}`}><span className={`provider-logo provider-${item.id}`}>{item.shortName}</span><div><b>{item.name}</b><small>{item.connected ? item.description : 'لا يوجد تكامل رسمي مفعّل حاليًا'}</small></div><input disabled={!item.connected||!synced||draft.source.importedFrom===item.id} value={draft.integrations.find(link => link.provider===item.id)?.listingId??''} onChange={event=>updateChannel(item.id,event.target.value)} placeholder="معرّف الإعلان"/><i>{draft.integrations.some(link=>link.provider===item.id)?<CheckCircle2 size={18}/>:<Link2 size={18}/>}</i></label>)}</div></div>
    <Field label="ملاحظات الوحدة التشغيلية" full><textarea rows={3} value={draft.operations.notes} onChange={event=>updateOperations('notes',event.target.value)} placeholder="موقع أدوات التنظيف، تعليمات الدخول أو ملاحظات ثابتة عن الوحدة..."/></Field>
  </div></section>;
}

function ReviewStep({ draft, selectedListingName }: { draft: UnitDraft; selectedListingName?: string }) {
  return <section className="unit-step-content"><StepHeading icon={CheckCircle2} title="راجع بيانات الوحدة" description="تأكد من صحة المعلومات قبل إنشاء الوحدة في BluClean."/><div className="review-hero"><span className="ref-thumbnail u1"/><div><small>{draft.source.mode === 'manual' ? 'إضافة يدوية' : `مستوردة من ${integrationProviders.find(item => item.id === draft.source.importedFrom)?.name}`}</small><h2>{draft.identity.name || selectedListingName}</h2><p><MapPin size={14}/>{draft.identity.propertyName} · {draft.location.city}</p></div><b>{statusLabels[draft.identity.status]}</b></div><div className="review-grid"><ReviewCard icon={Building2} title="بيانات الوحدة" rows={[['الكود',draft.identity.code],['النوع',draft.identity.type],['العنوان',draft.location.address],['السعة',`${draft.capacity.maxGuests} ضيوف · ${draft.capacity.bedrooms} غرف`]]}/><ReviewCard icon={Clock3} title="الإعدادات الافتراضية" rows={[['نمط الإدارة',managementLabel(draft.operations.managementMode)],['الدخول',draft.operations.checkInTime],['الخروج',draft.operations.checkOutTime],['مدة التنظيف',`${draft.operations.cleaningDurationMinutes} دقيقة`]]}/><ReviewCard icon={RefreshCw} title="المنصات والمزامنة" rows={draft.integrations.length ? draft.integrations.map(item => [integrationProviders.find(provider => provider.id === item.provider)?.name ?? item.provider, item.syncMode === 'full' ? 'مزامنة كاملة' : 'الحجوزات فقط']) : [['الربط','تشغيل مستقل بدون منصات'],['تنظيف بعد المغادرة',draft.operations.autoCleaningAfterCheckout?'مفعّل':'غير مفعّل']]}/><ReviewCard icon={ImagePlus} title="الصور والاستيراد" rows={[['صور محلية',`${draft.media.fileNames.length} صور`],['صور المنصة',draft.source.mode === 'import' && draft.importOptions.photos ? 'سيتم استيرادها' : 'غير مطلوبة'],['الحجوزات',draft.source.mode === 'import' && draft.importOptions.reservations ? 'سيتم استيراد القادمة' : 'غير مطلوبة']]}/></div><div className="review-notice"><CircleAlert size={18}/><p>إنشاء الوحدة يحفظ الإعدادات الافتراضية والربط فقط. جداول التنظيف والخدمات الدورية وطلبات الصيانة الفعلية تُنشأ لاحقًا من قسم التشغيل والخدمات.</p></div></section>;
}

function StepHeading({ icon: Icon, title, description }: { icon: typeof Building2; title: string; description: string }) {
  return <div className="unit-step-heading"><span><Icon size={22}/></span><div><h2>{title}</h2><p>{description}</p></div></div>;
}

function Field({ label, hint, required, full, children }: { label: string; hint?: string; required?: boolean; full?: boolean; children: ReactNode }) {
  return <label className={`unit-field ${full ? 'full' : ''}`}><span>{label}{required && <em>*</em>}{hint && <small>{hint}</small>}</span>{children}</label>;
}

function Counter({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <div className="unit-counter"><span>{label}</span><div><button onClick={() => onChange(Math.max(0, value - 1))}>−</button><b>{value}</b><button onClick={() => onChange(value + 1)}>+</button></div></div>;
}

function SummaryLine({ label, value }: { label: string; value: string }) { return <div className="unit-summary-line"><span>{label}</span><b>{value}</b></div>; }

function ReviewCard({ icon: Icon, title, rows }: { icon: typeof Building2; title: string; rows: string[][] }) { return <section><h3><Icon size={18}/>{title}</h3>{rows.map(([label,value]) => <div key={label}><span>{label}</span><b>{value || '—'}</b></div>)}</section>; }

function accessLabel(value: string) { return ({ 'smart-lock': 'قفل ذكي', 'key-box': 'صندوق مفاتيح', reception: 'الاستقبال', manual: 'تسليم يدوي' } as Record<string,string>)[value] ?? value; }
function managementLabel(value: UnitManagementMode) { return ({ 'operations-only': 'تشغيل مستقل', 'channel-sync': 'مزامنة حجوزات', hybrid: 'إدارة مختلطة' } as const)[value]; }
