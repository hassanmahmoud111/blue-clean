import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Headphones,
  Info,
  LifeBuoy,
  Paperclip,
  Send,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { SearchableSelect } from '../components/SearchableSelect';
import { createClientTicket } from '../services/supportTicketService';
import type { TicketCategory, TicketPriority } from '../types/supportTicket';
import './reference-pages.css';
import './create-page.css';

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<TicketCategory>('integration_sync');
  const [priority, setPriority] = useState<TicketPriority>('normal');
  const [relatedTo, setRelatedTo] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleFileUpload = () => {
    const dummyFile = `screenshot_${Date.now().toString().slice(-4)}.png`;
    setFiles(prev => [...prev, dummyFile]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!subject.trim()) return;

    setSaving(true);
    try {
      await createClientTicket({
        subject: subject.trim(),
        category,
        priority,
        message: description.trim() || 'أحتاج مساعدة فريق الدعم في هذا الطلب.',
        attachments: files,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <div className="reference-page create-page">
        <section className="create-success reference-panel">
          <span>
            <CheckCircle2 size={42} />
          </span>
          <h1>تم إرسال تذكرة الدعم بنجاح</h1>
          <p>تم تسجيل تذكرتك وسيتم التواصل معك ومتابعة الحالة مباشرة من صفحة الدعم الفني.</p>
          <div>
            <Link className="reference-primary" to="/app/support">
              العودة إلى الدعم الفني
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="reference-page create-page">
      <header className="reference-page-header create-page-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to="/app/support">الدعم الفني</Link>
            <ChevronLeft size={13} />
            <span>تذكرة دعم جديدة</span>
          </div>
          <h1>
            <Headphones size={29} />
            إنشاء تذكرة دعم فني
          </h1>
          <p>صف استفسارك أو مشكلتك بدقة لمساعدتك بأسرع وقت ممكن.</p>
        </div>
      </header>

      <div className="create-layout">
        <form className="create-form" onSubmit={submit}>
          <section className="reference-panel create-section">
            <div className="create-section-head">
              <span>1</span>
              <div>
                <h2>تفاصيل التذكرة الأساسية</h2>
                <p>حدد موضوع التذكرة والتصنيف ومستوى الأولوية.</p>
              </div>
            </div>
            <div className="create-fields">
              <label className="create-field full">
                <span>
                  موضوع التذكرة <em>*</em>
                </span>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="مثال: مشكلة في مزامنة أحد حجوزات Airbnb"
                />
              </label>

              <div className="create-field">
                <span>
                  التصنيف <em>*</em>
                </span>
                <SearchableSelect
                  value={category}
                  onChange={val => setCategory(val as TicketCategory)}
                  options={[
                    { value: 'integration_sync', label: 'الربط والمزامنة' },
                    { value: 'units_bookings', label: 'الوحدات والحجوزات' },
                    { value: 'operations_services', label: 'التشغيل والخدمات' },
                    { value: 'account_permissions', label: 'الحساب والصلاحيات' },
                    { value: 'billing_subscription', label: 'الفواتير والاشتراك' },
                    { value: 'other', label: 'أخرى' },
                  ]}
                  placeholder="اختر التصنيف..."
                />
              </div>

              <div className="create-field">
                <span>
                  الأولوية <em>*</em>
                </span>
                <SearchableSelect
                  value={priority}
                  onChange={val => setPriority(val as TicketPriority)}
                  options={[
                    { value: 'normal', label: 'عادية (الرد خلال ساعات)' },
                    { value: 'medium', label: 'متوسطة (أولوية قياسية)' },
                    { value: 'urgent', label: 'عاجلة (خلل يؤثر على التشغيل الفوري)' },
                  ]}
                  placeholder="اختر الأولوية..."
                />
              </div>

              <label className="create-field full">
                <span>العنصر المرتبط (اختياري)</span>
                <input
                  type="text"
                  value={relatedTo}
                  onChange={e => setRelatedTo(e.target.value)}
                  placeholder="مثال: شقة 102، أو رقم حجز RES-2026-1842"
                />
              </label>
            </div>
          </section>

          <section className="reference-panel create-section">
            <div className="create-section-head">
              <span>2</span>
              <div>
                <h2>شرح المشكلة والمرفقات</h2>
                <p>اكتب التفاصيل الكاملة وأرفق لقطات الشاشة أو المستندات المساعدة.</p>
              </div>
            </div>
            <div className="create-fields">
              <label className="create-field full">
                <span>
                  شرح وتفاصيل المشكلة <em>*</em>
                </span>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="ما الذي حدث بالتحديد؟ وما الخطوات التي قمت بها قبل ظهور المشكلة؟"
                />
              </label>

              <div className="create-field full">
                <span>المرفقات والصور</span>
                <button type="button" className="support-drop" onClick={handleFileUpload}>
                  <Paperclip size={19} />
                  <b>إرفاق صورة أو مستند</b>
                  <small>اختياري — PNG، JPG، PDF حتى 10MB</small>
                </button>
                {files.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {files.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: '#eef6f9',
                          padding: '4px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          color: '#086e92',
                        }}
                      >
                        <Paperclip size={12} />
                        {f}
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <footer className="reference-panel create-actions">
            <button type="button" className="reference-secondary" onClick={() => navigate('/app/support')}>
              إلغاء
            </button>
            <button className="reference-primary" disabled={saving}>
              <Send size={16} />
              {saving ? 'جارٍ الإرسال...' : 'إرسال التذكرة'}
            </button>
          </footer>
        </form>

        <aside className="create-aside">
          <section className="reference-panel create-tip">
            <span>
              <LifeBuoy size={22} />
            </span>
            <h2>فريق الدعم دائمًا معك</h2>
            <p>نعمل على مدار الساعة لضمان استقرار عملياتك وتشغيل عقاراتك بسلاسة.</p>
            <ul>
              <li>
                <Check size={14} /> متوسط زمن الرد الأول أقل من ساعتين
              </li>
              <li>
                <Check size={14} /> التذاكر العاجلة تُعالج بأعلى أولوية
              </li>
              <li>
                <Check size={14} /> إمكانية متابعة المحادثة مباشرة
              </li>
            </ul>
          </section>

          <section className="reference-panel create-shortcuts">
            <h2>روابط سريعة</h2>
            <div>
              <Link to="/app/support">
                <Headphones size={17} />
                تذاكر الدعم الفني
                <ChevronLeft size={14} />
              </Link>
              <Link to="/app/settings/integrations">
                <Sparkles size={17} />
                صحة المزامنة والربط
                <ChevronLeft size={14} />
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
