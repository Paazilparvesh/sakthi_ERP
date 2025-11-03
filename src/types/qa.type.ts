export interface QaItem {
    id: number;                      // Primary key
    serial_number: string;           // Serial number of the product
    Company_name: string;            // Company name
    date?: string;                   // Date of product creation or record
    Customer_name?: string;          // Customer name
    Customer_No?: string;            // Customer DC number
    Customer_date?: string;          // Customer delivery date
    mobile?: string;                 // Customer mobile number
    status?: string;                 // Product status
    materials?: Material[];
}

export interface ProcessDetail {
  processName: string;
  processDate: string;
  cycleTime: string;
  operatorName: string;
  remakers: string;
}

export interface ScheduleDetail {
  commitmentDate: string;
  planningDate: string;
  inspectionDate: string;
  deliveryDate: string;
}
export interface Schedule {
  id: number;
  product_plan: number;
  commitment_date: string;
  planning_date: string;
  date_of_inspection: string;
  date_of_delivery: string;
}

export interface ScheduleProcess {
  id: number;
  schedule_id: number;
  process_date: string;
  cycle_time: string;
  operator_name: string;
  remark: string;
  status: string;
}

export interface QAData {
  product_id: number;
  product_options: MaterialInwardForm[];
  plan_products: PlanProduct[];
  schedules: Schedule[];
  schedule_processes: ScheduleProcess[];
}



export interface MaterialInwardForm {
  // id: number;
  size: boolean;
  Thick: boolean;
  Grade: boolean;
  Drawing: boolean;
  Test_Certificate: boolean;
}

export interface ProgramFormData {
  programNo: string;
  selectedAllotments: string[];
  inspectionForm: MaterialInwardForm;
  processData: ProcessDetail[];
  scheduleData: ScheduleDetail;
}


// --- Types ---
export interface ProductId {
  id: number;
  serial_number: string;
}

export interface QaFormWrapperProps {
  item: ProductId;
  onBack?: () => void;
  onSuccess?: () => void;
}


export interface QaTableProps {
    data: QaItem[];
    onView: (item: QaItem) => void;
}



export interface ProductItem {
  id: number;
  serial_number: string;
}

export interface QaForm1Props {
  item: ProductItem;
  formData: ProgramFormData;
  onChange: (data: Partial<ProgramFormData>) => void;
  onBack?: () => void;
}


export interface Material {
  id: number;
  Length: number;
  Breadth: number;
  Height: number;
  Result: number;
  Quantity: number;
  Remarks: string;
  created_by: string;
}

export interface SerialDetailProps {
  item: QaItem;
  onBack: () => void;
  onProceed?: () => void; // optional handler for pending status
}


export interface QaForm2Props {
  product: { id: number; serial_number: string };
  scheduleData: ScheduleDetail;
  processData: ProcessDetail[];
  onChange: (data: Partial<ProgramFormData>) => void;
  onBack?: () => void;
  onSuccess?: () => void;
}


export interface PlanProduct {
  id: number;
  product_detail: number;
  program_no: string;
  lm_co1: string;
  lm_co2: string;
  lm_co3: string;
  fm_co1: string;
  fm_co2: string;
  fm_co3: string;
  status: string;
}