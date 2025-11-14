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

  const allowOnlyNumbers = (value: string) => /^(\d+(\.\d*)?|\.\d+)?$/.test(value);


  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedMaterialQty, setSelectedMaterialQty] = useState<number>(0);

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

  // keep product ID synced if `item` changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, product_details: item.id }));
  }, [item]);

  // Auto-fill today's date
  useEffect(() => {
    if (!formData.program_date) {
      const today = new Date();
      const formattedDate = today.toISOString().split("T")[0]; // "YYYY-MM-DD"
      setFormData((prev) => ({ ...prev, program_date: formattedDate }));
    }
  }, [formData.program_date]);

  // Auto-generate Program Number once on mount
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


  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...recalculateTotals(prev) }));
  }, [
    formData.number_of_sheets,
    formData.processed_quantity,
    formData.pierce_per_sheet,
    formData.used_weight,
    formData.processed_mins_per_sheet,
    formData.cut_length_per_sheet,
  ]);


  const recalculateTotals = (data: ProgramerFormData) => {
    const num = (v: string) => Number(v) || 0;
    const totalPlannedHours = num(data.processed_quantity) * num(data.processed_mins_per_sheet);
    const totalMeters = num(data.processed_quantity) * num(data.cut_length_per_sheet);
    const totalPiercing = num(data.processed_quantity) * num(data.pierce_per_sheet);
    const totalWeight = num(data.processed_quantity) * num(data.used_weight);
    const totalSheet = num(data.processed_quantity) * num(data.number_of_sheets);

    return {
      total_piercing: totalPiercing.toString(),
      total_used_weight: totalWeight.toString(),
      total_planned_hours: totalPlannedHours.toString(),
      total_meters: totalMeters.toString(),
      total_no_of_sheets: totalSheet.toString(),
    };
  };

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
    let hasError = false;

    // ✅ Step 1 validation
    if (currentStep === 1) {
      // Check if material is selected
      if (!formData.material_details) {
        setFormErrors((prev) => ({
          ...prev,
          material_details: "Please select a material before proceeding.",
        }));
        hasError = true;
      }

      // Validate Program No and Date
      ["program_no", "program_date"].forEach((key) => {
        const error = validateField(key, String(formData[key as keyof ProgramerFormData]));
        if (error) hasError = true;
      });
    }

    // ✅ Step 2 validation
    else {
      const fieldsToCheck = Object.keys(formData).filter(
        (k) =>
          ![
            "program_no",
            "program_date",
            "product_details",
            "created_by",
            "material_details",
          ].includes(k)
      );

      fieldsToCheck.forEach((key) => {
        const error = validateField(key, String(formData[key as keyof ProgramerFormData]));
        if (error) hasError = true;
      });
    }

    // ✅ Show toast if validation failed
    if (hasError) {
      toast({
        title: "Missing required fields",
        description: "Please select a material and fill all required inputs before continuing.",
        variant: "destructive",
      });
      return;
    }

    // ✅ If all good, go to next step
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    if (currentStep === 1) {
      onBack?.(); // Go back to previous view
    } else {
      setCurrentStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // 🔹 Numeric fields (auto-block invalid input)
    const numericFields = [
      "processed_quantity",
      "used_weight",
      "number_of_sheets",
      "cut_length_per_sheet",
      "pierce_per_sheet",
      "processed_mins_per_sheet",
    ];

    if (numericFields.includes(name)) {
      if (!allowOnlyNumbers(value)) return; // ❌ block invalid
    }

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // 🔹 When material changes → reset quantities
      if (name === "material_details") {
        const selectedMat = materials.find((m) => m.id === Number(value));
        const qty = Number(selectedMat?.quantity) || 0;
        setSelectedMaterialQty(qty);

        updated.processed_quantity = "";
        updated.balance_quantity = qty.toString();
      }

      // 🔹 Auto-update balance
      if (name === "processed_quantity") {
        const processed = Number(value) || 0;
        let balance = selectedMaterialQty - processed;

        if (balance < 0) balance = 0; // prevent negative

        updated.balance_quantity = balance.toString();
      }

      return updated;
    });
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
    processed_quantity: "Processed Quantity",
    balance_quantity: "Balance Quantity",
    used_weight: "Used Weight (Kg)",
    number_of_sheets: "Number of Sheets",
    cut_length_per_sheet: "Cut Length per Sheet",
    pierce_per_sheet: "Pierce per Sheet",
    processed_mins_per_sheet: "Minutes Processed per Sheet",
    total_planned_hours: "Total Processed Hours",
    total_meters: "Total Meters",
    total_piercing: "Total Piercings",
    total_used_weight: "Total Used Weight (Kg)",
    total_no_of_sheets: "Total No.of Sheets",
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
            <Button variant="outline" onClick={() => setConfirmOpen(false)} className="hover:by-gray-400">
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

      <div className="w-full mx-auto bg-white rounded-3xl p-4">
        {/* Progress Steps */}
        <StepProgressBar
          steps={["Programer Details", "Program Data"]}
          currentStep={currentStep}
          activeColor="bg-blue-700"
          inactiveColor="bg-gray-300"
        />

        <div className="mt-8 space-y-6">
          {/* --- Step 1 --- */}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Material Dropdown */}
                <div className="flex flex-col space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Material</label>
                  <select
                    name="material_details"
                    value={formData.material_details}
                    onChange={handleChange}
                    className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors.material_details
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                      }`}
                  >
                    <option value="">Select Material</option>
                    {materials
                      .filter((mat) => mat.programer_status === "pending")
                      .map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.mat_type} ({mat.mat_grade}) - {mat.thick}mm × {mat.width} ×{" "}
                          {mat.length}
                        </option>
                      ))}
                  </select>
                  {formErrors.material_details && (
                    <span className="text-red-500 text-xs">
                      {formErrors.material_details}
                    </span>
                  )}
                </div>

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
            </div>
          )}


          {/* --- Step 2 --- */}
          {currentStep === 2 && (
            <div className="space-y-8 px-12">
              {/* 🔹 User Input Fields */}
              <section>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  User Input Fields
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "processed_quantity",
                    "used_weight",
                    "number_of_sheets",
                    "cut_length_per_sheet",
                    "pierce_per_sheet",
                    "processed_mins_per_sheet",
                  ].map((key) => (
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
              </section>

              {/* 🔹 Auto-Calculated Fields */}
              <section>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  Auto-Calculated Fields
                  <span className="text-xs text-gray-500 font-normal">
                    (read-only values calculated automatically)
                  </span>
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    "balance_quantity",
                    "total_planned_hours",
                    "total_meters",
                    "total_piercing",
                    "total_used_weight",
                    "total_no_of_sheets",
                  ].map((key) => (
                    <div key={key} className="flex flex-col space-y-1.5">
                      <label
                        htmlFor={key}
                        className="text-sm font-medium text-gray-700 flex items-center gap-2"
                      >
                        {LABELS[key as keyof ProgramerFormData]}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-gray-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a4 4 0 00-4 4v2H5a1 1 0 00-1 1v9a1 1 0 001 1h10a1 1 0 001-1v-9a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zm-2 6V6a2 2 0 114 0v2H8zm2 6a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </label>
                      <input
                        type="text"
                        name={key}
                        id={key}
                        value={formData[key as keyof ProgramerFormData]}
                        readOnly
                        className="border border-gray-200 bg-gray-50 text-gray-600 rounded-lg px-3 py-2 cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

        </div>

        {/* --- Navigation Buttons --- */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 hover:text-gray-700 w-full sm:w-auto"
          >
            Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              className="bg-blue-700 text-white px-6 py-3 rounded-xl hover:bg-blue-600 w-full sm:w-auto"
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
