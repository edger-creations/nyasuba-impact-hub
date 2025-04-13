
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { ReactNode } from "react";

type ProtectedRouteProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireRegistration?: boolean;
};

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireRegistration = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isRegistered, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Always allow access to the home page
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  // Always allow access to auth pages
  if (["/login", "/signup", "/forgot-password"].includes(location.pathname)) {
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
    toast.error("Login to see all pages");
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (requireRegistration && isAuthenticated && !isRegistered) {
    toast.error("Signup to browse all pages");
    return <Navigate to="/signup" state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
