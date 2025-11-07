// import { InwardFormType, InwardProps } from "@/types/inward.type";

// const InwardSummary: React.FC<InwardProps> = ({
//     formData,
// }) => {

//     return (
//         <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-7xl mx-auto mt-10 transition-all">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-6 border-b pb-3">
//                 <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
//             </div>

//             {/* Basic Info */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
//                 {[
//                     { label: "Serial No", value: formData.serial_number },
//                     { label: "Date", value: formData.date },
//                     { label: "Customer DC No", value: formData.Customer_No },
//                     { label: "Customer DC Date", value: formData.Customer_date },
//                     { label: "Company Name", value: formData.Company_name },
//                     { label: "Customer Name", value: formData.Customer_name },
//                     { label: "Mobile No", value: formData.mobile },
//                 ].map(({ label, value }) => (
//                     <div key={label} className="flex flex-col">
//                         <label className="text-gray-600 text-sm font-medium mb-1">
//                             {label}
//                         </label>
//                         <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm">
//                             {value || "-"}
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* Material Table */}
//             <div className="mt-4 overflow-x-auto rounded-xl border border-gray-300">
//                 <table className="w-full border-collapse text-center text-sm sm:text-base rounded-xl overflow-hidden">
//                     <thead className="bg-gray-100 text-gray-700 font-semibold">
//                         <tr>
//                             <th className="border px-2 py-2">S.No</th>
//                             <th className="border px-2 py-2">Material Description (L × W × H)</th>
//                             <th className="border px-2 py-2">Volume</th>
//                             <th className="border px-2 py-2">Quantity</th>
//                             <th className="border px-2 py-2">Remarks</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {formData.Length.map((_, index) => (
//                             <tr key={index} className="hover:bg-gray-50 transition-colors">
//                                 <td className="border px-2 py-2 font-medium">{index + 1}</td>
//                                 <td className="border px-2 py-2 text-gray-800">
//                                     Length - {formData.Length?.[index] || 0} ×{" "}
//                                     Weight - {formData.Breadth?.[index] || 0} ×{" "}
//                                     Height - {formData.Height?.[index] || 0}
//                                 </td>
//                                 <td className="border px-2 py-2 text-gray-700">
//                                     {formData.Volume?.[index] || 0}
//                                 </td>
//                                 <td className="border px-2 py-2 text-gray-700">
//                                     {formData.Quantity?.[index] || 0}
//                                 </td>
//                                 <td className="border px-2 py-2 text-gray-700">
//                                     {formData.Remarks?.[index] || "—"}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//         </div>
//     );
// };


// export default InwardSummary;




import { InwardProps } from "@/types/inward.type";

const InwardSummary: React.FC<InwardProps> = ({ formData }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 w-full max-w-7xl mx-auto mt-10 transition-all">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-3">
                <h2 className="text-2xl font-semibold text-gray-800">Summary</h2>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                    { label: "Serial No", value: formData.serial_number },
                    { label: "Date", value: formData.date },
                    { label: "Inward Slip No", value: formData.inward_slip_number },
                    { label: "WO No", value: formData.wo_no },
                    { label: "TEC", value: formData.tec },
                    { label: "Company Name", value: formData.Company_name },
                    { label: "Customer Name", value: formData.Customer_name },
                    { label: "Customer DC No", value: formData.Customer_No },
                    { label: "Mobile No", value: formData.mobile },
                    { label: "Color", value: formData.ratio },
                ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col">
                        <label className="text-gray-600 text-sm font-medium mb-1">{label}</label>
                        <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm">
                            {value || "—"}
                        </div>
                    </div>
                ))}
            </div>

            {/* Material Table */}
            <div className="mt-4 overflow-x-auto rounded-xl border border-gray-300">
                <table className="w-full border-collapse text-center text-sm sm:text-base rounded-xl overflow-hidden">
                    <thead className="bg-gray-100 text-gray-700 font-semibold">
                        <tr>
                            <th className="border px-2 py-2">S.No</th>
                            <th className="border px-2 py-2">Material Type</th>
                            <th className="border px-2 py-2">Grade</th>
                            <th className="border px-2 py-2">Dimensions (Thick × Width × Length × Weight)</th>
                            <th className="border px-2 py-2">Density</th>
                            <th className="border px-2 py-2">Quantity</th>
                            <th className="border px-2 py-2">Remarks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formData.materials?.length > 0 ? (
                            formData.materials.map((mat, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="border px-2 py-2 font-medium">{index + 1}</td>

                                    <td className="border px-2 py-2 text-gray-800">
                                        {mat.mat_type || "—"}
                                    </td>

                                    <td className="border px-2 py-2 text-gray-800">
                                        {mat.mat_grade || "—"}
                                    </td>

                                    <td className="border px-2 py-2 text-gray-800">
                                        {mat.Thick || 0} × {mat.Width || 0} ×{" "}
                                        {mat.Length || 0} × {mat.UnitWeight || 0}
                                    </td>

                                    <td className="border px-2 py-2 text-gray-700">
                                        {mat.Density || "—"}
                                    </td>

                                    <td className="border px-2 py-2 text-gray-700">
                                        {mat.Quantity || 0}
                                    </td>

                                    <td className="border px-2 py-2 text-gray-700">
                                        {mat.Remarks || "—"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-4 text-gray-500 italic">
                                    No material details added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InwardSummary;
