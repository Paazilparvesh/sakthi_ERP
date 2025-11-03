import { Button } from "@/components/ui/button";
import { InwardFormType, InwardProps } from "@/types/inward.type";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";


const InwardTable: React.FC<InwardProps> = ({ formData, setFormData }) => {

  // Ensure at least one default row exists
  useEffect(() => {
    if (formData.Length.length === 0) {
      setFormData((prev): InwardFormType => ({
        ...prev,
        Length: [""],
        Breadth: [""],
        Height: [""],
        Quantity: [],
        Remarks: [""],
      }));
    }
  }, [formData, setFormData]);

  // Add new empty row
  const handleAddRow = () => {
    setFormData((prev): InwardFormType => ({
      ...prev,
      Length: [...(prev.Length || []), ""],
      Breadth: [...(prev.Breadth || []), ""],
      Height: [...(prev.Height || []), ""],
      Volume: [...(prev.Volume || []), ""],
      Quantity: [...prev.Quantity],
      Remarks: [...(prev.Remarks || []), ""],
    }));
  };


  // Remove a specific row
  const handleRemoveRow = (index: number) => {
    if (formData.Length.length === 1) return; // prevent removing all rows
    setFormData((prev) => ({
      ...prev,
      Quantity: prev.Quantity.filter((_, i) => i !== index),
      Remarks: prev.Remarks.filter((_, i) => i !== index),
      Length: prev.Length?.filter((_, i) => i !== index),
      Breadth: prev.Breadth?.filter((_, i) => i !== index),
      Height: prev.Height?.filter((_, i) => i !== index),
      Volume: prev.Volume?.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes
  const handleInputChange = (
    index: number,
    field: "Quantity" | "Remarks",
    value: string
  ) => {
    // Prevent non-numeric input for quantity
    if (field === "Quantity" && !/^\d*$/.test(value)) return;

    const updated = [...formData[field]];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, [field]: updated }));
  };

  const handleDimensionChange = (
    index: number,
    field: "Length" | "Breadth" | "Height",
    value: string
  ) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    setFormData((prev) => {
      const updatedField = [...(prev[field] || [])];
      updatedField[index] = numericValue;

      const length = Number(field === "Length" ? numericValue : prev.Length?.[index]) || 0;
      const breadth = Number(field === "Breadth" ? numericValue : prev.Breadth?.[index]) || 0;
      const height = Number(field === "Height" ? numericValue : prev.Height?.[index]) || 0;

      // ✅ Auto-calculate volume = L × B × H
      const volume = length && breadth && height ? (length * breadth * height).toFixed(2) : "";

      const updatedVolume = [...(prev.Volume || [])];
      updatedVolume[index] = volume === "" ? "" : parseFloat(volume);

      return {
        ...prev,
        [field]: updatedField,
        Volume: updatedVolume, // ✅ store calculated output separately
      };
    });
  };



  return (
    <div className="bg-white shadow-md rounded-2xl overflow-hidden mt-8 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Material Details</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[600px] border-collapse text-center">
          <thead className="bg-gray-200 text-gray-700 text-xs sm:text-sm md:text-base font-semibold">
            <tr>
              <th className="py-2 px-1 border w-[5%]">S.No</th>
              <th className="py-2 px-1 border w-[40%]">Material Description</th>
              <th className="py-2 px-1 border w-[10%]">Quantity</th>
              <th className="py-2 px-1 border w-[20%]">Remarks</th>
              <th className="py-2 px-1 border w-[8%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.Length.map((_, index) => (
              <tr
                key={index}
                className="border text-gray-700 transition-colors"
              >
                <td className=" border font-medium">{index + 1}</td>

                {/* Material Description (3 Inputs: L, B, H) */}
                <td className=" border">
                  <div className="flex items-center justify-center gap-2 px-4">
                    <input
                      type="number"
                      // min="0"
                      value={formData.Length?.[index]}
                      onChange={(e) => handleDimensionChange(index, "Length", e.target.value)}
                      placeholder="Length"
                      className="w-1/3 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    X
                    <input
                      type="number"
                      // min="0"
                      value={formData.Breadth?.[index]}
                      onChange={(e) => handleDimensionChange(index, "Breadth", e.target.value)}
                      placeholder="Weight"
                      className="w-1/3 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    X
                    <input
                      type="number"
                      // min="0"
                      value={formData.Height?.[index]}
                      onChange={(e) => handleDimensionChange(index, "Height", e.target.value)}
                      placeholder="Height"
                      className="w-1/3 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    =
                    <input
                      type="number"
                      readOnly
                      value={formData.Volume?.[index] || ""}
                      placeholder="Result"
                      className="w-1/3 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center bg-gray-100 text-gray-700 outline-none"
                      title="Auto-calculated (L × B × H)"
                    />

                  </div>
                </td>


                {/* Quantity */}
                <td className=" border">
                  <input
                    type="number"
                    value={formData.Quantity[index] ?? ""}
                    onChange={(e) => handleInputChange(index, "Quantity", e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Tab" &&
                        index === formData.Quantity.length - 1 && // last row
                        !e.shiftKey // not Shift+Tab
                      ) {
                        e.preventDefault(); // prevent default tab behavior (focus loss)
                        handleAddRow();
                      }
                    }}
                    placeholder="0"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>

                {/* Remarks */}
                <td className=" border">
                  <input
                    type="text"
                    value={formData.Remarks[index]}
                    onChange={(e) => handleInputChange(index, "Remarks", e.target.value)}
                    onKeyDown={(e) => {
                      if (
                        e.key === "Tab" &&
                        index === formData.Remarks.length - 1 && // last row
                        !e.shiftKey // not Shift+Tab
                      ) {
                        e.preventDefault(); // prevent default tab behavior (focus loss)
                        handleAddRow();
                      }
                    }}
                    placeholder="Optional"
                    className="w-full h-14 px-2 text-xs sm:text-sm outline-none"
                  />
                </td>

                {/* Remove Button */}
                <td className="border flex justify-center group cursor-pointer"
                  onClick={() => handleRemoveRow(index)}
                >
                  <Button
                    variant="destructive"
                    className="w-full h-14 flex items-center justify-center bg-transparent hover:bg-transparent group-hover:scale-125 transition-all  text-red-500"
                    onClick={() => handleRemoveRow(index)}
                    title="Remove Row"
                  >
                    <Trash2 className="w-4 h-4 sm:w-8 sm:h-8" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button (moved to bottom) */}
      <div className="flex justify-end mt-4">
        <Button
          className="bg-green-500 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition-all"
          onClick={handleAddRow}
        >
          + Add Row
        </Button>
      </div>

    </div>

  );
};

export default InwardTable;

