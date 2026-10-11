const DEFAULT_BASE_URL = 'https://blueclean.backend2.kazamiza.com/api/v1';

export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return (
    window.localStorage.getItem('token') ||
    window.localStorage.getItem('bluclean_token') ||
    window.localStorage.getItem('bluclean_client_token') ||
    document.cookie
      .split('; ')
      .find(row => row.startsWith('bluclean_token=') || row.startsWith('token='))
      ?.split('=')[1] ||
    null
  );
}

export function isAuthenticated(): boolean {
  return Boolean(getStoredToken());
}

export function setStoredToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  if (token) {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('bluclean_token', token);
    window.localStorage.setItem('bluclean_client_token', token);
  } else {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('bluclean_token');
    window.localStorage.removeItem('bluclean_client_token');
    document.cookie = 'token=; Max-Age=0; path=/';
    document.cookie = 'bluclean_token=; Max-Age=0; path=/';
  }
  window.dispatchEvent(new CustomEvent('bluclean:auth-changed', { detail: { authenticated: Boolean(token) } }));
}

export interface StoredClientUser {
  id: number;
  name: string;
  facility_name?: string;
  job_title?: string;
  email: string;
  phone?: string;
  avatar?: string | null;
  avatar_url?: string | null;
}

export function getStoredUser(): StoredClientUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem('bluclean_user');
    return raw ? (JSON.parse(raw) as StoredClientUser) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: StoredClientUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    window.localStorage.setItem('bluclean_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('bluclean:user-updated', { detail: user }));
  } else {
    window.localStorage.removeItem('bluclean_user');
  }
}

export async function ensureAuthToken(): Promise<string | null> {
  return getStoredToken();
}

export async function apiFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; data?: T; raw?: any }> {
  const baseUrl = getApiBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const token = getStoredToken();
  const lang = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean_lang') || 'ar' : 'ar';

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Accept-Language': lang,
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 401 && token) {
      setStoredToken(null);
      setStoredUser(null);
    }

    const json = await response.json().catch(() => null);
    return {
      ok: response.ok && Boolean(json?.success ?? response.ok),
      status: response.status,
      data: (json?.data ?? json) as T,
      raw: json,
    };
  } catch {
    return { ok: false, status: 0 };
  }
}

function extractApiErrorMessage(json: any, fallback: string): string {
  if (!json) return fallback;
  if (json.errors && typeof json.errors === 'object') {
    const firstKey = Object.keys(json.errors)[0];
    const firstErr = firstKey ? json.errors[firstKey] : null;
    if (Array.isArray(firstErr) && firstErr[0]) return String(firstErr[0]);
    if (typeof firstErr === 'string') return firstErr;
  }
  if (typeof json.message === 'string' && json.message.trim()) {
    if (json.message === 'Unauthorized' || json.message.includes('Invalid credentials')) {
      return 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
    }
    return json.message;
  }
  return fallback;
}

export async function loginClient(email: string, password: string) {
  const baseUrl = getApiBaseUrl();
  const lang = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean_lang') || 'ar' : 'ar';

  try {
    const response = await fetch(`${baseUrl}/client/auth/login`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': lang,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const json = await response.json().catch(() => null);
    const token = json?.data?.token || json?.data?.access_token;

    if (response.ok && json?.success && token) {
      setStoredToken(token);
      if (json.data.user) {
        setStoredUser(json.data.user);
      }
      return {
        success: true,
        data: json.data,
        message: json.message || 'تم تسجيل الدخول بنجاح',
      };
    }

    return {
      success: false,
      message: extractApiErrorMessage(json, 'البريد الإلكتروني أو كلمة المرور غير صحيحة'),
    };
  } catch {
    return {
      success: false,
      message: 'تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى',
    };
  }
}

export async function registerClient(payload: {
  name: string;
  facility_name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation?: string;
}) {
  const baseUrl = getApiBaseUrl();
  const lang = typeof window !== 'undefined' ? window.localStorage.getItem('bluclean_lang') || 'ar' : 'ar';

  try {
    const response = await fetch(`${baseUrl}/client/auth/register`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': lang,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        password_confirmation: payload.password_confirmation || payload.password,
      }),
    });

    const json = await response.json().catch(() => null);
    const token = json?.data?.token || json?.data?.access_token;

    if (response.ok && json?.success && token) {
      setStoredToken(token);
      if (json.data.user) {
        setStoredUser(json.data.user);
      }
      return {
        success: true,
        data: json.data,
        message: json.message || 'تم إنشاء الحساب بنجاح',
      };
    }

    return {
      success: false,
      message: extractApiErrorMessage(json, 'تعذر إنشاء الحساب، يرجى التحقق من البيانات المدخلة'),
    };
  } catch {
    return {
      success: false,
      message: 'تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى',
    };
  }
}

export async function logoutClient(): Promise<void> {
  const token = getStoredToken();
  // Clear token and user immediately so route guards block back navigation right away
  setStoredToken(null);
  setStoredUser(null);

  if (token) {
    try {
      const baseUrl = getApiBaseUrl();
      await fetch(`${baseUrl}/client/auth/logout`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore network errors on logout
    }
  }
}

export interface ApiNotificationItem {
  id: number;
  type: string;
  action_type?: string;
  action_id?: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  time_ago: string;
}

export interface ApiNotificationsResponse {
  unread_count: number;
  total_count: number;
  notifications: ApiNotificationItem[];
}

export async function fetchClientMe(): Promise<StoredClientUser | null> {
  const res = await apiFetch<StoredClientUser>('/client/auth/me');
  if (res.ok && res.data && res.data.id) {
    setStoredUser(res.data);
    return res.data;
  }
  return null;
}

export async function fetchGlobalNewSettings(): Promise<any | null> {
  const res = await apiFetch<any>('/global/landing-page/new-settings');
  if (res.ok && res.data) {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('bluclean_new_settings', JSON.stringify(res.data));
      } catch {
        // ignore storage quota errors
      }
    }
    return res.data;
  }
  return null;
}

export async function fetchClientNotifications(unreadOnly?: boolean): Promise<ApiNotificationsResponse | null> {
  const endpoint = unreadOnly ? '/client/notifications?unread_only=true' : '/client/notifications';
  const res = await apiFetch<ApiNotificationsResponse>(endpoint);
  if (res.ok && res.data && Array.isArray(res.data.notifications)) {
    return res.data;
  }
  return null;
}

export async function markClientNotificationRead(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/client/notifications/${id}/read`, { method: 'POST' });
  return res.ok;
}

export async function markAllClientNotificationsRead(): Promise<boolean> {
  const res = await apiFetch('/client/notifications/mark-all-read', { method: 'POST' });
  return res.ok;
}

export async function deleteClientNotification(id: number | string): Promise<boolean> {
  const res = await apiFetch(`/client/notifications/${id}`, { method: 'DELETE' });
  return res.ok;
}

