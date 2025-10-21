import React from "react";
import { CheckCircle2, Eye } from "lucide-react";

export interface ProductionItem {
    id: number;                     // Primary key
    serial_number: string;           // Serial number of the product
    Company_name: string;            // Company name
    date?: string;                   // Date of product creation or record
    Customer_name?: string;          // Customer name
    Customer_No?: string;            // Customer DC number
    Customer_date?: string;          // Customer delivery date
    mobile?: string;                 // Customer mobile number
    status: "Completed" | "Pending" | string; // Product status
}


interface ProductionTableProps {
    data: ProductionItem[];
    onView: (item: ProductionItem) => void;
}

const ProductionTable: React.FC<ProductionTableProps> = ({ data, onView }) => {
    return (
        <div className="overflow-x-auto w-full">
            <table className="hidden md:table min-w-full text-sm text-left text-slate-700 border-separate border-spacing-0">
                <thead className="text-xs text-blue-600 uppercase bg-slate-100 sticky top-0 z-10">
                    <tr>
                        <th className="px-4 py-3 font-semibold">ID</th>
                        <th className="px-4 py-3 font-semibold">Serial No.</th>
                        <th className="px-4 py-3 font-semibold">Company Name</th>
                        <th className="px-4 py-3 font-semibold text-center">Status</th>
                        <th className="px-4 py-3 font-semibold text-center">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.slice().reverse().map((item, index) => (
                        <tr
                            key={index}
                            className="bg-white border-b border-slate-200 hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-4 py-3 text-slate-500">{index + 1}</td>
                            <td className="px-4 py-3 font-medium text-slate-900">{item.serial_number}</td>
                            <td className="px-4 py-3 text-slate-600">{item.Company_name}</td>
                            {/* <td className="px-4 py-3 text-center">
                                {item.status === "Completed" ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500 mx-auto" />
                                ) : (
                                    <span className="text-orange-500 font-medium">{item.status}</span>
                                )}
                            </td> */}
                            <td className="px-4 py-3 text-center ">
  <div
    className={` rounded-full inline-flex items-center justify-center gap-2 px-3 py-1 rounded font-medium ${
      item.status?.toLowerCase() === "complete"
        ? "bg-green-100 text-green-800"
        : "bg-yellow-100 text-yellow-800"
    }`}
  >
    {item.status === "complete" ? (
      <>
        <span>Completed</span>
      </>
    ) : (
      <span>Pending</span>
    )}
  </div>
</td>

                            <td className="px-4 py-3 text-center">
                                <button
                                    className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 mx-auto"
                                    onClick={() => onView(item)}
                                >
                                    <Eye className="h-4 w-4" /> View
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Mobile-friendly cards as fallback */}
            <div className="md:hidden  space-y-4">
                {data.slice().reverse().map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-200">
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-700">ID:</span>
                            <span className="text-slate-500">{index + 1}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-700">Serial No:</span>
                            <span className="text-slate-900">{item.serial_number}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-700">Company:</span>
                            <span className="text-slate-600">{item.Company_name}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="font-semibold text-slate-700">Status:</span>
                            {item.status === "Completed" ? (
                                <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                                <span className="text-orange-500 font-medium">{item.status}</span>
                            )}
                        </div>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full mt-2 flex items-center justify-center gap-2"
                            onClick={() => onView(item)}
                        >
                            <Eye className="h-4 w-4" /> View
                        </button>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default ProductionTable;
