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

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;



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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);


  const filteredData = React.useMemo(() => {
    return FormData.reverse().filter((item) => {
      const matchesSearch =
        item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.programer_status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [FormData, searchQuery, statusFilter]);

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);



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
    <div className="p-12">
      <div className="max-w-8xl mx-auto">
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            Programer Sheet
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4">

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search by company, customer or serial..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border px-4 py-3 rounded-full w-full sm:w-72 text-sm outline-none focus:ring-2 focus:ring-blue-600"
            />

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

          </div>
        </div>


        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">
            {/* ---------------------- LIST VIEW ---------------------- */}
            {view === "list" && (
              <>
                <ProgramList data={paginatedData} onView={handleViewDetail} />

                {/* Pagination Buttons */}
                {totalPages > 1 && (
                  <div className="flex justify-end items-center gap-3 mt-6">

                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                    >
                      Prev
                    </button>

                    <span className="font-medium text-slate-700">
                      Page {currentPage} / {totalPages}
                    </span>

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                    >
                      Next
                    </button>

                  </div>
                )}
              </>
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
                item={selectedItem}
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
