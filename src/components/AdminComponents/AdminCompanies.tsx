// import React, { useEffect, useState, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Loader2, Plus } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";

// interface Company {
//   id: number;
//   company_name: string;
//   customer_name: string;
//   company_address: string;
//   contact_no: string;
//   company_email: string;
//   customer_dc_no: string;
// }

// const AdminCompanies: React.FC = () => {
//   const API_URL = import.meta.env.VITE_API_URL;
//   const { toast } = useToast();

//   const [companies, setCompanies] = useState<Company[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     company_name: "",
//     customer_name: "",
//     company_address: "",
//     contact_no: "",
//     company_email: "",
//     customer_dc_no: "",
//   });

//   /* ---------------------- Fetch Companies ---------------------- */
//   const fetchCompanies = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${API_URL}/api/get_companys/`);
//       if (!response.ok) throw new Error("Failed to fetch company list");

//       const data = await response.json();
//       setCompanies(data);
//     } catch (error) {
//       console.error(error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Unable to load companies. Please check the server.",
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, [API_URL, toast]);

//   useEffect(() => {
//     fetchCompanies();
//   }, [fetchCompanies]);

//   /* ---------------------- Handle Form ---------------------- */
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleAddCompany = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch(`${API_URL}/api/add_company/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok || !data.status) {
//         throw new Error(data.message || data.error || "Failed to add company");
//       }

//       toast({
//         title: "Success",
//         description: "Company added successfully.",
//       });

//       setOpen(false);
//       setFormData({
//         company_name: "",
//         customer_name: "",
//         company_address: "",
//         contact_no: "",
//         company_email: "",
//         customer_dc_no: "",
//       });

//       fetchCompanies(); // refresh list
//     } catch (error) {
//       console.error(error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description:
//           error instanceof Error ? error.message : "Unexpected error occurred.",
//       });
//     }
//   };

//   /* ---------------------- Render ---------------------- */
//   return (
//     <div className="text-gray-700 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h2 className="text-2xl font-semibold">Manage Companies</h2>
//         <Button
//           onClick={() => setOpen(true)}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           <Plus className="w-4 h-4" /> Add Company
//         </Button>
//       </div>

//       {/* Loading */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64 text-gray-600">
//           <Loader2 className="animate-spin mr-2" /> Loading companies...
//         </div>
//       ) : companies.length === 0 ? (
//         <p className="text-center text-gray-500 italic">No companies found.</p>
//       ) : (
//         <Card className="border shadow-sm overflow-x-auto">
//           <table className="w-full border-collapse text-sm sm:text-base">
//             <thead>
//               <tr className="bg-slate-100 border-b text-center">
//                 <th className="px-4 py-2 border">S.No</th>
//                 <th className="px-4 py-2 border">Company Name</th>
//                 <th className="px-4 py-2 border">Customer Name</th>
//                 <th className="px-4 py-2 border">Address</th>
//                 <th className="px-4 py-2 border">Contact No</th>
//                 <th className="px-4 py-2 border">Email</th>
//                 <th className="px-4 py-2 border">Customer DC No</th>
//               </tr>
//             </thead>
//             <tbody>
//               {companies.map((comp, index) => (
//                 <tr
//                   key={comp.id}
//                   className="border-b hover:bg-slate-50 text-center transition"
//                 >
//                   <td className="border px-4 py-2">{index + 1}</td>
//                   <td className="border px-4 py-2 font-medium">
//                     {comp.company_name}
//                   </td>
//                   <td className="border px-4 py-2">{comp.customer_name}</td>
//                   <td className="border px-4 py-2">{comp.company_address}</td>
//                   <td className="border px-4 py-2">{comp.contact_no}</td>
//                   <td className="border px-4 py-2">{comp.company_email}</td>
//                   <td className="border px-4 py-2">{comp.customer_dc_no}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       )}

//       {/* ---------------------- Add Company Modal ---------------------- */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Add New Company</DialogTitle>
//           </DialogHeader>

//           <form onSubmit={handleAddCompany} className="space-y-4 mt-3">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <Label>Company Name *</Label>
//                 <Input
//                   name="company_name"
//                   value={formData.company_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div>
//                 <Label>Customer Name *</Label>
//                 <Input
//                   name="customer_name"
//                   value={formData.customer_name}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <Label>Company Address</Label>
//                 <Input
//                   name="company_address"
//                   value={formData.company_address}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>Contact No</Label>
//                 <Input
//                   name="contact_no"
//                   value={formData.contact_no}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>Email</Label>
//                 <Input
//                   type="email"
//                   name="company_email"
//                   value={formData.company_email}
//                   onChange={handleChange}
//                 />
//               </div>
//               <div>
//                 <Label>Customer DC No</Label>
//                 <Input
//                   name="customer_dc_no"
//                   value={formData.customer_dc_no}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <DialogFooter>
//               <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 Save
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AdminCompanies;





import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload, FileText, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import * as XLSX from 'xlsx';

interface Company {
  id: number;
  company_name: string;
  customer_name: string;
  company_address: string;
  contact_no: string;
  company_email: string;
  customer_dc_no: string;
}

interface BulkCompany {
  company_name: string;
  customer_name: string;
  company_address: string;
  contact_no: string;
  company_email: string;
  customer_dc_no: string;
}

const AdminCompanies: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [bulkUploadLoading, setBulkUploadLoading] = useState(false);
  const [previewCompanies, setPreviewCompanies] = useState<BulkCompany[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const [formData, setFormData] = useState({
    company_name: "",
    customer_name: "",
    company_address: "",
    contact_no: "",
    company_email: "",
    customer_dc_no: "",
  });

  /* ---------------------- Fetch Companies ---------------------- */
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/get_companys/`);
      if (!response.ok) throw new Error("Failed to fetch company list");

      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load companies. Please check the server.",
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  /* ---------------------- Handle Form ---------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for duplicates before adding
    const isDuplicate = companies.some(
      company => 
        company.company_name.toLowerCase() === formData.company_name.toLowerCase() &&
        company.customer_name.toLowerCase() === formData.customer_name.toLowerCase()
    );

    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Company",
        description: "A company with the same name and customer already exists.",
      });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/add_company/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.status) {
        throw new Error(data.message || data.error || "Failed to add company");
      }

      toast({
        title: "Success",
        description: "Company added successfully.",
      });

      setOpen(false);
      setFormData({
        company_name: "",
        customer_name: "",
        company_address: "",
        contact_no: "",
        company_email: "",
        customer_dc_no: "",
      });

      fetchCompanies(); // refresh list
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Unexpected error occurred.",
      });
    }
  };

  /* ---------------------- Bulk Upload Functions ---------------------- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setBulkUploadLoading(true);

    // Check if it's an Excel file
    if (!file.name.match(/\.(xlsx|xls|csv)$/)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an Excel file (.xlsx, .xls, or .csv)",
      });
      setBulkUploadLoading(false);
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: "",
          raw: false,
          blankrows: false
        });

        if (jsonData.length === 0) {
          throw new Error("No data found in the Excel file");
        }

        const parsedCompanies: BulkCompany[] = [];
        const seenCompanies = new Set();
        let skippedRows = 0;
        let duplicateCount = 0;

        jsonData.forEach((row: any, index: number) => {
          try {
            // Skip completely empty rows
            const rowValues = Object.values(row);
            const isEmptyRow = rowValues.every(value => 
              value === "" || value === null || value === undefined
            );
            
            if (isEmptyRow) {
              skippedRows++;
              return;
            }

            // Function to find field value with multiple possible column names
            const getFieldValue = (possibleNames: string[]): string => {
              for (const name of possibleNames) {
                if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
                  return String(row[name]).trim();
                }
                
                const normalizedName = name.toLowerCase().replace(/[\s_]+/g, '');
                for (const key of Object.keys(row)) {
                  const normalizedKey = key.toLowerCase().replace(/[\s_]+/g, '');
                  if (normalizedKey === normalizedName && row[key] !== undefined && row[key] !== null && row[key] !== '') {
                    return String(row[key]).trim();
                  }
                }
              }
              return '';
            };

            const companyName = getFieldValue(['company_name', 'company name', 'company', 'comp_name']);
            const customerName = getFieldValue(['customer_name', 'customer name', 'customer', 'cust_name']);
            const companyAddress = getFieldValue(['company_address', 'company address', 'address', 'comp_address']);
            const contactNo = getFieldValue(['contact_no', 'contact no', 'contact', 'phone', 'mobile', 'contact_number']);
            const companyEmail = getFieldValue(['company_email', 'company email', 'email', 'comp_email']);
            const customerDcNo = getFieldValue(['customer_dc_no', 'customer dc no', 'dc no', 'dc_number', 'customer_dc']);

            // Validate required fields
            if (!companyName || !customerName) {
              skippedRows++;
              return;
            }

            // Create unique key for duplicate detection
            const companyKey = `${companyName.toLowerCase().trim()}_${customerName.toLowerCase().trim()}`;
            
            // Check for duplicates within the same file
            if (seenCompanies.has(companyKey)) {
              duplicateCount++;
              skippedRows++;
              return;
            }

            seenCompanies.add(companyKey);
            
            parsedCompanies.push({
              company_name: companyName,
              customer_name: customerName,
              company_address: companyAddress,
              contact_no: contactNo,
              company_email: companyEmail,
              customer_dc_no: customerDcNo
            });

          } catch (error) {
            skippedRows++;
          }
        });

        if (parsedCompanies.length === 0) {
          throw new Error(
            "No valid companies found in the Excel file. " +
            "Please ensure your file has columns for 'Company Name' and 'Customer Name'."
          );
        }

        setPreviewCompanies(parsedCompanies);
        
        let description = `Found ${parsedCompanies.length} valid companies`;
        if (duplicateCount > 0) {
          description += `, ${duplicateCount} duplicates skipped`;
        }
        if (skippedRows > 0) {
          description += `, ${skippedRows} invalid rows skipped`;
        }
        
        toast({
          title: "File Processed Successfully",
          description: description,
        });
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast({
          variant: "destructive",
          title: "Error Processing File",
          description: error instanceof Error ? error.message : "Failed to parse the file. Please check the format.",
        });
        setPreviewCompanies([]);
        setUploadedFileName("");
      } finally {
        setBulkUploadLoading(false);
      }
    };

    reader.onerror = () => {
      setBulkUploadLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the file.",
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const handleBulkUpload = async () => {
    if (previewCompanies.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No companies to upload. Please upload a file first.",
      });
      return;
    }

    setBulkUploadLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/company_bulk_upload_create/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companies: previewCompanies }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || data.error || "Failed to upload companies");
      }

      toast({
        title: "Bulk Upload Successful",
        description: data.msg || `Successfully uploaded companies to the database.`,
      });

      // Reset bulk upload state
      setPreviewCompanies([]);
      setUploadedFileName("");
      
      // Refresh the companies list
      fetchCompanies();
      
      // Close the modal
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description:
          error instanceof Error ? error.message : "Unexpected error occurred during bulk upload.",
      });
    } finally {
      setBulkUploadLoading(false);
    }
  };

  const clearBulkUpload = () => {
    setPreviewCompanies([]);
    setUploadedFileName("");
  };

  // Function to remove duplicate companies from the main table
  const removeDuplicates = (companies: Company[]): Company[] => {
    const seen = new Set();
    return companies.filter(company => {
      const key = `${company.company_name.toLowerCase()}_${company.customer_name.toLowerCase()}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // Get unique companies for display
  const uniqueCompanies = removeDuplicates(companies);

  /* ---------------------- Render ---------------------- */
  return (
    <div className="text-gray-700 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Companies</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Showing {uniqueCompanies.length} unique companies
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" /> Add Company
          </Button>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading companies...
        </div>
      ) : uniqueCompanies.length === 0 ? (
        <p className="text-center text-gray-500 italic">No companies found.</p>
      ) : (
        <Card className="border shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-slate-100 border-b text-center">
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Company Name</th>
                <th className="px-4 py-2 border">Customer Name</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Contact No</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Customer DC No</th>
              </tr>
            </thead>
            <tbody>
              {uniqueCompanies.map((comp, index) => (
                <tr
                  key={comp.id}
                  className="border-b hover:bg-slate-50 text-center transition"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 font-medium">
                    {comp.company_name}
                  </td>
                  <td className="border px-4 py-2">{comp.customer_name}</td>
                  <td className="border px-4 py-2">{comp.company_address}</td>
                  <td className="border px-4 py-2">{comp.contact_no}</td>
                  <td className="border px-4 py-2">{comp.company_email}</td>
                  <td className="border px-4 py-2">{comp.customer_dc_no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ---------------------- Add Company Modal (Two Columns) ---------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-3">
            {/* Left Column - Single Company Form */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Add Single Company</h3>
              
              <form onSubmit={handleAddCompany} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name *</Label>
                    <Input
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Customer Name *</Label>
                    <Input
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Company Address</Label>
                    <Input
                      name="company_address"
                      value={formData.company_address}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Contact No</Label>
                    <Input
                      name="contact_no"
                      value={formData.contact_no}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="company_email"
                      value={formData.company_email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Customer DC No</Label>
                    <Input
                      name="customer_dc_no"
                      value={formData.customer_dc_no}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Company
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Column - Bulk Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">Bulk Upload Companies</h3>
              
              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {!uploadedFileName ? (
                  <div className="space-y-3">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <Label htmlFor="bulk-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </Label>
                      <p className="text-sm text-gray-500 mt-1">
                        Excel files only (.xlsx, .xls, .csv)
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Required columns: Company Name, Customer Name
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Duplicate companies will be automatically filtered out
                      </p>
                    </div>
                    <Input
                      id="bulk-upload"
                      type="file"
                      accept=".xlsx,.xls,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <FileText className="w-12 h-12 text-green-500 mx-auto" />
                    <p className="font-medium truncate">{uploadedFileName}</p>
                    <p className="text-sm text-green-600">
                      {previewCompanies.length} unique companies found
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearBulkUpload}
                      className="flex items-center gap-2 mx-auto"
                    >
                      <X className="w-4 h-4" /> Change File
                    </Button>
                  </div>
                )}
              </div>

              {/* Loading State */}
              {bulkUploadLoading && previewCompanies.length === 0 && (
                <div className="text-center py-4">
                  <Loader2 className="animate-spin mx-auto mb-2 w-6 h-6" />
                  <p className="text-sm text-gray-600">Processing Excel file...</p>
                </div>
              )}

              {/* Preview Section */}
              {previewCompanies.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">Preview ({previewCompanies.length} unique companies)</h4>
                    <Button
                      onClick={handleBulkUpload}
                      disabled={bulkUploadLoading}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {bulkUploadLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload All
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left border-b font-semibold">#</th>
                          <th className="px-3 py-2 text-left border-b font-semibold">Company Name</th>
                          <th className="px-3 py-2 text-left border-b font-semibold">Customer Name</th>
                          <th className="px-3 py-2 text-left border-b font-semibold">Email</th>
                          <th className="px-3 py-2 text-left border-b font-semibold">Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewCompanies.map((company, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-3 py-2 text-xs text-gray-500">{index + 1}</td>
                            <td className="px-3 py-2">{company.company_name}</td>
                            <td className="px-3 py-2">{company.customer_name}</td>
                            <td className="px-3 py-2 text-sm">{company.company_email || '-'}</td>
                            <td className="px-3 py-2 text-sm">{company.contact_no || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    <p>Only unique companies will be uploaded. Duplicates are automatically filtered out.</p>
                    <p>Required fields: Company Name, Customer Name</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanies;