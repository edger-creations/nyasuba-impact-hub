import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { sendVerificationEmail, isEmailVerified, User as ServiceUser } from "@/services/userService";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isRegistered: boolean;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("enf-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user:", error);
        localStorage.removeItem("enf-user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string, navigate: (path: string) => void) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const isAdmin = email === "admin@esthernyasubafoundation.org" && 
                     password === "Elly@12345@2024#";
      
      const registeredEmails = ["john.doe@example.com", "registered@example.com", "admin@esthernyasubafoundation.org"];
      
      const mockUser: User = {
        id: isAdmin ? "admin-123" : "user-" + Date.now(),
        name: isAdmin ? "Administrator" : email.split("@")[0],
        email,
        isAdmin: isAdmin,
        isRegistered: true,
        isVerified: isAdmin ? true : false,
      };
      
      setUser(mockUser);
      localStorage.setItem("enf-user", JSON.stringify(mockUser));
      
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: "user-" + Date.now(),
        name,
        email,
        isAdmin: false,
        isRegistered: true,
        isVerified: false,
      };
      
      setUser(newUser);
      localStorage.setItem("enf-user", JSON.stringify(newUser));
      
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
    navigate("/login");
  };

  const checkVerification = async (): Promise<boolean> => {
    if (!user) return false;
    
    const verified = await isEmailVerified(user.id);
    
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

  const contextValue: AuthContextType = {
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
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
