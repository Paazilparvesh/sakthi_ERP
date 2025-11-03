import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/role3.types";

interface ScheduleDetail {
    commitmentDate: string;
    planningDate: string;
    inspectionDate: string;
    deliveryDate: string;
}
interface ProcessDetail {
    processName: string;
    processDate: string;
    cycleTime: string;
    operatorName: string;
    remakers: string;
}

interface ProductId {
    id: number,
    serial_number: string,
}
interface ProcessScheduleFormProps {
    product: ProductId;
    onBack: () => void;
    onSuccess: () => void;
}


// // -----------------------
// // Progress Stepper
// // -----------------------
// const ProgressStepper = ({ currentStep }: { currentStep: number }) => {
//     const steps = ["Schedule", "Process Detail", "Confirm & Submit"];
//     return (
//         <div className="flex justify-center items-center mb-8">
//             {steps.map((step, index) => (
//                 <React.Fragment key={index}>
//                     <div className="flex flex-col items-center">
//                         <div
//                             className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${currentStep > index + 1 || currentStep === index + 1
//                                 ? "bg-blue-600 text-white"
//                                 : "bg-slate-200 text-slate-500"
//                                 }`}
//                         >
//                             {currentStep > index + 1 ? "✔" : index + 1}
//                         </div>
//                         <p
//                             className={`mt-2 text-xs text-center ${currentStep >= index + 1
//                                 ? "text-blue-600 font-semibold"
//                                 : "text-slate-500"
//                                 }`}
//                         >
//                             {step}
//                         </p>
//                     </div>
//                     {index < steps.length - 1 && (
//                         <div
//                             className={`flex-auto border-t-2 mx-4 ${currentStep > index + 1 ? "border-blue-600" : "border-slate-200"
//                                 }`}
//                         ></div>
//                     )}
//                 </React.Fragment>
//             ))}
//         </div>
//     );
// };

