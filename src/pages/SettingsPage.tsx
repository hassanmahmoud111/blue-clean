import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Bell,
  Briefcase,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  SlidersHorizontal,
  User,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  fetchClientMe,
  fetchClientNotifications,
  getStoredUser,
} from '../services/apiClient';
import {
  changeClientPassword,
  fetchClientSettings,
  updateClientNotifications,
  updateClientProfile,
} from '../services/clientSettingsService';
import './settings-page.css';

type SettingsTab = 'profile' | 'notifications' | 'security';

function parseTab(val: string | null): SettingsTab {
  if (val === 'profile' || val === 'notifications' || val === 'security') {
    return val;
  }
  return 'profile';
}

export default function SettingsPage() {
  const { lang, isRTL, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => parseTab(searchParams.get('tab')));

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Sync tab with URL search param changes
  useEffect(() => {
    const paramTab = searchParams.get('tab');
    if (paramTab === 'profile' || paramTab === 'notifications' || paramTab === 'security') {
      setActiveTab(paramTab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setStatusBanner(null);
  };

  const storedUser = getStoredUser();

  // Form State: Profile
  const [fullName, setFullName] = useState(storedUser?.name || 'عبدالله الشمري احمد');
  const [companyName, setCompanyName] = useState(storedUser?.facility_name || 'مؤسسة إيواء الفندقية 11');
  const [jobTitle, setJobTitle] = useState(storedUser?.job_title || 'مدير التشغيل 22');
  const [email, setEmail] = useState(storedUser?.email || 'client@blueclean.com');
  const [phone, setPhone] = useState(storedUser?.phone || '+966551234567');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(storedUser?.avatar_url || null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const [roleBadgeAr, setRoleBadgeAr] = useState<string>('');
  const [roleBadgeEn, setRoleBadgeEn] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const displayFullName =
    lang === 'en' && fullName === 'عبدالله الشمري احمد' ? 'Abdullah Al-Shammari' : fullName;
  const displayCompany =
    lang === 'en' && companyName === 'مؤسسة إيواء الفندقية 11'
      ? 'Eiwa Hospitality Est.'
      : companyName;
  const displayJobTitle =
    lang === 'en'
      ? jobTitle === 'مدير التشغيل 22'
        ? 'Operations Manager'
        : jobTitle || roleBadgeEn || 'Account Owner'
      : jobTitle || roleBadgeAr || 'مالك المنشأة';

  // Form State: Security & Passwords
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State: Notifications & Preferences
  const [prefsMeta, setPrefsMeta] = useState({
    theme: 'light',
    language: 'ar',
    timezone: 'Asia/Riyadh',
  });
  const [toggles, setToggles] = useState({
    email: true,
    sms: true,
    inApp: true,
    marketing: false,
  });

  // Load live settings from GET /client/settings, GET /client/auth/me, and GET /client/notifications
  useEffect(() => {
    let active = true;

    fetchClientMe().then((me) => {
      if (active && me) {
        if (me.name) setFullName(me.name);
        if (me.facility_name) setCompanyName(me.facility_name);
        if (me.job_title) setJobTitle(me.job_title);
        if (me.email) setEmail(me.email);
        if (me.phone) setPhone(me.phone);
        if (me.avatar_url) {
          setAvatarUrl(me.avatar_url);
          setAvatarLoadError(false);
        }
      }
    });

    fetchClientNotifications().catch(() => {});

    fetchClientSettings().then((d) => {
      if (active && d) {
        if (d.name) setFullName(d.name);
        if (d.facility_name) setCompanyName(d.facility_name);
        if (d.job_title) setJobTitle(d.job_title);
        if (d.email) setEmail(d.email);
        if (d.phone) setPhone(d.phone);
        if (d.avatar_url) {
          setAvatarUrl(d.avatar_url);
          setAvatarLoadError(false);
        }
        if (d.role) {
          setRoleBadgeAr(d.role.name_ar || d.role.name || '');
          setRoleBadgeEn(d.role.name_en || d.role.name || '');
        }
        if (d.preferences) {
          setPrefsMeta({
            theme: d.preferences.theme || 'light',
            language: d.preferences.language || lang,
            timezone: d.preferences.timezone || 'Asia/Riyadh',
          });
        }
        if (d.notifications) {
          setToggles({
            email: Boolean(d.notifications.notify_email ?? d.notifications.email ?? true),
            sms: Boolean(d.notifications.notify_sms ?? d.notifications.sms ?? true),
            inApp: Boolean(d.notifications.notify_in_app ?? d.notifications.in_app ?? true),
            marketing: Boolean(
              d.notifications.notify_marketing ?? d.notifications.marketing ?? false
            ),
          });
        }
      }
    });
    return () => {
      active = false;
    };
  }, [lang]);

  const handleAvatarSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarLoadError(false);
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const handleToggleNotification = async (key: keyof typeof toggles) => {
    const nextToggles = {
      ...toggles,
      [key]: !toggles[key],
    };
    setToggles(nextToggles);
    setStatusBanner(null);

    const res = await updateClientNotifications({
      theme: prefsMeta.theme,
      language: lang,
      timezone: prefsMeta.timezone,
      notify_email: nextToggles.email,
      notify_sms: nextToggles.sms,
      notify_in_app: nextToggles.inApp,
      notify_marketing: nextToggles.marketing,
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } else {
      setStatusBanner({ type: 'error', message: res.message });
    }
  };

  const handleSave = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setStatusBanner(null);
    setSaving(true);

    try {
      if (activeTab === 'profile') {
        if (!fullName.trim() || !email.trim() || !phone.trim()) {
          setStatusBanner({
            type: 'error',
            message:
              lang === 'en'
                ? 'Please fill in all required fields (Name, Email, Phone).'
                : 'يرجى تعبئة جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، رقم الجوال).',
          });
          setSaving(false);
          return;
        }

        const res = await updateClientProfile({
          name: fullName.trim(),
          facility_name: companyName.trim(),
          job_title: jobTitle.trim(),
          email: email.trim(),
          phone: phone.trim(),
          avatarFile,
        });

        if (res.ok) {
          if (res.data?.avatar_url) {
            setAvatarUrl(res.data.avatar_url);
            setAvatarLoadError(false);
          }
          setAvatarFile(null);
          setSaved(true);
          setStatusBanner({
            type: 'success',
            message:
              lang === 'en'
                ? 'Personal profile updated successfully.'
                : res.message || 'تم تحديث البيانات الشخصية بنجاح.',
          });
          setTimeout(() => setSaved(false), 2200);
        } else {
          setStatusBanner({ type: 'error', message: res.message });
        }
      } else if (activeTab === 'notifications') {
        const res = await updateClientNotifications({
          theme: prefsMeta.theme,
          language: lang,
          timezone: prefsMeta.timezone,
          notify_email: toggles.email,
          notify_sms: toggles.sms,
          notify_in_app: toggles.inApp,
          notify_marketing: toggles.marketing,
        });

        if (res.ok) {
          setSaved(true);
          setStatusBanner({
            type: 'success',
            message:
              lang === 'en'
                ? 'Notification preferences saved successfully.'
                : res.message || 'تم تحديث تفضيلات الإشعارات بنجاح.',
          });
          setTimeout(() => setSaved(false), 2200);
        } else {
          setStatusBanner({ type: 'error', message: res.message });
        }
      } else if (activeTab === 'security') {
        if (!currentPassword) {
          setStatusBanner({
            type: 'error',
            message:
              lang === 'en'
                ? 'Please enter your current password.'
                : 'كلمة المرور الحالية مطلوبة.',
          });
          setSaving(false);
          return;
        }
        if (!newPassword || newPassword.length < 8) {
          setStatusBanner({
            type: 'error',
            message:
              lang === 'en'
                ? 'New password must be at least 8 characters.'
                : 'كلمة المرور الجديدة يجب أن تتكون من 8 أحرف على الأقل.',
          });
          setSaving(false);
          return;
        }
        if (confirmPassword && newPassword !== confirmPassword) {
          setStatusBanner({
            type: 'error',
            message:
              lang === 'en'
                ? 'New password and confirmation do not match.'
                : 'تأكيد كلمة المرور الجديدة غير مطابق.',
          });
          setSaving(false);
          return;
        }

        const res = await changeClientPassword({
          current_password: currentPassword,
          password: newPassword,
          password_confirmation: confirmPassword || newPassword,
        });

        if (res.ok) {
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setSaved(true);
          setStatusBanner({
            type: 'success',
            message:
              lang === 'en'
                ? 'Password changed successfully.'
                : res.message || 'تم تغيير كلمة المرور بنجاح.',
          });
          setTimeout(() => setSaved(false), 2200);
        } else {
          setStatusBanner({ type: 'error', message: res.message });
        }
      }
    } finally {
      setSaving(false);
    }
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
          disabled={saving}
          onClick={() => handleSave()}
        >
          {saving ? (
            <LoaderCircle size={16} className="auth-spinner" />
          ) : saved ? (
            <Check size={16} />
          ) : (
            <Save size={16} />
          )}
          {saving
            ? lang === 'en'
              ? 'Saving...'
              : 'جارٍ الحفظ...'
            : saved
              ? lang === 'en'
                ? 'Saved Successfully'
                : 'تم الحفظ بنجاح'
              : lang === 'en'
                ? 'Save Changes'
                : 'حفظ التغييرات'}
        </button>
      </header>

      {/* Main Layout */}
      <div className="settings-layout">
        {/* Right Navigation Panel */}
        <aside className="settings-nav-panel">
          <div className="settings-nav-header">
            <h2>{lang === 'en' ? 'Settings Sections' : 'أقسام الإعدادات'}</h2>
            <span className="settings-sections-badge">
              {lang === 'en' ? '3 Sections' : '3 أقسام'}
            </span>
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
              {isRTL ? (
                <ChevronLeft size={16} className="nav-item-arrow" />
              ) : (
                <ChevronRight size={16} className="nav-item-arrow" />
              )}
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
              {isRTL ? (
                <ChevronLeft size={16} className="nav-item-arrow" />
              ) : (
                <ChevronRight size={16} className="nav-item-arrow" />
              )}
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
              {isRTL ? (
                <ChevronLeft size={16} className="nav-item-arrow" />
              ) : (
                <ChevronRight size={16} className="nav-item-arrow" />
              )}
            </button>
          </div>

          {/* Verified Organization Card */}
          <div className="settings-org-card">
            <div className="org-info">
              <span className="org-name">{displayCompany}</span>
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
          {statusBanner && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '16px',
                fontSize: '13px',
                fontWeight: 600,
                background: statusBanner.type === 'success' ? '#f0fdf4' : '#fef2f2',
                border:
                  statusBanner.type === 'success'
                    ? '1px solid #bbf7d0'
                    : '1px solid #fecaca',
                color: statusBanner.type === 'success' ? '#15803d' : '#dc2626',
              }}
            >
              {statusBanner.type === 'success' ? (
                <Check size={16} style={{ flexShrink: 0 }} />
              ) : (
                <CircleAlert size={16} style={{ flexShrink: 0 }} />
              )}
              <span>{statusBanner.message}</span>
            </div>
          )}

          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} style={{ display: 'contents' }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarSelect}
              />

              <div className="settings-main-header">
                <div>
                  <h2>
                    {lang === 'en'
                      ? 'Personal & Facility Details'
                      : 'البيانات الشخصية والمنشأة'}
                  </h2>
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
                  <div
                    className="profile-avatar-circle"
                    style={{ overflow: 'hidden', position: 'relative' }}
                  >
                    {avatarUrl && !avatarLoadError ? (
                      <img
                        src={avatarUrl}
                        alt={displayFullName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                        onError={() => setAvatarLoadError(true)}
                      />
                    ) : (
                      displayFullName.slice(0, 1)
                    )}
                  </div>
                  <button
                    type="button"
                    className="profile-avatar-camera"
                    title={lang === 'en' ? 'Change profile picture' : 'تغيير الصورة الشخصية'}
                    onClick={() => fileInputRef.current?.click()}
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera size={13} />
                    {avatarFile
                      ? avatarFile.name
                      : lang === 'en'
                        ? 'Upload New Photo'
                        : 'رفع صورة جديدة'}
                  </button>
                </div>
              </div>

              {/* Fields Grid */}
              <div className="settings-fields-grid">
                {/* Row 1, Right: Full Name */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">
                      {lang === 'en' ? 'Full Name *' : 'الاسم الكامل *'}
                    </span>
                    <User size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                {/* Row 1, Left: Property / Organization Name */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">
                      {lang === 'en' ? 'Facility / Property Name' : 'اسم المنشأة / العقار'}
                    </span>
                    <Building2 size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                {/* Row 2, Right: Job Title */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">
                      {lang === 'en' ? 'Job Title' : 'المسمى الوظيفي'}
                    </span>
                    <Briefcase size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="text"
                    className="settings-field-input"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                {/* Row 2, Left: Email */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">
                      {lang === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}
                    </span>
                    <Mail size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="email"
                    className="settings-field-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Row 3, Right: Phone Number */}
                <div className="settings-field-group">
                  <label className="settings-field-label">
                    <span className="field-label-text">
                      {lang === 'en' ? 'Phone Number *' : 'رقم الجوال *'}
                    </span>
                    <Phone size={14} className="field-label-icon" />
                  </label>
                  <input
                    type="tel"
                    className="settings-field-input"
                    style={{ direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                  <h2>
                    {lang === 'en' ? 'Notifications & Alerts' : 'الإشعارات والتنبيهات'}
                  </h2>
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
                    <strong>
                      {lang === 'en' ? 'Email Notifications' : 'إشعارات البريد الإلكتروني'}
                    </strong>
                    <small>
                      {lang === 'en'
                        ? 'Receive booking confirmations, new invoices, and daily operation summaries.'
                        : 'استلام تأكيدات الحجوزات، الفواتير الجديدة، وتقارير التشغيل اليومية.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.email ? 'on' : ''}`}
                    onClick={() => handleToggleNotification('email')}
                    aria-label={
                      lang === 'en'
                        ? 'Toggle email notifications'
                        : 'تفعيل إشعارات البريد الإلكتروني'
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>
                      {lang === 'en' ? 'SMS Text Messages' : 'رسائل الجوال القصيرة (SMS)'}
                    </strong>
                    <small>
                      {lang === 'en'
                        ? 'Instant alerts when urgent service requests arrive or unusual logins occur.'
                        : 'تنبيهات فورية عند وصول طلب خدمة عاجل أو تسجيل دخول غير معتاد.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.sms ? 'on' : ''}`}
                    onClick={() => handleToggleNotification('sms')}
                    aria-label={
                      lang === 'en' ? 'Toggle SMS notifications' : 'تفعيل الرسائل القصيرة'
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>
                      {lang === 'en' ? 'In-Platform Notifications' : 'إشعارات داخل المنصة'}
                    </strong>
                    <small>
                      {lang === 'en'
                        ? 'Live alerts through the top bell icon while navigating the dashboard.'
                        : 'إشعارات حية عبر الجرس العلوي أثناء استخدامك للمنصة.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.inApp ? 'on' : ''}`}
                    onClick={() => handleToggleNotification('inApp')}
                    aria-label={
                      lang === 'en'
                        ? 'Toggle in-platform notifications'
                        : 'تفعيل إشعارات المنصة'
                    }
                  >
                    <span />
                  </button>
                </div>

                <div className="settings-toggle-item">
                  <div className="toggle-item-info">
                    <strong>
                      {lang === 'en'
                        ? 'Marketing & Special Offers'
                        : 'الرسائل التسويقية والعروض'}
                    </strong>
                    <small>
                      {lang === 'en'
                        ? 'Receive updates on new features, product announcements, and unit performance tips.'
                        : 'استلام تحديثات الميزات الجديدة والنصائح لتحسين أداء الوحدات.'}
                    </small>
                  </div>
                  <button
                    type="button"
                    className={`custom-switch-btn ${toggles.marketing ? 'on' : ''}`}
                    onClick={() => handleToggleNotification('marketing')}
                    aria-label={
                      lang === 'en'
                        ? 'Toggle marketing messages'
                        : 'تفعيل الرسائل التسويقية'
                    }
                  >
                    <span />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY */}
          {activeTab === 'security' && (
            <form onSubmit={handleSave} style={{ display: 'contents' }}>
              <div className="settings-main-header">
                <div>
                  <h2>
                    {lang === 'en' ? 'Security & Passwords' : 'الأمان وكلمة المرور'}
                  </h2>
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
                  <span>
                    {lang === 'en'
                      ? 'Password Security Guidelines'
                      : 'إرشادات أمان كلمة المرور'}
                  </span>
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
                      <span className="field-label-text">
                        {lang === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}
                      </span>
                      <Lock size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        className="password-input"
                        placeholder={
                          lang === 'en'
                            ? 'Enter current password'
                            : 'أدخل كلمة المرور الحالية'
                        }
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowCurrent(!showCurrent)}
                        title={
                          showCurrent
                            ? lang === 'en'
                              ? 'Hide'
                              : 'إخفاء'
                            : lang === 'en'
                              ? 'Show'
                              : 'عرض'
                        }
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
                      <span className="field-label-text">
                        {lang === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
                      </span>
                      <KeyRound size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showNew ? 'text' : 'password'}
                        className="password-input"
                        placeholder={
                          lang === 'en'
                            ? 'Strong new password'
                            : 'كلمة مرور جديدة قوية'
                        }
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowNew(!showNew)}
                        title={
                          showNew
                            ? lang === 'en'
                              ? 'Hide'
                              : 'إخفاء'
                            : lang === 'en'
                              ? 'Show'
                              : 'عرض'
                        }
                      >
                        {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Left: Confirm New Password */}
                  <div className="settings-field-group">
                    <label className="settings-field-label">
                      <span className="field-label-text">
                        {lang === 'en'
                          ? 'Confirm New Password'
                          : 'تأكيد كلمة المرور الجديدة'}
                      </span>
                      <KeyRound size={14} className="field-label-icon" />
                    </label>
                    <div className="password-input-wrap">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        className="password-input"
                        placeholder={
                          lang === 'en'
                            ? 'Re-enter new password'
                            : 'أعد كتابة كلمة المرور الجديدة'
                        }
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        className="password-eye-btn"
                        onClick={() => setShowConfirm(!showConfirm)}
                        title={
                          showConfirm
                            ? lang === 'en'
                              ? 'Hide'
                              : 'إخفاء'
                            : lang === 'en'
                              ? 'Show'
                              : 'عرض'
                        }
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