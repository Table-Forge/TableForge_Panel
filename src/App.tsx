import { AdminLayout } from "@/src/components/layout/admin-layout";
import { GlobalModal } from "@/src/components/modals/global-modal";
import { ToastContainer } from "@/src/components/toast/toast-container";
import { AuthProvider } from "@/src/context/auth";
import { useAuth } from "@/src/context/use-auth";
import { CampaignsPage } from "@/src/pages/campaigns";
import { DashboardPage } from "@/src/pages/dashboard";
import ImagesPage from "@/src/pages/images";
import { LoginPage } from "@/src/pages/login";
import { LogDetailsPage } from "@/src/pages/logs/details";
import { LogsPage } from "@/src/pages/logs";
import { RecoverPasswordPage } from "@/src/pages/recover-password";
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

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="images" element={<ImagesPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="logs/:id" element={<LogDetailsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <GlobalModal />
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