// -----------------------
// ProcessScheduleForm Component
// -----------------------
export const ProcessScheduleForm: React.FC<ProcessScheduleFormProps> = ({
    product,
    onBack,
    onSuccess,
}) => {
    const [step, setStep] = useState(1);
    const { toast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL

    const [processData, setProcessData] = useState<ProcessDetail[]>([
        { processName: "LASER", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
        { processName: "FOLDING", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
        { processName: "FORMING", processDate: "", cycleTime: "", operatorName: "", remakers: "" },
    ]);

    const [scheduleData, setScheduleData] = useState<ScheduleDetail>({
        commitmentDate: "",
        planningDate: "",
        inspectionDate: "",
        deliveryDate: "",
    });

    const formatCycleTime = (cycleTime: string) => {
        const mins = parseInt(cycleTime, 10);
        if (isNaN(mins)) return "00:00:00";
        const hours = Math.floor(mins / 60);
        const minutes = mins % 60;
        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:00`;
    };

    // -----------------------
    // Validation Helpers
    // -----------------------
    const validateSchedule = (schedule: ScheduleDetail) => {
        const datePattern = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

        for (const [key, value] of Object.entries(schedule)) {
            if (!value || !value.trim()) {
                return { valid: false, msg: `${key.replace(/([A-Z])/g, " $1")} is required.` };
            }
            if (!datePattern.test(value)) {
                return { valid: false, msg: `${key.replace(/([A-Z])/g, " $1")} must be a valid date.` };
            }
        }

        return { valid: true };
    };

    const validateProcess = (processData: ProcessDetail[]) => {
        const numberPattern = /^[0-9]+$/; // Only digits
        const textPattern = /^[a-zA-Z0-9\s.,'-]+$/; // ✅ Letters, numbers, spaces, dots, commas, hyphen, apostrophe

        for (const row of processData) {
            if (!row.processDate.trim()) {
                return { valid: false, msg: `Process date is required for ${row.processName}.` };
            }

            if (!row.cycleTime.trim()) {
                return { valid: false, msg: `Cycle time is required for ${row.processName}.` };
            }

            if (!numberPattern.test(row.cycleTime)) {
                return { valid: false, msg: `Cycle time must be numeric for ${row.processName}.` };
            }

            const cycleMinutes = parseInt(row.cycleTime, 10);
            if (cycleMinutes <= 0 || cycleMinutes > 600) {
                return { valid: false, msg: `Cycle time for ${row.processName} must be between 1 and 600 minutes.` };
            }

            if (!row.operatorName.trim()) {
                return { valid: false, msg: `Operator name is required for ${row.processName}.` };
            }

            if (!textPattern.test(row.operatorName)) {
                return { valid: false, msg: `Operator name contains invalid characters for ${row.processName}.` };
            }

            if (row.remakers && !textPattern.test(row.remakers)) {
                return { valid: false, msg: `Remarks contain invalid characters for ${row.processName}.` };
            }
        }

        return { valid: true };
    };


    const handleProcessChange = (index: number, field: keyof ProcessDetail, value: string) => {
        const updated = [...processData];
        updated[index][field] = value;
        setProcessData(updated);
    };

    const handleScheduleChange = (field: keyof ScheduleDetail, value: string) => {
        setScheduleData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        try {
            // -----------------------
            // 1️⃣ Validate Schedule
            // -----------------------
            const scheduleValidation = validateSchedule(scheduleData);
            if (!scheduleValidation.valid) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: scheduleValidation.msg,
                });
                return;
            }

            // -----------------------
            // 2️⃣ Validate Process Data
            // -----------------------
            const processValidation = validateProcess(processData);
            if (!processValidation.valid) {
                toast({
                    variant: "destructive",
                    title: "Validation Error",
                    description: processValidation.msg,
                });
                return;
            }

            // -----------------------
            // 3️⃣ Fetch product_id using serial_number
            // -----------------------
            const productResponse = await fetch(`${BASE_URL}/api/product_qa_view/`);
            if (!productResponse.ok) throw new Error("Failed to fetch product data");

            const productResult = await productResponse.json();

            // Try to find matching product by serial number
            const matchedProduct = productResult.product?.find(
                (item: any) => item.serial_number === product.serial_number
            );

            if (!matchedProduct) {
                throw new Error(`Product with serial number ${product.serial_number} not found`);
            }

            const productId = matchedProduct.product_id;
            console.log("✅ Matched Product ID:", productId);

            // -----------------------
            // 4️⃣ Send Schedule to Backend
            // -----------------------
            const schedulePayload = {
                product_plan_id: productId,
                commitment_date: scheduleData.commitmentDate,
                planning_date: scheduleData.planningDate,
                date_of_inspection: scheduleData.inspectionDate,
                date_of_delivery: scheduleData.deliveryDate,
            };

            console.log("📦 Schedule Payload:", schedulePayload);

            const scheduleResponse = await fetch(`${BASE_URL}/api/Schedule_add/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(schedulePayload),
            });

            if (!scheduleResponse.ok) {
                const err = await scheduleResponse.json();
                throw new Error(err.error || "Failed to create schedule");
            }

            const scheduleResult = await scheduleResponse.json();
            toast({
                title: "✅ Schedule created",
                description: "Schedule successfully linked to product",
            });

            // -----------------------
            // 5️⃣ Get schedule_id from schedule_view (using product_id)
            // -----------------------
            // let scheduleId: number | undefined;

            const updatedResponse = await fetch(`${BASE_URL}/api/product_qa_view/`);
            if (!updatedResponse.ok) throw new Error("Failed to fetch updated schedule data");

            const updatedResult = await updatedResponse.json();
            const matchedSchedule = updatedResult.schedule_view?.find(
                (item: any) => item.product_id === productId
            );

            if (!matchedSchedule) throw new Error("Schedule not found after creation");

            const scheduleId: number = matchedSchedule.product_id; // ✅ product_id acts as schedule_id
            console.log("✅ Using Schedule ID (product_id):", scheduleId);

            // -----------------------
            // 6️⃣ Send Process Details
            // -----------------------
            for (const p of processData) {
                const processPayload = {
                    schedule_name: scheduleId,
                    process_date: p.processDate,
                    cycle_time: formatCycleTime(p.cycleTime),
                    operator_name: p.operatorName,
                    remark: p.remakers,
                };

                const processResponse = await fetch(`${BASE_URL}/api/Schedule_process/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(processPayload),
                });

                if (!processResponse.ok) {
                    const err = await processResponse.json();
                    throw new Error(err.error || `Failed to create process for ${p.processName}`);
                }
            }

            toast({
                title: "✅ Success",
                description: "Schedule and process saved successfully",
            });
            onSuccess();

        } catch (error) {
            console.error("❌ Error:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Unknown error",
            });
        }
    };




    const handleNextStep = () => {
        if (step === 1) {
            const { valid, msg } = validateSchedule(scheduleData);
            if (!valid) {
                toast({ variant: "destructive", title: "Validation Error", description: msg });
                return;
            }
        } else if (step === 2) {
            const { valid, msg } = validateProcess(processData);
            if (!valid) {
                toast({ variant: "destructive", title: "Validation Error", description: msg });
                return;
            }
        }
        setStep(step + 1);
    };


    return (
        <Card className="shadow-lg p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Add Process Schedule</h2>
                    <div className="mt-2 bg-slate-100 border border-slate-200 rounded-lg px-3 py-1 inline-flex items-center gap-x-2">
                        <span className="text-sm text-slate-500">Serial no:</span>
                        <span className="text-md font-bold text-blue-700">{product.serial_number}</span>
                    </div>
                </div>
                <Button onClick={onBack} variant="outline">Back</Button>
            </div>

            {/* <ProgressStepper currentStep={step} /> */}

            {/* Step 1: Schedule */}
            {step === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        ["commitmentDate", "COMMITMENT DATE"],
                        ["planningDate", "PLANNING DATE"],
                        ["inspectionDate", "DATE OF INSPECTION"],
                        ["deliveryDate", "DATE OF DELIVERY"],
                    ].map(([key, label]) => (
                        <div key={key} className="bg-white border rounded-xl p-4 shadow-inner">
                            <Label className="text-xs text-slate-500">{label}</Label>
                            <Input type="date" className="border-0 p-0 mt-1"
                                value={(scheduleData as ScheduleDetail)[key]}
                                onChange={(e) => handleScheduleChange(key as keyof ScheduleDetail, e.target.value)} />
                        </div>
                    ))}
                </div>
            )}

            {/* Step 2: Process Detail */}
            {step === 2 && (
                <div className="overflow-x-auto">
                    <h3 className="text-xl font-semibold text-center text-slate-700 mb-6">
                        PROCESS DETAIL
                    </h3>

                    <table className="w-full border-separate border-spacing-2">
                        <thead>
                            <tr className="text-left text-sm text-slate-500">
                                <th>PROCESS</th>
                                <th>DATE</th>
                                <th>CYCLE TIME (mins)</th>
                                <th>OPERATOR</th>
                                <th>REMARKS (optional)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {processData.map((row, index) => (
                                <tr key={index}>
                                    {/* Process Name */}
                                    <td className="font-semibold p-3 bg-slate-100 rounded-lg">
                                        {row.processName}
                                    </td>

                                    {/* Date */}
                                    <td>
                                        <Input
                                            type="date"
                                            value={row.processDate}
                                            onChange={(e) => handleProcessChange(index, "processDate", e.target.value)}
                                        />
                                    </td>

                                    {/* Cycle Time (Manual + Preset) */}
                                    <td>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={600}
                                            placeholder="Enter Mins"
                                            value={row.cycleTime}
                                            onChange={(e) => handleProcessChange(index, "cycleTime", e.target.value)}
                                            required
                                        />
                                    </td>

                                    {/* Operator Name */}
                                    <td>
                                        <Input
                                            type="text"
                                            placeholder="Enter operator name"
                                            value={row.operatorName}
                                            onChange={(e) => handleProcessChange(index, "operatorName", e.target.value)}
                                            required
                                        />
                                    </td>

                                    {/* Remarks */}
                                    <td>
                                        <Input
                                            type="text"
                                            placeholder="Remarks"
                                            value={row.remakers}
                                            onChange={(e) => handleProcessChange(index, "remakers", e.target.value)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-center text-slate-700 mb-6">
                        Confirm & Submit
                    </h3>

                    {/* Schedule Review */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(scheduleData).map(([key, value]) => {
                            const labelMap: Record<string, string> = {
                                commitmentDate: "COMMITMENT DATE",
                                planningDate: "PLANNING DATE",
                                inspectionDate: "DATE OF INSPECTION",
                                deliveryDate: "DATE OF DELIVERY",
                            };
                            return (
                                <div
                                    key={key}
                                    className="bg-white border rounded-xl p-4 shadow-inner"
                                >
                                    <Label className="text-xs text-slate-500">{labelMap[key]}</Label>
                                    <Input
                                        type="date"
                                        className="border-0 p-0 mt-1"
                                        value={value}
                                        readOnly
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Process Review */}
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-semibold text-center text-slate-700 mb-6">
                            PROCESS DETAIL
                        </h3>

                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr className="text-left text-sm text-slate-500">
                                    <th>PROCESS</th>
                                    <th>DATE</th>
                                    <th>CYCLE TIME (mins)</th>
                                    <th>OPERATOR</th>
                                    <th>REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {processData.map((row, index) => (
                                    <tr key={index}>
                                        <td className="font-semibold p-3 bg-slate-100 rounded-lg">
                                            {row.processName}
                                        </td>
                                        <td>
                                            <Input type="date" value={row.processDate} readOnly />
                                        </td>
                                        <td>
                                            <Input type="number" value={row.cycleTime} readOnly />
                                        </td>
                                        <td>
                                            <Input type="text" value={row.operatorName} readOnly />
                                        </td>
                                        <td>
                                            <Input type="text" value={row.remakers} readOnly />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Step Navigation */}
            <div className="flex justify-end mt-8 space-x-4">
                {step > 1 && <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>}
                {step < 3 && <Button onClick={handleNextStep}>Next</Button>}
                {step === 3 && <Button onClick={handleSubmit}>Submit</Button>}
            </div>

        </Card>
    );
};
