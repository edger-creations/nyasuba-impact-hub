
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
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
  login: (email: string, password: string, navigate: (path: string, options?: any) => void) => Promise<void>;
  signup: (name: string, email: string, password: string, navigate: (path: string, options?: any) => void) => Promise<void>;
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
            isAdmin: profile?.is_verified || false
          });
        }
      }
      
      setLoading(false);
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
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
            isAdmin: profile?.is_verified || false
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        // If the user was updated (e.g., email verified), refresh the user data
        if (session) {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser && user) {
            setUser({
              ...user,
              isVerified: authUser.email_confirmed_at !== null
            });
          }
        }
      }
    });
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, navigate: (path: string, options?: any) => void) => {
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
          toast({
            title: "Email Verification Required",
            description: "Please check your email and click the verification link to complete your account setup.",
          });
          
          // Redirect to verify email page if email is not confirmed
          navigate("/verify-email", { state: { email } });
          return;
        }
        
        toast.success("Successfully logged in!");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, navigate: (path: string, options?: any) => void) => {
    setLoading(true);
    try {
      console.log("Calling Supabase signUp with email:", email);
      
      // Sign up with Supabase
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
      
      console.log("Supabase signup response:", { data, error });
      
      if (error) {
        console.error("Signup error from Supabase:", error);
        throw error;
      }
      
      if (data.user) {
        toast.success("Account created successfully! Please check your email for verification.");
        navigate("/verify-email", { state: { email } });
      } else {
        console.error("No user data returned from signup");
        throw new Error("Failed to create account. Please try again.");
      }
    } catch (error: any) {
      console.error("Detailed signup error:", error);
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
      toast.success("Successfully logged out");
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
