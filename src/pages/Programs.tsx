
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Programs = () => {
  const programs = [
    {
      id: "shelter",
      title: "Shelter for the Poor",
      description: "We build safe homes for vulnerable families, ensuring they have a secure place to thrive.",
      action: "Get Involved",
      link: "/volunteer",
      image: "/placeholder.svg",
    },
    {
      id: "education",
      title: "Education Assistance",
      description: "Providing scholarships and school supplies to underprivileged children for a brighter future.",
      action: "Sponsor a Child",
      link: "/donate",
      image: "/placeholder.svg",
    },
    {
      id: "tree-planting",
      title: "Tree Planting",
      description: "Promoting environmental sustainability through community-driven tree planting events.",
      action: "Join the Initiative",
      link: "/volunteer",
      image: "/placeholder.svg",
    },
    {
      id: "women-empowerment",
      title: "Women Empowerment (Inua Miji)",
      description: "We empower women through training, resources, and micro-financing to uplift communities.",
      action: "Support Women",
      link: "/donate",
      image: "/placeholder.svg",
    },
    {
      id: "food-cultivation",
      title: "Food Cultivation",
      description: "Creating sustainable food sources by cultivating community gardens and farms.",
      action: "Contribute Now",
      link: "/donate",
      image: "/placeholder.svg",
    },
    {
      id: "mobility",
      title: "Mobility for Disabled",
      description: "Financing medical treatment and providing mobility equipment for people with disabilities.",
      action: "Donate Equipment",
      link: "/donate",
      image: "/placeholder.svg",
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-enf-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Empowering communities through diverse initiatives that create lasting impact.
          </p>
        </div>
      </div>

      {/* Programs */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {programs.map((program) => (
            <div 
              key={program.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-48 flex items-center justify-center">
                <img 
                  src={program.image} 
                  alt={program.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-3">{program.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {program.description}
                </p>
                <Link to={program.link}>
                  <Button className="bg-enf-green hover:bg-enf-dark-green">
                    {program.action}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Transform Lives with Us</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            Your support helps us expand and touch more lives. Every contribution counts.
          </p>
          <Link to="/donate">
            <Button className="bg-enf-light-brown hover:bg-enf-brown text-white">
              Donate Now
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Programs;
