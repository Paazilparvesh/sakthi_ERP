// UI Component
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

// Auth
import { AuthProvider } from './context/AuthContext';
// Protected Routes
import ProtectedRoute from './Routes/ProtectedRoute';
// Pages
import Login from './pages/Auth_Page/Login';
import Dashboard from './pages/Dashboard_Page/Dashboard';
import NotFound from './pages/Normal_Page/NotFound';
import InwardDashboard from './pages/Dashboard_Page/InwardDashboard';
// import OutwardDashboard from './pages/Dashboard_Page/OutWardDashboard';
import ProgramerDashboard from './pages/Dashboard_Page/ProgramerDashboard';
import AdminDashboard from './pages/Admin_Pages/AdminDashboard';
// import BaseLayout from './layouts/BaseLayout';
import Header from './layouts/Header';
import LoginRedirect from './Routes/LoginRedirect';
import QADashboard from './pages/Dashboard_Page/QADashBoard';
import AccountsDashboard from './pages/Dashboard_Page/AccountsDashBoard';


const queryClient = new QueryClient();

const Unauthorized = () => (
  <div className='h-screen flex items-center justify-center text-xl font-bold text-red-600'>
    Unauthorized — You do not have permission to access this page.
  </div>
);

const LayoutWithConditionalHeader = ({ children }) => {
  const location = useLocation();
  const hideHeader = location.pathname === '/login'; // Add more routes if needed

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* <Header /> */}
          <LayoutWithConditionalHeader>
            <Routes>
              <Route path='/' element={<Navigate to='/login' replace />} />
              {/* <Route path='/login' element={<Login />} /> */}
              <Route
                path='/login'
                element={
                  <LoginRedirect>
                    <Login />
                  </LoginRedirect>
                }
              />

              <Route
                path='/dashboard'
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='/inward_dashboard'
                element={
                  <ProtectedRoute roles={['inward']}>
                    <InwardDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/qa_dashboard'
                element={
                  <ProtectedRoute roles={['qa']}>
                    {/* <OutwardDashboard role='qa' /> */}
                    <QADashboard />
                  </ProtectedRoute>
                }
              />

              

              <Route
                path='/accounts_dashboard'
                element={
                  <ProtectedRoute roles={['accounts']}>
                    {/* <OutwardDashboard role='accounts' /> */}
                    <AccountsDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/programer_dashboard'
                element={
                  <ProtectedRoute roles={['programer']}>
                    <ProgramerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path='/admin_dashboard'
                element={
                  <ProtectedRoute roles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path='/unauthorized' element={<Unauthorized />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </LayoutWithConditionalHeader>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
