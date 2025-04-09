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
import { Building, Phone, CreditCard, DollarSign } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const donationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  amount: z.string().min(1, { message: "Please enter a donation amount." }),
  currency: z.string(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [currency, setCurrency] = useState("KSH");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      currency: "KSH",
    },
  });

  const predefinedAmounts = [
    { value: "1000", label: "1,000" },
    { value: "5000", label: "5,000" },
    { value: "10000", label: "10,000" },
  ];

  const handleAmountClick = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount("");
    form.setValue("amount", amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setDonationAmount("");
    form.setValue("amount", e.target.value);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrency(value);
    form.setValue("currency", value);
  };

  const processStripePayment = async (formData: DonationFormValues) => {
    try {
      const stripePublishableKey = "pk_test_REPLACE_WITH_YOUR_PUBLISHABLE_KEY";
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Payment initiated! You will be redirected to complete the payment.");
      console.log("Stripe payment processing with:", {
        key: stripePublishableKey,
        amount: formData.amount,
        currency: formData.currency,
        name: formData.name,
        email: formData.email
      });
      
    } catch (error) {
      toast.error("There was an error processing your card payment. Please try again.");
      console.error("Stripe error:", error);
    }
  };

  const processPayPalPayment = async (formData: DonationFormValues) => {
    try {
      const paypalClientId = "REPLACE_WITH_YOUR_PAYPAL_CLIENT_ID";
      
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("PayPal payment initiated! You will be redirected to complete the payment.");
      console.log("PayPal payment processing with:", {
        clientId: paypalClientId,
        amount: formData.amount,
        currency: formData.currency,
        name: formData.name,
        email: formData.email
      });
      
    } catch (error) {
      toast.error("There was an error processing your PayPal payment. Please try again.");
      console.error("PayPal error:", error);
    }
  };

  const onSubmit = async (formData: DonationFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (paymentMethod === "card") {
        await processStripePayment(formData);
      } else if (paymentMethod === "paypal") {
        await processPayPalPayment(formData);
      }
    } catch (error) {
      toast.error("There was an error processing your donation. Please try again.");
      console.error("Donation error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="bg-enf-green text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Support Our Mission</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Your contribution can make a significant difference in someone's life.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
              <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-2 mb-6 w-full">
                  <TabsTrigger value="card" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Pay By Card
                  </TabsTrigger>
                  <TabsTrigger value="paypal" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Pay With PayPal
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <h2 className="text-xl font-bold mb-6">Card Payment</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Currency:</FormLabel>
                              <Select 
                                value={currency} 
                                onValueChange={(value) => {
                                  handleCurrencyChange(value);
                                  field.onChange(value);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name:</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Email:</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-enf-green hover:bg-enf-dark-green"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Donate By Card"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="paypal">
                  <h2 className="text-xl font-bold mb-6">PayPal Payment</h2>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="currency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Select Currency:</FormLabel>
                              <Select 
                                value={currency} 
                                onValueChange={(value) => {
                                  handleCurrencyChange(value);
                                  field.onChange(value);
                                }}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="KSH">Kenyan Shilling (KSH)</SelectItem>
                                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                                  <SelectItem value="EUR">Euro (EUR)</SelectItem>
                                  <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Name:</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Email:</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Processing..." : "Donate With PayPal"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </div>
          </div>

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
