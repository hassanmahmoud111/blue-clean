export type TicketCategory =
  | 'integration_sync'
  | 'units_bookings'
  | 'operations_services'
  | 'account_permissions'
  | 'billing_subscription'
  | 'other';

export type TicketPriority = 'normal' | 'medium' | 'urgent';
export type TicketStatus = 'open' | 'in_progress' | 'waiting_client' | 'closed';

export interface TicketMessage {
  id: number;
  sender_type: 'client' | 'admin' | string;
  sender_name: string;
  message: string;
  attachments?: string[];
  time_formatted?: string;
  time_ago?: string;
}

export interface ClientSupportTicketItem {
  id: number;
  ticket_code: string;
  subject: string;
  category: TicketCategory | string;
  category_label: string;
  priority: TicketPriority | string;
  priority_label: string;
  status: TicketStatus | string;
  status_label: string;
  last_message?: {
    message: string;
    sender_type: string;
    sender_name: string;
    time_ago: string;
  };
  created_at_formatted: string;
  time_ago: string;
}

export interface ClientSupportTicketDetail {
  id: number;
  ticket_code: string;
  subject: string;
  category: TicketCategory | string;
  category_label: string;
  priority: TicketPriority | string;
  priority_label: string;
  status: TicketStatus | string;
  status_label: string;
  related_info_badge?: string;
  created_at_formatted: string;
  time_ago: string;
  messages: TicketMessage[];
}

export interface CreateClientTicketPayload {
  subject: string;
  category: TicketCategory | string;
  priority: TicketPriority | string;
  message: string;
  unit_id?: number | string;
  booking_id?: number | string;
  attachments?: any[];
}
