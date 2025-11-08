import React, { useState, useEffect } from "react";
import { ProductType, Company, InwardProps } from "@/types/inward.type";




const InwardForm: React.FC<InwardProps> = ({ formData, setFormData }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [companyList, setCompanyList] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // 🔹 Fetch company list from API
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/get_companys/`);
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanyList(data);
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [API_URL]);

  // 🔹 Keep search term synced with formData (for back navigation or prefilled data)
  useEffect(() => {
    if (formData.company_name && formData.company_name !== searchTerm) {
      setSearchTerm(formData.company_name);
    }
  }, [formData.company_name, searchTerm]);

  const handleChange = (field: keyof ProductType, value: string | number | boolean) => {
    if ((field === "serial_number" || field === "customer_dc_no" || field === "contact_no") && !/^\d*$/.test(value.toString())) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleBlur = (field: keyof ProductType, value: string | number | boolean) => {
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateField = (field: keyof ProductType, value: string | number | boolean) => {
    switch (field) {
      case "company_name":
      case "customer_name":
        if (!value || (typeof value === "string" && value.trim() === ""))
          return "This field is required.";
        break;
      case "inward_slip_number":
      case "serial_number":
      case "worker_no":
      case "customer_dc_no":
        if (!value) return "This field is required.";
        if (!/^\d+$/.test(value.toString())) return "Must be numeric.";
        break;
      case "contact_no":
        if (!value) return "This field is required.";
        if (!/^\d+$/.test(value.toString())) return "Must be numeric.";
        if (value.toString().length < 10) return "Mobile number must be at least 10 digits.";
        break;
      case "date":
        if (!value) return "This field is required.";
        if (isNaN(Date.parse(value.toString()))) return "Invalid date.";
        break;
      default:
        return "";
    }
    return "";
  };

  // 🔹 Search company by name
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.trim() === "") {
      setFilteredCompanies([]);
      setShowSuggestions(false);
      return;
    }
    const results = companyList.filter((company) =>
      company.company_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCompanies(results);
    setShowSuggestions(true);
  };

  // 🔹 When a company is selected
  const handleSelectCompany = (company: Company) => {
    setFormData((prev) => ({
      ...prev,
      company_name: company.company_name,
      customer_name: company.customer_name,
      contact_no: company.contact_no,
      customer_dc_no: company.customer_dc_no,
    }));
    setSearchTerm(company.company_name);
    setFilteredCompanies([]);
    setShowSuggestions(false);
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {/* Serial Number */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Serial No.</label>
        <input
          type="text"
          inputMode="numeric"
          value={formData.serial_number}
          onChange={(e) => handleChange("serial_number", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.serial_number ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.serial_number && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.serial_number}</p>}
      </div>
      {/* Inward Slip Number */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Inward Slip No.</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter Inward Slip No."
          value={formData.inward_slip_number}
          onChange={(e) => handleChange("inward_slip_number", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.inward_slip_number ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.inward_slip_number && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.inward_slip_number}</p>}
      </div>

      {/* Ratio Selection */}
      <div className="mt-3">
        <p className="text-gray-500 mb-2 text-sm sm:text-base">Select Color</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="radio"
              value="yellow"
              checked={formData.color === "yellow"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm sm:text-base text-gray-700">Yellow</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="radio"
              value="White"
              checked={formData.color === "White"}
              onChange={(e) => handleChange("color", e.target.value)}
              className="accent-blue-600 w-4 h-4"
            />
            <span className="text-sm sm:text-base text-gray-700">White</span>
          </label>
        </div>
      </div>




      {/* Date */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Date</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}

          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.date ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.date && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.date}</p>}
      </div>

      {/* Inward Slip Number */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Worker No.</label>
        <input
          type="text"
          inputMode="numeric"
          value={formData.worker_no}
          onChange={(e) => handleChange("worker_no", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder="Enter Your Worker No."
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.worker_no ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.worker_no && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.worker_no}</p>}
      </div>


      {/* Company Name with Search */}
      <div className="relative">
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Company Name</label>
        <input
          type="text"
          placeholder={loading ? "Loading companies..." : "Search or enter company name"}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.company_name ? "border-red-500" : "border-gray-300"
            }`}
          disabled={loading}
        />
        {/* Suggestions Dropdown */}
        {showSuggestions && filteredCompanies.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-1 max-h-40 overflow-y-auto">
            {filteredCompanies.map((company) => (
              <li
                key={company.id}
                onClick={() => handleSelectCompany(company)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm sm:text-base"
              >
                {company.company_name}
              </li>
            ))}
          </ul>
        )}
        {loading && (
          <p className="text-gray-400 text-xs mt-1">Loading company list...</p>
        )}
        {showSuggestions && !loading && filteredCompanies.length === 0 && (
          <p className="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg w-full mt-1 px-4 py-2 text-gray-500 text-sm">
            No companies found.
          </p>
        )}

        {errors.company_name && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.company_name}</p>
        )}
      </div>

      {/* Customer DC */}
      <div>
        <label className="block text-gray-500 mb-1 sm:mb-2 text-sm sm:text-base">Customer Document No.</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter Document number"
            value={formData.customer_dc_no}
            onChange={(e) => handleChange("customer_dc_no", e.target.value)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className={`flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base ${errors.customer_dc_no ? "border-red-500" : "border-gray-300"
              }`}
          />
        </div>
        {(errors.customer_dc_no) && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.customer_dc_no}
          </p>
        )}
      </div>

      {/* Customer Name */}
      <div>
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Customer Name</label>
        <input
          type="text"
          placeholder="Enter Customer name"
          value={formData.customer_name}
          onChange={(e) => handleChange("customer_name", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.customer_name ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.customer_name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.customer_name}</p>}
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">Customer Mobile No.</label>
        <input
          type="text"
          inputMode="numeric"
          placeholder="Enter Customer Mobile No."
          value={formData.contact_no}
          onChange={(e) => handleChange("contact_no", e.target.value)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className={`w-full border rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base ${errors.contact_no ? "border-red-500" : "border-gray-300"
            }`}
        />
        {errors.contact_no && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.contact_no}</p>}
      </div>
    </div>
  );
};

export default InwardForm;
