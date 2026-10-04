import { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Loading & Skeletons
import GlobalLoadingBar from "./components/loading/GlobalLoadingBar";
import RouteSkeletonResolver from "./components/skeletons/RouteSkeletonResolver";
import DashboardSkeleton from "./components/skeletons/DashboardSkeleton";
import PartnerDashboardSkeleton from "./components/skeletons/PartnerDashboardSkeleton";

// Layouts
import ClientLayout from "./components/layout/ClientLayout";
import PartnerLayout from "./components/layout/PartnerLayout";
import AdminLayout from "./components/layout/AdminLayout";

// Pages\n
const Home = lazy(() => import("./pages/client/Home"));
const Explore = lazy(() => import("./pages/client/Explore"));
const SchemeDetailView = lazy(() => import("./pages/client/SchemeDetailView"));
const Login = lazy(() => import("./pages/client/Login"));
const Dashboard = lazy(() => import("./pages/client/Dashboard"));
const ProfileSetup = lazy(() => import("./pages/client/ProfileSetup"));
const GoalPlanner = lazy(() => import("./pages/client/GoalPlanner"));
const KYC = lazy(() => import("./pages/client/KYC"));
const SIPCalculator = lazy(() => import("./pages/calculators/SIPCalculator"));
const CalculatorsDashboard = lazy(() => import("./pages/calculators/CalculatorsDashboard"));
const VerifyPhone = lazy(() => import("./pages/client/VerifyPhone"));
const AboutUs = lazy(() => import("./pages/client/AboutUs"));
const Contact = lazy(() => import("./pages/client/Contact"));

const WhatIsMutualFund = lazy(() => import("./pages/learn/WhatIsMutualFund"));
const SipVsLumpsum = lazy(() => import("./pages/learn/SipVsLumpsum"));
const TaxationBasics = lazy(() => import("./pages/learn/TaxationBasics"));

const PartnerLogin = lazy(() => import("./pages/partner/Login"));
const PartnerDashboard = lazy(() => import("./pages/partner/Dashboard"));
const PartnerClients = lazy(() => import("./pages/partner/Clients"));
const PartnerClientDetail = lazy(() => import("./pages/partner/ClientDetail"));
const PartnerProducts = lazy(() => import("./pages/partner/Products"));
const PartnerTransactions = lazy(() => import("./pages/partner/Transactions"));
const PartnerPortfolio = lazy(() => import("./pages/partner/Portfolio"));
const PartnerReports = lazy(() => import("./pages/partner/Reports"));
const PartnerEmailLogs = lazy(() => import("./pages/partner/EmailLogs"));
const PartnerResearch = lazy(() => import("./pages/partner/Research"));
const PartnerAnalytics = lazy(() => import("./pages/partner/Analytics"));
const PartnerTasks = lazy(() => import("./pages/partner/Tasks"));
const PartnerSettings = lazy(() => import("./pages/partner/Settings"));

const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));















// Learn Pages





















interface ProtectedRouteProps {
  user: User | null;
  loading: boolean;
  children: React.ReactNode;
}

