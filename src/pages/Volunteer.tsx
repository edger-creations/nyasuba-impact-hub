
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  TreePine, 
  BookOpen, 
  Home, 
  Users, 
  Award, 
  Network, 
  Briefcase 
} from "lucide-react";

const Volunteer = () => {
  const volunteerOpportunities = [
    {
      icon: <TreePine className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Tree Planting",
      description: "Help us restore the environment by participating in our community tree planting initiatives.",
    },
    {
      icon: <BookOpen className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Education Support",
      description: "Mentor and support needy students to help shape their future through knowledge and skills.",
    },
    {
      icon: <Home className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Shelter Building",
      description: "Join our team in building safe and comfortable homes for underprivileged families.",
    },
  ];

  const benefits = [
    {
      title: "Make a tangible impact in the lives of others.",
    },
    {
      title: "Connect with like-minded individuals and communities.",
    },
    {
      title: "Gain new skills and meaningful experiences.",
    },
    {
      title: "Be part of a cause that drives positive change.",
    },
    {
      title: "Expand your professional network and opportunities.",
    },
    {
      title: "Strengthen your leadership and teamwork skills.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-16">
        <div className="container mx-auto px-4 text-center" data-aos="fade-down">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Volunteer with Us</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Join the Esther Nyasuba Foundation in creating positive change. Your time, skills, and dedication can uplift communities and transform lives. Explore the various volunteering opportunities and become part of something bigger.
          </p>
          <p className="text-lg max-w-2xl mx-auto mt-4">
            Whether you can give an hour or a day, your contribution matters. Together, we can build a brighter future.
          </p>
        </div>
      </div>

      {/* Volunteer Opportunities */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center" data-aos="fade-up">Ways to Volunteer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {volunteerOpportunities.map((opportunity, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                data-aos="flip-left"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center mb-4">
                  {opportunity.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{opportunity.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {opportunity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center" data-aos="fade-up">Why Volunteer?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3"
                data-aos="fade-right"
                data-aos-delay={index * 50}
              >
                <div className="mt-1 text-enf-green dark:text-enf-light-green">
                  <svg
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
                <p className="text-gray-700 dark:text-gray-300">{benefit.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white dark:bg-gray-900 text-center">
        <div className="container mx-auto px-4" data-aos="zoom-in">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Involved?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Fill out our volunteer application form and we'll reach out with next steps.
          </p>
          <Link to="/volunteer/apply">
            <Button className="bg-enf-green hover:bg-enf-dark-green text-white">
              Apply Now
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Volunteer;
