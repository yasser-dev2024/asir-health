import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../layouts/AdminLayout';
import { ClientLayout } from '../layouts/ClientLayout';
import { useAppStore } from '../store/appStore';

const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const JourneyPage = lazy(() => import('../pages/JourneyPage').then((m) => ({ default: m.JourneyPage })));
const PlanPage = lazy(() => import('../pages/PlanPage').then((m) => ({ default: m.PlanPage })));
const EventsPage = lazy(() => import('../pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const PassportPage = lazy(() => import('../pages/PassportPage').then((m) => ({ default: m.PassportPage })));
const DownloadsPage = lazy(() => import('../pages/DownloadsPage').then((m) => ({ default: m.DownloadsPage })));
const AssistantPage = lazy(() => import('../pages/AssistantPage').then((m) => ({ default: m.AssistantPage })));
const NearbyPage = lazy(() => import('../pages/NearbyPage').then((m) => ({ default: m.NearbyPage })));
const HealthHeroPage = lazy(() => import('../pages/HealthHeroPage').then((m) => ({ default: m.HealthHeroPage })));
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const QrLocationsAdminPage = lazy(() => import('../pages/admin/QrLocationsAdminPage').then((m) => ({ default: m.QrLocationsAdminPage })));

function HeroRoute() {
  const enabled = useAppStore((s) => s.featuresEnabled.healthHero);
  return enabled ? <HealthHeroPage /> : <Navigate replace to="/" />;
}

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route element={<ClientLayout />}>
          <Route element={<HomePage />} index />
          <Route element={<JourneyPage />} path="journey" />
          <Route element={<PlanPage />} path="plan" />
          <Route element={<EventsPage />} path="events" />
          <Route element={<PassportPage />} path="passport" />
          <Route element={<DownloadsPage />} path="downloads" />
          <Route element={<AssistantPage />} path="assistant" />
          <Route element={<NearbyPage />} path="nearby" />
          <Route element={<HeroRoute />} path="hero" />
        </Route>
        <Route element={<AdminLoginPage />} path="/admin/login" />
        <Route element={<AdminLayout />} path="/admin">
          <Route element={<AdminDashboardPage />} index />
          <Route element={<QrLocationsAdminPage />} path="qr-locations" />
        </Route>
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </Suspense>
  );
}
