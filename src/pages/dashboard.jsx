import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { Loader2, Users, ClipboardCheck, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "../../supabaseClient";

const Dashboard = () => {
  const { user: session } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    attendanceByLevel: [],
    teacherCompliance: [],
    recentAttendance: [],
    uniformCompliance: [],
    attendanceByDay: [],
    totalStudents: 0,
    todayAttendance: 0,
    uniformOverall: 0,
    averageDailyAttendance: 0,
    chronicAbsences: 0,
    perfectAttendance: 0,
    averageCompliance: 0,
    teachersBelow: 0,
  });

useEffect(() => {
  const fetchUserRole = async () => {
    if (!session?.email) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('email', session.email)
        .maybeSingle();
      if (error || !data) throw new Error('Usuario no encontrado');

      setUserRole(data.role);
    } catch (err) {
      console.error("Error cargando rol:", err);
      setUserRole("teacher");
    }
  };

    const fetchDashboardData = async () => {
      try {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('studentid, date, status');
        const { data: uniformData } = await supabase
          .from('uniformcompliance')
          .select('studentid, date, shoes, shirt, pants, sweater, haircut');
        const { data: students } = await supabase
          .from('students')
          .select('id, gradeid');
        const { data: grades } = await supabase
          .from('grades')
          .select('id, levelid, teacherid');
        const { data: levels } = await supabase
          .from('levels')
          .select('id, name');
        const { data: teachers } = await supabase
          .from('users')
          .select('id, name')
          .eq('role', 'teacher');

        const studentMap = Object.fromEntries(students.map(s => [s.id, s]));
        const gradeMap = Object.fromEntries(grades.map(g => [g.id, g]));
        const levelMap = Object.fromEntries(levels.map(l => [l.id, l.name]));

        const attendanceByLevel = {};
        attendanceData.forEach(a => {
          const student = studentMap[a.studentid];
          if (!student) return;
          const grade = gradeMap[student.gradeid];
          if (!grade) return;
          const levelName = levelMap[grade.levelid] || 'Unknown';
          if (!attendanceByLevel[levelName]) {
            attendanceByLevel[levelName] = { name: levelName, present: 0, absent: 0, late: 0 };
          }
          attendanceByLevel[levelName][a.status]++;
        });

        const teacherDays = {};
        const allDays = new Set();
        attendanceData.forEach(a => {
          const student = studentMap[a.studentid];
          if (!student) return;
          const grade = gradeMap[student.gradeid];
          if (!grade) return;
          if (!teacherDays[grade.teacherid]) teacherDays[grade.teacherid] = new Set();
          teacherDays[grade.teacherid].add(a.date);
          allDays.add(a.date);
        });
        const teacherCompliance = teachers.map(t => ({
          name: t.name,
          compliance: allDays.size
            ? Math.round(((teacherDays[t.id]?.size || 0) / allDays.size) * 100)
            : 0,
        }));

        const recentDates = [...allDays].sort().slice(-5);
        const recentAttendance = recentDates.map(d => {
          const dayRecords = attendanceData.filter(a => a.date === d);
          const counts = { present: 0, absent: 0, late: 0 };
          dayRecords.forEach(r => { counts[r.status]++; });
          return { date: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }), ...counts };
        });

        const uniformCompliance = [
          'shoes',
          'shirt',
          'pants',
          'sweater',
          'haircut',
        ].map(item => {
          let compliant = 0;
          let nonCompliant = 0;
          uniformData.forEach(u => {
            if (u[item]) compliant++; else nonCompliant++;
          });
          return { name: item.charAt(0).toUpperCase() + item.slice(1), compliant, nonCompliant };
        });

        const attendanceByDayMap = {};
        const distribution = { present: 0, absent: 0, late: 0 };
        attendanceData.forEach(a => {
          const day = new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' });
          if (!attendanceByDayMap[day]) attendanceByDayMap[day] = { name: day, present: 0, total: 0 };
          if (a.status === 'present') attendanceByDayMap[day].present++;
          attendanceByDayMap[day].total++;
          distribution[a.status]++;
        });
        const attendanceByDay = Object.values(attendanceByDayMap).map(d => ({
          name: d.name,
          attendance: d.total ? Math.round((d.present / d.total) * 100) : 0,
        }));

        const totalStudents = students.length;
        const todayStr = new Date().toISOString().split('T')[0];
        const todayRecords = attendanceData.filter(a => a.date === todayStr);
        const todayPresent = todayRecords.filter(r => r.status === 'present').length;
        const todayAttendance = todayRecords.length ? Math.round((todayPresent / todayRecords.length) * 100) : 0;

        const totalUniformItems = uniformData.length * 5;
        const compliantCount = uniformData.reduce(
          (acc, u) => acc + [u.shoes, u.shirt, u.pants, u.sweater, u.haircut].filter(Boolean).length,
          0
        );
        const uniformOverall = totalUniformItems ? Math.round((compliantCount / totalUniformItems) * 100) : 0;

        const totalAttendanceRecords = distribution.present + distribution.absent + distribution.late;
        const averageDailyAttendance = totalAttendanceRecords ? Math.round((distribution.present / totalAttendanceRecords) * 100) : 0;
        const chronicAbsences = totalAttendanceRecords ? Math.round((distribution.absent / totalAttendanceRecords) * 100) : 0;
        const perfectAttendance = 100 - chronicAbsences;

        const averageCompliance = teacherCompliance.length
          ? Math.round(
              teacherCompliance.reduce((acc, t) => acc + t.compliance, 0) /
                teacherCompliance.length
            )
          : 0;
        const teachersBelow = teacherCompliance.filter((t) => t.compliance < 90).length;

        setStats({
          attendanceByLevel: Object.values(attendanceByLevel),
          teacherCompliance,
          recentAttendance,
          uniformCompliance,
          attendanceByDay,
          totalStudents,
          todayAttendance,
          uniformOverall,
          averageDailyAttendance,
          chronicAbsences,
          perfectAttendance,
          averageCompliance,
          teachersBelow,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
                      <div className="text-4xl font-bold">{stats.totalStudents}</div>
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
                      <div className="text-4xl font-bold">{stats.todayAttendance}%</div>
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
                      <div className="text-4xl font-bold">{stats.uniformOverall}%</div>
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
                                { name: 'Present', value: stats.averageDailyAttendance },
                                { name: 'Absent', value: stats.chronicAbsences },
                                { name: 'Late', value: 100 - stats.averageDailyAttendance - stats.chronicAbsences }
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
                            <span className="text-sm font-bold">{stats.averageDailyAttendance}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${stats.averageDailyAttendance}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Chronic Absences</h4>
                            <span className="text-sm font-bold">{stats.chronicAbsences}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-destructive rounded-full" style={{ width: `${stats.chronicAbsences}%` }}></div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">Perfect Attendance</h4>
                            <span className="text-sm font-bold">{stats.perfectAttendance}%</span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.perfectAttendance}%` }}></div>
                          </div>
                        </div>

                        <div className="pt-4">
                          <h4 className="text-sm font-medium mb-2">Attendance Trends</h4>
                          <div className="grid grid-cols-5 gap-1">
                            {stats.recentAttendance.map((d, i) => {
                              const percent = d.present + d.absent + d.late
                                ? Math.round((d.present / (d.present + d.absent + d.late)) * 100)
                                : 0;
                              return (
                                <div key={i} className="space-y-1">
                                  <div className="h-20 bg-muted rounded-md overflow-hidden">
                                    <div
                                      className="h-full bg-blue-500 rounded-md"
                                      style={{ height: `${percent}%` }}
                                    ></div>
                                  </div>
                                  <div className="text-xs text-center text-muted-foreground">
                                    {d.date}
                                  </div>
                                </div>
                              );
                            })}
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
                    { title: "Average Compliance", value: `${stats.averageCompliance}%`, description: "Across all teachers", color: "bg-blue-500" },
                    { title: "Compliance Trend", value: "+2.5%", description: "Compared to last month", color: "bg-green-500" },
                    { title: "Teachers Below Target", value: stats.teachersBelow.toString(), description: "Below 90% compliance", color: "bg-yellow-500" }
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