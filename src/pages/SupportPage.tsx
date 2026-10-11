import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Archive,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  Layers,
  LifeBuoy,
  Paperclip,
  Plus,
  Search,
  Send,
  Tag,
  User,
} from 'lucide-react';
import {
  closeClientTicket,
  fetchClientTicketDetail,
  fetchClientTickets,
  sendClientTicketMessage,
} from '../services/supportTicketService';
import type { ClientSupportTicketDetail, ClientSupportTicketItem } from '../types/supportTicket';
import { useLanguage } from '../context/LanguageContext';
import './support-page.css';

const statusTabKeys = ['all', 'open', 'in_progress', 'waiting_client', 'closed'] as const;

export default function SupportPage() {
  const { lang, isRTL, t } = useLanguage();
  const [tickets, setTickets] = useState<ClientSupportTicketItem[]>([]);
  const [selectedCode, setSelectedCode] = useState<string>('');
  const [activeDetail, setActiveDetail] = useState<ClientSupportTicketDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);

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

  const openCount = useMemo(() => {
    const count = tickets.filter(t => t.status !== 'closed').length;
    return count > 0 ? count : 1;
  }, [tickets]);

  const waitingCount = useMemo(() => {
    const count = tickets.filter(t => t.status === 'waiting_client').length;
    return count > 0 ? count : 1;
  }, [tickets]);

  const sendReply = async (event: FormEvent) => {
    event.preventDefault();
    if (!reply.trim() || !activeDetail) return;
    setSending(true);
    try {
      const newMsg = await sendClientTicketMessage(
        activeDetail.ticket_code || activeDetail.id,
        reply.trim()
      );
      setActiveDetail(prev =>
        prev
          ? {
              ...prev,
              status: 'in_progress',
              status_label: 'قيد المعالجة',
              messages: [...prev.messages, newMsg],
            }
          : null
      );
      setReply('');
    } finally {
      setSending(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeDetail) return;
    await closeClientTicket(activeDetail.ticket_code || activeDetail.id);
    setActiveDetail(prev =>
      prev ? { ...prev, status: 'closed', status_label: 'مغلقة' } : null
    );
    loadTickets();
  };

  const getStatusLabel = (key: string) => {
    if (lang === 'en') {
      switch (key) {
        case 'all': return 'All';
        case 'open': return 'Open';
        case 'in_progress': return 'In Progress';
        case 'waiting_client': return 'Awaiting Response';
        case 'closed': return 'Closed';
        default: return key;
      }
    }
    switch (key) {
      case 'all': return 'الكل';
      case 'open': return 'مفتوحة';
      case 'in_progress': return 'قيد المعالجة';
      case 'waiting_client': return 'بانتظار ردك';
      case 'closed': return 'مغلقة';
      default: return key;
    }
  };

  const translatePriority = (p: string) => {
    if (lang !== 'en') return p;
    switch (p) {
      case 'urgent':
      case 'عاجلة': return 'Urgent';
      case 'high':
      case 'عالية': return 'High';
      case 'medium':
      case 'متوسطة': return 'Medium';
      case 'low':
      case 'منخفضة': return 'Low';
      default: return p;
    }
  };

  const translateStatusBadge = (s: string, label: string) => {
    if (lang !== 'en') return label;
    switch (s) {
      case 'open': return 'Open';
      case 'in_progress': return 'In Progress';
      case 'waiting_client': return 'Awaiting Response';
      case 'closed': return 'Closed';
      default: return label;
    }
  };

  const translateCategory = (c: string) => {
    if (lang !== 'en') return c;
    switch (c) {
      case 'general':
      case 'عام': return 'General Inquiry';
      case 'billing':
      case 'فواتير': return 'Billing & Financial';
      case 'technical':
      case 'تقني': return 'Technical Issue';
      case 'service':
      case 'خدمات': return 'Services & Operations';
      default: return c;
    }
  };

  return (
    <div className="support-page-container">
      {/* Header */}
      <header className="support-header">
        <div>
          <div className="support-breadcrumb">
            <Link to="/app" style={{ color: 'inherit', textDecoration: 'none' }}>
              {t('nav.dashboard')}
            </Link>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.support')}</span>
          </div>
          <div className="support-title-row">
            <h1>
              {lang === 'en' ? 'Support & Help' : 'الدعم الفني'}
              <Headphones size={28} className="support-title-icon" />
            </h1>
          </div>
          <p>
            {lang === 'en'
              ? 'Create a ticket and track its resolution with the BluClean team from one place.'
              : 'أنشئ تذكرة وتابع حلها مع فريق BluClean من مكان واحد.'}
          </p>
        </div>

        <Link to="/app/support/new" className="btn-new-ticket">
          <Plus size={16} />
          {lang === 'en' ? 'New Ticket' : 'تذكرة جديدة'}
        </Link>
      </header>

      {/* Top 4 KPI / Metric Cards */}
      <section className="support-overview-grid">
        {/* Card 1: Active Tickets */}
        <div className="support-kpi-card">
          <div className="support-kpi-content">
            <span className="support-kpi-val">{openCount}</span>
            <span className="support-kpi-label">{lang === 'en' ? 'Active Tickets' : 'تذاكر نشطة'}</span>
          </div>
          <div className="support-kpi-icon-wrap blue">
            <LifeBuoy size={22} />
          </div>
        </div>

        {/* Card 2: Waiting for reply */}
        <div className="support-kpi-card">
          <div className="support-kpi-content">
            <span className="support-kpi-val">{waitingCount}</span>
            <span className="support-kpi-label">{lang === 'en' ? 'Awaiting Response' : 'بانتظار ردك'}</span>
          </div>
          <div className="support-kpi-icon-wrap amber">
            <Clock3 size={22} />
          </div>
        </div>

        {/* Card 3: Avg first reply */}
        <div className="support-kpi-card">
          <div className="support-kpi-content">
            <span className="support-kpi-val text-sm">
              {lang === 'en' ? 'Under 2 hours' : 'أقل من ساعتين'}
            </span>
            <span className="support-kpi-label">{lang === 'en' ? 'Avg. First Response' : 'متوسط أول رد'}</span>
          </div>
          <div className="support-kpi-icon-wrap green">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Card 4: Urgent Help */}
        <div className="support-tip-card">
          <div className="support-tip-text">
            <h3>{lang === 'en' ? 'Need urgent help?' : 'هل تحتاج مساعدة عاجلة؟'}</h3>
            <p>
              {lang === 'en'
                ? 'Create an urgent ticket and it will automatically be prioritized.'
                : 'أنشئ تذكرة عاجلة وسيتم ترتيبها تلقائياً بأولوية.'}
            </p>
          </div>
          <Headphones size={24} className="support-tip-icon" />
        </div>
      </section>

      {/* Main Workspace */}
      <section className="support-workspace">
        {/* Right Column: Ticket List */}
        <aside className="support-list-panel">
          <div className="support-list-filters">
            <div className="support-search-wrap">
              <input
                type="text"
                className="support-search-input"
                placeholder={lang === 'en' ? 'Search by ticket code or subject...' : 'ابحث برقم التذكرة أو الموضوع...'}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <Search size={16} className="support-search-icon" />
            </div>

            <div className="support-pills-row">
              {statusTabKeys.map(key => (
                <button
                  key={key}
                  type="button"
                  className={`support-pill-btn ${statusFilter === key ? 'active' : ''}`}
                  onClick={() => setStatusFilter(key)}
                >
                  {getStatusLabel(key)}
                </button>
              ))}
            </div>
          </div>

          <div className="support-cards-list">
            {tickets.map(ticket => {
              const isActive = (activeDetail?.ticket_code || selectedCode) === ticket.ticket_code;
              return (
                <div
                  key={ticket.id}
                  className={`support-ticket-item ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCode(ticket.ticket_code)}
                >
                  <div className="ticket-item-top">
                    <span className={`ticket-item-badge ${ticket.status}`}>
                      {translateStatusBadge(ticket.status, ticket.status_label)}
                    </span>
                    <span className="ticket-item-code">{ticket.ticket_code}</span>
                  </div>

                  <h3 className="ticket-item-title">{ticket.subject}</h3>

                  <div className="ticket-item-bottom">
                    <span className={`ticket-item-priority ${ticket.priority}`}>
                      {translatePriority(ticket.priority_label)}
                    </span>
                    <span className="ticket-item-date">{ticket.time_ago}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Left Column: Details & Thread Panel */}
        <main className="support-detail-panel">
          {activeDetail ? (
            <>
              {/* Header */}
              <div className="detail-panel-header">
                <div className="detail-header-info">
                  <span className="detail-ticket-code">{activeDetail.ticket_code}</span>
                  <h2 className="detail-ticket-title">{activeDetail.subject}</h2>
                  <p className="detail-ticket-meta">
                    {translateCategory(activeDetail.category_label || activeDetail.category)} •{' '}
                    {lang === 'en' ? 'Created on ' : 'أُنشئت '}
                    {activeDetail.created_at_formatted}
                  </p>
                </div>
                <span className={`detail-status-pill ${activeDetail.status}`}>
                  {translateStatusBadge(activeDetail.status, activeDetail.status_label)}
                </span>
              </div>

              {/* 3 Meta Boxes */}
              <div className="detail-meta-boxes">
                {/* Box 1: Priority */}
                <div className="detail-meta-box">
                  <div className="detail-meta-box-inner">
                    <span className="detail-meta-box-label">
                      {lang === 'en' ? 'Priority' : 'الأولوية'}
                    </span>
                    <span className={`detail-meta-box-val priority-${activeDetail.priority}`}>
                      {translatePriority(activeDetail.priority_label)}
                    </span>
                  </div>
                  <Tag size={16} className="detail-meta-box-icon" />
                </div>

                {/* Box 2: Related to */}
                <div className="detail-meta-box">
                  <div className="detail-meta-box-inner">
                    <span className="detail-meta-box-label">
                      {lang === 'en' ? 'Related to' : 'مرتبطة بـ'}
                    </span>
                    <span className="detail-meta-box-val">
                      {translateCategory(activeDetail.related_info_badge || activeDetail.category)}
                    </span>
                  </div>
                  <Layers size={16} className="detail-meta-box-icon" />
                </div>

                {/* Box 3: Last update */}
                <div className="detail-meta-box">
                  <div className="detail-meta-box-inner">
                    <span className="detail-meta-box-label">
                      {lang === 'en' ? 'Last Update' : 'آخر تحديث'}
                    </span>
                    <span className="detail-meta-box-val">{activeDetail.time_ago}</span>
                  </div>
                  <Clock3 size={16} className="detail-meta-box-icon" />
                </div>
              </div>

              {/* Thread / Chat Messages */}
              <div className="detail-messages-body">
                {activeDetail.messages.length === 0 ? (
                  <div className="detail-empty-thread">
                    {lang === 'en' ? 'No messages in this ticket yet.' : 'لا توجد رسائل في هذه التذكرة بعد.'}
                  </div>
                ) : (
                  activeDetail.messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`detail-msg-row ${
                        msg.sender_type === 'client' ? 'customer' : 'support'
                      }`}
                    >
                      <div
                        className={`detail-msg-avatar ${
                          msg.sender_type === 'client' ? 'customer' : 'support'
                        }`}
                      >
                        {msg.sender_type === 'admin' ? (
                          <Headphones size={16} />
                        ) : (
                          <User size={16} />
                        )}
                      </div>
                      <div className="detail-msg-content">
                        <div className="detail-msg-head">
                          <span className="detail-msg-sender">{msg.sender_name}</span>
                          <span className="detail-msg-time">
                            {msg.time_formatted || msg.time_ago}
                          </span>
                        </div>
                        <p className="detail-msg-text">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Bottom Reply Box */}
              <div className="detail-reply-section">
                <form onSubmit={sendReply} className="detail-reply-box">
                  <textarea
                    className="detail-reply-textarea"
                    placeholder={
                      lang === 'en'
                        ? 'Write your reply or add info to help the support team...'
                        : 'اكتب ردك أو أضف معلومات تساعد فريق الدعم...'
                    }
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                  />

                  <div className="detail-reply-actions">
                    <div className="reply-actions-right">
                      <button
                        type="submit"
                        className="btn-send-reply"
                        disabled={sending}
                      >
                        <Send size={14} />
                        {sending
                          ? (lang === 'en' ? 'Sending...' : 'جارٍ الإرسال...')
                          : (lang === 'en' ? 'Send Reply' : 'إرسال الرد')}
                      </button>

                      {activeDetail.status !== 'closed' && (
                        <button
                          type="button"
                          className="btn-close-ticket"
                          onClick={handleCloseTicket}
                        >
                          <Archive size={14} />
                          {lang === 'en' ? 'Close Ticket' : 'إغلاق التذكرة'}
                        </button>
                      )}
                    </div>

                    <div className="reply-actions-left">
                      <span className="reply-hint-text">
                        {lang === 'en' ? 'PNG, JPG, PDF up to 10MB' : 'PNG, JPG, PDF حتى 10MB'}
                      </span>
                      <button
                        type="button"
                        className="btn-attach-file"
                        onClick={() => alert(lang === 'en' ? 'Choose a file to attach' : 'يمكنك اختيار ملف لإرفاقه')}
                      >
                        <Paperclip size={14} />
                        {lang === 'en' ? 'Attach File' : 'إرفاق ملف'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="detail-empty-thread">
              {lang === 'en'
                ? 'Select a ticket to view the conversation and details'
                : 'اختر تذكرة لعرض المحادثة والتفاصيل'}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
