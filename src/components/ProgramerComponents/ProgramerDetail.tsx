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

  // const statusValidation = item.status?.toLowerCase() === "pending" && onProceed;


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
              {renderFieldCard("Company Name", item.Company_name)}
              {renderFieldCard("Mobile", item.mobile)}
              {renderFieldCard("TEC", item.tec || "-")}
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              {renderFieldCard("Date", item.date || "-")}
              {renderFieldCard("Customer Name", item.Customer_name)}
              {renderFieldCard("Work Order No", item.wo_no || "-")}
              {renderFieldCard("Created By", item.created_by || "-")}
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {renderFieldCard("Inward Slip No.", item.inward_slip_number || "-")}
              {renderFieldCard("Customer No.", item.Customer_No)}
              {renderFieldCard("Ratio", item.ratio || "-")}
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
                      <th className="border px-2 py-2">Unit Weight (kg)</th>
                      <th className="border px-2 py-2">Density</th>
                      <th className="border px-2 py-2">Quantity</th>
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
                        <td className="border px-2 py-2">{mat.Thick ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.Width ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.Length ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.UnitWeight ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.Density ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.Quantity ?? "-"}</td>
                        <td className="border px-2 py-2">{mat.Remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* QA Data (Product Options, Plan, Schedule) */}
          {/* {!statusValidation && formData && (
            <div className="mt-10 space-y-8">
              {/* Product Options 
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Product Options</h3>

                {formData.product_options && formData.product_options.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(formData.product_options[0]).map(([key, value]) => {
                      if (key === "id") return null; // Skip id field
                      const isTrue = Boolean(value);

                      return (
                        <Card key={key} className="border shadow-sm hover:shadow-md transition-all">
                          <CardContent className="p-4 flex justify-between items-center">
                            <p className="text-gray-600 font-medium capitalize">
                              {key.replace(/_/g, " ")}
                            </p>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${isTrue
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-red-100 text-red-600 border border-red-300"
                                }`}
                            >
                              {isTrue ? "Yes" : "No"}
                            </span>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No product options available.</p>
                )}
              </section>


              <Separator />

              {/* Plan Products 
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Plan Products</h3>

                {formData.plan_products && formData.plan_products.length > 0 ? (
                  <div className="space-y-6">
                    {formData.plan_products.map((plan, index) => (
                      <Card
                        key={index}
                        className="border shadow-sm hover:shadow-md transition-all p-4"
                      >
                        <CardContent>
                          {/* --- Top Info --- 
                          <div className="flex flex-wrap justify-between items-center mb-4">
                            <div className="flex justify-center items-center">
                              <p className="text-gray-500 text-sm font-medium mr-2">
                                Program No -
                              </p>
                              <p className="text-gray-800 font-semibold text-lg">
                                {plan.program_no || "-"}
                              </p>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${plan.status?.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-700 border border-green-300"
                                : "bg-yellow-100 text-yellow-700 border border-yellow-300"
                                }`}
                            >
                              {plan.status || "Unknown"}
                            </span>
                          </div>

                          {/* --- Coating Section --- 
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {Object.entries(plan)
                              .filter(
                                ([key]) =>
                                  key.startsWith("fm_") ||
                                  key.startsWith("lm_")
                              )
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between items-center border rounded-lg p-3 bg-gray-50"
                                >
                                  <p className="capitalize text-gray-600 font-medium">
                                    {key.replace(/_/g, " ")}
                                  </p>
                                  <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${value
                                      ? "bg-green-100 text-green-700 border border-green-300"
                                      : "bg-red-100 text-red-600 border border-red-300"
                                      }`}
                                  >
                                    {value ? "Yes" : "No"}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No plan products found.</p>
                )}
              </section>


              <Separator />

              {/* Schedules 
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Schedules</h3>

                {formData.schedules && formData.schedules.length > 0 ? (
                  <div className="space-y-4">
                    {formData.schedules.map((schedule, index) => (
                      <Card
                        key={index}
                        className="border shadow-sm hover:shadow-md transition-all rounded-xl w-full"
                      >
                        <CardContent className="p-6 w-full">

                          {/* 2-Column Grid 
                          <div className="grid sm:grid-cols-2 grid-rows-1 gap-x-6 gap-y-4">
                            {Object.entries(schedule).map(([key, val]) => {
                              if (["id", "schedule_id", "product_plan", "status"].includes(key))
                                return null;

                              return (
                                <div key={key} className="flex items-center ">
                                  <p className="text-gray-500 font-medium capitalize text-sm mr-4">
                                    {key.replace(/_/g, " ")}
                                  </p>
                                  {" - "}
                                  <p className="font-semibold text-gray-800  break-words ml-4">
                                    {val?.toString() || "-"}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No schedules available.</p>
                )}
              </section>



              <Separator />

              {/* Schedule Processes 
              <section>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Schedule Processes</h3>
                {formData.schedule_processes?.length ? (
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="w-full text-sm text-gray-800">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border px-3 py-2 text-left font-semibold">Schedule Name</th>
                          {Object.keys(formData.schedule_processes[0])
                            .filter(
                              (key) =>
                                !["id", "schedule_id", "status", "product_plan", "schedule_name"].includes(
                                  key
                                )
                            )
                            .map((key) => (
                              <th key={key} className="border px-3 py-2 capitalize text-left">
                                {key.replace(/_/g, " ")}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {formData.schedule_processes.map((row, index) => {
                          const scheduleNames = ["Laser", "Folding", "Forming"];
                          const scheduleName = scheduleNames[index] || `Process ${index + 1}`;
                          return (
                            <tr key={index} className="border-t hover:bg-gray-50">
                              <td className="border px-3 py-2 font-semibold text-gray-900">
                                {scheduleName}
                              </td>
                              {Object.entries(row)
                                .filter(
                                  ([key]) =>
                                    !["id", "schedule_id", "status", "product_plan", "schedule_name"].includes(
                                      key
                                    )
                                )
                                .map(([_, val], i) => (
                                  <td key={i} className="border px-3 py-2">
                                    {val?.toString() || "-"}
                                  </td>
                                ))}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No process data available.</p>
                )}
              </section>


            </div>
          )} */}

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
