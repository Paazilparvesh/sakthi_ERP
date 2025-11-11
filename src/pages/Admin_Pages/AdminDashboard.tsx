// import React, { useEffect, useState } from "react";
// import { UserPlus, Loader2 } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
// import { useForm } from "react-hook-form";

// // -----------------------
// // Types
// // -----------------------
// interface SignupForm {
//   username: string;
//   email: string;
//   password: string;
//   role_type: string;
// }

// interface RoleCountResponse {
//   count_inward: number;
//   count_programer: number;
//   count_QA: number;
//   count_accountent: number;
//   count_admin: number;
//   total_users: number;
// }

// // -----------------------
// // Component
// // -----------------------
// const AdminUserDashboard: React.FC = () => {
//   const [roleCount, setRoleCount] = useState<RoleCountResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { register, handleSubmit, reset } = useForm<SignupForm>();
//   const { toast } = useToast();
//   const API_URL = import.meta.env.VITE_API_URL;

//   // -----------------------
//   // Add User
//   // -----------------------
//   const onSubmit = async (data: SignupForm) => {
//     setIsSubmitting(true);
//     try {
//       const response = await fetch(`${API_URL}/api/single_signup/`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       const result = await response.json();

//       if (response.ok && result.msg === "signup successful") {
//         toast({
//           title: "✅ User Created",
//           description: `${data.username} was added successfully!`,
//         });
//         reset();
//       } else {
//         toast({
//           title: "⚠️ Error",
//           description: result.msg || "Failed to create user.",
//           variant: "destructive",
//         });
//       }
//     } catch {
//       toast({
//         title: "❌ Network Error",
//         description: "Server connection failed.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // -----------------------
//   // Fetch Counts
//   // -----------------------
//   useEffect(() => {
//     const fetchRoleCounts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/api/get_role_count/`);
//         if (!response.ok) throw new Error("Failed to fetch counts");

//         const data: RoleCountResponse = await response.json();
//         setRoleCount(data);
//       } catch (error) {
//         console.error("Error fetching counts:", error);
//         toast({
//           title: "Fetch Failed",
//           description: "Unable to load role counts. Check your server.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoleCounts();
//   }, [API_URL, toast]);

//   // -----------------------
//   // UI Rendering
//   // -----------------------
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-gray-600">
//         <Loader2 className="animate-spin mr-2" /> Loading Dashboard...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 space-y-6">
//       {/* ➕ Add User Dialog */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className="flex items-end gap-2">
//             <UserPlus className="w-4 h-4" />
//             New User
//           </Button>
//         </DialogTrigger>

//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Create New User</DialogTitle>
//             <DialogDescription>
//               Fill out the details below to add a new user.
//             </DialogDescription>
//           </DialogHeader>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <Label>Username</Label>
//               <Input
//                 placeholder="Enter username"
//                 {...register("username", { required: true })}
//                 disabled={isSubmitting}
//               />
//             </div>

//             <div>
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 placeholder="Enter email"
//                 {...register("email", { required: true })}
//                 disabled={isSubmitting}
//               />
//             </div>

//             <div>
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 placeholder="Enter password"
//                 {...register("password", { required: true })}
//                 disabled={isSubmitting}
//               />
//             </div>

//             <div>
//               <Label>Role Type</Label>
//               <select
//                 {...register("role_type", { required: true })}
//                 className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//                 disabled={isSubmitting}
//               >
//                 <option value="">Select Role</option>
//                 <option value="inward">Inward</option>
//                 <option value="programer">Programer</option>
//                 <option value="qa">QA</option>
//                 <option value="admin">Admin</option>
//                 <option value="accountent">Accountant</option>
//               </select>
//             </div>

//             <Button type="submit" className="w-full" disabled={isSubmitting}>
//               {isSubmitting ? "Creating..." : "Create User"}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* 📊 Role Count Cards */}
//       {roleCount ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
//           <Card className="bg-blue-50 border border-blue-200">
//             <CardHeader>
//               <CardTitle className="text-xl">Inward Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-blue-700">
//               {roleCount.count_inward}
//             </CardContent>
//           </Card>

//           <Card className="bg-purple-50 border border-purple-200">
//             <CardHeader>
//               <CardTitle className="text-xl">QA Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-purple-700">
//               {roleCount.count_QA}
//             </CardContent>
//           </Card>

//           <Card className="bg-green-50 border border-green-200">
//             <CardHeader>
//               <CardTitle className="text-xl">Program Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-green-700">
//               {roleCount.count_programer}
//             </CardContent>
//           </Card>

//           <Card className="bg-orange-50 border border-orange-200">
//             <CardHeader>
//               <CardTitle className="text-xl">Accountant Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-orange-700">
//               {roleCount.count_accountent}
//             </CardContent>
//           </Card>

//           <Card className="bg-orange-50 border border-orange-200">
//             <CardHeader>
//               <CardTitle className="text-xl">Admin Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-orange-700">
//               {roleCount.count_admin}
//             </CardContent>
//           </Card>

//           <Card className="bg-teal-50 border border-teal-200">
//             <CardHeader>
//               <CardTitle className="text-xl">Total Users</CardTitle>
//             </CardHeader>
//             <CardContent className="text-3xl font-semibold text-teal-700">
//               {roleCount.total_users}
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center">No role count data available.</p>
//       )}
//     </div>
//   );
// };

// export default AdminUserDashboard;




import React, { useState } from "react";
import { Users, Package, Building2, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminUsers from "@/components/AdminComponents/AdminUsers.tsx";
import AdminProducts from "@/components/AdminComponents/AdminProduct.tsx";
import AdminCompanies from "@/components/AdminComponents/AdminCompanies.tsx";
import AdminOperators from "@/components/AdminComponents/AdminOperators.tsx";

const AdminDashboardWrapper: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("products");

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "products":
        return <AdminProducts />;
      case "users":
        return <AdminUsers />;
      case "companies":
        return <AdminCompanies />;
      case "operators":
        return <AdminOperators />;
      default:
        return <AdminUsers />;
    }
  };

  return (
    <div className="">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>

        {/* Navigation Tabs */}
        <div className="flex gap-3">

          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            className="flex items-center gap-2"
          >
            <Package className="w-4 h-4" /> Products
          </Button>

          <Button
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Users
          </Button>

          <Button
            variant={activeTab === "companies" ? "default" : "outline"}
            onClick={() => setActiveTab("companies")}
            className="flex items-center gap-2"
          >
            <Building2 className="w-4 h-4" /> Companies
          </Button>

          <Button
            variant={activeTab === "operators" ? "default" : "outline"}
            onClick={() => setActiveTab("operators")}
            className="flex items-center gap-2"
          >
            <Wrench className="w-4 h-4" /> Mission Operators
          </Button>
        </div>

      </div>



      {/* Dynamic Content */}
      <div className="bg-white rounded-lg shadow p-6 border">
        {renderActiveComponent()}
      </div>
    </div>
  );
};

export default AdminDashboardWrapper;
