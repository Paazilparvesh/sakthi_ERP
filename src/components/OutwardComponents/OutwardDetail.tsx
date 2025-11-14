import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { ProductType } from "@/types/inward.type";
import { useToast } from "@/components/ui/use-toast";

/* ---------------------- Interfaces ---------------------- */
interface ProgramerDetail {
    id: number;
    created_by: string;
    program_no: string;
    program_date: string;
    processed_quantity: number;
    balance_quantity: number;
    used_weight: number;
    number_of_sheets: number;
    cut_length_per_sheet: number;
    pierce_per_sheet: number;
    processed_mins_per_sheet: number;
    total_planned_hours: number;
    total_meters: number;
    total_piercing: number;
    total_used_weight: number;
    total_no_of_sheets: number;
    product_details: number;
    material_details: number | null;
}

interface QaDetail {
    qa_detail_id: number;
    processed_date: string;
    shift: string;
    no_of_sheets: number;
    cycletime_per_sheet: number;
    total_cycle_time: number;
    machine_used: string;
    operator_name: string;
    product_id: number;
    material_id: number;
    created_by: string;
}

interface AccDetail {
    acc_detail_id: number;
    product_id: number;
    material_id: number;
    invoice_no: string;
    status: string;
    remarks: string;
    created_by: string;
}

interface OutwardDetailProps {
    product: ProductType;
    program?: ProgramerDetail[];
    getStatusColor: (status: string) => string;
}

/* ---------------------- Helper Components ---------------------- */
const renderFieldCard = (
    label: string,
    value: string | number,
    isStatus?: boolean
) => {

    const displayValue = value !== null && value !== undefined ? value : "-";

    const statusColor =
        typeof value === "string" && isStatus
            ? value.toLowerCase() === "pending"
                ? "w-24 rounded-full px-3 text-yellow-600 bg-yellow-100 border-yellow-300"
                : "w-28 rounded-full px-3 text-green-600 bg-green-100 border-green-300"
            : "text-gray-800";

    return (
        <Card
            className={`shadow-sm rounded-lg border ${isStatus ? "border-transparent" : "border-gray-200"
                }`}
        >
            <CardContent className="p-4">
                <span className="text-gray-500 font-medium text-sm">{label}</span>
                <p
                    className={`font-semibold text-base md:text-lg mt-1 block py-1 ${statusColor}`}
                >
                    {displayValue || "-"}
                </p>
            </CardContent>
        </Card>
    );
};

const InfoCard = ({
    label,
    value,
}: {
    label: string;
    value?: string | number | Record<string, string>;
}) => {
    // 🧠 Handle nested objects gracefully
    const formattedValue =
        value === null || value === undefined
            ? "-"
            : typeof value === "object"
                ? value.username
                    ? `${value.username}${value.type ? ` (${value.type})` : ""}`
                    : JSON.stringify(value)
                : value;

    return (
        <div className="bg-gray-50 border rounded-lg p-3 shadow-sm">
            <p className="text-gray-500 text-sm font-medium">{label}</p>
            <p className="font-semibold text-gray-800 break-words">{formattedValue}</p>
        </div>
    );
};

