import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QaForm1Props } from "@/types/qa.type";


const allotmentOptions = [
  "L-M/C-01",
  "L-M/C-02",
  "L-M/C-03",
  "F-M/C-01",
  "F-M/C-02",
  "F-M/C-03",
];

const QaForm1: React.FC<QaForm1Props> = ({ item, formData, onChange, onBack }) => {
  const username = localStorage.getItem("username") || "QA";

  // ✅ Auto-generate Program No once
  useEffect(() => {
    if (!formData.programNo) {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const name = username.substring(0, 2).toUpperCase();
      const prefix = `${year}${month}${name}`;
      const lastNumber = parseInt(localStorage.getItem("lastProgramNo") || "0", 10);
      const nextNumber = lastNumber + 1;
      const formattedNumber = String(nextNumber).padStart(3, "0");
      const generatedProgramNo = `${prefix}-${formattedNumber}`;
      onChange({ programNo: generatedProgramNo });
    }
  }, []);

  const handleAllotmentChange = (id: string, checked: boolean) => {
    const updated = checked
      ? [...formData.selectedAllotments, id]
      : formData.selectedAllotments.filter((v) => v !== id);
    onChange({ selectedAllotments: updated });
  };

  const handleInspectionChange = (field: keyof typeof formData.inspectionForm) => {
    onChange({
      inspectionForm: {
        ...formData.inspectionForm,
        [field]: !formData.inspectionForm[field],
      },
    });
  };

  const inspectionOptions = [
    { label: "SIZE", field: "size" },
    { label: "THICK.", field: "Thick" },
    { label: "GRADE", field: "Grade" },
    { label: "DRAWING", field: "Drawing" },
    { label: "TEST CERT.", field: "Test_Certificate" },
  ];

  return (
    <Card className="mx-auto shadow-xl relative w-full">
      {onBack && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200 text-gray-600"
          >
            Back
          </Button>
        </div>
      )}

      <CardContent className="flex flex-col items-center p-8 space-y-8">
        <div className="flex flex-col items-center gap-2">
          <Label className="text-slate-500 text-lg font-medium">Serial No:</Label>
          <div className="bg-white border rounded-xl px-6 py-2 shadow-inner">
            <span className="text-2xl font-bold text-blue-700">{item.serial_number}</span>
          </div>
        </div>

        {/* Program Number */}
        <div className="max-w-sm mx-auto w-full">
          <Label htmlFor="program-no" className="font-semibold text-slate-500 text-xs mb-2 block">
            PROGRAM NO.
          </Label>
          <Input
            id="program-no"
            type="text"
            value={formData.programNo}
            onChange={(e) => onChange({ programNo: e.target.value })}
            className="py-3 rounded-xl shadow-inner w-full"
          />
        </div>

        {/* M/C Allotment */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            M/C Allotment
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {allotmentOptions.map((id) => (
              <label key={id} className="flex flex-col items-center gap-2 p-3 border rounded-xl">
                <input
                  type="checkbox"
                  checked={formData.selectedAllotments.includes(id)}
                  onChange={(e) => handleAllotmentChange(id, e.target.checked)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">{id}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Inspection Details */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Inspection Details
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {inspectionOptions.map(({ label, field }) => (
              <label key={field} className="flex flex-col items-center gap-2">
                <input
                  type="checkbox"
                  checked={!!formData.inspectionForm[field]}
                  onChange={() => handleInspectionChange(field as keyof typeof formData.inspectionForm)}
                  className="h-5 w-5 text-blue-600"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QaForm1;
