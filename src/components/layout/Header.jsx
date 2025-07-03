import { useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  Settings,
  Bell,
  Moon,
  Sun,
  School,
  Search,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/layout/theme-provider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Header({ toggleSidebar }) {
  const { user: session } = useUser();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New student added to Grade 3", time: "5 min ago" },
    { id: 2, message: "Attendance report ready for review", time: "1 hour ago" },
    { id: 3, message: "System update scheduled for tonight", time: "3 hours ago" },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const userRole = session?.role;

  const userInitials = session?.name
    ? session.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  if (!session) {
    return (
      <header className="sticky top-0 z-30 h-16 border-b bg-background/95 px-4 md:px-6 flex items-center">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </header>
    );
  }

  return (
    <motion.header
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}
        <Link to="/dashboard" className="flex items-center gap-2">
          <School className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 hidden sm:inline-block">
            School Attendance System
          </span>
          <span className="text-xl font-bold sm:hidden">SAS</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center bg-muted/50 rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
        <Search className="h-4 w-4 text-muted-foreground mr-2" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent border-none outline-none text-sm w-full focus:outline-none focus:ring-0"
        />
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(!showNotifications)}
            className="rounded-full"
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-card p-4 shadow-lg z-50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Notifications</h3>
                <Badge variant="outline">{notifications.length}</Badge>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="rounded-md p-2 hover:bg-muted cursor-pointer transition-colors"
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t text-center">
                <Button variant="link" size="sm" className="text-xs">
                  View all notifications
                </Button>
              </div>
            </div>
          )}
        </div>

        {session && (
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarImage
                    src={session.image || ""}
                    alt={session.name}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.email}
                  </p>
                  {userRole && (
                    <Badge variant="outline" className="mt-1 w-fit">
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/profile"
                  className="flex w-full cursor-pointer items-center"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/admin/settings"
                  className="flex w-full cursor-pointer items-center"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/logout"
                  className="flex w-full cursor-pointer items-center text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </motion.header>
  );
}
