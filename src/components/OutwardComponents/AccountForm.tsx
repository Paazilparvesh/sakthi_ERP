import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface AccountFormProps {
    productId: number;
    companyName: string;
    onBack: () => void;
    onSubmitSuccess?: () => void;
}

interface AccountFormData {
    invoice_no: string;
    status: string;
    remarks: string;
}

const AccountForm: React.FC<AccountFormProps> = ({ productId, companyName, onBack, onSubmitSuccess }) => {
    const { toast } = useToast();

    const [formData, setFormData] = useState<AccountFormData>({
        invoice_no: "",
        status: "",
        remarks: "",
    });

    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const userRole = localStorage.getItem("Role_Type");
    const username = localStorage.getItem("username");

    // ✅ Handle Input Changes + Realtime Validation
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        validateField(name, value);
    };

    // ✅ Field-Level Validation
    const validateField = (name: string, value: string) => {
        let error = "";
        if (name === "invoice_no" && !value.trim()) error = "Invoice number is required.";
        if (name === "status" && !value.trim()) error = "Please select a status.";
        if (name === "remarks" && value.trim().length < 3)
            error = "Remark must be at least 3 characters long.";

        setFormErrors((prev) => ({ ...prev, [name]: error }));
        return error;
    };

    // ✅ Validate all fields before modal
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let hasError = false;

        Object.entries(formData).forEach(([key, value]) => {
            const err = validateField(key, value);
            if (err) hasError = true;
            newErrors[key] = err;
        });

        setFormErrors(newErrors);
        return !hasError;
    };

    // ✅ Handle open confirmation modal
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

    // ✅ Actual API Submit
    const handleSubmit = async () => {
        setIsSubmitting(true);

        const payload: Record<string, any> = {
            product_details: productId,
            invoice_no: formData.invoice_no,
            status: formData.status,
            remarks: formData.remarks,
        };

        if (userRole?.toLowerCase() === "qa") payload.created_by_qa = username;
        else if (userRole?.toLowerCase() === "accountent") payload.created_by_acc = username;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/add_acc_details/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Failed to submit account details");

            toast({
                title: "✅ Account Details Submitted",
                description: "Account entry successfully recorded.",
            });

            onSubmitSuccess?.();
            onBack();
        } catch (err: any) {
            toast({
                title: "Error ❌",
                description: err.message || "Something went wrong while submitting account data.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
            setShowConfirm(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl p-6 sm:p-10 border shadow-md">
            <h2 className="text-3xl font-bold text-left text-gray-800 mb-10">
                Accounts Form — {companyName}
            </h2>

            <form onSubmit={handleOpenConfirm} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Invoice Number */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Invoice No.</label>
                        <input
                            type="text"
                            name="invoice_no"
                            value={formData.invoice_no}
                            onChange={handleChange}
                            placeholder="Enter invoice number"
                            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors.invoice_no
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                                }`}
                        />
                        {formErrors.invoice_no && (
                            <span className="text-red-500 text-xs">{formErrors.invoice_no}</span>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex flex-col space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors.status
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                                }`}
                        >
                            <option value="">Select Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Paid">Paid</option>
                            <option value="Hold">Hold</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        {formErrors.status && (
                            <span className="text-red-500 text-xs">{formErrors.status}</span>
                        )}
                    </div>

                    {/* Remarks */}
                    <div className="flex flex-col space-y-1.5 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Remarks</label>
                        <textarea
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Add any remarks..."
                            className={`border rounded-lg px-3 py-2 focus:ring-2 focus:outline-none ${formErrors.remarks
                                ? "border-red-500 focus:ring-red-400"
                                : "border-gray-300 focus:ring-blue-500"
                                }`}
                        />
                        {formErrors.remarks && (
                            <span className="text-red-500 text-xs">{formErrors.remarks}</span>
                        )}
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                    <Button
                        type="submit"
                        className="bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl shadow-md transition-all w-full sm:w-auto"
                    >
                        Submit Account Form
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

            {/* ✅ Confirmation Modal */}
            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold text-gray-800">
                            Confirm Submission
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 mt-2">
                        Are you sure you want to submit this Account form for{" "}
                        <strong>{companyName}</strong>?
                    </p>
                    <DialogFooter className="mt-6 flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="bg-green-700 hover:bg-green-800 text-white"
                        >
                            {isSubmitting ? "Submitting..." : "Confirm & Submit"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AccountForm;

