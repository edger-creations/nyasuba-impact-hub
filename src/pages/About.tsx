
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HeartHandshake, Lightbulb, Shield, Users, Gem, BarChart } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <HeartHandshake className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Compassion",
      description: "We serve with kindness, love, and empathy for all.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Transparency",
      description: "We believe in openness and accountability in all our initiatives.",
    },
    {
      icon: <Users className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Community",
      description: "Building strong, resilient communities through collaboration and unity.",
    },
    {
      icon: <Gem className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
      title: "Empowerment",
      description: "Creating opportunities for growth, self-reliance, and leadership.",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-16" data-aos="fade-down">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
            About the Esther Nyasuba Foundation
          </h1>
          <p className="text-lg max-w-3xl mx-auto text-center">
            The Esther Nyasuba Foundation is dedicated to supporting the underprivileged in our society. Through initiatives like building shelters, financing education, tree planting, and empowering women, we aim to create lasting change and uplift communities.
          </p>
          <p className="text-lg max-w-3xl mx-auto mt-4 text-center">
            Our journey is driven by compassion and guided by faith, ensuring that we make a difference one step at a time. Together, we can nurture hope and empower lives.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md" data-aos="fade-right" data-aos-delay="100">
              <div className="flex items-center gap-3 mb-4">
                <HeartHandshake className="h-8 w-8 text-enf-green dark:text-enf-light-green" />
                <h2 className="text-2xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg italic font-medium text-gray-700 dark:text-gray-300">
                "Take good care of my people and I will give you wages; Exodus 2:9"
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-lg shadow-md" data-aos="fade-left" data-aos-delay="200">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="h-8 w-8 text-enf-green dark:text-enf-light-green" />
                <h2 className="text-2xl font-bold">Our Vision</h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                A community that empowers, loves, and takes care of the vulnerable, single mothers, the elderly, youths, and children.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center" data-aos="fade-up">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-white dark:bg-gray-900 text-center" data-aos="fade-up">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">Be a Part of Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join us in making a meaningful impact. Volunteer, donate, or spread the word.
          </p>
          <Link to="/volunteer">
            <Button className="bg-enf-green hover:bg-enf-dark-green text-white">
              Get Involved
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default About;
