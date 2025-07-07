import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  BarChart2,
  Settings,
  School,
  Layers,
  UserCog,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

export function AppSidebar() {
  const location = useLocation();
  const { user: session } = useUser();

  if (!session || !session.role) {
    return (
      <Sidebar className="border-r bg-background">
        <SidebarContent className="p-4 text-muted-foreground text-sm">
          Loading menu...
        </SidebarContent>
      </Sidebar>
    );
  }

  const userRole = session.role || "";

  const getMenuItems = () => {
    const baseItems = [
      { title: "Dashboard", url: "/dashboard", icon: Home },
    ];

    const teacherItems = [
      { title: "Levels & Grades", url: "/admin/levels", icon: Layers },
      { title: "Projections", url: "/admin/projections", icon: BarChart2 },
  
    ];

    const adminItems = [
      ...teacherItems,
      { title: "Teachers", url: "/admin/teachers", icon: UserCog },
      { title: "Settings", url: "/admin/settings", icon: Settings },
    ];

    if (userRole === "admin") return [...baseItems, ...adminItems];
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
    <Sidebar className="border-r bg-background">
      <SidebarContent>
        <div className="flex items-center gap-2 px-4 py-4">
          <School className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">School System</span>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground">
            {userRole === "admin" ? "ADMINISTRATION" : "NAVIGATION"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-1"
              >
                {menuItems.map((itemData) => (
                  <motion.div key={itemData.title} variants={item}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className={cn(
                          "transition-all duration-200 hover:bg-muted",
                          location.pathname === itemData.url &&
                            "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <Link to={itemData.url} className="flex items-center">
                          <itemData.icon
                            className={cn(
                              "mr-2 h-4 w-4",
                              location.pathname === itemData.url
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span>{itemData.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto px-4 py-4">
          <div className="rounded-lg bg-primary/10 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                {userRole === "admin" ? "A" : userRole === "teacher" ? "T" : "S"}
              </div>
              <div>
                <p className="text-sm font-medium">
                  {userRole === "admin" ? "Admin" : userRole === "teacher" ? "Teacher" : "Student"} Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "admin" ? "Full access" : userRole === "teacher" ? "Limited access" : "Student view"}
                </p>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {userRole === "admin"
                ? "You have full administrative privileges"
                : userRole === "teacher"
                ? "You can manage grades and students"
                : "View your attendance and reports"}
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
