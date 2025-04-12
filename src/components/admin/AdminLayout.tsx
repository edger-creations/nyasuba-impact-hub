
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./AdminSidebar";
import { useAOSRefresh } from "@/hooks/useAOSRefresh";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Use our custom hook to refresh AOS animations on route changes
  useAOSRefresh();

  useEffect(() => {
    // Check if user is authenticated and is an admin
    if (!loading && (!isAuthenticated || !user?.isAdmin)) {
      navigate("/login?redirect=/admin/dashboard");
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-enf-green"></div>
      </div>
    );
  }

  // If the user is not authenticated or not an admin, don't render the admin layout
  if (!isAuthenticated || !user?.isAdmin) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <main data-aos="fade">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
