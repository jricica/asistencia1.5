import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2, School, BookOpen } from "lucide-react";
import { supabase } from "../../../supabaseClient";

const AdminLevels = () => {
  const [levels, setLevels] = useState([]);
  const [grades, setGrades] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("levels");
  
  const [newLevel, setNewLevel] = useState({
    name: "",
    description: "",
  });
  
  const [newGrade, setNewGrade] = useState({
    name: "",
    levelid: "default",
    teacherid: "unassigned",
  });
  
  const [isAddingLevel, setIsAddingLevel] = useState(false);
  const [isAddingGrade, setIsAddingGrade] = useState(false);
  const [isLevelDialogOpen, setIsLevelDialogOpen] = useState(false);
  const [isGradeDialogOpen, setIsGradeDialogOpen] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: levelsData, error: levelErr } = await supabase
          .from('levels')
          .select('*');
        if (levelErr) throw levelErr;
        setLevels(levelsData);

        const { data: gradesData, error: gradeErr } = await supabase
          .from('grades')
          .select('id, name, levelid, teacherid');
        if (gradeErr) throw gradeErr;
        setGrades(gradesData);

        const { data: teachersData, error: teacherErr } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('role', 'teacher');
        if (teacherErr) throw teacherErr;
        setTeachers(teachersData);
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

  const handleLevelInputChange = (e) => {
    const { name, value } = e.target;
    setNewLevel((prev) => ({ ...prev, [name]: value }));
  };

  const handleGradeInputChange = (e) => {
    const { name, value } = e.target;
    setNewGrade((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewGrade((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLevel = async (e) => {
    e.preventDefault();
    
    if (!newLevel.name) {
      toast({
        title: "Error",
        description: "Please enter a level name.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingLevel(true);
    
    try {
      const { data: created, error } = await supabase
        .from('levels')
        .insert({
          name: newLevel.name,
          description: newLevel.description || null,
        })
        .select('id, name, description')
        .single();

      if (error) throw new Error(error.message);

      setLevels((prev) => [...prev, created]);
      
      setNewLevel({
        name: "",
        description: "",
      });
      
      setIsLevelDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Level added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add level. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingLevel(false);
    }
  };

  const handleAddGrade = async (e) => {
    e.preventDefault();
    
    if (!newGrade.name || newGrade.levelid === "default") {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAddingGrade(true);
    
    try {
      const payload = {
        name: newGrade.name,
        levelid: parseInt(newGrade.levelid),
        teacherid:
          newGrade.teacherid && newGrade.teacherid !== "unassigned"
            ? parseInt(newGrade.teacherid)
            : null,
      };

      const { data: created, error } = await supabase
        .from('grades')
        .insert(payload)
        .select('id, name, levelid, teacherid')
        .single();

      if (error) throw new Error(error.message);

      setGrades((prev) => [...prev, created]);
      
      setNewGrade({
        name: "",
        levelid: "default",
        teacherid: "unassigned",
      });
      
      setIsGradeDialogOpen(false);
      
      toast({
        title: "Success",
        description: "Grade added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add grade. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingGrade(false);
    }
  };

  const handleDeleteLevel = async (levelid) => {
    try {

      const associatedGrades = grades.filter((grade) => grade.levelid === levelid);
      
      if (associatedGrades.length > 0) {
        toast({
          title: "Error",
          description: "Cannot delete level with associated grades. Remove the grades first.",
          variant: "destructive",
        });
        return;
      }
      

      const { error } = await supabase
        .from('levels')
        .delete()
        .eq('id', levelid);

      if (error) throw new Error(error.message);

      setLevels((prev) => prev.filter((level) => level.id !== levelid));
      
      toast({
        title: "Success",
        description: "Level deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete level. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGrade = async (gradeId) => {
    try {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', gradeId);

      if (error) throw new Error(error.message);

      setGrades((prev) => prev.filter((grade) => grade.id !== gradeId));
      
      toast({
        title: "Success",
        description: "Grade deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete grade. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getLevelName = (levelid) => {
    const level = levels.find((level) => level.id === levelid);
    return level ? level.name : "Unknown";
  };

  const getTeacherName = (teacherid) => {
    if (!teacherid) return "Not Assigned";
    const teacher = teachers.find((teacher) => teacher.id === teacherid);
    return teacher ? teacher.name : "Unknown";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Levels & Grades</h1>
          <p className="text-muted-foreground">
            Manage school levels and grades
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="levels">Levels</TabsTrigger>
              <TabsTrigger value="grades">Grades</TabsTrigger>
            </TabsList>
            
            {activeTab === "levels" ? (
              <Dialog open={isLevelDialogOpen} onOpenChange={setIsLevelDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <School className="mr-2 h-4 w-4" />
                    Add Level
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Level</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new school level.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddLevel}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Level Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newLevel.name}
                          onChange={handleLevelInputChange}
                          disabled={isAddingLevel}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          name="description"
                          value={newLevel.description}
                          onChange={handleLevelInputChange}
                          disabled={isAddingLevel}
                        />
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsLevelDialogOpen(false)} disabled={isAddingLevel}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAddingLevel}>
                        {isAddingLevel ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Level
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <Dialog open={isGradeDialogOpen} onOpenChange={setIsGradeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Add Grade
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Grade</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new grade.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <form onSubmit={handleAddGrade}>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Grade Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={newGrade.name}
                          onChange={handleGradeInputChange}
                          disabled={isAddingGrade}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="levelid">Level</Label>
                        <Select
                          value={newGrade.levelid}
                          onValueChange={(value) => handleSelectChange("levelid", value)}
                          disabled={isAddingGrade}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default" disabled>
                              Select a level
                            </SelectItem>
                            {levels.map((level) => (
                              <SelectItem key={level.id} value={level.id.toString()}>
                                {level.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="teacherid">Assigned Teacher (Optional)</Label>
                        <Select
                          value={newGrade.teacherid}
                          onValueChange={(value) => handleSelectChange("teacherid", value)}
                          disabled={isAddingGrade}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Not Assigned</SelectItem>
                            {!loading &&
                              teachers.map((teacher) => (
                                <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                  {teacher.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setIsGradeDialogOpen(false)} disabled={isAddingGrade}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isAddingGrade}>
                        {isAddingGrade ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Grade
                          </>
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <TabsContent value="levels" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>School Levels</CardTitle>
                <CardDescription>
                  Manage all school levels in the system
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
                        <TableHead>Description</TableHead>
                        <TableHead>Grades</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {levels.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No levels found. Add your first level to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        levels.map((level) => {
                          const levelGrades = grades.filter((grade) => grade.levelid === level.id);
                          
                          return (
                            <TableRow key={level.id}>
                              <TableCell className="font-medium">{level.name}</TableCell>
                              <TableCell>{level.description || "No description"}</TableCell>
                              <TableCell>{levelGrades.length}</TableCell>
                              <TableCell className="text-right">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                      <Trash2 className="h-4 w-4" />
                                      <span className="sr-only">Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Level</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete {level.name}? This action cannot be undone.
                                        {levelGrades.length > 0 && (
                                          <p className="mt-2 text-destructive">
                                            This level has {levelGrades.length} associated grades. You must delete those grades first.
                                          </p>
                                        )}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteLevel(level.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="grades" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Grades</CardTitle>
                <CardDescription>
                  Manage all grades in the system
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
                        <TableHead>Level</TableHead>
                        <TableHead>Assigned Teacher</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {grades.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No grades found. Add your first grade to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        grades.map((grade) => (
                          <TableRow key={grade.id}>
                            <TableCell className="font-medium">{grade.name}</TableCell>
                            <TableCell>{getLevelName(grade.levelid)}</TableCell>
                            <TableCell>{getTeacherName(grade.teacherid)}</TableCell>
                            <TableCell className="text-right">
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Grade</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {grade.name}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteGrade(grade.id)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminLevels;