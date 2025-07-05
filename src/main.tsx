// ⚠️ Archivo migrado a JSX. No usar este `.tsx`.
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/layout/theme-provider";
import { SidebarProvider } from "./components/ui/sidebar";
import { UserProvider } from "./context/UserContext";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";

import "./index.css";

// Pages
import Index from "./pages";
import LoginForm from "./pages/login";
import SignupForm from "./pages/signup";
import Logout from "./pages/logout";
import DashboardRouter from "./pages/dashboard-router";
import Profile from "./pages/profile";
import RecoverPassword from "./pages/recover-password";
import ResetPassword from "./pages/reset-password";

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
import { ProtectedRoute } from "./components/auth/route-components";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <UserProvider>
          <SidebarProvider>
            <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/recover-password" element={<RecoverPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute Component={DashboardRouter} />} />
              <Route path="/profile" element={<ProtectedRoute Component={Profile} />} />

              {/* Admin Routes */}
              <Route path="/admin/teachers" element={<ProtectedRoute Component={AdminTeachers} roles={["admin"]} />} />
              <Route path="/admin/levels" element={<ProtectedRoute Component={AdminLevels} roles={["admin"]} />} />
              <Route path="/admin/projections" element={<ProtectedRoute Component={AdminProjections} roles={["admin"]} />} />
              <Route path="/admin/settings" element={<ProtectedRoute Component={AdminSettings} roles={["admin"]} />} />

              {/* Teacher Routes */}
              <Route path="/teacher/grades" element={<ProtectedRoute Component={TeacherGrades} roles={["teacher"]} />} />
              <Route path="/teacher/students" element={<ProtectedRoute Component={TeacherStudents} roles={["teacher"]} />} />
              <Route path="/teacher/attendance" element={<ProtectedRoute Component={TeacherAttendance} roles={["teacher"]} />} />
              <Route path="/teacher/reports" element={<ProtectedRoute Component={TeacherReports} roles={["teacher"]} />} />
              <Route path="/teacher/projections" element={<ProtectedRoute Component={TeacherProjections} roles={["teacher"]} />} />
            </Routes>
          </BrowserRouter>
          <Sonner />
          <Toaster />
        </SidebarProvider>
        </UserProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
