import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductType } from "@/types/inward.type";
import { useToast } from "@/components/ui/use-toast";

interface ProgramerDetail {
    id: number;
    created_by: string;
    program_no: string;
    program_date: string;
    Pland_Qty: number;
    Bal_Qty: number;
    UsedWeightInKgs: number;
    components_per_sheet: number;
    cut_length_per_sheet: number;
    pierce_per_sheet: number;
    planned_mins_per_sheet: number;
    planned_hours_total: number;
    total_meter: number;
    total_piercing: number;
    total_used_weight_kg: number;
    total_components: number;
    product_details: number;
}

interface OutwardDetailProps {
    product: ProductType;
    program?: ProgramerDetail[];// ✅ new
    onBack: () => void;
    onAddProcess: any;
    getStatusColor: (status: string) => string;
    isCompleted?: boolean;
    onProceedQA: () => void;       // ✅ new — open QA form
    onProceedAccount: () => void;
}
interface QaDetail {
    QA_Detail_ID: number;
    processed_Date: string;
    shift: string;
    No_of_sheets: number;
    cycletime_per_sheet: number;
    Total_cycle_time: number;
    Machine_used: string;
    operator_name: string;
    Product_ID: number;
    Created_By: string;
}

interface AccDetail {
    Acc_Detail_ID: number;
    Product_ID: number;
    invoice_no: string;
    status: string;
    remarks: string;
    Created_By: string;
}

/** Small utility to render key/value data */
const InfoCard = ({
    label,
    value,
    children,
}: {
    label: string;
    value?: string | number;
    children?: React.ReactNode;
}) => (
    <div className="bg-gray-50 border rounded-lg p-3 shadow-sm">
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        {children || (
            <p className="font-semibold text-gray-800 break-words">{value ?? "-"}</p>
        )}
    </div>
);

