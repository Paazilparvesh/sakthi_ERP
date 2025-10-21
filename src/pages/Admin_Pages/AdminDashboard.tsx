// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Users,
//   Package,
//   TrendingUp,
//   DollarSign,
//   UserPlus,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { useForm } from "react-hook-form";


// interface SignupForm {
//   username: string;
//   email: string;
//   password: string;
//   role_type: string;
// }

// interface SystemMetric {
//   id: number;
//   module: string;
//   status: string;
//   uptime: string;
//   lastUpdate: string;
//   users: number;
// }

// const dummyData: SystemMetric[] = [
//   { id: 1, module: "Project Management", status: "Active", uptime: "99.9%", lastUpdate: "2024-01-25 10:30", users: 25 },
//   { id: 2, module: "Inventory System", status: "Active", uptime: "99.5%", lastUpdate: "2024-01-25 09:15", users: 18 },
//   { id: 3, module: "HR Management", status: "Active", uptime: "100%", lastUpdate: "2024-01-25 08:45", users: 12 },
//   { id: 4, module: "Sales & Orders", status: "Maintenance", uptime: "98.2%", lastUpdate: "2024-01-24 16:00", users: 32 },
//   { id: 5, module: "Finance Module", status: "Active", uptime: "99.8%", lastUpdate: "2024-01-25 11:00", users: 8 },
// ];

// const AdminDashboard: React.FC = () => {
//   const { toast } = useToast();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { register, handleSubmit, reset } = useForm<SignupForm>();

  // const onSubmit = async (data: SignupForm) => {
  //   setIsSubmitting(true);
  //   try {
  //     const API_URL = import.meta.env.VITE_API_URL;
  //     const response = await fetch(`${API_URL}/api/single_signup/`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     });

  //     const result = await response.json();

  //     if (response.ok && result.msg === "signup successful") {
  //       toast({
  //         title: "✅ Success",
  //         description: `${data.username} created successfully!`,
  //       });
  //       reset();
  //     } else {
  //       toast({
  //         title: "⚠️ Error",
  //         description: result.msg || "Failed to create user.",
  //         variant: "destructive",
  //       });
  //     }
  //   } catch (err) {
  //     toast({
  //       title: "❌ Error",
  //       description: "Server connection failed.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Active":
//         return "bg-green-500 text-white";
//       case "Maintenance":
//         return "bg-yellow-500 text-white";
//       case "Down":
//         return "bg-red-500 text-white";
//       default:
//         return "bg-secondary text-secondary-foreground";
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header Section */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-3xl font-bold text-foreground">
//             Admin Dashboard
//           </h2>
//           <p className="text-muted-foreground">
//             System overview and administration
//           </p>
//         </div>

//         {/* Create User Button + Modal */}
        // <Dialog>
        //   <DialogTrigger asChild>
        //     <Button className="flex items-center gap-2">
        //       <UserPlus className="w-4 h-4" />
        //       New User
        //     </Button>
        //   </DialogTrigger>
        //   <DialogContent className="sm:max-w-md">
        //     <DialogHeader>
        //       <DialogTitle>Create New User</DialogTitle>
        //       <DialogDescription>
        //         Fill out the details below to add a new user.
        //       </DialogDescription>
        //     </DialogHeader>

        //     <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        //       <div>
        //         <Label>Username</Label>
        //         <Input
        //           placeholder="Enter username"
        //           {...register("username", { required: true })}
        //           disabled={isSubmitting}
        //         />
        //       </div>

        //       <div>
        //         <Label>Email</Label>
        //         <Input
        //           type="email"
        //           placeholder="Enter email"
        //           {...register("email", { required: true })}
        //           disabled={isSubmitting}
        //         />
        //       </div>

        //       <div>
        //         <Label>Password</Label>
        //         <Input
        //           type="password"
        //           placeholder="Enter password"
        //           {...register("password", { required: true })}
        //           disabled={isSubmitting}
        //         />
        //       </div>

        //       <div>
        //         <Label>Role Type</Label>
        //         <select
        //           {...register("role_type", { required: true })}
        //           className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        //           disabled={isSubmitting}
        //         >
        //           <option value="">Select Role</option>
        //           <option value="role1">Role 1</option>
        //           <option value="QA">QA</option>
        //           <option value="product">Product</option>
        //           <option value="Admin">Admin</option>
        //           <option value="accountent">Accountent</option>
        //         </select>
        //       </div>

        //       <Button type="submit" className="w-full" disabled={isSubmitting}>
        //         {isSubmitting ? "Creating..." : "Create User"}
        //       </Button>
        //     </form>
        //   </DialogContent>
        // </Dialog>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Total Users</CardTitle>
