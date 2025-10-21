import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleProcess } from "@/types/role4.types";

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

interface QA {
    product_id: number;
    program_no: string;
    lm_co1: boolean;
    lm_co2: boolean;
    lm_co3: boolean;
    fm_co1: boolean;
    fm_co2: boolean;
    fm_co3: boolean;
    status: string;
}

interface Schedule {
    product_id: number;
    commitment_Date: string;
    planning_date: string;
    date_of_delivery: string;
    date_of_inspection: string;
}

// interface ScheduleProcess {
//     product_id: number;
//     schedule_name: number;
//     process_date: string;
//     cycle_time: string;
//     operator_name: string;
//     remark: string;
//     processName: string;
// }

interface ProductDetailProps {
    product: Product;
    qas: QA[];
    schedules: Schedule[];
    scheduleProcesses: ScheduleProcess[];
    onBack: () => void;
    onAddProcess: any // new
    isCompleted?: boolean; // ✅ new prop
}

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "complete":
            return "bg-green-600 text-white";
        case "in progress":
        case "processing":
            return "bg-yellow-500 text-white";
        case "pending":
        case "incomplete":
            return "bg-orange-500 text-white";
        default:
            return "bg-gray-300 text-gray-800";
    }
};

export const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    qas,
    schedules,
    scheduleProcesses,
    onBack,
    onAddProcess,
    isCompleted
}) => {

    const [accountCreated, setAccountCreated] = useState(false); // ✅ track success
    const productQAs = qas.filter((q) => q.product_id === product.product_id);

    // Step 1: Get all schedules for this product
    const productSchedules = schedules.filter((s) => s.product_id === product.product_id);

    // Step 2: Get all processes for this product
    const productProcesses = scheduleProcesses.filter((sp) => sp.product_id === product.product_id);

    console.log("Filtered product processes:", productProcesses);

    const handleAddProcess = async (product: Product) => {
        try {
            const success = await onAddProcess(product); // ✅ call parent function
            if (success) setAccountCreated(true); // ✅ disable button if backend success
        } catch (err) {
            console.error("Error adding process:", err);
        }
    };

    const processNames = ["LASER", "FOLDING", "FORMING"];



    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back Button */}
            <div className="flex justify-end">
                <Button variant="outline" onClick={onBack}>Back</Button>
            </div>

            {/* ---------------- Product Info ---------------- */}
            <Card>
                <CardHeader>
                    <CardTitle>Product Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Company</p>
                            <p className="font-medium">{product.Company_name}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Serial Number</p>
                            <p className="font-mono">{product.serial_number}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Customer</p>
                            <p className="font-medium">{product.Customer_name}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Customer DC No</p>
                            <p className="font-medium">{product.Customer_No}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Customer Date</p>
                            <p className="font-medium">{product.Customer_date}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Mobile</p>
                            <p className="font-medium">{product.mobile}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Date</p>
                            <p className="font-medium">{product.date}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-lg shadow-inner">
                            <p className="text-gray-500 text-sm">Status</p>
                            <Badge className={getStatusColor(product.status)}>{product.status}</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ---------------- QA & M/C Allotment ---------------- */}
            {productQAs.length > 0 && (
                <Card className="shadow-lg rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 bg-slate-50 max-w-5xl mx-auto">
                    <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-4">M/C Allotment</h3>

                    <div className="space-y-4">
                        {productQAs.map((item, idx) => (
                            <div key={idx} className="flex flex-col gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-inner">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                    {/* Program No */}
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-slate-600 font-medium w-32">Program No:</label>
                                        <input
                                            type="text"
                                            value={item.program_no}
                                            readOnly
                                            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 bg-slate-50"
                                        />
                                    </div>

                                    {/* Status */}
                                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                        <label className="text-slate-600 font-medium w-32">Status:</label>
                                        <span
                                            className={`px-2 py-1 rounded-full font-semibold ${item.status === "complete"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-yellow-100 text-yellow-800"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                </div>

                                {/* M/C Allotments Table */}
                                <div className="overflow-x-auto mt-4">
                                    <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">M/C Allotment</h3>
                                    <table className="w-full text-sm sm:text-base border border-slate-300 rounded-lg">
                                        <thead className="bg-slate-100">
                                            <tr>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">LM CO1</th>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">LM CO2</th>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">LM CO3</th>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">FM CO1</th>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">FM CO2</th>
                                                <th className="px-2 sm:px-3 py-1 sm:py-2 border-b">FM CO3</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white text-center">
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.lm_co1 ? "✔" : "-"}</td>
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.lm_co2 ? "✔" : "-"}</td>
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.lm_co3 ? "✔" : "-"}</td>
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.fm_co1 ? "✔" : "-"}</td>
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.fm_co2 ? "✔" : "-"}</td>
                                                <td className="px-2 sm:px-3 py-1 sm:py-2 border-b">{item.fm_co3 ? "✔" : "-"}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}


            {/* ---------------- Schedule Section ---------------- */}
            {productSchedules.length > 0 && (
                <Card className="max-w-5xl mx-auto shadow-lg rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 bg-slate-50">
                    <CardHeader>
                        <CardTitle>Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {productSchedules.map((s, i) => (
                            <div
                                key={i}
                                className="flex flex-wrap sm:flex-nowrap gap-4 mt-4"
                            >
                                {/* Commitment Date */}
                                <div className="flex-1 bg-white p-4 rounded-lg shadow-inner text-center">
                                    <p className="text-slate-500 text-sm font-medium">Commitment Date</p>
                                    <p className="text-slate-800 font-semibold">{s.commitment_Date}</p>
                                </div>

                                {/* Planning Date */}
                                <div className="flex-1 bg-white p-4 rounded-lg shadow-inner text-center">
                                    <p className="text-slate-500 text-sm font-medium">Planning Date</p>
                                    <p className="text-slate-800 font-semibold">{s.planning_date}</p>
                                </div>

                                {/* Inspection Date */}
                                <div className="flex-1 bg-white p-4 rounded-lg shadow-inner text-center">
                                    <p className="text-slate-500 text-sm font-medium">Inspection Date</p>
                                    <p className="text-slate-800 font-semibold">{s.date_of_inspection}</p>
                                </div>

                                {/* Delivery Date */}
                                <div className="flex-1 bg-white p-4 rounded-lg shadow-inner text-center">
                                    <p className="text-slate-500 text-sm font-medium">Delivery Date</p>
                                    <p className="text-slate-800 font-semibold">{s.date_of_delivery}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}


            {/* ---------------- Process Section ---------------- */}
            {productProcesses.length > 0 && (
                <Card className="max-w-5xl mx-auto shadow-lg rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 bg-slate-50">
                    <CardHeader>
                        <CardTitle>Process Details</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                        <table className="w-full border-separate border-spacing-2">
                            <thead>
                                <tr className="text-left text-sm text-slate-500">
                                    <th className="p-2">PROCESS</th>
                                    <th className="p-2">DATE</th>
                                    <th className="p-2">CYCLE TIME (mins)</th>
                                    <th className="p-2">OPERATOR</th>
                                    <th className="p-2">REMARKS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productProcesses.map((row, index) => (
                                    <tr key={index} className="bg-white rounded-lg hover:bg-slate-50">
                                        {/* Process Name */}
                                        <td className="p-2 font-semibold">
                                            {processNames[index] || `Process ${index + 1}`}
                                        </td>
                                        {/* Process Date */}
                                        <td className="p-2">
                                            <input
                                                type="date"
                                                value={row.process_date}
                                                readOnly
                                                className="border border-slate-300 rounded-lg px-2 py-1 w-full"
                                            />
                                        </td>
                                        {/* Cycle Time */}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={row.cycle_time}
                                                readOnly
                                                className="border border-slate-300 rounded-lg px-2 py-1 w-full"
                                            />
                                        </td>
                                        {/* Operator Name */}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={row.operator_name}
                                                readOnly
                                                className="border border-slate-300 rounded-lg px-2 py-1 w-full"
                                            />
                                        </td>
                                        {/* Remarks */}
                                        <td className="p-2">
                                            <input
                                                type="text"
                                                value={row.remark}
                                                readOnly
                                                className="border border-slate-300 rounded-lg px-2 py-1 w-full"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            )}

            {/* <Button
                variant="default"
                onClick={() => onAddProcess(product)}
            >
                Add Process
            </Button> */}
            <Button
                variant="default"
                onClick={() => handleAddProcess(product)}
                disabled={accountCreated || isCompleted}
            >
                {accountCreated || isCompleted ? "Process Completed" : "Add Process"}
            </Button>

        </div>
    );
};
