
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Program } from "@/types/program";
import { fetchPrograms } from "@/services/programService";
import { Skeleton } from "@/components/ui/skeleton"; 

const Programs = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrograms = async () => {
      try {
        setLoading(true);
        const data = await fetchPrograms();
        setPrograms(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load programs:", err);
        setError("Failed to load programs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadPrograms();
  }, []);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-enf-green text-white py-16">
        <div className="container mx-auto px-4 text-center" data-aos="fade-down">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Empowering communities through diverse initiatives that create lasting impact.
          </p>
        </div>
      </div>

      {/* Programs */}
      <div className="container mx-auto px-4 py-16">
        {loading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-8 w-2/3 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-6" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          // Programs grid
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {programs.map((program, index) => (
              <div 
                key={program.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={100 * (index % 3)}
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
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center" data-aos="fade-up">
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
