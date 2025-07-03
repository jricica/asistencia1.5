import { DashboardLayout } from "@/components/layout/Dashboard";
import { useUser } from "@/context/UserContext";

const StudentDashboard = () => {
  const { user } = useUser();
  return (
    <DashboardLayout>
      <div className="p-6 space-y-2">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
