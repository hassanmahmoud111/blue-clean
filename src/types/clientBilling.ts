export interface UnitsUsage {
  used_units: number;
  max_units: number;
  usage_percentage: number;
  formatted: string;
}

export interface CurrentPlan {
  subscription_id: number;
  package_id: number;
  name_ar: string;
  name_en?: string;
  description_ar: string;
  badge?: string;
  units_usage: UnitsUsage;
  features: string[];
}

export interface PaymentMethodSummary {
  id: number;
  brand: string;
  masked_number: string;
  label: string;
}

export interface SubscriptionDetails {
  status: 'active' | 'expired' | 'canceled' | 'pending' | string;
  status_label: string;
  start_date: string;
  start_date_formatted: string;
  next_billing_date: string;
  next_billing_date_formatted: string;
  monthly_price: number;
  monthly_price_formatted: string;
  billing_cycle: string;
  payment_method?: PaymentMethodSummary;
}

export interface UpgradePackage {
  id: number;
  name_ar: string;
  name_en?: string;
  slug?: string;
  price: number;
  price_text_ar?: string;
  description_ar: string;
}

export interface UpgradeBanner {
  title: string;
  description: string;
  button_text: string;
  available_packages: UpgradePackage[];
}

export interface PaymentMethodItem {
  id: number;
  brand: string;
  last4: string;
  masked_number: string;
  expiry_date?: string;
  is_default: boolean;
  holder_name?: string;
}

export interface BillingOverview {
  current_plan: CurrentPlan;
  subscription_details: SubscriptionDetails;
  upgrade_banner: UpgradeBanner;
  payment_methods: PaymentMethodItem[];
}

export type InvoiceType =
  | 'package_subscription'
  | 'cleaning_service'
  | 'maintenance_service'
  | 'extra_service'
  | string;

export type InvoiceStatus = 'paid' | 'unpaid' | 'pending' | 'refunded' | string;

export interface InvoiceItem {
  id: number;
  invoice_number: string;
  invoice_type: InvoiceType;
  description: string;
  sub_description?: string;
  amount: number;
  tax_amount: number;
  total_amount: number;
  amount_formatted: string;
  currency: string;
  status: InvoiceStatus;
  status_label: string;
  payment_method?: string;
  invoice_date: string;
  invoice_date_formatted: string;
  due_date?: string;
  paid_at?: string | null;
  pdf_url?: string;
}

export interface InvoicesMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface InvoicesResponse {
  data: InvoiceItem[];
  links?: Record<string, any>;
  meta?: InvoicesMeta;
}

export interface CreatePaymentMethodPayload {
  brand: string;
  last4: string;
  exp_month: string;
  exp_year: string;
  holder_name: string;
  is_default?: boolean;
}

export interface UpgradePlanPayload {
  package_id: number;
  payment_method_id?: number;
}
