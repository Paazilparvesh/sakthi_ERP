import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StepProgressBar } from "@/components/ReusableComponents/StepProgressBar";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProgramerFormData {
  program_no: string;
  program_date: string;
  Pland_Qty: string;
  Bal_Qty: string;
  UsedWeightInKgs: string;
  components_per_sheet: string;
  cut_length_per_sheet: string;
  pierce_per_sheet: string;
  planned_mins_per_sheet: string;
  planned_hours_total: string;
  total_meter: string;
  total_piercing: string;
  total_used_weight_kg: string;
  total_components: string;
  product_details: number;
}

interface ProgramerFormWrapperProps {
  item: number;
  onBack?: () => void;
  onSuccess?: () => void;
}

const ProgramerFormWrapper: React.FC<ProgramerFormWrapperProps> = ({
  item,
  onBack,
  onSuccess,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const totalSteps = 2;

  const userName = localStorage.getItem("username")

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ProgramerFormData>({
    program_no: "",
    program_date: "",
    Pland_Qty: "",
    Bal_Qty: "",
    UsedWeightInKgs: "",
    components_per_sheet: "",
    cut_length_per_sheet: "",
    pierce_per_sheet: "",
    planned_mins_per_sheet: "",
    planned_hours_total: "",
    total_meter: "",
    total_piercing: "",
    total_used_weight_kg: "",
    total_components: "",
    product_details: item,
  });

  // ✅ keep product ID synced if `item` changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, product_details: item }));
  }, [item]);

  // ✅ Auto-fill today's date
  useEffect(() => {
    if (!formData.program_date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
      setFormData((prev) => ({ ...prev, program_date: formattedDate }));
    }
  }, []);

  // ✅ Auto-generate Program Number once on mount
  useEffect(() => {
    if (!formData.program_no) {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2); // e.g. "25"
      const month = String(now.getMonth() + 1).padStart(2, "0"); // e.g. "11"
      const initials = userName.substring(0, 2).toUpperCase(); // e.g. "AD"

      // Retrieve last number from localStorage (persistent counter)
      const lastNumber = parseInt(localStorage.getItem("lastProgramNo") || "0", 10);
      const nextNumber = lastNumber + 1;
      const formattedNumber = String(nextNumber).padStart(3, "0"); // e.g. 001

      const generatedProgramNo = `${year}${month}${initials}-${formattedNumber}`;

      // ✅ Update localStorage and form
      localStorage.setItem("lastProgramNo", nextNumber.toString());
      setFormData((prev) => ({ ...prev, program_no: generatedProgramNo }));
    }
  }, [userName, formData.program_no]);


  const handleValidateAll = () => {
    const fieldsToCheck = Object.keys(formData).filter(
      (k) => !["product_details"].includes(k)
    );

    let hasError = false;
    fieldsToCheck.forEach((key) => {
      const error = validateField(key, formData[key as keyof ProgramerFormData]);
      if (error) hasError = true;
    });

    if (hasError) {
      toast({
        title: "Please fix highlighted fields",
        description: "Some inputs are missing or invalid.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };



  const validateField = (name: string, value: string) => {
    let error = "";

    if (!value.trim()) {
      error = `${LABELS[name as keyof ProgramerFormData]} is required.`;
    } else if (
      [
        "Pland_Qty",
        "Bal_Qty",
        "UsedWeightInKgs",
        "components_per_sheet",
        "cut_length_per_sheet",
        "pierce_per_sheet",
        "planned_mins_per_sheet",
        "planned_hours_total",
        "total_meter",
        "total_piercing",
        "total_used_weight_kg",
        "total_components",
      ].includes(name) &&
      isNaN(Number(value))
    ) {
      error = `${LABELS[name as keyof ProgramerFormData]} must be a number.`;
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };


  const handleNext = () => {
    const fieldsToCheck =
      currentStep === 1
        ? ["program_no", "program_date"]
        : Object.keys(formData).filter(
          (k) => !["program_no", "program_date", "product_details"].includes(k)
        );

    let hasError = false;
    fieldsToCheck.forEach((key) => {
      const error = validateField(key, formData[key as keyof ProgramerFormData]);
      if (error) hasError = true;
    });

    if (hasError) {
      toast({
        title: "Please fix highlighted fields",
        description: "Some inputs are missing or invalid.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };


  const handleBack = () => {
    if (currentStep === 1) {
      onBack?.(); // Go back to previous view
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  // ✅ Enhanced handleChange
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async () => {
    setConfirmOpen(false);
    const created_by = localStorage.getItem("username");
    if (!created_by) {
      toast({
        title: "Error",
        description: "User not logged in.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.product_details) {
      toast({
        title: "Error",
        description: "Product ID is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = { ...formData, created_by };

      const response = await fetch(`${API_URL}/api/add_programer_Details/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Programer details added successfully.",
        });
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Submission failed:", error);
      toast({
        title: "Error",
        description: "Failed to submit programmer details.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Field Label Map for Readable Names
  const LABELS: Record<keyof ProgramerFormData, string> = {
    program_no: "Programer Number",
    program_date: "Program Date",
    Pland_Qty: "Planned Quantity",
    Bal_Qty: "Balance Quantity",
    UsedWeightInKgs: "Used Weight (Kg)",
    components_per_sheet: "Components per Sheet",
    cut_length_per_sheet: "Cut Length per Sheet",
    pierce_per_sheet: "Pierce per Sheet",
    planned_mins_per_sheet: "Planned Minutes per Sheet",
    planned_hours_total: "Planned Total Hours",
    total_meter: "Total Meters",
    total_piercing: "Total Piercings",
    total_used_weight_kg: "Total Used Weight (Kg)",
    total_components: "Total Components",
    product_details: "Product ID", // still for label map
  };

  // --- UI Rendering
  return (
    <>
      {/* Confirmation Modal */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this programmer data? Once submitted, it cannot be edited.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-700 hover:bg-green-800 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl pt-2">
        {/* Progress Steps */}
        <StepProgressBar
          steps={["Programer Details", "Planning Data"]}
          currentStep={currentStep}
          activeColor="bg-blue-900"
          inactiveColor="bg-gray-300"
        />

        <div className="mt-8 space-y-6">
          {/* --- Step 1 --- */}
          {currentStep === 1 && (
            <div className="grid md:grid-cols-2 gap-6">
              {["program_no", "program_date"].map((key) => (
                <div key={key} className="flex flex-col space-y-1.5">
                  <label
                    htmlFor={key}
                    className="text-sm font-medium text-gray-700"
                  >
                    {LABELS[key as keyof ProgramerFormData]}
                  </label>
                  <input
                    type={key === "program_date" ? "date" : "text"}
                    name={key}
                    id={key}
                    value={formData[key as keyof ProgramerFormData]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={LABELS[key as keyof ProgramerFormData]}
                    className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors[key]
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  />
                  {formErrors[key] && (
                    <span className="text-red-500 text-xs">{formErrors[key]}</span>
                  )}
                </div>
              ))}

            </div>
          )}

          {/* --- Step 2 --- */}
          {currentStep === 2 && (
            <div className="grid md:grid-cols-3 gap-6">
              {Object.keys(formData)
                .filter(
                  (k) =>
                    !["program_no", "program_date", "product_details"].includes(k)
                )
                .map((key) => (
                  <div key={key} className="flex flex-col space-y-1.5">
                    <label
                      htmlFor={key}
                      className="text-sm font-medium text-gray-700"
                    >
                      {LABELS[key as keyof ProgramerFormData]}
                    </label>
                    <input
                      type="text"
                      name={key}
                      id={key}
                      value={formData[key as keyof ProgramerFormData]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder={LABELS[key as keyof ProgramerFormData]}
                      className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors[key]
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-500"
                        }`}
                    />
                    {formErrors[key] && (
                      <span className="text-red-500 text-xs">{formErrors[key]}</span>
                    )}
                  </div>
                ))}

            </div>
          )}
        </div>

        {/* --- Navigation Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 w-full sm:w-auto"
          >
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              className="bg-blue-900 text-white px-6 py-3 rounded-xl hover:bg-blue-800 w-full sm:w-auto"
              onClick={handleNext}
            >
              Next
            </Button>
          ) : (
            <Button
              className="bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-800 w-full sm:w-auto"
              onClick={() => {
                const isValid = handleValidateAll();
                if (isValid) setConfirmOpen(true);
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>

          )}
        </div>
      </div>
    </>
  );
};

export default ProgramerFormWrapper;
