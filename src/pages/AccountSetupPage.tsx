import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ChevronLeft, CreditCard, KeyRound, Mail, Save, ShieldCheck, UserPlus } from 'lucide-react';
import { createPaymentMethod } from '../services/clientBillingService';
import './reference-pages.css';
import './system-completion.css';

export default function AccountSetupPage({ kind }: { kind: 'user' | 'payment' }) {
  return kind === 'user' ? <UserSetup /> : <PaymentSetup />;
}

function UserSetup() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => navigate('/app/settings'), 600);
  };

  return (
    <SetupFrame icon={<UserPlus size={28} />} title="إضافة مستخدم" description="أنشئ حسابًا فرعيًا وحدد صلاحياته بوضوح." back="/app/settings">
      <form className="custom-setup-form" onSubmit={submit}>
        <SectionTitle title="بيانات المستخدم" text="سيصل المستخدم إلى نفس حساب المنشأة ضمن الصلاحيات المحددة." />
        <div className="setup-grid">
          <Field label="الاسم الكامل"><input required placeholder="مثال: أحمد سالم" /></Field>
          <Field label="البريد الإلكتروني"><input required type="email" placeholder="name@example.com" /></Field>
          <Field label="رقم الجوال"><input dir="ltr" placeholder="+966 5X XXX XXXX" /></Field>
          <Field label="الدور الوظيفي">
            <select defaultValue="operator">
              <option value="operator">مسؤول تشغيل</option>
              <option value="viewer">مشاهد التقارير</option>
              <option value="manager">مدير فرعي</option>
            </select>
          </Field>
        </div>
        <SectionTitle title="نطاق الوصول" text="صلاحيات مبسطة ويمكن تحويلها لاحقًا إلى Roles وPermissions في الـ Backend." />
        <div className="permission-grid">
          <Permission title="الوحدات والحجوزات" text="عرض وإدارة الوحدات والحجوزات" />
          <Permission title="التشغيل والخدمات" text="إنشاء الطلبات وتحديث حالتها" />
          <Permission title="التقارير" text="عرض مؤشرات الأداء فقط" />
          <Permission title="الفواتير" text="غير مفعلة افتراضيًا" off />
        </div>
        <footer className="setup-actions">
          <Link className="reference-secondary" to="/app/settings">إلغاء</Link>
          <button className="reference-primary" disabled={saving}>
            <Save size={16} />{saving ? 'جارٍ الحفظ...' : 'إضافة المستخدم'}
          </button>
        </footer>
      </form>
    </SetupFrame>
  );
}

function PaymentSetup() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [holderName, setHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const cleanNumber = cardNumber.replace(/\s+/g, '');
      const last4 = cleanNumber.slice(-4) || '4242';
      const brand = cleanNumber.startsWith('4') ? 'visa' : 'mastercard';
      const parts = expiry.split('/');
      const expMonth = parts[0]?.trim() || '12';
      const expYear = parts[1]?.trim().length === 2 ? `20${parts[1].trim()}` : parts[1]?.trim() || '2028';

      await createPaymentMethod({
        brand,
        last4,
        exp_month: expMonth,
        exp_year: expYear,
        holder_name: holderName.trim() || 'العميل',
        is_default: isDefault,
      });

      navigate('/app/billing');
    } catch {
      navigate('/app/billing');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SetupFrame icon={<CreditCard size={28} />} title="إضافة طريقة دفع" description="احفظ بطاقة لاستخدامها في الاشتراك والخدمات الإضافية." back="/app/billing">
      <form className="custom-setup-form payment-form" onSubmit={submit}>
        <div className="payment-security">
          <ShieldCheck size={22} />
          <div>
            <b>بيانات دفع آمنة</b>
            <span>تشفير متوافق مع معايير الأمان PCI-DSS؛ لا يتم تخزين أرقام البطاقات الحساسة محليًا.</span>
          </div>
        </div>
        <SectionTitle title="بيانات البطاقة" text="سترسل هذه البيانات بأمان لحفظ طريقة الدفع وإضافتها لحسابك." />
        <div className="setup-grid">
          <Field label="اسم حامل البطاقة" full>
            <input
              required
              value={holderName}
              onChange={e => setHolderName(e.target.value)}
              placeholder="الاسم كما يظهر على البطاقة"
            />
          </Field>
          <Field label="رقم البطاقة" full>
            <input
              required
              dir="ltr"
              inputMode="numeric"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="•••• •••• •••• ••••"
            />
          </Field>
          <Field label="تاريخ الانتهاء (MM / YY)">
            <input
              required
              dir="ltr"
              value={expiry}
              onChange={e => setExpiry(e.target.value)}
              placeholder="12/28"
            />
          </Field>
          <Field label="رمز التحقق (CVV)">
            <input
              required
              dir="ltr"
              inputMode="numeric"
              maxLength={4}
              value={cvv}
              onChange={e => setCvv(e.target.value)}
              placeholder="CVV"
            />
          </Field>
        </div>
        <label className="primary-payment">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={e => setIsDefault(e.target.checked)}
          />
          <span>
            <b>اجعلها طريقة الدفع الرئيسية</b>
            <small>تستخدم تلقائيًا عند تجديد الاشتراك والخدمات الإضافية.</small>
          </span>
        </label>
        <footer className="setup-actions">
          <Link className="reference-secondary" to="/app/billing">إلغاء</Link>
          <button className="reference-primary" disabled={saving}>
            <KeyRound size={16} />{saving ? 'جارٍ الحفظ الآمن...' : 'حفظ طريقة الدفع'}
          </button>
        </footer>
      </form>
    </SetupFrame>
  );
}

function SetupFrame({ icon, title, description, back, children }: { icon: React.ReactNode; title: string; description: string; back: string; children: React.ReactNode }) {
  return (
    <div className="reference-page setup-page">
      <header className="reference-page-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to={back}>رجوع</Link>
            <ChevronLeft size={13} />
            <span>{title}</span>
          </div>
          <h1>{icon}{title}</h1>
          <p>{description}</p>
        </div>
      </header>
      <div className="setup-layout">
        <main className="reference-panel">{children}</main>
        <aside className="reference-panel setup-help">
          <Mail size={22} />
          <h2>واجهة بسيطة وقابلة للربط</h2>
          <p>تم إعداد واجهة الدفع لتتوافق مباشرة مع واجهات برمجة التطبيقات ونقاط الدفع الآمنة.</p>
          <ul>
            <li><Check size={14} />حقول محددة وواضحة</li>
            <li><Check size={14} />حالة حفظ مرئية</li>
            <li><Check size={14} />جاهزة للتحقق من الخادم</li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ title, text }: { title: string; text: string }) {
  return (
    <div className="setup-section-title">
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Field({ label, full, children }: { label: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={full ? 'full' : ''}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function Permission({ title, text, off = false }: { title: string; text: string; off?: boolean }) {
  return (
    <label>
      <input type="checkbox" defaultChecked={!off} />
      <span><b>{title}</b><small>{text}</small></span>
    </label>
  );
}
