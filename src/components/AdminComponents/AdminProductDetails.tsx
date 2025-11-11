// import React, { useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
// import { Badge } from "@/components/ui/badge";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import { ProductType } from "@/types/inward.type";

// interface AdminProductDetailProps {
//   product: ProductType;
//   onBack: () => void;
//   getStatusColor: (status: string) => string;
// }


// /* ---------------------- Helper Components ---------------------- */
// const Info = ({ label, value }: { label: string; value: any }) => (
//   <div>
//     <p className="text-sm text-gray-500 font-medium">{label}</p>
//     <p className="text-base font-semibold text-gray-800">
//       {value ?? "-"}
//     </p>
//   </div>
// );

// const Section = ({
//   title,
//   children,
// }: {
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
//     <h4 className="text-lg font-semibold text-gray-700">{title}</h4>
//     {children}
//   </div>
// );

// const AdminProductDetail: React.FC<AdminProductDetailProps> = ({
//   product,
//   onBack,
//   getStatusColor,
// }) => {
//   const [expandedMaterialId, setExpandedMaterialId] = useState<number | null>(null);

//   const toggleMaterial = (id: number) => {
//     setExpandedMaterialId((prev) => (prev === id ? null : id));
//   };

//   return (
//     <div className="p-6 space-y-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-2xl font-semibold text-gray-800">
//           Product Details — {product.serial_number}
//         </h2>
//         <Button
//           onClick={onBack}
//           className="bg-gray-600 text-white hover:bg-gray-700"
//         >
//           Back to List
//         </Button>
//       </div>

//       {/* Summary Info */}
//       <Card className="shadow-md border border-gray-200">
//         <CardHeader>
//           <CardTitle>Basic Information</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <Info label="Company Name" value={product.company_name} />
//           <Info label="Customer Name" value={product.customer_name} />
//           <Info label="Contact Number" value={product.contact_no} />
//           <Info label="Color" value={product.color} />
//           <Info label="Worker No" value={product.worker_no} />
//           <Info label="Customer DC No" value={product.customer_dc_no} />
//           <Info label="Inward Slip No" value={product.inward_slip_number} />
//           <Info label="Created By" value={product.created_by} />
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-gray-500">Programer Status:</span>
//             <Badge className={getStatusColor(product.programer_status)}>
//               {product.programer_status}
//             </Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-gray-500">QA Status:</span>
//             <Badge className={getStatusColor(product.qa_status)}>
//               {product.qa_status}
//             </Badge>
//           </div>
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-gray-500">Outward Status:</span>
//             <Badge className={getStatusColor(product.outward_status)}>
//               {product.outward_status}
//             </Badge>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Materials Section */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold text-gray-800">Materials</h3>

//         {product.materials?.map((mat: any, index: number) => (
//           <Card key={mat.material_id} className="border border-gray-200 shadow-sm">
//             <CardHeader
//               onClick={() => toggleMaterial(mat.material_id)}
//               className="flex flex-row justify-between items-center cursor-pointer"
//             >
//               <CardTitle className="text-lg">
//                 {index + 1}. {mat.mat_type} — {mat.mat_grade}
//               </CardTitle>
//               {expandedMaterialId === mat.material_id ? (
//                 <ChevronUp className="text-gray-500" />
//               ) : (
//                 <ChevronDown className="text-gray-500" />
//               )}
//             </CardHeader>

//             {expandedMaterialId === mat.material_id && (
//               <CardContent className="space-y-6">
//                 {/* Material Info */}
//                 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                   <Info label="Thick (mm)" value={mat.thick} />
//                   <Info label="Width (mm)" value={mat.width} />
//                   <Info label="Length (mm)" value={mat.length} />
//                   <Info label="Quantity" value={mat.quantity} />
//                   <Info label="Total Weight (kg)" value={mat.total_weight} />
//                   <Badge className={getStatusColor(mat.programer_status)}>
//                     Program: {mat.programer_status}
//                   </Badge>
//                   <Badge className={getStatusColor(mat.qa_status)}>
//                     QA: {mat.qa_status}
//                   </Badge>
//                   <Badge className={getStatusColor(mat.acc_status)}>
//                     Accounts: {mat.acc_status}
//                   </Badge>
//                 </div>

//                 <Separator className="my-4" />