//             <Users className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">95</div>
//             <p className="text-xs text-muted-foreground">+5 from last month</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Active Modules</CardTitle>
//             <Package className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">5</div>
//             <p className="text-xs text-muted-foreground">All systems operational</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">99.5%</div>
//             <p className="text-xs text-muted-foreground">Last 30 days</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between pb-2">
//             <CardTitle className="text-sm font-medium">Revenue</CardTitle>
//             <DollarSign className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">₹8.5M</div>
//             <p className="text-xs text-muted-foreground">+12% from last month</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* System Status Table */}
//       <Card>
//         <CardHeader>
//           <CardTitle>System Modules Status</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b bg-muted text-muted-foreground">
//                   <th className="px-4 py-3 text-left font-semibold">ID</th>
//                   <th className="px-4 py-3 text-left font-semibold">Module</th>
//                   <th className="px-4 py-3 text-left font-semibold">Status</th>
//                   <th className="px-4 py-3 text-left font-semibold">Uptime</th>
//                   <th className="px-4 py-3 text-left font-semibold">Last Update</th>
//                   <th className="px-4 py-3 text-left font-semibold">Active Users</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {dummyData.map((metric) => (
//                   <tr key={metric.id} className="border-b hover:bg-muted/30 transition">
//                     <td className="px-4 py-3 font-medium">{metric.id}</td>
//                     <td className="px-4 py-3">{metric.module}</td>
//                     <td className="px-4 py-3">
//                       <Badge className={getStatusColor(metric.status)}>
//                         {metric.status}
//                       </Badge>
//                     </td>
//                     <td className="px-4 py-3 font-semibold">{metric.uptime}</td>
//                     <td className="px-4 py-3">{metric.lastUpdate}</td>
//                     <td className="px-4 py-3 font-medium">{metric.users}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default AdminDashboard;




// src/pages/AdminProductQAView.tsx
// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
// import { useToast } from "@/components/ui/use-toast";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// // -----------------------
// // Types
// // -----------------------
// interface Product {
//   product_id: number;
//   Company_name: string;
//   serial_number: string;
//   date: string;
//   Customer_name: string;
//   Customer_No: string;
//   Customer_date: string;
//   mobile: string;
//   status: string;
// }

// interface QADetail {
//   product_id: number;
//   program_no: string;
//   lm_co1: boolean;
//   lm_co2: boolean;
//   lm_co3: boolean;
//   fm_co1: boolean;
//   fm_co2: boolean;
//   fm_co3: boolean;
//   status: string;
// }

// interface ScheduleView {
//   product_id: number;
//   commitment_Date: string;
//   planning_date: string;
//   date_of_inspection: string;
//   date_of_delivery: string;
// }

// interface ScheduleProcess {
//   product_id: number;
//   schedule_name: number;
//   process_date: string;
//   cycle_time: string;
//   operator_name: string;
//   remark: string;
//   status: string;
// }

// interface APIResponse {
//   msg: string;
//   product: Product[];
//   qa_details: QADetail[];
//   schedule_view: ScheduleView[];
//   schedule_process: ScheduleProcess[];
// }

// // -----------------------
// // Component
// // -----------------------
// const AdminProductQAView: React.FC = () => {
//   const [data, setData] = useState<APIResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://127.0.0.1:8000/api/product_qa_view/");
//         if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
//         const result: APIResponse = await response.json();
//         setData(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast({
//           title: "Fetch Failed",
//           description: "Unable to load product data. Please check your server.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [toast]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-gray-600">
//         <Loader2 className="animate-spin mr-2" /> Loading data...
//       </div>
//     );
//   }

