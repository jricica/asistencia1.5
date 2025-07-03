import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-blue-50 dark:from-background dark:to-blue-950/20 text-foreground p-4">
      <div className="container max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          className="flex-1 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight gradient-text">
              School Attendance System
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl">
              A comprehensive platform for administrators and teachers to track student attendance, uniform compliance, and send reports.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              className="text-lg"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </Button>
          </div>
          
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Easy Attendance", description: "Quickly mark attendance for entire classes or individual students" },
              { title: "Uniform Tracking", description: "Monitor uniform compliance and send automated reports" },
              { title: "Data Insights", description: "View attendance projections and analytics at a glance" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="p-4 rounded-lg bg-white/50 dark:bg-slate-800/50 border shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
              >
                <h3 className="font-bold text-lg">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div 
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-30"></div>
            <div className="relative bg-white dark:bg-slate-900 rounded-lg shadow-xl overflow-hidden border">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      SAS
                    </div>
                    <h2 className="text-xl font-bold">Dashboard Preview</h2>
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-20 bg-blue-100 dark:bg-blue-900/30 rounded"></div>
                    <div className="h-20 bg-green-100 dark:bg-green-900/30 rounded"></div>
                    <div className="h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
                  </div>
                  <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Index;