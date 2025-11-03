import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Console } from "console";

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



  useEffect(() => {
    // ✅ Fetch user data from localStorage
    const storedUser = localStorage.getItem("username");
    console.log(storedUser)

    if (storedUser) {
      try {
        setApprovedBy(storedUser);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

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
        product_details: productId,
        inv_no: invoiceNumber,
        Date: invoiceDate,
        Amount: amount,
        mode_of_pay: modeOfPay,
        mat_inspected: inspectedBy,
        mat_received: receivedBy,
        process_plan: plannedBy,
        process_approve: approvedBy,
        remark: remarks,
        created_by: approvedBy,
      };

      console.log("payload", payload)


      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/add_account_new/`, {
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
        {/* <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div> */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
          <Input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => {
              const value = e.target.value;
              // ✅ Allow only positive numbers (no alphabets, no symbols)
              if (/^\d*\.?\d*$/.test(value)) {
                setAmount(value);
              }
            }}
            min="0"
            step="0.01" // ✅ allows decimals like 100.50
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* <div>
          <label className="block text-sm font-medium mb-1">Mode of Payment</label>
          <Input
            placeholder="Enter Mode of Payment"
            value={modeOfPay}
            onChange={(e) => setModeOfPay(e.target.value)}
          />
          <select name="" id="">
            <option>Cash</option>
            <option>Cheque</option>
            <option>Bank Transfer</option>
            <option>Online Transaction</option>
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode of Payment
          </label>
          <div className="flex items-center gap-2">
            {/* Dropdown for selecting mode */}
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={modeOfPay}
              onChange={(e) => setModeOfPay(e.target.value)}
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Online Transaction">Online Transaction</option>
            </select>
          </div>
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
            readOnly
            className="bg-gray-100 cursor-not-allowed"
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
