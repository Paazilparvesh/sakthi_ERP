import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Components
import ProductionTable, { ProductionItem } from "@/components/Role2Components/ProductionTable";
import SerialDetail from "@/components/Role2Components/SerialDetail";
import AddQAForm from "@/components/Role2Components/AddQAForm";

const Role2Dashboard: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<ProductionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // unified view controller: "list" | "detail" | "form"
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selectedItem, setSelectedItem] = useState<ProductionItem | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;


  // ✅ Use useCallback so we can reuse fetchData later
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/get_product_details`);
      if (!response.ok) throw new Error("Failed to fetch product details");
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      console.error("❌ Error fetching product details:", err);
      if (err instanceof Error) setError(err.message);
      toast({
        variant: "destructive",
        title: "Error loading data",
        description: "Please check your backend or network connection.",
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Navigation Handlers
  const handleViewDetail = (item: ProductionItem) => {
    setSelectedItem(item);
    setView("detail");
  };

  const handleProceedToForm = () => {
    setView("form");
  };

  const handleBack = () => {
    setSelectedItem(null);
    setView("list");
  };

  // ✅ When form submission succeeds, refresh data and go back to list
  const handleFormSuccess = async () => {
    await fetchData();
    handleBack();
    toast({
      title: "QA Update Successful",
      description: "Product status has been updated.",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-slate-600 animate-pulse">
          Loading production data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-800 mb-6 sm:mb-8">
          PLANNING AND PRODUCTION TRACKING
        </h1>

        <Card className="overflow-hidden shadow-lg rounded-2xl">
          <CardContent className="p-0">
            {/* ---------------------- LIST VIEW ---------------------- */}
            {view === "list" && (
              <div className="overflow-x-auto">
                <ProductionTable data={data} onView={handleViewDetail} />
              </div>
            )}

            {/* --------------------- DETAIL VIEW --------------------- */}
            {view === "detail" && selectedItem && (
              <div className="p-4 sm:p-6">
                <SerialDetail
                  item={selectedItem}
                  onBack={handleBack}
                  onProceed={handleProceedToForm}
                />
              </div>
            )}

            {/* ---------------------- FORM VIEW ---------------------- */}
            {view === "form" && selectedItem && (
              <div className="p-4 sm:p-6">
                <AddQAForm
                  item={selectedItem}
                  onBack={handleBack}
                  onSuccess={handleFormSuccess}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
};

export default Role2Dashboard;
