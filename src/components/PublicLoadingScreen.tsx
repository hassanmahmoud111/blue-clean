import { Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './public-loading.css';

interface PublicLoadingScreenProps {
  message?: string;
  submessage?: string;
}

export function PublicLoadingScreen({ message, submessage }: PublicLoadingScreenProps) {
  const { lang, isRTL } = useLanguage();

  const defaultMsg =
    message ||
    (lang === 'en'
      ? 'Loading data, please wait...'
      : 'جارٍ تحميل البيانات، يرجى الانتظار...');

  const defaultSub =
    submessage ||
    (lang === 'en'
      ? 'Connecting to BluClean servers'
      : 'نقوم بالاتصال بخوادم BluClean وتجهيز أحدث البيانات');

  return (
    <div
      className="public-loading-screen"
      dir={isRTL ? 'rtl' : 'ltr'}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="public-loading-card">
        <div className="public-loading-logo-wrap">
          <div className="public-loading-logo-ring" />
          <div className="public-loading-logo">
            <Home size={34} strokeWidth={2.4} />
          </div>
        </div>

        <div className="public-loading-brand">
          <h2>BluClean</h2>
          <p>Clean Stays. Better Hosting.</p>
        </div>

        <div className="public-loading-spinner-wrap">
          <div className="public-loading-spinner" />
          <p className="public-loading-text">{defaultMsg}</p>
        </div>

        <p className="public-loading-subtext">{defaultSub}</p>

        <div className="public-loading-bar">
          <div className="public-loading-bar-inner" />
        </div>
      </div>
    </div>
  );
}

export default PublicLoadingScreen;