const OutwardDetail: React.FC<OutwardDetailProps> = ({
    product,
    program = [],
    onBack,
    onAddProcess,
    getStatusColor,
    onProceedQA,
    onProceedAccount,
}) => {
    const [accountCreated, setAccountCreated] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [qa, setQa] = useState([]);
    const [acc, setAcc] = useState([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const BASE_URL = import.meta.env.VITE_API_URL;

    const role = localStorage.getItem("Role_Type")

    const handleAddProcess = async () => {
        try {
            const success = await onAddProcess(product);
            if (success) setAccountCreated(true);
        } catch (err) {
            console.error("Error adding process:", err);
        }
    };

    const fetchQaAcc = useCallback(async () => {
        try {
            setLoading(true);

            const [qaRes, accRes] = await Promise.all([
                fetch(`${BASE_URL}/api/get_qa_details/`),
                fetch(`${BASE_URL}/api/get_acc_details/`),
            ]);

            if (!qaRes.ok || !accRes.ok) throw new Error("Failed to fetch data");

            const qaData: QaDetail[] = await qaRes.json();
            const accData: AccDetail[] = await accRes.json();

            setQa(qaData.reverse());
            setAcc(accData.reverse());
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Fetch Error",
                description: error instanceof Error ? error.message : "Unknown error",
            });
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, toast]);

    useEffect(() => {
        fetchQaAcc();
    }, [fetchQaAcc]);


    // ✅ Memoized filtered data for performance
    const productQaDetails = useMemo(
        () => qa.filter((q) => q.Product_ID === product.id),
        [qa, product.id]
    );

    const productAccDetails = useMemo(
        () => acc.filter((a) => a.Product_ID === product.id),
        [acc, product.id]
    );

    return (
        <Card className="shadow-lg p-4 sm:p-6 md:p-8 mx-auto w-full max-w-6xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    Outward Product Details
                </h2>
                <div className="flex justify-center items-center gap-5">
                    {/* ✅ Submit Button */}
                    {product.outward_status?.toLowerCase() === "pending" && (
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {product.qa_status?.toLowerCase() === "pending" && (
                                <Button
                                    onClick={onProceedQA}
                                    disabled={isProcessing}
                                    className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-xl shadow-md transition-all"
                                >
                                    Proceed to QA
                                </Button>
                            )}
                            {role === "accountent" && (
                                <Button
                                    onClick={onProceedAccount}
                                    disabled={isProcessing}
                                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl shadow-md transition-all"
                                >
                                    Proceed to Accounts
                                </Button>
                            )}
                        </div>
                    )}
                    <Button
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 w-full sm:w-auto"
                        onClick={onBack}
                    >
                        Back to Table
                    </Button>
                </div>
            </div>

            {/* ✅ Product Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                <InfoCard label="Serial Number" value={product.serial_number} />
                <InfoCard label="Company Name" value={product.Company_name} />
                <InfoCard label="Inward Slip No." value={product.inward_slip_number} />
                <InfoCard label="Work Order No" value={product.wo_no} />
                <InfoCard label="TEC" value={product.tec} />
                <InfoCard label="Ratio" value={product.ratio} />
                <InfoCard label="Customer Name" value={product.Customer_name} />
                <InfoCard label="Customer No." value={product.Customer_No} />
                <InfoCard label="Mobile Number" value={product.mobile} />
                <InfoCard label="Created By" value={product.created_by} />
                <InfoCard label="Date" value={product.date} />
                <InfoCard label="Status">
                    <Badge className={getStatusColor(product.status)}>
                        {product.status}
                    </Badge>
                </InfoCard>
            </div>

            <Separator className="my-6" />

            {/* ✅ Product Materials Section */}
            {product.materials?.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Product Materials</h3>
                    <div className="overflow-x-auto border rounded-xl shadow-sm">
                        <table className="w-full border-collapse text-center text-sm sm:text-base">
                            <thead className="bg-gray-100 text-gray-700 font-semibold">
                                <tr>
                                    <th className="border px-2 py-2">S.No</th>
                                    <th className="border px-2 py-2">Material Type</th>
                                    <th className="border px-2 py-2">Grade</th>
                                    <th className="border px-2 py-2">Thick (mm)</th>
                                    <th className="border px-2 py-2">Width (mm)</th>
                                    <th className="border px-2 py-2">Length (mm)</th>
                                    <th className="border px-2 py-2">Unit Wt (kg)</th>
                                    <th className="border px-2 py-2">Density</th>
                                    <th className="border px-2 py-2">Quantity</th>
                                    <th className="border px-2 py-2">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {product.materials.map((mat, i) => (
                                    <tr
                                        key={mat.id}
                                        className="hover:bg-gray-50 transition-colors text-gray-800"
                                    >
                                        <td className="border px-2 py-2 font-medium">{i + 1}</td>
                                        <td className="border px-2 py-2">{mat.mat_type || "—"}</td>
                                        <td className="border px-2 py-2">{mat.mat_grade || "—"}</td>
                                        <td className="border px-2 py-2">{mat.Thick ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.Width ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.Length ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.UnitWeight ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.Density ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.Quantity ?? "-"}</td>
                                        <td className="border px-2 py-2">{mat.Remarks || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}


            {/* ✅ Programmer Details */}
            {program.length > 0 ? (
                <>
                    <Separator className="my-10" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">
                        Programmer Details
                    </h3>

                    <div className="space-y-6">
                        {program.map((detail, index) => (
                            <Card
                                key={detail.id || index}
                                className="border border-gray-200 p-4 rounded-xl shadow-sm"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {Object.entries(detail)
                                        .filter(([key]) => !["id", "product_details"].includes(key))
                                        .map(([key, value]) => (
                                            <InfoCard
                                                key={key}
                                                label={key
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                                value={String(value)}
                                            />
                                        ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                <p className="text-gray-500 italic text-center mt-6">
                    No programmer records found for this product.
                </p>
            )}


            {/* ✅ QA Details */}
            {productQaDetails.length > 0 && (
                <>
                    <Separator className="my-10" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">
                        QA Details
                    </h3>
                    <div className="space-y-6">
                        {productQaDetails.map((qa) => (
                            <Card
                                key={qa.QA_Detail_ID}
                                className="border p-4 rounded-xl shadow-sm"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Processed Date" value={qa.processed_Date} />
                                    <InfoCard label="Shift" value={qa.shift} />
                                    <InfoCard label="No. of Sheets" value={qa.No_of_sheets} />
                                    <InfoCard
                                        label="Cycle Time per Sheet"
                                        value={qa.cycletime_per_sheet}
                                    />
                                    <InfoCard
                                        label="Total Cycle Time"
                                        value={qa.Total_cycle_time}
                                    />
                                    <InfoCard label="Machine Used" value={qa.Machine_used} />
                                    <InfoCard label="Operator Name" value={qa.operator_name} />
                                    <InfoCard label="Created By" value={qa.Created_By} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* ✅ Account Details */}
            {productAccDetails.length > 0 && (
                <>
                    <Separator className="my-10" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">
                        Account Details
                    </h3>
                    <div className="space-y-6">
                        {productAccDetails.map((acc) => (
                            <Card
                                key={acc.Acc_Detail_ID}
                                className="border p-4 rounded-xl shadow-sm"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Invoice No" value={acc.invoice_no} />
                                    <InfoCard label="Status" value={acc.status} />
                                    <InfoCard label="Remarks" value={acc.remarks} />
                                    <InfoCard label="Created By" value={acc.Created_By} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {productQaDetails.length === 0 && productAccDetails.length === 0 && (
                <p className="text-gray-500 italic text-center mt-6">
                    No QA or Account details found for this product.
                </p>
            )}
        </Card>
    );
};

export default OutwardDetail;