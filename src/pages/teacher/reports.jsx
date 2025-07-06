import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, Search } from "lucide-react";

const TeacherReports = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("send");
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [emailForm, setEmailForm] = useState({
    subject: "",
    message: "",
    type: "general",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {

        
        // Mock grades
        const mockGrades = [
          { id: 1, name: "Grade 1" },
          { id: 2, name: "Grade 2" },
          { id: 3, name: "Grade 3" },
        ];
        
        // Mock students
        const mockStudents = [
          { id: 1, name: "Alice Johnson", email: "alice@example.com", gradeId: 1 },
          { id: 2, name: "Bob Smith", email: "bob@example.com", gradeId: 1 },
          { id: 3, name: "Charlie Brown", email: "charlie@example.com", gradeId: 2 },
          { id: 4, name: "Diana Prince", email: "diana@example.com", gradeId: 2 },
          { id: 5, name: "Edward Cullen", email: "edward@example.com", gradeId: 3 },
        ];
        
        // Mock reports
        const mockReports = [
          { 
            id: 1, 
            studentId: 1, 
            studentName: "Alice Johnson", 
            type: "uniform", 
            subject: "Uniform Compliance Notice", 
            message: "This is a reminder that Alice needs to wear the proper school shoes.", 
            sentAt: "2023-09-15 09:30" 
          },
          { 
            id: 2, 
            studentId: 2, 
            studentName: "Bob Smith", 
            type: "general", 
            subject: "Attendance Concern", 
            message: "Bob has been late to class several times this week.", 
            sentAt: "2023-09-14 10:15" 
          },
          { 
            id: 3, 
            studentId: 3, 
            studentName: "Charlie Brown", 
            type: "uniform", 
            subject: "Uniform Compliance Notice", 
            message: "Charlie was not wearing the proper school sweater today.", 
            sentAt: "2023-09-13 14:20" 
          },
          { 
            id: 4, 
            studentId: 1, 
            studentName: "Alice Johnson", 
            type: "general", 
            subject: "Excellent Performance", 
            message: "Alice has been doing excellent work in class this week.", 
            sentAt: "2023-09-12 11:45" 
          },
          { 
            id: 5, 
            studentId: 4, 
            studentName: "Diana Prince", 
            type: "uniform", 
            subject: "Uniform Compliance Notice", 
            message: "Diana was not wearing the proper school pants today.", 
            sentAt: "2023-09-11 13:10" 
          },
        ];
        
        setGrades(mockGrades);
        setStudents(mockStudents);
        setReports(mockReports);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value) => {
    setEmailForm((prev) => ({ ...prev, type: value }));
  };

  const getFilteredStudents = () => {
    if (!selectedGrade) return [];
    return students.filter(student => student.gradeId === parseInt(selectedGrade));
  };

  const getFilteredReports = () => {
    return reports.filter(report => {
      const matchesSearch = searchQuery
        ? report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.message.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
      
      const matchesStudent = selectedStudent
        ? report.studentId === parseInt(selectedStudent)
        : true;
      
      return matchesSearch && matchesStudent;
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!emailForm.subject || !emailForm.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedGrade && !selectedStudent) {
      toast({
        title: "Error",
        description: "Please select a grade or student.",
        variant: "destructive",
      });
      return;
    }
    
    setSending(true);
    
    try {

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a new report entry
      const newReport = {
        id: reports.length + 1,
        studentId: selectedStudent ? parseInt(selectedStudent) : null,
        studentName: selectedStudent
          ? students.find(s => s.id === parseInt(selectedStudent))?.name
          : `All students in ${grades.find(g => g.id === parseInt(selectedGrade))?.name}`,
        type: emailForm.type,
        subject: emailForm.subject,
        message: emailForm.message,
        sentAt: new Date().toISOString().replace("T", " ").substring(0, 16),
      };
      
      setReports((prev) => [newReport, ...prev]);
      
      setEmailForm({
        subject: "",
        message: "",
        type: "general",
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Email sent successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Communication</h1>
          <p className="text-muted-foreground">
            Send and manage communications with students and parents
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="send">Send Reports</TabsTrigger>
            <TabsTrigger value="history">Report History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Email Reports</CardTitle>
                <CardDescription>
                  Send emails to students or entire grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="grade">Select Grade</Label>
                        <Select
                          value={selectedGrade}
                          onValueChange={(value) => {
                            setSelectedGrade(value);
                            setSelectedStudent("");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Select a grade</SelectItem>
                            {grades.map((grade) => (
                              <SelectItem key={grade.id} value={grade.id.toString()}>
                                {grade.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="student">Select Student (Optional)</Label>
                        <Select
                          value={selectedStudent}
                          onValueChange={setSelectedStudent}
                          disabled={!selectedGrade}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All students in grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">All students in grade</SelectItem>
                            {getFilteredStudents().map((student) => (
                              <SelectItem key={student.id} value={student.id.toString()}>
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={!selectedGrade}>
                          <Mail className="mr-2 h-4 w-4" />
                          Compose Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Compose Email</DialogTitle>
                          <DialogDescription>
                            Send an email to {selectedStudent
                              ? students.find(s => s.id === parseInt(selectedStudent))?.name
                              : `all students in ${grades.find(g => g.id === parseInt(selectedGrade))?.name}`
                            }
                          </DialogDescription>
                        </DialogHeader>
                        
                        <form onSubmit={handleSendEmail}>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="type">Email Type</Label>
                              <Select
                                value={emailForm.type}
                                onValueChange={handleTypeChange}
                                disabled={sending}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="general">General Message</SelectItem>
                                  <SelectItem value="uniform">Uniform Compliance</SelectItem>
                                  <SelectItem value="attendance">Attendance Notice</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="subject">Subject</Label>
                              <Input
                                id="subject"
                                name="subject"
                                value={emailForm.subject}
                                onChange={handleInputChange}
                                disabled={sending}
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="message">Message</Label>
                              <Textarea
                                id="message"
                                name="message"
                                value={emailForm.message}
                                onChange={handleInputChange}
                                disabled={sending}
                                rows={6}
                                required
                              />
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={sending}>
                              Cancel
                            </Button>
                            <Button type="submit" disabled={sending}>
                              {sending ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Email
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Report History</CardTitle>
                <CardDescription>
                  View all sent reports and communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search reports..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      
                      <Select
                        value={selectedStudent}
                        onValueChange={setSelectedStudent}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Filter by student" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Students</SelectItem>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Sent At</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getFilteredReports().length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              No reports found matching your search criteria.
                            </TableCell>
                          </TableRow>
                        ) : (
                          getFilteredReports().map((report) => (
                            <TableRow key={report.id}>
                              <TableCell className="font-medium">{report.studentName}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                  report.type === "uniform"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : report.type === "attendance"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}>
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                </span>
                              </TableCell>
                              <TableCell>{report.subject}</TableCell>
                              <TableCell>{report.sentAt}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TeacherReports;