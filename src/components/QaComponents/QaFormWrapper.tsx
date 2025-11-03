import React, { useState } from "react";
import { Button } from "../ui/button";
import QaForm1 from "@/components/QaComponents/QAForm1";
import { QaForm2 } from "./QaForm2";
import { StepProgressBar } from "@/components/ReusableComponents/StepProgressBar";

import { ProgramFormData, QaFormWrapperProps } from "@/types/qa.type";

import { toast } from "@/hooks/use-toast";


// --- Main Component ---
const QaFormWrapper: React.FC<QaFormWrapperProps> = ({ item, onBack, onSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ProgramFormData>({
    programNo: "",
    selectedAllotments: [],
    inspectionForm: {
      size: false,
      Thick: false,
      Grade: false,
      Drawing: false,
      Test_Certificate: false,
    },
    processData: [
      { processName: "LASER", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
      { processName: "FOLDING", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
      { processName: "FORMING", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
    ],
    scheduleData: {
      commitmentDate: "",
      planningDate: "",
      inspectionDate: "",
      deliveryDate: "",
    },
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const totalSteps = 2;


  // ✅ Converts minutes (string/number) → HH:MM
  const formatCycleTime = (minutes: string) => {
    const totalMinutes = parseInt(minutes || "0", 10);
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  // ✅ Validate QA Form before moving next
  const validateStep1 = () => {
    if (!formData.programNo.trim()) return "Program number is required.";
    if (formData.selectedAllotments.length === 0)
      return "Select at least one M/C Allotment.";
    if (!Object.values(formData.inspectionForm).some(Boolean))
      return "Select at least one inspection parameter.";
    return null;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      const error = validateStep1();
      if (error) {
        alert(error);
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFinalSubmit = async () => {
    try {
      const productId = item.id;

      const created_by = localStorage.getItem("username")

      // 🧩 Convert cycleTime before sending
      const formattedProcessData = formData.processData.map((p) => ({
        ...p,
        cycleTime: formatCycleTime(p.cycleTime),
      }));

      // --- 🧩 Build JSON body for backend ---
      const payload = {
        product_id: productId,
        created_by: created_by,

        // Step 1: Product Options
        product_options: [
          {
            size: formData.inspectionForm.size || false,
            Thick: formData.inspectionForm.Thick || false,
            Grade: formData.inspectionForm.Grade || false,
            Drawing: formData.inspectionForm.Drawing || false,
            Test_Certificate: formData.inspectionForm.Test_Certificate || false,
          },
        ],

        // Step 2: Plan Products (derived from M/C Allotment)
        plan_products: [
          {
            product_options_id: 0, // Placeholder for the actual ID, should be returned from backend
            program_no: formData.programNo,
            lm_co1: formData.selectedAllotments.includes("L-M/C-01"),
            lm_co2: formData.selectedAllotments.includes("L-M/C-02"),
            lm_co3: formData.selectedAllotments.includes("L-M/C-03"),
            fm_co1: formData.selectedAllotments.includes("F-M/C-01"),
            fm_co2: formData.selectedAllotments.includes("F-M/C-02"),
            fm_co3: formData.selectedAllotments.includes("F-M/C-03"),
            status: "incomplete",
          },
        ],

        // Step 3: Schedules
        schedules: [
          {
            product_plan: 0, // Placeholder, backend will resolve this
            commitment_date: formData.scheduleData.commitmentDate,
            planning_date: formData.scheduleData.planningDate,
            date_of_inspection: formData.scheduleData.inspectionDate,
            date_of_delivery: formData.scheduleData.deliveryDate,
          },
        ],

        // Step 4: Schedule Processes
        schedule_processes: formattedProcessData.map((process) => ({
          schedule_id: 0, // Placeholder until backend resolves this
          process_date: process.processDate,
          cycle_time: process.cycleTime,
          operator_name: process.operatorName,
          remark: process.remakers,
          status: "incomplete",
        })),
      };

      // Check payload structure
      console.log("Payload being sent to API:", JSON.stringify(payload, null, 2));

      // --- Send to backend ---
      const response = await fetch(`${API_URL}/api/add_QA/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.status) {
        toast({ title: "QA added successfully!" });
        if (onSuccess) onSuccess();
      } else {
        toast({ title: "Error", description: result.message || "Submission failed", variant: "destructive" });
      }

    } catch (error) {
      console.error("❌ QA Submission Failed:", error);
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    }
  };

  const handleQaFormChange = (updatedData: Partial<ProgramFormData>) => {
    setFormData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  return (
    <div className="w-full mx-auto">
      <StepProgressBar
        steps={["QA Entry", "Review & Submit"]}
        currentStep={currentStep}
        activeColor="bg-blue-900"
        inactiveColor="bg-gray-300"
      />

      <div className="w-full space-y-6 mt-6">
        {currentStep === 1 && (
          <QaForm1
            item={item}
            formData={formData}
            onChange={handleQaFormChange}
            onBack={onBack}
          />
        )}

        {currentStep === 2 && (
          <QaForm2
            product={item}
            scheduleData={formData.scheduleData}
            processData={formData.processData}
            onChange={handleQaFormChange}
            onBack={handleBack}
            onSuccess={handleFinalSubmit}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-gray-400 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-100 w-full sm:w-auto"
          >
            Back
          </Button>
        )}

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
            onClick={handleFinalSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default QaFormWrapper;
