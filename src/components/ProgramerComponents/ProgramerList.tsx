// import React from "react";
// import { CheckCircle2, Eye } from "lucide-react";
// import { ProgramerTableProps } from "@/types/qa.type";



// const QaList: React.FC<ProgramerTableProps> = ({ data, onView }) => {

//     return (
//         <div className="overflow-x-auto w-full">
//             <table className="hidden md:table min-w-full text-sm text-left text-slate-700 border-separate border-spacing-0">
//                 <thead className="text-xs text-blue-600 uppercase border bg-slate-100 sticky top-0 z-10">
//                     <tr>
//                         <th className="px-4 py-3 font-semibold border w-[10%]">Serial No.</th>
//                         <th className="px-4 py-3 font-semibold border w-[15%]">Date</th>
//                         <th className="px-4 py-3 font-semibold border w-[20%]">Company Name</th>
//                         <th className="px-4 py-3 font-semibold text-center border w-[10%]">Status</th>
//                         <th className="px-4 py-3 font-semibold text-center border w-[10%]">Action</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {data.slice().reverse().map((item, index) => (
//                         <tr
//                             key={index}
//                             className="bg-white border-b border-slate-200 hover:bg-gray-50 transition-colors border"
//                         >
//                             <td className="px-4 py-3 font-medium text-slate-800 border">{item.serial_number}</td>
//                             <td className="px-4 py-3 font-medium text-slate-600 border">{item.date}</td>
//                             <td className="px-4 py-3 text-slate-600 border">{item.Company_name}</td>
//                             <td className="px-4 py-3 text-center border">
//                                 <div
//                                     className={` rounded-full inline-flex items-center justify-center gap-2 px-3 py-1 text-xs font-medium ${item.status?.toLowerCase() === "completed"
//                                         ? "bg-green-100 text-green-800"
//                                         : "bg-yellow-100 text-yellow-800"
//                                         }`}
//                                 >
//                                     {item.status}
//                                 </div>
//                             </td>

//                             <td className="px-4 py-3 text-center border">
//                                 <button
//                                     className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 flex items-center gap-1 mx-auto"
//                                     onClick={() => onView(item)}
//                                 >
//                                     <Eye className="h-4 w-4" /> View
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             {/* Mobile-friendly cards as fallback */}
//             <div className="md:hidden  space-y-4">
//                 {data.slice().reverse().map((item, index) => (
//                     <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-200">
//                         <div className="flex justify-between mb-2">
//                             <span className="font-semibold text-slate-700">ID:</span>
//                             <span className="text-slate-500">{index + 1}</span>
//                         </div>
//                         <div className="flex justify-between mb-2">
//                             <span className="font-semibold text-slate-700">Serial No:</span>
//                             <span className="text-slate-900">{item.serial_number}</span>
//                         </div>
//                         <div className="flex justify-between mb-2">
//                             <span className="font-semibold text-slate-700">Company:</span>
//                             <span className="text-slate-600">{item.Company_name}</span>
//                         </div>
//                         <div className="flex justify-between mb-2">
//                             <span className="font-semibold text-slate-700">Status:</span>
//                             {item.status === "Completed" ? (
//                                 <CheckCircle2 className="h-6 w-6 text-green-500" />
//                             ) : (
//                                 <span className="text-orange-500 font-medium">{item.status}</span>
//                             )}
//                         </div>
//                         <button
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full mt-2 flex items-center justify-center gap-2"
//                             onClick={() => onView(item)}
//                         >
//                             <Eye className="h-4 w-4" /> View
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>

//     );
// };

// export default QaList;




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
                            <td className="px-4 py-3 border">{item.Company_name}</td>
                            <td className="px-4 py-3 border">{item.Customer_name}</td>
                            <td className="px-4 py-3 border text-center">{item.ratio}</td>
                            <td className="px-4 py-3 border text-center">{item.mobile}</td>
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
                            <span className="font-semibold text-slate-700">Company:</span>
                            <span className="text-slate-600">{item.Company_name}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Customer:</span>
                            <span className="text-slate-600">{item.Customer_name}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Date:</span>
                            <span className="text-slate-600">{item.date}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">WO No:</span>
                            <span className="text-slate-600">{item.wo_no}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Ratio:</span>
                            <span className="text-slate-600">{item.ratio}</span>
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Status:</span>
                            {item.status?.toLowerCase() === "completed" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                                <span className="text-yellow-600 font-medium">{item.status}</span>
                            )}
                        </div>
                        <div className="flex justify-between mb-1">
                            <span className="font-semibold text-slate-700">Outward:</span>
                            <span className="text-slate-600">{item.outward_status}</span>
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
