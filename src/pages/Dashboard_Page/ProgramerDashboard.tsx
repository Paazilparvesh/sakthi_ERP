// import React, { useState, useEffect, useCallback } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useToast } from "@/components/ui/use-toast";
// import { fetchJSON } from "@/utils/api"; // ✅ import the reusable API utility

// import { Button } from "@/components/ui/button";

// // Types
// import { ProductType } from "@/types/inward.type";

// // Components
// import ProgramList from "@/components/ProgramerComponents/ProgramerList";
// import ProgramDetail from "@/components/ProgramerComponents/ProgramerDetail";
// import ProgramerForm from "@/components/ProgramerComponents/ProgramerForm";


// const ProgramerDashboard: React.FC = () => {
//   const { toast } = useToast();
//   const [FormData, setFormData] = useState<ProductType[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [view, setView] = useState<"list" | "detail" | "form">("list");
//   const [selectedItem, setSelectedItem] = useState<ProductType | null>(null);

//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 10;



//   const API_URL = import.meta.env.VITE_API_URL;


//   // ✅ Use useCallback so we can reuse fetchData later
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);
//       const result = await fetchJSON<ProductType[]>(`${API_URL}/api/get_full_products`);
//       setFormData(result);
//     } catch (err: unknown) {
//       console.error("❌ Error fetching product details:", err);
//       const errorMessage = err instanceof Error ? err.message : "Unknown error";
//       setError(errorMessage);
//       toast({
//         variant: "destructive",
//         title: "Error loading data",
//         description: "Please check your backend or network connection.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, toast]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, statusFilter]);


//   const filteredData = React.useMemo(() => {
//     return [...FormData].filter((item) => {
//       const matchesSearch =
//         item.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.serial_number?.toLowerCase().includes(searchQuery.toLowerCase());

//       const matchesStatus =
//         statusFilter === "all" || item.programer_status === statusFilter;

//       return matchesSearch && matchesStatus;
//     });
//   }, [FormData, searchQuery, statusFilter]);

//   // PAGINATION
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   const paginatedData = React.useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return filteredData.slice(start, start + rowsPerPage);
//   }, [filteredData, currentPage]);



//   // Navigation Handlers
//   const handleViewDetail = (item: ProductType) => {
//     setSelectedItem(item);
//     setView("detail");
//   };

//   const handleProceedToForm = () => setView("form");

//   const handleBack = () => {
//     setSelectedItem(null);
//     setView("list");
//   };

//   // ✅ When form submission succeeds, refresh data and go back to list
//   const handleFormSuccess = async () => {
//     await fetchData();
//     handleBack();
//     toast({
//       title: "QA Update Successful",
//       description: "Product status has been updated.",
//     });
//   };

//   const headerTitle = React.useMemo(() => {
//     switch (view) {
//       case "list":
//         return "Programer Sheet";
//       case "detail":
//         return "Program Details";
//       case "form":
//         return "Program Update Form";
//       default:
//         return "Programer Sheet";
//     }
//   }, [view]);


//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p className="text-lg font-semibold text-slate-600 animate-pulse">
//           Loading production data...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         {error}
//       </div>
//     );
//   }


//   return (
//     <div className="p-12">
//       <div className="max-w-8xl mx-auto">
//         <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
//             {headerTitle}
//           </h1>

//           <div className="flex flex-col sm:flex-row items-center gap-4">

//             {view === "list" && (
//               <>
//                 {/* Search Input */}
//                 <input
//                   type="text"
//                   placeholder="Search by company, customer or serial..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="border px-4 py-3 rounded-full w-full sm:w-72 text-sm outline-none focus:ring-2 focus:ring-blue-600"
//                 />

//                 {/* Status Filter */}
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="border px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-600"
//                 >
//                   <option value="all">All</option>
//                   <option value="pending">Pending</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </>
//             )}

//             {view === "detail" && (
//               <div className="flex gap-4">
//                 <button
//                   onClick={handleBack}
//                   className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
//                 >
//                   Back
//                 </button>

//                 {selectedItem.programer_status?.toLowerCase() === "pending" && handleProceedToForm && (
//                   <Button
//                     className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                     onClick={handleProceedToForm}
//                   >
//                     Proceed
//                   </Button>
//                 )}
//               </div>
//             )}

//             {view === "form" && null}

//           </div>
//         </div>


//         <Card className="border-none shadow-none bg-transparent">
//           <CardContent className="p-0">
//             {/* ---------------------- LIST VIEW ---------------------- */}
//             {view === "list" && (
//               <>
//                 {paginatedData.length === 0 ? (
//                   <div className="flex justify-center items-center py-20">
//                     <p className="text-lg font-medium text-slate-600">
//                       No product found.
//                     </p>
//                   </div>
//                 ) : (
//                   <>
//                     <ProgramList data={paginatedData} onView={handleViewDetail} />

//                     {/* Pagination Buttons */}
//                     {totalPages > 1 && (
//                       <div className="flex justify-end items-center gap-3 mt-6 text-sm">

//                         <button
//                           disabled={currentPage === 1}
//                           onClick={() => setCurrentPage(prev => prev - 1)}
//                           className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
//                         >
//                           Prev
//                         </button>

