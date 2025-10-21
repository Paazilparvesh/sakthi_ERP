// React
import React, { useState, useEffect, useCallback } from "react";
// Toast
import { useToast } from "@/components/ui/use-toast";
// Flow Components
import { ProcessScheduleForm } from "@/components/Role3Components/ProcessScheduleForm";
import ProductList from "@/components/Role3Components/ProductList";
import ProductDetail from "@/components/Role3Components/ProductDetail";
import { Product, FullProduct, ApiResponse } from "@/types/role3.types";

const Role3Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selectedProduct, setSelectedProduct] = useState<FullProduct | null>(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  // ✅ Reusable fetch function (like in Role2Dashboard)
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/product_qa_view/`);
      if (!response.ok) throw new Error("Failed to fetch product data");

      const data: ApiResponse = await response.json();

      // ✅ Extract and merge product + QA data
      const productsData = data.product || [];
      const qaData = data.qa_details || [];

      const formattedProducts: Product[] = productsData.map((p) => {
        const qaMatch = qaData.find((qa) => qa.product_id === p.product_id);
        const finalStatus =
          qaMatch?.status === "complete"
            ? "Complete"
            : "Pending";

        return {
          id: p.product_id,
          Company_name: p.Company_name,
          serial_number: p.serial_number,
          Customer_name: p.Customer_name,
          customerNumber: p.mobile,
          Customer_No: p.Customer_No,
          Customer_date: p.Customer_date,
          date: p.date,
          status: finalStatus,
          full: { ...p, qa_details: qaMatch || null },
        };
      });

      setProducts(formattedProducts);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      toast({
        variant: "destructive",
        title: "Error loading products",
        description: "Please ensure the Django server is running and reachable.",
      });
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, toast]);

  // ✅ Fetch once on load
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // -----------------------------
  // 🔄 View Handlers
  // -----------------------------
  const handleView = (product: Product) => {
    setSelectedProduct(product.full);
    setView("detail");
  };

  const handleAddDetails = (product: FullProduct) => {
    setSelectedProduct(product);
    setView("form");
  };

  const handleBack = () => {
    setSelectedProduct(null);
    setView("list");
  };

  // ✅ When process form is successfully submitted
  const handleFormSuccess = async () => {
    await fetchProducts(); // 🔄 Refresh immediately
    handleBack(); // Go back to product list
    toast({
      title: "✅ Schedule & Process Added",
      description: "Product status updated successfully.",
    });
  };

  // -----------------------------
  // 🧩 Render
  // -----------------------------
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
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-800 mb-8">
          Schedule & Process Details
        </h1>

        <div className="space-y-6">
          {/* List View */}
          {view === "list" && (
            <ProductList products={products} onView={handleView} />
          )}

          {/* Detail View */}
          {view === "detail" && selectedProduct && (
            <ProductDetail
              product={selectedProduct}
              onBack={handleBack}
              onAddDetails={handleAddDetails}
            />
          )}

          {/* Form View */}
          {view === "form" && selectedProduct && (
            <ProcessScheduleForm
              product={selectedProduct}
              onBack={handleBack}
              onSuccess={handleFormSuccess} // ✅ trigger instant refresh
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Role3Dashboard;
