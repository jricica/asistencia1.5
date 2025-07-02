import { useState, useEffect } from "react";
import { Header } from "./Header";
import { AppSidebar } from "./AppSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardLayout({ children }) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Close sidebar on mobile by default
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed inset-y-0 z-20 mt-16 flex flex-col border-r bg-background",
                isMobile && "shadow-xl"
              )}
            >
              <div className="w-64">
                <AppSidebar />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.main
          className={cn(
            "flex-1 overflow-auto transition-all duration-200 ease-in-out p-4 md:p-6",
            !isMobile && sidebarOpen ? "ml-64" : "ml-0"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </motion.main>
        
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-10 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
}