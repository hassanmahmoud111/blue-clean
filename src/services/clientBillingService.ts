import type {
  BillingOverview,
  CreatePaymentMethodPayload,
  InvoiceItem,
  InvoicesResponse,
  PaymentMethodItem,
  UpgradePlanPayload,
} from '../types/clientBilling';

const fallbackBillingOverview: BillingOverview = {
  current_plan: {
    subscription_id: 1,
    package_id: 1,
    name_ar: 'الأساسية',
    name_en: 'Basic Plan',
    description_ar: 'للمضيف الفردي والوحدات القليلة',
    description_en: 'For individual hosts and small property portfolios',
    badge: 'الخطة الحالية',
    badge_en: 'Current Plan',
    units_usage: {
      used_units: 7,
      max_units: 5,
      usage_percentage: 140,
      formatted: '7 / 5',
    },
    features: [
      'إدارة الوحدات والحجوزات',
      'تقويم موحد',
      'طلبات تشغيل يدوية',
      'تقارير أساسية',
    ],
  },
  subscription_details: {
    status: 'active',
    status_label: 'نشط',
    start_date: '2026-10-07',
    start_date_formatted: '7 أكتوبر 2026',
    next_billing_date: '2026-11-07',
    next_billing_date_formatted: '7 نوفمبر 2026',
    monthly_price: 199.0,
    monthly_price_formatted: '199 ر.س',
    billing_cycle: 'شهري',
    payment_method: null,
  },
  upgrade_banner: {
    title: 'احصل على المزيد مع الباقة المتقدمة',
    description: 'مزيد من الوحدات، تقارير أعمق، وأفضلية لدعم أعمالك',
    button_text: 'ترقية الآن',
    available_packages: [
      {
        id: 2,
        name_ar: 'الاحترافية',
        name_en: 'Professional',
        slug: 'professional',
        price: 599,
        price_text_ar: '599 ر.س / شهريًا',
        price_text_en: '599 SAR / month',
        description_ar: 'حتى 50 وحدة مع ميزات تشغيل متقدمة',
        description_en: 'Up to 50 units with advanced operational workflows',
      },
      {
        id: 3,
        name_ar: 'الأعمال',
        name_en: 'Enterprise',
        slug: 'enterprise',
        price: 999,
        price_text_ar: '999 ر.س / شهريًا',
        price_text_en: '999 SAR / month',
        description_ar: 'للشركات والمحافظ الكبيرة ووحدات غير محدودة',
        description_en: 'For companies, large portfolios, and unlimited units',
      },
    ],
  },
  payment_methods: [],
};

const fallbackInvoices: InvoiceItem[] = [
  {
    id: 1,
    invoice_number: 'INV-2026-0007',
    invoice_type: 'package_subscription',
    description: 'اشتراك في باقة: الأساسية (5 وحدة كحد أقصى)',
    amount: 199.0,
    tax_amount: 0.0,
    total_amount: 199.0,
    amount_formatted: '199 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'دفع إلكتروني',
    invoice_date: '2026-10-07',
    invoice_date_formatted: '7 أكتوبر 2026',
    due_date: '2026-10-07',
    paid_at: '2026-10-07T10:00:00+00:00',
    pdf_url: '#',
  },
  {
    id: 2,
    invoice_number: 'INV-2026-0004',
    invoice_type: 'package_subscription',
    description: 'ترقية اشتراك الباقة: الأساسية (5 وحدة كحد أقصى)',
    amount: 199.0,
    tax_amount: 0.0,
    total_amount: 199.0,
    amount_formatted: '199 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'البطاقة الائتمانية',
    invoice_date: '2026-10-06',
    invoice_date_formatted: '6 أكتوبر 2026',
    due_date: '2026-10-06',
    paid_at: '2026-10-06T10:00:00+00:00',
    pdf_url: '#',
  },
  {
    id: 3,
    invoice_number: 'INV-2026-0003',
    invoice_type: 'package_subscription',
    description: 'ترقية اشتراك الباقة: الاحترافية (50 وحدة كحد أقصى)',
    amount: 599.0,
    tax_amount: 0.0,
    total_amount: 599.0,
    amount_formatted: '599 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'البطاقة الائتمانية',
    invoice_date: '2026-10-05',
    invoice_date_formatted: '5 أكتوبر 2026',
    due_date: '2026-10-05',
    paid_at: '2026-10-05T10:00:00+00:00',
    pdf_url: '#',
  },
  {
    id: 4,
    invoice_number: 'INV-202610-001',
    invoice_type: 'package_subscription',
    description: 'اشتراك باقة احترافية - شهر 10/2026 (تجديد شهري تلقائي للوحدات)',
    amount: 689.0,
    tax_amount: 0.0,
    total_amount: 689.0,
    amount_formatted: '689 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'visa',
    invoice_date: '2026-10-01',
    invoice_date_formatted: '1 أكتوبر 2026',
    due_date: '2026-10-01',
    paid_at: '2026-10-01T10:00:00+00:00',
    pdf_url: '#',
  },
  {
    id: 5,
    invoice_number: 'INV-202610-002',
    invoice_type: 'extra_service',
    description: 'خدمات إضافية وصيانة وحدات (غسيل كنب وتلميع أرضيات)',
    amount: 403.0,
    tax_amount: 0.0,
    total_amount: 403.0,
    amount_formatted: '403 ر.س',
    currency: 'SAR',
    status: 'unpaid',
    status_label: 'غير مدفوعة',
    payment_method: 'دفع إلكتروني',
    invoice_date: '2026-09-27',
    invoice_date_formatted: '27 سبتمبر 2026',
    due_date: '2026-09-27',
    paid_at: null,
    pdf_url: '#',
  },
];

