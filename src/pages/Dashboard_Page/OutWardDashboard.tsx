import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";
import { OutwardList } from "@/components/OutwardComponents/OutwardList";
import OutwardDetail from "@/components/OutwardComponents/OutwardDetail";
import { ProductType } from "@/types/inward.type";

import QAForm from "@/components/OutwardComponents/QAForm"
import AccountForm from "@/components/OutwardComponents/AccountForm";


const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-300 text-gray-800";
  }
};

interface OutwardDashboardProps {
  role: "qa" | "accountent";
}


const OutwardDashboard: React.FC<OutwardDashboardProps> = ({ role }) => {
  const { toast } = useToast();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [program, setProgram] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [view, setView] = useState<"list" | "detail" | "qaForm" | "accountForm">("list");
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Fetch Data from New API Endpoint
  // --------------------------------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const [productRes, programRes] = await Promise.all([
        fetch(`${BASE_URL}/api/get_full_products/`),
        fetch(`${BASE_URL}/api/get_programer_Details/`),
      ]);

      if (!productRes.ok || !programRes.ok) throw new Error("Failed to fetch data");

      const productData = await productRes.json();
      const programData = await programRes.json();

      setProducts(productData.reverse());
      setProgram(programData.reverse());
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
    fetchProducts();
  }, [fetchProducts]);

  // --------------------------------
  // View Handlers
  // --------------------------------
  const handleView = (product: ProductType) => {
    setSelectedProduct(product);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setView("list");
  };

  const handleFormSuccess = async () => {
    await fetchProducts();
    handleBack();
    toast({
      title: "✅ Process Added",
      description: "Product updated successfully.",
    });
  };

  const filteredProgram = useMemo(() => {
    if (!selectedProduct) return [];
    return program.filter(
      (prog) =>
        prog.product_details === selectedProduct.id ||
        prog.product_details?.id === selectedProduct.id
    );
  }, [program, selectedProduct]);
  // --------------------------------
  // Render
  // --------------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-slate-600 animate-pulse">
          Loading products...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Outward Dashboard
        </h1>

        {view === "list" && (
          <OutwardList
            product={products}
            onView={handleView}
            role={role}
            getStatusColor={getStatusColor}
          />
        )}

        {view === "detail" && selectedProduct && (
          <OutwardDetail
            product={selectedProduct}
            program={filteredProgram}
            onBack={handleBack}
            getStatusColor={getStatusColor}
            onProceedQA={() => setView("qaForm")}
            onProceedAccount={() => setView("accountForm")}
          />
        )}

        {view === "qaForm" && selectedProduct && (
          <QAForm
            productId={selectedProduct.id}
            companyName={selectedProduct.company_name}
            materials={selectedProduct.materials}
            onBack={() => setView("list")}
            onSubmitSuccess={fetchProducts}
          />
        )}


        {view === "accountForm" && selectedProduct && (
          <AccountForm
            productId={selectedProduct.id}
            companyName={selectedProduct.company_name}
            materials={selectedProduct.materials}
            onBack={() => setView("list")}
            onSubmitSuccess={fetchProducts}
          />
        )}

      </div>
    </div>
  );
};

export default OutwardDashboard;
