import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const AdminTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeacher, setNewTeacher] = useState({ name: "", email: "", password: "" });
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("id, name, email, created_at");
        if (error) throw error;
        setTeachers(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load teachers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeacher((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingTeacher(true);
    try {
      // 1. Crear cuenta en Supabase Auth
      const { data: authUser, error: signUpError } = await supabase.auth.signUp({
        email: newTeacher.email,
        password: newTeacher.password,
      });
      if (signUpError) throw signUpError;

      // 2. Guardar en tabla teachers
      const { data: teacherInserted, error: insertError } = await supabase
        .from("teachers")
        .insert({
          id: authUser.user.id,
          name: newTeacher.name,
          email: newTeacher.email,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setTeachers((prev) => [...prev, teacherInserted]);
      setNewTeacher({ name: "", email: "", password: "" });
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Teacher created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add teacher.",
        variant: "destructive",
      });
    } finally {
      setIsAddingTeacher(false);
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    try {
      const { error } = await supabase.from("teachers").delete().eq("id", teacherId);
      if (error) throw new Error(error.message);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherId));
      toast({ title: "Success", description: "Teacher deleted successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete teacher. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Teachers</h1>
            <p className="text-muted-foreground">Manage teachers in the system</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Teacher</DialogTitle>
                <DialogDescription>Enter the details for the new teacher.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddTeacher}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={newTeacher.name} onChange={handleInputChange} required disabled={isAddingTeacher} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={newTeacher.email} onChange={handleInputChange} required disabled={isAddingTeacher} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" type="password" value={newTeacher.password} onChange={handleInputChange} required disabled={isAddingTeacher} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isAddingTeacher}>Cancel</Button>
                  <Button type="submit" disabled={isAddingTeacher}>
                    {isAddingTeacher ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>) : (<><Plus className="mr-2 h-4 w-4" /> Add</>)}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Teacher List</CardTitle>
            <CardDescription>Manage all teachers in the system</CardDescription>
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
                    <TableHead>Added On</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">No teachers found.</TableCell>
                    </TableRow>
                  ) : (
                    teachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>{teacher.name}</TableCell>
                        <TableCell>{teacher.email}</TableCell>
                        <TableCell>{new Date(teacher.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete {teacher.name}?</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteTeacher(teacher.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
    </DashboardLayout>
  );
};

export default AdminTeachers;
