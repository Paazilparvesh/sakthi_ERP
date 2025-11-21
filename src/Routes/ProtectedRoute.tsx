import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: JSX.Element; roles?: string[] }> = ({
  children,
  roles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center text-muted-foreground'>
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace />;
  }

  if (user.isAdmin) {
    return children;
  }
  // Check role access
  if (roles && !roles.some((r) => user?.roles.includes(r as any))) {
    return <Navigate to='/unauthorized' replace />;
  }

  return children;
};

export default ProtectedRoute;
