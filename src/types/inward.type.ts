export interface ProductType {
  id: number;
  serial_number: string;
  date: string;
  inward_slip_number: string;
  ratio: string;
  wo_no: string;
  tec: string;
  Company_name: string;
  Customer_name: string;
  Customer_No: string;
  mobile: string;
  Test_Certificate: boolean;
  status: string;
  outward_status: string;
  qa_status: string;
  created_by?: string;
  materials: Material[];
}

export interface Material {
  id?: number;
  Thick: number | string;
  Width: number | string;
  Length: number | string;
  UnitWeight: number | string;
  Density: number | string;
  Quantity: number | string;
  mat_type: string;
  mat_grade: string;
  Remarks: string;
}



export interface Company {
  id: number;
  company_name: string;
  customer_name: string;
  address: string;
  contact_no: string;
  email: string;
  customer_DC_No: string;
}

export interface InwardProps {
  formData: ProductType;
  setFormData: React.Dispatch<React.SetStateAction<ProductType>>;
}