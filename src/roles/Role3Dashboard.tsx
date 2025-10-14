import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Employee {
  id: number;
  name: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
}

const dummyData: Employee[] = [
  { id: 1, name: 'Rajesh Kumar', department: 'Engineering', position: 'Senior Developer', status: 'Active', joinDate: '2022-03-15' },
  { id: 2, name: 'Priya Sharma', department: 'Marketing', position: 'Marketing Manager', status: 'Active', joinDate: '2021-07-20' },
  { id: 3, name: 'Arun Patel', department: 'Sales', position: 'Sales Executive', status: 'On Leave', joinDate: '2023-01-10' },
  { id: 4, name: 'Sneha Reddy', department: 'HR', position: 'HR Specialist', status: 'Active', joinDate: '2022-11-05' },
  { id: 5, name: 'Vikram Singh', department: 'Finance', position: 'Financial Analyst', status: 'Active', joinDate: '2023-02-28' },
];

const Role3Dashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500 text-white';
      case 'On Leave':
        return 'bg-yellow-500 text-white';
      case 'Inactive':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Role 3 Dashboard</h2>
        <p className="text-muted-foreground">Human resources and employee management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-table-header text-white">
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Department</th>
                  <th className="px-4 py-3 text-left font-semibold">Position</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Join Date</th>
                </tr>
              </thead>
              <tbody>
                {dummyData.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b transition-colors hover:bg-table-row-hover"
                  >
                    <td className="px-4 py-3 font-medium">{employee.id}</td>
                    <td className="px-4 py-3">{employee.name}</td>
                    <td className="px-4 py-3">{employee.department}</td>
                    <td className="px-4 py-3">{employee.position}</td>
                    <td className="px-4 py-3">
                      <Badge className={getStatusColor(employee.status)}>{employee.status}</Badge>
                    </td>
                    <td className="px-4 py-3">{employee.joinDate}</td>
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

export default Role3Dashboard;
