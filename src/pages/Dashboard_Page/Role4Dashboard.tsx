import React, { useEffect, useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProductList } from "@/components/Role4Components/ProductList";
import { ProductDetail } from "@/components/Role4Components/ProductDetail";
import { AddProcessForm } from "@/components/Role4Components/AddProcessForm";
import { ScheduleProcess, Product, QA, Schedule } from "@/types/role4.types";

export const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "complete":
      return "bg-green-100 text-green-800";
    case "in progress":
    case "processing":
      return "bg-yellow-100 text-yellow-800";
    case "pending":
    case "incomplete":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-300 text-gray-800";
  }
};

// -----------------------------
// 🧭 Main Dashboard
// -----------------------------
const Role4Dashboard: React.FC = () => {
  const { toast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [qas, setQAs] = useState<QA[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [scheduleProcesses, setScheduleProcesses] = useState<ScheduleProcess[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [loading, setLoading] = useState(true);

  const [frontendStatusMap, setFrontendStatusMap] = useState<{ [key: number]: string }>({});


  const BASE_URL = import.meta.env.VITE_API_URL;

  // -----------------------------
  // Fetch Products & Related Data
  // -----------------------------
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/product_qa_view/`);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();

      setProducts((data.product).reverse());
      setQAs((data.qa_details).reverse());
      setSchedules((data.schedule_view).reverse());
      setScheduleProcesses((data.schedule_process).reverse());
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
    fetchData();
  }, [fetchData]);

  // -----------------------------
  // View Handlers
  // -----------------------------
  const handleView = (product: Product) => {
    console.log("handlview :", product)
    setSelectedProduct(product);
    setView("detail");
  };

  // const handleAddProcess = (product: Product) => {
  //   console.log("handleAddProcess :", product)
  //   setSelectedProduct(product);
  //   setSelectedProductId(product.product_id);
  //   setView("form");
  // };

  const handleAddProcess = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductId(product.product_id);
    setFrontendStatusMap((prev) => ({ ...prev, [product.product_id]: "complete" }));
    setView("form");
    return true; // ✅ ensure the async call in ProductDetail works
  };


  const handleBack = () => {
    setSelectedProduct(null);
    setView("list");
  };

  const handleFormSuccess = async () => {
    await fetchData();
    handleBack();
    toast({
      title: "✅ Process Added",
      description: "Product status updated successfully.",
    });
  };


  // -----------------------------
  // Render
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
    <div className="bg-slate-50 p-6 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-800 mb-8">
          Accounts Dashboard
        </h1>

        {/* List View */}
        {view === "list" && (
          <ProductList
            products={products}
            onView={handleView}
            getStatusColor={getStatusColor}
            frontendStatusMap={frontendStatusMap} // new
            onComplete={(productId) => {
              setFrontendStatusMap((prev) => ({ ...prev, [productId]: "complete" }));
            }}
          />
        )}

        {/* Detail View */}
        {view === "detail" && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            qas={qas}
            schedules={schedules}
            scheduleProcesses={scheduleProcesses}
            onBack={handleBack}
            onAddProcess={handleAddProcess}
            isCompleted={frontendStatusMap[selectedProduct.product_id] === "complete"}
          />
        )}

        {/* Form View */}
        {view === "form" && selectedProduct && (
          // <AddProcessForm
          //   productId={selectedProduct.product_id}
          //   onClose={() => {
          //     handleFormSuccess
          //     setFrontendStatusMap((prev) => ({
          //       ...prev,
          //       [selectedProduct.product_id]: "complete",
          //     }));
          //   }}
          //   onBack={() => setView("list")}
          // />
          <AddProcessForm
            productId={selectedProduct.product_id}
            onClose={() => {
              handleFormSuccess(); // ✅ actually call it
              setFrontendStatusMap((prev) => ({
                ...prev,
                [selectedProduct.product_id]: "complete",
              }));
            }}
            onBack={() => setView("list")}
          />

        )}

      </div>
    </div>
  );
};

export default Role4Dashboard;
