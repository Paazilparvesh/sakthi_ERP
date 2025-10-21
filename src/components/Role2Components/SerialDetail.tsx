// import React from "react";
// import { Card } from "@/components/ui/card";
// import { ProductionItem } from "./ProductionTable";

// interface SerialDetailProps {
//     item: ProductionItem;
//     onBack: () => void;
// }

// const SerialDetail: React.FC<SerialDetailProps> = ({ item, onBack }) => {
//     return (
//         <Card className="shadow-lg p-6">
//             <h2 className="text-xl font-bold mb-4">Serial Number Details</h2>
//             <div className="space-y-2">
//                 <p><strong>ID:</strong> {item.id}</p>
//                 <p><strong>Serial Number:</strong> {item.serial_number}</p>
//                 <p><strong>Company Name:</strong> {item.Company_name}</p>
//                 <p><strong>Status:</strong> {item.status}</p>
//             </div>
//             <button
//                 className="mt-6 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//                 onClick={onBack}
//             >
//                 Back to Table
//             </button>
//         </Card>
//     );
// };

// export default SerialDetail;



import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProductionItem } from "./ProductionTable";

interface SerialDetailProps {
    item: ProductionItem;
    onBack: () => void;
    onProceed?: () => void; // optional handler for pending status
}

// const SerialDetail: React.FC<SerialDetailProps> = ({ item, onBack, onProceed }) => {
//     const renderFieldCard = (label: string, value: string | number) => (
//         <Card className="shadow-sm">
//             <CardContent className="p-4">
//                 <span className="text-gray-500 font-medium">{label}</span>
//                 <p className="text-gray-800 font-semibold">{value || "-"}</p>
//             </CardContent>
//         </Card>
//     );

//     return (
//         <Card className="shadow-lg p-6 max-w-5xl mx-auto">
//             {/* Top Row: Heading Left, Buttons Right */}
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-2xl font-bold text-gray-800">Serial Number Details</h2>
//                 <div className=" flex gap-2">
//                     {item.status?.toLowerCase() === "pending" && onProceed && (
//                         <button
//                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                             onClick={onProceed}
//                         >
//                             Proceed
//                         </button>
//                     )}

//                     <button
//                         className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
//                         onClick={onBack}
//                     >
//                         Back to Table
//                     </button>
//                 </div>
//             </div>

//             {/* 2-column Grid Layout */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 <div className="space-y-4">
//                     {renderFieldCard("ID", item.id)}
//                     {renderFieldCard("Serial Number", item.serial_number)}
//                     {renderFieldCard("Date", item.date || "-")}
//                     {renderFieldCard("Customer DC No.", item.Customer_No || "-")}
//                     {renderFieldCard("Company Name", item.Company_name)}
//                 </div>

//                 <div className="space-y-4">
//                     {renderFieldCard("Status", item.status)}
//                     {renderFieldCard("Customer Name", item.Customer_name || "-")}
//                     {renderFieldCard("Mobile Number", item.mobile || "-")}
//                     {renderFieldCard("Customer Date", item.Customer_date || "-")}
//                 </div>
//             </div>
//         </Card>
//     );
// };
const SerialDetail: React.FC<SerialDetailProps> = ({ item, onBack, onProceed }) => {
  const renderFieldCard = (label: string, value: string | number) => (
    <Card className="shadow-sm rounded-lg border border-gray-200">
      <CardContent className="p-4">
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <p className="text-gray-800 font-semibold text-base md:text-lg">{value || "-"}</p>
      </CardContent>
    </Card>
  );

  return (
    <Card className="shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Top Row: Heading Left, Buttons Right */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Serial Number Details</h2>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {item.status?.toLowerCase() === "pending" && onProceed && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
              onClick={onProceed}
            >
              Proceed
            </button>
          )}

          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 w-full sm:w-auto"
            onClick={onBack}
          >
            Back to Table
          </button>
        </div>
      </div>

      {/* 2-column Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          {renderFieldCard("ID", item.id)}
          {renderFieldCard("Serial Number", item.serial_number)}
          {renderFieldCard("Date", item.date || "-")}
          {renderFieldCard("Customer DC No.", item.Customer_No || "-")}
          {renderFieldCard("Company Name", item.Company_name)}
        </div>

        <div className="space-y-4">
          {renderFieldCard("Status", item.status)}
          {renderFieldCard("Customer Name", item.Customer_name || "-")}
          {renderFieldCard("Mobile Number", item.mobile || "-")}
          {renderFieldCard("Customer Date", item.Customer_date || "-")}
        </div>
      </div>
    </Card>
  );
};


export default SerialDetail;
