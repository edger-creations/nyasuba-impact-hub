
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isRegistered?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("enf-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // This is a mock login that would be replaced with a real API call
      // Simulating API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check if the login is using admin credentials
      const isAdmin = email === "admin@esthernyasubafoundation.org" && 
                     password === "Elly@12345@2024#";
      
      // For demo purposes, we're treating some emails as registered users
      const registeredEmails = ["john.doe@example.com", "registered@example.com", "admin@esthernyasubafoundation.org"];
      const isRegistered = registeredEmails.includes(email);
      
      const mockUser = {
        id: isAdmin ? "admin-123" : "user-123",
        name: isAdmin ? "Administrator" : email.split("@")[0],
        email,
        isAdmin: isAdmin,
        isRegistered: isRegistered,
      };
      
      setUser(mockUser);
      localStorage.setItem("enf-user", JSON.stringify(mockUser));
      
      // Redirect based on user role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      // Mock signup, would be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser = {
        id: "user-" + Date.now(),
        name,
        email,
        isAdmin: false,
        isRegistered: true,
      };
      
      setUser(newUser);
      localStorage.setItem("enf-user", JSON.stringify(newUser));
      navigate("/");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("enf-user");
    navigate("/login"); // Always redirect to login page after logout
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isRegistered: user?.isRegistered || false,
        login,
        signup,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
