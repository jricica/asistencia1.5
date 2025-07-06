import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Loader2, Users, ClipboardCheck, AlertTriangle, TrendingUp, Calendar } from "lucide-react";

const Dashboard = () => {
  const { user: session } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendanceByLevel: [],
    teacherCompliance: [],
    recentAttendance: [],
    uniformCompliance: [],
    attendanceByDay: []
  });

useEffect(() => {
  const fetchUserRole = async () => {
    if (!session?.email) return;

    try {
      const res = await fetch(
        `http://localhost:3000/api/user/${session.email}`,
        {
          headers: { Authorization: String(session.id) }
        }
      );
      if (!res.ok) throw new Error("Usuario no encontrado");

      const user = await res.json();
      setUserRole(user.role);
    } catch (err) {
      console.error("Error cargando rol:", err);
      setUserRole("teacher");
    }
  };

    const fetchDashboardData = async () => {
      try {
        if (session?.id) {
          await fetch('http://localhost:3000/api/users', {
            headers: { Authorization: String(session.id) }
          });
        }

        
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

        // Mock uniform compliance data
        const mockUniformCompliance = [
          { name: "Shoes", compliant: 92, nonCompliant: 8 },
          { name: "Shirt", compliant: 95, nonCompliant: 5 },
          { name: "Pants", compliant: 90, nonCompliant: 10 },
          { name: "Sweater", compliant: 85, nonCompliant: 15 },
          { name: "Haircut", compliant: 88, nonCompliant: 12 }
        ];

        // Mock attendance by day of week
        const mockAttendanceByDay = [
          { name: "Monday", attendance: 92 },
          { name: "Tuesday", attendance: 88 },
          { name: "Wednesday", attendance: 90 },
          { name: "Thursday", attendance: 94 },
          { name: "Friday", attendance: 86 }
        ];
        
        setStats({
          attendanceByLevel: mockAttendanceByLevel,
          teacherCompliance: mockTeacherCompliance,
          recentAttendance: mockRecentAttendance,
          uniformCompliance: mockUniformCompliance,
          attendanceByDay: mockAttendanceByDay
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
    fetchDashboardData();
  }, [session?.email]);

  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa', '#c084fc'];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <h3 className="text-lg font-medium">Loading dashboard...</h3>
            <p className="text-muted-foreground">Please wait while we fetch your data</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{session?.name}</span>! Here's an overview of the attendance system.
          </p>
        </motion.div>

        <motion.div variants={item}>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              {userRole === "admin" && (
                <TabsTrigger value="compliance">Teacher Compliance</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <motion.div variants={item} className="card-hover">
                  <Card className="dashboard-card overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle>Total Students</CardTitle>
                        <Users className="h-5 w-5 text-blue-500" />
                      </div>
                      <CardDescription>Across all levels</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">450</div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-xs text-green-500 font-medium">+2.5% from last month</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item} className="card-hover">
                  <Card className="dashboard-card overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle>Today's Attendance</CardTitle>
                        <ClipboardCheck className="h-5 w-5 text-green-500" />
                      </div>
                      <CardDescription>Overall percentage</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">92%</div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <p className="text-xs text-green-500 font-medium">+1.2% from yesterday</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item} className="card-hover">
                  <Card className="dashboard-card overflow-hidden">
                    <CardHeader className="pb-2 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/20">
                      <div className="flex items-center justify-between">
                        <CardTitle>Uniform Compliance</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      </div>
                      <CardDescription>Overall percentage</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="text-4xl font-bold">88%</div>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-red-500 mr-1 rotate-180" />
                        <p className="text-xs text-red-500 font-medium">-0.5% from last week</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
              
              <motion.div variants={item}>
                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Recent Attendance Trend</CardTitle>
                        <CardDescription>Last 5 school days</CardDescription>
                      </div>
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.recentAttendance}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: '1px solid rgba(226, 232, 240, 1)'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="present" name="Present" fill="#4ade80" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="absent" name="Absent" fill="#f87171" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="late" name="Late" fill="#facc15" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={item}>
                  <Card className="dashboard-card h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Attendance by Day</CardTitle>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>Weekly pattern analysis</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stats.attendanceByDay}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[80, 100]} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(226, 232, 240, 1)'
                              }} 
                            />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="attendance" 
                              name="Attendance %" 
                              stroke="#60a5fa" 
                              strokeWidth={3}
                              dot={{ r: 6, strokeWidth: 2 }}
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="dashboard-card h-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Uniform Compliance</CardTitle>
                        <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <CardDescription>Issues by uniform item</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={stats.uniformCompliance}
                            layout="vertical"
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={80} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(226, 232, 240, 1)'
                              }} 
                            />
                            <Legend />
                            <Bar dataKey="compliant" name="Compliant" fill="#4ade80" radius={[0, 4, 4, 0]} stackId="a" />
                            <Bar dataKey="nonCompliant" name="Non-Compliant" fill="#f87171" radius={[0, 4, 4, 0]} stackId="a" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="attendance" className="space-y-6 mt-6">
              <motion.div variants={item}>
                <Card className="dashboard-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Attendance by Level</CardTitle>
                        <CardDescription>Current month overview</CardDescription>
                      </div>
                      <Users className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.attendanceByLevel}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                              border: '1px solid rgba(226, 232, 240, 1)'
                            }} 
                          />
                          <Legend />
                          <Bar dataKey="present" name="Present" fill="#4ade80" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="absent" name="Absent" fill="#f87171" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="late" name="Late" fill="#facc15" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid gap-6 md:grid-cols-2">
                <motion.div variants={item}>
                  <Card className="dashboard-card h-full">
                    <CardHeader>
                      <CardTitle>Attendance Distribution</CardTitle>
                      <CardDescription>Overall percentages</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Present", value: 85 },
                                { name: "Absent", value: 10 },
                                { name: "Late", value: 5 }
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {[0, 1, 2].map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(226, 232, 240, 1)'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={item}>
                  <Card className="dashboard-card h-full">
                    <CardHeader>
                      <CardTitle>Attendance Insights</CardTitle>
                      <CardDescription>Key metrics and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Average Daily Attendance</h4>
                            <span className="text-sm font-bold">87%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "87%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Chronic Absences</h4>
                            <span className="text-sm font-bold">8%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-destructive rounded-full" style={{ width: "8%" }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Perfect Attendance</h4>
                            <span className="text-sm font-bold">32%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "32%" }}></div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Attendance Trends</h4>
                          <div className="grid grid-cols-5 gap-1">
                            {[92, 88, 90, 94, 86].map((value, i) => (
                              <div key={i} className="space-y-1">
                                <div className="h-20 bg-muted rounded-md overflow-hidden">
                                  <div 
                                    className="h-full bg-blue-500 rounded-md" 
                                    style={{ height: `${value}%` }}
                                  ></div>
                                </div>
                                <div className="text-xs text-center text-muted-foreground">
                                  {["M", "T", "W", "T", "F"][i]}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            {userRole === "admin" && (
              <TabsContent value="compliance" className="space-y-6 mt-6">
                <motion.div variants={item}>
                  <Card className="dashboard-card">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Teacher Compliance</CardTitle>
                          <CardDescription>Attendance recording compliance</CardDescription>
                        </div>
                        <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={stats.teacherCompliance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                border: '1px solid rgba(226, 232, 240, 1)'
                              }} 
                            />
                            <Legend />
                            <Bar 
                              dataKey="compliance" 
                              name="Compliance %" 
                              fill="#60a5fa" 
                              radius={[4, 4, 0, 0]}
                              background={{ fill: 'rgba(96, 165, 250, 0.1)' }}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    { title: "Average Compliance", value: "92%", description: "Across all teachers", color: "bg-blue-500" },
                    { title: "Compliance Trend", value: "+2.5%", description: "Compared to last month", color: "bg-green-500" },
                    { title: "Teachers Below Target", value: "2", description: "Below 90% compliance", color: "bg-yellow-500" }
                  ].map((stat, i) => (
                    <motion.div key={i} variants={item} className="card-hover">
                      <Card className="dashboard-card overflow-hidden">
                        <div className={`h-1 ${stat.color}`}></div>
                        <CardHeader className="pb-2">
                          <CardTitle>{stat.title}</CardTitle>
                          <CardDescription>{stat.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-4xl font-bold">{stat.value}</div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;