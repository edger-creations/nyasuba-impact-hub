
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, HeartHandshake, Lightbulb, TreePine, HomeIcon, BookOpen, UsersIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const programs = [
    {
      title: "Shelter for the Poor",
      description: "Providing safe homes for families in need.",
      icon: <HomeIcon className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
    },
    {
      title: "Education Financing",
      description: "Funding education for underprivileged students.",
      icon: <BookOpen className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
    },
    {
      title: "Tree Planting",
      description: "Promoting environmental sustainability.",
      icon: <TreePine className="h-8 w-8 text-enf-green dark:text-enf-light-green" />,
    },
  ];

  return (
    <Layout>
      {/* Hero Section - Centered and simplified */}
      <section className="relative min-h-[600px] w-full hero-pattern flex items-center justify-center">
        <div className="container px-4 mx-auto z-10 py-16 md:py-24 flex justify-center">
          <div className="max-w-3xl text-center animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Welcome to the Esther Nyasuba Foundation
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Empowering communities, uplifting lives, and creating lasting change.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isAuthenticated ? (
                <Button 
                  onClick={() => navigate('/programs')}
                  className="bg-enf-green text-white hover:bg-enf-dark-green"
                >
                  Explore Our Programs
                </Button>
              ) : (
                <>
                  <Link to="/volunteer">
                    <Button className="bg-enf-green text-white hover:bg-enf-dark-green">
                      Join Our Membership
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green dark:hover:bg-enf-light-green/10">
                      Login Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className={cn(
              "bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md",
              "transform transition-all hover:-translate-y-1 hover:shadow-lg"
            )}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HeartHandshake className="text-enf-green dark:text-enf-light-green h-6 w-6" />
                Our Mission
              </h2>
              <p className="text-lg italic font-medium text-gray-600 dark:text-gray-300 mb-4">
                Take good care of my people and I will give you wages; Exodus 2:9
              </p>
            </div>

            <div className={cn(
              "bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md",
              "transform transition-all hover:-translate-y-1 hover:shadow-lg"
            )}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="text-enf-green dark:text-enf-light-green h-6 w-6" />
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                A community that empowers, loves, and takes care of the vulnerable, single mothers, the elderly, youths, and children.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Key Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {programs.map((program, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  {program.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{program.description}</p>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={() => navigate('/programs')}
            variant="outline" 
            className="flex items-center gap-2 border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green dark:hover:bg-enf-light-green/10"
          >
            View All Programs
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Volunteer or donate today to help transform lives and build stronger communities.
          </p>
          <Button 
            onClick={() => navigate('/volunteer')}
            className="bg-enf-green text-white hover:bg-enf-dark-green"
          >
            Get Involved
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