function ProtectedClientRoute({ user, loading, children }: ProtectedRouteProps) {
  if (loading) {
    return <ClientLayout><DashboardSkeleton /></ClientLayout>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isGoogleUser = user.providerData?.some(p => p.providerId === 'google.com');
  const hasLocalVerifiedPhone = typeof window !== 'undefined' && Boolean(localStorage.getItem(`phone_verified_${user.uid}`));
  if (isGoogleUser && !user.phoneNumber && !hasLocalVerifiedPhone) {
    return <Navigate to="/verify-phone" replace />;
  }

  return <ClientLayout>{children}</ClientLayout>;
}

function ProtectedSetupRoute({ user, loading, children }: ProtectedRouteProps) {
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex justify-center items-center">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Profile Setup...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function ProtectedPartnerRoute({ user, loading, children }: ProtectedRouteProps) {
  if (loading) {
    return <PartnerLayout><PartnerDashboardSkeleton /></PartnerLayout>;
  }

  const partnerUser = typeof window !== 'undefined' && localStorage.getItem('partnerUser');
  if (!user && !partnerUser) {
    return <Navigate to="/partner/login" replace />;
  }

  return <PartnerLayout>{children}</PartnerLayout>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStoredAuth = () => {
      const storedPartnerUser = localStorage.getItem('partnerUser');
      const storedMockUser = localStorage.getItem('mockUser');

      if (storedPartnerUser) {
        try {
          const parsed = JSON.parse(storedPartnerUser);
          const pUser = {
            uid: parsed.uid || 'partner-admin-uid',
            email: parsed.email || 'admin@velocitywealth.in',
            displayName: parsed.displayName || 'PARTHASARATHY Radhakrishnan',
            getIdToken: async () => localStorage.getItem('partnerToken') || 'partner-admin-token',
            providerData: []
          } as any;
          setUser(pUser);
          setLoading(false);
          return pUser;
        } catch (e) {
          console.error(e);
        }
      }

      if (storedMockUser === 'true') {
        const mUser = {
          uid: 'mock-user-123',
          email: 'client@velocitywealth.in',
          getIdToken: async () => 'mock-token',
          providerData: []
        } as any;
        setUser(mUser);
        setLoading(false);
        return mUser;
      }

      return null;
    };

    checkStoredAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      let activeUser: any = currentUser;

      if (!currentUser) {
        activeUser = checkStoredAuth();
      }

      setUser(activeUser);
      
      // If user logged in, sync to backend
      if (activeUser) {
        try {
          const token = await activeUser.getIdToken();
          await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (e) {
          console.error('Failed to sync user', e);
        }
      }
      
      setLoading(false);
    });

    const handleAuthEvent = () => {
      checkStoredAuth();
    };

    window.addEventListener('auth-state-changed', handleAuthEvent);
    window.addEventListener('storage', handleAuthEvent);

    return () => {
      unsubscribe();
      window.removeEventListener('auth-state-changed', handleAuthEvent);
      window.removeEventListener('storage', handleAuthEvent);
    };
  }, []);

  if (loading) {
    return (
      <BrowserRouter>
        <GlobalLoadingBar />
        <RouteSkeletonResolver />
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <GlobalLoadingBar />
      <Suspense fallback={<RouteSkeletonResolver />}>
        <Routes>
        {/* Client Routes */}
        <Route path="/" element={<ClientLayout><Home /></ClientLayout>} />
        <Route path="/explore" element={<ClientLayout><Explore /></ClientLayout>} />
        <Route path="/funds/:schemeCode" element={<ClientLayout><SchemeDetailView /></ClientLayout>} />
        <Route path="/calculators/sip" element={<ClientLayout><CalculatorsDashboard /></ClientLayout>} />
        <Route path="/calculators" element={<ClientLayout><CalculatorsDashboard /></ClientLayout>} />
        <Route path="/calculators/:type" element={<ClientLayout><CalculatorsDashboard /></ClientLayout>} />
        <Route path="/login" element={<ClientLayout><Login /></ClientLayout>} />
        <Route path="/about" element={<ClientLayout><AboutUs /></ClientLayout>} />
        <Route path="/contact" element={<ClientLayout><Contact /></ClientLayout>} />
        
        {/* Learn Routes */}
        <Route path="/learn/what-is-mutual-fund" element={<ClientLayout><WhatIsMutualFund /></ClientLayout>} />
        <Route path="/learn/sip-vs-lumpsum" element={<ClientLayout><SipVsLumpsum /></ClientLayout>} />
        <Route path="/learn/taxation" element={<ClientLayout><TaxationBasics /></ClientLayout>} />
        
        <Route path="/verify-phone" element={<VerifyPhone />} />

        <Route path="/profile-setup" element={
          <ProtectedSetupRoute user={user} loading={loading}><ProfileSetup /></ProtectedSetupRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedClientRoute user={user} loading={loading}><Dashboard /></ProtectedClientRoute>
        } />
        <Route path="/goals" element={
          <ProtectedClientRoute user={user} loading={loading}><GoalPlanner /></ProtectedClientRoute>
        } />
        <Route path="/kyc" element={
          <ProtectedClientRoute user={user} loading={loading}><KYC /></ProtectedClientRoute>
        } />

        {/* Partner Routes */}
        <Route path="/partner/login" element={<PartnerLogin />} />
        <Route path="/partner/dashboard" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerDashboard /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/clients" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerClients /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/client/:id" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerClientDetail /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/products" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerProducts /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/transactions" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerTransactions /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/portfolio" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerPortfolio /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/reports" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerReports /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/email-logs" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerEmailLogs /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/emails" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerEmailLogs /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/research" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerResearch /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/analytics" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerAnalytics /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/tasks" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerTasks /></ProtectedPartnerRoute>
        } />
        <Route path="/partner/settings" element={
          <ProtectedPartnerRoute user={user} loading={loading}><PartnerSettings /></ProtectedPartnerRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          user ? <AdminLayout><AdminDashboard /></AdminLayout> : <Navigate to="/admin/login" />
        } />
            </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
