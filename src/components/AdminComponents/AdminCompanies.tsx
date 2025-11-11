import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Company {
  id: number;
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

  /* ---------------------- Render ---------------------- */
  return (
    <div className="text-gray-700 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Companies</h2>
        <Button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4" /> Add Company
        </Button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading companies...
        </div>
      ) : companies.length === 0 ? (
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
              {companies.map((comp, index) => (
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

      {/* ---------------------- Add Company Modal ---------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Company</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCompany} className="space-y-4 mt-3">
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanies;
