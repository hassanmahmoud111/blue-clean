import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell';
import PrototypeMode from './components/PrototypeMode';
import { LoadingPage } from './components/ui';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const PublicPage = lazy(() => import('./pages/PublicPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UnitsPage = lazy(() => import('./pages/UnitsPage'));
const UnitDetailsPage = lazy(() => import('./pages/UnitDetailsPage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const BookingDetailsPage = lazy(() => import('./pages/BookingDetailsPage'));
const SupportPage = lazy(() => import('./pages/SupportPage'));
const OperationsPage = lazy(() => import('./pages/OperationsPage'));
const OperationDetailsPage = lazy(() => import('./pages/OperationDetailsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const BillingPage = lazy(() => import('./pages/BillingPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const IntegrationsPage = lazy(() => import('./pages/IntegrationsPage'));
const AccountSetupPage = lazy(() => import('./pages/AccountSetupPage'));
const AddUnitPage = lazy(() => import('./pages/AddUnitPage'));
const AddBookingPage = lazy(() => import('./pages/AddBookingPage'));
const CreateOperationPage = lazy(() => import('./pages/CreateOperationPage'));
const CreateRecordPage = lazy(() => import('./pages/CreateRecordPage'));
const CreateTicketPage = lazy(() => import('./pages/CreateTicketPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));

export default function App() {
  return (
    <><PrototypeMode/><div className="app-intro" aria-hidden="true"><span><b>BluClean</b><small>إدارة أهدأ، تشغيل أذكى</small></span></div><Suspense fallback={<div className="mx-auto max-w-7xl p-6"><LoadingPage /></div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<PublicPage kind="features" />} />
        <Route path="/how-it-works" element={<PublicPage kind="how" />} />
        <Route path="/pricing" element={<PublicPage kind="pricing" />} />
        <Route path="/about" element={<PublicPage kind="about" />} />
        <Route path="/contact" element={<PublicPage kind="contact" />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/app" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route path="units/:unitId" element={<UnitDetailsPage />} />
          <Route path="units/:unitId/edit" element={<AddUnitPage />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="bookings/:bookingId" element={<BookingDetailsPage />} />
          <Route path="bookings/:bookingId/edit" element={<AddBookingPage />} />
          <Route path="messages" element={<Navigate to="/app/support" replace />} />
          <Route path="operations" element={<Navigate to="/app/operations/cleaning" replace />} />
          <Route path="operations/cleaning" element={<OperationsPage kind="cleaning" />} />
          <Route path="operations/maintenance" element={<OperationsPage kind="maintenance" />} />
          <Route path="operations/services" element={<OperationsPage kind="service" />} />
          <Route path="operations/cleaning/:operationId" element={<OperationDetailsPage />} />
          <Route path="operations/cleaning/:operationId/edit" element={<CreateOperationPage kind="cleaning" />} />
          <Route path="operations/maintenance/:operationId" element={<OperationDetailsPage />} />
          <Route path="operations/maintenance/:operationId/edit" element={<CreateOperationPage kind="maintenance" />} />
          <Route path="operations/services/:operationId" element={<OperationDetailsPage />} />
          <Route path="operations/services/:operationId/edit" element={<CreateOperationPage kind="service" />} />
          <Route path="operations/:operationId" element={<OperationDetailsPage />} />
          <Route path="operations/:operationId/edit" element={<CreateOperationPage kind="cleaning" />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="support/new" element={<CreateTicketPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/integrations" element={<IntegrationsPage />} />
          <Route path="new/unit" element={<AddUnitPage />} />
          <Route path="new/booking" element={<AddBookingPage />} />
          <Route path="new/cleaning" element={<CreateOperationPage kind="cleaning" />} />
          <Route path="new/maintenance" element={<CreateOperationPage kind="maintenance" />} />
          <Route path="new/service" element={<CreateOperationPage kind="service" />} />
          <Route path="new/ticket" element={<CreateTicketPage />} />
          <Route path="new/user" element={<AccountSetupPage kind="user" />} />
          <Route path="new/payment" element={<AccountSetupPage kind="payment" />} />
          <Route path="new/:resource" element={<CreateRecordPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense></>
  );
}
