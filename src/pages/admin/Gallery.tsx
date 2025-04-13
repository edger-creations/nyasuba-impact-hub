
import { useState, useRef } from "react";
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
  Image as ImageIcon,
  Video
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

// Define a more comprehensive gallery item type to include both images and videos
interface GalleryItem {
  id: string;
  type: "image" | "video";
  src: string;
  alt: string;
  description: string;
  featured: boolean;
  category?: string;
}

// Mock gallery data - in a real app, these would come from an API
const initialGalleryItems: GalleryItem[] = [
  {
    id: "1",
    type: "image",
    src: "/placeholder.svg",
    alt: "Tree planting event at Nairobi Park",
    description: "Volunteers planting trees in Nairobi National Park",
    featured: true,
    category: "environment",
  },
  {
    id: "2",
    type: "image",
    src: "/placeholder.svg",
    alt: "Education support program",
    description: "Distributing school supplies to local children",
    featured: false,
    category: "education",
  },
  {
    id: "3",
    type: "image",
    src: "/placeholder.svg",
    alt: "Building shelters",
    description: "Building a new home for a family in need",
    featured: false,
    category: "shelter",
  },
  {
    id: "4",
    type: "image",
    src: "/placeholder.svg",
    alt: "Women empowerment",
    description: "Women learning craft skills as part of the Inua Miji program",
    featured: false,
    category: "empowerment",
  },
  {
    id: "5",
    type: "image",
    src: "/placeholder.svg",
    alt: "Food cultivation program",
    description: "Community garden initiative yielding fresh vegetables",
    featured: false,
    category: "food",
  },
  {
    id: "6",
    type: "image",
    src: "/placeholder.svg",
    alt: "Mobility for the disabled",
    description: "Providing mobility equipment to people with disabilities",
    featured: false,
    category: "mobility",
  },
  {
    id: "7",
    type: "video",
    src: "/placeholder.svg", // would be a video URL in a real app
    alt: "Tree Planting",
    description: "We plant trees to save lives and save the future, it is a gospel that is underrated but saves humanity a lot. Plant a tree to save lives.",
    featured: false,
    category: "environment",
  },
  {
    id: "8",
    type: "video",
    src: "/placeholder.svg", // would be a video URL in a real app
    alt: "Environment Conservation",
    description: "Our tree planting initiatives help combat climate change while creating sustainable green spaces for future generations.",
    featured: false,
    category: "environment",
  },
];

// Categories for gallery items
const categories = [
  { value: "environment", label: "Environment" },
  { value: "education", label: "Education" },
  { value: "shelter", label: "Shelter" },
  { value: "empowerment", label: "Empowerment" },
  { value: "food", label: "Food" },
  { value: "mobility", label: "Mobility" },
  { value: "other", label: "Other" },
];

