
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, you would send this data to your backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("There was an error sending your message. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5 text-enf-green dark:text-enf-light-green" />,
      title: "Email",
      details: "info@esthernyasubafoundation.org",
      action: "mailto:info@esthernyasubafoundation.org",
    },
    {
      icon: <Phone className="h-5 w-5 text-enf-green dark:text-enf-light-green" />,
      title: "Phone",
      details: "+254 700 000 000",
      action: "tel:+254700000000",
    },
    {
      icon: <MapPin className="h-5 w-5 text-enf-green dark:text-enf-light-green" />,
      title: "Location",
      details: "Nairobi, Kenya",
      action: "https://maps.google.com/?q=Nairobi,Kenya",
    },
    {
      icon: <Clock className="h-5 w-5 text-enf-green dark:text-enf-light-green" />,
      title: "Hours",
      details: "Mon-Fri: 9AM - 5PM",
      action: "#",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-12" data-aos="fade-down">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Have questions or want to get involved? Reach out to us today.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6" data-aos="fade-right" data-aos-delay="100">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
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
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-enf-green hover:bg-enf-dark-green"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8" data-aos="fade-left" data-aos-delay="200">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We'd love to hear from you. Use the contact information below to reach out to us directly.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <a
                    key={index}
                    href={item.action}
                    target={item.action.startsWith("http") ? "_blank" : "_self"}
                    rel={item.action.startsWith("http") ? "noopener noreferrer" : ""}
                    className="flex items-start gap-3 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <div className="mt-1">{item.icon}</div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{item.details}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div data-aos="fade-up" data-aos-delay="300">
              <h2 className="text-2xl font-bold mb-6">Find Us</h2>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Map placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
