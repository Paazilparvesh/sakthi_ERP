import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// -----------------------------
// 📦 Product List Table
// -----------------------------
interface Product {
  product_id: number;
  Company_name: string;
  serial_number: string;
  date: string;
  Customer_name: string;
  Customer_No: string;
  Customer_date: string;
  mobile: string;
  status: string;
}

interface ProductListProps {
  products: Product[];
  onView: (p: Product) => void;
  getStatusColor: (status: string) => string; // ✅ received from parent
  frontendStatusMap?: { [key: number]: string };
  onComplete?: (productId: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onView,
  getStatusColor, // ✅ now comes from parent
  frontendStatusMap = {},
  onComplete,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Products</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-100 text-left">
              <th className="px-4 py-2">Serial No</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          {/* <tbody>
            {/* ✅ Reverse order so latest product appears on top 
            {[...products].map((p) => (
              <tr key={p.product_id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-2">{p.serial_number}</td>
                <td className="px-4 py-2">{p.Company_name}</td>
                <td className="px-4 py-2">{p.Customer_name}</td>
                <td className="px-4 py-2">{p.date}</td>
                <td className="px-4 py-2">
                  <Badge className={getStatusColor(p.status)}>Pending</Badge>
                </td>
                <td className="px-4 py-2">
                  <Button size="sm" onClick={() => onView(p)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody> */}
          <tbody>
            {[...products].map((p) => {
              // ✅ Use frontend status if exists, else backend
              const displayStatus = frontendStatusMap[p.product_id] || "pending";
              return (
                <tr key={p.product_id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-2">{p.serial_number}</td>
                  <td className="px-4 py-2">{p.Company_name}</td>
                  <td className="px-4 py-2">{p.Customer_name}</td>
                  <td className="px-4 py-2">{p.date}</td>
                  <td className="px-4 py-2">
                    <Badge className={getStatusColor(displayStatus)}>
                      {displayStatus === "pending" ? "Pending" : "Completed"}
                    </Badge>
                  </td>
                  <td className="px-4 py-2">
                    <Button size="sm" onClick={() => onView(p)}>
                      View
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);
