import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Material } from "@/types/inward.type";

interface QAFormProps {
  productId: number;
  companyName: string;
  materials: Material[];
  onBack: () => void;
  onSubmitSuccess?: () => void;
}

// ✅ Strong type for QA form data
interface QAFormData {
  material_details: string;
  processed_date: string;
  shift: string;
  no_of_sheets: string;
  cycletime_per_sheet: string;
  total_cycle_time: number;
  machine_used: string;
  operator_name: string;
}

// 🔧 Reusable Input Field
const InputField = ({
  label,
  name,
  value,
  type,
  onChange,
  error,
}: {
  label: string;
  name: string;
  value: string | number;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}) => (
  <div className="flex flex-col space-y-1.5">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${error
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-blue-500"
        }`}
    />
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  spanFull,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
  spanFull?: boolean;
}) => (
  <div
    className={`flex flex-col space-y-1.5 ${spanFull ? "md:col-span-2" : ""
      }`}
  >
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${error
        ? "border-red-500 focus:ring-red-400"
        : "border-gray-300 focus:ring-blue-500"
        }`}
    >
      <option value="">Select {label}</option>
      {options.map((op, idx) => (
        <option key={idx} value={op}>
          {op}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

const QAForm: React.FC<QAFormProps> = ({
  productId,
  companyName,
  materials,
  onBack,
  onSubmitSuccess,
}) => {
  const { toast } = useToast();
  const [operators, setOperators] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<QAFormData>({
    material_details: "",
    processed_date: new Date().toISOString().split("T")[0],
    shift: "",
    no_of_sheets: "",
    cycletime_per_sheet: "",
    total_cycle_time: 0,
    machine_used: "",
    operator_name: "",
  });

  useEffect(() => {
    console.log("📦 QAForm materials received:", materials);
  }, [materials]);

  const userRole = localStorage.getItem("Role_Type");
  const username = localStorage.getItem("username");
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Static operator list
  useEffect(() => {
    setOperators([
      "John Doe",
      "Sarah Lee",
      "Michael Smith",
      "Priya Kumar",
      "Rajesh Patel",
      "Emma Johnson",
    ]);
  }, []);

  // ✅ Handle Input Changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "no_of_sheets" || name === "cycletime_per_sheet") {
      const sheets = Number(
        name === "no_of_sheets" ? value : formData.no_of_sheets
      );
      const cycle = Number(
        name === "cycletime_per_sheet" ? value : formData.cycletime_per_sheet
      );
      updated.total_cycle_time = sheets && cycle ? sheets * cycle : 0;
    }

    setFormData(updated);
    validateField(name, value);
  };

  // ✅ Field Validation
  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value.trim()) error = "This field is required.";
    else if (
      ["no_of_sheets", "cycletime_per_sheet"].includes(name) &&
      (isNaN(Number(value)) || Number(value) <= 0)
    )
      error = "Must be a positive number.";

    setFormErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  // ✅ Validate All
  const validateForm = () => {
    const required: (keyof QAFormData)[] = [
      "material_details",
      "processed_date",
      "shift",
      "no_of_sheets",
      "cycletime_per_sheet",
      "machine_used",
      "operator_name",
    ];

    let hasError = false;
    const newErrors: Record<string, string> = {};

    required.forEach((field) => {
      const val = formData[field];
      const err = validateField(field, String(val));
      if (err) hasError = true;
      newErrors[field] = err;
    });

    setFormErrors(newErrors);
    return !hasError;
  };

  // ✅ Open Confirmation
  const handleOpenConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast({
        title: "Validation Error ❌",
        description: "Please fix highlighted fields before submitting.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirm(true);
  };

  // ✅ Submit to backend
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload: Record<string, any> = {
      product_details: productId,
      ...formData,
      no_of_sheets: Number(formData.no_of_sheets),
      cycletime_per_sheet: Number(formData.cycletime_per_sheet),
    };

    if (userRole?.toLowerCase() === "qa") payload.created_by_qa = username;
    else if (userRole?.toLowerCase() === "accountent")
      payload.created_by_acc = username;

    try {
      const res = await fetch(`${API_URL}/api/add_qa_details/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Failed to submit QA data");

      toast({
        title: "✅ QA Submitted",
        description: "QA data successfully saved.",
      });
      onSubmitSuccess?.();
      onBack();
    } catch (err) {
      toast({
        title: "Error",
        description:
          err.message || "Something went wrong while saving QA data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl p-6 sm:p-10 border shadow-md">
      <h2 className="text-3xl font-bold text-left text-gray-800 mb-10">
        QA Form — {companyName}
      </h2>

      <form onSubmit={handleOpenConfirm} className="space-y-8">
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
              .filter((mat) => mat.qa_status === "pending")
              .map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.mat_type} ({mat.mat_grade}) — {mat.thick}mm ×{" "}
                  {mat.width} × {mat.length}
                </option>
              ))}
          </select>
          {formErrors.material_details && (
            <span className="text-red-500 text-xs">
              {formErrors.material_details}
            </span>
          )}
        </div>

        {/* Other Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Processed Date"
            name="processed_Date"
            type="date"
            value={formData.processed_date}
            onChange={handleChange}
            error={formErrors.processed_date}
          />
          <SelectField
            label="Shift"
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            options={["Morning", "Evening", "Night"]}
            error={formErrors.shift}
          />
          <InputField
            label="No. of Sheets Processed"
            name="no_of_sheets"
            type="number"
            value={formData.no_of_sheets}
            onChange={handleChange}
            error={formErrors.no_of_sheets}
          />
          <InputField
            label="Cycle Time Per Sheet (mins)"
            name="cycletime_per_sheet"
            type="number"
            value={formData.cycletime_per_sheet}
            onChange={handleChange}
            error={formErrors.cycletime_per_sheet}
          />
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Total Cycle Time (mins)
            </label>
            <input
              type="number"
              value={formData.total_cycle_time}
              readOnly
              className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 cursor-not-allowed text-gray-600"
            />
          </div>
          <SelectField
            label="Machine"
            name="machine_used"
            value={formData.machine_used}
            onChange={handleChange}
            options={[
              "MAHA",
              "BLAZE",
            ]}
            error={formErrors.machine_used}
          />

          <SelectField
            label="Operator"
            name="operator_name"
            value={formData.operator_name}
            onChange={handleChange}
            options={operators}
            error={formErrors.operator_name}
            spanFull
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl shadow-md w-full sm:w-auto"
          >
            Submit QA Form
          </Button>
          <Button
            type="button"
            onClick={onBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              Confirm Submission
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mt-2">
            Are you sure you want to submit this QA record for{" "}
            <strong>{companyName}</strong>?
          </p>
          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-blue-700 hover:bg-blue-800 text-white"
            >
              {isSubmitting ? "Submitting..." : "Confirm & Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QAForm;