//   if (!data) {
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-gray-500">
//         No data available
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <Card className="shadow-md border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-xl font-semibold text-blue-700">
//             🧾 Product & QA Overview
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product ID</TableHead>
//                 <TableHead>Company</TableHead>
//                 <TableHead>Serial</TableHead>
//                 <TableHead>Customer</TableHead>
//                 <TableHead>Mobile</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.product.map((p) => (
//                 <TableRow key={p.product_id} className="hover:bg-gray-50">
//                   <TableCell>{p.product_id}</TableCell>
//                   <TableCell>{p.Company_name}</TableCell>
//                   <TableCell>{p.serial_number}</TableCell>
//                   <TableCell>{p.Customer_name}</TableCell>
//                   <TableCell>{p.mobile}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-2 py-1 text-xs rounded ${
//                         p.status === "complete"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {p.status}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold text-purple-700">
//             🧩 QA Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product ID</TableHead>
//                 <TableHead>Program No</TableHead>
//                 <TableHead>LM CO1</TableHead>
//                 <TableHead>LM CO2</TableHead>
//                 <TableHead>LM CO3</TableHead>
//                 <TableHead>FM CO1</TableHead>
//                 <TableHead>FM CO2</TableHead>
//                 <TableHead>FM CO3</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.qa_details.map((qa, index) => (
//                 <TableRow key={index} className="hover:bg-gray-50">
//                   <TableCell>{qa.product_id}</TableCell>
//                   <TableCell>{qa.program_no}</TableCell>
//                   <TableCell>{qa.lm_co1 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.lm_co2 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.lm_co3 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.fm_co1 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.fm_co2 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.fm_co3 ? "✅" : "❌"}</TableCell>
//                   <TableCell>{qa.status}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold text-orange-700">
//             📅 Schedule Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product ID</TableHead>
//                 <TableHead>Commitment</TableHead>
//                 <TableHead>Planning</TableHead>
//                 <TableHead>Inspection</TableHead>
//                 <TableHead>Delivery</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.schedule_view.map((s, index) => (
//                 <TableRow key={index} className="hover:bg-gray-50">
//                   <TableCell>{s.product_id}</TableCell>
//                   <TableCell>{s.commitment_Date}</TableCell>
//                   <TableCell>{s.planning_date}</TableCell>
//                   <TableCell>{s.date_of_inspection}</TableCell>
//                   <TableCell>{s.date_of_delivery}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md border border-gray-200">
//         <CardHeader>
//           <CardTitle className="text-lg font-semibold text-teal-700">
//             ⚙️ Process Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product ID</TableHead>
//                 <TableHead>Schedule Name</TableHead>
//                 <TableHead>Process Date</TableHead>
//                 <TableHead>Cycle Time</TableHead>
//                 <TableHead>Operator</TableHead>
//                 <TableHead>Remark</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {data.schedule_process.map((sp, index) => (
//                 <TableRow key={index} className="hover:bg-gray-50">
//                   <TableCell>{sp.product_id}</TableCell>
//                   <TableCell>{sp.schedule_name}</TableCell>
//                   <TableCell>{sp.process_date}</TableCell>
//                   <TableCell>{sp.cycle_time}</TableCell>
//                   <TableCell>{sp.operator_name}</TableCell>
//                   <TableCell>{sp.remark}</TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-2 py-1 text-xs rounded ${
//                         sp.status === "complete"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }`}
//                     >
//                       {sp.status}
//                     </span>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <div className="text-center pt-4">
//         <Button onClick={() => window.location.reload()}>🔄 Refresh Data</Button>
//       </div>
//     </div>
//   );
// };

// export default AdminProductQAView;




