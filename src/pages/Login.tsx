
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle } from "lucide-react";

// Login form schema
const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [showResetSuccessMessage, setShowResetSuccessMessage] = useState(false);
  
  // Check for various query parameters
  useEffect(() => {
    // Check URL parameters
    const searchParams = new URLSearchParams(location.search);
    
    // Check for email verification success
    const emailVerified = searchParams.get("email_verified");
    if (emailVerified === "true") {
      setShowVerifiedMessage(true);
    }
    
    // Check for password reset success
    const resetSuccess = searchParams.get("resetSuccess");
    if (resetSuccess === "true") {
      setShowResetSuccessMessage(true);
      toast({
        title: "Password updated",
        description: "Your password has been successfully reset. You can now log in with your new password.",
      });
    }
    
    // Remove query parameters from URL for cleanliness
    if (emailVerified || resetSuccess) {
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, [location]);
  
  // Get redirect URL from query params if present
  const searchParams = new URLSearchParams(location.search);
  const redirectUrl = searchParams.get("redirect") || "/";

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      await login(values.email, values.password, (path) => navigate(path));
      toast.success("Login successful!");
      // No need to navigate here as login function will do it
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px-200px)] py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Log In to Your Account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>
          
          {showVerifiedMessage && (
            <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your email has been verified successfully! You can now log in with your credentials.
              </AlertDescription>
            </Alert>
          )}
          
          {showResetSuccessMessage && (
            <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Your password has been reset successfully! You can now log in with your new password.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-enf-green hover:text-enf-dark-green dark:text-enf-light-green dark:hover:text-enf-green block text-right"
                >
                  Forgot password?
                </Link>
                
                <Button 
                  type="submit" 
                  className="w-full bg-enf-green hover:bg-enf-dark-green"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging In..." : "Login"}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6">
              <p className="text-center text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link 
                  to="/signup" 
                  className="text-enf-green hover:text-enf-dark-green dark:text-enf-light-green dark:hover:text-enf-green"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