/* ---------------------- Main Component ---------------------- */
const OutwardDetail: React.FC<OutwardDetailProps> = ({
    product,
}) => {
    const BASE_URL = import.meta.env.VITE_API_URL;
    const { toast } = useToast();
    // 🔹 States
    const [qa, setQa] = useState<QaDetail[]>([]);
    const [acc, setAcc] = useState<AccDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingID, setLoadingID] = useState<number | null>(null);
    const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(
        null
    );
    const [materialDataMap, setMaterialDataMap] = useState<
        Record<number, ProgramerDetail>
    >({});

    /* ---------------------- Fetch QA + Account ---------------------- */
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
                description:
                    error instanceof Error ? error.message : "Unknown error occurred",
            });
        } finally {
            setLoading(false);
        }
    }, [BASE_URL, toast]);

    useEffect(() => {
        fetchQaAcc();
    }, [fetchQaAcc]);

    /* ---------------------- Fetch Programmer Data ---------------------- */
    const handleViewProgram = async (materialId: number) => {
        if (selectedMaterialId === materialId) {
            setSelectedMaterialId(null);
            return;
        }

        // Cached result
        if (materialDataMap[materialId]) {
            setSelectedMaterialId(materialId);
            return;
        }

        try {
            setLoadingID(materialId);
            const url = `${BASE_URL}/api/get_programer_Details/?product_id=${product.id}&material_id=${materialId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok)
                throw new Error(data.error || "Failed to fetch programmer details");

            if (Array.isArray(data) && data.length > 0) {
                const matched = data[0];
                setMaterialDataMap((prev) => ({ ...prev, [materialId]: matched }));
                setSelectedMaterialId(materialId);
            } else {
                toast({
                    title: "No record found",
                    description: `No programmer data linked to this material.`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("❌ Error fetching programmer details:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Unexpected error occurred while fetching data",
                variant: "destructive",
            });
        } finally {
            setLoadingID(null);
        }
    };

    const selectedMaterialQaDetails = useMemo(
        () =>
            qa.filter(
                (q) =>
                    q.product_id === product.id &&
                    q.material_id === selectedMaterialId
            ),
        [qa, product.id, selectedMaterialId]);

    const selectedMaterialAccDetails = useMemo(
        () =>
            acc.filter(
                (a) =>
                    a.product_id === product.id &&
                    a.material_id === selectedMaterialId
            ),
        [acc, product.id, selectedMaterialId]);


    /* ---------------------- JSX ---------------------- */
    return (
        <Card className="shadow-lg rounded-3xl mx-auto w-full overflow-hidden p-10">

            {/* Product Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-4">
                    {renderFieldCard("Serial Number", product.serial_number)}
                    {renderFieldCard("Company Name", product.company_name)}
                    {renderFieldCard("Customer Contact Number", product.contact_no)}
                    {renderFieldCard("Created By", product.created_by)}
                </div>
                <div className="space-y-4">
                    {renderFieldCard("Date", product.date)}
                    {renderFieldCard("Customer Name", product.customer_name)}
                    {renderFieldCard("Worker Number", product.worker_no)}
                </div>
                <div className="space-y-4">
                    {renderFieldCard("Inward Slip Number", product.inward_slip_number)}
                    {renderFieldCard("Customer Document Number", product.customer_dc_no)}
                    {renderFieldCard("Color", product.color)}
                </div>
            </div>

            <Separator className="my-5" />

            {/* Materials Table */}
            {product.materials?.length > 0 && (
                <section className="space-y-4 my-10">
                    <h3 className="text-3xl font-semibold text-gray-700">
                        Product Materials
                    </h3>
                    <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
                        <table className="w-full border-collapse text-center text-sm sm:text-base">
                            <thead className="bg-gray-100 text-gray-700 font-semibold w-full">
                                <tr>
                                    <th className="border px-2 py-2">S.No</th>
                                    <th className="border px-2 py-2">Material Type</th>
                                    <th className="border px-2 py-2">Grade</th>
                                    <th className="border px-2 py-2">Thick (mm)</th>
                                    <th className="border px-2 py-2">Width (mm)</th>
                                    <th className="border px-2 py-2">Length (mm)</th>
                                    <th className="border px-2 py-2">Density</th>
                                    <th className="border px-2 py-2">Unit Weight (kg)</th>
                                    <th className="border px-2 py-2">Quantity</th>
                                    <th className="border px-2 py-2">Total Weight (kg)</th>
                                    <th className="border px-2 py-2">Stock Due (Days)</th>
                                    <th className="border px-2 py-2">Remarks</th>
                                    {product.materials.some(mat => mat.programer_status === "completed") && (
                                        <th className="border px-2 py-2">Action</th>
                                    )}

                                </tr>
                            </thead>
                            <tbody>
                                {product.materials.map((mat, index) => (
                                    <tr
                                        key={mat.id || index}
                                        className="hover:bg-gray-50 transition text-gray-800"
                                    >
                                        <td className="border px-2 py-2">{index + 1}</td>
                                        <td className="border px-2 py-2">{mat.mat_type}</td>
                                        <td className="border px-2 py-2">{mat.mat_grade}</td>
                                        <td className="border px-2 py-2">{mat.thick}</td>
                                        <td className="border px-2 py-2">{mat.width}</td>
                                        <td className="border px-2 py-2">{mat.length}</td>
                                        <td className="border px-2 py-2">{mat.density}</td>
                                        <td className="border px-2 py-2">{mat.unit_weight}</td>
                                        <td className="border px-2 py-2">{mat.quantity}</td>
                                        <td className="border px-2 py-2">{mat.total_weight}</td>
                                        <td className="border px-2 py-2">{mat.stock_due}</td>
                                        <td className="border px-2 py-2">{mat.remarks}</td>
                                        {mat.programer_status === "completed" && mat.id && (
                                            <td className="border px-2 py-2">
                                                <Button
                                                    onClick={() => handleViewProgram(mat.id!)}
                                                    disabled={loadingID === mat.id}
                                                    className="bg-blue-700 hover:bg-blue-800"
                                                >
                                                    {loadingID === mat.id
                                                        ? "Loading..."
                                                        : selectedMaterialId === mat.id
                                                            ? "Hide"
                                                            : "View"}
                                                </Button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            <Separator className="my-5" />

            {/* Programmer Details */}
            <section className="mt-10">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">
                    Programmer Details
                </h3>
                {selectedMaterialId && materialDataMap[selectedMaterialId] ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(materialDataMap[selectedMaterialId]).map(
                            ([key, value]) => {
                                if (
                                    ["id", "product_details", "material_details"].includes(key)
                                )
                                    return null;
                                return (
                                    <React.Fragment key={key}>
                                        {renderFieldCard(
                                            key
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (l) => l.toUpperCase()),
                                            value !== null && value !== undefined ? value : "-"  // ✅ Keep 0, show "-" only if null/undefined
                                        )}

                                    </React.Fragment>
                                );
                            }
                        )}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">
                        {loadingID
                            ? "Fetching programmer details..."
                            : "Click 'View' to see programmer details for a material."}
                    </p>
                )}
            </section>

            {/* QA Section (filtered per material) */}
            {selectedMaterialId && selectedMaterialQaDetails.length > 0 ? (
                <>
                    <Separator className="my-10" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">
                        QA Details (Material #{selectedMaterialId})
                    </h3>
                    <div className="space-y-6">
                        {selectedMaterialQaDetails.map((qa) => (
                            <Card key={qa.qa_detail_id} className="border p-4 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Processed Date" value={qa.processed_date} />
                                    <InfoCard label="Shift" value={qa.shift} />
                                    <InfoCard label="No. of Sheets" value={qa.no_of_sheets} />
                                    <InfoCard
                                        label="Cycle Time per Sheet"
                                        value={qa.cycletime_per_sheet}
                                    />
                                    <InfoCard
                                        label="Total Cycle Time"
                                        value={qa.total_cycle_time}
                                    />
                                    <InfoCard label="Machine Used" value={qa.machine_used} />
                                    <InfoCard label="Operator Name" value={qa.operator_name} />
                                    <InfoCard label="Created By" value={qa.created_by} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                selectedMaterialId && (
                    <p className="text-gray-500 italic text-center mt-6">
                        No QA details found for this material.
                    </p>
                )
            )}

            {selectedMaterialId && selectedMaterialAccDetails.length > 0 ? (
                <>
                    <Separator className="my-10" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">
                        Account Details
                    </h3>
                    <div className="space-y-6">
                        {selectedMaterialAccDetails.map((acc) => (
                            <Card key={acc.acc_detail_id} className="border p-4 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <InfoCard label="Invoice No" value={acc.invoice_no} />
                                    <InfoCard label="Status" value={acc.status} />
                                    <InfoCard label="Remarks" value={acc.remarks} />
                                    <InfoCard label="Created By" value={acc.created_by} />
                                </div>
                            </Card>
                        ))}
                    </div>
                </>
            ) : (
                selectedMaterialId && (
                    <p className="text-gray-500 italic text-center mt-6">
                        No Accounts details found for this material.
                    </p>
                )
            )}

        </Card>
    );
};

export default OutwardDetail;
