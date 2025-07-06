import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

        
        // Mock grades
        const mockGrades = [
          { id: 1, name: "Grade 1" },
          { id: 2, name: "Grade 2" },
          { id: 3, name: "Grade 3" },
          { id: 4, name: "Grade 4" },
          { id: 5, name: "Grade 5" },
        ];
        
        // Mock students
        const mockStudents = [
          { id: 1, name: "Alice Johnson", gradeId: 1 },
          { id: 2, name: "Bob Smith", gradeId: 1 },
          { id: 3, name: "Charlie Brown", gradeId: 2 },
          { id: 4, name: "Diana Prince", gradeId: 2 },
          { id: 5, name: "Edward Cullen", gradeId: 3 },
        ];
        
        // Mock grade attendance data
        const mockGradeAttendance = [
          { 
            grade: "Grade 1", 
            data: [
              { week: "Week 1", present: 92, absent: 5, late: 3 },
              { week: "Week 2", present: 90, absent: 7, late: 3 },
              { week: "Week 3", present: 88, absent: 8, late: 4 },
              { week: "Week 4", present: 91, absent: 6, late: 3 },
            ]
          },
          { 
            grade: "Grade 2", 
            data: [
              { week: "Week 1", present: 88, absent: 8, late: 4 },
              { week: "Week 2", present: 85, absent: 10, late: 5 },
              { week: "Week 3", present: 82, absent: 12, late: 6 },
              { week: "Week 4", present: 86, absent: 9, late: 5 },
            ]
          },
          { 
            grade: "Grade 3", 
            data: [
              { week: "Week 1", present: 85, absent: 10, late: 5 },
              { week: "Week 2", present: 82, absent: 12, late: 6 },
              { week: "Week 3", present: 80, absent: 15, late: 5 },
              { week: "Week 4", present: 83, absent: 12, late: 5 },
            ]
          },
          { 
            grade: "Grade 4", 
            data: [
              { week: "Week 1", present: 90, absent: 7, late: 3 },
              { week: "Week 2", present: 91, absent: 6, late: 3 },
              { week: "Week 3", present: 89, absent: 8, late: 3 },
              { week: "Week 4", present: 92, absent: 5, late: 3 },
            ]
          },
          { 
            grade: "Grade 5", 
            data: [
              { week: "Week 1", present: 93, absent: 5, late: 2 },
              { week: "Week 2", present: 94, absent: 4, late: 2 },
              { week: "Week 3", present: 92, absent: 6, late: 2 },
              { week: "Week 4", present: 95, absent: 3, late: 2 },
            ]
          },
        ];
        
        // Mock student attendance data
        const mockStudentAttendance = [
          { 
            student: "Alice Johnson", 
            gradeId: 1,
            data: [
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "absent" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
              { day: "Mon", status: "present" },
              { day: "Tue", status: "late" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
            ],
            uniformIssues: 1,
            emailsSent: 2
          },
          { 
            student: "Bob Smith", 
            gradeId: 1,
            data: [
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "absent" },
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "late" },
              { day: "Fri", status: "present" },
            ],
            uniformIssues: 3,
            emailsSent: 4
          },
          { 
            student: "Charlie Brown", 
            gradeId: 2,
            data: [
              { day: "Mon", status: "absent" },
              { day: "Tue", status: "absent" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
            ],
            uniformIssues: 0,
            emailsSent: 2
          },
          { 
            student: "Diana Prince", 
            gradeId: 2,
            data: [
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "late" },
              { day: "Fri", status: "late" },
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
            ],
            uniformIssues: 2,
            emailsSent: 3
          },
          { 
            student: "Edward Cullen", 
            gradeId: 3,
            data: [
              { day: "Mon", status: "present" },
              { day: "Tue", status: "present" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
              { day: "Mon", status: "absent" },
              { day: "Tue", status: "absent" },
              { day: "Wed", status: "present" },
              { day: "Thu", status: "present" },
              { day: "Fri", status: "present" },
            ],
            uniformIssues: 1,
            emailsSent: 1
          },
        ];
        
        setData({
          grades: mockGrades,
          students: mockStudents,
          gradeAttendance: mockGradeAttendance,
          studentAttendance: mockStudentAttendance,
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
      const gradeId = data.grades.find(grade => grade.name === selectedGrade)?.id;
      return data.studentAttendance.filter(student => student.gradeId === gradeId);
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