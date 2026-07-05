import { AdminLayout } from "@/src/components/layout/admin-layout";
import { GlobalModal } from "@/src/components/modals/global-modal";
import { EnvFlag } from "@/src/components/env-flag/env-flag";
import { ToastContainer } from "@/src/components/toast/toast-container";
import { AuthProvider } from "@/src/context/auth";
import { useAuth } from "@/src/context/use-auth";
import { CampaignDetailsPage } from "@/src/pages/campaigns/details";
import { CampaignsPage } from "@/src/pages/campaigns";
import { ClassesPage } from "@/src/pages/classes";
import { DashboardPage } from "@/src/pages/dashboard";
import { GameSystemDetailsPage } from "@/src/pages/game-systems/details";
import { GameSystemsPage } from "@/src/pages/game-systems";
import { BannersPage } from "@/src/pages/banners";
import ImagesPage from "@/src/pages/images";
import { ImageDetailsPage } from "@/src/pages/images/details";
import { LoginPage } from "@/src/pages/login";
import { LogDetailsPage } from "@/src/pages/logs/details";
import { LogsPage } from "@/src/pages/logs";
import { RacesPage } from "@/src/pages/races";
import { RecoverPasswordPage } from "@/src/pages/recover-password";
import VerifyEmailPage from "@/src/pages/verify-email";
import { UserDetailsPage } from "@/src/pages/users/details";
import UsersPage from "@/src/pages/users";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/recover-password" element={<RecoverPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="campaigns/:id" element={<CampaignDetailsPage />} />
              <Route path="gamesystems" element={<GameSystemsPage />} />
              <Route path="gamesystems/:id" element={<GameSystemDetailsPage />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="classes" element={<ClassesPage />} />
              <Route path="races" element={<RacesPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailsPage />} />
              <Route path="images" element={<ImagesPage />} />
              <Route path="images/:id" element={<ImageDetailsPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="logs/:id" element={<LogDetailsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <GlobalModal />
        <EnvFlag />
        <ToastContainer />
        <div id="root-portal" />
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-4 text-white">
        <div className="rounded-2xl border border-white/15 bg-primary/70 px-6 py-4 text-sm tracking-wide">
          Carregando sessão...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default App;
