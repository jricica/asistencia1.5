import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import Dashboard from "./pages/dashboard";
import PasswordRecovery from "./pages/password-recovery";
import Profile from "./pages/profile";

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

// Auth
import { ProtectedRoute } from "./components/auth/route-components";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <SidebarProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/password-recovery" element={<PasswordRecovery />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute Component={Dashboard} />} />
              <Route path="/profile" element={<ProtectedRoute Component={Profile} />} />

              {/* Admin */}
              <Route path="/admin/teachers" element={<ProtectedRoute Component={AdminTeachers} />} />
              <Route path="/admin/levels" element={<ProtectedRoute Component={AdminLevels} />} />
              <Route path="/admin/projections" element={<ProtectedRoute Component={AdminProjections} />} />
              <Route path="/admin/settings" element={<ProtectedRoute Component={AdminSettings} />} />

              {/* Teacher */}
              <Route path="/teacher/grades" element={<ProtectedRoute Component={TeacherGrades} />} />
              <Route path="/teacher/students" element={<ProtectedRoute Component={TeacherStudents} />} />
              <Route path="/teacher/attendance" element={<ProtectedRoute Component={TeacherAttendance} />} />
              <Route path="/teacher/reports" element={<ProtectedRoute Component={TeacherReports} />} />
              <Route path="/teacher/projections" element={<ProtectedRoute Component={TeacherProjections} />} />
            </Routes>
          </BrowserRouter>
          <Sonner />
          <Toaster />
        </SidebarProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
