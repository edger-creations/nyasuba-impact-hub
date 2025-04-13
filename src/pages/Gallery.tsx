
import { useState, useEffect } from "react";
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
import { TreePine, Users, ShieldCheck, Home, Hammer, BookOpen, Image, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the gallery item interface to match the admin page
interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  description: string;
  featured: boolean;
  category?: string;
}

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch gallery items from localStorage on component mount
  useEffect(() => {
    const storedItems = localStorage.getItem('galleryItems');
    
    if (storedItems) {
      setGalleryItems(JSON.parse(storedItems));
    } else {
      // Fallback to default items if nothing in localStorage
      setGalleryItems([
        {
          id: "1",
          type: "image",
          src: "/placeholder.svg",
          alt: "Volunteering In Schools",
          description: "Sometimes, it only requires minutes of our time to leave remarkable smiles in the face of humanity. Madam Esther Volunteered to help students with Creative Arts at a local school in Kenya.",
          featured: false,
          category: "education",
        },
        {
          id: "2",
          type: "image",
          src: "/placeholder.svg",
          alt: "Shelter For The Homeless",
          description: "During floods in Kenya, 2024, most people lost their homes. We could not do enough but with the little we had, we built some few shelters for those in need. I believe if we all join hands in support of such initiatives, we will all make a big change for humanity.",
          featured: false,
          category: "shelter",
        },
        {
          id: "3",
          type: "image",
          src: "/placeholder.svg",
          alt: "Women & Community Empowerment",
          description: "What if we teach them how to catch fish? For this reason, you have an opportunity to volunteer or even support ENF in empowering and educating the women and community at large on how to go about their livelihood.",
          featured: false,
          category: "empowerment",
        },
        {
          id: "4",
          type: "image",
          src: "/placeholder.svg",
          alt: "Relief Food To The Needy",
          description: "There are some of us who have hardship having all or even all meals a day. Your relief food donations give them strength and hope of living.",
          featured: false,
          category: "food",
        },
        {
          id: "5",
          type: "image",
          src: "/placeholder.svg",
          alt: "Mobility Assistance To Disabled",
          description: "It is our happiness to experience happiness with all humanity, including the disabled. We should always make them part of us!",
          featured: false,
          category: "mobility",
        },
        {
          id: "6",
          type: "image",
          src: "/placeholder.svg",
          alt: "Tree Planting",
          description: "Our tree planting initiatives help combat climate change while creating sustainable green spaces for future generations.",
          featured: false,
          category: "environment",
        },
        {
          id: "7",
          type: "video",
          src: "/placeholder.svg",
          alt: "Tree Planting",
          description: "We plant trees to save lives and save the future, it is a gospel that is underrated but saves humanity a lot. Plant a tree to save lives.",
          featured: false,
          category: "environment",
        },
        {
          id: "8",
          type: "video",
          src: "/placeholder.svg",
          alt: "Environment Conservation",
          description: "Our tree planting initiatives help combat climate change while creating sustainable green spaces for future generations.",
          featured: false,
          category: "environment",
        },
      ]);
    }
  }, []);

  // Get featured item for the hero section
  const featuredItem = galleryItems.find(item => item.featured) || galleryItems[0];
  
  // Filter items based on active tab
  const filteredItems = activeTab === "all" 
    ? galleryItems
    : activeTab === "images" 
      ? galleryItems.filter(item => item.type === "image")
      : galleryItems.filter(item => item.type === "video");

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-enf-green text-white py-16" data-aos="fade-down">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Gallery of Impact</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Capturing moments that define our journey and community transformation.
          </p>
          {featuredItem && (
            <div className="mt-8 max-w-4xl mx-auto bg-white/10 p-4 rounded-lg">
              <p className="text-sm uppercase tracking-wide mb-2">Featured</p>
              <h2 className="text-xl font-semibold mb-2">{featuredItem.alt}</h2>
              <p className="text-sm mb-4">{featuredItem.description}</p>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/20"
                onClick={() => setSelectedItem(featuredItem)}
              >
                View Featured {featuredItem.type === "image" ? "Image" : "Video"}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" data-aos="fade-up">Our Gallery</h2>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="images">Images</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedItem(item)}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 relative">
                  {item.type === "image" ? (
                    <img 
                      src={item.src} 
                      alt={item.alt} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="h-12 w-12 text-white/75" />
                      </div>
                      <img 
                        src={item.src} 
                        alt={item.alt} 
                        className="w-full h-full object-cover opacity-80"
                      />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      {item.type}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.alt}</h3>
                  <p className="text-gray-600 dark:text-gray-300 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center" data-aos="fade-up">
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

      {/* Item Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedItem?.alt}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="mt-4">
              {selectedItem.type === "image" ? (
                <img 
                  src={selectedItem.src} 
                  alt={selectedItem.alt} 
                  className="w-full rounded-md"
                />
              ) : (
                <video
                  src={selectedItem.src}
                  controls
                  className="w-full rounded-md"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
