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
  outward_status: string;
}

interface ProductListProps {
  products: Product[];
  onView: (p: Product) => void;
  getStatusColor: (status: string) => string;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onView,
  getStatusColor,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Outward Products</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-slate-100 text-left">
              <th className="px-4 py-2 border">Serial No</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {[...products].map((p) => {

              return (
                <tr key={p.product_id} className="border hover:bg-slate-50">
                  <td className="px-4 py-2 border">{p.serial_number}</td>
                  <td className="px-4 py-2 border">{p.Company_name}</td>
                  <td className="px-4 py-2 border">{p.Customer_name}</td>
                  <td className="px-4 py-2 border">{p.date}</td>
                  <td className="px-4 py-2 border">
                    <Badge className={getStatusColor(p.outward_status)}>
                      {p.outward_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 border">
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
