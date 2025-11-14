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

// const AdminUsers: React.FC = () => {
//   const [roleCount, setRoleCount] = useState<RoleCountResponse | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const { register, handleSubmit, reset } = useForm<SignupForm>();
//   const { toast } = useToast();
//   const API_URL = import.meta.env.VITE_API_URL;

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

//   useEffect(() => {
//     const fetchRoleCounts = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${API_URL}/api/get_role_count/`);
//         if (!response.ok) throw new Error("Failed to fetch counts");

//         const data: RoleCountResponse = await response.json();
//         setRoleCount(data);
//       } catch (error) {
//         toast({
//           title: "Fetch Failed",
//           description: "Unable to load role counts.",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoleCounts();
//   }, [API_URL, toast]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-[60vh] text-gray-600">
//         <Loader2 className="animate-spin mr-2" /> Loading user data...
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 flex flex-col items-end">
//       {/* ➕ Add User Dialog */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button className=" flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
//           {[
//             { title: "Inward", value: roleCount.count_inward, color: "blue" },
//             { title: "QA", value: roleCount.count_QA, color: "purple" },
//             { title: "Programer", value: roleCount.count_programer, color: "green" },
//             { title: "Accountant", value: roleCount.count_accountent, color: "orange" },
//             { title: "Admin", value: roleCount.count_admin, color: "red" },
//             { title: "Total", value: roleCount.total_users, color: "teal" },
//           ].map(({ title, value, color }) => (
//             <Card
//               key={title}
//               className={`bg-${color}-50 border border-${color}-200`}
//             >
//               <CardHeader>
//                 <CardTitle className="text-xl">{title} Users</CardTitle>
//               </CardHeader>
//               <CardContent
//                 className={`text-3xl font-semibold text-${color}-700`}
//               >
//                 {value}
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-center">No role count data available.</p>
//       )}
//     </div>
//   );
// };

// export default AdminUsers;





import React, { useEffect, useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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

interface SignupForm {
  username: string;
  email: string;
  password: string;
  role_type: string;
}

interface RoleCountResponse {
  count_inward: number;
  count_programer: number;
  count_QA: number;
  count_accountent: number;
  count_admin: number;
  total_users: number;
}

const AdminUsers: React.FC = () => {
  const [roleCount, setRoleCount] = useState<RoleCountResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ⭐ NEW STATE TO STORE USERS FOR TABLE
  const [createdUsers, setCreatedUsers] = useState<SignupForm[]>([]);

  const { register, handleSubmit, reset } = useForm<SignupForm>();
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_API_URL;

  const onSubmit = async (data: SignupForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/single_signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok && result.msg === "signup successful") {
        toast({
          title: "✅ User Created",
          description: `${data.username} was added successfully!`,
        });

        // ⭐ ADD USER TO TABLE
        setCreatedUsers((prev) => [...prev, data]);

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
        title: "❌ Network Error",
        description: "Server connection failed.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchRoleCounts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/get_role_count/`);
        if (!response.ok) throw new Error("Failed to fetch counts");

        const data: RoleCountResponse = await response.json();
        setRoleCount(data);
      } catch (error) {
        toast({
          title: "Fetch Failed",
          description: "Unable to load role counts.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRoleCounts();
  }, [API_URL, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        <Loader2 className="animate-spin mr-2" /> Loading user data...
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Header with New User Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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
                  <option value="inward">Inward</option>
                  <option value="programer">Programer</option>
                  <option value="qa">QA</option>
                  <option value="admin">Admin</option>
                  <option value="accountent">Accountant</option>
                </select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create User"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Count Cards */}
      {roleCount && (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: "Inward", value: roleCount.count_inward, color: "blue" },
              { title: "QA", value: roleCount.count_QA, color: "purple" },
              { title: "Programer", value: roleCount.count_programer, color: "green" },
              { title: "Accountant", value: roleCount.count_accountent, color: "orange" },
              { title: "Admin", value: roleCount.count_admin, color: "red" },
              { title: "Total", value: roleCount.total_users, color: "teal" },
            ].map(({ title, value, color }) => (
              <Card key={title} className={`bg-${color}-50 border border-${color}-200`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">{title} Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold text-${color}-700`}>
                    {value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ⭐ IMPROVED TABLE SECTION */}
      <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Created Users</h2>
          <p className="text-sm text-gray-600 mt-1">
            List of users created through this interface
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {createdUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <UserPlus className="w-12 h-12 mb-2 text-gray-300" />
                      <p className="text-sm">No users added yet</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Create your first user by clicking the "New User" button
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                createdUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {user.username}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {user.role_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;