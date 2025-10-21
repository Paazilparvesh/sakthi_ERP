export interface MaterialInwardForm {
  Company_name: string;
  serial_number: string;
  date: string; // YYYY-MM-DD format
  Customer_name: string;
  Customer_No: string;
  Customer_date: string; // YYYY-MM-DD format
  material_Description: string[]; // array of material descriptions
  Quantity: number[]; // array of quantities
  mobile: string;
  Remarks: string[]; // array of remarks
  size: boolean;
  Thick: boolean;
  Grade: boolean;
  Drawing: boolean;
  Test_Certificate: boolean;
  status: string; // e.g., "pending"
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
