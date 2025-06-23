
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const VerifyEmail = () => {
  const { user, isVerified, checkVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email from state if available (passed from signup page)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [location.state, user]);
  
  // Handle token from URL if present (user clicked email link)
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      // Get the URL fragment after the # symbol
      const hash = window.location.hash;
      
      if (hash && hash.includes('type=signup')) {
        try {
          // Parse the hash fragment
          const params = new URLSearchParams(hash.substring(1));
          const type = params.get('type');
          const token = params.get('access_token');
          
          if (type === 'signup' && token) {
            // Get the refresh token as well
            const refreshToken = params.get('refresh_token');
            
            // Set the auth session from the URL tokens
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: refreshToken || '',
            });
            
            if (error) {
              console.error('Error setting session:', error);
              toast({
                title: "Verification Error",
                description: "There was an issue verifying your email. Please try again.",
                variant: "destructive"
              });
            } else {
              // Email confirmed successfully
              toast({
                title: "Email Verified!",
                description: "Your email has been verified successfully. Redirecting to login...",
              });
              
              // Clear the URL hash
              window.history.replaceState({}, document.title, window.location.pathname);
              
              // Redirect to login after a short delay
              setTimeout(() => {
                navigate('/login?email_verified=true');
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Error handling email confirmation:', error);
          toast({
            title: "Verification Error", 
            description: "There was an issue processing your email verification.",
            variant: "destructive"
          });
        }
      }
    };
    
    handleEmailConfirmation();
  }, [navigate]);
  
  // Check verification status on mount and periodically
  useEffect(() => {
    // Check verification status on component mount
    if (user && !isVerified) {
      checkVerification().then(verified => {
        if (verified) {
          toast({
            title: "Email Verified!",
            description: "Your email has been verified successfully.",
          });
          
          setTimeout(() => {
            navigate("/login?email_verified=true");
          }, 3000);
        }
      });
    }
    
    // Set up interval to check verification status
    const verificationCheck = setInterval(() => {
      if (user && !isVerified) {
        checkVerification();
      } else {
        clearInterval(verificationCheck);
      }
    }, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(verificationCheck);
    };
  }, [user, isVerified, checkVerification, navigate]);
  
  const handleResendVerification = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "No email address found to send verification email",
        variant: "destructive"
      });
      return;
    }
    
    setResending(true);
    try {
      // Use email from state instead of requiring the user to be logged in
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email`
        }
      });
      
      if (error) {
        console.error("Error resending verification:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to send verification email. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email Sent",
          description: "A new verification email has been sent to your inbox.",
        });
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setResending(false);
    }
  };
  
  // For users who are already verified
  if (isVerified) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center">Email Verified</CardTitle>
              <CardDescription className="text-center">
                Your email address has been successfully verified.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p>You can now access all features of the application.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/")} className="bg-enf-green hover:bg-enf-dark-green">
                Continue to App
              </Button>
            </CardFooter>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // For users who need to verify their email
  return (
    <Layout>
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Mail className="h-12 w-12 text-enf-green" />
            </div>
            <CardTitle className="text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Please verify your email address to complete your registration.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p>
              We've sent a verification link to <strong>{email}</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Please check your inbox (and spam folder) and click the verification link to activate your account.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Didn't receive the email?</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={handleResendVerification} 
              disabled={resending}
              className="bg-enf-green hover:bg-enf-dark-green"
            >
              {resending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
