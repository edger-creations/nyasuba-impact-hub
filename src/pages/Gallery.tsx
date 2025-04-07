
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, 
} from "@/components/ui/dialog";
import { TreePine, Users, ShieldCheck, Home, Hammer, BookOpen } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    title: string;
    description: string;
  } | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: "Volunteering In Schools",
      description: "Sometimes, it only requires minutes of our time to leave remarkable smiles in the face of humanity. Madam Esther Volunteered to help students with Creative Arts at a local school in Kenya.",
      image: "/placeholder.svg",
      category: "education",
    },
    {
      id: 2,
      title: "Shelter For The Homeless",
      description: "During floods in Kenya, 2024, most people lost their homes. We could not do enough but with the little we had, we built some few shelters for those in need. I believe if we all join hands in support of such initiatives, we will all make a big change for humanity.",
      image: "/placeholder.svg",
      category: "shelter",
    },
    {
      id: 3,
      title: "Women & Community Empowerment",
      description: "What if we teach them how to catch fish? For this reason, you have an opportunity to volunteer or even support ENF in empowering and educating the women and community at large on how to go about their livelihood.",
      image: "/placeholder.svg",
      category: "empowerment",
    },
    {
      id: 4,
      title: "Relief Food To The Needy",
      description: "There are some of us who have hardship having all or even all meals a day. Your relief food donations give them strength and hope of living.",
      image: "/placeholder.svg",
      category: "food",
    },
    {
      id: 5,
      title: "Mobility Assistance To Disabled",
      description: "It is our happiness to experience happiness with all humanity, including the disabled. We should always make them part of us!",
      image: "/placeholder.svg",
      category: "mobility",
    },
    {
      id: 6,
      title: "Tree Planting",
      description: "Our tree planting initiatives help combat climate change while creating sustainable green spaces for future generations.",
      image: "/placeholder.svg",
      category: "environment",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery of Impact</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Capturing moments that define our journey and community transformation.
          </p>
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8">Our Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedImage({
                src: item.image,
                title: item.title,
                description: item.description,
              })}
            >
              <div className="h-48 bg-gray-200 dark:bg-gray-700">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Video Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Video Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center p-4">
                  <TreePine className="w-10 h-10 text-enf-green dark:text-enf-light-green mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Video placeholder</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Tree Planting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We plant trees to save lives and save the future, it is a gospel that is underrated but saves humanity a lot. Plant a tree to save lives.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <div className="text-center p-4">
                  <ShieldCheck className="w-10 h-10 text-enf-green dark:text-enf-light-green mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Video placeholder</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">Environment Conservation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our tree planting initiatives help combat climate change while creating sustainable green spaces for future generations.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Be Part of the Change</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join us in making a difference. Volunteer or donate to support our cause.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/volunteer">
              <Button className="bg-enf-green hover:bg-enf-dark-green text-white">
                Volunteer
              </Button>
            </Link>
            <Link to="/donate">
              <Button variant="outline" className="border-enf-green text-enf-green hover:bg-enf-green/10 dark:border-enf-light-green dark:text-enf-light-green dark:hover:bg-enf-light-green/10">
                Donate
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.title}</DialogTitle>
            <DialogDescription>{selectedImage?.description}</DialogDescription>
          </DialogHeader>
          {selectedImage && (
            <div className="mt-4">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.title} 
                className="w-full rounded-md"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
