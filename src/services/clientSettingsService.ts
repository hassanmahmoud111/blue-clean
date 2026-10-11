import { apiFetch, setStoredUser } from './apiClient';

export interface ClientNotificationSettings {
  notify_email: boolean;
  notify_sms: boolean;
  notify_in_app: boolean;
  notify_marketing: boolean;
  email?: boolean;
  sms?: boolean;
  in_app?: boolean;
  marketing?: boolean;
}

export interface ClientPreferences {
  theme: 'light' | 'dark' | string;
  language: 'ar' | 'en' | string;
  timezone: string;
}

export interface ClientSettingsData {
  id: number;
  name: string;
  facility_name: string;
  job_title: string;
  email: string;
  phone: string;
  avatar?: string | null;
  avatar_url?: string | null;
  is_owner?: boolean;
  role?: {
    key: string;
    name: string;
    name_ar: string;
    name_en: string;
  };
  preferences: ClientPreferences;
  notifications: ClientNotificationSettings;
}

function extractApiError(raw: any, fallback: string): string {
  if (!raw) return fallback;
  if (raw.errors && typeof raw.errors === 'object') {
    const firstKey = Object.keys(raw.errors)[0];
    const firstErr = firstKey ? raw.errors[firstKey] : null;
    if (Array.isArray(firstErr) && firstErr[0]) return String(firstErr[0]);
    if (typeof firstErr === 'string') return firstErr;
  }
  if (typeof raw.message === 'string' && raw.message.trim()) {
    return raw.message;
  }
  return fallback;
}

export async function fetchClientSettings(): Promise<ClientSettingsData | null> {
  const res = await apiFetch<ClientSettingsData>('/client/settings');
  if (res.ok && res.data) {
    setStoredUser({
      id: res.data.id,
      name: res.data.name,
      facility_name: res.data.facility_name,
      job_title: res.data.job_title,
      email: res.data.email,
      phone: res.data.phone,
      avatar: res.data.avatar,
      avatar_url: res.data.avatar_url,
    });
    return res.data;
  }
  return null;
}

export async function updateClientProfile(payload: {
  name: string;
  facility_name: string;
  job_title: string;
  email: string;
  phone: string;
  avatarFile?: File | null;
}): Promise<{ ok: boolean; data?: ClientSettingsData; message: string }> {
  let body: FormData | string;
  if (payload.avatarFile) {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('facility_name', payload.facility_name);
    formData.append('job_title', payload.job_title);
    formData.append('email', payload.email);
    formData.append('phone', payload.phone);
    formData.append('avatar', payload.avatarFile);
    body = formData;
  } else {
    body = JSON.stringify({
      name: payload.name,
      facility_name: payload.facility_name,
      job_title: payload.job_title,
      email: payload.email,
      phone: payload.phone,
    });
  }

  const res = await apiFetch<ClientSettingsData>('/client/settings/profile', {
    method: 'POST',
    body,
  });

  if (res.ok && res.data) {
    setStoredUser({
      id: res.data.id,
      name: res.data.name,
      facility_name: res.data.facility_name,
      job_title: res.data.job_title,
      email: res.data.email,
      phone: res.data.phone,
      avatar: res.data.avatar,
      avatar_url: res.data.avatar_url,
    });
    return {
      ok: true,
      data: res.data,
      message: res.raw?.message || 'تم تحديث البيانات الشخصية بنجاح.',
    };
  }

  return {
    ok: false,
    message: extractApiError(res.raw, 'تعذر تحديث البيانات الشخصية، يرجى التحقق من الحقول.'),
  };
}

export async function updateClientNotifications(payload: {
  theme?: string;
  language?: string;
  timezone?: string;
  notify_email: boolean;
  notify_sms: boolean;
  notify_in_app: boolean;
  notify_marketing: boolean;
}): Promise<{ ok: boolean; data?: ClientSettingsData; message: string }> {
  const res = await apiFetch<ClientSettingsData>('/client/settings/preferences', {
    method: 'PUT',
    body: JSON.stringify({
      theme: payload.theme || 'light',
      language: payload.language || 'ar',
      timezone: payload.timezone || 'Asia/Riyadh',
      notify_email: payload.notify_email,
      notify_sms: payload.notify_sms,
      notify_in_app: payload.notify_in_app,
      notify_marketing: payload.notify_marketing,
    }),
  });

  if (res.ok && res.data) {
    return {
      ok: true,
      data: res.data,
      message: res.raw?.message || 'تم تحديث تفضيلات الإشعارات بنجاح.',
    };
  }

  return {
    ok: false,
    message: extractApiError(res.raw, 'تعذر تحديث إعدادات الإشعارات.'),
  };
}

export async function changeClientPassword(payload: {
  current_password: string;
  password: string;
  password_confirmation: string;
}): Promise<{ ok: boolean; message: string }> {
  const res = await apiFetch('/client/settings/change-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    return {
      ok: true,
      message: res.raw?.message || 'تم تغيير كلمة المرور بنجاح.',
    };
  }

  return {
    ok: false,
    message: extractApiError(res.raw, 'تعذر تغيير كلمة المرور، يرجى التأكد من كلمة المرور الحالية.'),
  };
}
