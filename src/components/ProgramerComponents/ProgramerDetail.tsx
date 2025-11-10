import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ProgramerDetailProps, QAData } from "@/types/qa.type";
import { Material } from "@/types/inward.type";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";




const renderFieldCard = (label: string, value: string | number, isStatus?: boolean) => {


  // Conditional styling for status field
  const statusColor =
    typeof value === "string" && isStatus
      ? value.toLowerCase() === "pending"
        ? "w-24 rounded-full px-3 text-yellow-600 bg-yellow-100 border-yellow-300"
        : "w-28 rounded-full px-3 text-green-600 bg-green-100 border-green-300"
      : "text-gray-800";

  return (
    <Card className={`shadow-sm rounded-lg border ${isStatus ? "border-transparent" : "border-gray-200"
      }`}>
      <CardContent className="p-4">
        <span className="text-gray-500 font-medium text-sm">{label}</span>
        <p className={`font-semibold text-base md:text-lg mt-1 block py-1 ${statusColor}`}>{value || "-"}</p>
      </CardContent>
    </Card>
  );
}

const ProgramerDetail: React.FC<ProgramerDetailProps> = ({ item, onBack, onProceed }) => {
  const [formData, setFormData] = useState<QAData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchQAData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/get_programer_Details/`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch QA data");

        // ✅ Find matching product by ID
        const matched = data.find((dat) => {
          // Case 1: product_details is an object with .id
          if (typeof dat.product_details === "object" && dat.product_details !== null) {
            return dat.product_details.id === item.id;
          }
          // Case 2: product_details is just an ID number
          return dat.product_details === item.id;
        });
        if (item.status?.toLowerCase() === "completed") {
          if (matched) {
            setFormData(matched);
          } else {
            toast({
              title: "No programmer record found",
              description: `No programmer data linked with product ID: ${item.id}.`,
              variant: "destructive",
            });
          }
        } else {
          console.log()
        }

      } catch (error) {
        console.error("❌ Error fetching QA:", error);
        toast({
          title: "Error fetching QA data",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchQAData();
  }, [item.id, toast, API_URL, item.status]);


  const materials: Material[] = item.materials || [];


  return (
    <Card className="  p-4 sm:p-6 md:p-8 mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Product Details</h2>
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

      {/* Loading State */}
      {loading ? (
        <p className="text-center text-gray-500 italic">Loading QA details...</p>
      ) : (
        <>
          {/* --- Product Information Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {renderFieldCard("Serial Number", item.serial_number)}
              {renderFieldCard("Company Name", item.company_name)}
              {renderFieldCard("Mobile", item.contact_no)}
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              {renderFieldCard("Date", item.date || "-")}
              {renderFieldCard("Customer Name", item.customer_name)}
              {renderFieldCard("Work Order No", item.worker_no || "-")}
              {renderFieldCard("Created By", item.created_by || "-")}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {renderFieldCard("Inward Slip No.", item.inward_slip_number || "-")}
              {renderFieldCard("Customer No.", item.customer_dc_no)}
              {renderFieldCard("Ratio", item.color || "-")}
              {renderFieldCard("Status", item.status, true)}
            </div>
          </div>

          {/* --- Product Materials Section --- */}
          {materials.length > 0 && (
            <section className="mt-10 space-y-4">
              <h3 className="text-xl font-semibold text-gray-700">Product Materials</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
                <table className="w-full border-collapse text-center text-sm sm:text-base rounded-xl overflow-hidden">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="border px-2 py-2">S.No</th>
                      <th className="border px-2 py-2">Material Type</th>
                      <th className="border px-2 py-2">Material Grade</th>
                      <th className="border px-2 py-2">Thick (mm)</th>
                      <th className="border px-2 py-2">Width (mm)</th>
                      <th className="border px-2 py-2">Length (mm)</th>
                      <th className="border px-2 py-2">Density</th>
                      <th className="border px-2 py-2">Unit Weight (kg)</th>
                      <th className="border px-2 py-2">Quantity</th>
                      <th className="border px-2 py-2">Total Weight (kg)</th>
                      <th className="border px-2 py-2">Stock Due</th>
                      <th className="border px-2 py-2">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((mat, index) => (
                      <tr
                        key={mat.id || index}
                        className="hover:bg-gray-50 transition-colors text-gray-800"
                      >
                        <td className="border px-2 py-2 font-medium">{index + 1}</td>
                        <td className="border px-2 py-2">{mat.mat_type || "-"}</td>
                        <td className="border px-2 py-2">{mat.mat_grade || "-"}</td>
                        <td className="border px-2 py-2">{mat.thick ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.width ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.length ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.density ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.unit_weight ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.quantity ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.total_weight ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}


          {/* ✅ NEW — Show Programmer Details when status = completed */}
          {item.status?.toLowerCase() === "completed" && formData && (
            <section className="mt-10">
              <Separator />
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 mt-10">Programmer Details</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData).map(([key, value]) => {
                  if (["id", "product_details"].includes(key)) return null;
                  return (
                    <React.Fragment key={key}>
                      {renderFieldCard(
                        key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
                        value
                      )}
                    </React.Fragment>
                  );
                })}

              </div>
            </section>
          )}

        </>
      )}
    </Card>
  );
};


export default ProgramerDetail;
