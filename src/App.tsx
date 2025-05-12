
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/context/AuthContext";
import { useState } from "react";
// Remove the useEffect import since we're importing the entire React library below
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ProtectedRoute from "@/components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Volunteer from "./pages/Volunteer";
import VolunteerForm from "./pages/VolunteerForm";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import Donate from "./pages/Donate";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminIndex from "./pages/admin/index";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminPrograms from "./pages/admin/Programs";
import AdminVolunteers from "./pages/admin/Volunteers";
import AdminDonations from "./pages/admin/Donations";
import AdminGallery from "./pages/admin/Gallery";
import AdminReviews from "./pages/admin/Reviews";
import AdminSettings from "./pages/admin/Settings";
import AdminUsers from "./pages/admin/Users";
import AdminEvents from "./pages/admin/Events";

const App = () => {
  // Initialize AOS
  React.useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="enf-theme">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                
                {/* Protected routes that require verification */}
                <Route path="/programs" element={
                  <ProtectedRoute requireVerification={true}>
                    <Programs />
                  </ProtectedRoute>
                } />
                <Route path="/about" element={
                  <ProtectedRoute requireVerification={true}>
                    <About />
                  </ProtectedRoute>
                } />
                <Route path="/gallery" element={
                  <ProtectedRoute requireVerification={true}>
                    <Gallery />
                  </ProtectedRoute>
                } />
                <Route path="/volunteer" element={
                  <ProtectedRoute requireVerification={true}>
                    <Volunteer />
                  </ProtectedRoute>
                } />
                <Route path="/volunteer/apply" element={
                  <ProtectedRoute requireVerification={true}>
                    <VolunteerForm />
                  </ProtectedRoute>
                } />
                <Route path="/reviews" element={
                  <ProtectedRoute requireVerification={true}>
                    <Reviews />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={
                  <ProtectedRoute requireVerification={true}>
                    <Contact />
                  </ProtectedRoute>
                } />
                <Route path="/donate" element={
                  <ProtectedRoute requireVerification={true}>
                    <Donate />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminIndex />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/programs" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminPrograms />
                  </ProtectedRoute>
                } />
                <Route path="/admin/volunteers" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminVolunteers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/donations" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminDonations />
                  </ProtectedRoute>
                } />
                <Route path="/admin/gallery" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminGallery />
                  </ProtectedRoute>
                } />
                <Route path="/admin/reviews" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminReviews />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminUsers />
                  </ProtectedRoute>
                } />
                <Route path="/admin/events" element={
                  <ProtectedRoute requireRegistration={true}>
                    <AdminEvents />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
