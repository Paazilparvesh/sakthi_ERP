import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Search, X } from "lucide-react";
import AdminProductDetail from "@/components/AdminComponents/AdminProductDetails.tsx";

/* ---------------------- Interfaces ---------------------- */
interface MaterialDetails {
    material_id: number;
    mat_type: string;
    mat_grade: string;
    thick: number;
    width: number;
    length: number;
    quantity: number;
    total_weight: number;
    programer_status: string;
    qa_status: string;
    acc_status: string;
    programer_details: any[];
    qa_details: any[];
    account_details: any[];
}

interface ProductOverall {
    product_id: number;
    company_name: string;
    serial_number: string;
    inward_slip_number: string;
    color: string;
    worker_no: string;
    customer_name: string;
    customer_dc_no: string;
    contact_no: string;
    programer_status: string;
    qa_status: string;
    outward_status: string;
    created_by: string;
    materials: MaterialDetails[];
}

/* ---------------------- Component ---------------------- */
const AdminProducts: React.FC = () => {
    const [allDetails, setAllDetails] = useState<ProductOverall[]>([]);
    const [filteredDetails, setFilteredDetails] = useState<ProductOverall[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<ProductOverall | null>(null);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { toast } = useToast();
    const API_URL = import.meta.env.VITE_API_URL;

    /* ---------------------- Status Colors ---------------------- */
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border border-yellow-300";
            case "completed":
                return "bg-green-100 text-green-700 border border-green-300";
            case "in progress":
                return "bg-blue-100 text-blue-700 border border-blue-300";
            default:
                return "bg-gray-100 text-gray-700 border border-gray-300";
        }
    };

    /* ---------------------- Fetch Data ---------------------- */
    const fetchOverallDetails = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/get_overall_details/`);
            if (!response.ok) throw new Error("Failed to fetch overall details");
            const data: ProductOverall[] = await response.json();
            setAllDetails(data.reverse());
            setFilteredDetails(data.reverse());
        } catch (error) {
            console.error(error);
            toast({
                title: "Fetch Error",
                description: "Unable to load overall details. Please check the server.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [API_URL, toast]);

    useEffect(() => {
        fetchOverallDetails();
    }, [fetchOverallDetails]);

    /* ---------------------- Handlers ---------------------- */
    const handleView = (product: ProductOverall) => setSelectedProduct(product);
    const handleBack = () => setSelectedProduct(null);

    const handleProceedQA = () =>
        toast({ title: "QA Process", description: "Proceeding to QA..." });
    const handleProceedAccount = () =>
        toast({ title: "Accounts Process", description: "Proceeding to Accounts..." });

    /* ---------------------- Live Filtering ---------------------- */
    useEffect(() => {
        const lowerSearch = searchQuery.toLowerCase();

        const filtered = allDetails.filter((p) => {
            const matchesSearch =
                p.company_name.toLowerCase().includes(lowerSearch) ||
                p.customer_name.toLowerCase().includes(lowerSearch) ||
                p.serial_number.toLowerCase().includes(lowerSearch);

            const matchesStatus =
                statusFilter === "all" ||
                p.programer_status.toLowerCase() === statusFilter ||
                p.qa_status.toLowerCase() === statusFilter ||
                p.outward_status.toLowerCase() === statusFilter;

            return matchesSearch && matchesStatus;
        });

        setFilteredDetails(filtered);
    }, [searchQuery, statusFilter, allDetails]);

    /* ---------------------- Render ---------------------- */
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh] text-gray-600">
                <Loader2 className="animate-spin mr-2" /> Loading Overall Details...
            </div>
        );
    }

    if (selectedProduct) {
        return (
            <AdminProductDetail
      product={selectedProduct}
      onBack={handleBack}
      getStatusColor={getStatusColor}
    />
        );
    }

    return (
        <div className="text-gray-700 space-y-6">
            {/* Header + Filters */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <h2 className="text-2xl font-semibold">Manage Products</h2>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search by Company, Customer, or Serial..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 w-80"
                        />
                        {searchQuery && (
                            <X
                                className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 cursor-pointer hover:text-gray-600"
                                onClick={() => setSearchQuery("")}
                            />
                        )}
                    </div>

                    {/* Status Filter */}
                    <select
                        className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                    </select>

                </div>
            </div>

            {/* Table */}
            {filteredDetails.length === 0 ? (
                <p className="text-gray-500 italic text-center">No products found.</p>
            ) : (
                <Card className="border shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm sm:text-base">
                            <thead>
                                <tr className="border-b bg-slate-100 text-center">
                                    <th className="px-4 py-2 border">S.No</th>
                                    <th className="px-4 py-2 border">Company</th>
                                    <th className="px-4 py-2 border">Customer</th>
                                    <th className="px-4 py-2 border">Serial No</th>
                                    <th className="px-4 py-2 border">Color</th>
                                    <th className="px-4 py-2 border">Created By</th>
                                    <th className="px-4 py-2 border">Program Status</th>
                                    <th className="px-4 py-2 border">QA Status</th>
                                    <th className="px-4 py-2 border">Outward Status</th>
                                    <th className="px-4 py-2 border w-[8%]">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDetails.map((p, index) => (
                                    <tr
                                        key={p.product_id}
                                        className="border hover:bg-slate-50 transition text-center"
                                    >
                                        <td className="px-4 py-2 border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{p.company_name}</td>
                                        <td className="px-4 py-2 border">{p.customer_name}</td>
                                        <td className="px-4 py-2 border">{p.serial_number}</td>
                                        <td className="px-4 py-2 border">{p.color}</td>
                                        <td className="px-4 py-2 border">{p.created_by || "-"}</td>

                                        <td className="px-4 py-2 border">
                                            <Badge className={getStatusColor(p.programer_status)}>
                                                {p.programer_status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <Badge className={getStatusColor(p.qa_status)}>
                                                {p.qa_status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-2 border">
                                            <Badge className={getStatusColor(p.outward_status)}>
                                                {p.outward_status}
                                            </Badge>
                                        </td>

                                        <td className="px-4 py-2 border">
                                            <Button
                                                size="sm"
                                                onClick={() => handleView(p)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default AdminProducts;
