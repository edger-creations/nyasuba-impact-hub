
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Plus, 
  Upload, 
  Trash, 
  MoveUp, 
  MoveDown,
  Eye,
  Image as ImageIcon 
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Mock gallery images - in a real app, these would come from an API
const initialGalleryImages = [
  {
    id: "1",
    src: "/placeholder.svg",
    alt: "Tree planting event at Nairobi Park",
    description: "Volunteers planting trees in Nairobi National Park",
    featured: true,
  },
  {
    id: "2",
    src: "/placeholder.svg",
    alt: "Education support program",
    description: "Distributing school supplies to local children",
    featured: false,
  },
  {
    id: "3",
    src: "/placeholder.svg",
    alt: "Building shelters",
    description: "Building a new home for a family in need",
    featured: false,
  },
  {
    id: "4",
    src: "/placeholder.svg",
    alt: "Women empowerment",
    description: "Women learning craft skills as part of the Inua Miji program",
    featured: false,
  },
  {
    id: "5",
    src: "/placeholder.svg",
    alt: "Food cultivation program",
    description: "Community garden initiative yielding fresh vegetables",
    featured: false,
  },
  {
    id: "6",
    src: "/placeholder.svg",
    alt: "Mobility for the disabled",
    description: "Providing mobility equipment to people with disabilities",
    featured: false,
  },
];

const GalleryAdmin = () => {
  const [galleryImages, setGalleryImages] = useState(initialGalleryImages);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<(typeof initialGalleryImages)[0] | null>(null);
  const [newImage, setNewImage] = useState({
    src: "",
    alt: "",
    description: "",
  });
  
  const handleAddImage = () => {
    // In a real app, you would upload the file to a server
    const image = {
      id: Date.now().toString(),
      src: newImage.src || "/placeholder.svg", // Use placeholder for demo
      alt: newImage.alt,
      description: newImage.description,
      featured: false,
    };
    
    setGalleryImages([...galleryImages, image]);
    setNewImage({ src: "", alt: "", description: "" });
    setIsAddDialogOpen(false);
    toast.success("Image added successfully!");
  };
  
  const handleDeleteImage = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setGalleryImages(galleryImages.filter(img => img.id !== id));
      toast.success("Image deleted successfully!");
    }
  };
  
  const handleSetFeatured = (id: string) => {
    setGalleryImages(galleryImages.map(img => ({
      ...img,
      featured: img.id === id,
    })));
    toast.success("Featured image updated!");
  };
  
  const handleMoveImage = (id: string, direction: "up" | "down") => {
    const index = galleryImages.findIndex(img => img.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === galleryImages.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newGalleryImages = [...galleryImages];
    [newGalleryImages[index], newGalleryImages[newIndex]] = [newGalleryImages[newIndex], newGalleryImages[index]];
    
    setGalleryImages(newGalleryImages);
  };
  
  const handleViewImage = (image: typeof selectedImage) => {
    setSelectedImage(image);
    setIsViewDialogOpen(true);
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-enf-green hover:bg-enf-dark-green">
                <Plus className="mr-2 h-4 w-4" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Image</DialogTitle>
                <DialogDescription>
                  Upload a new image to the gallery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-enf-green">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <Input
                      id="image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        // In a real app, this would handle the file upload
                        if (e.target.files?.[0]) {
                          setNewImage({
                            ...newImage,
                            src: URL.createObjectURL(e.target.files[0]),
                          });
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alt">Alt Text</Label>
                  <Input
                    id="alt"
                    value={newImage.alt}
                    onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                    placeholder="Brief description of the image"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    placeholder="Detailed description of the image"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddImage}
                  disabled={!newImage.alt || !newImage.description}
                  className="bg-enf-green hover:bg-enf-dark-green"
                >
                  Add Image
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className={`overflow-hidden ${image.featured ? 'ring-2 ring-enf-green' : ''}`}>
              <div className="relative aspect-video bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <ImageIcon className="h-10 w-10 text-gray-400" />
                </div>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover"
                />
                {image.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-enf-green">Featured</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <p className="font-medium truncate">{image.alt}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{image.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewImage(image)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteImage(image.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveImage(image.id, "up")}
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMoveImage(image.id, "down")}
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                  {!image.featured && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetFeatured(image.id)}
                      className="text-enf-green hover:text-enf-dark-green"
                    >
                      Set Featured
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      
      {/* View Image Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          
          {selectedImage && (
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden aspect-video bg-muted">
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Alt Text</h3>
                  <p>{selectedImage.alt}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{selectedImage.description}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p>{selectedImage.featured ? "Featured Image" : "Regular Image"}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

// Add Badge component since it's used in this file
const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default GalleryAdmin;