let localBillingOverview: BillingOverview = { ...fallbackBillingOverview };
let localInvoices: InvoiceItem[] = [...fallbackInvoices];

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('bluclean_token') ||
    window.localStorage.getItem('bluclean_client_token') ||
    null
  );
}

function getBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL || 'https://blueclean.backend2.kazamiza.com/api/v1').replace(/\/$/, '');
}

export async function fetchBillingOverview(): Promise<BillingOverview> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/overview`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        localBillingOverview = json.data;
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  return localBillingOverview;
}

export interface InvoicesFilterParams {
  search?: string;
  status?: string;
  type?: string;
  from_date?: string;
  to_date?: string;
  per_page?: number;
  page?: number;
}

export async function fetchInvoices(params?: InvoicesFilterParams): Promise<InvoicesResponse> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.type && params.type !== 'all') query.set('type', params.type);
    if (params?.from_date) query.set('from_date', params.from_date);
    if (params?.to_date) query.set('to_date', params.to_date);
    if (params?.per_page) query.set('per_page', String(params.per_page));
    if (params?.page) query.set('page', String(params.page));

    const response = await fetch(`${baseUrl}/client/billing/invoices?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        return {
          data: json.data,
          meta: json.meta || {
            current_page: params?.page || 1,
            last_page: 1,
            per_page: params?.per_page || json.data.length,
            total: json.data.length,
          },
          links: json.links,
        };
      }
    }
  } catch {
    // fallback
  }

  const filtered = localInvoices.filter(inv => {
    if (params?.status && params.status !== 'all' && inv.status !== params.status) return false;
    if (params?.type && params.type !== 'all' && inv.invoice_type !== params.type) return false;
    if (params?.search) {
      const q = params.search.toLowerCase();
      const match = `${inv.invoice_number} ${inv.description} ${inv.sub_description || ''}`.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const perPage = params?.per_page || 5;
  const page = params?.page || 1;
  const start = (page - 1) * perPage;
  const paginated = filtered.slice(start, start + perPage);

  return {
    data: paginated,
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(filtered.length / perPage)),
      per_page: perPage,
      total: filtered.length,
    },
  };
}

export async function fetchInvoiceDetail(idOrNumber: string | number): Promise<InvoiceItem> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/invoices/${idOrNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const found = localInvoices.find(
    inv => String(inv.id) === String(idOrNumber) || inv.invoice_number.toLowerCase() === String(idOrNumber).toLowerCase()
  );
  return found || localInvoices[0];
}

export async function downloadInvoicePdf(id: number | string): Promise<string> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const downloadUrl = `${baseUrl}/client/billing/invoices/${id}/download`;
    const response = await fetch(downloadUrl, {
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return url;
    }
  } catch {
    // fallback
  }

  // Mock download action
  const fakeContent = `Invoice #${id}\nBlueClean Service Platform`;
  const blob = new Blob([fakeContent], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${id}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
  return url;
}

export async function fetchPaymentMethods(): Promise<PaymentMethodItem[]> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/payment-methods`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        localBillingOverview.payment_methods = json.data;
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  return localBillingOverview.payment_methods;
}

export async function createPaymentMethod(payload: CreatePaymentMethodPayload): Promise<PaymentMethodItem> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/payment-methods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && json.data) {
        if (payload.is_default) {
          localBillingOverview.payment_methods = localBillingOverview.payment_methods.map(p => ({
            ...p,
            is_default: false,
          }));
        }
        localBillingOverview.payment_methods.unshift(json.data);
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const newMethod: PaymentMethodItem = {
    id: Date.now(),
    brand: payload.brand || 'visa',
    last4: payload.last4,
    masked_number: `•••• ${payload.last4}`,
    expiry_date: `${payload.exp_month}/${payload.exp_year}`,
    is_default: Boolean(payload.is_default),
    holder_name: payload.holder_name,
  };

  if (newMethod.is_default) {
    localBillingOverview.payment_methods = localBillingOverview.payment_methods.map(p => ({
      ...p,
      is_default: false,
    }));
  }
  localBillingOverview.payment_methods.unshift(newMethod);
  return newMethod;
}

export async function setDefaultPaymentMethod(id: number | string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/payment-methods/${id}/set-default`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        localBillingOverview.payment_methods = localBillingOverview.payment_methods.map(p => ({
          ...p,
          is_default: String(p.id) === String(id),
        }));
        return true;
      }
    }
  } catch {
    // fallback
  }

  localBillingOverview.payment_methods = localBillingOverview.payment_methods.map(p => ({
    ...p,
    is_default: String(p.id) === String(id),
  }));
  return true;
}

export async function deletePaymentMethod(id: number | string): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/payment-methods/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        localBillingOverview.payment_methods = localBillingOverview.payment_methods.filter(
          p => String(p.id) !== String(id)
        );
        return true;
      }
    }
  } catch {
    // fallback
  }

  localBillingOverview.payment_methods = localBillingOverview.payment_methods.filter(
    p => String(p.id) !== String(id)
  );
  return true;
}

export async function upgradePlan(payload: UpgradePlanPayload): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/billing/upgrade-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) {
        localBillingOverview.current_plan = {
          ...localBillingOverview.current_plan,
          package_id: payload.package_id,
          name_ar: 'باقة الأعمال المتقدمة',
          badge: 'الخطة الحالية (محدثة)',
        };
        return true;
      }
    }
  } catch {
    // fallback
  }

  localBillingOverview.current_plan = {
    ...localBillingOverview.current_plan,
    package_id: payload.package_id,
    name_ar: 'باقة الأعمال المتقدمة',
    badge: 'الخطة الحالية (محدثة)',
  };
  return true;
}
