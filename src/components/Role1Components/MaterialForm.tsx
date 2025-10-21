import React, { useState } from "react";
import { MaterialInwardForm } from "@/types/role1.type.ts";

interface MaterialFormProps {
  formData: MaterialInwardForm;
  setFormData: React.Dispatch<React.SetStateAction<MaterialInwardForm>>;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ formData, setFormData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof MaterialInwardForm, value: string | number | boolean) => {
    // Only allow numbers for numeric fields
    if ((field === "serial_number" || field === "Customer_No" || field === "mobile") && !/^\d*$/.test(value.toString())) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: keyof MaterialInwardForm, value: string | number | boolean) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // const validateField = (field: keyof MaterialInwardForm, value: string | number | boolean) => {
  //   switch (field) {
  //     case "Company_name":
  //     case "Customer_name":
  //       if (!value || (typeof value === "string" && value.trim() === ""))
  //         return "This field is required.";
  //       // ✅ No numeric validation for names
  //       break;

  //     case "serial_number":
  //     case "Customer_No":
  //     case "mobile":
  //       if (!value) return "This field is required.";
  //       if (!/^\d+$/.test(value.toString())) return "Must be numeric.";
  //       break;

  //     case "date":
  //     case "Customer_date":
  //       if (!value) return "This field is required.";
  //       if (isNaN(Date.parse(value.toString()))) return "Invalid date.";
  //       break;

  //     default:
  //       return "";
  //   }
  //   return "";
  // };

  const validateField = (field: keyof MaterialInwardForm, value: string | number | boolean) => {
  switch (field) {
    case "Company_name":
    case "Customer_name":
      if (!value || (typeof value === "string" && value.trim() === ""))
        return "This field is required.";
      break;

    case "serial_number":
    case "Customer_No":
      if (!value) return "This field is required.";
      if (!/^\d+$/.test(value.toString())) return "Must be numeric.";
      break;

    case "mobile":
      if (!value) return "This field is required.";
      if (!/^\d+$/.test(value.toString())) return "Must be numeric.";
      if (value.toString().length < 10) return "Mobile number must be at least 10 digits.";
      break;

    case "date":
    case "Customer_date":
      if (!value) return "This field is required.";
      if (isNaN(Date.parse(value.toString()))) return "Invalid date.";
      break;

    default:
      return "";
  }
  return "";
};


  return (
    <div className="bg-white shadow-md rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {/* Serial Number */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Serial No:</label>
        <input
          type="text"
          value={formData.serial_number}
          onChange={(e) => handleChange("serial_number", e.target.value)}
          onBlur={(e) => handleBlur("serial_number", e.target.value)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.serial_number ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.serial_number && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.serial_number}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Date:</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          onBlur={(e) => handleBlur("date", e.target.value)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.date ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.date && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Customer DC */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Customer DC</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="NO."
            value={formData.Customer_No}
            onChange={(e) => handleChange("Customer_No", e.target.value)}
            onBlur={(e) => handleBlur("Customer_No", e.target.value)}
            className={`flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base ${errors.Customer_No ? "border-red-500" : "border-gray-300"}`}
          />
          <input
            type="date"
            placeholder="DATE"
            value={formData.Customer_date}
            onChange={(e) => handleChange("Customer_date", e.target.value)}
            onBlur={(e) => handleBlur("Customer_date", e.target.value)}
            className={`flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base ${errors.Customer_date ? "border-red-500" : "border-gray-300"}`}
          />
        </div>
        {(errors.Customer_No || errors.Customer_date) && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.Customer_No || errors.Customer_date}</p>
        )}
      </div>

      {/* Company Name */}
      <div>
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Company Name</label>
        <input
          type="text"
          placeholder="Enter company name"
          value={formData.Company_name}
          onChange={(e) => handleChange("Company_name", e.target.value)}
          onBlur={(e) => handleBlur("Company_name", e.target.value)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.Company_name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.Company_name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.Company_name}</p>}
      </div>

      {/* Customer Name */}
      <div>
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Customer Name</label>
        <input
          type="text"
          placeholder="Enter person name"
          value={formData.Customer_name}
          onChange={(e) => handleChange("Customer_name", e.target.value)}
          onBlur={(e) => handleBlur("Customer_name", e.target.value)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.Customer_name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.Customer_name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.Customer_name}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Mobile No.</label>
        <input
          type="text"
          placeholder="Enter phone no."
          value={formData.mobile}
          onChange={(e) => handleChange("mobile", e.target.value)}
          onBlur={(e) => handleBlur("mobile", e.target.value)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.mobile && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.mobile}</p>}
      </div>
    </div>

  );
};

export default MaterialForm;
