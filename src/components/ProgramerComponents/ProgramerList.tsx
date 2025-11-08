import React from "react";
import { CheckCircle2, Eye } from "lucide-react";
import { ProgramerTableProps } from "@/types/qa.type";

const ProgramerList: React.FC<ProgramerTableProps> = ({ data, onView }) => {
    return (
        <div className="overflow-x-auto w-full">
            {/* Desktop Table */}
            <table className="hidden md:table min-w-full text-sm text-left text-slate-700 border-separate border-spacing-0">
                <thead className="text-xs text-blue-600 uppercase border bg-slate-100 sticky top-0 z-10 text-center">
                    <tr>
                        <th className="px-4 py-3 font-semibold border">Serial No.</th>
                        <th className="px-4 py-3 font-semibold border">Date</th>
                        <th className="px-4 py-3 font-semibold border">Company Name</th>
                        <th className="px-4 py-3 font-semibold border">Customer Name</th>
                        <th className="px-4 py-3 font-semibold border">Color</th>
                        <th className="px-4 py-3 font-semibold border">Mobile</th>
                        <th className="px-4 py-3 font-semibold border">Created By</th>
                        <th className="px-4 py-3 font-semibold border">Status</th>
                        <th className="px-4 py-3 font-semibold text-center border">Action</th>
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
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status?.toLowerCase() === "completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {item.status}
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
                {data.slice().reverse().map((item, index) => (
                    <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-200">
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Serial No:</span>
                            <span className="text-slate-900">{item.serial_number}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Company Name:</span>
                            <span className="text-slate-600">{item.company_name}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Customer Name:</span>
                            <span className="text-slate-600">{item.customer_name}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Date:</span>
                            <span className="text-slate-600">{item.date}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Worker No:</span>
                            <span className="text-slate-600">{item.worker_no}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">color:</span>
                            <span className="text-slate-600">{item.color}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Status:</span>
                            {item.status?.toLowerCase() === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <span className="text-yellow-600 font-medium">{item.status}</span>
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

export default ProgramerList;
