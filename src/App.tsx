import { AdminLayout } from "@/src/components/layout/admin-layout";
import { AuthProvider, useAuth } from "@/src/context/auth";
import { CampaignsPage } from "@/src/pages/campaigns-page";
import { DashboardPage } from "@/src/pages/dashboard-page";
import { LoginPage } from "@/src/pages/login-page";
import { UsersPage } from "@/src/pages/users-page";
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

          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="campaigns" element={<CampaignsPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
