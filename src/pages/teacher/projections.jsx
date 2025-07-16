import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const TeacherProjections = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("grades");
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [data, setData] = useState({
    grades: [],
    students: [],
    gradeAttendance: [],
    studentAttendance: [],
  });
  const { toast } = useToast();
  
  const COLORS = ['#4ade80', '#f87171', '#facc15', '#60a5fa', '#c084fc'];

  useEffect(() => {
    const fetchData = async () => {
      try {

        
        const { data: gradesData, error: gradeErr } = await supabase.from("grades").select("id, name");
        if (gradeErr) throw gradeErr;
        const { data: studentsData, error: studentErr } = await supabase.from("students").select("id, name, gradeid");
        if (studentErr) throw studentErr;
        const { data: attendanceData, error: attendanceErr } = await supabase.from("attendance").select("studentid, date, status");
        if (attendanceErr) throw attendanceErr;
        const { data: uniformData } = await supabase.from("uniformCompliance").select("studentid, compliant");
        const { data: reportsData } = await supabase.from("reports").select("studentid");

        const gradeAttendance = gradesData.map(g => {
          const weekMap = {};
          attendanceData.forEach(a => {
            const s = studentsData.find(st => st.id === a.studentid);
            if (s && s.gradeid === g.id) {
              const week = `Week ${Math.ceil(new Date(a.date).getDate() / 7)}`;
              if (!weekMap[week]) weekMap[week] = { present: 0, absent: 0, late: 0 };
              weekMap[week][a.status]++;
            }
          });
          return { grade: g.name, data: Object.entries(weekMap).map(([week, val]) => ({ week, ...val })) };
        });

        const studentAttendance = studentsData.map(s => {
          const records = attendanceData.filter(a => a.studentid === s.id);
          const data = records.map(r => ({ day: new Date(r.date).toLocaleDateString("en-US", { weekday: "short" }), status: r.status }));
          const uniformIssues = uniformData ? uniformData.filter(u => u.studentid === s.id && !u.compliant).length : 0;
          const emailsSent = reportsData ? reportsData.filter(r => r.studentid === s.id).length : 0;
          return { student: s.name, gradeid: s.gradeid, data, uniformIssues, emailsSent };
        });

        setData({
          grades: gradesData,
          students: studentsData,
          gradeAttendance,
          studentAttendance,
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

  const getGradeData = () => {
    if (selectedGrade === "all") {
      // Aggregate data for all grades
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      return weeks.map(week => {
        const weekData = { week };
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;
        let count = 0;
        
        data.gradeAttendance.forEach(grade => {
          const weekEntry = grade.data.find(entry => entry.week === week);
          if (weekEntry) {
            totalPresent += weekEntry.present;
            totalAbsent += weekEntry.absent;
            totalLate += weekEntry.late;
            count++;
          }
        });
        
        if (count > 0) {
          weekData.present = Math.round(totalPresent / count);
          weekData.absent = Math.round(totalAbsent / count);
          weekData.late = Math.round(totalLate / count);
        }
        
        return weekData;
      });
    } else {
      const gradeData = data.gradeAttendance.find(grade => grade.grade === selectedGrade);
      return gradeData ? gradeData.data : [];
    }
  };

  const getStudentData = () => {
    if (selectedStudent === "all") {
      return [];
    } else {
      const studentData = data.studentAttendance.find(student => student.student === selectedStudent);
      
      if (!studentData) return [];
      
      // Process the data to get counts
      const statusCounts = {
        present: 0,
        absent: 0,
        late: 0,
      };
      
      studentData.data.forEach(day => {
        statusCounts[day.status]++;
      });
      
      return [
        { name: "Present", value: statusCounts.present },
        { name: "Absent", value: statusCounts.absent },
        { name: "Late", value: statusCounts.late },
      ];
    }
  };

  const getStudentReportData = () => {
    if (selectedStudent === "all") {
      return null;
    }
    
    return data.studentAttendance.find(student => student.student === selectedStudent);
  };

  const getFilteredStudents = () => {
    if (selectedGrade === "all") {
      return data.studentAttendance;
    } else {
      const gradeid = data.grades.find(grade => grade.name === selectedGrade)?.id;
      return data.studentAttendance.filter(student => student.gradeid === gradeid);
    }
  };

  const getAverageAttendance = () => {
    const gradeData = getGradeData();
    if (gradeData.length === 0) return [];
    
    // Calculate average for each status
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    
    gradeData.forEach(entry => {
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Projections</h1>
          <p className="text-muted-foreground">
            View attendance projections for grades and students
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="grades">Grade Attendance</TabsTrigger>
            <TabsTrigger value="students">Student Attendance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grades" className="space-y-6 mt-6">
            <div className="flex justify-end">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {data.grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.name}>
                      {grade.name}
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
                    Weekly attendance breakdown for {selectedGrade === "all" ? "all grades" : selectedGrade}
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
                        <BarChart data={getGradeData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
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
                    Distribution for {selectedGrade === "all" ? "all grades" : selectedGrade}
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
          
          <TabsContent value="students" className="space-y-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
              <Select value={selectedGrade} onValueChange={(value) => {
                setSelectedGrade(value);
                setSelectedStudent("all");
              }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {data.grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.name}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Select a Student</SelectItem>
                  {getFilteredStudents().map(student => (
                    <SelectItem key={student.student} value={student.student}>
                      {student.student}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedStudent === "all" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Student Selection</CardTitle>
                  <CardDescription>
                    Please select a student to view their attendance data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">
                      Select a grade and student from the dropdown menus above
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                    <CardDescription>
                      For {selectedStudent}
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
                              data={getStudentData()}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, value }) => `${name}: ${value}`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {getStudentData().map((entry, index) => (
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Report Summary</CardTitle>
                    <CardDescription>
                      Communication and uniform compliance for {selectedStudent}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex h-80 items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-medium">Uniform Compliance</h3>
                          <div className="mt-2 flex items-center">
                            <div className="h-2 flex-1 rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${Math.max(0, 100 - (getStudentReportData()?.uniformIssues || 0) * 20)}%`,
                                }}
                              />
                            </div>
                            <span className="ml-2 text-sm font-medium">
                              {getStudentReportData()?.uniformIssues || 0} issues
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Communication</h3>
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Emails Sent</span>
                              <span className="font-medium">{getStudentReportData()?.emailsSent || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Last Communication</span>
                              <span className="font-medium">3 days ago</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-medium">Attendance Rate</h3>
                          <div className="mt-2">
                            <div className="text-3xl font-bold">
                              {Math.round((getStudentData().find(d => d.name === "Present")?.value || 0) / 
                                getStudentData().reduce((sum, d) => sum + d.value, 0) * 100)}%
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Overall attendance rate
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherProjections;