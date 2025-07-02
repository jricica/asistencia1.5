import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import "./index.css";

// Pages
import Index from "./pages";
import Dashboard from "./pages/dashboard";

// Admin Pages
import AdminTeachers from "./pages/admin/teachers";
import AdminLevels from "./pages/admin/levels";
import AdminProjections from "./pages/admin/projections";
import AdminSettings from "./pages/admin/settings";

// Teacher Pages
import TeacherGrades from "./pages/teacher/grades";
import TeacherStudents from "./pages/teacher/students";
import TeacherAttendance from "./pages/teacher/attendance";
import TeacherReports from "./pages/teacher/reports";
import TeacherProjections from "./pages/teacher/projections";

// Auth Components

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider defaultTheme="light">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/teachers" element={<AdminTeachers />} />
            <Route path="/admin/levels" element={<AdminLevels />} />
            <Route path="/admin/projections" element={<AdminProjections />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/teacher/grades" element={<TeacherGrades />} />
            <Route path="/teacher/students" element={<TeacherStudents />} />
            <Route path="/teacher/attendance" element={<TeacherAttendance />} />
            <Route path="/teacher/reports" element={<TeacherReports />} />
            <Route path="/teacher/projections" element={<TeacherProjections />} />
          </Routes>
        </BrowserRouter>
        <Sonner />
        <Toaster />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);