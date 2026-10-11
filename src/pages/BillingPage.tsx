import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  BedDouble,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  FileText,
  Headphones,
  Home,
  Plus,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type {
  BillingOverview,
  InvoiceItem,
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
import { useLanguage } from '../context/LanguageContext';
import './billing-page.css';

export default function BillingPage() {
  const { lang, isRTL, t } = useLanguage();
  const [overview, setOverview] = useState<BillingOverview | null>(null);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'invoices' | 'payments' | 'plan' | 'units'>('invoices');

  // Filters & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(5);

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
      await Promise.all([loadOverview(), loadInvoices(1)]);
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
    <div className="billing-page-container">
      {/* Header */}
      <header className="billing-header">
        <div>
          <div className="billing-breadcrumb">
            <Link to="/app" style={{ color: 'inherit', textDecoration: 'none' }}>
              {t('nav.dashboard')}
            </Link>
            <span>&gt;</span>
            <span>{t('billing.title')}</span>
          </div>
          <div className="billing-title-row">
            <div className="billing-title-badge">
              <CreditCard size={18} />
            </div>
            <h1>{t('billing.title')}</h1>
          </div>
          <p>
            {lang === 'en'
              ? 'Manage your subscription plan, invoices, unit quota, and saved payment methods.'
              : 'إدارة خطتك، الفواتير، الاستهلاك وطرق الدفع المحفوظة'}
          </p>
        </div>
      </header>

      {/* Top Overview Grid */}
      <section className="billing-top-grid">
        {/* Right Card: Current Plan */}
        <div className="billing-plan-card">
          <div className="plan-card-top">
            <span className="plan-current-badge">
              {lang === 'en' ? 'Current Plan' : (plan?.badge || 'الخطة الحالية')}
            </span>
            <button
              type="button"
              className="plan-upgrade-btn"
              onClick={() => setShowUpgradeModal(true)}
            >
              <ArrowUp size={13} />
              {lang === 'en' ? 'Upgrade Plan' : 'ترقية الباقة'}
            </button>
          </div>

          <div className="plan-title-block">
            <h2>{lang === 'en' ? (plan?.name_en || 'Basic') : (plan?.name_ar || 'الأساسية')}</h2>
            <p>
              {lang === 'en'
                ? (plan?.description_en || 'For individual hosts with few units')
                : (plan?.description_ar || 'للمضيف الفردي والوحدات القليلة')}
            </p>
          </div>

          <div className="plan-usage-block">
            <div className="plan-usage-header">
              <span className="plan-usage-numbers">{plan?.units_usage.formatted || '7 / 5'}</span>
              <span className="plan-usage-label">
                {lang === 'en' ? 'Units Used' : 'وحدة مستخدمة'}
              </span>
            </div>
            <div className="plan-progress-bar">
              <div
                className="plan-progress-fill red"
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="plan-features-row">
            <div className="plan-feature-item">
              <Home size={18} />
              <span>{lang === 'en' ? 'Units & Bookings' : 'إدارة الوحدات والحجوزات'}</span>
            </div>
            <div className="plan-feature-item">
              <Calendar size={18} />
              <span>{lang === 'en' ? 'Unified Calendar' : 'تقويم موحد'}</span>
            </div>
            <div className="plan-feature-item">
              <ClipboardList size={18} />
              <span>{lang === 'en' ? 'Manual Operations' : 'طلبات تشغيل يدوية'}</span>
            </div>
            <div className="plan-feature-item">
              <FileText size={18} />
              <span>{lang === 'en' ? 'Core Analytics' : 'تقارير أساسية'}</span>
            </div>
          </div>
        </div>

        {/* Left Card: Subscription Details */}
        <div className="billing-sub-card">
          <h3 className="sub-card-title">
            {lang === 'en' ? 'Subscription Details' : 'تفاصيل الاشتراك'}
          </h3>
          <div className="sub-details-list">
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Start Date' : 'تاريخ بدء الاشتراك'}
              </span>
              <span className="sub-detail-value">
                {lang === 'en' ? 'Oct 7, 2026' : (subDetails?.start_date_formatted || '7 أكتوبر 2026')}
              </span>
            </div>
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Next Renewal Date' : 'تاريخ التجديد القادم'}
              </span>
              <span className="sub-detail-value">
                {lang === 'en' ? 'Nov 7, 2026' : (subDetails?.next_billing_date_formatted || '7 نوفمبر 2026')}
              </span>
            </div>
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Monthly Cost' : 'القيمة الشهرية'}
              </span>
              <span className="sub-detail-value">
                {lang === 'en' ? '199 SAR' : (subDetails?.monthly_price_formatted || '199 ر.س')}
              </span>
            </div>
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Billing Cycle' : 'دورة الفوترة'}
              </span>
              <span className="sub-detail-value">
                {lang === 'en' ? 'Monthly' : 'شهري'}
              </span>
            </div>
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Payment Method' : 'طريقة الدفع'}
              </span>
              <span className="sub-detail-value muted">
                {subDetails?.payment_method?.label || (lang === 'en' ? 'No saved card' : 'لا توجد بطاقة محفوظة')}
              </span>
            </div>
            <div className="sub-detail-row">
              <span className="sub-detail-label">
                {lang === 'en' ? 'Subscription Status' : 'حالة الاشتراك'}
              </span>
              <span className="sub-status-pill">
                {lang === 'en' ? 'Active' : (subDetails?.status_label || 'نشط')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Main Split Layout */}
      <div className="billing-main-layout">
        {/* Right Side Column (3 Cards) */}
        <aside className="billing-side-column">
          {/* Card 1: Saved Payment Methods */}
          <div className="billing-side-card">
            <div className="side-card-title-row">
              <h3>
                <CreditCard size={17} color="#0c7c8a" />
                {lang === 'en' ? 'Saved Payment Methods' : 'طرق الدفع المحفوظة'}
              </h3>
            </div>
            <p className="side-card-empty-msg">
              {lang === 'en' ? 'No payment methods currently saved.' : 'لا توجد طرق دفع محفوظة حالياً.'}
            </p>
            <button
              type="button"
              className="btn-add-payment"
              onClick={() => setActiveTab('payments')}
            >
              <Plus size={15} />
              {lang === 'en' ? 'Add New Payment Method' : 'إضافة طريقة دفع جديدة'}
            </button>
          </div>

          {/* Card 2: Help / Support */}
          <div className="billing-side-card">
            <div className="help-card-body">
              <div className="help-icon-wrap">
                <Headphones size={22} />
              </div>
              <h3>{lang === 'en' ? 'Need billing help?' : 'هل تحتاج مساعدة في الفواتير؟'}</h3>
              <p>
                {lang === 'en'
                  ? 'Our financial support team is ready to assist you with any questions.'
                  : 'فريق الدعم المالي جاهز لمساعدتك في أي استفسار حول فواتيرك وطرق الدفع.'}
              </p>
              <Link to="/app/support/new" className="btn-contact-support">
                {lang === 'en' ? 'Contact Support →' : 'تواصل مع الدعم ←'}
              </Link>
            </div>
          </div>

          {/* Card 3: FAQs */}
          <div className="billing-side-card">
            <div className="side-card-title-row">
              <h3>
                <FileText size={17} color="#0c7c8a" />
                {lang === 'en' ? 'Billing FAQs' : 'الأسئلة الشائعة حول الفوترة'}
              </h3>
            </div>
            <div className="faq-card-body">
              <p>
                {lang === 'en'
                  ? 'Learn about auto-renewal, changing plans, and tax details.'
                  : 'تعرّف على كيفية التجديد التلقائي، تغيير الباقة، وتفاصيل الضرائب.'}
              </p>
              <Link to="/how-it-works" className="faq-card-link">
                {lang === 'en' ? 'View all questions →' : 'عرض جميع الأسئلة ←'}
              </Link>
            </div>
          </div>
        </aside>

        {/* Left Main Panel */}
        <main className="billing-main-panel">
          {/* 4 Tabs Bar */}
          <div className="billing-tabs-bar">
            <button
              type="button"
              className={`billing-tab-item ${activeTab === 'invoices' ? 'active' : ''}`}
              onClick={() => setActiveTab('invoices')}
            >
              <FileText size={16} />
              {lang === 'en' ? 'Invoices' : 'الفواتير'}
            </button>
            <button
              type="button"
              className={`billing-tab-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <CreditCard size={16} />
              {lang === 'en' ? 'Payment Methods' : 'طرق الدفع'}
            </button>
            <button
              type="button"
              className={`billing-tab-item ${activeTab === 'plan' ? 'active' : ''}`}
              onClick={() => setActiveTab('plan')}
            >
              <Tag size={16} />
              {lang === 'en' ? 'Plan Details' : 'تفاصيل الباقة'}
            </button>
            <button
              type="button"
              className={`billing-tab-item ${activeTab === 'units' ? 'active' : ''}`}
              onClick={() => setActiveTab('units')}
            >
              <BedDouble size={16} />
              {lang === 'en' ? 'Unit Usage' : 'استخدام الوحدات'}
            </button>
          </div>

          {/* TAB 1: INVOICES */}
          {activeTab === 'invoices' && (
            <>
              {/* Header Row */}
              <div className="panel-header-row">
                <div className="panel-header-info">
                  <h2>{lang === 'en' ? 'Invoices & Transactions' : 'الفواتير والعمليات المالية'}</h2>
                  <p>
                    {lang === 'en'
                      ? 'View and download subscription and operations service invoices'
                      : 'عرض وتنزيل فواتير الاشتراك والخدمات الإضافية'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-export-statement"
                  onClick={() => alert(lang === 'en' ? 'Exporting account statement...' : 'جارٍ تصدير كشف الحساب...')}
                >
                  <Download size={15} />
                  {lang === 'en' ? 'Export Statement' : 'تصدير كشف حساب'}
                </button>
              </div>

              {/* Filter Bar */}
              <div className="invoices-filter-bar">
                <div className="invoices-search-wrap">
                  <input
                    type="text"
                    className="invoices-search-input"
                    placeholder={lang === 'en' ? 'Search by invoice # or description...' : 'بحث برقم الفاتورة أو الوصف...'}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <Search size={16} className="invoices-search-icon" />
                </div>

                <div className="invoices-select-wrap">
                  <select
                    className="invoices-select"
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                  >
                    <option value="all">{lang === 'en' ? 'All Statuses' : 'جميع الحالات'}</option>
                    <option value="paid">{lang === 'en' ? 'Paid' : 'مدفوعة'}</option>
                    <option value="unpaid">{lang === 'en' ? 'Unpaid' : 'غير مدفوعة'}</option>
                  </select>
                  <ChevronDown size={14} className="invoices-select-icon" />
                </div>

                <div className="invoices-select-wrap">
                  <select
                    className="invoices-select"
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                  >
                    <option value="all">{lang === 'en' ? 'All Types' : 'جميع الأنواع'}</option>
                    <option value="package_subscription">
                      {lang === 'en' ? 'Plan Subscription' : 'اشتراك باقة'}
                    </option>
                    <option value="cleaning_service">
                      {lang === 'en' ? 'Cleaning Service' : 'خدمة تنظيف'}
                    </option>
                    <option value="maintenance_service">
                      {lang === 'en' ? 'Maintenance' : 'صيانة'}
                    </option>
                    <option value="extra_service">
                      {lang === 'en' ? 'Extra Services' : 'خدمات إضافية'}
                    </option>
                  </select>
                  <ChevronDown size={14} className="invoices-select-icon" />
                </div>

                <div className="invoices-date-wrap">
                  <Calendar size={14} />
                  <span>{lang === 'en' ? 'From — To' : 'من — إلى'}</span>
                </div>
              </div>

              {/* Table */}
              <div className="invoices-table-wrap">
                <table className="invoices-table">
                  <thead>
                    <tr>
                      <th>{lang === 'en' ? 'Invoice #' : 'رقم الفاتورة'}</th>
                      <th>{lang === 'en' ? 'Date' : 'التاريخ'}</th>
                      <th>{lang === 'en' ? 'Description' : 'الوصف'}</th>
                      <th>{lang === 'en' ? 'Amount' : 'المبلغ'}</th>
                      <th>{lang === 'en' ? 'Payment Method' : 'طريقة الدفع'}</th>
                      <th>{lang === 'en' ? 'Status' : 'الحالة'}</th>
                      <th className="center">{lang === 'en' ? 'Actions' : 'إجراءات'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoicesLoading ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                          {lang === 'en' ? 'Loading invoices...' : 'جارٍ تحميل الفواتير...'}
                        </td>
                      </tr>
                    ) : invoices.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                          {lang === 'en' ? 'No matching invoices found' : 'لا توجد فواتير مطابقة'}
                        </td>
                      </tr>
                    ) : (
                      invoices.map(row => (
                        <tr key={row.id}>
                          <td>
                            <button
                              type="button"
                              className="invoice-num-link"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                              onClick={() => setSelectedInvoice(row)}
                            >
                              {row.invoice_number}
                            </button>
                          </td>
                          <td>{row.invoice_date_formatted || row.invoice_date}</td>
                          <td>
                            <div className="invoice-desc-cell">
                              <span className="invoice-desc-title">{row.description}</span>
                              {row.sub_description && (
                                <span className="invoice-desc-sub">{row.sub_description}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="invoice-amount-val">
                              {row.amount_formatted || `${row.total_amount} ${row.currency}`}
                            </span>
                          </td>
                          <td>
                            <span>{row.payment_method || '—'}</span>
                          </td>
                          <td>
                            <span
                              className={`invoice-status-pill ${
                                row.status === 'paid' ? 'paid' : 'unpaid'
                              }`}
                            >
                              {row.status === 'paid'
                                ? (lang === 'en' ? 'Paid' : 'مدفوعة')
                                : (lang === 'en' ? 'Unpaid' : 'غير مدفوعة')}
                            </span>
                          </td>
                          <td>
                            <div className="invoice-actions-cell">
                              <button
                                type="button"
                                className="invoice-action-btn"
                                title={lang === 'en' ? 'View Details' : 'عرض التفاصيل'}
                                onClick={() => setSelectedInvoice(row)}
                              >
                                <Eye size={15} />
                              </button>
                              <button
                                type="button"
                                className="invoice-action-btn"
                                title={lang === 'en' ? 'Download PDF' : 'تحميل PDF'}
                                disabled={downloadingId === row.id}
                                onClick={() => handleDownload(row.id)}
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="invoices-pagination-bar">
                <div className="pagination-right-group">
                  <span>{lang === 'en' ? 'Items per page' : 'عدد العناصر في الصفحة'}</span>
                  <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <select
                      value="15"
                      onChange={() => {}}
                      style={{
                        height: 32,
                        padding: '0 20px 0 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: 6,
                        background: '#ffffff',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#334155',
                        appearance: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="15">15</option>
                    </select>
                    <ChevronDown size={12} style={{ position: 'absolute', right: 6, pointerEvents: 'none', color: '#64748b' }} />
                  </div>
                  <span>
                    {lang === 'en'
                      ? `Showing 1 - ${invoices.length} of ${totalCount || invoices.length} invoices`
                      : `عرض 1 - ${invoices.length} من ${totalCount || invoices.length} فاتورة`}
                  </span>
                </div>

                <div className="pagination-controls">
                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={page >= totalPages}
                    onClick={() => handlePageChange(page + 1)}
                    title={lang === 'en' ? 'Next' : 'التالي'}
                  >
                    {isRTL ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
                  </button>
                  <button type="button" className="pagination-num-btn active">
                    {page}
                  </button>
                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={page <= 1}
                    onClick={() => handlePageChange(page - 1)}
                    title={lang === 'en' ? 'Previous' : 'السابق'}
                  >
                    {isRTL ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: PAYMENT METHODS */}
          {activeTab === 'payments' && (
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>
                    {lang === 'en' ? 'Registered Payment Methods' : 'طرق الدفع المسجلة'}
                  </h3>
                  <p style={{ margin: '4px 0 0', color: '#687f91', fontSize: 11 }}>
                    {lang === 'en'
                      ? 'Manage payment cards used for invoices and automatic renewals'
                      : 'إدارة البطاقات المستخدمة في تسوية الفواتير والتجديد التلقائي'}
                  </p>
                </div>
                <Link
                  to="/app/new/payment"
                  className="btn-add-payment"
                  style={{ width: 'auto', padding: '0 16px', background: '#0c7c8a', color: '#fff', border: 'none' }}
                >
                  <Plus size={15} />
                  {lang === 'en' ? 'Add New Card' : 'إضافة بطاقة جديدة'}
                </Link>
              </div>

              {paymentMethods.length === 0 ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', background: '#f8fafc', borderRadius: 10, border: '1px dashed #cbd5e1' }}>
                  <CreditCard size={32} color="#94a3b8" style={{ marginBottom: 8 }} />
                  <p style={{ margin: '0 0 12px', color: '#64748b', fontSize: 13 }}>
                    {lang === 'en'
                      ? 'No payment methods currently registered in your account.'
                      : 'لا توجد طرق دفع مسجلة حالياً في حسابك.'}
                  </p>
                  <Link
                    to="/app/new/payment"
                    className="btn-add-payment"
                    style={{ display: 'inline-flex', width: 'auto', padding: '0 16px', background: '#0c7c8a', color: '#fff', border: 'none' }}
                  >
                    <Plus size={15} />
                    {lang === 'en' ? 'Add Payment Card' : 'إضافة بطاقة دفع'}
                  </Link>
                </div>
              ) : (
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
                        <div style={{ width: 48, height: 32, display: 'grid', placeItems: 'center', background: '#f1f5f9', borderRadius: 6, fontWeight: 700, fontSize: 12 }}>
                          {pm.brand === 'mastercard' ? 'MC' : 'VISA'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <strong style={{ fontSize: 13, direction: 'ltr' }}>
                              •••• •••• •••• {pm.last4}
                            </strong>
                            {pm.is_default && (
                              <span style={{ padding: '2px 8px', borderRadius: 10, background: '#dcfce7', color: '#16a34a', fontSize: 10, fontWeight: 700 }}>
                                {lang === 'en' ? 'Default' : 'رئيسية'}
                              </span>
                            )}
                          </div>
                          <small style={{ color: '#6d8394', fontSize: 11 }}>
                            {lang === 'en' ? 'Expires: ' : 'تاريخ الانتهاء: '}
                            {pm.expiry_date || '12/2028'}
                            {pm.holder_name && ` • ${lang === 'en' ? 'Cardholder: ' : 'حامل البطاقة: '}${pm.holder_name}`}
                          </small>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {!pm.is_default && (
                          <button
                            type="button"
                            className="btn-add-payment"
                            style={{ height: 32, width: 'auto', padding: '0 12px', fontSize: 11 }}
                            onClick={() => handleSetDefaultPayment(pm.id)}
                          >
                            {lang === 'en' ? 'Set as Default' : 'تعيين كرئيسية'}
                          </button>
                        )}
                        <button
                          type="button"
                          title={lang === 'en' ? 'Delete' : 'حذف'}
                          style={{
                            width: 32,
                            height: 32,
                            border: '1px solid #fee2e2',
                            borderRadius: 6,
                            background: '#fff',
                            color: '#dc2626',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDeletePayment(pm.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PACKAGE DETAILS */}
          {activeTab === 'plan' && (
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 12, background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>
                    {lang === 'en' ? 'Current Plan' : (plan?.badge || 'الخطة الحالية')}
                  </span>
                  <h2 style={{ margin: 0, fontSize: 20, color: '#0f172a' }}>
                    {lang === 'en' ? (plan?.name_en || 'Basic') : plan?.name_ar}
                  </h2>
                  <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 12 }}>
                    {lang === 'en' ? (plan?.description_en || 'For individual hosts with few units') : plan?.description_ar}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-add-payment"
                  style={{ width: 'auto', padding: '0 16px', background: '#0c7c8a', color: '#fff', border: 'none' }}
                  onClick={() => setShowUpgradeModal(true)}
                >
                  <ArrowUp size={14} />
                  {lang === 'en' ? 'Upgrade Plan' : 'ترقية الخطة'}
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#0f172a' }}>
                    {lang === 'en' ? 'Plan Limits' : 'محددات الباقة'}
                  </h4>
                  <p style={{ margin: '6px 0', fontSize: 12, color: '#334155' }}>
                    <strong>{lang === 'en' ? 'Available Units: ' : 'الوحدات المتاحة: '}</strong>
                    {plan?.units_usage.max_units} {lang === 'en' ? 'units' : 'وحدة'}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: 12, color: '#334155' }}>
                    <strong>{lang === 'en' ? 'Used Units: ' : 'الوحدات المستخدمة: '}</strong>
                    {plan?.units_usage.used_units} {lang === 'en' ? 'units' : 'وحدة'}
                  </p>
                  <p style={{ margin: '6px 0', fontSize: 12, color: '#334155' }}>
                    <strong>{lang === 'en' ? 'Billing Cycle: ' : 'دورة الفوترة: '}</strong>
                    {lang === 'en' ? 'Monthly (199 SAR)' : `شهريًا (${subDetails?.monthly_price_formatted || '199 ر.س'})`}
                  </p>
                </div>
                <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: 13, color: '#0f172a' }}>
                    {lang === 'en' ? 'Included Features' : 'الميزات المشمولة'}
                  </h4>
                  <ul style={{ margin: 0, paddingRight: 18, fontSize: 11.5, color: '#475569', lineHeight: 1.8 }}>
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
            <div style={{ padding: 24 }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 17, color: '#0f172a' }}>
                {lang === 'en' ? 'Property Units Quota' : 'استهلاك الوحدات العقارية'}
              </h3>
              <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: 12 }}>
                {lang === 'en'
                  ? 'Track added units against the maximum quota allowed in your current plan'
                  : 'تتبع عدد الوحدات المضافة مقابل الحد الأقصى المسموح به في باقتك الحالية'}
              </p>

              <div style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: '#0f172a' }}>
                    {lang === 'en'
                      ? `${plan?.units_usage.used_units} of ${plan?.units_usage.max_units} units`
                      : `${plan?.units_usage.used_units} من أصل ${plan?.units_usage.max_units} وحدة`}
                  </span>
                  <span style={{ fontWeight: 800, color: '#dc2626' }}>
                    {plan?.units_usage.usage_percentage}% ({lang === 'en' ? 'Quota Exceeded' : 'تجاوز الحد'})
                  </span>
                </div>
                <div style={{ height: 10, borderRadius: 5, background: '#e2e8f0', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      background: '#ef4444',
                      borderRadius: 5,
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 18, background: '#e0f2fe', borderRadius: 10, border: '1px solid #bae6fd' }}>
                <div>
                  <b style={{ fontSize: 13, color: '#0369a1' }}>
                    {lang === 'en' ? 'Need to add units beyond your quota?' : 'هل تحتاج لإضافة وحدات جديدة تتجاوز الحد؟'}
                  </b>
                  <p style={{ margin: '4px 0 0', color: '#0284c7', fontSize: 11.5 }}>
                    {lang === 'en'
                      ? 'Upgrade your plan to Professional or Business to unlock more units and advanced management.'
                      : 'قم بترقية باقتك إلى باقة الاحترافية أو الأعمال للحصول على مزيد من الوحدات وإمكانيات تشغيل متقدمة.'}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-add-payment"
                  style={{ width: 'auto', padding: '0 16px', background: '#0284c7', color: '#fff', border: 'none' }}
                  onClick={() => setShowUpgradeModal(true)}
                >
                  {lang === 'en' ? 'Upgrade Plan Now' : 'ترقية الباقة الآن'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: INVOICE DETAILS */}
      {selectedInvoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(15, 23, 42, 0.6)',
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
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: 16, color: '#0f172a' }}>
                  {lang === 'en' ? `Invoice #${selectedInvoice.invoice_number}` : `فاتورة ${selectedInvoice.invoice_number}`}
                </h3>
                <small style={{ color: '#64748b' }}>
                  {selectedInvoice.invoice_date_formatted || selectedInvoice.invoice_date}
                </small>
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setSelectedInvoice(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 22, display: 'grid', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Description:' : 'الوصف:'}</span>
                <b>{selectedInvoice.description}</b>
              </div>
              {selectedInvoice.sub_description && (
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                  <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Details:' : 'تفاصيل إضافية:'}</span>
                  <span>{selectedInvoice.sub_description}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Amount:' : 'المبلغ:'}</span>
                <strong style={{ fontSize: 15, color: '#0c7c8a' }}>
                  {selectedInvoice.amount_formatted || `${selectedInvoice.total_amount} ${selectedInvoice.currency}`}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8 }}>
                <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Payment Method:' : 'طريقة الدفع:'}</span>
                <span>{selectedInvoice.payment_method || (lang === 'en' ? 'Electronic Payment' : 'دفع إلكتروني')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8 }}>
                <span style={{ color: '#64748b' }}>{lang === 'en' ? 'Status:' : 'الحالة:'}</span>
                <span
                  className={`invoice-status-pill ${
                    selectedInvoice.status === 'paid' ? 'paid' : 'unpaid'
                  }`}
                >
                  {selectedInvoice.status === 'paid'
                    ? (lang === 'en' ? 'Paid' : 'مدفوعة')
                    : (lang === 'en' ? 'Unpaid' : 'غير مدفوعة')}
                </span>
              </div>
            </div>

            <div
              style={{
                padding: '16px 22px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <button
                type="button"
                className="btn-add-payment"
                style={{ width: 'auto', padding: '0 16px' }}
                onClick={() => setSelectedInvoice(null)}
              >
                {lang === 'en' ? 'Close' : 'إغلاق'}
              </button>
              <button
                type="button"
                className="btn-add-payment"
                style={{ width: 'auto', padding: '0 16px', background: '#0c7c8a', color: '#fff', border: 'none' }}
                disabled={downloadingId === selectedInvoice.id}
                onClick={() => handleDownload(selectedInvoice.id)}
              >
                <Download size={14} />
                {downloadingId === selectedInvoice.id
                  ? (lang === 'en' ? 'Downloading...' : 'جارٍ التحميل...')
                  : (lang === 'en' ? 'Download PDF' : 'تحميل PDF')}
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
            background: 'rgba(15, 23, 42, 0.6)',
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
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Sparkles size={20} color="#0c7c8a" />
                <h3 style={{ margin: 0, fontSize: 17, color: '#0f172a' }}>
                  {lang === 'en' ? 'Upgrade Subscription Plan' : 'ترقية باقة الاشتراك'}
                </h3>
              </div>
              <button
                type="button"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                onClick={() => setShowUpgradeModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: 24 }}>
              <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: 12 }}>
                {lang === 'en'
                  ? 'Choose the right plan to expand your business and manage more units flexibly:'
                  : 'اختر الباقة المناسبة لتوسيع نطاق أعمالك وإدارة المزيد من الوحدات العقارية بكل مرونة:'}
              </p>

              <div style={{ display: 'grid', gap: 12 }}>
                {(upgradeBanner?.available_packages || [
                  {
                    id: 2,
                    name_ar: 'الاحترافية',
                    name_en: 'Professional',
                    price: 599,
                    price_text_ar: '599 ر.س / شهريًا',
                    price_text_en: '599 SAR / month',
                    description_ar: 'حتى 50 وحدة مع ميزات تشغيل متقدمة.',
                    description_en: 'Up to 50 units with advanced operational features.',
                  },
                  {
                    id: 3,
                    name_ar: 'الأعمال',
                    name_en: 'Business',
                    price: 999,
                    price_text_ar: '999 ر.س / شهريًا',
                    price_text_en: '999 SAR / month',
                    description_ar: 'إدارة وحدات غير محدودة، تقارير مالية تفصيلية، وأولوية في الدعم الفني.',
                    description_en: 'Unlimited units, comprehensive financial reports, and dedicated support.',
                  },
                ]).map(pkg => (
                  <div
                    key={pkg.id}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: 12,
                      padding: 16,
                      background: '#f8fafc',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0, fontSize: 15, color: '#0f172a' }}>
                        {lang === 'en' ? (pkg.name_en || 'Plan') : pkg.name_ar}
                      </h4>
                      <strong style={{ color: '#0c7c8a', fontSize: 13 }}>
                        {lang === 'en' ? (pkg.price_text_en || `${pkg.price} SAR / mo`) : (pkg.price_text_ar || `${pkg.price} ر.س`)}
                      </strong>
                    </div>
                    <p style={{ margin: '6px 0 12px', color: '#64748b', fontSize: 11.5 }}>
                      {lang === 'en' ? (pkg.description_en || pkg.description_ar) : pkg.description_ar}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-add-payment"
                        style={{ width: 'auto', padding: '0 16px', background: '#0c7c8a', color: '#fff', border: 'none' }}
                        disabled={upgrading}
                        onClick={() => handleConfirmUpgrade(pkg)}
                      >
                        {upgrading
                          ? (lang === 'en' ? 'Upgrading...' : 'جارٍ الترقية...')
                          : (lang === 'en' ? 'Select & Upgrade' : 'اختيار وترقية')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                padding: '14px 24px',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                className="btn-add-payment"
                style={{ width: 'auto', padding: '0 16px' }}
                onClick={() => setShowUpgradeModal(false)}
              >
                {lang === 'en' ? 'Cancel' : 'إلغاء'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
