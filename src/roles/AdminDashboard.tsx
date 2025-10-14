import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, TrendingUp, DollarSign } from 'lucide-react';

interface SystemMetric {
  id: number;
  module: string;
  status: string;
  uptime: string;
  lastUpdate: string;
  users: number;
}

const dummyData: SystemMetric[] = [
  { id: 1, module: 'Project Management', status: 'Active', uptime: '99.9%', lastUpdate: '2024-01-25 10:30', users: 25 },
  { id: 2, module: 'Inventory System', status: 'Active', uptime: '99.5%', lastUpdate: '2024-01-25 09:15', users: 18 },
  { id: 3, module: 'HR Management', status: 'Active', uptime: '100%', lastUpdate: '2024-01-25 08:45', users: 12 },
  { id: 4, module: 'Sales & Orders', status: 'Maintenance', uptime: '98.2%', lastUpdate: '2024-01-24 16:00', users: 32 },
  { id: 5, module: 'Finance Module', status: 'Active', uptime: '99.8%', lastUpdate: '2024-01-25 11:00', users: 8 },
];

const AdminDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'Maintenance':
        return 'bg-yellow-500 text-white';
      case 'Down':
        return 'bg-red-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
        <p className="text-muted-foreground">System overview and administration</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95</div>
            <p className="text-xs text-muted-foreground">+5 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.5%</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹8.5M</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Modules Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-table-header text-white">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Module</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Uptime</th>
                  <th className="px-4 py-3 text-left font-semibold">Last Update</th>
                  <th className="px-4 py-3 text-left font-semibold">Active Users</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((metric) => (
                  <tr
                    key={metric.id}
                    className="border-b transition-colors hover:bg-table-row-hover"
                  >
                    <td className="px-4 py-3 font-medium">{metric.id}</td>
                    <td className="px-4 py-3">{metric.module}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold">{metric.uptime}</td>
                    <td className="px-4 py-3">{metric.lastUpdate}</td>
                    <td className="px-4 py-3 font-medium">{metric.users}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