const GalleryAdmin = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(initialGalleryItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [activeTab, setActiveTab] = useState<string>("images");
  const [newItem, setNewItem] = useState<Omit<GalleryItem, "id" | "featured">>({
    type: "image",
    src: "",
    alt: "",
    description: "",
    category: "environment",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL for the file
      const previewUrl = URL.createObjectURL(file);
      
      // Automatically determine type based on file MIME type
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      
      setNewItem({
        ...newItem,
        src: previewUrl,
        type: fileType
      });
      
      toast.success(`${fileType.charAt(0).toUpperCase() + fileType.slice(1)} uploaded for preview`);
    }
  };
  
  const handleClickUpload = () => {
    // Trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleAddItem = () => {
    // Validate the form
    if (!newItem.src) {
      toast.error(`Please upload an ${newItem.type}`);
      return;
    }
    
    if (!newItem.alt || !newItem.description) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // In a real app, you would upload the file to a server
    const item: GalleryItem = {
      id: Date.now().toString(),
      ...newItem,
      featured: false,
    };
    
    // Store the updated gallery items in local storage to sync with user pages
    const updatedItems = [...galleryItems, item];
    setGalleryItems(updatedItems);
    localStorage.setItem('galleryItems', JSON.stringify(updatedItems));
    
    // Reset form and close dialog
    setNewItem({ 
      type: "image", 
      src: "", 
      alt: "", 
      description: "", 
      category: "environment" 
    });
    setIsAddDialogOpen(false);
    toast.success(`${item.type.charAt(0).toUpperCase() + item.type.slice(1)} added successfully!`);
    
    // Offer to preview the user-facing gallery
    toast("Would you like to see how it looks on the user page?", {
      action: {
        label: "View Gallery",
        onClick: () => navigate("/gallery")
      },
    });
  };
  
  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      const updatedItems = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedItems);
      localStorage.setItem('galleryItems', JSON.stringify(updatedItems));
      toast.success("Item deleted successfully!");
    }
  };
  
  const handleSetFeatured = (id: string) => {
    const updatedItems = galleryItems.map(item => ({
      ...item,
      featured: item.id === id,
    }));
    
    setGalleryItems(updatedItems);
    localStorage.setItem('galleryItems', JSON.stringify(updatedItems));
    toast.success("Featured item updated!");
  };
  
  const handleMoveItem = (id: string, direction: "up" | "down") => {
    const index = galleryItems.findIndex(item => item.id === id);
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === galleryItems.length - 1)
    ) {
      return;
    }
    
    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newGalleryItems = [...galleryItems];
    [newGalleryItems[index], newGalleryItems[newIndex]] = [newGalleryItems[newIndex], newGalleryItems[index]];
    
    setGalleryItems(newGalleryItems);
    localStorage.setItem('galleryItems', JSON.stringify(newGalleryItems));
  };
  
  const handleViewItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  };

  // Filter items based on active tab
  const filteredItems = activeTab === "all" 
    ? galleryItems 
    : activeTab === "images" 
      ? galleryItems.filter(item => item.type === "image")
      : galleryItems.filter(item => item.type === "video");
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gallery Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-enf-green hover:bg-enf-dark-green">
                <Plus className="mr-2 h-4 w-4" />
                Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Gallery Item</DialogTitle>
                <DialogDescription>
                  Upload a new image or video to the gallery.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="itemType">Item Type</Label>
                  <Select
                    defaultValue={newItem.type}
                    onValueChange={(value: "image" | "video") => 
                      setNewItem({ ...newItem, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={newItem.category}
                    onValueChange={(value) => 
                      setNewItem({ ...newItem, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="file">{newItem.type === "image" ? "Image" : "Video"}</Label>
                  <div 
                    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-enf-green"
                    onClick={handleClickUpload}
                  >
                    {newItem.src ? (
                      <div className="w-full relative">
                        {newItem.type === "image" ? (
                          <img 
                            src={newItem.src} 
                            alt="Preview" 
                            className="w-full h-48 object-cover rounded-md"
                          />
                        ) : (
                          <video 
                            src={newItem.src}
                            controls
                            className="w-full h-48 object-cover rounded-md"
                          />
                        )}
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewItem({...newItem, src: ""});
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {newItem.type === "image" ? 
                            "PNG, JPG or WEBP (max. 10MB)" : 
                            "MP4, WEBM or OGG (max. 50MB)"}
                        </p>
                      </>
                    )}
                    
                    <Input
                      id="file"
                      type="file"
                      className="hidden"
                      accept={newItem.type === "image" ? "image/*" : "video/*"}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="alt">Title</Label>
                  <Input
                    id="alt"
                    value={newItem.alt}
                    onChange={(e) => setNewItem({ ...newItem, alt: e.target.value })}
                    placeholder="Brief title or name for the item"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                    placeholder="Detailed description of the item"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddItem}
                  disabled={!newItem.src || !newItem.alt || !newItem.description}
                  className="bg-enf-green hover:bg-enf-dark-green"
                >
                  Add Item
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs defaultValue="all" className="mb-6" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-muted-foreground">No items found in this category.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className={`overflow-hidden ${item.featured ? 'ring-2 ring-enf-green' : ''}`}>
                <div className="relative aspect-video bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    {item.type === "image" ? (
                      <ImageIcon className="h-10 w-10 text-gray-400" />
                    ) : (
                      <Video className="h-10 w-10 text-gray-400" />
                    )}
                  </div>
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full relative">
                      <video
                        src={item.src}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full bg-black/50 text-white hover:bg-black/70"
                          onClick={() => handleViewItem(item)}
                        >
                          <Eye className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-enf-green">Featured</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium truncate">{item.alt}</p>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                  {item.category && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                      {categories.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0 flex flex-col gap-3">
                  <div className="flex w-full justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewItem(item)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-1"
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveItem(item.id, "up")}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMoveItem(item.id, "down")}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                    {!item.featured && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetFeatured(item.id)}
                        className="text-enf-green hover:text-enf-dark-green"
                      >
                        Set Featured
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* View Item Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="rounded-md overflow-hidden aspect-video bg-muted">
                {selectedItem.type === "image" ? (
                  <img
                    src={selectedItem.src}
                    alt={selectedItem.alt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <video
                    src={selectedItem.src}
                    controls
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              
              <div className="grid gap-4">
                <div>
                  <h3 className="font-medium">Title</h3>
                  <p>{selectedItem.alt}</p>
                </div>
                <div>
                  <h3 className="font-medium">Description</h3>
                  <p>{selectedItem.description}</p>
                </div>
                <div>
                  <h3 className="font-medium">Category</h3>
                  <p>{categories.find(c => c.value === selectedItem.category)?.label || selectedItem.category || "Uncategorized"}</p>
                </div>
                <div>
                  <h3 className="font-medium">Status</h3>
                  <p>{selectedItem.featured ? "Featured Item" : "Regular Item"}</p>
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
const Badge = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
    {children}
  </span>
);

export default GalleryAdmin;
