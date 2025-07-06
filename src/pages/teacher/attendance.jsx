import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { 
  Loader2, ArrowLeft, Check, X, Mail, Clock, Save, 
  AlertTriangle, CheckCircle2, XCircle, AlertCircle, 
  Calendar, Search, Filter, RefreshCw
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
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
          { 
            id: 6, 
            name: "Fiona Gallagher", 
            email: "fiona@example.com", 
            status: "present",
            uniform: { shoes: true, shirt: true, pants: true, sweater: true, haircut: true }
          },
          { 
            id: 7, 
            name: "George Washington", 
            email: "george@example.com", 
            status: "absent",
            uniform: { shoes: true, shirt: true, pants: false, sweater: true, haircut: true }
          },
          { 
            id: 8, 
            name: "Hannah Montana", 
            email: "hannah@example.com", 
            status: "late",
            uniform: { shoes: true, shirt: true, pants: true, sweater: false, haircut: true }
          },
        ];
        
        setGrade(mockGrade);
        setStudents(mockStudents);
        
        // Check if attendance has been recorded for today
        setAttendanceRecorded(false); 
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
    
    toast({
      title: "Success",
      description: "All students marked as present",
    });
  };

  const markAllAbsent = () => {
    setStudents((prev) =>
      prev.map((student) => ({ ...student, status: "absent" }))
    );
    
    toast({
      title: "Success",
      description: "All students marked as absent",
    });
  };

  const saveAttendance = async () => {
    setSaving(true);
    
    try {

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

  const getFilteredStudents = () => {
    if (!searchQuery) return students;
    
    return students.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "absent":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "late":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "present":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300">Present</Badge>;
      case "absent":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300">Absent</Badge>;
      case "late":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300">Late</Badge>;
      default:
        return null;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
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
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item} className="flex items-center justify-between">
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
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Daily Attendance
                  </CardTitle>
                  <CardDescription>
                    {attendanceRecorded
                      ? "Attendance has been recorded for today"
                      : "Record attendance for today"}
                  </CardDescription>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="px-6 pt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="attendance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Check className="mr-2 h-4 w-4" />
                    Attendance
                  </TabsTrigger>
                  <TabsTrigger value="uniform" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Uniform Compliance
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="attendance">
                <CardContent className="pt-6">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <motion.div variants={container} initial="hidden" animate="show">
                      <motion.div variants={item} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button onClick={markAllPresent} variant="outline" size="sm" className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300 dark:border-green-800/30">
                                  <Check className="mr-2 h-4 w-4" />
                                  Mark All Present
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark all students as present</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button onClick={markAllAbsent} variant="outline" size="sm" className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 dark:border-red-800/30">
                                  <X className="mr-2 h-4 w-4" />
                                  Mark All Absent
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark all students as absent</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-64"
                          />
                        </div>
                      </motion.div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">#</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getFilteredStudents().length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Search className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No students found matching your search criteria.</p>
                                    <Button 
                                      variant="link" 
                                      onClick={() => setSearchQuery("")}
                                      className="mt-2"
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Clear search
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              getFilteredStudents().map((student, index) => (
                                <motion.tr 
                                  key={student.id}
                                  variants={item}
                                  className="group hover:bg-muted/50"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <TableCell className="font-medium">{index + 1}</TableCell>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-3">
                                      <Select
                                        value={student.status}
                                        onValueChange={(value) => handleStatusChange(student.id, value)}
                                      >
                                        <SelectTrigger className="w-32">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="present" className="flex items-center">
                                            <div className="flex items-center">
                                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                                              <span>Present</span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="absent">
                                            <div className="flex items-center">
                                              <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                              <span>Absent</span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="late">
                                            <div className="flex items-center">
                                              <AlertCircle className="mr-2 h-4 w-4 text-yellow-500" />
                                              <span>Late</span>
                                            </div>
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                      {getStatusIcon(student.status)}
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => openEmailDialog(student)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Mail className="h-4 w-4" />
                                              <span className="sr-only">Send Email</span>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Send email report</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      
                                      {student.status === "late" && (
                                        <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button 
                                                variant="ghost" 
                                                size="icon"
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                              >
                                                <Clock className="h-4 w-4" />
                                                <span className="sr-only">Update Time</span>
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p>Update arrival time</p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </TooltipProvider>
                                      )}
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </motion.div>
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
                    <motion.div variants={container} initial="hidden" animate="show">
                      <motion.div variants={item} className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Showing uniform compliance for {getFilteredStudents().length} students
                          </span>
                        </div>
                        
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-full sm:w-64"
                          />
                        </div>
                      </motion.div>
                      
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">#</TableHead>
                              <TableHead>Name</TableHead>
                              {uniformItems.map((item) => (
                                <TableHead key={item.id} className="text-center">{item.label}</TableHead>
                              ))}
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {getFilteredStudents().length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">
                                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Search className="h-12 w-12 mb-2 opacity-20" />
                                    <p>No students found matching your search criteria.</p>
                                    <Button 
                                      variant="link" 
                                      onClick={() => setSearchQuery("")}
                                      className="mt-2"
                                    >
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Clear search
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              getFilteredStudents().map((student, index) => (
                                <motion.tr 
                                  key={student.id}
                                  variants={item}
                                  className="group hover:bg-muted/50"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <TableCell className="font-medium">{index + 1}</TableCell>
                                  <TableCell className="font-medium">{student.name}</TableCell>
                                  {uniformItems.map((item) => (
                                    <TableCell key={item.id} className="text-center">
                                      <div className="flex justify-center">
                                        <Checkbox
                                          checked={student.uniform[item.id]}
                                          onCheckedChange={(checked) =>
                                            handleUniformChange(student.id, item.id, checked)
                                          }
                                          className={student.uniform[item.id] ? "bg-green-500 text-primary-foreground border-green-500" : ""}
                                        />
                                      </div>
                                    </TableCell>
                                  ))}
                                  <TableCell className="text-right">
                                    {Object.values(student.uniform).some((v) => !v) && (
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={() => openEmailDialog(student)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Mail className="h-4 w-4" />
                                              <span className="sr-only">Send Email</span>
                                            </Button>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <p>Send uniform compliance report</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                    )}
                                  </TableCell>
                                </motion.tr>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
            
            <CardFooter className="border-t bg-muted/50 px-6 py-4">
              <Button 
                onClick={saveAttendance} 
                disabled={saving || attendanceRecorded}
                className={attendanceRecorded ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {attendanceRecorded ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Attendance Recorded
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Attendance
                      </>
                    )}
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
      
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Send Email
            </DialogTitle>
            <DialogDescription>
              Send an email to {selectedStudent?.name}
              {activeTab === "uniform" &&
                selectedStudent &&
                Object.values(selectedStudent?.uniform || {}).some((v) => !v) && (
                  <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30 rounded-md">
                    <span className="text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Uniform issues: {selectedStudent && getUniformIssues(selectedStudent)}
                    </span>
                  </div>
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
                  <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                  Send Uniform Compliance Report
                </Button>
              )}
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => sendEmail("attendance")}
              >
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Send Attendance Report
              </Button>
              
              <Button
                className="w-full justify-start"
                variant="outline"
                onClick={() => sendEmail("custom")}
              >
                <Mail className="mr-2 h-4 w-4 text-primary" />
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