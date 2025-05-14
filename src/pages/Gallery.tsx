
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
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGalleryItems, GalleryItem } from "@/services/galleryService";
import { Skeleton } from "@/components/ui/skeleton";

const Gallery = () => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery items from database
  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true);
        const data = await fetchGalleryItems();
        setGalleryItems(data);
        setError(null);
      } catch (err) {
        console.error("Failed to load gallery items:", err);
        setError("Failed to load gallery items. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadGalleryItems();
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
          
          {loading ? (
            <Card className="mt-8 max-w-4xl mx-auto bg-white/10 overflow-hidden">
              <CardHeader className="pb-2">
                <p className="text-sm uppercase tracking-wide">Featured</p>
                <Skeleton className="h-8 w-1/3 bg-white/20" />
              </CardHeader>
              <CardContent className="pb-2">
                <div className="max-h-[300px] overflow-hidden rounded-md">
                  <Skeleton className="h-[300px] w-full bg-white/20" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-4 w-full bg-white/20 mb-2" />
                  <Skeleton className="h-4 w-2/3 bg-white/20" />
                </div>
              </CardContent>
            </Card>
          ) : featuredItem ? (
            <Card className="mt-8 max-w-4xl mx-auto bg-white/10 overflow-hidden">
              <CardHeader className="pb-2">
                <p className="text-sm uppercase tracking-wide">Featured</p>
                <CardTitle className="text-xl">{featuredItem.alt}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="max-h-[300px] overflow-hidden rounded-md">
                  {featuredItem.type === "image" ? (
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <img 
                        src={featuredItem.src} 
                        alt={featuredItem.alt} 
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                  ) : (
                    <AspectRatio ratio={16 / 9} className="bg-muted">
                      <div className="w-full h-full relative">
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <Video className="h-12 w-12 text-white/75" />
                        </div>
                        <img 
                          src={featuredItem.src} 
                          alt={featuredItem.alt} 
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    </AspectRatio>
                  )}
                </div>
                <p className="text-sm mt-4">{featuredItem.description}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <Button 
                  variant="outline" 
                  className="border-white text-white hover:bg-white/20"
                  onClick={() => setSelectedItem(featuredItem)}
                >
                  View Featured {featuredItem.type === "image" ? "Image" : "Video"}
                </Button>
              </CardFooter>
            </Card>
          ) : null}
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
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
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
        )}

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
                <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
                  <img 
                    src={selectedItem.src} 
                    alt={selectedItem.alt} 
                    className="w-full h-full object-contain"
                  />
                </AspectRatio>
              ) : (
                <AspectRatio ratio={16 / 9} className="bg-muted overflow-hidden rounded-md">
                  <video
                    src={selectedItem.src}
                    controls
                    className="w-full h-full object-contain"
                  />
                </AspectRatio>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Gallery;