//                 {/* Programer Details */}
//                 {mat.programer_details?.length > 0 && (
//                   <Section title="Programer Details">
//                     {mat.programer_details.map((pd: any) => (
//                       <div
//                         key={pd.id}
//                         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//                       >
//                         <Info label="Program No" value={pd.program_no} />
//                         <Info label="Program Date" value={pd.program_date} />
//                         <Info label="Processed Qty" value={pd.processed_quantity} />
//                         <Info label="Balance Qty" value={pd.balance_quantity} />
//                         <Info label="Used Weight" value={pd.used_weight} />
//                         <Info label="Sheets" value={pd.number_of_sheets} />
//                         <Info
//                           label="Planned Hours"
//                           value={pd.total_planned_hours}
//                         />
//                         <Info label="Created By" value={pd.created_by__username} />
//                       </div>
//                     ))}
//                   </Section>
//                 )}

//                 {/* QA Details */}
//                 {mat.qa_details?.length > 0 && (
//                   <Section title="QA Details">
//                     {mat.qa_details.map((qa) => (
//                       <div
//                         key={qa.id}
//                         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//                       >
//                         <Info label="Processed Date" value={qa.processed_date} />
//                         <Info label="Shift" value={qa.shift} />
//                         <Info label="Machine" value={qa.machine_used} />
//                         <Info label="Operator" value={qa.operator_name} />
//                         <Info
//                           label="Created By (QA)"
//                           value={qa.created_by_qa__username}
//                         />
//                       </div>
//                     ))}
//                   </Section>
//                 )}

//                 {/* Account Details */}
//                 {mat.account_details?.length > 0 && (
//                   <Section title="Account Details">
//                     {mat.account_details.map((acc) => (
//                       <div
//                         key={acc.id}
//                         className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
//                       >
//                         <Info label="Invoice No" value={acc.invoice_no} />
//                         <Info label="Status" value={acc.status} />
//                         <Info label="Remarks" value={acc.remarks} />
//                         <Info
//                           label="Created By (Acc)"
//                           value={acc.created_by_acc__username}
//                         />
//                       </div>
//                     ))}
//                   </Section>
//                 )}
//               </CardContent>
//             )}
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };


// export default AdminProductDetail;





import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

/* ---------------------- Props ---------------------- */
interface AdminProductDetailProps {
  product: any; // from get_overall_details API
  onBack: () => void;
  getStatusColor: (status: string) => string;
}

/* ---------------------- Helper Function ---------------------- */
const renderFieldCard = (
  label: string,
  value: string | number | null | undefined,
  isStatus?: boolean
) => {
  const displayValue = value !== null && value !== undefined ? value : "-";

  const statusColor =
    typeof value === "string" && isStatus
      ? value.toLowerCase() === "pending"
        ? "w-24 rounded-full px-3 text-yellow-600 bg-yellow-100 border-yellow-300"
        : "w-28 rounded-full px-3 text-green-600 bg-green-100 border-green-300"
      : "text-gray-800";

  return (
    <Card
      className={`shadow-sm rounded-lg border ${isStatus ? "border-transparent" : "border-gray-200"
        }`}
    >
      <CardContent className="p-4">
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <p
          className={`font-semibold text-base md:text-lg mt-1 block py-1 ${statusColor}`}
        >
          {displayValue || "-"}
        </p>
      </CardContent>
    </Card>
  );
};

