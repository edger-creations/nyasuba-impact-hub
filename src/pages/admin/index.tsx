
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminIndex = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard
    navigate("/admin/dashboard");
  }, [navigate]);

  return null;
};

export default AdminIndex;
