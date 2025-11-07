import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/inward.type";

interface ProductListProps {
  product: ProductType[];
  onView: (p: ProductType) => void;
  getStatusColor: (status: string) => string;
}

export const OutwardList: React.FC<ProductListProps> = ({
  product,
  onView,
  getStatusColor,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Outward Products</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm sm:text-base">
          <thead>
            <tr className="border-b bg-slate-100 text-center">
              <th className="px-4 py-2 border">Serial No</th>
              <th className="px-4 py-2 border">Company</th>
              <th className="px-4 py-2 border">Customer</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Color</th>
              <th className="px-4 py-2 border">Created By</th>
              <th className="px-4 py-2 border">QA Status</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border w-[8%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {product.map((p) => (
              <tr key={p.id} className="border hover:bg-slate-50">
                <td className="px-4 py-2 border text-center">{p.serial_number}</td>
                <td className="px-4 py-2 border">{p.Company_name}</td>
                <td className="px-4 py-2 border">{p.Customer_name}</td>
                <td className="px-4 py-2 border text-center">{p.date}</td>
                <td className="px-4 py-2 border text-center">{p.ratio}</td>
                <td className="px-4 py-2 border text-center">
                  {p.created_by || "Unknown"}
                </td>
                <td className="px-4 py-2 border text-center">
                  <Badge className={getStatusColor(p.qa_status || "pending")}>
                    {p.qa_status || "pending"}
                  </Badge>
                </td>
                <td className="px-4 py-2 border text-center">
                  <Badge className={getStatusColor(p.outward_status || "pending")}>
                    {p.outward_status || "pending"}
                  </Badge>
                </td>
                <td className="px-4 py-2 border text-center">
                  <Button size="sm" onClick={() => onView(p)}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);
