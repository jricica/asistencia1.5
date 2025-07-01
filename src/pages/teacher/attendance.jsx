import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fine } from "@/lib/fine";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, Check, X, Mail, Clock, Save } from "lucide-react";

const TeacherAttendance = () => {
  const [searchParams] = useSearchParams();
  const gradeId = searchParams.get("gradeId");
  
  const [students, setStudents] = useState([]);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceRecorded, setAttendanceRecorded] = useState(false);
  const [activeTab, setActiveTab] = useState("attendance");
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [uniformItems] = useState([
    { id: "shoes", label: "Shoes" },
    { id: "shirt", label: "Shirt" },
    { id: "pants", label: "Pants" },
    { id: "sweater", label: "Sweater" },
    { id: "haircut", label: "Haircut" },
  ]);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!gradeId) return;
      
      try {
        // In a real app, you would fetch data from the database
        // For now, we'll use mock data
        
        // Mock grade
        const mockGrade = { id: parseInt(gradeId), name: `Grade ${gradeId}` };
        
        // Mock students for this grade with attendance status
        const mockStudents = [
          { 
            id: 1, 
            name: "Alice Johnson", 
            email: "alice@example.com", 
            status: "present",
            uniform: { shoes: true, shirt: true, pants: true, sweater: true, haircut: true }
          },
          { 
            id: 2, 
            name: "Bob Smith", 
            email: "bob@example.com", 
            status: "present",
            uniform: { shoes: true, shirt: true, pants: true, sweater: false, haircut: true }
          },
          { 
            id: 3, 
            name: "Charlie Brown", 
            email: "charlie@example.com", 
            status: "absent",
            uniform: { shoes: true, shirt: true, pants: true, sweater: true, haircut: true }
          },
          { 
            id: 4, 
            name: "Diana Prince", 
            email: "diana@example.com", 
            status: "late",
            uniform: { shoes: false, shirt: true, pants: true, sweater: true, haircut: true }
          },
          { 
            id: 5, 
            name: "Edward Cullen", 
            email: "edward@example.com", 
            status: "present",
            uniform: { shoes: true, shirt: false, pants: true, sweater: true, haircut: false }
          },
        ];
        
        setGrade(mockGrade);
        setStudents(mockStudents);
        
        // Check if attendance has been recorded for today
        setAttendanceRecorded(true); // For demo purposes, assume it's already recorded
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load student data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gradeId, toast]);

  const handleStatusChange = (studentId, status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, status } : student
      )
    );
  };

  const handleUniformChange = (studentId, item, checked) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId
          ? {
              ...student,
              uniform: {
                ...student.uniform,
                [item]: checked,
              },
            }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "present" }))
    );
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "absent" }))
    );
  };

  const saveAttendance = async () => {
    setSaving(true);
    
    try {
      // In a real app, you would save the attendance data to the database
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setAttendanceRecorded(true);
      
      toast({
        title: "Success",
        description: "Attendance saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save attendance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const openEmailDialog = (student) => {
    setSelectedStudent(student);
    setEmailDialogOpen(true);
  };

  const sendEmail = async (type) => {
    try {
      // In a real app, you would send an email
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailDialogOpen(false);
      
      toast({
        title: "Email Sent",
        description: `Email sent to ${selectedStudent.name} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getUniformIssues = (student) => {
    return Object.entries(student.uniform)
      .filter(([_, compliant]) => !compliant)
      .map(([item]) => uniformItems.find(ui => ui.id === item)?.label || item)
      .join(", ");
  };

  if (!gradeId) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">
              Please select a grade to take attendance
            </p>
          </div>
          
          <Link to="/teacher/grades">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Grades
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {grade ? `${grade.name} Attendance` : "Attendance"}
            </h1>
            <p className="text-muted-foreground">
              Record attendance and uniform compliance
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Link to="/teacher/grades">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Grades
              </Button>
            </Link>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Daily Attendance</CardTitle>
                <CardDescription>
                  {attendanceRecorded
                    ? "Attendance has been recorded for today"
                    : "Record attendance for today"}
                </CardDescription>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="uniform">Uniform Compliance</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="attendance">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <div className="mb-4 flex flex-wrap gap-2">
                      <Button onClick={markAllPresent} variant="outline" size="sm">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Mark All Present
                      </Button>
                      <Button onClick={markAllAbsent} variant="outline" size="sm">
                        <X className="mr-2 h-4 w-4 text-red-500" />
                        Mark All Absent
                      </Button>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              <Select
                                value={student.status}
                                onValueChange={(value) => handleStatusChange(student.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="present">Present</SelectItem>
                                  <SelectItem value="absent">Absent</SelectItem>
                                  <SelectItem value="late">Late</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEmailDialog(student)}
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Send Email</span>
                              </Button>
                              {student.status === "late" && (
                                <Button variant="ghost" size="icon">
                                  <Clock className="h-4 w-4" />
                                  <span className="sr-only">Update Time</span>
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                )}
              </CardContent>
            </TabsContent>
            
            <TabsContent value="uniform">
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        {uniformItems.map((item) => (
                          <TableHead key={item.id}>{item.label}</TableHead>
                        ))}
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          {uniformItems.map((item) => (
                            <TableCell key={item.id}>
                              <Checkbox
                                checked={student.uniform[item.id]}
                                onCheckedChange={(checked) =>
                                  handleUniformChange(student.id, item.id, checked)
                                }
                              />
                            </TableCell>
                          ))}
                          <TableCell className="text-right">
                            {Object.values(student.uniform).some((v) => !v) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEmailDialog(student)}
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Send Email</span>
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="border-t bg-muted/50 px-6 py-4">
            <Button onClick={saveAttendance} disabled={saving || attendanceRecorded}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {attendanceRecorded ? "Attendance Recorded" : "Save Attendance"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Email</DialogTitle>
            <DialogDescription>
              Send an email to {selectedStudent?.name}
              {activeTab === "uniform" &&
                Object.values(selectedStudent?.uniform || {}).some((v) => !v) && (
                  <>
                    <br />
                    <span className="text-destructive">
                      Uniform issues: {selectedStudent && getUniformIssues(selectedStudent)}
                    </span>
                  </>
                )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="font-medium">Email Options</h3>
              
              {activeTab === "uniform" && (
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => sendEmail("uniform")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send Uniform Compliance Report
                </Button>
              )}
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => sendEmail("attendance")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Attendance Report
              </Button>
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => sendEmail("custom")}
              >
                <Mail className="mr-2 h-4 w-4" />
                Send Custom Message
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeacherAttendance;