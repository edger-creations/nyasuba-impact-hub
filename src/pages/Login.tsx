
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
      await login(values.email, values.password);
      toast.success("Login successful!");
      navigate(redirectUrl);
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Admin login simulation for demo purposes
  const handleAdminLogin = async () => {
    setIsSubmitting(true);
    try {
      // For demo only, in a real app this would be authenticated properly
      const adminEmail = "admin@estherfoundation.org";
      const adminPassword = "admin123"; // In a real app, never hardcode passwords
      
      // Call the normal login function with admin credentials
      await login(adminEmail, adminPassword);
      
      // The login function in AuthContext should set isAdmin=true for this account
      toast.success("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Admin login failed. Please try again.");
      console.error("Admin login error:", error);
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
            
            {/* Admin login button - for demo purposes only */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                For demo purposes:
              </p>
              <Button 
                variant="outline"
                className="w-full border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green"
                onClick={handleAdminLogin}
                disabled={isSubmitting}
              >
                Login as Admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
