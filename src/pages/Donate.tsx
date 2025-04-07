import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Phone, CreditCard } from "lucide-react";

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("KSH");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const predefinedAmounts = [
    { value: "1000", label: "1,000" },
    { value: "5000", label: "5,000" },
    { value: "10000", label: "10,000" },
  ];

  const handleAmountClick = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount("");
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "name") setName(value);
    if (name === "email") setEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = donationAmount || customAmount;
    if (!finalAmount) {
      toast.error("Please select or enter a donation amount.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // In a real application, you would send this to your payment gateway
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Thank you for your donation! You will be redirected to complete the payment.");
      // In a real app, you would redirect to a payment page or process the payment here
    } catch (error) {
      toast.error("There was an error processing your donation. Please try again.");
      console.error("Donation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Support Our Mission</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Your contribution can make a significant difference in someone's life.
          </p>
        </div>
      </div>

      {/* Donation Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Donation Form */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-center">Choose Donation Amount</h2>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                {predefinedAmounts.map((amount) => (
                  <Button
                    key={amount.value}
                    variant={donationAmount === amount.value ? "default" : "outline"}
                    className={donationAmount === amount.value ? "bg-enf-green hover:bg-enf-dark-green" : "border-enf-green text-enf-green hover:bg-enf-green/10"}
                    onClick={() => handleAmountClick(amount.value)}
                  >
                    {currency} {amount.label}
                  </Button>
                ))}
              </div>

              <div className="mb-6">
                <Label htmlFor="customAmount">Custom Amount</Label>
                <div className="flex items-center mt-2">
                  <div className="flex-shrink-0 h-10 flex items-center justify-center px-3 border border-r-0 rounded-l-md bg-gray-50 dark:bg-gray-700 text-gray-500">
                    {currency}
                  </div>
                  <Input
                    id="customAmount"
                    type="number"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    className="rounded-l-none"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Online Payment</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currency">Select Currency:</Label>
                  <Select
                    value={currency}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Your Name:</Label>
                  <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Your Email:</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-enf-green hover:bg-enf-dark-green"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Donate Now"}
                </Button>
              </form>
            </div>
          </div>

          {/* Other Payment Methods and Impact */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Ways to Donate</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We appreciate your generosity. Choose a method below to make your donation.
              </p>

              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-enf-green dark:text-enf-light-green" />
                      <CardTitle className="text-lg">Bank Transfer</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <p><span className="font-medium">Bank Name:</span> ABC Bank</p>
                      <p><span className="font-medium">Account Number:</span> 123456789</p>
                      <p><span className="font-medium">Branch:</span> Nairobi</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-enf-green dark:text-enf-light-green" />
                      <CardTitle className="text-lg">Mobile Money</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                      <p><span className="font-medium">MPESA Paybill:</span> 987654</p>
                      <p><span className="font-medium">Account Name:</span> Esther Nyasuba Foundation</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Your Impact</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Every donation helps us provide shelter, education, and essential support to those in need.
              </p>
              <Button 
                variant="outline" 
                className="border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green dark:hover:bg-enf-light-green/10"
                onClick={() => window.location.href = '/programs'}
              >
                See Our Programs
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
