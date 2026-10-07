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
    package_id: 2,
    name_ar: 'الباقة الاحترافية',
    name_en: 'Professional Plan',
    description_ar: 'مناسبة للمضيفين ومديري العقارات',
    badge: 'الخطة الحالية',
    units_usage: {
      used_units: 12,
      max_units: 50,
      usage_percentage: 24,
      formatted: '12 / 50',
    },
    features: [
      'إدارة حتى 100 وحدة',
      'ربط جميع المنصات',
      'تقارير متقدمة',
      'دعم فني مميز',
    ],
  },
  subscription_details: {
    status: 'active',
    status_label: 'نشط',
    start_date: '2026-01-01',
    start_date_formatted: '1 يناير 2026',
    next_billing_date: '2026-10-01',
    next_billing_date_formatted: '1 أكتوبر 2026',
    monthly_price: 599.0,
    monthly_price_formatted: '599 ر.س',
    billing_cycle: 'monthly',
    payment_method: {
      id: 1,
      brand: 'mastercard',
      masked_number: '•••• 4242',
      label: 'Mastercard •••• 4242',
    },
  },
  upgrade_banner: {
    title: 'احصل على المزيد مع الباقة المتقدمة',
    description: 'مزيد من الوحدات، تقارير أعمق، وأفضلية لدعم أعمالك',
    button_text: 'ترقية الآن',
    available_packages: [
      {
        id: 3,
        name_ar: 'الأعمال',
        name_en: 'Enterprise',
        slug: 'enterprise',
        price: 0,
        price_text_ar: 'تواصل معنا',
        description_ar: 'للشركات والمحافظ الكبيرة',
      },
    ],
  },
  payment_methods: [
    {
      id: 1,
      brand: 'mastercard',
      last4: '4242',
      masked_number: '•••• 4242',
      expiry_date: '12/2028',
      is_default: true,
      holder_name: 'محمد القحطاني',
    },
    {
      id: 2,
      brand: 'visa',
      last4: '3187',
      masked_number: '•••• 3187',
      expiry_date: '09/2027',
      is_default: false,
      holder_name: 'محمد القحطاني',
    },
  ],
};

const fallbackInvoices: InvoiceItem[] = [
  {
    id: 1,
    invoice_number: 'INV-2026-0008',
    invoice_type: 'package_subscription',
    description: 'اشتراك الباقة الاحترافية - سبتمبر 2026',
    sub_description: '12 وحدة',
    amount: 599.0,
    tax_amount: 0.0,
    total_amount: 599.0,
    amount_formatted: '599 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'Mastercard •••• 4242',
    invoice_date: '2026-09-01',
    invoice_date_formatted: '1 سبتمبر 2026',
    due_date: '2026-09-01',
    paid_at: '2026-09-01T10:00:00+00:00',
    pdf_url: 'https://blueclean.backend2.kazamiza.com/api/v1/client/billing/invoices/1/download',
  },
  {
    id: 2,
    invoice_number: 'INV-2026-0007',
    invoice_type: 'package_subscription',
    description: 'اشتراك الباقة الاحترافية - أغسطس 2026',
    sub_description: '12 وحدة',
    amount: 599.0,
    tax_amount: 0.0,
    total_amount: 599.0,
    amount_formatted: '599 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'Mastercard •••• 4242',
    invoice_date: '2026-08-01',
    invoice_date_formatted: '1 أغسطس 2026',
    due_date: '2026-08-01',
    paid_at: '2026-08-01T10:00:00+00:00',
    pdf_url: 'https://blueclean.backend2.kazamiza.com/api/v1/client/billing/invoices/2/download',
  },
  {
    id: 3,
    invoice_number: 'INV-2026-0006',
    invoice_type: 'package_subscription',
    description: 'اشتراك الباقة الاحترافية - يوليو 2026',
    sub_description: '12 وحدة',
    amount: 599.0,
    tax_amount: 0.0,
    total_amount: 599.0,
    amount_formatted: '599 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'Mastercard •••• 4242',
    invoice_date: '2026-07-01',
    invoice_date_formatted: '1 يوليو 2026',
    due_date: '2026-07-01',
    paid_at: '2026-07-01T10:00:00+00:00',
    pdf_url: 'https://blueclean.backend2.kazamiza.com/api/v1/client/billing/invoices/3/download',
  },
  {
    id: 4,
    invoice_number: 'INV-2026-0004',
    invoice_type: 'cleaning_service',
    description: 'خدمة تنظيف إضافية',
    sub_description: 'تنظيف عميق - شقة 304',
    amount: 120.0,
    tax_amount: 0.0,
    total_amount: 120.0,
    amount_formatted: '120 ر.س',
    currency: 'SAR',
    status: 'paid',
    status_label: 'مدفوعة',
    payment_method: 'Mastercard •••• 4242',
    invoice_date: '2026-05-15',
    invoice_date_formatted: '15 مايو 2026',
    due_date: '2026-05-15',
    paid_at: '2026-05-15T14:30:00+00:00',
    pdf_url: 'https://blueclean.backend2.kazamiza.com/api/v1/client/billing/invoices/4/download',
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
