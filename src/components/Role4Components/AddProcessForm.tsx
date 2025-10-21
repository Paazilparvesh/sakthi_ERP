import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  product_id: number;
  Company_name: string;
  serial_number: string;
  date: string;
  Customer_name: string;
  Customer_No: string;
  Customer_date: string;
  mobile: string;
  status: string;
}

interface AddProcessFormProps {
  productId: number; // ✅ required for linking to backend
  onClose: () => void;
  onBack: () => void; // ✅ new prop for navigating back after success
  // onSuccess: () => void; 
}

export const AddProcessForm: React.FC<AddProcessFormProps> = ({
  productId,
  onClose,
  onBack,
  // onSuccess,
}) => {
  const { toast } = useToast();

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [amount, setAmount] = useState("");
  const [modeOfPay, setModeOfPay] = useState("");
  const [inspectedBy, setInspectedBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [plannedBy, setPlannedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Validation
  const validateFields = (): string | null => {
    const numberPattern = /^[0-9]+$/;
    const textPattern = /^[a-zA-Z0-9\s.,'-]+$/;

    if (!invoiceNumber.trim()) return "Invoice Number is required.";
    if (!invoiceDate.trim()) return "Invoice Date is required.";
    if (!amount.trim()) return "Amount is required.";
    if (!numberPattern.test(amount)) return "Amount must be numeric.";
    if (!modeOfPay.trim()) return "Mode of Payment is required.";
    if (!inspectedBy.trim()) return "Material Inspected By is required.";
    if (!receivedBy.trim()) return "Material Received By is required.";
    if (!plannedBy.trim()) return "Process Planned By is required.";
    if (!approvedBy.trim()) return "Process Approved By is required.";
    return null;
  };

  // ✅ Handle Submit
  const handleConfirm = async () => {
    const error = validateFields();
    if (error) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {

      console.log("data", productId)

      if (!productId) {
        toast({
          title: "Error",
          description: "No valid product selected",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const payload = {
        product_id: productId,
        inv_on: invoiceNumber,
        Date: invoiceDate,
        Amount: amount,
        mode_of_pay: modeOfPay,
        mat_inspected: inspectedBy,
        mat_received: receivedBy,
        process_plan: plannedBy,
        process_approve: approvedBy,
        remark: remarks,
      };

      console.log("payload", payload)


      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/add_account/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Account page created successfully.",
        });
        // onSuccess();
        onClose();
        onBack(); // ✅ navigate back
        
      } else {
        toast({
          title: "Error",
          description: data.msg || "Failed to create account entry.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Network Error",
        description: "Failed to connect to the server.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center mb-4">COMMERCIAL DETAIL</h2>

      {/* First Row - Invoice Info */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number</label>
          <Input
            placeholder="Enter Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Date</label>
          <Input
            type="date"
            value={invoiceDate}
            onChange={(e) => setInvoiceDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mode of Payment</label>
          <Input
            placeholder="Enter Mode of Payment"
            value={modeOfPay}
            onChange={(e) => setModeOfPay(e.target.value)}
          />
        </div>
      </div>

      {/* Second Row - Editable Process Info */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label className="block text-sm font-medium mb-1">Mat’l Inspected By</label>
          <Input
            value={inspectedBy}
            onChange={(e) => setInspectedBy(e.target.value)}
            className="bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mat’l Received By</label>
          <Input
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
            className="bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Process Planned By</label>
          <Input
            value={plannedBy}
            onChange={(e) => setPlannedBy(e.target.value)}
            className="bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Process Approved By</label>
          <Input
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            className="bg-white"
          />
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-sm font-medium mb-1">Remarks</label>
        <textarea
          placeholder="Enter remarks (optional)"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="w-full border border-slate-300 rounded-lg p-3"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-6 py-2 border-gray-400 hover:bg-gray-100"
        >
          Back
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
        >
          {loading ? "Submitting..." : "Confirm"}
        </Button>
      </div>
    </div>
  );
};