import React, { useEffect, useState } from "react";
import {
  UserPlus,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";

// -----------------------
// Types
// -----------------------
interface SignupForm {
  username: string;
  email: string;
  password: string;
  role_type: string;
}

interface Product {
  product_id: number;
  Company_name: string;
  serial_number: string;
  date: string;
  Customer_name: string;
  Customer_No: string;
  Customer_date: string;
  mobile: string;
  status: string;
}

interface QADetail {
  product_id: number;
  program_no: string;
  lm_co1: boolean;
  lm_co2: boolean;
  lm_co3: boolean;
  fm_co1: boolean;
  fm_co2: boolean;
  fm_co3: boolean;
  status: string;
}

interface ScheduleView {
  product_id: number;
  commitment_Date: string;
  planning_date: string;
  date_of_inspection: string;
  date_of_delivery: string;
}

interface ScheduleProcess {
  product_id: number;
  schedule_name: number;
  process_date: string;
  cycle_time: string;
  operator_name: string;
  remark: string;
  status: string;
}

interface APIResponse {
  msg: string;
  product: Product[];
  qa_details: QADetail[];
  schedule_view: ScheduleView[];
  schedule_process: ScheduleProcess[];
}

interface RoleCountResponse {
  count: number;
  count_QA: number;
  count_product: number;
  count_accountent: number;
  ["Total Product"]: number;
}

// -----------------------
// Main Component
// -----------------------
const AdminProductQAView: React.FC = () => {
  const [data, setData] = useState<APIResponse | null>(null);
  const [roleCount, setRoleCount] = useState<RoleCountResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset } = useForm<SignupForm>();
  const { toast } = useToast();

  // Create new user form
  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/api/single_signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.msg === "signup successful") {
        toast({
          title: "✅ Success",
          description: `${data.username} created successfully!`,
        });
        reset();
      } else {
        toast({
          title: "⚠️ Error",
          description: result.msg || "Failed to create user.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "❌ Error",
        description: "Server connection failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch data for products + role counts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [productRes, roleCountRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/product_qa_view/"),
          fetch("http://127.0.0.1:8000/api/get_role_count/"),
        ]);

        if (!productRes.ok || !roleCountRes.ok)
          throw new Error("API request failed");

        const productData: APIResponse = await productRes.json();
        const roleCountData: RoleCountResponse = await roleCountRes.json();

        setData(productData);
        setRoleCount(roleCountData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Fetch Failed",
          description: "Unable to load data. Please check your server.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading data...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        No data available
      </div>
    );
  }

  // -----------------------
  // Detail View Component
  // -----------------------
  // const ProductDetailView = ({ product }: { product: Product }) => {
  //   const qa = data.qa_details.filter((q) => q.product_id === product.product_id);
  //   const schedule = data.schedule_view.filter(
  //     (s) => s.product_id === product.product_id
  //   );
  //   const process = data.schedule_process.filter(
  //     (p) => p.product_id === product.product_id
  //   );

  //   return (
  //     <div className="p-6 space-y-6">
  //       <div className="flex justify-between items-center">
  //         <h2 className="text-2xl font-semibold text-blue-700">
  //           Product #{product.product_id} Details
  //         </h2>
  //         <Button
  //           variant="outline"
  //           onClick={() => setSelectedProduct(null)}
  //           className="flex items-center gap-2"
  //         >
  //           <ArrowLeft size={16} /> Back
  //         </Button>
  //       </div>

  //       {/* Product Info */}
  //       <Card className="border border-gray-200 shadow-sm">
  //         <CardHeader>
  //           <CardTitle className="text-lg">📦 Product Info</CardTitle>
  //         </CardHeader>
  //         <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
  //           <div><b>Company:</b> {product.Company_name}</div>
  //           <div><b>Serial No:</b> {product.serial_number}</div>
  //           <div><b>Customer:</b> {product.Customer_name}</div>
  //           <div><b>Mobile:</b> {product.mobile}</div>
  //           <div><b>Status:</b> {product.status}</div>
  //           <div><b>Date:</b> {product.date}</div>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // };

  
  // -----------------------
  // Product Detail View
  // -----------------------
  const ProductDetailView = ({ product }: { product: Product }) => {
    const qa = data?.qa_details.filter((q) => q.product_id === product.product_id) || [];
    const schedule = data?.schedule_view.filter(
      (s) => s.product_id === product.product_id
    ) || [];
    const process = data?.schedule_process.filter(
      (p) => p.product_id === product.product_id
    ) || [];

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-blue-700">
            Product #{product.product_id} Details
          </h2>
          <Button
            variant="outline"
            onClick={() => setSelectedProduct(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </Button>
        </div>

        {/* Product Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">📦 Product Info</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div><b>Company:</b> {product.Company_name}</div>
            <div><b>Serial No:</b> {product.serial_number}</div>
            <div><b>Customer:</b> {product.Customer_name}</div>
            <div><b>Mobile:</b> {product.mobile}</div>
            <div><b>Status:</b> {product.status}</div>
            <div><b>Date:</b> {product.date}</div>
          </CardContent>
        </Card>

        {/* QA Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-purple-700">🧩 QA Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program No</TableHead>
                  <TableHead>LM CO1</TableHead>
                  <TableHead>LM CO2</TableHead>
                  <TableHead>LM CO3</TableHead>
                  <TableHead>FM CO1</TableHead>
                  <TableHead>FM CO2</TableHead>
                  <TableHead>FM CO3</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qa.map((q, index) => (
                  <TableRow key={index}>
                    <TableCell>{q.program_no}</TableCell>
                    <TableCell>{q.lm_co1 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.lm_co2 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.lm_co3 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.fm_co1 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.fm_co2 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.fm_co3 ? "✅" : "❌"}</TableCell>
                    <TableCell>{q.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Schedule Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-700">
              📅 Schedule Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Commitment</TableHead>
                  <TableHead>Planning</TableHead>
                  <TableHead>Inspection</TableHead>
                  <TableHead>Delivery</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {schedule.map((s, index) => (
                  <TableRow key={index}>
                    <TableCell>{s.commitment_Date}</TableCell>
                    <TableCell>{s.planning_date}</TableCell>
                    <TableCell>{s.date_of_inspection}</TableCell>
                    <TableCell>{s.date_of_delivery}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Process Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-teal-700">
              ⚙️ Process Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule Name</TableHead>
                  <TableHead>Process Date</TableHead>
                  <TableHead>Cycle Time</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Remark</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {process.map((p, index) => (
                  <TableRow key={index}>
                    <TableCell>{p.schedule_name}</TableCell>
                    <TableCell>{p.process_date}</TableCell>
                    <TableCell>{p.cycle_time}</TableCell>
                    <TableCell>{p.operator_name}</TableCell>
                    <TableCell>{p.remark}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          p.status === "complete"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  };


  // -----------------------
  // Product List View
  // -----------------------
  if (!selectedProduct) {
    return (
      <div className="p-6 space-y-6">
        {/* Add User Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              New User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill out the details below to add a new user.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  placeholder="Enter username"
                  {...register("username", { required: true })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  {...register("email", { required: true })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  {...register("password", { required: true })}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label>Role Type</Label>
                <select
                  {...register("role_type", { required: true })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  disabled={isSubmitting}
                >
                  <option value="">Select Role</option>
                  <option value="role1">Role 1</option>
                  <option value="QA">QA</option>
                  <option value="product">Product</option>
                  <option value="Admin">Admin</option>
                  <option value="accountent">Accountent</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Role Count Cards - Single Row */}
        {roleCount && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Card className="bg-blue-50 border border-blue-200">
              <CardHeader>
                <CardTitle>Inward Users</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold text-blue-700">
                {roleCount.count}
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border border-purple-200">
              <CardHeader>
                <CardTitle>QA Users</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold text-purple-700">
                {roleCount.count_QA}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border border-green-200">
              <CardHeader>
                <CardTitle>Product Users</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold text-green-700">
                {roleCount.count_product}
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border border-orange-200">
              <CardHeader>
                <CardTitle>Accountant Users</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold text-orange-700">
                {roleCount.count_accountent}
              </CardContent>
            </Card>

            <Card className="bg-teal-50 border border-teal-200">
              <CardHeader>
                <CardTitle>Total Products</CardTitle>
              </CardHeader>
              <CardContent className="text-3xl font-semibold text-teal-700">
                {roleCount["Total Product"]}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Product Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-blue-700">
              🧾 Product List
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.product.map((p) => (
                  <TableRow key={p.product_id}>
                    <TableCell>{p.product_id}</TableCell>
                    <TableCell>{p.Company_name}</TableCell>
                    <TableCell>{p.Customer_name}</TableCell>
                    <TableCell>{p.mobile}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          p.status === "complete"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedProduct(p)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show details if selected
  return <ProductDetailView product={selectedProduct} />;
};

export default AdminProductQAView;
