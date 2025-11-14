import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductType } from "@/types/inward.type";

interface ProductListProps {
  product: ProductType[];
  onView: (p: ProductType) => void;
  getStatusColor: (status: string) => string;
  role: string;
}

export const OutwardList: React.FC<ProductListProps> = ({
  product,
  onView,
  role,
  getStatusColor,
}) => (
  <div className="overflow-x-auto w-full">
    <table className="w-full border-collapse text-sm sm:text-base">
      <thead>
        <tr className="border-b bg-slate-100 text-center">
          <th className="px-4 py-2 border">Serial No</th>
          <th className="px-4 py-2 border">Company Name</th>
          <th className="px-4 py-2 border">Customer Name</th>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border">Color</th>
          <th className="px-4 py-2 border">Created By</th>
          <th className="px-4 py-2 border">
            {role === "accountent" ? "QA Status" : "Status"}</th>
          {role === "accountent" && (
            <th className="px-4 py-2 border">Status</th>
          )}
          <th className="px-4 py-2 border w-[8%]">Action</th>
        </tr>
      </thead>
      <tbody>
        {product.map((p, i) => (
          <tr key={i} className="border hover:bg-slate-50 even:bg-gray-50 odd:bg-white transition">
            <td className="px-4 py-1 border text-center">{p.serial_number}</td>
            <td className="px-4 py-1 border">{p.company_name}</td>
            <td className="px-4 py-1 border">{p.customer_name}</td>
            <td className="px-4 py-1 border text-center">{p.date}</td>
            <td className="px-4 py-1 border text-center">{p.color}</td>
            <td className="px-4 py-1 border text-center">
              {p.created_by || "Unknown"}
            </td>
            <td className="px-4 py-1 border text-center">
              <Badge className={getStatusColor(p.qa_status)}>
                {p.qa_status}
              </Badge>
            </td>
            {role === "accountent" && (
              <td className="px-4 py-1 border text-center">
                <Badge className={getStatusColor(p.outward_status)}>
                  {p.outward_status}
                </Badge>
              </td>
            )}
            <td className="px-4 py-1 border text-center">
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800 my-2 px-4 text-xs" onClick={() => onView(p)}>
                View
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
