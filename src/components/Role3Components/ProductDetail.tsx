import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Product, FullProduct, QAItem, ApiResponse } from "@/types/role3.types.ts";


interface ProductDetailProps {
    product: FullProduct;
    onBack: () => void;
    onAddDetails: (product: FullProduct) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
    product,
    onBack,
    onAddDetails,
}) => {
    const { toast } = useToast();
    const [qaData, setQaData] = useState<QAItem[]>([]);
    const [loadingQA, setLoadingQA] = useState<boolean>(true);
    const BASE_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchQAData = async () => {
            try {
                setLoadingQA(true);
                const response = await fetch(`${BASE_URL}/api/product_qa_view/`);
                if (!response.ok) throw new Error("Failed to fetch QA data");

                const data: ApiResponse = await response.json();

                // ✅ Filter QA by matching product_id
                const filteredQA = data.qa_details.filter(
                    (qa) => qa.product_id === (product.product_id ?? product.id)
                );

                setQaData(filteredQA);
            } catch (error) {
                console.error("❌ QA fetch error:", error);
                toast({
                    variant: "destructive",
                    title: "Error loading QA data",
                    description: "Could not fetch QA information for this product.",
                });
            } finally {
                setLoadingQA(false);
            }
        };

        fetchQAData();
    }, [product.id, product.product_id, BASE_URL, toast]);

    // Helper to render tick
    const renderTick = (value: string) => (value && value !== "0" ? "✔" : "");

    return (

        <div className="space-y-6 px-4 sm:px-6 lg:px-8">
    {/* ---------------- PRODUCT DETAILS ---------------- */}
    <Card className="shadow-lg rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 bg-slate-50 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Product Details
            </h2>
            <Button
                onClick={onBack}
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 w-full sm:w-auto"
            >
                Back to List
            </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Product ID */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                <p className="text-slate-500 text-sm sm:text-base">Product ID</p>
                <p className="text-slate-800 font-medium">{product.product_id ?? product.id}</p>
            </div>

            {/* Company Name */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                <p className="text-slate-500 text-sm sm:text-base">Company Name</p>
                <p className="text-slate-800 font-medium">{product.Company_name}</p>
            </div>

            {/* Serial Number */}
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                <p className="text-slate-500 text-sm sm:text-base">Serial Number</p>
                <p className="text-slate-800 font-mono">{product.serial_number}</p>
            </div>

            {product.date && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                    <p className="text-slate-500 text-sm sm:text-base">Date</p>
                    <p className="text-slate-800 font-medium">{product.date}</p>
                </div>
            )}

            {product.Customer_name && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                    <p className="text-slate-500 text-sm sm:text-base">Customer Name</p>
                    <p className="text-slate-800 font-medium">{product.Customer_name}</p>
                </div>
            )}

            {product.Customer_No && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                    <p className="text-slate-500 text-sm sm:text-base">Customer DC No</p>
                    <p className="text-slate-800 font-medium">{product.Customer_No}</p>
                </div>
            )}

            {product.Customer_date && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                    <p className="text-slate-500 text-sm sm:text-base">Customer Date</p>
                    <p className="text-slate-800 font-medium">{product.Customer_date}</p>
                </div>
            )}

            {product.mobile && (
                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                    <p className="text-slate-500 text-sm sm:text-base">Mobile</p>
                    <p className="text-slate-800 font-medium">{product.mobile}</p>
                </div>
            )}

            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                <p className="text-slate-500 text-sm sm:text-base">Status</p>
                <p
                    className={`font-semibold ${product.status.toLowerCase() === "complete"
                        ? "text-green-600"
                        : "text-orange-500"
                        }`}
                >
                    {product.status}
                </p>
            </div>
        </div>
    </Card>

    {/* ---------------- QA & M/C Allotment ---------------- */}
    <Card className="shadow-lg rounded-xl border border-slate-200 p-4 sm:p-6 lg:p-8 bg-slate-50 max-w-5xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-4">M/C Allotment</h3>

        {loadingQA ? (
            <p className="text-slate-500 animate-pulse">Loading QA data...</p>
        ) : qaData.length === 0 ? (
            <p className="text-slate-500">No QA data available for this product.</p>
        ) : (
            <div className="space-y-4">
                {qaData.map((item, idx) => (
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
                            {/* <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                                <label className="text-slate-600 font-medium w-32">Status:</label>
                                <span
                                    className={`px-2 py-1 rounded-full font-semibold ${item.status === "complete"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-yellow-100 text-yellow-800"
                                        }`}
                                >
                                    {item.status}
                                </span>
                            </div> */}
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
        )}

        {/* ---------------- Add Process Details Button ---------------- */}
        {qaData.some(item => ["pending", "incomplete"].includes(item.status.toLowerCase())) && (
            <Button
                onClick={() => onAddDetails(product)}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
                Add Process Details
            </Button>
        )}
    </Card>
</div>

    );
};

export default ProductDetail;
