import { Button } from "@/components/ui/button";
import { MaterialInwardForm } from "@/types/role1.type.ts";

interface ProductTableProps {
  formData: MaterialInwardForm;
  setFormData: React.Dispatch<React.SetStateAction<MaterialInwardForm>>;
}

const ProductTable: React.FC<ProductTableProps> = ({ formData, setFormData }) => {

  // Add new empty row
  const handleAddRow = () => {
    setFormData((prev): MaterialInwardForm => ({
      ...prev,
      material_Description: [...prev.material_Description, ""],
      Quantity: [...prev.Quantity, 0], // ✅ Use 0 (number), not ""
      Remarks: [...prev.Remarks, ""],
    }));
  };

  // Remove a specific row
  const handleRemoveRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      material_Description: prev.material_Description.filter((_, i) => i !== index),
      Quantity: prev.Quantity.filter((_, i) => i !== index),
      Remarks: prev.Remarks.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes
  const handleInputChange = (
    index: number,
    field: "material_Description" | "Quantity" | "Remarks",
    value: string
  ) => {
    // Prevent non-numeric input for quantity
    if (field === "Quantity" && !/^\d*$/.test(value)) return;

    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden mt-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Material Details</h2>
        <Button
          className="bg-blue-900 text-white px-4 sm:px-6 py-2 rounded-xl hover:bg-blue-800 transition-all w-full sm:w-auto"
          onClick={handleAddRow}
        >
          + Add Row
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[600px] border-collapse text-center">
          <thead className="bg-gray-200 text-gray-700 text-xs sm:text-sm md:text-base font-semibold">
            <tr>
              <th className="py-2 px-1 border w-[5%]">SL.NO</th>
              <th className="py-2 px-1 border w-[40%]">MATERIAL DESCRIPTION</th>
              <th className="py-2 px-1 border w-[15%]">QTY</th>
              <th className="py-2 px-1 border w-[30%]">REMARKS</th>
              <th className="py-2 px-1 border w-[10%]">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {formData.material_Description.map((_, index) => (
              <tr
                key={index}
                className="border text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <td className="py-2 px-1 border font-medium">{index + 1}</td>

                {/* Material Description */}
                <td className="py-2 px-1 border">
                  <input
                    type="text"
                    value={formData.material_Description[index]}
                    onChange={(e) =>
                      handleInputChange(index, "material_Description", e.target.value)
                    }
                    placeholder="Enter material name or details"
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>

                {/* Quantity */}
                <td className="py-2 px-1 border">
                  <input
                    type="text"
                    value={formData.Quantity[index]}
                    onChange={(e) => handleInputChange(index, "Quantity", e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>

                {/* Remarks */}
                <td className="py-2 px-1 border">
                  <input
                    type="text"
                    value={formData.Remarks[index]}
                    onChange={(e) => handleInputChange(index, "Remarks", e.target.value)}
                    placeholder="Optional"
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </td>

                {/* Remove Button */}
                <td className="py-2 px-1 border">
                  <Button
                    variant="destructive"
                    className="text-xs sm:text-sm px-2 py-1 rounded-md w-full"
                    onClick={() => handleRemoveRow(index)}
                  >
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default ProductTable;

