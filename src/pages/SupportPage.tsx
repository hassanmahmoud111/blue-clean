import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArrowLeft, CheckCircle2, Clock3, Headphones, LifeBuoy, MessageSquareText, Paperclip, Plus, Search, Send, Tag, User } from 'lucide-react';
import {
  closeClientTicket,
  fetchClientTicketDetail,
  fetchClientTickets,
  sendClientTicketMessage,
} from '../services/supportTicketService';
import type { ClientSupportTicketDetail, ClientSupportTicketItem } from '../types/supportTicket';
import './support-page.css';

const statusTabs = [
  { key: 'all', label: 'الكل' },
  { key: 'open', label: 'مفتوحة' },
  { key: 'in_progress', label: 'قيد المعالجة' },
  { key: 'waiting_client', label: 'بانتظار ردك' },
  { key: 'closed', label: 'مغلقة' },
] as const;

export default function SupportPage() {
  const [tickets, setTickets] = useState<ClientSupportTicketItem[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [activeDetail, setActiveDetail] = useState<ClientSupportTicketDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [mobileDetails, setMobileDetails] = useState(false);

  const loadTickets = async () => {
    const list = await fetchClientTickets({
      search: query,
      status: statusFilter,
    });
    setTickets(list);
    if (list.length > 0 && !selectedCode) {
      setSelectedCode(list[0].ticket_code);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [statusFilter, query]);

  useEffect(() => {
    if (selectedCode) {
      fetchClientTicketDetail(selectedCode).then(detail => {
        if (detail) setActiveDetail(detail);
      });
    }
  }, [selectedCode]);

  const openCount = useMemo(() => tickets.filter(t => t.status !== 'closed').length, [tickets]);
  const waitingCount = useMemo(() => tickets.filter(t => t.status === 'waiting_client').length, [tickets]);

  const sendReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!reply.trim() || !activeDetail) return;
    setSending(true);
    try {
      const newMsg = await sendClientTicketMessage(activeDetail.ticket_code || activeDetail.id, reply.trim());
      setActiveDetail(prev => prev ? {
        ...prev,
        status: 'in_progress',
        status_label: 'قيد المعالجة',
        messages: [...prev.messages, newMsg],
      } : null);
      setReply('');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeDetail) return;
    await closeClientTicket(activeDetail.ticket_code || activeDetail.id);
    setActiveDetail(prev => prev ? { ...prev, status: 'closed', status_label: 'مغلقة' } : null);
    loadTickets();
  };

  return <div className="support-page">
    <header className="support-header"><div><span>الرئيسية <ArrowLeft size={13}/> الدعم الفني</span><h1><Headphones size={30}/>الدعم الفني</h1><p>أنشئ تذكرة وتابع حلها مع فريق BluClean من مكان واحد.</p></div><Link className="support-primary" to="/app/support/new"><Plus size={18}/>تذكرة جديدة</Link></header>
    <section className="support-overview">
      <article><span className="blue"><LifeBuoy size={22}/></span><div><b>{openCount}</b><small>تذاكر نشطة</small></div></article>
      <article><span className="amber"><Clock3 size={22}/></span><div><b>{waitingCount}</b><small>بانتظار ردك</small></div></article>
      <article><span className="green"><CheckCircle2 size={22}/></span><div><b>أقل من ساعتين</b><small>متوسط أول رد</small></div></article>
      <div className="support-tip"><Headphones size={21}/><p><b>هل تحتاج مساعدة عاجلة؟</b><small>أنشئ تذكرة عاجلة وسيتم ترتيبها تلقائيًا بالأولوية.</small></p></div>
    </section>
    <section className="support-workspace">
      <aside className={`${mobileDetails?'mobile-hidden':''} support-list`}>
        <div className="support-filters"><label><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="ابحث برقم التذكرة أو الموضوع..."/></label><div>{statusTabs.map(item=><button key={item.key} className={statusFilter===item.key?'active':''} onClick={()=>setStatusFilter(item.key)}>{item.label}</button>)}</div></div>
        <div className="support-ticket-list">{tickets.length ? tickets.map(ticket=><TicketRow key={ticket.id} ticket={ticket} active={(activeDetail?.ticket_code || selectedCode) === ticket.ticket_code} onClick={()=>{setSelectedCode(ticket.ticket_code);setMobileDetails(true)}}/>) : <div className="support-empty"><Search size={26}/><b>لا توجد تذاكر مطابقة</b><small>غيّر البحث أو حالة التذكرة.</small></div>}</div>
      </aside>
      {activeDetail ? <article className={`${mobileDetails?'mobile-visible':''} support-details`}>
        <div className="support-details-head"><button className="support-back" onClick={()=>setMobileDetails(false)}><ArrowLeft size={18}/></button><div><span>{activeDetail.ticket_code}</span><h2>{activeDetail.subject}</h2><p>{activeDetail.category_label} · أُنشئت {activeDetail.created_at_formatted}</p></div><StatusBadge status={activeDetail.status} label={activeDetail.status_label}/></div>
        <div className="support-meta"><span><Tag size={15}/><small>الأولوية</small><b className={`priority-${priorityKey(activeDetail.priority)}`}>{activeDetail.priority_label}</b></span><span><MessageSquareText size={15}/><small>مرتبطة بـ</small><b>{activeDetail.related_info_badge ?? 'طلب عام'}</b></span><span><Clock3 size={15}/><small>آخر تحديث</small><b>{activeDetail.time_ago}</b></span></div>
        <div className="support-thread">{activeDetail.messages.map(message=><div key={message.id} className={`support-message ${message.sender_type === 'client' ? 'customer' : 'support'}`}><span>{message.sender_type === 'admin' ? <Headphones size={18}/> : <User size={18}/>}</span><div><header><b>{message.sender_name}</b><time>{message.time_formatted || message.time_ago}</time></header><p>{message.message}</p></div></div>)}</div>
        {activeDetail.status==='closed' ? <div className="support-closed"><CheckCircle2 size={19}/><span><b>تم إغلاق هذه التذكرة</b><small>يمكنك إنشاء تذكرة جديدة إذا احتجت مساعدة أخرى.</small></span><Link className="support-primary" to="/app/support/new">تذكرة جديدة</Link></div> : <form className="support-reply" onSubmit={sendReply}><textarea value={reply} onChange={event=>setReply(event.target.value)} placeholder="اكتب ردك أو أضف معلومات تساعد فريق الدعم..."/><div><button type="button" className="support-attach"><Paperclip size={16}/>إرفاق ملف</button><span>PNG، JPG، PDF حتى 10MB</span><button type="button" className="support-close" onClick={handleCloseTicket}><Archive size={16}/>إغلاق التذكرة</button><button className="support-primary" disabled={sending}><Send size={16}/>{sending ? 'جارٍ الإرسال...' : 'إرسال الرد'}</button></div></form>}
      </article> : <div className="support-empty p-8"><p>اختر تذكرة لعرض المحادثة والتفاصيل</p></div>}
    </section>
  </div>;
}

function TicketRow({ticket,active,onClick}:{ticket:ClientSupportTicketItem;active:boolean;onClick:()=>void}) {
  return <button className={active?'active':''} onClick={onClick}><div className="ticket-row-top"><span>{ticket.ticket_code}</span><StatusBadge status={ticket.status} label={ticket.status_label}/></div><h3>{ticket.subject}</h3><p>{ticket.last_message?.message || 'لا توجد رسائل بعد.'}</p><footer><span className={`priority-${priorityKey(ticket.priority)}`}>{ticket.priority_label}</span><time>{ticket.time_ago}</time></footer></button>;
}

function StatusBadge({status, label}:{status:string; label:string}) { return <span className={`support-status status-${statusKey(status)}`}>{label}</span>; }
function statusKey(status:string){return status==='open'?'open':status==='in_progress'?'progress':status==='waiting_client'?'waiting':'closed'}
function priorityKey(priority:string){return priority==='urgent'?'urgent':priority==='medium'?'medium':'normal'}

