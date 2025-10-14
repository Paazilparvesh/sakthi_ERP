import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MaterialInwardInspectionForm from '@/components/MaterialInwardInspectionForm';

interface DataRow {
  id: number;
  name: string;
  status: string;
  date: string;
  amount: string;
}

const dummyData: DataRow[] = [
  { id: 1, name: 'Project Alpha', status: 'Active', date: '2024-01-15', amount: '₹50,000' },
  { id: 2, name: 'Project Beta', status: 'Pending', date: '2024-01-20', amount: '₹75,000' },
  { id: 3, name: 'Project Gamma', status: 'Completed', date: '2024-01-10', amount: '₹120,000' },
  { id: 4, name: 'Project Delta', status: 'Active', date: '2024-01-25', amount: '₹95,000' },
  { id: 5, name: 'Project Epsilon', status: 'On Hold', date: '2024-01-18', amount: '₹60,000' },
];

const Role1Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-primary text-primary-foreground';
      case 'Completed':
        return 'bg-green-500 text-white';
      case 'Pending':
        return 'bg-yellow-500 text-white';
      case 'On Hold':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Role 1 Dashboard</h2>
        <p className="text-muted-foreground">Managing project operations and tracking</p>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="projects">Active Projects</TabsTrigger>
          <TabsTrigger value="inspection">Material Inspection</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-table-header text-white">
                      <th className="px-4 py-3 text-left font-semibold">ID</th>
                      <th className="px-4 py-3 text-left font-semibold">Project Name</th>
                      <th className="px-4 py-3 text-left font-semibold">Status</th>
                      <th className="px-4 py-3 text-left font-semibold">Date</th>
                      <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyData.map((row) => (
                      <tr
                        key={row.id}
                        className="border-b transition-colors hover:bg-table-row-hover"
                      >
                        <td className="px-4 py-3 font-medium">{row.id}</td>
                        <td className="px-4 py-3">{row.name}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(row.status)}>{row.status}</Badge>
                        </td>
                        <td className="px-4 py-3">{row.date}</td>
                        <td className="px-4 py-3 font-semibold">{row.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inspection" className="mt-6">
          <MaterialInwardInspectionForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Role1Dashboard;
