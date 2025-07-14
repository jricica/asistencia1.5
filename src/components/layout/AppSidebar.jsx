import { Link, useLocation } from "react-router-dom";
import {
  Home, BarChart2, Settings, School,
  Layers, UserCog, Users, ClipboardList,
  BookOpen
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export function AppSidebar() {
  const location = useLocation();
  const { user: session } = useUser();

  if (!session || !session.role) {
    return (
      <aside className="w-64 p-4 border-r bg-background text-sm text-muted-foreground">
        Loading menu...
      </aside>
    );
  }

  const userRole = session.role;

  const getMenuItems = () => {
    const baseItems = [
      { key: "dashboard", title: "Dashboard", url: "/dashboard", icon: Home },
    ];

    const teacherItems = [
      { key: "teacher-grades", title: "Grades", url: "/teacher/grades", icon: Layers },
      { key: "teacher-attendance", title: "Attendance", url: "/teacher/attendance", icon: BarChart2 },
      { key: "teacher-students", title: "Students", url: "/teacher/students", icon: Users },
      { key: "teacher-reports", title: "Reports", url: "/teacher/reports", icon: BookOpen },
    ];

    const adminExtraItems = [
      { key: "admin-teachers", title: "Teachers", url: "/admin/teachers", icon: UserCog },
      { key: "admin-settings", title: "Settings", url: "/admin/settings", icon: Settings },
      { key: "admin-levels", title: "Levels", url: "/admin/levels", icon: School },
      { key: "admin-projections", title: "Projections", url: "/admin/projections", icon: BarChart2 },
    ];

    if (userRole === "admin") return [...baseItems, ...teacherItems, ...adminExtraItems];
    if (userRole === "teacher") return [...baseItems, ...teacherItems];
    return baseItems;
  };

  const menuItems = getMenuItems();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <aside className="w-64 min-h-screen border-r bg-background p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <School className="h-6 w-6 text-primary" />
        <span className="font-bold text-lg">School System</span>
      </div>

      {/* Menu */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex-1 space-y-1"
      >
        {menuItems.map(({ key, url, title, icon: Icon }) => (
          <motion.div key={key} variants={item}>
            <Link
              to={url}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                location.pathname === url
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="w-4 h-4" />
              {title}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer */}
      <div className="mt-auto pt-6">
        <div className="rounded-lg bg-primary/10 p-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              {userRole === "admin" ? "A" : userRole === "teacher" ? "T" : "S"}
            </div>
            <div>
              <p className="font-medium">
                {userRole === "admin" ? "Admin" : userRole === "teacher" ? "Teacher" : "Student"} Mode
              </p>
              <p className="text-xs">
                {userRole === "admin"
                  ? "Full access"
                  : userRole === "teacher"
                  ? "Limited access"
                  : "Student view"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
