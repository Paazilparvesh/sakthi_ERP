export interface InwardFormType {
  Company_name: string;
  serial_number: string;
  date: string; // YYYY-MM-DD format
  Customer_name: string;
  Customer_No: string;
  Customer_date: string; // YYYY-MM-DD format
  Quantity: (number | string)[]; // array of quantities
  mobile: string;
  Remarks: string[]; // array of remarks
  Test_Certificate: boolean;
  status: string; // e.g., "pending"
  // 🔹 New fields for calculations
  Length?: (number | string)[];
  Breadth?: (number | string)[];
  Height?: (number | string)[];
  Volume?: (number | string)[];
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

export interface AddProductResponse {
  msg: string;
  Company_name: string;
  serial_number: string;
  date: string;
  Customer_name: string;
  Customer_No: string;
  Customer_date: string;
  material_Description: string[];
  Quantity: number[];
  mobile: string;
  Remarks: string[];
  size: boolean;
  Thick: boolean;
  Grade: boolean;
  Drawing: boolean;
  Test_Certificate: boolean;
  status: string;
}


export interface InwardProps {
  formData: InwardFormType;
  setFormData: React.Dispatch<React.SetStateAction<InwardFormType>>;
}