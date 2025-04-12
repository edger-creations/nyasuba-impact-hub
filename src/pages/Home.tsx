
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight, HeartHandshake, Lightbulb, TreePine } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[600px] w-full hero-pattern flex items-center justify-center">
        <div className="container mx-auto px-4 z-10 flex justify-center items-center">
          <div className="max-w-3xl text-center" data-aos="fade-up" data-aos-delay="100">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Welcome to the Esther Nyasuba Foundation
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
              Empowering communities, uplifting lives, and creating lasting change.
            </p>
            <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up" data-aos-delay="200">
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
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div 
              className={cn(
                "bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md",
                "transform transition-all hover:-translate-y-1 hover:shadow-lg"
              )}
              data-aos="fade-right"
              data-aos-delay="100"
            >
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <HeartHandshake className="text-enf-green dark:text-enf-light-green h-6 w-6" />
                Our Mission
              </h2>
              <p className="text-lg italic font-medium text-gray-600 dark:text-gray-300 mb-4">
                "Take good care of my people and I will give you wages; Exodus 2:9."
              </p>
            </div>

            <div 
              className={cn(
                "bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md",
                "transform transition-all hover:-translate-y-1 hover:shadow-lg"
              )}
              data-aos="fade-left"
              data-aos-delay="200"
            >
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
          <h2 className="text-3xl font-bold mb-2" data-aos="fade-up">Programs That Make a Difference</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Join us in our mission to build shelter, empower women, educate the youth, and protect the environment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Program Cards */}
            {[
              {
                title: "Shelter for the Poor",
                description: "Building safe homes for vulnerable families in our communities.",
                icon: <svg className="w-8 h-8 text-enf-green dark:text-enf-light-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              },
              {
                title: "Education Financing",
                description: "Providing educational opportunities to underprivileged children.",
                icon: <svg className="w-8 h-8 text-enf-green dark:text-enf-light-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
              },
              {
                title: "Tree Planting",
                description: "Contributing to environmental sustainability through reforestation.",
                icon: <TreePine className="w-8 h-8 text-enf-green dark:text-enf-light-green" />
              }
            ].map((program, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                data-aos="flip-up"
                data-aos-delay={100 * index}
              >
                <div className="flex justify-center mb-4">
                  {program.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{program.description}</p>
              </div>
            ))}
          </div>
          
          <Link to="/programs" data-aos="zoom-in" data-aos-delay="300">
            <Button variant="outline" className="flex items-center gap-2 border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green dark:hover:bg-enf-light-green/10">
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
