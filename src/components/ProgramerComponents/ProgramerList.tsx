import React from "react";
import { CheckCircle2, Eye } from "lucide-react";
import { ProgramerTableProps } from "@/types/qa.type";

const ProgramerList: React.FC<ProgramerTableProps> = ({ data, onView }) => {
    return (
        <div className="overflow-x-auto w-full">
            {/* Desktop Table */}
            <table className="w-full border-collapse text-sm sm:text-base">
                <thead>
                    <tr className="border-b bg-gray-300 text-center">
                        <th className="px-2 py-2 border w-[7%]">S. No.</th>
                        <th className="px-2 py-2 border w-[12%]">Date</th>
                        <th className="px-2 py-2 border w-[18%]">Company Name</th>
                        <th className="px-2 py-2 border w-[18%]">Customer Name</th>
                        <th className="px-2 py-2 border w-[8%]">Color</th>
                        <th className="px-2 py-2 border w-[10%]">Mobile</th>
                        <th className="px-2 py-2 border w-[10%]">Created By</th>
                        <th className="px-2 py-2 border w-[6%]">Status</th>
                        <th className="px-2 py-2 border w-[6%]">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {data.slice().reverse().map((item, index) => (
                        <tr
                            key={index}
                            className="bg-white border-b border-slate-200 hover:bg-gray-50 transition-colors border"
                        >
                            <td className="px-4 py-3 border font-medium text-slate-800 text-center">{item.serial_number}</td>
                            <td className="px-4 py-3 border text-slate-600 text-center">{item.date}</td>
                            <td className="px-4 py-3 border">{item.company_name}</td>
                            <td className="px-4 py-3 border">{item.customer_name}</td>
                            <td className={`px-4 py-3 border text-center`}>
                                <span className={`px-4 py-1 border text-center rounded-3xl  ${item.color === "yellow" ? " bg-yellow-100" : "bg-white"} `}>
                                    {item.color}</span></td>
                            <td className="px-4 py-3 border text-center">{item.contact_no}</td>
                            <td className="px-4 py-3 border text-center">{item.created_by}</td>
                            <td className="px-4 py-3 border text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.programer_status?.toLowerCase() === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {item.programer_status}
                                </span>
                            </td>
                            <td className="px-4 py-3 border text-center">
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
        </div>
    );
};

export default ProgramerList;
