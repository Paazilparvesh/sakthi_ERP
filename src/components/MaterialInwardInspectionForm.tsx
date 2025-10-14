import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MaterialRow {
  slNo: number;
  description: string;
  qty: string;
  remarks: string;
}

interface FormData {
  slNo: string;
  date: Date | undefined;
  customerDcNo: string;
  companyName: string;
  nameAndMobile: string;
  materials: MaterialRow[];
  inspectionDetails: {
    size: boolean;
    thick: boolean;
    grade: boolean;
    drawg: boolean;
    testCert: boolean;
  };
}

const MaterialInwardInspectionForm = () => {
  const [formData, setFormData] = useState<FormData>({
    slNo: '1497',
    date: new Date(),
    customerDcNo: '',
    companyName: 'Sakthi Technology',
    nameAndMobile: '',
    materials: Array.from({ length: 6 }, (_, i) => ({
      slNo: i + 1,
      description: '',
      qty: '',
      remarks: '',
    })),
    inspectionDetails: {
      size: false,
      thick: false,
      grade: false,
      drawg: false,
      testCert: false,
    },
  });

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleMaterialChange = (index: number, field: keyof MaterialRow, value: string) => {
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index] = { ...updatedMaterials[index], [field]: value };
    setFormData((prev) => ({ ...prev, materials: updatedMaterials }));
  };

  const handleInspectionChange = (field: keyof typeof formData.inspectionDetails) => {
    setFormData((prev) => ({
      ...prev,
      inspectionDetails: {
        ...prev.inspectionDetails,
        [field]: !prev.inspectionDetails[field],
      },
    }));
  };

  const handleSave = () => {
    console.log('Form Data:', formData);
    alert('Form saved! Check console for data.');
  };

  const handleReset = () => {
    setFormData({
      slNo: '1497',
      date: new Date(),
      customerDcNo: '',
      companyName: 'Sakthi Technology',
      nameAndMobile: '',
      materials: Array.from({ length: 6 }, (_, i) => ({
        slNo: i + 1,
        description: '',
        qty: '',
        remarks: '',
      })),
      inspectionDetails: {
        size: false,
        thick: false,
        grade: false,
        drawg: false,
        testCert: false,
      },
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Material Inward Cum Incoming Inspection Report
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 space-y-6">
          {/* Header Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="slNo">SL. No.</Label>
              <Input
                id="slNo"
                value={formData.slNo}
                onChange={(e) => handleInputChange('slNo', e.target.value)}
                className="bg-muted"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => handleInputChange('date', date)}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerDcNo">Customer DC No. / Date</Label>
              <Input
                id="customerDcNo"
                value={formData.customerDcNo}
                onChange={(e) => handleInputChange('customerDcNo', e.target.value)}
                placeholder="Enter DC No. / Date"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nameAndMobile">Name & Mobile No.</Label>
              <Input
                id="nameAndMobile"
                value={formData.nameAndMobile}
                onChange={(e) => handleInputChange('nameAndMobile', e.target.value)}
                placeholder="Enter name & mobile"
              />
            </div>
          </div>

          {/* Material Table Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Material Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                <thead>
                  <tr className="bg-table-header text-white">
                    <th className="border border-border px-3 py-2 text-left font-semibold w-16">Sl. No.</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Material Description</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold w-24">Qty</th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.materials.map((material, index) => (
                    <tr key={material.slNo} className="hover:bg-table-row-hover transition-colors">
                      <td className="border border-border px-3 py-2 text-center font-medium">
                        {material.slNo}
                      </td>
                      <td className="border border-border px-3 py-2">
                        <Input
                          value={material.description}
                          onChange={(e) => handleMaterialChange(index, 'description', e.target.value)}
                          placeholder="Enter description"
                          className="border-0 focus-visible:ring-0"
                        />
                      </td>
                      <td className="border border-border px-3 py-2">
                        <Input
                          type="number"
                          value={material.qty}
                          onChange={(e) => handleMaterialChange(index, 'qty', e.target.value)}
                          placeholder="Qty"
                          className="border-0 focus-visible:ring-0"
                        />
                      </td>
                      <td className="border border-border px-3 py-2">
                        <Input
                          value={material.remarks}
                          onChange={(e) => handleMaterialChange(index, 'remarks', e.target.value)}
                          placeholder="Remarks"
                          className="border-0 focus-visible:ring-0"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspection Details Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground border-b pb-2">Inspection Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="size"
                  checked={formData.inspectionDetails.size}
                  onCheckedChange={() => handleInspectionChange('size')}
                />
                <Label htmlFor="size" className="cursor-pointer font-medium">
                  SIZE
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="thick"
                  checked={formData.inspectionDetails.thick}
                  onCheckedChange={() => handleInspectionChange('thick')}
                />
                <Label htmlFor="thick" className="cursor-pointer font-medium">
                  THICK.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="grade"
                  checked={formData.inspectionDetails.grade}
                  onCheckedChange={() => handleInspectionChange('grade')}
                />
                <Label htmlFor="grade" className="cursor-pointer font-medium">
                  GRADE
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="drawg"
                  checked={formData.inspectionDetails.drawg}
                  onCheckedChange={() => handleInspectionChange('drawg')}
                />
                <Label htmlFor="drawg" className="cursor-pointer font-medium">
                  DRAWG.
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="testCert"
                  checked={formData.inspectionDetails.testCert}
                  onCheckedChange={() => handleInspectionChange('testCert')}
                />
                <Label htmlFor="testCert" className="cursor-pointer font-medium">
                  TEST CERT.
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Reset
            </Button>
            <Button onClick={handleSave} className="w-full sm:w-auto">
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialInwardInspectionForm;
