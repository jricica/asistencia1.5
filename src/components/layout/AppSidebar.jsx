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
  Users, 
  BookOpen, 
  ClipboardCheck, 
  BarChart2, 
  Settings,
  Mail,
  School,
  Layers,
  UserCog,
  GraduationCap,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const location = useLocation();

  // Define menu items
  const getMenuItems = () => {
    const baseItems = [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      }
    ];

    const adminItems = [
      {
        title: "Teachers",
        url: "/admin/teachers",
        icon: UserCog,
      },
      {
        title: "Levels & Grades",
        url: "/admin/levels",
        icon: Layers,
      },
      {
        title: "Projections",
        url: "/admin/projections",
        icon: BarChart2,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      }
    ];

    const teacherItems = [
      {
        title: "Grades",
        url: "/teacher/grades",
        icon: BookOpen,
      },
      {
        title: "Students",
        url: "/teacher/students",
        icon: GraduationCap,
      },
      {
        title: "Attendance",
        url: "/teacher/attendance",
        icon: ClipboardCheck,
      },
      {
        title: "Reports",
        url: "/teacher/reports",
        icon: FileText,
      },
      {
        title: "Projections",
        url: "/teacher/projections",
        icon: BarChart2,
      }
    ];

    return [...baseItems, ...adminItems, ...teacherItems];
  };

  const menuItems = getMenuItems();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
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
            NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-1"
              >
                {menuItems.map((menuItem) => (
                  <motion.div key={menuItem.title} variants={itemVariants}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === menuItem.url}
                        className={cn(
                          "transition-all duration-200 hover:bg-muted",
                          location.pathname === menuItem.url &&
                            "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <Link to={menuItem.url} className="flex items-center">
                          <menuItem.icon
                            className={cn(
                              "mr-2 h-4 w-4",
                              location.pathname === menuItem.url
                                ? "text-primary"
                                : "text-muted-foreground"
                          )} />
                          <span>{menuItem.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </motion.div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>
    </Sidebar>
  );
}