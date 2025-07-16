import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, ArrowLeft, UserPlus } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { useUser } from "@/context/UserContext";

const TeacherStudents = () => {
  const [searchParams] = useSearchParams();
  const gradeid = searchParams.get("gradeid");
  
  const [students, setStudents] = useState([]);
  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
  });
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user: session } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      if (!gradeid) return;

      try {
        const { data: gradeData, error: gradeErr } = await supabase
          .from('grades')
          .select('id, name, levelid, teacherid')
          .eq('id', gradeid)
          .maybeSingle();
        if (gradeErr || !gradeData) throw gradeErr || new Error('Failed');

        const { data: studentsData, error: studentsErr } = await supabase
          .from('students')
          .select('id, name, email, gradeid')
          .eq('gradeid', gradeid);
        if (studentsErr) throw studentsErr;

        setGrade(gradeData);
        setStudents(studentsData);
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
  }, [gradeid, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    
    if (!newStudent.name) {
      toast({
        title: "Error",
        description: "Please enter a student name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingStudent(true);

    try {
      const body = {
        name: newStudent.name,
        email: newStudent.email,
        gradeid: parseInt(gradeid),
      };
      console.log('New student data:', body);
      const { data: created, error } = await supabase
        .from('students')
        .insert(body)
        .select('id, name, email, gradeid')
        .single();

      if (error) throw new Error(error.message);

      setStudents((prev) => [...prev, created]);
      
      setNewStudent({
        name: "",
        email: "",
      });
      
      setIsDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Student added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingStudent(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    const { data: userData, error: userErr } = await supabase
      .from('users')
      .select('password')
      .eq('id', session.id)
      .maybeSingle();

    if (userErr || !userData || userData.password !== deleteConfirmPassword) {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentToDelete.id);

      if (error) throw new Error(error.message);

      setStudents((prev) => prev.filter((student) => student.id !== studentToDelete.id));
      
      setStudentToDelete(null);
      setDeleteConfirmPassword("");
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Student deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleteConfirmPassword("");
      setIsDeleteDialogOpen(false);
    }
  };

  const openDeleteDialog = (student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  if (!gradeid) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">
              Please select a grade to view its students
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
              {grade ? `${grade.name} Students` : "Students"}
            </h1>
            <p className="text-muted-foreground">
              Manage students in this grade
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Link to="/teacher/grades">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Grades
              </Button>
            </Link>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Student
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new student.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddStudent}>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newStudent.name}
                        onChange={handleInputChange}
                        disabled={isAddingStudent}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (Optional)</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={newStudent.email}
                        onChange={handleInputChange}
                        disabled={isAddingStudent}
                      />
                      <p className="text-xs text-muted-foreground">
                        Parent's email for notifications
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isAddingStudent}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isAddingStudent}>
                      {isAddingStudent ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Student
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              Manage all students in {grade?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        No students found. Add your first student to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email || "No email"}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => openDeleteDialog(student)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {studentToDelete?.name}? This action cannot be undone.
              Please enter your password to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-2 py-4">
            <Label htmlFor="confirmPassword">Your Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={deleteConfirmPassword}
              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setStudentToDelete(null);
              setDeleteConfirmPassword("");
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteStudent}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default TeacherStudents;