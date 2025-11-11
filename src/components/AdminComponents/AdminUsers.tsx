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
    <div className="space-y-6 flex flex-col items-end">
      {/* ➕ Add User Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className=" flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
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

      {/* 📊 Role Count Cards */}
      {roleCount ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: "Inward", value: roleCount.count_inward, color: "blue" },
            { title: "QA", value: roleCount.count_QA, color: "purple" },
            { title: "Programer", value: roleCount.count_programer, color: "green" },
            { title: "Accountant", value: roleCount.count_accountent, color: "orange" },
            { title: "Admin", value: roleCount.count_admin, color: "red" },
            { title: "Total", value: roleCount.total_users, color: "teal" },
          ].map(({ title, value, color }) => (
            <Card
              key={title}
              className={`bg-${color}-50 border border-${color}-200`}
            >
              <CardHeader>
                <CardTitle className="text-xl">{title} Users</CardTitle>
              </CardHeader>
              <CardContent
                className={`text-3xl font-semibold text-${color}-700`}
              >
                {value}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No role count data available.</p>
      )}
    </div>
  );
};

export default AdminUsers;
