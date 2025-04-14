
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ReactNode, useEffect } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireRegistration?: boolean;
  requireVerification?: boolean;
};

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireRegistration = true,
  requireVerification = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isRegistered, isVerified, user, checkVerification } = useAuth();
  const location = useLocation();

  // Check verification status on mount and when user changes
  useEffect(() => {
    // Only check verification if we have a user who is not an admin
    if (user && !user.isAdmin) {
      checkVerification();
      
      // Add a console log to help with debugging
      console.log("Current user verification status:", { 
        userId: user.id,
        isVerified: user.isVerified,
        email: user.email
      });
      
      // Check if there's a verification link stored for this user
      const lastVerificationUrl = localStorage.getItem('enf-last-verification-url');
      if (lastVerificationUrl) {
        console.log("Verification URL for current user:", lastVerificationUrl);
      }
    }
  }, [user, checkVerification]);

  // Always allow access to the home page
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  // Always allow access to auth pages and verification page
  if (["/login", "/signup", "/forgot-password", "/verify-email"].includes(location.pathname)) {
    return <>{children}</>;
  }

  // Admin routes check
  if (location.pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      toast.error("You must be logged in to access the admin area");
      return <Navigate to="/login" />;
    }
    
    if (!user?.isAdmin) {
      toast.error("You don't have permission to access the admin area");
      return <Navigate to="/" />;
    }
    
    return <>{children}</>;
  }

  // For regular protected routes
  if (requireAuth && !isAuthenticated) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" state={{ from: location }} />;
  }

  // Check registration status
  if (requireRegistration && isAuthenticated && !isRegistered) {
    // Only redirect to signup if they're actually not registered
    toast.error("Please complete registration to access this page");
    return <Navigate to="/signup" state={{ from: location }} />;
  }

  // Check verification status (if required for this route)
  if (requireVerification && isAuthenticated && !isVerified && !user?.isAdmin) {
    toast.warning("Please verify your email to access this page");
    
    // Log the verification URL for testing purposes
    const lastVerificationUrl = localStorage.getItem('enf-last-verification-url');
    if (lastVerificationUrl) {
      console.log("Test verification URL (for current user):", lastVerificationUrl);
    }
    
    return <Navigate to="/verify-email" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
