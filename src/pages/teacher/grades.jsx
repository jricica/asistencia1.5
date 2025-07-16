import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { DashboardLayout } from "@/components/layout/Dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  Loader2,
  Users,
  ClipboardCheck,
  BookOpen,
  School,
  ArrowRight,
} from "lucide-react";
import { supabase } from "../../../supabaseClient";

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
        const userId = Number(session.id);
        const role = session.role;

        let gradesData = [];

        if (role === "teacher") {
          const { data: teacherInfo, error: teacherErr } = await supabase
            .from("users")
            .select("levelid")
            .eq("id", userId)
            .eq("role", "teacher")
            .maybeSingle();
          if (teacherErr) throw teacherErr;

          const { data, error } = await supabase
            .from("grades")
            .select("id, name, levelid, teacherid")
            .eq("teacherid", userId);
          if (error) throw error;
          gradesData = data;

          if (teacherInfo) {
            setTeacherLevel(teacherInfo.levelid);
          } else if (gradesData.length) {
            setTeacherLevel(gradesData[0].levelid);
          }
        } else if (role === "admin") {
          const { data, error } = await supabase
            .from("grades")
            .select("id, name, levelid, teacherid");
          if (error) throw error;
          gradesData = data;
          setTeacherLevel("All");
        }

        const { data: students, error: studentsErr } = await supabase
          .from("students")
          .select("id, gradeid");
        if (studentsErr) throw studentsErr;

        const { data: attendanceData, error: attendanceErr } = await supabase
          .from("attendance")
          .select("studentid, status");
        if (attendanceErr) throw attendanceErr;

        const { data: uniformData, error: uniformErr } = await supabase
          .from("uniformcompliance")
          .select("studentid, shoes, shirt, pants, sweater, haircut");
        if (uniformErr) throw uniformErr;

        const gradeStats = gradesData.map((g) => {
          const gradeStudents = students.filter((s) => s.gradeid === g.id);
          const studentIds = gradeStudents.map((s) => s.id);
          const studentCount = gradeStudents.length;

          const gradeAttendance = attendanceData.filter((a) =>
            studentIds.includes(a.studentid)
          );
          const present = gradeAttendance.filter((a) => a.status === "present")
            .length;
          const attendanceRate = gradeAttendance.length
            ? Math.round((present / gradeAttendance.length) * 100)
            : 0;

          const gradeUniform = uniformData.filter((u) =>
            studentIds.includes(u.studentid)
          );
          const totalItems = gradeUniform.length * 5;
          const compliant = gradeUniform.reduce(
            (acc, u) =>
              acc +
              [u.shoes, u.shirt, u.pants, u.sweater, u.haircut].filter(Boolean)
                .length,
            0
          );
          const uniformCompliance = totalItems
            ? Math.round((compliant / totalItems) * 100)
            : 0;

          return { ...g, studentCount, attendanceRate, uniformCompliance };
        });

        setGrades(gradeStats);
      } catch (error) {
        console.error("Error fetching teacher data:", error.message);
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
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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
            {teacherLevel && (
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
              >
                <School className="mr-2 h-4 w-4" />
                Level ID: {teacherLevel}
              </Badge>
            )}
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
                      <Badge
                        variant="outline"
                        className="bg-white/80 dark:bg-slate-800/80"
                      >
                        {grade.studentCount} students
                      </Badge>
                    </div>
                    <CardDescription>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1">
                          <ClipboardCheck
                            className={`h-4 w-4 ${getAttendanceColor(
                              grade.attendanceRate
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getAttendanceColor(
                              grade.attendanceRate
                            )}`}
                          >
                            {grade.attendanceRate}% attendance
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users
                            className={`h-4 w-4 ${getUniformColor(
                              grade.uniformCompliance
                            )}`}
                          />
                          <span
                            className={`text-sm font-medium ${getUniformColor(
                              grade.uniformCompliance
                            )}`}
                          >
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
                      <Link to={`/teacher/students?gradeid=${grade.id}`}>
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
                    <Link to={`/teacher/attendance?gradeid=${grade.id}`}>
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