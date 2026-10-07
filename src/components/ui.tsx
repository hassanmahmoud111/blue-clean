import { useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react';
import { ChevronLeft, Inbox, Search, Sparkles, Waves } from 'lucide-react';
import type { Tone } from '../types';

export { SearchableSelect, type SearchableSelectProps, type SelectOption } from './SearchableSelect';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-[var(--brand-50)] text-[var(--brand-700)] border-[var(--brand-100)]',
  success: 'bg-[var(--success-soft)] text-[var(--success)] border-emerald-100',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning)] border-amber-100',
  danger: 'bg-[var(--danger-soft)] text-[var(--danger)] border-red-100',
  info: 'bg-[var(--info-soft)] text-[var(--info)] border-blue-100',
  neutral: 'bg-slate-50 text-slate-600 border-slate-200',
};

export function Logo({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="BluClean">
      <span className={`grid size-10 place-items-center rounded-[13px] ${light ? 'bg-white/12 text-white' : 'bg-[var(--brand-600)] text-white'}`}>
        <Waves size={22} strokeWidth={2.2} />
      </span>
      {!compact && <span className={`text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-[var(--ink-950)]'}`}>Blu<span className={light ? 'text-cyan-200' : 'text-[var(--brand-600)]'}>Clean</span></span>}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode;
};

export function Button({ children, variant = 'primary', icon, className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-[var(--brand-600)] text-white hover:bg-[var(--brand-700)] shadow-sm',
    secondary: 'bg-white text-[var(--ink-700)] border border-[var(--line)] hover:border-[var(--brand-200)] hover:text-[var(--brand-700)]',
    ghost: 'bg-transparent text-[var(--ink-500)] hover:bg-slate-100 hover:text-[var(--ink-950)]',
    danger: 'bg-[var(--danger-soft)] text-[var(--danger)] hover:bg-red-100',
  };
  return (
    <button className={`focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-[11px] px-4 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props}>
      {icon}{children}
    </button>
  );
}

export function IconButton({ label, children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button aria-label={label} title={label} className={`focus-ring grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-white text-[var(--ink-500)] transition hover:border-[var(--brand-200)] hover:bg-[var(--brand-50)] hover:text-[var(--brand-700)] ${className}`} {...props}>{children}</button>;
}

export function Tooltip({
  text,
  children,
  position = 'top',
  className = '',
}: {
  text: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          className={`pointer-events-none absolute z-[999] whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl transition-all duration-150 ${positionClasses[position]}`}
        >
          {text}
          <div
            className={`absolute border-4 border-transparent ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 border-t-slate-900'
                : position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900'
                : position === 'left'
                ? 'left-full top-1/2 -translate-y-1/2 border-l-slate-900'
                : 'right-full top-1/2 -translate-y-1/2 border-r-slate-900'
            }`}
          />
        </div>
      )}
    </div>
  );
}

export function Badge({ children, tone = 'neutral', dot = false }: { children: ReactNode; tone?: Tone; dot?: boolean }) {
  return <span className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${toneClasses[tone]}`}>{dot && <span className="size-1.5 rounded-full bg-current" />}{children}</span>;
}

export function PlatformBadge({ name }: { name: string }) {
  const styles: Record<string, string> = {
    'Booking.com': 'bg-blue-50 text-blue-700',
    Airbnb: 'bg-rose-50 text-rose-600',
    'جاذر': 'bg-violet-50 text-violet-700',
    'مباشر': 'bg-slate-100 text-slate-600',
  };
  return <span className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold ${styles[name] ?? styles['مباشر']}`}>{name}</span>;
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-[var(--ink-950)]">{title}</h2>
        {subtitle && <p className="mt-1 text-xs leading-5 text-[var(--ink-500)]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, description, action, eyebrow }: { title: string; description: string; action?: ReactNode; eyebrow?: string }) {
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="mb-1 text-xs font-semibold text-[var(--brand-600)]">{eyebrow}</p>}
        <h1 className="text-2xl font-bold tracking-tight text-[var(--ink-950)] md:text-[28px]">{title}</h1>
        <p className="mt-1.5 text-sm text-[var(--ink-500)]">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function SearchField({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`relative block ${className}`}>
      <Search className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-400)]" size={17} />
      <input className="focus-ring h-11 w-full rounded-xl border border-[var(--line)] bg-white pr-10 pl-3 text-sm text-[var(--ink-950)] placeholder:text-[var(--ink-400)] hover:border-slate-300 focus:border-[var(--brand-500)] focus:outline-none" {...props} />
    </label>
  );
}

export function ProgressBar({ value, tone = 'brand' }: { value: number; tone?: Tone }) {
  const colors: Record<Tone, string> = { brand: 'bg-[var(--brand-500)]', success: 'bg-emerald-500', warning: 'bg-amber-500', danger: 'bg-red-500', info: 'bg-blue-500', neutral: 'bg-slate-400' };
  return <div className="h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full transition-all ${colors[tone]}`} style={{ width: `${Math.min(value, 100)}%` }} /></div>;
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-12 text-base' };
  return <span className={`grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-[var(--brand-100)] to-cyan-100 font-bold text-[var(--brand-800)] ${sizes[size]}`}>{name.trim().slice(0, 1)}</span>;
}

export function EmptyState({ title = 'لا توجد نتائج', description = 'جرّب تغيير كلمات البحث أو عوامل التصفية.' }: { title?: string; description?: string }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-6 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-[var(--brand-50)] text-[var(--brand-600)]"><Inbox size={22} /></span>
      <h3 className="font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--ink-500)]">{description}</p>
    </div>
  );
}

export function MoreLink({ children = 'عرض الكل' }: { children?: ReactNode }) {
  return <button className="focus-ring inline-flex items-center gap-1 rounded-lg text-xs font-semibold text-[var(--brand-700)] hover:text-[var(--brand-900)]">{children}<ChevronLeft size={14} /></button>;
}

export function LoadingPage() {
  return <div className="space-y-6" aria-label="جارٍ تحميل الصفحة"><div className="skeleton h-20 rounded-2xl" /><div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="skeleton h-28 rounded-2xl" />)}</div><div className="grid gap-4 lg:grid-cols-3"><div className="skeleton h-96 rounded-2xl lg:col-span-2" /><div className="skeleton h-96 rounded-2xl" /></div></div>;
}

export function Highlight({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-100)] bg-[var(--brand-50)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-700)]"><Sparkles size={14} />{children}</span>;
}
