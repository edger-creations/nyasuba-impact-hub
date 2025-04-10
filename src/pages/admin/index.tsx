
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const AdminIndex = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !user?.isAdmin) {
        // If not authenticated as admin, redirect to login with a message
        toast.error("Please login as an administrator to access the admin panel");
        navigate("/login?redirect=/admin/dashboard");
      } else {
        // If authenticated as admin, redirect to dashboard
        navigate("/admin/dashboard");
      }
    }
  }, [navigate, user, isAuthenticated, loading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enf-green"></div>
      </div>
    );
  }

  return null;
};

export default AdminIndex;