/* ---------------------- Main Component ---------------------- */
const AdminProductDetail: React.FC<AdminProductDetailProps> = ({
  product,
  onBack,
  getStatusColor,
}) => {
  return (
    <Card className="shadow-lg p-6 mx-auto w-full max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Admin Product Details
        </h2>
        <Button
          className="bg-gray-600 text-white hover:bg-gray-700"
          onClick={onBack}
        >
          Back to Table
        </Button>
      </div>

      {/* Product Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        <div className="space-y-4">
          {renderFieldCard("Serial Number", product.serial_number)}
          {renderFieldCard("Company Name", product.company_name)}
          {renderFieldCard("Customer Contact Number", product.contact_no)}
          {renderFieldCard("Created By", product.created_by)}
        </div>
        <div className="space-y-4">
          {renderFieldCard("Customer Name", product.customer_name)}
          {renderFieldCard("Worker Number", product.worker_no)}
          {renderFieldCard("Customer Document Number", product.customer_dc_no)}
        </div>
        <div className="space-y-4">
          {renderFieldCard("Inward Slip Number", product.inward_slip_number)}
          {renderFieldCard("Color", product.color)}
          {renderFieldCard("Outward Status", product.outward_status, true)}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Materials Table */}
      {product.materials?.length > 0 && (
        <section className="mt-10 space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Product Materials
          </h3>
          <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
            <table className="w-full border-collapse text-center text-sm sm:text-base">
              <thead className="bg-gray-100 text-gray-700 font-semibold">
                <tr>
                  <th className="border px-2 py-2">S.No</th>
                  <th className="border px-2 py-2">Material Type</th>
                  <th className="border px-2 py-2">Grade</th>
                  <th className="border px-2 py-2">Thick (mm)</th>
                  <th className="border px-2 py-2">Width (mm)</th>
                  <th className="border px-2 py-2">Length (mm)</th>
                  <th className="border px-2 py-2">Quantity</th>
                  <th className="border px-2 py-2">Total Weight (kg)</th>
                  <th className="border px-2 py-2">Statuses</th>
                </tr>
              </thead>
              <tbody>
                {product.materials.map((mat: any, index: number) => (
                  <tr
                    key={mat.material_id}
                    className="hover:bg-gray-50 transition text-gray-800"
                  >
                    <td className="border px-2 py-2">{index + 1}</td>
                    <td className="border px-2 py-2">{mat.mat_type}</td>
                    <td className="border px-2 py-2">{mat.mat_grade}</td>
                    <td className="border px-2 py-2">{mat.thick}</td>
                    <td className="border px-2 py-2">{mat.width}</td>
                    <td className="border px-2 py-2">{mat.length}</td>
                    <td className="border px-2 py-2">{mat.quantity}</td>
                    <td className="border px-2 py-2">{mat.total_weight}</td>
                    <td className="border px-2 py-2">
                      <div className="flex flex-col gap-1">
                        <Badge className={getStatusColor(mat.programer_status)}>
                          Programmer: {mat.programer_status}
                        </Badge>
                        <Badge className={getStatusColor(mat.qa_status)}>
                          QA: {mat.qa_status}
                        </Badge>
                        <Badge className={getStatusColor(mat.acc_status)}>
                          Accounts: {mat.acc_status}
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Material Details Sections */}
      {product.materials.map((mat: any, idx: number) => (
        <React.Fragment key={mat.material_id}>
          <Separator className="my-10" />
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">
            Material {idx + 1}: {mat.mat_type} ({mat.mat_grade})
          </h3>

          {/* Programmer Details */}
          <section className="mb-10">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Programmer Details
            </h4>
            {mat.programer_details?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mat.programer_details.map((pd, i: number) => (
                  <React.Fragment key={i}>
                    {Object.entries(pd).map(([key, value]) => {
                      if (["id", "material_details", "product_details"].includes(key))
                        return null;
                      return renderFieldCard(
                        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                        value ?? "-"
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No programmer details available.</p>
            )}
          </section>

          {/* QA Details */}
          <section className="mb-10">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">QA Details</h4>
            {mat.qa_details?.length > 0 ? (
              mat.qa_details.map((qa: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                >
                  {renderFieldCard("Processed Date", qa.processed_date)}
                  {renderFieldCard("Shift", qa.shift)}
                  {renderFieldCard("Machine Used", qa.machine_used)}
                  {renderFieldCard("Operator Name", qa.operator_name)}
                  {renderFieldCard("Created By (QA)", qa.created_by_qa__username)}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No QA details available.</p>
            )}
          </section>

          {/* Account Details */}
          <section>
            <h4 className="text-lg font-semibold text-gray-700 mb-3">
              Account Details
            </h4>
            {mat.account_details?.length > 0 ? (
              mat.account_details.map((acc: any, i: number) => (
                <div
                  key={i}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
                >
                  {renderFieldCard("Invoice No", acc.invoice_no)}
                  {renderFieldCard("Status", acc.status, true)}
                  {renderFieldCard("Remarks", acc.remarks)}
                  {renderFieldCard("Created By (Acc)", acc.created_by_acc__username)}
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No Account details available.</p>
            )}
          </section>
        </React.Fragment>
      ))}
    </Card>
  );
};

export default AdminProductDetail;