//                         <span className="font-medium text-slate-700">
//                           Page {currentPage} / {totalPages}
//                         </span>

//                         <button
//                           disabled={currentPage === totalPages}
//                           onClick={() => setCurrentPage(prev => prev + 1)}
//                           className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
//                         >
//                           Next
//                         </button>

//                       </div>
//                     )}
//                   </>
//                 )}
//               </>
//             )}


//             {/* --------------------- DETAIL VIEW --------------------- */}
//             {view === "detail" && selectedItem && (
//               <ProgramDetail
//                 item={selectedItem}
//               />
//             )}

//             {/* ---------------------- FORM VIEW ---------------------- */}
//             {view === "form" && selectedItem && (
//               <ProgramerForm
//                 item={selectedItem}
//                 onBack={handleBack}
//                 onSuccess={handleFormSuccess}
//               />
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>

//   );
// };

// export default ProgramerDashboard;














import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useToast } from "@/components/ui/use-toast";

// UI
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Types
import { ProductType } from "@/types/inward.type";

// Components
import ProgramList from "@/components/ProgramerComponents/ProgramerList";
import ProgramDetail from "@/components/ProgramerComponents/ProgramerDetail";
import ProgramerForm from "@/components/ProgramerComponents/ProgramerForm";

const ProgramerDashboard: React.FC = () => {
  const { toast } = useToast();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [view, setView] = useState<"list" | "detail" | "form">("list");
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const safeArray = (data: any) => (Array.isArray(data) ? data : []);

  // --------------------------- FETCH DATA -----------------------------
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/api/get_full_products/`);
      let data = [];

      try {
        data = await res.json();
      } catch {
        data = [];
      }

      setProducts(safeArray(data));

      if (!Array.isArray(data)) {
        toast({
          variant: "destructive",
          title: "Invalid data",
          description: "Server returned an incorrect response.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fetch Error",
        description: "Failed to load product data.",
      });
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, toast]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --------------------------- FILTER DATA -----------------------------
  const filteredProducts = useMemo(() => {
    const search = searchQuery.toLowerCase();

    return products
      .filter((item) => {
        const matchSearch =
          item.company_name?.toLowerCase().includes(search) ||
          item.customer_name?.toLowerCase().includes(search) ||
          item.serial_number?.toLowerCase().includes(search);

        const matchStatus =
          statusFilter === "all" ||
          item.programer_status?.toLowerCase() === statusFilter.toLowerCase();

        return matchSearch && matchStatus;
      })
      .sort((a, b) => b.id - a.id);
  }, [products, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredProducts.slice(start, start + rowsPerPage);
  }, [filteredProducts, currentPage]);

  // --------------------------- VIEW HANDLERS -----------------------------
  const handleViewDetail = (item: ProductType) => {
    setSelectedProduct(item);
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
      title: "Program Updated",
      description: "Program details have been successfully updated.",
    });
  };

  const headerTitle = useMemo(() => {
    switch (view) {
      case "list":
        return "Programer Dashboard";
      case "detail":
        return "Program Details";
      case "form":
        return "Program Update Form";
      default:
        return "Programer Dashboard";
    }
  }, [view]);

  // --------------------------- LOADING UI -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-slate-600 animate-pulse">
          Loading data...
        </p>
      </div>
    );
  }

  // --------------------------- MAIN UI -----------------------------
  return (
    <div className="p-12">
      <div className="max-w-8xl mx-auto">

        {/* HEADER */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800">
            {headerTitle}
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-4">

            {view === "list" && (
              <>
                <input
                  type="text"
                  placeholder="Search by company, customer or serial..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border px-4 py-3 rounded-full w-full sm:w-72 text-sm outline-none focus:ring-2 focus:ring-blue-600"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border px-4 py-2 rounded-lg text-sm"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </>
            )}

            {view === "detail" && selectedProduct && (
              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm"
                >
                  Back
                </button>

                {selectedProduct.programer_status?.toLowerCase() === "pending" && (
                  <Button
                    onClick={() => setView("form")}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Proceed
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        <Card className="border-none shadow-none bg-transparent">
          <CardContent className="p-0">

            {/* LIST */}
            {view === "list" && (
              <>
                {paginatedData.length === 0 ? (
                  <div className="flex justify-center items-center py-20">
                    <p className="text-lg font-medium text-slate-600">
                      No product found.
                    </p>
                  </div>
                ) : (
                  <>
                    <ProgramList
                      data={paginatedData}
                      onView={handleViewDetail}
                    />

                    {totalPages > 1 && (
                      <div className="flex justify-end items-center gap-3 mt-6 text-sm">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage((prev) => prev - 1)}
                          className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                        >
                          Prev
                        </button>

                        <span className="font-medium text-slate-700">
                          Page {currentPage} / {totalPages}
                        </span>

                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage((prev) => prev + 1)}
                          className="px-4 py-1 bg-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-300"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {/* DETAIL */}
            {view === "detail" && selectedProduct && (
              <ProgramDetail item={selectedProduct} />
            )}

            {/* FORM */}
            {view === "form" && selectedProduct && (
              <ProgramerForm
                item={selectedProduct}
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
