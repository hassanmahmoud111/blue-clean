import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BedDouble,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  Download,
  Eye,
  FileText,
  Headphones,
  Link2,
  Plus,
  ShieldCheck,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tooltip } from '../components/ui';
import type {
  BillingOverview,
  InvoiceItem,
  PaymentMethodItem,
  UpgradePackage,
} from '../types/clientBilling';
import {
  deletePaymentMethod,
  downloadInvoicePdf,
  fetchBillingOverview,
  fetchInvoices,
  setDefaultPaymentMethod,
  upgradePlan,
} from '../services/clientBillingService';
import './reference-pages.css';

export default function BillingPage() {
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'plan' | 'units'>('invoices');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceItem | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | string | null>(null);

  // Load Overview Data
  const loadOverview = async () => {
    try {
      const data = await fetchBillingOverview();
      setOverview(data);
    } catch {
      // handled
    }
  };

  // Load Invoices
  const loadInvoices = async (p = page) => {
    setInvoicesLoading(true);
    try {
      const res = await fetchInvoices({
        search: searchQuery,
        status: statusFilter,
        type: typeFilter,
        page: p,
        per_page: 5,
      });
      setInvoices(res.data);
      if (res.meta) {
        setTotalPages(res.meta.last_page);
        setTotalCount(res.meta.total);
      }
    } finally {
      setInvoicesLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadOverview(), loadInvoices(1)]);
      setLoading(false);
    }
    init();
  }, []);

  useEffect(() => {
    setPage(1);
    loadInvoices(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadInvoices(newPage);
  };

  const handleDownload = async (invoiceId: number | string) => {
    setDownloadingId(invoiceId);
    try {
      await downloadInvoicePdf(invoiceId);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleSetDefaultPayment = async (id: number | string) => {
    await setDefaultPaymentMethod(id);
    await loadOverview();
  };

  const handleDeletePayment = async (id: number | string) => {
    if (window.confirm('هل أنت متأكد من حذف طريقة الدفع هذه؟')) {
      await deletePaymentMethod(id);
      await loadOverview();
    }
  };

  const handleConfirmUpgrade = async (pkg: UpgradePackage) => {
    setUpgrading(true);
    try {
      const defaultPm = overview?.payment_methods.find(p => p.is_default);
      await upgradePlan({
        package_id: pkg.id,
        payment_method_id: defaultPm?.id,
      });
      await loadOverview();
      await loadInvoices(1);
      setShowUpgradeModal(false);
      alert('تمت ترقية الباقة بنجاح!');
    } finally {
      setUpgrading(false);
    }
  };

  const plan = overview?.current_plan;
  const subDetails = overview?.subscription_details;
  const upgradeBanner = overview?.upgrade_banner;
  const paymentMethods = overview?.payment_methods || [];

  return (
    <div className="reference-page billing-page">
      <header className="reference-page-header">
        <div className="reference-page-heading">
          <div className="reference-breadcrumb">
            <Link to="/app">الرئيسية</Link>
            <ChevronLeft size={13} />
            <span>الفواتير والاشتراك</span>
          </div>
          <h1>
            <CreditCard size={29} />
            الفواتير والاشتراك
          </h1>
          <p>إدارة باقتك الحالية، استهلاك الوحدات، الفواتير، وطرق الدفع المحفوظة</p>
        </div>
      </header>

      {/* Top 3 Overview Panels */}
      <section className="billing-overview">
        {/* Panel 1: Current Plan */}
        <article className="reference-panel current-plan">
          <div className="current-plan-top">
            <span className="reference-chip">{plan?.badge || 'الخطة الحالية'}</span>
            <button
              type="button"
              className="reference-secondary"
              style={{ height: 36, minWidth: 158 }}
              onClick={() => setShowUpgradeModal(true)}
            >
              ترقية الباقة
              <ArrowUp size={16} />
            </button>
          </div>
          <h2>{plan?.name_ar || 'الباقة الاحترافية'}</h2>
          <p>{plan?.description_ar || 'مناسبة للمضيفين ومديري العقارات'}</p>
          <div className="plan-count">
            <span>
              <strong>{plan?.units_usage.formatted || '12 / 50'}</strong>
              <br />
              وحدة مستخدمة ({plan?.units_usage.usage_percentage ?? 24}%)
            </span>
            <i style={{ position: 'relative' }}>
              <span
                style={{
                  display: 'block',
                  height: '100%',
                  width: `${Math.min(100, plan?.units_usage.usage_percentage ?? 24)}%`,
                  background: 'linear-gradient(90deg,#38c279,#7cdb6b)',
                  borderRadius: 7,
                }}
              />
            </i>
          </div>
          <div className="plan-features">
            {(plan?.features || ['إدارة حتى 100 وحدة', 'ربط جميع المنصات', 'تقارير متقدمة', 'دعم فني مميز']).map(
              (feat, idx) => {
                const icons = [BedDouble, Link2, FileText, Headphones];
                const Icon = icons[idx % icons.length];
                return <PlanFeature key={idx} icon={Icon} text={feat} />;
              }
            )}
          </div>
        </article>

        {/* Panel 2: Subscription Details */}
        <article className="reference-panel subscription-details">
          <h2>تفاصيل الاشتراك</h2>
          <DetailRow label="تاريخ بدء الاشتراك" value={subDetails?.start_date_formatted || '1 يناير 2026'} />
          <DetailRow label="تاريخ التجديد القادم" value={subDetails?.next_billing_date_formatted || '1 أكتوبر 2026'} />
          <DetailRow label="القيمة الشهرية" value={subDetails?.monthly_price_formatted || '599 ر.س'} />
          <div className="detail-row">
            <span>طريقة الدفع</span>
            <span className="payment-mark">
              <i className="mastercard" />
              <b>{subDetails?.payment_method?.masked_number || '•••• 4242'}</b>
              <button
                type="button"
                className="reference-link"
                onClick={() => setActiveTab('payments')}
              >
                تعديل
              </button>
            </span>
          </div>
          <DetailRow
            label="حالة الاشتراك"
            value={<span className="reference-chip green">{subDetails?.status_label || 'نشط'}</span>}
          />
        </article>

        {/* Panel 3: Upgrade Upsell Banner */}
        <article className="reference-panel upsell-card">
          <Crown size={38} color="#ffae20" />
          <h2>{upgradeBanner?.title || 'احصل على المزيد مع الباقة المتقدمة'}</h2>
          <p>{upgradeBanner?.description || 'مزيد من الوحدات، تقارير أعمق، وأفضلية لدعم أعمالك.'}</p>
          <button
            type="button"
            className="reference-primary"
            onClick={() => setShowUpgradeModal(true)}
          >
            {upgradeBanner?.button_text || 'ترقية الآن'}
            <ArrowLeft size={17} />
          </button>
        </article>
      </section>

      {/* Main Content & Sidebar */}
      <section className="billing-main">
        <article className="reference-panel invoices-card">
          {/* Navigation Tabs */}
          <div className="billing-tabs">
            <button
              type="button"
              className={activeTab === 'invoices' ? 'active' : ''}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText size={19} />
              الفواتير
            </button>
            <button
              type="button"
              className={activeTab === 'payments' ? 'active' : ''}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={19} />
              طرق الدفع
            </button>
            <button
              type="button"
              className={activeTab === 'plan' ? 'active' : ''}
              onClick={() => setActiveTab('plan')}
            >
              <Tag size={19} />
              تفاصيل الباقة
            </button>
            <button
              type="button"
              className={activeTab === 'units' ? 'active' : ''}
              onClick={() => setActiveTab('units')}
            >
              <BedDouble size={19} />
              استخدام الوحدات
            </button>
          </div>

          {/* TAB 1: INVOICES */}
          {activeTab === 'invoices' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100% - 52px)' }}>
              <div className="invoice-head">
                <div className="invoice-title">
                  <h2>
                    الفواتير <FileText size={17} style={{ display: 'inline' }} />
                  </h2>
                  <p>جميع الفواتير المتعلقة باشتراكك وخدماتك الإضافية</p>
                </div>
                <div className="invoice-filters">
                  <div className="reference-search" style={{ minWidth: 200 }}>
                    <input
                      type="text"
                      placeholder="ابحث برقم الفاتورة أو الوصف..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <select
                    className="reference-control"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">جميع الحالات</option>
                    <option value="paid">مدفوعة</option>
                    <option value="unpaid">غير مدفوعة</option>
                    <option value="pending">معلقة</option>
                    <option value="refunded">مسترجعة</option>
                  </select>
                  <select
                    className="reference-control"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                  >
                    <option value="all">جميع الأنواع</option>
                    <option value="package_subscription">اشتراك باقة</option>
                    <option value="cleaning_service">خدمة تنظيف</option>
                    <option value="maintenance_service">صيانة</option>
                    <option value="extra_service">خدمات إضافية</option>
                  </select>
                </div>
              </div>

              <div style={{ flex: 1, overflowY: 'auto' }}>
                <table className="reference-table">
                  <thead>
                    <tr>
                      <th>رقم الفاتورة</th>
                      <th>التاريخ</th>
                      <th>الوصف</th>
                      <th>المبلغ</th>
                      <th>الحالة</th>
                      <th>إجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesLoading ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px' }}>
                          جارٍ تحميل الفواتير...
                        </td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: '#718799' }}>
                          لا توجد فواتير مطابقة للبحث أو الفلتر
                        </td>
                      </tr>
                    ) : (
                      invoices.map(row => (
                        <tr key={row.id}>
                          <td>
                            <button
                              type="button"
                              className="reference-link"
                              style={{ fontWeight: 700 }}
                              onClick={() => setSelectedInvoice(row)}
                            >
                              {row.invoice_number}
                            </button>
                          </td>
                          <td>{row.invoice_date_formatted || row.invoice_date}</td>
                          <td>
                            <strong>{row.description}</strong>
                            {row.sub_description && <small>{row.sub_description}</small>}
                          </td>
                          <td>
                            <strong>{row.amount_formatted || `${row.total_amount} ${row.currency}`}</strong>
                          </td>
                          <td>
                            <span
                              className={`reference-chip ${
                                row.status === 'paid' ? 'green' : row.status === 'pending' ? 'orange' : 'red'
                              }`}
                            >
                              {row.status_label || (row.status === 'paid' ? 'مدفوعة' : row.status)}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions-cell">
                              <Tooltip text="عرض تفاصيل الفاتورة">
                                <button
                                  type="button"
                                  className="table-icon-btn primary"
                                  aria-label="عرض التفاصيل"
                                  onClick={() => setSelectedInvoice(row)}
                                >
                                  <Eye size={16} />
                                </button>
                              </Tooltip>
                              <Tooltip text="تحميل الفاتورة PDF">
                                <button
                                  type="button"
                                  className="table-icon-btn clean"
                                  aria-label="تحميل PDF"
                                  disabled={downloadingId === row.id}
                                  onClick={() => handleDownload(row.id)}
                                >
                                  <Download size={15} />
                                </button>
                              </Tooltip>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <footer className="reference-pagination">
                <div className="page-size">
                  <span>
                    عرض {invoices.length > 0 ? (page - 1) * 5 + 1 : 0} -{' '}
                    {Math.min(page * 5, totalCount)} من {totalCount} فواتير
                  </span>
                </div>
                <div className="pagination-buttons">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      type="button"
                      className={p === page ? 'active' : ''}
                      onClick={() => handlePageChange(p)}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </footer>
            </div>
          )}

          {/* TAB 2: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div style={{ padding: 24, height: 'calc(100% - 52px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>طرق الدفع المسجلة</h3>
                  <p style={{ margin: '4px 0 0', color: '#687f91', fontSize: 11 }}>
                    إدارة البطاقات المستخدمة في تسوية الفواتير والتجديد التلقائي
                  </p>
                </div>
                <Link to="/app/new/payment" className="reference-primary" style={{ height: 40, minWidth: 160 }}>
                  <Plus size={16} />
                  إضافة بطاقة جديدة
                </Link>
              </div>

              <div style={{ display: 'grid', gap: 14 }}>
                {paymentMethods.map(pm => (
                  <div
                    key={pm.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 16,
                      border: '1px solid #dce8ee',
                      borderRadius: 10,
                      background: pm.is_default ? '#f3fafc' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div className="payment-logo" style={{ width: 52, height: 38 }}>
                        {pm.brand === 'mastercard' ? <i className="mastercard" /> : 'VISA'}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <strong style={{ fontSize: 13, direction: 'ltr' }}>
                            •••• •••• •••• {pm.last4}
                          </strong>
                          {pm.is_default && <span className="reference-chip green">رئيسية</span>}
                        </div>
                        <small style={{ color: '#6d8394', fontSize: 11 }}>
                          تاريخ الانتهاء: {pm.expiry_date || '12/2028'}
                          {pm.holder_name && ` • حامل البطاقة: ${pm.holder_name}`}
                        </small>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      {!pm.is_default && (
                        <button
                          type="button"
                          className="reference-secondary"
                          style={{ height: 34, minWidth: 120, fontSize: 11 }}
                          onClick={() => handleSetDefaultPayment(pm.id)}
                        >
                          تعيين كرئيسية
                        </button>
                      )}
                      <button
                        type="button"
                        className="ref-more"
                        title="حذف"
                        style={{ color: '#d9383a' }}
                        onClick={() => handleDeletePayment(pm.id)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PACKAGE DETAILS */}
          {activeTab === 'plan' && (
            <div style={{ padding: 24, height: 'calc(100% - 52px)', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <span className="reference-chip green" style={{ marginBottom: 8 }}>
                    {plan?.badge || 'الخطة الحالية'}
                  </span>
                  <h2 style={{ margin: 0, fontSize: 20 }}>{plan?.name_ar}</h2>
                  <p style={{ margin: '4px 0 0', color: '#607b8e' }}>{plan?.description_ar}</p>
                </div>
                <button
                  type="button"
                  className="reference-primary"
                  onClick={() => setShowUpgradeModal(true)}
                >
                  ترقية الخطة <ArrowUp size={16} />
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 16, border: '1px solid #e1ebf0', borderRadius: 10 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#133e5e' }}>محددات الباقة</h4>
                  <p style={{ margin: '6px 0', fontSize: 12 }}>
                    <strong>الوحدات المتاحة:</strong> {plan?.units_usage.max_units} وحدة
                  </p>
                  <p style={{ margin: '6px 0', fontSize: 12 }}>
                    <strong>الوحدات المستخدمة:</strong> {plan?.units_usage.used_units} وحدة
                  </p>
                  <p style={{ margin: '6px 0', fontSize: 12 }}>
                    <strong>دورة الفوترة:</strong> شهريًا ({subDetails?.monthly_price_formatted})
                  </p>
                </div>
                <div style={{ padding: 16, border: '1px solid #e1ebf0', borderRadius: 10 }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#133e5e' }}>الميزات المشمولة</h4>
                  <ul style={{ margin: 0, paddingRight: 18, fontSize: 11, color: '#4a677d', lineHeight: 1.8 }}>
                    {plan?.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: UNITS USAGE */}
          {activeTab === 'units' && (
            <div style={{ padding: 24, height: 'calc(100% - 52px)', overflowY: 'auto' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>استهلاك الوحدات العقارية</h3>
              <p style={{ margin: '0 0 20px', color: '#668093', fontSize: 12 }}>
                تتبع عدد الوحدات المضافة مقابل الحد الأقصى المسموح به في باقتك الحالية
              </p>

              <div style={{ padding: 20, border: '1px solid #dce8ee', borderRadius: 12, background: '#f8fbfc', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 14 }}>
                    {plan?.units_usage.used_units} من أصل {plan?.units_usage.max_units} وحدة
                  </span>
                  <span style={{ fontWeight: 800, color: '#097da4' }}>
                    {plan?.units_usage.usage_percentage}%
                  </span>
                </div>
                <div style={{ height: 12, borderRadius: 6, background: '#e1eaef', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${Math.min(100, plan?.units_usage.usage_percentage ?? 24)}%`,
                      background: 'linear-gradient(90deg, #1397b9, #28b87c)',
                      borderRadius: 6,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#eff8fb', borderRadius: 10 }}>
                <div>
                  <b style={{ fontSize: 13, color: '#0c3858' }}>هل تحتاج لإضافة وحدات جديدة تتجاوز الحد؟</b>
                  <p style={{ margin: '4px 0 0', color: '#5b768a', fontSize: 11 }}>
                    قم بترقية باقتك إلى باقة الأعمال للحصول على عدد غير محدود من الوحدات وإمكانيات ربط متقدمة.
                  </p>
                </div>
                <button
                  type="button"
                  className="reference-primary"
                  style={{ height: 38, minWidth: 140 }}
                  onClick={() => setShowUpgradeModal(true)}
                >
                  ترقية الباقة الآن
                </button>
              </div>
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="billing-side">
          <section className="reference-panel billing-side-card">
            <h2>
              <CreditCard size={22} />
              طرق الدفع
            </h2>
            {paymentMethods.slice(0, 2).map(pm => (
              <PaymentRow
                key={pm.id}
                type={pm.brand === 'mastercard' ? 'mastercard' : 'visa'}
                number={pm.last4}
                date={pm.expiry_date || '12/2028'}
                primary={pm.is_default}
                onSelectDefault={() => handleSetDefaultPayment(pm.id)}
              />
            ))}
            <Link
              className="reference-secondary"
              to="/app/new/payment"
              style={{ width: '100%', height: 41, marginTop: 13 }}
            >
              <Plus size={17} />
              إضافة طريقة دفع جديدة
            </Link>
          </section>

          <section className="reference-panel billing-side-card support-card">
            <Headphones size={31} />
            <h2>هل تحتاج مساعدة؟</h2>
            <p>فريق الدعم جاهز لمساعدتك في أي استفسار يتعلق بالاشتراك أو الفواتير</p>
            <Link to="/app/support/new" className="reference-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
              تواصل مع الدعم
              <ArrowLeft size={16} />
            </Link>
          </section>

          <section className="reference-panel billing-side-card faq-card">
            <h2>
              <FileText size={20} style={{ display: 'inline' }} /> الأسئلة الشائعة
            </h2>
            <p>تعرّف على أهم الأسئلة حول الاشتراكات، الفوترة وطرق الدفع.</p>
            <Link to="/how-it-works" style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#087bd0', textDecoration: 'none', fontWeight: 700 }}>
              عرض الأسئلة الشائعة
              <ArrowLeft size={15} />
            </Link>
          </section>
        </aside>
      </section>

      {/* MODAL 1: INVOICE DETAILS */}
      {selectedInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(8,30,48,0.55)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 520,
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid #e3edf2',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 17, color: '#082f50' }}>
                  فاتورة {selectedInvoice.invoice_number}
                </h3>
                <small style={{ color: '#627c90' }}>
                  {selectedInvoice.invoice_date_formatted || selectedInvoice.invoice_date}
                </small>
              </div>
              <button
                type="button"
                className="ref-more"
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 22, display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                <span style={{ color: '#647e92' }}>الوصف:</span>
                <b>{selectedInvoice.description}</b>
              </div>
              {selectedInvoice.sub_description && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                  <span style={{ color: '#647e92' }}>تفاصيل إضافية:</span>
                  <span>{selectedInvoice.sub_description}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                <span style={{ color: '#647e92' }}>المبلغ الأساسي:</span>
                <span>{selectedInvoice.amount} {selectedInvoice.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                <span style={{ color: '#647e92' }}>الضريبة:</span>
                <span>{selectedInvoice.tax_amount} {selectedInvoice.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                <span style={{ color: '#072e50', fontWeight: 800 }}>الإجمالي:</span>
                <strong style={{ fontSize: 16, color: '#087ca4' }}>
                  {selectedInvoice.amount_formatted || `${selectedInvoice.total_amount} ${selectedInvoice.currency}`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eef3f6', paddingBottom: 8 }}>
                <span style={{ color: '#647e92' }}>طريقة الدفع:</span>
                <span>{selectedInvoice.payment_method || 'Mastercard •••• 4242'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <span style={{ color: '#647e92' }}>الحالة:</span>
                <span className={`reference-chip ${selectedInvoice.status === 'paid' ? 'green' : 'orange'}`}>
                  {selectedInvoice.status_label || selectedInvoice.status}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '16px 22px',
                background: '#f8fbfc',
                borderTop: '1px solid #e3edf2',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                type="button"
                className="reference-secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                إغلاق
              </button>
              <button
                type="button"
                className="reference-primary"
                disabled={downloadingId === selectedInvoice.id}
                onClick={() => handleDownload(selectedInvoice.id)}
              >
                <Download size={15} />
                {downloadingId === selectedInvoice.id ? 'جارٍ التحميل...' : 'تحميل PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: UPGRADE PLAN */}
      {showUpgradeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(8,30,48,0.55)',
            backdropFilter: 'blur(3px)',
            display: 'grid',
            placeItems: 'center',
            padding: 16,
          }}
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 580,
              background: '#fff',
              borderRadius: 14,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e3edf2',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={22} color="#087aa3" />
                <h3 style={{ margin: 0, fontSize: 18, color: '#082f50' }}>ترقية باقة الاشتراك</h3>
              </div>
              <button
                type="button"
                className="ref-more"
                onClick={() => setShowUpgradeModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ margin: '0 0 16px', color: '#5f798e', fontSize: 12 }}>
                اختر الباقة المناسبة لتوسيع نطاق أعمالك وإدارة المزيد من الوحدات العقارية بكل مرونة:
              </p>

              <div style={{ display: 'grid', gap: 12 }}>
                {(upgradeBanner?.available_packages || [
                  {
                    id: 3,
                    name_ar: 'باقة الأعمال المتقدمة',
                    price: 999,
                    price_text_ar: '999 ر.س / شهريًا',
                    description_ar: 'إدارة وحدات غير محدودة، تقارير مالية تفصيلية، وأولوية في الدعم الفني.',
                  },
                ]).map(pkg => (
                  <div
                    key={pkg.id}
                    style={{
                      border: '2px solid #08779e',
                      borderRadius: 12,
                      padding: 18,
                      background: 'linear-gradient(135deg, #f3f9fb, #fff)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: 16, color: '#083253' }}>{pkg.name_ar}</h4>
                      <strong style={{ color: '#087aa3', fontSize: 14 }}>
                        {pkg.price_text_ar || `${pkg.price} ر.س`}
                      </strong>
                    </div>
                    <p style={{ margin: '8px 0 14px', color: '#627c90', fontSize: 11 }}>
                      {pkg.description_ar}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="reference-primary"
                        style={{ height: 38, minWidth: 140 }}
                        disabled={upgrading}
                        onClick={() => handleConfirmUpgrade(pkg)}
                      >
                        {upgrading ? 'جارٍ الترقية...' : 'اختيار وترقية'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: '14px 24px',
                background: '#f8fbfc',
                borderTop: '1px solid #e3edf2',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                className="reference-secondary"
                onClick={() => setShowUpgradeModal(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlanFeature({ icon: Icon, text }: { icon: typeof BedDouble; text: string }) {
  return (
    <span className="plan-feature">
      <Icon size={21} />
      {text}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="detail-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function PaymentRow({
  type,
  number,
  date,
  primary = false,
  onSelectDefault,
}: {
  type: 'mastercard' | 'visa';
  number: string;
  date: string;
  primary?: boolean;
  onSelectDefault?: () => void;
}) {
  return (
    <div className="payment-card-row">
      <span className="payment-logo">
        {type === 'mastercard' ? <i className="mastercard" /> : 'VISA'}
      </span>
      <span>
        <strong>•••• •••• •••• {number}</strong>
        <small>تاريخ الانتهاء {date}</small>
      </span>
      {primary ? (
        <span
          className="reference-chip green"
          style={{ position: 'absolute', marginRight: 55, marginTop: -42, minWidth: 45, height: 21 }}
        >
          رئيسية
        </span>
      ) : (
        <button
          type="button"
          className="ref-more"
          title="تعيين كرئيسية"
          onClick={onSelectDefault}
        >
          <Check size={14} />
        </button>
      )}
    </div>
  );
}
