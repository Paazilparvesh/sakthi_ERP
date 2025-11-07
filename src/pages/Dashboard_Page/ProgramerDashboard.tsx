import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchJSON } from "@/utils/api"; // ✅ import the reusable API utility

// Types
import { ProductType } from "@/types/inward.type";

// Components
import ProgramList from "@/components/ProgramerComponents/ProgramerList";
import ProgramDetail from "@/components/ProgramerComponents/ProgramerDetail";
import ProgramerFormWrapper from "@/components/ProgramerComponents/ProgramerForm";


const ProgramerDashboard: React.FC = () => {
  const { toast } = useToast();
  const [FormData, setFormData] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selectedItem, setSelectedItem] = useState<ProductType | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;


  // ✅ Use useCallback so we can reuse fetchData later
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchJSON<ProductType[]>(`${API_URL}/api/get_full_products`);
      setFormData(result);
    } catch (err: unknown) {
      console.error("❌ Error fetching product details:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
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
  const handleViewDetail = (item: ProductType) => {
    setSelectedItem(item);
    setView("detail");
  };

  const handleProceedToForm = () => setView("form");

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
    <div className="p-4">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-slate-800 mb-6 sm:mb-8">
          Programer Sheet
        </h1>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            {/* ---------------------- LIST VIEW ---------------------- */}
            {view === "list" && (
              <ProgramList data={FormData} onView={handleViewDetail} />
            )}

            {/* --------------------- DETAIL VIEW --------------------- */}
            {view === "detail" && selectedItem && (
              <ProgramDetail
                item={selectedItem}
                onBack={handleBack}
                onProceed={handleProceedToForm}
              />
            )}

            {/* ---------------------- FORM VIEW ---------------------- */}
            {view === "form" && selectedItem && (
              <ProgramerFormWrapper
                item={selectedItem.id}
                onBack={handleBack}
                onSuccess={handleFormSuccess}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
};

export default ProgramerDashboard;
