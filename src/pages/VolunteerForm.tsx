
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { CreditCard, DollarSign } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const VolunteerForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    availability: "",
    motivation: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal">("card");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const isFormValid = () => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.role !== "" &&
      formData.availability.trim() !== "" &&
      formData.motivation.trim() !== ""
    );
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      setPaymentStep(true);
    } else {
      toast.error("Please fill out all fields before proceeding to payment.");
    }
  };

  const processPayment = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would integrate with a payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Payment successful! Completing your application...");
      setPaymentCompleted(true);
      
      // Submit the form after successful payment
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Application submitted successfully! We'll be in touch soon.");
      navigate("/volunteer");
    } catch (error) {
      toast.error("There was an error processing your payment. Please try again.");
      console.error("Error processing payment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-enf-green text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Make a Difference Today</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Join our mission to empower communities and create lasting change.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 md:p-8">
          {!paymentStep ? (
            <>
              <h2 className="text-2xl font-bold mb-6">Volunteer Application Form</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Fill out the form below to express your interest in volunteering with us.
                There is a $10 USD application fee to cover administrative costs.
              </p>

              <form onSubmit={handleProceedToPayment} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Preferred Volunteer Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={handleSelectChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tree-planting">Tree Planting</SelectItem>
                      <SelectItem value="education">Education Support</SelectItem>
                      <SelectItem value="shelter">Shelter Building</SelectItem>
                      <SelectItem value="women-empowerment">Women Empowerment</SelectItem>
                      <SelectItem value="food-cultivation">Food Cultivation</SelectItem>
                      <SelectItem value="general">General Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availability">Availability (Days/Hours)</Label>
                  <Input
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motivation">Why do you want to volunteer?</Label>
                  <Textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    A $10 USD application fee is required to process your application. 
                    You will be prompted for payment after submitting this form.
                  </p>
                  <Button 
                    type="submit" 
                    className="w-full bg-enf-green hover:bg-enf-dark-green"
                  >
                    Continue to Payment
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-6">Application Fee Payment</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please complete the $10 USD application fee payment to submit your volunteer application.
              </p>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Volunteer Application Fee:</span>
                      <span className="font-medium">$10.00 USD</span>
                    </div>
                    <div className="flex justify-between font-bold border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>$10.00 USD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
                <div className="flex space-x-2 mb-4">
                  <Button 
                    variant={paymentMethod === "card" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("card")}
                    className={paymentMethod === "card" ? "bg-enf-green hover:bg-enf-dark-green" : ""}
                  >
                    <CreditCard className="h-4 w-4 mr-2" /> Pay with Card
                  </Button>
                  <Button 
                    variant={paymentMethod === "paypal" ? "default" : "outline"}
                    onClick={() => setPaymentMethod("paypal")}
                    className={paymentMethod === "paypal" ? "bg-[#0070ba] hover:bg-[#005ea6]" : ""}
                  >
                    <DollarSign className="h-4 w-4 mr-2" /> Pay with PayPal
                  </Button>
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardName">Name on Card</Label>
                      <Input id="cardName" placeholder="John Smith" />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center p-4">
                    <p className="mb-4">Click the button below to complete payment with PayPal.</p>
                    <div className="bg-[#0070ba] text-white py-3 px-4 rounded-md inline-flex items-center justify-center font-bold">
                      <DollarSign className="h-5 w-5 mr-2" /> Pay with PayPal
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="terms" />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree that this fee is non-refundable and goes towards administrative costs.
                </label>
              </div>

              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setPaymentStep(false)} 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Back to Form
                </Button>
                <Button 
                  onClick={processPayment} 
                  disabled={isSubmitting}
                  className="flex-1 bg-enf-green hover:bg-enf-dark-green"
                >
                  {isSubmitting ? "Processing..." : "Complete Payment & Submit"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default VolunteerForm;
