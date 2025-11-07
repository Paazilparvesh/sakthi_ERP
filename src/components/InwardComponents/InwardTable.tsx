import { Button } from "@/components/ui/button";
import { ProductType, InwardProps, Material } from "@/types/inward.type";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";


const InwardTable: React.FC<InwardProps> = ({ formData, setFormData }) => {


  const MATERIAL_TYPES = ["SS", "MS", "Aluminium", "Copper", "Brass"];

  // Ensure at least one default row exists
  useEffect(() => {
    if (!formData.materials || formData.materials.length === 0) {
      setFormData((prev): ProductType => ({
        ...prev,
        materials: [
          {
            Thick: "",
            Width: "",
            Length: "",
            UnitWeight: "",
            Density: "",
            Quantity: "",
            mat_type: "",
            mat_grade: "",
            Remarks: "",
          },
        ],
      }));
    }
  }, [formData, setFormData]);

  // Add new empty row
  const handleAddRow = () => {
    setFormData((prev): ProductType => ({
      ...prev,
      materials: [
        ...(prev.materials || []),
        {
          Thick: "",
          Width: "",
          Length: "",
          UnitWeight: "",
          Density: "",
          Quantity: "",
          mat_type: "",
          mat_grade: "",
          Remarks: "",
        },
      ],
    }));
  };

  // Remove a specific row
  const handleRemoveRow = (index: number) => {
    if (formData.materials && formData.materials.length === 1) return;
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes
  const handleInputChange = (
    index: number,
    field: keyof Material,
    value: string | number
  ) => {
    setFormData((prev) => {
      const updatedMaterials = [...(prev.materials || [])];
      (updatedMaterials[index][field] as string | number) = value; // ✅ Fix here
      return { ...prev, materials: updatedMaterials };
    });
  };

  const handleDimensionChange = (
    index: number,
    field: keyof ProductType,
    value: string
  ) => {
    const numericValue = value === "" ? "" : parseFloat(value);

    setFormData((prev) => {
      const updatedMaterials = [...(prev.materials || [])];
      updatedMaterials[index][field] = numericValue;

      const { Thick, Width, Length, UnitWeight } = updatedMaterials[index];
      const volume =
        Number(Thick) && Number(Width) && Number(Length)
          ? Number(Thick) * Number(Width) * Number(Length)
          : 0;

      const Density =
        volume > 0 && Number(UnitWeight) > 0
          ? parseFloat((Number(UnitWeight) / volume).toFixed(4))
          : "";

      updatedMaterials[index].Density = Density;

      return { ...prev, materials: updatedMaterials };
    });
  };



  return (
    <div className="bg-white overflow-hidden mt-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Material Details
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-[800px] border-collapse text-center">
          <thead className="bg-gray-200 text-gray-700 text-xs sm:text-sm md:text-base font-semibold">
            <tr>
              <th className="py-2 px-1 border w-[5%]">S.No</th>
              <th className="py-2 px-1 border w-[10%]">Type</th>
              <th className="py-2 px-1 border w-[8%]">Grade</th>
              <th className="py-2 px-1 border w-[35%]">Dimensions</th>
              <th className="py-2 px-1 border w-[8%]">Qty</th>
              <th className="py-2 px-1 border w-[15%]">Remarks</th>
              <th className="py-2 px-1 border w-[7%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.materials?.map((mat, index) => (
              <tr key={index} className="border text-gray-700 transition-colors">
                <td className="border font-medium">{index + 1}</td>

                {/* Material Type Dropdown */}
                <td className="border px-2">
                  <select
                    value={mat.mat_type}
                    onChange={(e) =>
                      handleInputChange(index, "mat_type", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg px-2 py-1 text-xs sm:text-sm text-center outline-none bg-white"
                  >
                    <option value="">Select</option>
                    {MATERIAL_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Material Grade */}
                <td className="border px-2">
                  <input
                    type="text"
                    value={mat.mat_grade}
                    onChange={(e) => handleInputChange(index, "mat_grade", e.target.value)}
                    placeholder="Enter Grade"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>


                {/* Material Dimensiona (Thick × Width × Length × Weight = Density) */}
                {/* <td className="border">
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 px-2">
                    <input
                      type="number"
                      min="0"
                      value={formData.Thick?.[index] ?? ""}
                      onChange={(e) =>
                        handleDimensionChange(index, "Thick", e.target.value)
                      }
                      placeholder="Thick"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    ×
                    <input
                      type="number"
                      min="0"
                      value={formData.Width?.[index] ?? ""}
                      onChange={(e) =>
                        handleDimensionChange(index, "Width", e.target.value)
                      }
                      placeholder="Width"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    ×
                    <input
                      type="number"
                      min="0"
                      value={formData.Length?.[index] ?? ""}
                      onChange={(e) =>
                        handleDimensionChange(index, "Length", e.target.value)
                      }
                      placeholder="Length"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    ×
                    <input
                      type="number"
                      min="0"
                      value={formData.UnitWeight?.[index] ?? ""}
                      onChange={(e) =>
                        handleDimensionChange(index, "UnitWeight", e.target.value)
                      }
                      placeholder="Weight"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                    />
                    =
                    <input
                      type="number"
                      readOnly
                      value={formData.Density?.[index] || ""}
                      placeholder="Density"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center bg-gray-100 text-gray-700 outline-none"
                      title="Auto-calculated"
                    />
                  </div>
                </td> */}
                <td className="border">
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 px-2">
                    {["Thick", "Width", "Length", "UnitWeight"].map(
                      (field, i) => (
                        <input
                          key={field}
                          type="number"
                          min="0"
                          value={mat[field as keyof ProductType] || ""}
                          onChange={(e) =>
                            handleDimensionChange(index, field as keyof ProductType, e.target.value)
                          }
                          placeholder={field}
                          className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center outline-none"
                        />
                      )
                    )}
                    =
                    <input
                      type="number"
                      readOnly
                      value={mat.Density || ""}
                      placeholder="Density"
                      className="w-1/5 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center bg-gray-100 text-gray-700 outline-none"
                      title="Auto-calculated"
                    />
                  </div>
                </td>

                {/* Quantity */}
                <td className="border">
                  <input
                    type="number"
                    value={mat.Quantity}
                    onChange={(e) =>
                      handleInputChange(index, "Quantity", e.target.value)
                    }
                    placeholder="0"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>

                {/* Remarks */}
                <td className="border">
                  <input
                    type="text"
                    value={mat.Remarks}
                    onChange={(e) =>
                      handleInputChange(index, "Remarks", e.target.value)
                    }
                    placeholder="Optional"
                    className="w-full h-14 px-2 text-xs sm:text-sm outline-none"
                  />
                </td>

                {/* Remove Button */}
                <td
                  className="border flex justify-center group cursor-pointer"
                  onClick={() => handleRemoveRow(index)}
                >
                  <Button
                    variant="destructive"
                    className="w-full h-14 flex items-center justify-center bg-transparent hover:bg-transparent group-hover:scale-125 transition-all text-red-500"
                    title="Remove Row"
                  >
                    <Trash2 className="w-4 h-4 sm:w-6 sm:h-6" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
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

