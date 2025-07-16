import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const AdminProjections = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("levels");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");
  const [data, setData] = useState({
    levels: [],
    teachers: [],
    levelAttendance: [],
    teacherCompliance: [],
  });
  const { toast } = useToast();
  
  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa', '#c084fc'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: levels } = await supabase.from('levels').select('id, name');
        const { data: teachers } = await supabase
          .from('users')
          .select('id, name')
          .eq('role', 'teacher');
        const { data: grades } = await supabase
          .from('grades')
          .select('id, levelid, teacherid');
        const { data: students } = await supabase
          .from('students')
          .select('id, gradeid');
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('studentid, date, status');

        const studentMap = Object.fromEntries(students.map(s => [s.id, s]));
        const gradeMap = Object.fromEntries(grades.map(g => [g.id, g]));

        const levelAttendanceMap = {};
        attendanceData.forEach(a => {
          const student = studentMap[a.studentid];
          if (!student) return;
          const grade = gradeMap[student.gradeid];
          if (!grade) return;
          const levelid = grade.levelid;
          const month = new Date(a.date).toLocaleString('en-US', { month: 'short' });
          const key = `${levelid}-${month}`;
          if (!levelAttendanceMap[key]) {
            levelAttendanceMap[key] = { level: levelid, month, present: 0, absent: 0, late: 0 };
          }
          levelAttendanceMap[key][a.status]++;
        });

        const levelAttendance = levels.map(l => ({
          level: l.name,
          data: Object.values(levelAttendanceMap)
            .filter(v => v.level === l.id)
            .map(v => ({ month: v.month, present: v.present, absent: v.absent, late: v.late })),
        }));

        const teacherDayMap = {};
        const allDays = new Set();
        attendanceData.forEach(a => {
          const student = studentMap[a.studentid];
          if (!student) return;
          const grade = gradeMap[student.gradeid];
          if (!grade) return;
          if (!teacherDayMap[grade.teacherid]) teacherDayMap[grade.teacherid] = {};
          const week = `Week ${Math.ceil(new Date(a.date).getDate() / 7)}`;
          if (!teacherDayMap[grade.teacherid][week]) teacherDayMap[grade.teacherid][week] = 0;
          teacherDayMap[grade.teacherid][week]++;
          allDays.add(week);
        });

        const teacherCompliance = teachers.map(t => ({
          teacher: t.name,
          data: Object.entries(teacherDayMap[t.id] || {}).map(([week, val]) => ({ week, compliance: val ? 100 : 0 })),
        }));

        setData({
          levels,
          teachers,
          levelAttendance,
          teacherCompliance,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load projection data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const getLevelData = () => {
    if (selectedLevel === "all") {
      // Aggregate data for all levels
      const months = ["Jan", "Feb", "Mar", "Apr", "May"];
      return months.map(month => {
        const monthData = { month };
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;
        let count = 0;
        
        data.levelAttendance.forEach(level => {
          const monthEntry = level.data.find(entry => entry.month === month);
          if (monthEntry) {
            totalPresent += monthEntry.present;
            totalAbsent += monthEntry.absent;
            totalLate += monthEntry.late;
            count++;
          }
        });
        
        if (count > 0) {
          monthData.present = Math.round(totalPresent / count);
          monthData.absent = Math.round(totalAbsent / count);
          monthData.late = Math.round(totalLate / count);
        }
        
        return monthData;
      });
    } else {
      const levelData = data.levelAttendance.find(level => level.level === selectedLevel);
      return levelData ? levelData.data : [];
    }
  };

  const getTeacherData = () => {
    if (selectedTeacher === "all") {
      // Aggregate data for all teachers
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      return weeks.map(week => {
        const weekData = { week };
        let totalCompliance = 0;
        let count = 0;
        
        data.teacherCompliance.forEach(teacher => {
          const weekEntry = teacher.data.find(entry => entry.week === week);
          if (weekEntry) {
            totalCompliance += weekEntry.compliance;
            count++;
          }
        });
        
        if (count > 0) {
          weekData.compliance = Math.round(totalCompliance / count);
        }
        
        return weekData;
      });
    } else {
      const teacherData = data.teacherCompliance.find(teacher => teacher.teacher === selectedTeacher);
      return teacherData ? teacherData.data : [];
    }
  };

  const getAverageAttendance = () => {
    const levelData = getLevelData();
    if (levelData.length === 0) return [];
    
    // Calculate average for each status
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    
    levelData.forEach(entry => {
      totalPresent += entry.present || 0;
      totalAbsent += entry.absent || 0;
      totalLate += entry.late || 0;
    });
    
    const total = totalPresent + totalAbsent + totalLate;
    
    return [
      { name: "Present", value: Math.round((totalPresent / total) * 100) },
      { name: "Absent", value: Math.round((totalAbsent / total) * 100) },
      { name: "Late", value: Math.round((totalLate / total) * 100) },
    ];
  };

  const getAverageCompliance = () => {
    const teacherData = getTeacherData();
    if (teacherData.length === 0) return 0;
    
    // Calculate average compliance
    let totalCompliance = 0;
    
    teacherData.forEach(entry => {
      totalCompliance += entry.compliance || 0;
    });
    
    return Math.round(totalCompliance / teacherData.length);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Projections</h1>
          <p className="text-muted-foreground">
            View attendance and compliance projections
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="levels">Level Attendance</TabsTrigger>
            <TabsTrigger value="teachers">Teacher Compliance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="levels" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {data.levels.map(level => (
                    <SelectItem key={level.id} value={level.name}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                  <CardDescription>
                    Monthly attendance breakdown for {selectedLevel === "all" ? "all levels" : selectedLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-80 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getLevelData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="present" name="Present" fill="#4ade80" />
                          <Bar dataKey="absent" name="Absent" fill="#f87171" />
                          <Bar dataKey="late" name="Late" fill="#facc15" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Attendance</CardTitle>
                  <CardDescription>
                    Distribution for {selectedLevel === "all" ? "all levels" : selectedLevel}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-80 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getAverageAttendance()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getAverageAttendance().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="teachers" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {data.teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.name}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Compliance Trend</CardTitle>
                  <CardDescription>
                    Weekly compliance for {selectedTeacher === "all" ? "all teachers" : selectedTeacher}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-80 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={getTeacherData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="compliance"
                            name="Compliance %"
                            stroke="#60a5fa"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Compliance</CardTitle>
                  <CardDescription>
                    For {selectedTeacher === "all" ? "all teachers" : selectedTeacher}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-80 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="h-80 flex flex-col items-center justify-center">
                      <div className="relative h-40 w-40">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-4xl font-bold">{getAverageCompliance()}%</span>
                        </div>
                        <svg className="h-full w-full" viewBox="0 0 100 100">
                          <circle
                            className="text-muted stroke-current"
                            strokeWidth="10"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                          />
                          <circle
                            className="text-primary stroke-current"
                            strokeWidth="10"
                            strokeLinecap="round"
                            cx="50"
                            cy="50"
                            r="40"
                            fill="transparent"
                            strokeDasharray={`${getAverageCompliance() * 2.51} 251`}
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                      </div>
                      <p className="mt-4 text-center text-muted-foreground">
                        Average compliance rate over the past month
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminProjections;