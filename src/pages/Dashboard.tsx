import { useAuth } from '@/context/AuthContext';
import BaseLayout from '@/layouts/BaseLayout';
import Role1Dashboard from '@/roles/Role1Dashboard';
import Role2Dashboard from '@/roles/Role2Dashboard';
import Role3Dashboard from '@/roles/Role3Dashboard';
import Role4Dashboard from '@/roles/Role4Dashboard';
import AdminDashboard from '@/roles/AdminDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  const renderDashboard = () => {
    switch (user?.role) {
      case 'role1':
        return <Role1Dashboard />;
      case 'role2':
        return <Role2Dashboard />;
      case 'role3':
        return <Role3Dashboard />;
      case 'role4':
        return <Role4Dashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <BaseLayout>
      {renderDashboard()}
    </BaseLayout>
  );
};

export default Dashboard;
