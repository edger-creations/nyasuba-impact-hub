
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { verifyEmailWithToken } from "@/services/userService";
import { toast } from "sonner";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const { user, isVerified, resendVerificationEmail, checkVerification } = useAuth();
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if this is a verification link click
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    
    const handleVerification = async () => {
      if (token && userId) {
        setVerifying(true);
        
        try {
          const success = await verifyEmailWithToken(userId, token);
          setVerificationSuccess(success);
          
          if (success) {
            toast.success("Email verified successfully!");
            // Update the verification status in Auth context
            await checkVerification();
            
            // Redirect after a brief delay
            setTimeout(() => {
              const from = location.state?.from?.pathname || "/";
              navigate(from);
            }, 3000);
          } else {
            toast.error("Verification failed. Please try again or request a new verification link.");
          }
        } catch (error) {
          console.error("Verification error:", error);
          setVerificationSuccess(false);
        } finally {
          setVerifying(false);
        }
      }
    };
    
    if (token && userId) {
      handleVerification();
    }
  }, [location, navigate, checkVerification]);
  
  const handleResendVerification = async () => {
    if (!user) {
      toast.error("You must be logged in to request a verification email");
      return;
    }
    
    setResending(true);
    try {
      const success = await resendVerificationEmail();
      if (success) {
        toast.success("Verification email sent! Please check your inbox.");
      } else {
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
  
  // For users coming from a verification link
  if (verifying) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
              </div>
              <CardTitle className="text-center">Verifying Your Email</CardTitle>
              <CardDescription className="text-center">
                Please wait while we verify your email address...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // For users who just completed verification successfully
  if (verificationSuccess === true) {
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-center">Email Verified!</CardTitle>
              <CardDescription className="text-center">
                Your email address has been successfully verified. Redirecting you...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }
  
  // For users who failed verification or need to request verification
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
              {verificationSuccess === false ? (
                <span className="flex items-center justify-center mt-2 text-red-500">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Verification failed. The link may have expired.
                </span>
              ) : (
                "Please verify your email address to access all features."
              )}
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
