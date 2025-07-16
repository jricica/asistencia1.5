import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Send, Search } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const TeacherReports = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState("send");
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [reports, setReports] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState("default");
  const [selectedStudent, setSelectedStudent] = useState("default");
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
        const { data: gradesData, error: gradeErr } = await supabase.from("grades").select("id, name");
        if (gradeErr) throw gradeErr;

        const { data: studentsData, error: studentsErr } = await supabase.from("students").select("id, name, email, gradeid");
        if (studentsErr) throw studentsErr;

        const { data: reportsData, error: reportsErr } = await supabase
  .from("reports")
  .select("id, studentid, type, report, date, students(name)")



          .order("date", { ascending: false });
        if (reportsErr) throw reportsErr;

        const formatted = reportsData.map((r) => ({
          id: r.id,
          studentid: r.studentid,
          studentName: inserted.students?.name || "Unknown",
          type: r.type,
          subject: r.report.split("\n")[0],
          message: r.report.split("\n").slice(1).join("\n"),
          date: r.date,
        }));

        setGrades(gradesData);
        setStudents(studentsData);
        setReports(formatted);

        
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
    if (selectedGrade === "default") return [];
    return students.filter((student) => student.gradeid === parseInt(selectedGrade));
  };

  const getFilteredReports = () => {
    return reports.filter((report) => {
      const matchesSearch = searchQuery
        ? report.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.message.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

    const matchesStudent =
      selectedStudent !== "default" && selectedStudent !== "all"
        ? report.studentid === parseInt(selectedStudent)
        : true;

      return matchesSearch && matchesStudent;
    });
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    try {
      if (!emailForm.subject || !emailForm.message) {
        toast({
          title: "Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      
      if (
        selectedGrade === "default" &&
        (selectedStudent === "default" || selectedStudent === "all")
      ) {
        toast({
          title: "Error",
          description: "Please select a grade or student.",
          variant: "destructive",
        });
        return;
      }
      
      setSending(true);
      
 const studentIdValue =
  selectedStudent !== "default" && selectedStudent !== "all"
    ? Number(selectedStudent)
    : null;

if (selectedStudent !== "default" && selectedStudent !== "all" && isNaN(studentIdValue)) {
  throw new Error("Invalid student ID");
}

const { data: inserted, error } = await supabase
  .from("reports")
  .insert({
    studentid: studentIdValue,
    type: emailForm.type,
    report: `${emailForm.subject}\n${emailForm.message}`,
    sentBy: "teacher",
  })

        .select("id, studentid, type, report, date, students(name)")


        .single();
      if (error) throw error;
      const newReport = {
        id: inserted.id,
        studentid: inserted.studentid,
        studentName: inserted.students?.name || "Unknown",
        type: inserted.type,
        subject: emailForm.subject,
        message: emailForm.message,
        date: inserted.date,
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
                            setSelectedStudent("default");
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default" disabled>
                              Select a grade
                            </SelectItem>
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
                          disabled={selectedGrade === "default"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All students in grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default" disabled>
                              Select a student
                            </SelectItem>
                            <SelectItem value="all">All students in grade</SelectItem>
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
                        <Button disabled={selectedGrade === "default"}>
                          <Mail className="mr-2 h-4 w-4" />
                          Compose Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Compose Email</DialogTitle>
                          <DialogDescription>
                            Send an email to{
                              selectedStudent !== "default" && selectedStudent !== "all"
                                ? ` ${students.find((s) => s.id === parseInt(selectedStudent))?.name}`
                                : ` all students in ${grades.find((g) => g.id === parseInt(selectedGrade))?.name}`
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
                          <SelectItem value="default" disabled>
                            Filter by student
                          </SelectItem>
                          <SelectItem value="all">All Students</SelectItem>
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
                          <TableHead>Date</TableHead>
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
                              <TableCell>{report.date}</TableCell>
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