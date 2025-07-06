import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { DashboardLayout } from "@/components/layout/Dashboard";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Users, ClipboardCheck, BookOpen, School, ArrowRight } from "lucide-react";

const TeacherGrades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherLevel, setTeacherLevel] = useState(null);
  const { user: session } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!session) return;
      
      try {

        
        // Mock teacher data
        const mockTeacherId = 1;
        const mockTeacherLevel = 1; // Elementary
        
        setTeacherLevel(mockTeacherLevel);
        
        // Mock grades for this level
        const mockGrades = [
          { id: 1, name: "Grade 1", levelId: 1, studentCount: 25, attendanceRate: 92, uniformCompliance: 88 },
          { id: 2, name: "Grade 2", levelId: 1, studentCount: 28, attendanceRate: 89, uniformCompliance: 85 },
          { id: 3, name: "Grade 3", levelId: 1, studentCount: 22, attendanceRate: 94, uniformCompliance: 90 },
          { id: 4, name: "Grade 4", levelId: 1, studentCount: 26, attendanceRate: 91, uniformCompliance: 87 },
          { id: 5, name: "Grade 5", levelId: 1, studentCount: 24, attendanceRate: 88, uniformCompliance: 82 },
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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getAttendanceColor = (rate) => {
    if (rate >= 92) return "text-green-500";
    if (rate >= 85) return "text-yellow-500";
    return "text-red-500";
  };

  const getUniformColor = (rate) => {
    if (rate >= 90) return "text-green-500";
    if (rate >= 80) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Grades</h1>
              <p className="text-muted-foreground">
                View and manage grades in your level
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300">
              <School className="mr-2 h-4 w-4" />
              Elementary Level
            </Badge>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grades.map((grade, index) => (
              <motion.div 
                key={grade.id} 
                variants={item}
                className="card-hover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-0 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/20 pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        {grade.name}
                      </CardTitle>
                      <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80">
                        {grade.studentCount} students
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <ClipboardCheck className={`h-4 w-4 ${getAttendanceColor(grade.attendanceRate)}`} />
                          <span className={`text-sm font-medium ${getAttendanceColor(grade.attendanceRate)}`}>
                            {grade.attendanceRate}% attendance
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className={`h-4 w-4 ${getUniformColor(grade.uniformCompliance)}`} />
                          <span className={`text-sm font-medium ${getUniformColor(grade.uniformCompliance)}`}>
                            {grade.uniformCompliance}% uniform
                          </span>
                        </div>
                      </div>
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
                      <Button className="group">
                        Take Attendance
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default TeacherGrades;