// React
import React, { useMemo } from "react";
// Auth
import { useAuth } from "@/context/AuthContext";
// Types
import { UserRole } from "@/types/user.type";
// Base Layout
import BaseLayout from "@/layouts/BaseLayout";
// Role-specific dashboards
import InwardDashboard from "@/pages/Dashboard_Page/InwardDashboard";
import ProgramerDashboard from "@/pages/Dashboard_Page/ProgramerDashboard";
import OutwardDashboard from "@/pages/Dashboard_Page/OutWardDashboard";
import AdminDashboard from "@/pages/Admin_Pages/AdminDashboard";
// UI Components
import { Card, CardContent, CardTitle } from "@/components/ui/card";


const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Map roles to their dashboards
  const dashboardMap: Record<UserRole, React.ReactNode> = useMemo(
    () => ({
      inward: <InwardDashboard />,
      programer: <ProgramerDashboard />,
      qa: <OutwardDashboard role="qa" />,
      accountent: <OutwardDashboard role="accountent" />,
      admin: <AdminDashboard />,
    }),
    []
  );

  const content = useMemo(() => {

    if (isLoading) {
      return (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Loading dashboard...
        </div>
      );
    }

    if (!user) {
      return (
        <Card className="max-w-md mx-auto mt-10">
          <CardContent className="text-center space-y-2 py-6">
            <CardTitle>User not authenticated</CardTitle>
            <p className="text-sm text-muted-foreground">
              Please log in again to access your dashboard.
            </p>
          </CardContent>
        </Card>
      );
    }

    // const dashboard = dashboardMap[user.role_type as UserRole];
    const normalizedRole = user?.role_type?.toLowerCase() as UserRole;
    const dashboard = dashboardMap[normalizedRole];


    if (!dashboard) {
      return (
        <Card className="max-w-md mx-auto mt-10">
          <CardContent className="text-center space-y-2 py-6">
            <CardTitle>Invalid role</CardTitle>
            <p className="text-sm text-muted-foreground">
              The current user role <strong>{user.role_type}</strong> is not
              recognized.
            </p>
          </CardContent>
        </Card>
      );
    }

    return dashboard;
  }, [isLoading, user, dashboardMap]);

  return <BaseLayout>{content}</BaseLayout>;
};

export default Dashboard;
