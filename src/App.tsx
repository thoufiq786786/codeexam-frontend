import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Student Pages
import Login from "@/pages/student/Login";
import Register from "@/pages/student/Register";
import Dashboard from "@/pages/student/Dashboard";
import Result from "@/pages/student/Result";

// Admin Pages
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AddQuestion from "@/pages/admin/AddQuestion";
import ManageQuestions from "@/pages/admin/ManageQuestions";
import EditQuestion from "@/pages/admin/EditQuestion"
import AdminResults from "@/pages/admin/AdminResults";


import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="student">
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/result" element={
              <ProtectedRoute requiredRole="student">
                <Result />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-question" element={
              <ProtectedRoute requiredRole="admin">
                <AddQuestion />
              </ProtectedRoute>
            } />
            <Route path="/admin/questions" element={
              <ProtectedRoute requiredRole="admin">
                <ManageQuestions />
              </ProtectedRoute>
            } />
            <Route path="/admin/edit-question/:id" element={
              <EditQuestion />
            } />
            <Route path="/admin/results" element={
              <ProtectedRoute requiredRole="admin">
                <AdminResults />
              </ProtectedRoute>
            } />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
