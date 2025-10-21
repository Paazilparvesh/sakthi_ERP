import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react';

interface ProductionItem {
  id: number; // product ID needed for API
  serial_number: string;
  // other fields if required
}

interface AddQAFormProps {
  item: ProductionItem;
  onBack?: () => void;
  onSuccess?: () => void; // optional callback after successful submission
}

const allotmentOptions = [
  'L-M/C-01', 'L-M/C-02', 'L-M/C-03',
  'F-M/C-01', 'F-M/C-02', 'F-M/C-03',
];

const AddQAForm: React.FC<AddQAFormProps> = ({ item, onBack, onSuccess }) => {
  const [programNo, setProgramNo] = useState('');
  const [selectedAllotments, setSelectedAllotments] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleCheckboxChange = (allotmentId: string, checked: boolean) => {
    if (submitted) return; // prevent further edits after submission
    setSelectedAllotments(prev =>
      checked ? [...prev, allotmentId] : prev.filter(id => id !== allotmentId)
    );
  };

  const handleSubmit = async () => {
    if (submitted) return;
    if (!programNo.trim()) {
      setError('Program No is required');
      return;
    }

    setLoading(true);
    setError(null);
    setSubmitted(true);

    const payload = {
      product_detail: item.id,
      program_no: programNo,
      lm_co1: selectedAllotments.includes('L-M/C-01'),
      lm_co2: selectedAllotments.includes('L-M/C-02'),
      lm_co3: selectedAllotments.includes('L-M/C-03'),
      fm_co1: selectedAllotments.includes('F-M/C-01'),
      fm_co2: selectedAllotments.includes('F-M/C-02'),
      fm_co3: selectedAllotments.includes('F-M/C-03'),
    };

    console.log("Payload:", payload);

    console.log("Item:", item);

    try {
      const response = await fetch(`${API_URL}/api/add_plan_product/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to submit data');
      }

      console.log('Success:', data);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    // <Card className="max-w-3xl mx-auto shadow-xl rounded-2xl relative">
    //   {onBack && (
    //     <div className="absolute top-4 right-4">
    //       <Button onClick={onBack} variant="outline" className="bg-gray-100 hover:bg-gray-200" disabled={submitted}>
    //         Back
    //       </Button>
    //     </div>
    //   )}

    //   <CardContent className="p-8 sm:p-12">
    //     <div className="flex flex-col items-center gap-y-10">
    //       {/* Serial Number */}
    //       <div className="flex items-center gap-x-4 w-full justify-center">
    //         <Label className="text-slate-500 text-lg font-medium">Serial No:</Label>
    //         <div className="bg-white border border-slate-200 rounded-xl px-6 py-2 shadow-inner">
    //           <span className="text-2xl font-bold tracking-wider text-blue-700">{item.serial_number}</span>
    //         </div>
    //       </div>

    //       {/* Program Number Input */}
    //       <div className="w-full max-w-sm">
    //         <Label
    //           htmlFor="program-no"
    //           className="font-semibold text-slate-500 text-xs tracking-wider ml-1 mb-2 block"
    //         >
    //           PROGRAM NO.
    //         </Label>
    //         <Input
    //           id="program-no"
    //           type="text"
    //           placeholder="Enter Program no.."
    //           value={programNo}
    //           onChange={(e) => setProgramNo(e.target.value)}
    //           className="py-3 rounded-xl shadow-inner"
    //           disabled={submitted}
    //         />
    //       </div>

    //       {/* M/C Allotment Section */}
    //       <div className="w-full max-w-2xl border border-slate-200 rounded-2xl p-6 shadow-inner">
    //         <h3 className="font-bold text-blue-800 mb-5 ml-1">M/C ALLOTMENT</h3>
    //         <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
    //           {allotmentOptions.map((id) => (
    //             <div key={id} className="flex items-center space-x-2">
    //               <Checkbox
    //                 id={id}
    //                 onCheckedChange={(checked) => handleCheckboxChange(id, !!checked)}
    //                 checked={selectedAllotments.includes(id)}
    //                 disabled={submitted}
    //               />
    //               <Label htmlFor={id} className="text-slate-600 font-medium cursor-pointer">
    //                 {id}
    //               </Label>
    //             </div>
    //           ))}
    //         </div>
    //       </div>

    //       {/* Error message */}
    //       {error && <p className="text-red-500 font-medium">{error}</p>}

    //       {/* Submit Button */}
    //       <Button
    //         onClick={handleSubmit}
    //         size="lg"
    //         disabled={loading || !programNo.trim() || submitted}
    //         className={`${submitted
    //             ? "bg-gray-400 cursor-not-allowed"
    //             : "bg-blue-800 hover:bg-blue-900"
    //           } text-white font-bold py-4 px-16 rounded-xl text-lg disabled:opacity-50`}
    //       >
    //         {loading ? "Submitting..." : submitted ? "Submitted" : "ADD"}
    //       </Button>
    //     </div>
    //   </CardContent>
    // </Card>
    <Card className="max-w-3xl sm:max-w-4xl mx-auto shadow-xl rounded-2xl relative w-full">
      {/* Back Button */}
      {onBack && (
        <div className="absolute top-4 right-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-gray-100 hover:bg-gray-200"
            disabled={submitted}
          >
            Back
          </Button>
        </div>
      )}

      <CardContent className="p-6 sm:p-8 md:p-12">
        <div className="flex flex-col items-center gap-y-8 sm:gap-y-10 w-full">

          {/* Serial Number */}
          <div className="flex flex-col sm:flex-row items-center gap-y-2 sm:gap-x-4 w-full justify-center">
            <Label className="text-slate-500 text-lg font-medium">Serial No:</Label>
            <div className="bg-white border border-slate-200 rounded-xl px-6 py-2 shadow-inner min-w-[140px] text-center">
              <span className="text-2xl font-bold tracking-wider text-blue-700">{item.serial_number}</span>
            </div>
          </div>

          {/* Program Number Input */}
          <div className="w-full max-w-sm">
            <Label
              htmlFor="program-no"
              className="font-semibold text-slate-500 text-xs tracking-wider ml-1 mb-2 block"
            >
              PROGRAM NO.
            </Label>
            <Input
              id="program-no"
              type="text"
              placeholder="Enter Program no.."
              value={programNo}
              onChange={(e) => setProgramNo(e.target.value)}
              className="py-3 rounded-xl shadow-inner w-full"
              disabled={submitted}
            />
          </div>

          {/* M/C Allotment Section */}
          <div className="w-full border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-inner">
            <h3 className="font-bold text-blue-800 mb-4 ml-1 text-sm sm:text-base">M/C ALLOTMENT</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {allotmentOptions.map((id) => (
                <div key={id} className="flex items-center space-x-2">
                  <Checkbox
                    id={id}
                    onCheckedChange={(checked) => handleCheckboxChange(id, !!checked)}
                    checked={selectedAllotments.includes(id)}
                    disabled={submitted}
                  />
                  <Label htmlFor={id} className="text-slate-600 font-medium cursor-pointer text-sm sm:text-base">
                    {id}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 font-medium text-sm sm:text-base">{error}</p>}

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={loading || !programNo.trim() || submitted}
            className={`${submitted
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-900"
              } text-white font-bold py-3 sm:py-4 px-10 sm:px-16 rounded-xl text-base sm:text-lg w-full sm:w-auto disabled:opacity-50`}
          >
            {loading ? "Submitting..." : submitted ? "Submitted" : "ADD"}
          </Button>
        </div>
      </CardContent>
    </Card>

  );
};

export default AddQAForm;
