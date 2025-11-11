export interface InwardProps {
  formData: ProductType;
  setFormData: React.Dispatch<React.SetStateAction<ProductType>>;
}

export interface ProductType {
  id?: number;
  serial_number: string;
  date: string;
  inward_slip_number: string;
  color: string;
  worker_no: string;
  company_name: string;
  customer_name: string;
  customer_dc_no: string;
  contact_no: string;
  programer_status?: string;
  outward_status?: string;
  qa_status?: string;
  created_by?: string;
  materials: Material[];
}

export interface Material {
  id?: number;
  mat_type: string;
  mat_grade: string;
  thick: number | string;
  width: number | string;
  length: number | string;
  unit_weight: number | string;
  density: number | string;
  quantity: number | string;
  total_weight: number | string;
  stock_due: number | string;
  remarks: string;
  programer_status?: string;
  qa_status?: string;
  acc_status?: string;
}

export interface Company {
  id: number;
  company_name: string;
  customer_name: string;
  company_address: string;
  contact_no: string;
  company_email: string;
  customer_dc_no: string;
}
