import React, { useState } from "react";
import MaterialForm from "@/components/Role1Components/MaterialForm";
import ProductTable from "@/components/Role1Components/ProductTable";
import { InspectionDetails } from "@/components/Role1Components/InspectionDetail";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { MaterialInwardForm, AddProductResponse } from "@/types/role1.type.ts";

interface StepProgressBarProps {
  step: number;
}

// ✅ Step progress bar component (same as before)
const StepProgressBar: React.FC<StepProgressBarProps> = ({ step }) => {
  const steps = ["Material Details", "Add Product", "Inspection"];

  return (
    <div className="flex justify-between items-center relative mb-10 mt-6 w-full px-4 sm:px-6">
      {steps.map((label, index) => {
        const current = index + 1;
        const isActive = step >= current;
        const isCompleted = step > current;

        return (
          <div key={index} className="flex-1 flex flex-col items-center relative">
            {/* Step circle */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-semibold transition-all duration-300 z-10
                ${isActive ? "bg-blue-900 scale-110 shadow-lg" : "bg-gray-300"}
              `}
            >
              {current}
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-xs sm:text-sm font-medium text-center ${isActive ? "text-blue-900" : "text-gray-500"}`}
            >
              {label}
            </p>

            {/* Connecting line (except last step) */}
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-[50px] md:left-[210px] w-full h-1 bg-gray-300 z-0">
                <div
                  className={`h-1 bg-blue-900 transition-all duration-500`}
                  style={{
                    width: `${isCompleted ? 100 : 0}%`,
                  }}
                ></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const Role1Dashboard: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [showModal, setShowModal] = useState(false); // <-- modal visibility
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getTodayDate = (): string => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<MaterialInwardForm>({
    Company_name: "",
    serial_number: "",
    date: getTodayDate(),
    Customer_name: "",
    Customer_No: "",
    Customer_date: getTodayDate(),
    material_Description: [],
    Quantity: [],
    mobile: "",
    Remarks: [],
    size: false,
    Thick: false,
    Grade: false,
    Drawing: false,
    Test_Certificate: false,
    status: "pending",
  });

  const validateStep1 = (): boolean => {
    const errors: string[] = [];
    if (!formData.Company_name.trim()) errors.push("Company name");
    if (!formData.Customer_name.trim()) errors.push("Customer name");
    if (!formData.Customer_No.trim() || !/^\d+$/.test(formData.Customer_No))
      errors.push("Customer No");
    // ✅ Mobile validation: must be numeric and at least 10 digits
  if (!formData.mobile.trim()) {
    errors.push("Mobile No");
  } else if (!/^\d+$/.test(formData.mobile)) {
    errors.push("Mobile No must contain only digits");
  } else if (formData.mobile.trim().length < 10) {
    errors.push("Mobile No must be at least 10 digits");
  }
    if (!formData.date) errors.push("Date");
    if (!formData.Customer_date) errors.push("Customer date");
    if (!formData.serial_number.trim()) errors.push("Serial number");

    if (errors.length > 0) {
      toast({ 
        title: "Incomplete Form",
        description: "Please fill all required fields correctly before proceeding.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateStep2 = (): boolean => {
    const { material_Description, Quantity } = formData;
    if (material_Description.length === 0) {
      toast({
        title: "No Products Added",
        description: "Please add at least one product before continuing.",
        variant: "destructive",
      });
      return false;
    }
    for (let i = 0; i < material_Description.length; i++) {
      if (!material_Description[i].trim()) {
        toast({
          title: "Invalid Entry",
          description: `Material description is required for row ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }
      if (!Quantity[i] || isNaN(Number(Quantity[i]))) {
        toast({
          title: "Invalid Entry",
          description: `Quantity must be numeric for row ${i + 1}.`,
          variant: "destructive",
        });
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < 3) setStep((prev) => prev + 1);
  };

  const handleBack = () => step > 1 && setStep((prev) => prev - 1);

  async function addProductDetails(data: MaterialInwardForm): Promise<AddProductResponse> {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/api/add_product_details/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.msg || "Failed to add product");
    }
    return await response.json();
  }

  const handleConfirm = async () => {

    if (isSubmitting) return; // Prevent double-click submissions

    setIsSubmitting(true); // Disable button + start loading


    try {
      const response = await addProductDetails(formData);
      console.log("✅ Success:", response);
      toast({
        title: "Form Submitted Successfully!",
        description: "Your material inward details have been saved.",
      });
      setStep(1);
      setFormData({
        Company_name: "",
        serial_number: "",
        date: getTodayDate(),
        Customer_name: "",
        Customer_No: "",
        Customer_date: getTodayDate(),
        material_Description: [],
        Quantity: [],
        mobile: "",
        Remarks: [],
        size: false,
        Thick: false,
        Grade: false,
        Drawing: false,
        Test_Certificate: false,
        status: "pending",
      });
      setShowModal(false);
    } catch (err: unknown) {
      toast({
        title: "Submission Failed",
        description: "An error occurred while saving data.",
        variant: "destructive",
      });
      console.error(err);
    } finally {
    setIsSubmitting(false); // Re-enable button after completion
  }
  };

  return (
    <div className=" flex flex-col items-center bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-8xl space-y-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-gray-800 leading-tight">
          MATERIAL INWARD CUM INCOMING INSPECTION REPORT
        </h1>

        {/* Step Progress */}
        <StepProgressBar step={step} />

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
              className="border-gray-400 text-gray-700 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-xl hover:bg-gray-100 w-full sm:w-auto"
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
                className="px-6 py-2 rounded-lg text-gray-700 hover:bg-gray-100 w-full sm:w-auto"
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

export default Role1Dashboard;
