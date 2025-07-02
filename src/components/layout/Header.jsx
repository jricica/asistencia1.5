import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import {
  Menu,
  Bell,
  Moon,
  Sun,
  School,
  Search
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/layout/theme-provider";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export function Header({ toggleSidebar }) {

  const isMobile = useIsMobile();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New student added to Grade 3", time: "5 min ago" },
    { id: 2, message: "Attendance report ready for review", time: "1 hour ago" },
    { id: 3, message: "System update scheduled for tonight", time: "3 hours ago" }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);


  return (
    <motion.header 
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-6 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
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
                {notifications.map(notification => (
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
        
      </div>
    </motion.header>
  );
}