import { useState, useEffect } from "react";
import { fine } from "@/lib/fine";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data: session } = fine.auth.useSession();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendanceByLevel: [],
    teacherCompliance: [],
    recentAttendance: []
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      if (session?.user) {
        try {
          const users = await fine.table("users")
            .select("role")
            .eq("email", session.user.email);
          
          if (users && users.length > 0) {
            setUserRole(users[0].role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("teacher");
        }
      }
    };

    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch actual data from the database
        // For now, we'll use mock data
        
        // Mock attendance by level data
        const mockAttendanceByLevel = [
          { name: "Level 1", present: 85, absent: 10, late: 5 },
          { name: "Level 2", present: 78, absent: 15, late: 7 },
          { name: "Level 3", present: 90, absent: 7, late: 3 },
          { name: "Level 4", present: 82, absent: 12, late: 6 }
        ];
        
        // Mock teacher compliance data
        const mockTeacherCompliance = [
          { name: "Teacher A", compliance: 95 },
          { name: "Teacher B", compliance: 88 },
          { name: "Teacher C", compliance: 100 },
          { name: "Teacher D", compliance: 92 },
          { name: "Teacher E", compliance: 85 }
        ];
        
        // Mock recent attendance data
        const mockRecentAttendance = [
          { date: "Mon", present: 90, absent: 8, late: 2 },
          { date: "Tue", present: 85, absent: 10, late: 5 },
          { date: "Wed", present: 88, absent: 7, late: 5 },
          { date: "Thu", present: 92, absent: 5, late: 3 },
          { date: "Fri", present: 80, absent: 15, late: 5 }
        ];
        
        setStats({
          attendanceByLevel: mockAttendanceByLevel,
          teacherCompliance: mockTeacherCompliance,
          recentAttendance: mockRecentAttendance
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchDashboardData();
  }, [session]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name}! Here's an overview of the attendance system.
        </p>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            {userRole === "admin" && (
              <TabsTrigger value="compliance">Teacher Compliance</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Total Students</CardTitle>
                  <CardDescription>Across all levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">450</div>
                  <p className="text-xs text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Today's Attendance</CardTitle>
                  <CardDescription>Overall percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">92%</div>
                  <p className="text-xs text-muted-foreground">+1.2% from yesterday</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Uniform Compliance</CardTitle>
                  <CardDescription>Overall percentage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">88%</div>
                  <p className="text-xs text-muted-foreground">-0.5% from last week</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Attendance Trend</CardTitle>
                <CardDescription>Last 5 school days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.recentAttendance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="#4ade80" />
                      <Bar dataKey="absent" name="Absent" fill="#f87171" />
                      <Bar dataKey="late" name="Late" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance by Level</CardTitle>
                <CardDescription>Current month overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.attendanceByLevel}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" name="Present" fill="#4ade80" />
                      <Bar dataKey="absent" name="Absent" fill="#f87171" />
                      <Bar dataKey="late" name="Late" fill="#facc15" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {userRole === "admin" && (
            <TabsContent value="compliance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Teacher Compliance</CardTitle>
                  <CardDescription>Attendance recording compliance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.teacherCompliance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="compliance" name="Compliance %" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;