import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QaForm2Props, ProcessDetail, ScheduleDetail, } from "@/types/qa.type";

export const QaForm2: React.FC<QaForm2Props> = ({
  product,
  scheduleData,
  processData,
  onChange,
  onBack,
  onSuccess,
}) => {
  const handleScheduleChange = (field: keyof ScheduleDetail, value: string) => {
    onChange({
      scheduleData: { ...scheduleData, [field]: value },
    });
  };

  const handleProcessChange = (
    index: number,
    field: keyof ProcessDetail,
    value: string
  ) => {
    const updated = [...processData];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ processData: updated });
  };

  return (
    <Card className="w-full shadow-xl">
      <CardContent className="p-6 space-y-8">
        {/* Product Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h2 className="text-xl font-semibold text-blue-800">
            Serial No: {product.serial_number}
          </h2>
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600"
            >
              Back
            </Button>
          )}
        </div>

        {/* Step 1: Schedule */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Schedule Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["commitmentDate", "COMMITMENT DATE"],
              ["planningDate", "PLANNING DATE"],
              ["inspectionDate", "DATE OF INSPECTION"],
              ["deliveryDate", "DATE OF DELIVERY"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="bg-white border rounded-xl p-4 shadow-inner"
              >
                <Label className="text-xs text-slate-500">{label}</Label>
                <Input
                  type="date"
                  className="border-0 p-0 mt-1"
                  value={(scheduleData as any)[key] || ""}
                  onChange={(e) =>
                    handleScheduleChange(
                      key as keyof ScheduleDetail,
                      e.target.value
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Process Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
            Process Details
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-xl">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="p-3 text-left">Process Name</th>
                  <th className="p-3 text-left">Process Date</th>
                  <th className="p-3 text-left">Cycle Time (mins)</th>
                  <th className="p-3 text-left">Operator Name</th>
                  <th className="p-3 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {processData.map((proc, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition-all"
                  >
                    <td className="p-3 font-medium text-gray-700">
                      {proc.processName}
                    </td>
                    <td className="p-3">
                      <Input
                        type="date"
                        value={proc.processDate}
                        onChange={(e) =>
                          handleProcessChange(index, "processDate", e.target.value)
                        }
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min={1}
                        max={600}
                        placeholder="Enter Mins"
                        value={proc.cycleTime}
                        onChange={(e) =>
                          handleProcessChange(index, "cycleTime", e.target.value)
                        }
                        required
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="Operator name"
                        value={proc.operatorName}
                        onChange={(e) =>
                          handleProcessChange(
                            index,
                            "operatorName",
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="p-3">
                      <Input
                        type="text"
                        placeholder="Remarks"
                        value={proc.remakers}
                        onChange={(e) =>
                          handleProcessChange(index, "remakers", e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
