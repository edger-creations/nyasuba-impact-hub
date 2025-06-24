
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  isRegistered: boolean;
  isVerified?: boolean;
};

type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isRegistered: boolean;
  isVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  checkVerification: () => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(initialSession);
          if (initialSession?.user) {
            await updateUserFromSession(initialSession);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (mounted) {
          setSession(session);
          
          if (session?.user) {
            await updateUserFromSession(session);
          } else {
            setUser(null);
          }
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateUserFromSession = async (session: Session) => {
    try {
      const authUser = session.user;
      
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      const userData: AuthUser = {
        id: authUser.id,
        email: authUser.email || '',
        name: profile?.first_name 
          ? `${profile.first_name} ${profile.last_name || ''}`.trim()
          : (authUser.email || '').split('@')[0],
        isRegistered: true,
        isVerified: authUser.email_confirmed_at !== null,
        isAdmin: profile?.is_verified || false
      };

      setUser(userData);
    } catch (error) {
      console.error("Error updating user from session:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Handle demo admin account
      if (email === "admin@esthernyasubafoundation.org" && password === "Elly@12345@2024#") {
        const mockUser: AuthUser = {
          id: "admin-123",
          name: "Administrator",
          email,
          isAdmin: true,
          isRegistered: true,
          isVerified: true,
        };
        
        setUser(mockUser);
        localStorage.setItem("enf-user", JSON.stringify(mockUser));
        toast.success("Successfully logged in as administrator!");
        return;
      }
      
      // Real Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        if (!data.user.email_confirmed_at) {
          toast.error("Please verify your email address before logging in. Check your inbox for a verification link.");
          throw new Error("Email not verified");
        }
        
        toast.success("Successfully logged in!");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. Please check your credentials.";
      } else if (error.message?.includes("Email not verified")) {
        errorMessage = "Please verify your email address before logging in.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      console.log("Starting signup process for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ').slice(1).join(' ')
          },
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success("Account created successfully! Please check your email for a verification link.");
      } else {
        throw new Error("Failed to create account. Please try again.");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error?.message?.includes("already registered")) {
        errorMessage = "This email is already registered. Please use a different email or try logging in.";
      } else if (error?.message?.includes("Password")) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      localStorage.removeItem("enf-user");
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  const checkVerification = async (): Promise<boolean> => {
    if (!user) return false;
    
    // Demo admin is always verified
    if (user.isAdmin) return true;
    
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const verified = authUser?.email_confirmed_at !== null;
      
      if (verified !== user.isVerified) {
        setUser(prev => prev ? { ...prev, isVerified: verified } : null);
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
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) throw error;
      
      toast.success("Verification email sent! Please check your inbox.");
      return true;
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Failed to send verification email. Please try again.");
      return false;
    }
  };

  const contextValue: AuthContextType = {
    user,
    session,
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
