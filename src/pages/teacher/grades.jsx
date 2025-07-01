import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fine } from "@/lib/fine";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Users, ClipboardCheck } from "lucide-react";

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherLevel, setTeacherLevel] = useState(null);
  const { data: session } = fine.auth.useSession();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!session?.user) return;
      
      try {
        // In a real app, you would fetch the teacher's data from the database
        // For now, we'll simulate the process
        
        // Mock teacher data
        const mockTeacherId = 1;
        const mockTeacherLevel = 1; // Elementary
        
        setTeacherLevel(mockTeacherLevel);
        
        // Mock grades for this level
        const mockGrades = [
          { id: 1, name: "Grade 1", levelId: 1, studentCount: 25 },
          { id: 2, name: "Grade 2", levelId: 1, studentCount: 28 },
          { id: 3, name: "Grade 3", levelId: 1, studentCount: 22 },
          { id: 4, name: "Grade 4", levelId: 1, studentCount: 26 },
          { id: 5, name: "Grade 5", levelId: 1, studentCount: 24 },
        ];
        
        setGrades(mockGrades);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
        toast({
          title: "Error",
          description: "Failed to load grade data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [session, toast]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Grades</h1>
          <p className="text-muted-foreground">
            View and manage grades in your level
          </p>
        </div>
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grades.map((grade) => (
              <Card key={grade.id} className="overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4">
                  <CardTitle>{grade.name}</CardTitle>
                  <CardDescription>
                    {grade.studentCount} students
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                      <span>Students</span>
                    </div>
                    <Link to={`/teacher/students?gradeId=${grade.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-4">
                  <div className="flex items-center">
                    <ClipboardCheck className="mr-2 h-5 w-5 text-muted-foreground" />
                    <span>Attendance</span>
                  </div>
                  <Link to={`/teacher/attendance?gradeId=${grade.id}`}>
                    <Button>Take Attendance</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrades;