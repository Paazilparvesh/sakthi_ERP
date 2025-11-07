// 📁 src/components/OutwardComponents/QAForm.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface QAFormProps {
    productId: number;
    companyName: string;
    onBack: () => void;
    onSubmitSuccess?: () => void;
}

// ✅ Strong Type for QA Form
interface QAFormData {
    processed_Date: string;
    shift: string;
    No_of_sheets: string;
    cycletime_per_sheet: string;
    Total_cycle_time: number;
    Machine_used: string;
    operator_name: string;
}

// 🔧 Helper InputField Component
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
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
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
    <div className={`flex flex-col space-y-1.5 ${spanFull ? "md:col-span-2" : ""}`}>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${error ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-blue-500"
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

const QAForm: React.FC<QAFormProps> = ({ productId, companyName, onBack, onSubmitSuccess }) => {
    const { toast } = useToast();

    const [operators, setOperators] = useState<string[]>([]);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<QAFormData>({
        processed_Date: new Date().toISOString().split("T")[0],
        shift: "",
        No_of_sheets: "",
        cycletime_per_sheet: "",
        Total_cycle_time: 0,
        Machine_used: "",
        operator_name: "",
    });

    const userRole = localStorage.getItem("Role_Type");
    const username = localStorage.getItem("username");

    useEffect(() => {
        setOperators(["John Doe", "Sarah Lee", "Michael Smith", "Priya Kumar", "Rajesh Patel", "Emma Johnson"]);
    }, []);

    // ✅ Handle Input Changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updated = { ...formData, [name]: value };

        // Auto-calc total cycle time
        if (name === "No_of_sheets" || name === "cycletime_per_sheet") {
            const sheets = Number(name === "No_of_sheets" ? value : formData.No_of_sheets);
            const cycle = Number(name === "cycletime_per_sheet" ? value : formData.cycletime_per_sheet);
            updated.Total_cycle_time = sheets && cycle ? sheets * cycle : 0;
        }

        setFormData(updated);
        validateField(name, value);
    };

    // ✅ Field-level validation
    const validateField = (name: string, value: string) => {
        let error = "";
        if (!value.trim()) error = "This field is required.";
        else if (["No_of_sheets", "cycletime_per_sheet"].includes(name) && (isNaN(Number(value)) || Number(value) <= 0))
            error = "Must be a positive number.";
        setFormErrors((prev) => ({ ...prev, [name]: error }));
        return error;
    };

    // ✅ Validate all fields before modal
    const validateForm = () => {
        const fields: (keyof QAFormData)[] = [
            "processed_Date",
            "shift",
            "No_of_sheets",
            "cycletime_per_sheet",
            "Machine_used",
            "operator_name",
        ];
        let hasError = false;
        const newErrors: Record<string, string> = {};
        fields.forEach((field) => {
            const val = formData[field];
            const err = validateField(field, String(val));
            if (err) hasError = true;
            newErrors[field] = err;
        });
        setFormErrors(newErrors);
        return !hasError;
    };

    // ✅ Handle Confirm Modal open
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

    // ✅ Submit after confirmation
    const handleSubmit = async () => {
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            product_details: productId,
            ...formData,
            No_of_sheets: Number(formData.No_of_sheets),
            cycletime_per_sheet: Number(formData.cycletime_per_sheet),
        };

        if (userRole?.toLowerCase() === "qa") payload.created_by_qa = username;
        else if (userRole?.toLowerCase() === "accountent") payload.created_by_acc = username;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/add_qa_details/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to submit QA data");

            toast({ title: "✅ QA Submitted", description: "QA data successfully saved." });
            onSubmitSuccess?.();
            onBack();
        } catch (err: any) {
            toast({
                title: "Error",
                description: err.message || "Something went wrong while saving QA data.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white rounded-2xl p-6 sm:p-10 border shadow-md">
            <h2 className="text-3xl font-bold text-left text-gray-800 mb-10">QA Form — {companyName}</h2>

            <form onSubmit={handleOpenConfirm} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Processed Date" name="processed_Date" type="date" value={formData.processed_Date} onChange={handleChange} error={formErrors.processed_Date} />
                    <SelectField label="Shift" name="shift" value={formData.shift} onChange={handleChange} options={["Morning", "Evening", "Night"]} error={formErrors.shift} />
                    <InputField label="No. of Sheets Processed" name="No_of_sheets" type="number" value={formData.No_of_sheets} onChange={handleChange} error={formErrors.No_of_sheets} />
                    <InputField label="Cycle Time Per Sheet (mins)" name="cycletime_per_sheet" type="number" value={formData.cycletime_per_sheet} onChange={handleChange} error={formErrors.cycletime_per_sheet} />
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Total Cycle Time (mins)</label>
                        <input type="number" value={formData.Total_cycle_time} readOnly className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2 cursor-not-allowed text-gray-600" />
                    </div>
                    <InputField label="Machine" name="Machine_used" type="text" value={formData.Machine_used} onChange={handleChange} error={formErrors.Machine_used} />
                    <SelectField label="Operator" name="operator_name" value={formData.operator_name} onChange={handleChange} options={operators} error={formErrors.operator_name} spanFull />
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button type="submit" className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl shadow-md transition-all w-full sm:w-auto">
                        Submit QA Form
                    </Button>
                    <Button type="button" onClick={onBack} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl w-full sm:w-auto">
                        Cancel
                    </Button>
                </div>
            </form>

            {/* ✅ Confirmation Modal */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-gray-800">Confirm Submission</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 mt-2">Are you sure you want to submit this QA record for <strong>{companyName}</strong>?</p>
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
