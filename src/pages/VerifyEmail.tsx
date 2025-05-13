
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { user, isVerified, resendVerificationEmail, checkVerification } = useAuth();
  const [resending, setResending] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check verification status on mount and periodically
  useEffect(() => {
    // Check verification status on component mount
    if (user && !isVerified) {
      checkVerification();
    }
    
    // If user is verified, redirect after a brief delay
    if (isVerified) {
      setTimeout(() => {
        const from = location.state?.from?.pathname || "/";
        navigate(from);
      }, 3000);
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
  }, [user, isVerified, checkVerification, navigate, location.state]);
  
  const handleResendVerification = async () => {
    if (!user) {
      toast.error("You must be logged in to request a verification email");
      return;
    }
    
    setResending(true);
    try {
      const success = await resendVerificationEmail();
      if (!success) {
        toast.error("Failed to send verification email. Please try again later.");
      }
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("An error occurred. Please try again later.");
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
              <CardTitle className="text-center">Email Already Verified</CardTitle>
              <CardDescription className="text-center">
                Your email address has already been verified.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate("/")}>
                Go to Home
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
