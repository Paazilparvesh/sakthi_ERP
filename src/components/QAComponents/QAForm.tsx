import React, { useState, useEffect, useMemo } from "react";
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
  program: any[];
  onBack: () => void;
  onSubmitSuccess?: () => void;
}

interface QAFormData {
  material_details: string;
  processed_date: string;
  shift: string;
  no_of_sheets: string;
  cycletime_per_sheet: string;
  total_cycle_time: number;
  machines_used: string;
  operator_name: string;
  created_by_qa?: string;
  created_by_acc?: string;
}

interface Operator {
  id: number;
  operator_name: string;
}

const QAForm: React.FC<QAFormProps> = ({
  productId,
  companyName,
  materials,
  program,
  onBack,
  onSubmitSuccess,
}) => {
  const { toast } = useToast();
  const [operators, setOperators] = useState<string[]>([]);
  const [loadingOperators, setLoadingOperators] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const allowOnlyNumbers = (value: string) => /^(\d+(\.\d*)?|\.\d+)?$/.test(value);

  const API_URL = import.meta.env.VITE_API_URL;
        const stored = localStorage.getItem("user");
    const parsedUser = stored ? JSON.parse(stored) : null;
    const user_name = parsedUser?.username;


  const [machines, setMachines] = useState<{ id: number; machine: string }[]>([]);

  // Store selected machines + times
  const [machineTimes, setMachineTimes] = useState<
    { machine: string; time: string }[]
  >([]);


  const [formData, setFormData] = useState<QAFormData>({
    material_details: "",
    processed_date: new Date().toISOString().split("T")[0],
    shift: "",
    no_of_sheets: "",
    cycletime_per_sheet: "",
    total_cycle_time: 0,
    machines_used: "",
    operator_name: "",
  });


  const programmedMaterialIds = useMemo(() => {
    const set = new Set<number>();
    program.forEach((p: any) => {
      if (p.material_details) {
        set.add(
          typeof p.material_details === "object"
            ? p.material_details.id
            : p.material_details
        );
      }
    });
    return set;
  }, [program]);


  // Called when user checks/unchecks a machine
  const toggleMachine = (machine: string, checked: boolean) => {
    if (checked) {
      // Add machine with empty time
      setMachineTimes((prev) => [...prev, { machine, time: "" }]);
    } else {
      // Remove machine
      setMachineTimes((prev) => prev.filter((m) => m.machine !== machine));
    }
  };

  // Update time for specific machine
  const updateMachineTime = (machine: string, value: string) => {
    setMachineTimes((prev) =>
      prev.map((m) =>
        m.machine === machine ? { ...m, time: value } : m
      )
    );
  };


  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const res = await fetch(`${API_URL}/api/get_machines/`);
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to load machines");
        setMachines(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Unable to load machines.",
          variant: "destructive",
        });
      }
    };

    fetchMachines();
  }, [API_URL, toast]);


  /* -----------------------------------
            FETCH OPERATORS
  ------------------------------------*/
  useEffect(() => {
    const fetchOps = async () => {
      try {
        setLoadingOperators(true);
        const res = await fetch(`${API_URL}/api/get_operator/`);
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to load operators");

        setOperators(data.map((op: Operator) => op.operator_name));
      } catch (err) {
        toast({
          title: "Error",
          description: "Unable to load operator list.",
          variant: "destructive",
        });
      } finally {
        setLoadingOperators(false);
      }
    };

    fetchOps();
  }, [API_URL, toast]);

  /* -----------------------------------
                INPUT HANDLER
  ------------------------------------*/
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // 🔹 Numeric fields (auto-block invalid input)
    const numericFields = [
      "no_of_sheets",
      "cycletime_per_sheet",
    ];

    if (numericFields.includes(name)) {
      if (!allowOnlyNumbers(value)) return; // ❌ block invalid
    }

    const updated = { ...formData, [name]: value };

    // auto calculate total cycle time
    if (["no_of_sheets", "cycletime_per_sheet"].includes(name)) {
      const sheets = Number(name === "no_of_sheets" ? value : formData.no_of_sheets);
      const cycle = Number(name === "cycletime_per_sheet" ? value : formData.cycletime_per_sheet);

      updated.total_cycle_time = sheets > 0 && cycle > 0 ? sheets * cycle : 0;
    }

    setFormData(updated);
    validateField(name, value);
  };

  /* -----------------------------------
               VALIDATION
  ------------------------------------*/
  const validateField = (name: string, value: string) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required.";
    } else if (
      ["no_of_sheets", "cycletime_per_sheet"].includes(name) &&
      (isNaN(Number(value)) || Number(value) <= 0)
    ) {
      error = "Must be a positive number.";
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    const requiredFields: (keyof QAFormData)[] = [
      "material_details",
      "processed_date",
      "shift",
      "no_of_sheets",
      "cycletime_per_sheet",
      "operator_name",
    ];

    let hasError = false;
    const newErr: Record<string, string> = {};

    requiredFields.forEach((field) => {
      const err = validateField(field, String(formData[field]));
      if (err) hasError = true;
      newErr[field] = err;
    });

    setFormErrors(newErr);
    return !hasError;
  };

  /* -----------------------------------
                  SUBMIT
  ------------------------------------*/
  const handleSubmit = async () => {
    setIsSubmitting(true);

    const payload = {
      product_details: productId,
      ...formData,
      no_of_sheets: Number(formData.no_of_sheets),
      cycletime_per_sheet: Number(formData.cycletime_per_sheet),
      machines_used: machineTimes, // <--- NEW
      created_by: user_name,
    };


    // // Detect user type safely
    // const lowerRole = String(role).trim().toLowerCase();

    // if (lowerRole.includes("qa")) {
    //   payload.created_by_qa = username;
    // }
    // else if (
    //   lowerRole.includes("acc")) {
    //   payload.created_by_acc = username;
    // }


    try {
      const res = await fetch(`${API_URL}/api/add_qa_details/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast({
        title: "Success",
        description: "QA details saved successfully.",
      });

      onSubmitSuccess?.();
      onBack();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to save QA data.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
    }
  };

  /* -----------------------------------
                  UI
  ------------------------------------*/
  return (
    <div className="bg-white p-12 rounded-xl shadow-md mt-8">

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (validateForm()) setShowConfirm(true);
        }}
        className="space-y-4"
      >

        {/* ---------------- ROW 1 (2 fields) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Material */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Material</label>
            <select
              name="material_details"
              value={formData.material_details}
              onChange={handleChange}
              className={`border rounded-lg px-3 py-2 ${formErrors.material_details ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Select Material</option>
              {materials
                .filter((m) => programmedMaterialIds.has(m.id))   // ONLY programmed materials
                .filter((m) => m.qa_status === "pending")
                .map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.mat_type} ({mat.mat_grade}) — {mat.thick}mm × {mat.width} × {mat.length}
                  </option>
                ))}
            </select>
            {formErrors.material_details && (
              <p className="text-red-500 text-xs">{formErrors.material_details}</p>
            )}
          </div>

          {/* Processed Date */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Processed Date</label>
            <input
              type="date"
              name="processed_date"
              value={formData.processed_date}
              onChange={handleChange}
              className={`border rounded-lg px-3 py-2 ${formErrors.processed_date ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formErrors.processed_date && (
              <p className="text-red-500 text-xs">{formErrors.processed_date}</p>
            )}
          </div>

        </div>

        {/* ---------------- ROW 2 (3 fields) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* No of Sheets */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">No. of Sheets</label>
            <input
              type="text"
              name="no_of_sheets"
              value={formData.no_of_sheets}
              onChange={handleChange}
              placeholder="Enter Processed Sheets"
              className={`border rounded-lg px-3 py-2 ${formErrors.no_of_sheets ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formErrors.no_of_sheets && (
              <p className="text-red-500 text-xs">{formErrors.no_of_sheets}</p>
            )}
          </div>

          {/* Cycle Time Per Sheet */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Cycle Time Per Sheet</label>
            <input
              type="text"
              name="cycletime_per_sheet"
              value={formData.cycletime_per_sheet}
              onChange={handleChange}
              placeholder="Enter Cycle Time Per Sheet"
              className={`border rounded-lg px-3 py-2 ${formErrors.cycletime_per_sheet ? "border-red-500" : "border-gray-300"
                }`}
            />
            {formErrors.cycletime_per_sheet && (
              <p className="text-red-500 text-xs">{formErrors.cycletime_per_sheet}</p>
            )}
          </div>

          {/* Total Cycle Time */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Total Cycle Time</label>
            <input
              type="number"
              value={formData.total_cycle_time}
              readOnly
              className="border border-gray-200 bg-gray-100 rounded-lg px-3 py-2"
            />
          </div>

        </div>

        {/* ---------------- ROW 3 (2 fields) ---------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">



          {/* Shift */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Shift</label>
            <select
              name="shift"
              value={formData.shift}
              onChange={handleChange}
              className={`border rounded-lg px-3 py-2 ${formErrors.shift ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Select Shift</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
            {formErrors.shift && <p className="text-red-500 text-xs">{formErrors.shift}</p>}
          </div>

          {/* OPERATOR FULL WIDTH */}
          <div className="flex flex-col space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Operator</label>
            <select
              name="operator_name"
              value={formData.operator_name}
              onChange={handleChange}
              className={`border rounded-lg px-3 py-2 ${formErrors.operator_name ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Select Operator</option>

              {loadingOperators ? (
                <option>Loading...</option>
              ) : operators.length > 0 ? (
                operators.map((op, i) => <option key={i}>{op}</option>)
              ) : (
                <option>No operators</option>
              )}
            </select>
            {formErrors.operator_name && (
              <p className="text-red-500 text-xs">{formErrors.operator_name}</p>
            )}
          </div>



        </div>

        {/* Machine */}
        {/* <div className="flex flex-col space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Machine</label>
          <select
            name="machine_used"
            value={formData.machine_used}
            onChange={handleChange}
            className={`border rounded-lg px-3 py-2 ${formErrors.machine_used ? "border-red-500" : "border-gray-300"
              }`}
          >
            <option value="">Select Machine</option>
            <option value="MAHA">MAHA</option>
            <option value="BLAZE">BLAZE</option>
          </select>
          {formErrors.machine_used && (
            <p className="text-red-500 text-xs">{formErrors.machine_used}</p>
          )}
        </div> */}

        {/* MACHINE SELECTION (CHECKBOX LIST) */}
        <div className="flex flex-col space-y-2 mt-4">
          <label className="text-sm font-medium text-gray-700">Machines Used</label>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {machines.map((m) => {
              const isChecked = machineTimes.some((mt) => mt.machine === m.machine);

              return (
                <div key={m.id} className="flex items-center gap-3 border p-3 rounded-lg">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => toggleMachine(m.machine, e.target.checked)}
                    className="h-4 w-4"
                  />

                  <span className="font-medium">{m.machine}</span>
                </div>
              );
            })}
          </div>

          {/* Time Inputs for selected machines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {machineTimes.map((mt) => (
              <div key={mt.machine} className="flex flex-col mt-2">
                <label className="text-xs text-gray-600">
                  Runtime for {mt.machine} (HH:MM)
                </label>

                <input
                  type="time"
                  value={mt.time}
                  onChange={(e) => updateMachineTime(mt.machine, e.target.value)}
                  step="60"
                   required
                  className="border rounded-lg px-3 py-2 border-gray-300"
                />
              </div>
            ))}
          </div>
        </div>



        {/* BUTTONS */}
        <div className="flex gap-4 justify-center mt-8">
          <Button type="button" onClick={onBack} className="bg-gray-300 hover:bg-gray-200 text-black">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-700 text-white">
            Submit QA
          </Button>
        </div>
      </form>


      {/* CONFIRMATION DIALOG */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
          </DialogHeader>

          <p className="mt-2 text-gray-600">
            Are you sure you want to submit QA details for <b>{companyName}</b>?
          </p>

          <DialogFooter className="mt-5">
            <Button variant="outline" onClick={() => setShowConfirm(false)} className="bg-gray-300 hover:bg-gray-200 hover:text-black">
              Cancel
            </Button>
            <Button className="bg-blue-700 text-white" onClick={handleSubmit}>
              {isSubmitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QAForm;
