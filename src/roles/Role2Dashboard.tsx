import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  status: string;
  location: string;
}

const dummyData: InventoryItem[] = [
  { id: 1, name: 'Laptop Dell XPS', category: 'Electronics', quantity: 45, status: 'In Stock', location: 'Warehouse A' },
  { id: 2, name: 'Office Chair Pro', category: 'Furniture', quantity: 12, status: 'Low Stock', location: 'Warehouse B' },
  { id: 3, name: 'Printer HP LaserJet', category: 'Electronics', quantity: 28, status: 'In Stock', location: 'Warehouse A' },
  { id: 4, name: 'Desk Lamp LED', category: 'Accessories', quantity: 5, status: 'Critical', location: 'Warehouse C' },
  { id: 5, name: 'Whiteboard Marker', category: 'Stationery', quantity: 150, status: 'In Stock', location: 'Warehouse B' },
];

const Role2Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-500 text-white';
      case 'Low Stock':
        return 'bg-yellow-500 text-white';
      case 'Critical':
        return 'bg-red-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Role 2 Dashboard</h2>
        <p className="text-muted-foreground">Inventory management and stock control</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-table-header text-white">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Item Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Category</th>
                  <th className="px-4 py-3 text-left font-semibold">Quantity</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Location</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b transition-colors hover:bg-table-row-hover"
                  >
                    <td className="px-4 py-3 font-medium">{item.id}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-3">{item.location}</td>
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

export default Role2Dashboard;
