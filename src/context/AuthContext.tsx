
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { sendVerificationEmail, isEmailVerified, User as ServiceUser } from "@/services/userService";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isRegistered: boolean;  // Changed from optional to required to match userService.ts
  isVerified?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isVerified: boolean;
  login: (email: string, password: string, navigate: (path: string) => void) => Promise<void>;
  signup: (name: string, email: string, password: string, navigate: (path: string) => void) => Promise<void>;
  logout: (navigate: (path: string) => void) => void;
  loading: boolean;
  checkVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("enf-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, navigate: (path: string) => void) => {
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
      
      // Important fix: Mark ALL users as registered by default unless explicitly set otherwise
      // This ensures that regular users don't get redirected to signup after login
      const mockUser: User = {
        id: isAdmin ? "admin-123" : "user-" + Date.now(),
        name: isAdmin ? "Administrator" : email.split("@")[0],
        email,
        isAdmin: isAdmin,
        isRegistered: true, // Mark all users as registered by default
        isVerified: isAdmin ? true : false, // Admins are automatically verified
      };
      
      setUser(mockUser);
      localStorage.setItem("enf-user", JSON.stringify(mockUser));
      
      // Redirect based on user role
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        // For regular users, check if they need verification
        if (!mockUser.isVerified) {
          toast.warning("Please verify your email to access all features");
          await sendVerificationEmail({
            id: mockUser.id,
            name: mockUser.name,
            email: mockUser.email,
            isRegistered: mockUser.isRegistered,
            isVerified: mockUser.isVerified || false
          });
        }
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, navigate: (path: string) => void) => {
    setLoading(true);
    try {
      // Mock signup, would be replaced with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        isAdmin: false,
        isRegistered: true,
        isVerified: false, // New users start as unverified
      };
      
      setUser(newUser);
      localStorage.setItem("enf-user", JSON.stringify(newUser));
      
      // Send verification email
      const emailSent = await sendVerificationEmail({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isRegistered: newUser.isRegistered,
        isVerified: newUser.isVerified || false
      });
      
      if (emailSent) {
        toast.success("Account created! Please verify your email.");
      } else {
        toast.warning("Account created, but we couldn't send a verification email. Try resending later.");
      }
      
      navigate("/verify-email");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (navigate: (path: string) => void) => {
    setUser(null);
    localStorage.removeItem("enf-user");
    navigate("/login"); // Always redirect to login page after logout
  };
  
  const checkVerification = async (): Promise<boolean> => {
    if (!user) return false;
    
    const verified = await isEmailVerified(user.id);
    
    // Update local user state if verification status changed
    if (verified !== user.isVerified) {
      const updatedUser = { ...user, isVerified: verified };
      setUser(updatedUser);
      localStorage.setItem("enf-user", JSON.stringify(updatedUser));
    }
    
    return verified;
  };
  
  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!user) return false;
    
    return await sendVerificationEmail({
      id: user.id,
      name: user.name,
      email: user.email,
      isRegistered: user.isRegistered,
      isVerified: user.isVerified || false
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isRegistered: user?.isRegistered || false,
        isVerified: user?.isVerified || false,
        login,
        signup,
        logout,
        loading,
        checkVerification,
        resendVerificationEmail,
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
