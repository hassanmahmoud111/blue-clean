export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'brand';

export type Unit = {
  id: number;
  name: string;
  property: string;
  type: string;
  city: string;
  status: string;
  tone: Tone;
  guests: number;
  nextEvent: string;
  platform?: string;
  progress: number;
};

export type Reservation = {
  id: string;
  guest: string;
  unit: string;
  platform: 'Booking.com' | 'Airbnb' | 'جاذر' | 'مباشر';
  checkIn: string;
  checkOut: string;
  guests: number;
  status: string;
  tone: Tone;
};

export type OperationTask = {
  id: string;
  title: string;
  unit: string;
  assignee: string;
  time: string;
  status: 'جديدة' | 'قيد التنفيذ' | 'مكتملة';
  priority: 'عادية' | 'عاجلة';
};
