import React from "react";
import { MaterialInwardForm } from "@/types/role1.type.ts";

interface InspectionDetailsProps {
    formData: MaterialInwardForm;
    setFormData: React.Dispatch<React.SetStateAction<MaterialInwardForm>>;
}

export const InspectionDetails: React.FC<InspectionDetailsProps> = ({
    formData,
    setFormData,
}) => {


    const options: { label: string; field: keyof MaterialInwardForm }[] = [
        { label: "SIZE", field: "size" },
        { label: "THICK.", field: "Thick" },
        { label: "GRADE", field: "Grade" },
        { label: "DRAWING", field: "Drawing" },
        { label: "TEST CERT.", field: "Test_Certificate" },
    ];

    const handleCheckboxChange = (field: keyof MaterialInwardForm) => {
        setFormData((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };


    return (
        // <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-4xl mx-auto">
        //     <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">
        //         Inspection Details
        //     </h2>

        //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        //         {options.map(({ label, field }) => (
        //             <label
        //                 key={field}
        //                 className="flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl hover:bg-gray-50 transition duration-200"
        //             >
        //                 <input
        //                     type="checkbox"
        //                     checked={formData[field] as boolean} // cast to boolean
        //                     onChange={() => handleCheckboxChange(field)}
        //                     className="h-6 w-6 rounded-lg text-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-150"
        //                 />
        //                 <span className="text-gray-700 font-medium">{label}</span>
        //             </label>
        //         ))}
        //     </div>


        // </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 w-full max-w-5xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6 border-b pb-2">
                Inspection Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                {options.map(({ label, field }) => (
                    <label
                        key={field}
                        className="flex flex-col items-center gap-2 sm:gap-3 cursor-pointer p-3 sm:p-4 rounded-xl hover:bg-gray-50 transition duration-200"
                    >
                        <input
                            type="checkbox"
                            checked={!!formData[field]} // ensure boolean
                            onChange={() => handleCheckboxChange(field)}
                            className="h-5 w-5 sm:h-6 sm:w-6 rounded-lg text-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-150"
                        />
                        <span className="text-sm sm:text-base text-gray-700 font-medium text-center">
                            {label}
                        </span>
                    </label>
                ))}
            </div>
        </div>

    );
};
