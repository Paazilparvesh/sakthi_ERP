import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/* ---------------------- Types ---------------------- */
interface Operator {
  id: number;
  operator_name: string;
  operator_id: string;
}

/* ---------------------- Component ---------------------- */
const AdminOperators: React.FC = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { toast } = useToast();

  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    operator_name: "",
    operator_id: "",
  });

  /* ---------------------- Fetch Operators ---------------------- */
  const fetchOperators = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/get_operator/`);
      if (!response.ok) throw new Error("Failed to fetch operators");

      const data = await response.json();
      if (data.msg === "No operators found") {
        setOperators([]);
      } else {
        setOperators(data);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to load operators. Please check the server.",
      });
    } finally {
      setLoading(false);
    }
  }, [API_URL, toast]);

  useEffect(() => {
    fetchOperators();
  }, [fetchOperators]);

  /* ---------------------- Form Handlers ---------------------- */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddOperator = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/add_operator/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok || data.status === false) {
        throw new Error(data.message || data.error || "Failed to add operator");
      }

      toast({
        title: "Success",
        description: "Operator added successfully.",
      });

      setOpen(false);
      setFormData({ operator_name: "", operator_id: "" });
      fetchOperators();
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
        <h2 className="text-2xl font-semibold">Manage Operators</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="w-4 h-4" />
              New Operator
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Operator</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddOperator} className="space-y-4 mt-3">
              <div>
                <Label>Operator Name *</Label>
                <Input
                  name="operator_name"
                  value={formData.operator_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label>Operator ID *</Label>
                <Input
                  name="operator_id"
                  value={formData.operator_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
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

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading operators...
        </div>
      ) : operators.length === 0 ? (
        <p className="text-center text-gray-500 italic">No operators found.</p>
      ) : (
        <Card className="border shadow-sm overflow-x-auto">
          <table className="w-full border-collapse text-sm sm:text-base">
            <thead>
              <tr className="bg-slate-100 border-b text-center">
                <th className="px-4 py-2 border">S.No</th>
                <th className="px-4 py-2 border">Operator Name</th>
                <th className="px-4 py-2 border">Operator No.</th>
              </tr>
            </thead>
            <tbody>
              {operators.map((op, index) => (
                <tr
                  key={op.id}
                  className="border-b hover:bg-slate-50 text-center transition"
                >
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2 font-medium">{op.operator_name}</td>
                  <td className="border px-4 py-2">{op.operator_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default AdminOperators;
