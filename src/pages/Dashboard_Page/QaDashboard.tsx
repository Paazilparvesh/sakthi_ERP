import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchJSON } from "@/utils/api"; // ✅ import the reusable API utility

// Types
import { QaItem } from "@/types/qa.type";

// Components
import QaList from "@/components/QaComponents/QaList";
import SerialDetail from "@/components/QaComponents/QaDetail";
import QaFormWrapper from "@/components/QaComponents/QaFormWrapper";


const QaDashboard: React.FC = () => {
  const { toast } = useToast();
  const [data, setData] = useState<QaItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [selectedItem, setSelectedItem] = useState<QaItem | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;


  // ✅ Use useCallback so we can reuse fetchData later
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchJSON<QaItem[]>(`${API_URL}/api/get_full_products`);
      setData(result);
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
  const handleViewDetail = (item: QaItem) => {
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
          Quality Verification Sheet
        </h1>

        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            {/* ---------------------- LIST VIEW ---------------------- */}
            {view === "list" && (
              <QaList data={data} onView={handleViewDetail} />
            )}

            {/* --------------------- DETAIL VIEW --------------------- */}
            {view === "detail" && selectedItem && (
              <SerialDetail
                item={selectedItem}
                onBack={handleBack}
                onProceed={handleProceedToForm}
              />
            )}

            {/* ---------------------- FORM VIEW ---------------------- */}
            {view === "form" && selectedItem && (
              <QaFormWrapper
                item={{
                  id: selectedItem.id,
                  serial_number: selectedItem.serial_number,
                }}
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

export default QaDashboard;
