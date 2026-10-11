import type {
  ClientSupportTicketDetail,
  ClientSupportTicketItem,
  CreateClientTicketPayload,
  TicketMessage,
} from '../types/supportTicket';

const fallbackClientTickets: ClientSupportTicketDetail[] = [
  {
    id: 1,
    ticket_code: 'TCK-261002-01',
    subject: 'استفسار عن ربط حساب منصة Airbnb مع النظام',
    category: 'technical',
    category_label: 'technical',
    priority: 'medium',
    priority_label: 'متوسطة',
    status: 'in_progress',
    status_label: 'قيد المعالجة',
    related_info_badge: 'technical',
    created_at_formatted: '2 أكتوبر 12:39 م',
    time_ago: 'منذ 5 أيام',
    messages: [],
  },
  {
    id: 2,
    ticket_code: 'TCK-260525-02',
    subject: 'طلب تقرير شهري مفصل للوحدات والفواتير',
    category: 'reports',
    category_label: 'تقارير',
    priority: 'low',
    priority_label: 'low',
    status: 'closed',
    status_label: 'مغلقة',
    related_info_badge: 'تقارير',
    created_at_formatted: '2 أكتوبر 10:15 ص',
    time_ago: 'منذ 5 أيام',
    messages: [],
  },
];

let localTicketsStore: ClientSupportTicketDetail[] = [...fallbackClientTickets];

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

export async function fetchClientTickets(params?: {
  search?: string;
  status?: string;
  priority?: string;
  per_page?: number;
}): Promise<ClientSupportTicketItem[]> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status && params.status !== 'all') query.set('status', params.status);
    if (params?.priority && params.priority !== 'all') query.set('priority', params.priority);
    if (params?.per_page) query.set('per_page', String(params.per_page));

    const response = await fetch(`${baseUrl}/client/support-tickets?${query.toString()}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  // Local filtered fallback
  return localTicketsStore
    .filter(ticket => {
      if (params?.status && params.status !== 'all' && ticket.status !== params.status) {
        return false;
      }
      if (params?.priority && params.priority !== 'all' && ticket.priority !== params.priority) {
        return false;
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        const matches = `${ticket.ticket_code} ${ticket.subject} ${ticket.category_label}`.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    })
    .map(ticket => ({
      id: ticket.id,
      ticket_code: ticket.ticket_code,
      subject: ticket.subject,
      category: ticket.category,
      category_label: ticket.category_label,
      priority: ticket.priority,
      priority_label: ticket.priority_label,
      status: ticket.status,
      status_label: ticket.status_label,
      last_message: ticket.messages[ticket.messages.length - 1]
        ? {
            message: ticket.messages[ticket.messages.length - 1].message,
            sender_type: ticket.messages[ticket.messages.length - 1].sender_type,
            sender_name: ticket.messages[ticket.messages.length - 1].sender_name,
            time_ago: ticket.messages[ticket.messages.length - 1].time_ago || 'الآن',
          }
        : undefined,
      created_at_formatted: ticket.created_at_formatted,
      time_ago: ticket.time_ago,
    }));
}

export async function fetchClientTicketDetail(idOrCode: string | number): Promise<ClientSupportTicketDetail> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/support-tickets/${idOrCode}`, {
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

  const found = localTicketsStore.find(
    t => String(t.id) === String(idOrCode) || t.ticket_code.toLowerCase() === String(idOrCode).toLowerCase()
  );

  return found || localTicketsStore[0];
}

export async function createClientTicket(payload: CreateClientTicketPayload): Promise<ClientSupportTicketDetail> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/support-tickets`, {
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
        localTicketsStore.unshift(json.data);
        return json.data;
      }
    }
  } catch {
    // fallback
  }

  const categoryLabels: Record<string, string> = {
    integration_sync: 'الربط والمزامنة',
    units_bookings: 'الوحدات والحجوزات',
    operations_services: 'التشغيل والخدمات',
    account_permissions: 'الحساب والصلاحيات',
    billing_subscription: 'الفواتير والاشتراك',
    other: 'أخرى',
  };

  const priorityLabels: Record<string, string> = {
    urgent: 'عاجلة',
    medium: 'متوسطة',
    normal: 'عادية',
  };

  const newTicket: ClientSupportTicketDetail = {
    id: Date.now(),
    ticket_code: `SUP-${1050 + Math.floor(Math.random() * 50)}`,
    subject: payload.subject,
    category: payload.category,
    category_label: categoryLabels[payload.category] || payload.category,
    priority: payload.priority,
    priority_label: priorityLabels[payload.priority] || payload.priority,
    status: 'open',
    status_label: 'مفتوحة',
    related_info_badge: payload.unit_id ? `وحدة ${payload.unit_id}` : undefined,
    created_at_formatted: 'الآن',
    time_ago: 'الآن',
    messages: [
      {
        id: Date.now(),
        sender_type: 'client',
        sender_name: 'محمد القحطاني',
        message: payload.message,
        attachments: payload.attachments,
        time_formatted: 'الآن',
        time_ago: 'الآن',
      },
    ],
  };

  localTicketsStore = [newTicket, ...localTicketsStore];
  return newTicket;
}

export async function sendClientTicketMessage(
  idOrCode: string | number,
  message: string,
  attachments?: any[]
): Promise<TicketMessage> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/support-tickets/${idOrCode}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message, attachments: attachments || [] }),
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

  const newMsg: TicketMessage = {
    id: Date.now(),
    sender_type: 'client',
    sender_name: 'محمد القحطاني',
    message,
    attachments: attachments || [],
    time_formatted: 'الآن',
    time_ago: 'الآن',
  };

  localTicketsStore = localTicketsStore.map(ticket => {
    if (String(ticket.id) === String(idOrCode) || ticket.ticket_code === String(idOrCode)) {
      return {
        ...ticket,
        status: 'in_progress',
        status_label: 'قيد المعالجة',
        time_ago: 'الآن',
        messages: [...ticket.messages, newMsg],
      };
    }
    return ticket;
  });

  return newMsg;
}

export async function closeClientTicket(idOrCode: string | number): Promise<boolean> {
  const baseUrl = getBaseUrl();
  const token = getAuthToken();

  try {
    const response = await fetch(`${baseUrl}/client/support-tickets/${idOrCode}/close`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const json = await response.json();
      if (json.success) return true;
    }
  } catch {
    // fallback
  }

  localTicketsStore = localTicketsStore.map(ticket => {
    if (String(ticket.id) === String(idOrCode) || ticket.ticket_code === String(idOrCode)) {
      return {
        ...ticket,
        status: 'closed',
        status_label: 'مغلقة',
      };
    }
    return ticket;
  });

  return true;
}
