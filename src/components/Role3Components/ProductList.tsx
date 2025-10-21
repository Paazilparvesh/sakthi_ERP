import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product, QAItem, ApiResponse } from "@/types/role3.types.ts";


interface ProductListProps {
  products: Product[];
  onView: (product: Product) => void;
}

// Status badge helper
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Complete: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    InProgress: "bg-blue-100 text-blue-800",
  };
  const colorClass = colors[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-3 py-1 inline-flex items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}>
      {status}
    </span>
  );
};

// ProductList Component
const ProductList: React.FC<ProductListProps> = ({ products, onView }) => (
  <Card className="shadow-lg rounded-xl border border-slate-200">
    <CardContent className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Product List</h2>

      {/* Desktop / Tablet Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-left uppercase tracking-wide text-slate-600">Serial Number</th>
              <th className="px-4 py-3 text-left uppercase tracking-wide text-slate-600">Company Name</th>
              <th className="px-4 py-3 text-left uppercase tracking-wide text-slate-600">Customer Name</th>
              <th className="px-4 py-3 text-left uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-3 text-left uppercase tracking-wide text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[...products].reverse().map((p, idx) => (
              <tr
                key={idx}
                className={`transition hover:bg-slate-50 cursor-pointer ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
              >
                <td className="px-4 py-3 font-mono text-slate-800">{p.serial_number}</td>
                <td className="px-4 py-3 font-medium text-slate-700">{p.Company_name}</td>

                <td className="px-4 py-3 text-slate-600">{p.Customer_name || "-"}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => onView(p)}
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / Small Screens: Stacked Cards */}
      <div className="md:hidden space-y-4">
        {[...products].reverse().map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-xl p-4 flex flex-col space-y-2"
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">ID:</span>
              <span className="text-slate-600">{p.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Name:</span>
              <span className="text-slate-600">{p.Company_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Serial No:</span>
              <span className="font-mono text-slate-800">{p.serial_number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Customer:</span>
              <span className="text-slate-600">{p.Customer_name || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Status:</span>
              <StatusBadge status={p.status} />
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
              onClick={() => onView(p)}
            >
              View
            </Button>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center py-6 text-slate-500">No products found.</p>
        )}
      </div>
    </CardContent>
  </Card>

);

export default ProductList;
