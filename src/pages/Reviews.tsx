
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { QuoteIcon } from "lucide-react";

const Reviews = () => {
  const [newReview, setNewReview] = useState({
    name: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Chares Brand",
      content: "The Esther Nyasuba Foundation embodies compassion and community empowerment, fostering growth through impactful programs. Its dedication to education, transparency, and volunteerism creates meaningful change, inspiring collective progress and hope.",
      avatar: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Edger Omondi",
      content: "I have heard a lot about Esther Nyasuba Foundation. They are really doing a lot to save humanity.",
      avatar: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Susan Njeri",
      content: "The women empowerment program 'Inua Miji' transformed my business. I gained new skills and confidence to succeed as an entrepreneur.",
      avatar: "/placeholder.svg",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
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
      
      toast.success("Thank you for sharing your experience!");
      setNewReview({ name: "", content: "" });
    } catch (error) {
      toast.error("There was an error submitting your review. Please try again.");
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-12">
        <div className="container mx-auto px-4 text-center" data-aos="fade-down">
          <h1 className="text-3xl font-bold mb-4">What People Say About Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Your feedback and experiences drive our mission forward. Here are stories from those who have partnered with or benefited from the Esther Nyasuba Foundation.
          </p>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 relative"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <QuoteIcon className="absolute top-4 right-4 h-6 w-6 text-gray-200 dark:text-gray-700" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold">{testimonial.name}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <div className="mt-16 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-2xl font-bold mb-6">Share Your Experience</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Have you volunteered or benefited from our programs? We'd love to hear from you!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Write your review here...</Label>
              <Textarea
                id="content"
                name="content"
                value={newReview.content}
                onChange={handleInputChange}
                rows={4}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="bg-enf-green hover:bg-enf-dark-green"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Reviews;
