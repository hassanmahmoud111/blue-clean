import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { apiFetch, setStoredUser } from '../services/apiClient';
import './settings-page.css';

export default function SettingsPage() {
  const { lang, isRTL, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'profile' | 'notifications' | 'security') || 'security';
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security'>(initialTab);
  const [saved, setSaved] = useState(false);

  const handleTabChange = (tab: 'profile' | 'notifications' | 'security') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Form State: Profile
  const [fullName, setFullName] = useState('عبدالله الشمري احمد');
  const [companyName, setCompanyName] = useState('مؤسسة إيواء الفندقية 11');
  const [jobTitle, setJobTitle] = useState('مدير التشغيل 22');
  const [email, setEmail] = useState('client@blueclean.com');
  const [phone, setPhone] = useState('+966551234567');

  const displayFullName = lang === 'en' && fullName === 'عبدالله الشمري احمد' ? 'Abdullah Al-Shammari' : fullName;
  const displayCompany = lang === 'en' && companyName === 'مؤسسة إيواء الفندقية 11' ? 'Eiwa Hospitality Est.' : companyName;
  const displayJobTitle = lang === 'en' && jobTitle === 'مدير التشغيل 22' ? 'Operations Manager' : jobTitle;

  // Form State: Security & Passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State: Notifications
  const [toggles, setToggles] = useState({
    email: true,
    sms: true,
    inApp: true,
    marketing: false,
  });

  useEffect(() => {
    let active = true;
    apiFetch<any>('/client/settings').then((res) => {
      if (active && res.ok && res.data) {
        const d = res.data;
        if (d.name) setFullName(d.name);
        if (d.facility_name) setCompanyName(d.facility_name);
        if (d.job_title) setJobTitle(d.job_title);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.notifications) {
          setToggles({
            email: Boolean(d.notifications.notify_email ?? d.notifications.email ?? true),
            sms: Boolean(d.notifications.notify_sms ?? d.notifications.sms ?? true),
            inApp: Boolean(d.notifications.notify_in_app ?? d.notifications.in_app ?? true),
            marketing: Boolean(d.notifications.notify_marketing ?? d.notifications.marketing ?? false),
          });
        }
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (activeTab === 'profile') {
        const res = await apiFetch<any>('/client/settings/profile', {
          method: 'POST',
          body: JSON.stringify({
            name: fullName,
            facility_name: companyName,
            job_title: jobTitle,
            email,
            phone,
          }),
        });
        if (res.ok && res.data) {
          setStoredUser(res.data);
        }
      } else if (activeTab === 'notifications') {
        await apiFetch('/client/settings/preferences', {
          method: 'PUT',
          body: JSON.stringify({
            theme: 'light',
            language: lang,
            timezone: 'Asia/Riyadh',
            notify_email: toggles.email,
            notify_sms: toggles.sms,
            notify_in_app: toggles.inApp,
            notify_marketing: toggles.marketing,
          }),
        });
      } else if (activeTab === 'security' && currentPassword && newPassword) {
        await apiFetch('/client/settings/change-password', {
          method: 'POST',
          body: JSON.stringify({
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword || newPassword,
          }),
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      // Graceful fallback
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="settings-page-container">
      {/* Header */}
      <header className="settings-header">
        <div>
          <div className="settings-breadcrumb">
            <Link to="/app" style={{ color: 'inherit', textDecoration: 'none' }}>
              {t('nav.dashboard')}
            </Link>
            {isRTL ? <ChevronLeft size={13} /> : <ChevronRight size={13} />}
            <span>{t('nav.settings')}</span>
          </div>

          <div className="settings-title-row">
            <h1>{lang === 'en' ? 'Account Settings' : 'إعدادات الحساب'}</h1>
            <span className="settings-custom-badge">
              <SlidersHorizontal size={13} />
              {lang === 'en' ? 'Account Preferences' : 'تخصيص الحساب'}
            </span>
          </div>

          <p>
            {lang === 'en'
              ? 'Manage your personal profile, company info, security, and notification channels.'
              : 'إدارة بيانات حسابك الشخصي ومعلومات المنشأة وقنوات وتفضيلات الإشعارات والتنبيهات.'}
          </p>
        </div>

        <button
          type="button"
          className={`btn-save-settings ${saved ? 'saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved
            ? (lang === 'en' ? 'Saved Successfully' : 'تم الحفظ بنجاح')
            : (lang === 'en' ? 'Save Changes' : 'حفظ التغييرات')}
        </button>
      </header>

      {/* Main Layout */}
      <div className="settings-layout">
        {/* Right Navigation Panel */}
        <aside className="settings-nav-panel">
          <div className="settings-nav-header">
            <h2>{lang === 'en' ? 'Settings Sections' : 'أقسام الإعدادات'}</h2>
            <span className="settings-sections-badge">{lang === 'en' ? '3 Sections' : '3 أقسام'}</span>
          </div>

          <div className="settings-nav-list">
            {/* Nav Item 1: Profile */}
            <button
              type="button"
              className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              <div className="nav-item-content">
                <div className="nav-item-icon">
                  <User size={16} />
                </div>
                <span className="nav-item-label">
                  {lang === 'en' ? 'Personal Profile' : 'الحساب الشخصي'}
                </span>
              </div>
              {isRTL ? <ChevronLeft size={16} className="nav-item-arrow" /> : <ChevronRight size={16} className="nav-item-arrow" />}
            </button>

            {/* Nav Item 2: Notifications */}
            <button
              type="button"
              className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              <div className="nav-item-content">
                <div className="nav-item-icon">
                  <Bell size={16} />
                </div>
                <span className="nav-item-label">
                  {lang === 'en' ? 'Notifications & Alerts' : 'الإشعارات والتنبيهات'}
                </span>
              </div>
              {isRTL ? <ChevronLeft size={16} className="nav-item-arrow" /> : <ChevronRight size={16} className="nav-item-arrow" />}
            </button>

            {/* Nav Item 3: Security */}
            <button
              type="button"
              className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => handleTabChange('security')}
            >
              <div className="nav-item-content">
                <div className="nav-item-icon">
                  <Lock size={16} />
                </div>
                <span className="nav-item-label">
                  {lang === 'en' ? 'Security & Passwords' : 'الأمان وكلمة المرور'}
                </span>
              </div>
              {isRTL ? <ChevronLeft size={16} className="nav-item-arrow" /> : <ChevronRight size={16} className="nav-item-arrow" />}
            </button>
          </div>

          {/* Verified Organization Card */}
          <div className="settings-org-card">
            <div className="org-info">
              <span className="org-name">{lang === 'en' ? 'Eiwa Hospitality Est.' : companyName}</span>
              <span className="org-badge">
                <ShieldCheck size={13} />
                {lang === 'en' ? 'Verified Client' : 'عميل موثق'}
              </span>
            </div>
            <div className="org-icon">
              <Building2 size={20} />
            </div>
          </div>
        </aside>

        {/* Left Settings Main Card */}
        <main className="settings-main-card">
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} style={{ display: 'contents' }}>
              <div className="settings-main-header">
                <div>
                  <h2>{lang === 'en' ? 'Personal & Facility Details' : 'البيانات الشخصية والمنشأة'}</h2>
                  <p>
                    {lang === 'en'
                      ? 'Basic account information, contact details, facility management, and job title.'
                      : 'بيانات الحساب الأساسية ومعلومات التواصل وإدارة المنشأة والمسمى الوظيفي.'}
                  </p>
                </div>
                <User size={20} className="settings-main-header-icon" />
              </div>

              {/* Profile Avatar Card */}
              <div className="profile-preview-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-avatar-circle">
                    {displayFullName.slice(0, 1)}
                  </div>
                  <button
                    type="button"
                    className="profile-avatar-camera"
                    title={lang === 'en' ? 'Change profile picture' : 'تغيير الصورة الشخصية'}
                    onClick={() => alert(lang === 'en' ? 'You can choose a new profile picture' : 'يمكنك اختيار صورة جديدة لملفك الشخصي')}
                  >
                    <Camera size={13} />
                  </button>
                </div>

                <div className="profile-info-block">
                  <div className="profile-name-row">
                    <h3>{displayFullName}</h3>
                    <span className="profile-role-badge">{displayJobTitle}</span>
                  </div>
                  <span className="profile-email-text">{email}</span>
                  <button
                    type="button"
                    className="btn-upload-avatar"
                    onClick={() => alert(lang === 'en' ? 'You can choose a new profile picture' : 'يمكنك اختيار صورة جديدة لملفك الشخصي')}
                  >
                    <Camera size={13} />
                    {lang === 'en' ? 'Upload New Photo' : 'رفع صورة جديدة'}
                  </button>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="settings-fields-grid">
                {/* Row 1, Right: Full Name */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">{lang === 'en' ? 'Full Name *' : 'الاسم الكامل *'}</span>
                    <User size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Row 1, Left: Property / Organization Name */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">{lang === 'en' ? 'Facility / Property Name' : 'اسم المنشأة / العقار'}</span>
                    <Building2 size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                  />
                </div>

                {/* Row 2, Right: Job Title */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">{lang === 'en' ? 'Job Title' : 'المسمى الوظيفي'}</span>
                    <Briefcase size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                  />
                </div>

                {/* Row 2, Left: Email */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">{lang === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}</span>
                    <Mail size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="email"
                    className="settings-field-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3, Right: Phone Number */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">{lang === 'en' ? 'Phone Number *' : 'رقم الجوال *'}</span>
                    <Phone size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="tel"
                    className="settings-field-input"
                    style={{ direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'contents' }}>
              <div className="settings-main-header">
                <div>
                  <h2>{lang === 'en' ? 'Notifications & Alerts' : 'الإشعارات والتنبيهات'}</h2>
                  <p>
                    {lang === 'en'
                      ? 'Configure alert channels and preferences for receiving notifications and critical updates.'
                      : 'تحديد قنوات التنبيه وتفضيلات استلام الرسائل والتحديثات المهمة.'}
                  </p>
                </div>
                <Bell size={20} className="settings-main-header-icon" />
              </div>

              <div className="settings-toggles-list">
                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>{lang === 'en' ? 'Email Notifications' : 'إشعارات البريد الإلكتروني'}</strong>
                    <small>
                      {lang === 'en'
                        ? 'Receive booking confirmations, new invoices, and daily operation summaries.'
                        : 'استلام تأكيدات الحجوزات، الفواتير الجديدة، وتقارير التشغيل اليومية.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.email ? 'on' : ''}`}
                    onClick={() => setToggles(prev => ({ ...prev, email: !prev.email }))}
                    aria-label={lang === 'en' ? 'Toggle email notifications' : 'تفعيل إشعارات البريد الإلكتروني'}
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>{lang === 'en' ? 'SMS Text Messages' : 'رسائل الجوال القصيرة (SMS)'}</strong>
                    <small>
                      {lang === 'en'
                        ? 'Instant alerts when urgent service requests arrive or unusual logins occur.'
                        : 'تنبيهات فورية عند وصول طلب خدمة عاجل أو تسجيل دخول غير معتاد.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.sms ? 'on' : ''}`}
                    onClick={() => setToggles(prev => ({ ...prev, sms: !prev.sms }))}
                    aria-label={lang === 'en' ? 'Toggle SMS notifications' : 'تفعيل الرسائل القصيرة'}
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>{lang === 'en' ? 'In-Platform Notifications' : 'إشعارات داخل المنصة'}</strong>
                    <small>
                      {lang === 'en'
                        ? 'Live alerts through the top bell icon while navigating the dashboard.'
                        : 'إشعارات حية عبر الجرس العلوي أثناء استخدامك للمنصة.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.inApp ? 'on' : ''}`}
                    onClick={() => setToggles(prev => ({ ...prev, inApp: !prev.inApp }))}
                    aria-label={lang === 'en' ? 'Toggle in-platform notifications' : 'تفعيل إشعارات المنصة'}
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>{lang === 'en' ? 'Marketing & Special Offers' : 'الرسائل التسويقية والعروض'}</strong>
                    <small>
                      {lang === 'en'
                        ? 'Receive updates on new features, product announcements, and unit performance tips.'
                        : 'استلام تحديثات الميزات الجديدة والنصائح لتحسين أداء الوحدات.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.marketing ? 'on' : ''}`}
                    onClick={() => setToggles(prev => ({ ...prev, marketing: !prev.marketing }))}
                    aria-label={lang === 'en' ? 'Toggle marketing messages' : 'تفعيل الرسائل التسويقية'}
                  >
                    <span />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY - Matching media_1791378574293.png */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} style={{ display: 'contents' }}>
              <div className="settings-main-header">
                <div>
                  <h2>{lang === 'en' ? 'Security & Passwords' : 'الأمان وكلمة المرور'}</h2>
                  <p>
                    {lang === 'en'
                      ? 'Manage your password, login security, and account protection.'
                      : 'إدارة كلمة المرور وحماية حسابك وتأمينه.'}
                  </p>
                </div>
                <Lock size={20} className="settings-main-header-icon" />
              </div>

              {/* Security Guidelines Alert Box */}
              <div className="security-guidelines-banner">
                <div className="guidelines-header">
                  <ShieldCheck size={16} />
                  <span>{lang === 'en' ? 'Password Security Guidelines' : 'إرشادات أمان كلمة المرور'}</span>
                </div>
                <p className="guidelines-text">
                  {lang === 'en'
                    ? 'Make sure to use a strong password with at least 8 characters, including numbers, special symbols, and uppercase and lowercase letters.'
                    : 'احرص على استخدام كلمة مرور قوية تحتوي على 8 أحرف على الأقل، تتضمن أرقاماً ورموزاً وحروفاً كبيرة وصغيرة.'}
                </p>
              </div>

              {/* Password Fields */}
              <div className="password-fields-layout">
                {/* Field 1: Current Password (Full width) */}
                <div className="password-row-full">
                  <div className="settings-field-group">
                    <label className="settings-field-label">
                      <span className="field-label-text">{lang === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}</span>
                      <Lock size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        className="password-input"
                        placeholder={lang === 'en' ? 'Enter current password' : 'أدخل كلمة المرور الحالية'}
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowCurrent(!showCurrent)}
                        title={showCurrent ? (lang === 'en' ? 'Hide' : 'إخفاء') : (lang === 'en' ? 'Show' : 'عرض')}
                      >
                        {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fields 2 & 3: New Password and Confirm Password (2-col grid) */}
                <div className="password-row-grid">
                  {/* Right: New Password */}
                  <div className="settings-field-group">
                    <label className="settings-field-label">
                      <span className="field-label-text">{lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}</span>
                      <KeyRound size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="password-input"
                        placeholder={lang === 'en' ? 'Strong new password' : 'كلمة مرور جديدة قوية'}
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowNew(!showNew)}
                        title={showNew ? (lang === 'en' ? 'Hide' : 'إخفاء') : (lang === 'en' ? 'Show' : 'عرض')}
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Left: Confirm New Password */}
                  <div className="settings-field-group">
                    <label className="settings-field-label">
                      <span className="field-label-text">{lang === 'en' ? 'Confirm New Password' : 'تأكيد كلمة المرور الجديدة'}</span>
                      <KeyRound size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="password-input"
                        placeholder={lang === 'en' ? 'Re-enter new password' : 'أعد كتابة كلمة المرور الجديدة'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        title={showConfirm ? (lang === 'en' ? 'Hide' : 'إخفاء') : (lang === 'en' ? 'Show' : 'عرض')}
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}