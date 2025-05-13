
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
  const { user, isVerified, resendVerificationEmail, checkVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
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
            // Set the auth token from the URL to confirm the email
            const { error } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: '',
            });
            
            if (error) {
              console.error('Error setting session:', error);
              toast({
                title: "Verification failed",
                description: "There was an issue verifying your email. Please try again.",
                variant: "destructive"
              });
            } else {
              // Email confirmed successfully
              toast({
                title: "Email verified successfully!",
                description: "Please log in with your credentials to continue.",
                variant: "default"
              });
              
              // Redirect to login after a short delay
              setTimeout(() => {
                navigate('/login');
              }, 2000);
            }
          }
        } catch (error) {
          console.error('Error handling email confirmation:', error);
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
        setVerificationChecked(true);
        
        if (verified) {
          toast({
            title: "Email verified successfully!",
            description: "Please log in to continue.",
            variant: "default"
          });
          
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        }
      });
    } else {
      setVerificationChecked(true);
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
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to request a verification email",
        variant: "destructive"
      });
      return;
    }
    
    setResending(true);
    try {
      const success = await resendVerificationEmail();
      if (!success) {
        toast({
          title: "Error",
          description: "Failed to send verification email. Please try again later.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email sent",
          description: "A new verification email has been sent to your inbox.",
          variant: "default"
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
              <p>You will be redirected to the login page in a moment.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/login")}>
                Go to Login
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
              Please verify your email address to access all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              We've sent a verification link to <strong>{user?.email}</strong>.
              Check your inbox and click the link to verify your account.
            </p>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or request a new verification link.
            </p>
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
