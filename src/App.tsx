import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Spinner = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', background: '#f0f7ff',
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      border: '3px solid #dbeafe', borderTopColor: '#2563eb',
      animation: 'spin 0.7s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

// Blocks unauthenticated users — sends them to /auth
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

// Blocks already-logged-in users from seeing /auth — sends them to /dashboard
// Landing page "/" does NOT use this — it is always public
function GuestOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const AppRoutes = () => (
  <Routes>
    {/*
      "/" — Landing page.
      NO auth wrapper here. Always visible to everyone.
      Logged-in users can still see it; they just click a button to go to dashboard.
    */}
    <Route path="/" element={<LandingPage />} />

    {/*
      "/auth" — Login / signup.
      GuestOnlyRoute: if user is already logged in, skip this and go to /dashboard.
    */}
    <Route
      path="/auth"
      element={
        <GuestOnlyRoute>
          <AuthPage />
        </GuestOnlyRoute>
      }
    />

    {/*
      "/dashboard" — The main app.
      ProtectedRoute: if user is NOT logged in, send to /auth.
    */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Index />
        </ProtectedRoute>
      }
    />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;