import React, { useEffect, useState } from "react";
// UI
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
// Components
import MaterialForm from "@/components/InwardComponents/InwardForm";
import ProductTable from "@/components/InwardComponents/InwardTable";
import InspectionDetails from "@/components/InwardComponents/InwardSummary";
import { StepProgressBar } from "@/components/ReusableComponents/StepProgressBar";
// Types
import { ProductType } from "@/types/inward.type";
// api
import { fetchJSON } from "@/utils/api";



const InwardDashboard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);
  const [nextSerial, setNextSerial] = useState("0001");

  const API_URL = import.meta.env.VITE_API_URL;
  const steps = ["Material Details", "Add Product", "Summary"];

  const getTodayDate = (): string => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<ProductType>({
    serial_number: nextSerial,
    date: getTodayDate(),
    inward_slip_number: "",
    ratio: "",
    wo_no: "",
    tec: "",
    Company_name: "",
    Customer_name: "",
    Customer_No: "",
    mobile: "",
    Test_Certificate: false,
    status: "pending",
    materials: [
      {
        Thick: "",
        Width: "",
        Length: "",
        UnitWeight: "",
        Density: "",
        Quantity: "",
        mat_type: "",
        mat_grade: "",
        Remarks: "",
      },
    ],
  });


  // 🔹 Fetch total products and calculate next serial
  const getTotalProducts = async () => {
    try {
      const data = await fetchJSON<{ "Total Product": number }>(
        `${API_URL}/api/total_product/`
      );
      const count = data["Total Product"] ?? 0;
      setTotalProducts(count);
      setNextSerial((count + 1).toString().padStart(4, "0"));
    } catch (error) {
      console.error("❌ Error fetching total products:", error);
    }
  }

  useEffect(() => {
    getTotalProducts();
  });

  // ✅ Sync serial number when nextSerial updates
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      serial_number: nextSerial,
    }));
  }, [nextSerial]);

  const validateStep1 = (formData: ProductType): boolean => {
    const errors: string[] = [];

    if (!formData.Company_name.trim()) errors.push("Company name");
    if (!formData.Customer_name.trim()) errors.push("Customer name");
    if (!formData.Customer_No.trim() || !/^\d+$/.test(formData.Customer_No))
      errors.push("Customer No");

    if (!formData.mobile.trim()) errors.push("Mobile No");
    else if (!/^\d+$/.test(formData.mobile)) errors.push("Mobile must contain only digits");
    else if (formData.mobile.trim().length < 10) errors.push("Mobile must be at least 10 digits");

    if (!formData.date) errors.push("Date");
    if (!formData.serial_number.trim()) errors.push("Serial number");

    if (errors.length > 0) {
      toast({
        title: "Incomplete Form",
        description: "Please fill all required fields correctly.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const validateStep2 = (formData: ProductType): boolean => {

    const materials = formData.materials || [];
    // ✅ Ensure at least one row exists
    if (materials.length === 0) {
      toast({
        title: "No Materials Added",
        description: "Please add at least one material before continuing.",
        variant: "destructive",
      });
      return false;
    }

    for (let i = 0; i < materials.length; i++) {
      const mat = materials[i];
      // ✅ Validate Length, Breadth, Height
      if (!mat.Thick || !mat.Width || !mat.Length || !mat.UnitWeight) {
        toast({
          title: "Incomplete Dimensions",
          description: `Please fill all fields (Thick × Width × Length × Weight) for row ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }

      // ✅ Validate numeric inputs
      if (
        isNaN(Number(mat.Thick)) ||
        isNaN(Number(mat.Width)) ||
        isNaN(Number(mat.Length)) ||
        isNaN(Number(mat.UnitWeight))
      ) {
        toast({
          title: "Invalid Input",
          description: `All values must be numeric in row ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }


      // ✅ Validate Quantity
      if (!mat.Quantity[i] || Number(mat.Quantity[i]) <= 0) {
        toast({
          title: "Invalid Quantity",
          description: `Enter a valid quantity for row ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  // 🔹 Step Navigation Handlers
  const handleNext = () => {
    if (step === 1 && !validateStep1(formData)) return;
    if (step === 2 && !validateStep2(formData)) return;
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => step > 1 && setStep((prev) => prev - 1);

  // 🔹 Reset Form
  const resetForm = () => {
    setStep(1);
    setFormData({
      serial_number: nextSerial,
      date: getTodayDate(),
      inward_slip_number: "",
      ratio: "",
      wo_no: "",
      tec: "",
      Company_name: "",
      Customer_name: "",
      Customer_No: "",
      mobile: "",
      Test_Certificate: false,
      status: "pending",
      materials: [
        {
          Thick: "",
          Width: "",
          Length: "",
          UnitWeight: "",
          Density: "",
          Quantity: "",
          mat_type: "",
          mat_grade: "",
          Remarks: "",
        },
      ],
    });
    setShowModal(false);
  };


  const handleConfirm = async () => {
    if (isSubmitting) return; // Prevent double-click submissions
    setIsSubmitting(true); // Disable button + start loading  

    const created_by = localStorage.getItem("username")

    try {
      // ✅ Combine Product + Materials into a single payload
      const combinedPayload = {
        Company_name: formData.Company_name,
        serial_number: formData.serial_number,
        date: formData.date,
        inward_slip_number: formData.inward_slip_number,
        ratio: formData.ratio,
        wo_no: formData.wo_no,
        tec: formData.tec,
        Customer_name: formData.Customer_name,
        Customer_No: formData.Customer_No,
        mobile: formData.mobile,
        created_by: created_by,
        materials: formData.materials.map((mat, index) => ({
          Thick: mat.Thick,
          Width: mat.Width,
          Length: mat.Length,
          UnitWeight: mat.UnitWeight,
          Density: mat.Density,
          Quantity: mat.Quantity,
          mat_type: mat.mat_type,
          mat_grade: mat.mat_grade,
          Remarks: mat.Remarks,
        })),
      };

      console.log("🟢 Payload :", combinedPayload);

      // ✅ Single API Call
      const response = await fetchJSON(`${API_URL}/api/add_full_product/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedPayload),
      });

      console.log("✅ Success:", response);

      toast({
        title: "Form Submitted Successfully!",
        description: "Product and materials saved together.",
      });

      resetForm();
      await getTotalProducts();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while saving data.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false); // Re-enable button after completion
    }
  };

  return (
    <div className=" flex flex-col items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full space-y-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-800 leading-tight">
          MATERIAL INWARD CUM INCOMING INSPECTION REPORT
        </h1>

        {/* Step Progress */}
        <StepProgressBar
          steps={steps}
          currentStep={step}
        />


        {/* Step Components */}
        <div className="w-full space-y-6">
          {step === 1 && <MaterialForm formData={formData} setFormData={setFormData} />}
          {step === 2 && <ProductTable formData={formData} setFormData={setFormData} />}
          {step === 3 && <InspectionDetails formData={formData} setFormData={setFormData} />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          {step > 1 && (
            <Button
              variant="outline"
              className="border-gray-400 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-xl hover:bg-gray-100 hover:text-gray-700 w-full sm:w-auto"
              onClick={handleBack}
            >
              Back
            </Button>
          )}

          {step < 3 && (
            <Button
              className="bg-blue-900 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-xl hover:bg-blue-800 w-full sm:w-auto"
              onClick={handleNext}
            >
              {step === 1 ? "Add Product" : "Next"}
            </Button>
          )}

          {step === 3 && (
            <Button
              className="bg-green-700 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-xl hover:bg-green-800 w-full sm:w-auto"
              onClick={() => setShowModal(true)}
            >
              Confirm
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Confirm Submission</h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Please check your inputs carefully. Once submitted, changes cannot be made.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 w-full sm:w-auto"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
              <Button
                variant="outline"
                className="px-6 py-2 rounded-lg text-gray-700 hover:text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>

  );
};

export default InwardDashboard;
