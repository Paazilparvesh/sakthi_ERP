import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StepProgressBar } from "@/components/ReusableComponents/StepProgressBar";
import { toast } from "@/hooks/use-toast";
import { ProductType, Material } from "@/types/inward.type";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProgramerFormData {
  product_details: number | string;
  material_details: number | string;
  program_no: string;
  program_date: string;
  processed_quantity: string;
  balance_quantity: string;
  used_weight: string;
  number_of_sheets: string;
  cut_length_per_sheet: string;
  pierce_per_sheet: string;
  processed_mins_per_sheet: string;
  total_planned_hours: string;
  total_meters: string;
  total_piercing: string;
  total_used_weight: string;
  total_no_of_sheets: string;
  created_by?: string;
}

interface ProgramerFormWrapperProps {
  item: ProductType;
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
  const materials: Material[] = item.materials || [];
  const userName = localStorage.getItem("username")

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ProgramerFormData>({
    product_details: item.id,
    material_details: "",
    program_no: "",
    program_date: "",
    processed_quantity: "",
    balance_quantity: "",
    used_weight: "",
    number_of_sheets: "",
    cut_length_per_sheet: "",
    pierce_per_sheet: "",
    processed_mins_per_sheet: "",
    total_planned_hours: "",
    total_meters: "",
    total_piercing: "",
    total_used_weight: "",
    total_no_of_sheets: "",
    created_by: ""
  });

  // ✅ keep product ID synced if `item` changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, product_details: item.id }));
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
    if (!formData.program_no && userName) {
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

    // ✅ Auto calculations for totals
  useEffect(() => {
    const {
      number_of_sheets,
      processed_quantity,
      pierce_per_sheet,
      used_weight,
      processed_mins_per_sheet,
    } = formData;

    const numSheets = Number(number_of_sheets) || 0;
    const piercePerSheet = Number(pierce_per_sheet) || 0;
    const weight = Number(used_weight) || 0;
    const minsPerSheet = Number(processed_mins_per_sheet) || 0;

    const totalPiercing = numSheets * piercePerSheet;
    const totalWeight = numSheets * weight;
    const totalPlannedHours = ((numSheets * minsPerSheet) / 60).toFixed(2);

    setFormData((prev) => ({
      ...prev,
      total_piercing: totalPiercing.toString(),
      total_used_weight: totalWeight.toString(),
      total_planned_hours: totalPlannedHours.toString(),
      total_no_of_sheets: numSheets.toString(),
    }));
  }, [
    formData.number_of_sheets,
    formData.pierce_per_sheet,
    formData.used_weight,
    formData.processed_mins_per_sheet,
  ]);


  const handleValidateAll = () => {
    const fieldsToCheck = Object.keys(formData).filter(
      (k) => !["product_details", "created_by"].includes(k)
    );

    let hasError = false;
    fieldsToCheck.forEach((key) => {
      const error = validateField(key, String(formData[key as keyof ProgramerFormData]));
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
        "processed_quantity",
        "balance_quantity",
        "used_weight",
        "number_of_sheets",
        "cut_length_per_sheet",
        "pierce_per_sheet",
        "processed_mins_per_sheet",
        "total_planned_hours",
        "total_meters",
        "total_piercing",
        "total_used_weight",
        "total_no_of_sheets",
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
      const error = validateField(key, String(formData[key as keyof ProgramerFormData]));
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
    product_details: "Product ID",
    material_details: "Material ID",
    program_no: "Programer Number",
    program_date: "Program Date",
    processed_quantity: "Planned Quantity",
    balance_quantity: "Balance Quantity",
    used_weight: "Used Weight (Kg)",
    number_of_sheets: "Components per Sheet",
    cut_length_per_sheet: "Cut Length per Sheet",
    pierce_per_sheet: "Pierce per Sheet",
    processed_mins_per_sheet: "Planned Minutes per Sheet",
    total_planned_hours: "Planned Total Hours",
    total_meters: "Total Meters",
    total_piercing: "Total Piercings",
    total_used_weight: "Total Used Weight (Kg)",
    total_no_of_sheets: "Total Components",
    created_by: "Created By",
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

              {/* ✅ Material Dropdown */}
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Material
                </label>
                <select
                  name="material_details"
                  value={formData.material_details}
                  onChange={handleChange}
                  className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${
                    formErrors.material_details
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select Material</option>
                  {materials.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {mat.mat_type} ({mat.mat_grade}) - {mat.thick}mm × {mat.width} × {mat.length}
                    </option>
                  ))}
                </select>
                {formErrors.material_details && (
                  <span className="text-red-500 text-xs">
                    {formErrors.material_details}
                  </span>
                )}
              </div>
              
            </div>
          )}

          {/* --- Step 2 --- */}
          {currentStep === 2 && (
            <div className="grid md:grid-cols-3 gap-6">
              {Object.keys(formData)
                .filter(
                  (k) =>
                    !["program_no", "program_date", "product_details", "created_by", "material_details"].includes(k)
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
