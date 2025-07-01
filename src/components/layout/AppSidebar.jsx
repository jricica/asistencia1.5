import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fine } from "@/lib/fine";
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
  School
} from "lucide-react";

export function AppSidebar() {
  const { data: session } = fine.auth.useSession();
  const location = useLocation();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (session?.user) {
      // In a real app, you'd get the role from the session
      // For now, we'll simulate getting it from the database
      const getUserRole = async () => {
        try {
          const users = await fine.table("users")
            .select("role")
            .eq("email", session.user.email);
          
          if (users && users.length > 0) {
            setUserRole(users[0].role);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          // Default to teacher if there's an error
          setUserRole("teacher");
        }
      };
      
      getUserRole();
    }
  }, [session]);

  // Define menu items based on user role
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
        icon: Users,
      },
      {
        title: "Levels & Grades",
        url: "/admin/levels",
        icon: School,
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
        icon: Users,
      },
      {
        title: "Attendance",
        url: "/teacher/attendance",
        icon: ClipboardCheck,
      },
      {
        title: "Reports",
        url: "/teacher/reports",
        icon: Mail,
      },
      {
        title: "Projections",
        url: "/teacher/projections",
        icon: BarChart2,
      }
    ];

    if (userRole === "admin") {
      return [...baseItems, ...adminItems];
    } else if (userRole === "teacher") {
      return [...baseItems, ...teacherItems];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar className="border-r bg-background">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    active={location.pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}