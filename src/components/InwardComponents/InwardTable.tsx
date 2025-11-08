import { Button } from "@/components/ui/button";
import { ProductType, InwardProps, Material } from "@/types/inward.type";
import { useEffect } from "react";
import { Trash2 } from "lucide-react";


const InwardTable: React.FC<InwardProps> = ({ formData, setFormData }) => {

  // ✅ Standard material densities (in your required unit)
  const MATERIAL_DENSITIES: Record<string, number> = {
    SS: 0.000008,
    MS: 0.00000785,
    Aluminium: 0.0000027,
    Copper: 0.00000896,
    Brass: 0.0000084,
  };

  const TEC = Object.keys(MATERIAL_DENSITIES);

  // ✅ Helper: Calculate Unit Weight, Total Weight, and Stock Due
  const recalcWeights = (mat: Material) => {
    const { thick, width, length, density, quantity } = mat;

    // Volume-based unit weight
    const volume =
      Number(thick) && Number(width) && Number(length)
        ? Number(thick) * Number(width) * Number(length)
        : 0;

    const unitWeight =
      volume > 0 && Number(density) > 0
        ? parseFloat((volume * Number(density)).toFixed(3))
        : "";

    const totalWeight =
      Number(quantity) > 0 && Number(unitWeight) > 0
        ? parseFloat((Number(quantity) * Number(unitWeight)).toFixed(3))
        : "";

    // Simple stock due logic (customize as needed)
    let stock_due = "";
    if (Number(totalWeight) > 0 && Number(totalWeight) < 50) stock_due = "1";
    else if (Number(totalWeight) >= 50 && Number(totalWeight) < 200) stock_due = "3";
    else if (Number(totalWeight) >= 200) stock_due = "5";

    return { ...mat, unit_weight: unitWeight, total_weight: totalWeight, stock_due };
  };

  // Ensure at least one default row exists
  useEffect(() => {
    if (!formData.materials || formData.materials.length === 0) {
      setFormData((prev): ProductType => ({
        ...prev,
        materials: [
          {
            mat_type: "",
            mat_grade: "",
            thick: "",
            width: "",
            length: "",
            density: "",
            unit_weight: "",
            quantity: "",
            total_weight: "",
            stock_due: "",
            remarks: "",
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
          mat_type: "",
          mat_grade: "",
          thick: "",
          width: "",
          length: "",
          density: "",
          unit_weight: "",
          quantity: "",
          total_weight: "",
          stock_due: "",
          remarks: "",
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
      let mat = { ...updatedMaterials[index] };

      (mat[field] as string | number) = value;

      // ✅ If mat_type changes, auto-assign Density
      if (field === "mat_type" && typeof value === "string") {
        const newDensity = MATERIAL_DENSITIES[value] || "";
        mat.density = newDensity;
      }

      // If quantity or type changes, recalc weights
      if (["mat_type", "quantity"].includes(field)) {
        mat = recalcWeights(mat);
      }

      updatedMaterials[index] = mat;
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
      let mat = { ...updatedMaterials[index] };
      mat[field] = numericValue;

      mat = recalcWeights(mat);

      updatedMaterials[index] = mat;
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
              <th className="py-2 px-1 border w-[10%]">TEC</th>
              <th className="py-2 px-1 border w-[8%]">Grade</th>
              <th className="py-2 px-1 border w-[35%]">Dimensions</th>
              <th className="py-2 px-1 border w-[8%]">Qty</th>
              <th className="py-2 px-1 border w-[8%]">Total weight</th>
              <th className="py-2 px-1 border w-[15%]">Stock Due</th>
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
                    {TEC.map((type) => (
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

                {/* Dimensions Section */}
                <td className="border">
                  <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 px-2">
                    {["thick", "width", "length"].map(
                      (field) => (
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
                    x
                    <input
                      type="number"
                      readOnly
                      value={mat.density || ""}
                      placeholder="Density"
                      className="w-1/3 border border-gray-300 rounded-lg px-1 py-1 text-xs sm:text-sm text-center bg-gray-100 text-gray-700 outline-none"
                      title="Auto from TEC"
                    />
                    =
                    <input
                      type="number"
                      readOnly
                      value={mat.unit_weight || ""}
                      placeholder="Unit Wt."
                      className="w-1/4 border border-gray-300 rounded-lg pl-1 py-1 text-xs sm:text-sm text-center bg-gray-100 text-gray-700 outline-none"
                      title="Auto-calculated"
                    />
                  </div>
                </td>

                {/* Quantity */}
                <td className="border">
                  <input
                    type="number"
                    value={mat.quantity}
                    onChange={(e) =>
                      handleInputChange(index, "quantity", e.target.value)
                    }
                    placeholder="0"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>

                {/* Total Weight in Kgs */}
                <td className="border">
                  <input
                    type="number"
                    value={mat.total_weight}
                    onChange={(e) =>
                      handleInputChange(index, "total_weight", e.target.value)
                    }
                    placeholder="Total Weight"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>


                {/* Stock Due */}
                <td className="border">
                  <input
                    type="number"
                    value={mat.stock_due}
                    onChange={(e) =>
                      handleInputChange(index, "stock_due", e.target.value)
                    }
                    placeholder="Days"
                    className="w-full h-14 px-2 py-1 text-xs sm:text-sm text-center outline-none"
                  />
                </td>

                {/* Remarks */}
                <td className="border">
                  <input
                    type="text"
                    value={mat.remarks}
                    onChange={(e) =>
                      handleInputChange(index, "remarks", e.target.value)
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

