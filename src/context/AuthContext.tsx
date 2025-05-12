
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { sendVerificationEmail, isEmailVerified } from "@/services/userService";
import { supabase } from "@/integrations/supabase/client";

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
    // Check for existing session on load
    const checkSession = async () => {
      setLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Get user data if session exists
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Get additional profile data if needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          // Set the user in state
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : (authUser.email || '').split('@')[0],
            isRegistered: true,
            isVerified: authUser.email_confirmed_at !== null,
            isAdmin: profile?.is_verified || false // This should be replaced with proper role check
          });
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        if (authUser) {
          // Get additional profile data if needed
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single();
            
          // Set the user in state
          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}` : (authUser.email || '').split('@')[0],
            isRegistered: true,
            isVerified: authUser.email_confirmed_at !== null,
            isAdmin: profile?.is_verified || false // This should be replaced with proper role check
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, navigate: (path: string) => void) => {
    setLoading(true);
    try {
      // For demo purposes only - allow login with admin account
      if (email === "admin@esthernyasubafoundation.org" && password === "Elly@12345@2024#") {
        const mockUser: User = {
          id: "admin-123",
          name: "Administrator",
          email,
          isAdmin: true,
          isRegistered: true,
          isVerified: true,
        };
        
        setUser(mockUser);
        localStorage.setItem("enf-user", JSON.stringify(mockUser));
        navigate("/admin/dashboard");
        return;
      }
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Check if verification is needed
        if (!data.user.email_confirmed_at) {
          toast.warning("Please verify your email to access all features");
          await sendVerificationEmail({
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || '',
            isRegistered: true,
            isVerified: false
          });
          
          console.log("Check your console for verification link!");
          toast.info("Check your browser console for the verification link (F12)");
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
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ')
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // For demo purposes, show verification email info
        console.log("About to send verification email for:", email);
        
        toast.success("Account created! Please verify your email.");
        toast.info("Check your browser console for the verification link (F12)");
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (navigate: (path: string) => void) => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("enf-user");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const checkVerification = async (): Promise<boolean> => {
    if (!user) return false;
    
    // For demo admin account
    if (user.isAdmin) return true;
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const verified = authUser?.email_confirmed_at !== null;
      
      if (verified !== user.isVerified) {
        const updatedUser = { ...user, isVerified: verified };
        setUser(updatedUser);
      }
      
      return verified || false;
    } catch (error) {
      console.error("Error checking verification:", error);
      return user.isVerified || false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error("Error resending verification:", error);
      return false;
    }
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
