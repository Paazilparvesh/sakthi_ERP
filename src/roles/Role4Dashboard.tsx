import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Order {
  id: number;
  customer: string;
  orderType: string;
  amount: string;
  status: string;
  date: string;
}

const dummyData: Order[] = [
  { id: 1001, customer: 'ABC Industries', orderType: 'Bulk Order', amount: '₹2,50,000', status: 'Delivered', date: '2024-01-12' },
  { id: 1002, customer: 'XYZ Corp', orderType: 'Regular', amount: '₹85,000', status: 'In Transit', date: '2024-01-18' },
  { id: 1003, customer: 'Tech Solutions', orderType: 'Priority', amount: '₹1,20,000', status: 'Processing', date: '2024-01-20' },
  { id: 1004, customer: 'Global Enterprises', orderType: 'Bulk Order', amount: '₹3,00,000', status: 'Pending', date: '2024-01-22' },
  { id: 1005, customer: 'Smart Systems', orderType: 'Regular', amount: '₹65,000', status: 'Delivered', date: '2024-01-15' },
];

const Role4Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-500 text-white';
      case 'In Transit':
        return 'bg-primary text-primary-foreground';
      case 'Processing':
        return 'bg-yellow-500 text-white';
      case 'Pending':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Role 4 Dashboard</h2>
        <p className="text-muted-foreground">Sales and order management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-table-header text-white">
                  <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b transition-colors hover:bg-table-row-hover"
                  >
                    <td className="px-4 py-3 font-medium">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{order.orderType}</td>
                    <td className="px-4 py-3 font-semibold">{order.amount}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-4 py-3">{order.date}</td>
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

export default Role4Dashboard;
