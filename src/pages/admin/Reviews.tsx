
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Trash, Eye, Check, X, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

// Mock reviews - in a real app, these would come from an API
const initialReviews = [
  {
    id: "1",
    name: "Chares Brand",
    content: "The Esther Nyasuba Foundation embodies compassion and community empowerment, fostering growth through impactful programs. Its dedication to education, transparency, and volunteerism creates meaningful change, inspiring collective progress and hope.",
    status: "approved",
    date: "2025-03-10",
    avatar: "/placeholder.svg",
  },
  {
    id: "2",
    name: "Edger Omondi",
    content: "I have heard a lot about Esther Nyasuba Foundation. They are really doing a lot to save humanity.",
    status: "approved",
    date: "2025-03-08",
    avatar: "/placeholder.svg",
  },
  {
    id: "3",
    name: "Susan Njeri",
    content: "The women empowerment program 'Inua Miji' transformed my business. I gained new skills and confidence to succeed as an entrepreneur.",
    status: "approved",
    date: "2025-03-05",
    avatar: "/placeholder.svg",
  },
  {
    id: "4",
    name: "Daniel Kimathi",
    content: "The foundation helped my family with shelter when we lost our home in a flood. Forever grateful for their support.",
    status: "pending",
    date: "2025-03-02",
    avatar: "/placeholder.svg",
  },
  {
    id: "5",
    name: "Rose Mwangi",
    content: "I volunteered for the tree planting initiative and it was a wonderful experience. Well organized and impactful.",
    status: "pending",
    date: "2025-02-28",
    avatar: "/placeholder.svg",
  },
];

const ReviewsAdmin = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReview, setSelectedReview] = useState<(typeof initialReviews)[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && review.status === "pending";
    if (activeTab === "approved") return matchesSearch && review.status === "approved";
    if (activeTab === "rejected") return matchesSearch && review.status === "rejected";
    return matchesSearch;
  });

  const pendingReviewsCount = reviews.filter(r => r.status === "pending").length;
  const approvedReviewsCount = reviews.filter(r => r.status === "approved").length;

  const handleViewDetails = (review: typeof selectedReview) => {
    setSelectedReview(review);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setReviews(reviews.map(r => 
      r.id === id ? { ...r, status: newStatus } : r
    ));
    
    const review = reviews.find(r => r.id === id);
    if (review) {
      toast.success(`Review ${newStatus === "approved" ? "approved" : "rejected"}`);
    }
    
    if (selectedReview?.id === id) {
      setSelectedReview({ ...selectedReview, status: newStatus });
    }
  };

  const handleDeleteReview = (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      setReviews(reviews.filter(r => r.id !== id));
      
      if (selectedReview?.id === id) {
        setIsViewDialogOpen(false);
      }
      
      toast.success("Review deleted successfully!");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-muted-foreground mr-2" />
                <div>
                  <p className="text-sm font-medium">Total Reviews</p>
                  <p className="text-2xl font-bold">{reviews.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Approved Reviews</p>
                  <p className="text-2xl font-bold">{approvedReviewsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm font-medium">Pending Reviews</p>
                  <p className="text-2xl font-bold">{pendingReviewsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No reviews found
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell className="font-medium">{review.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{review.content}</TableCell>
                    <TableCell>{review.date}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(review)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {review.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(review.id, "approved")}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(review.id, "rejected")}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReview(review.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Review Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Complete information about this review.
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img
                    src={selectedReview.avatar}
                    alt={selectedReview.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{selectedReview.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedReview.date}</p>
                </div>
                <div className="ml-auto">
                  {getStatusBadge(selectedReview.status)}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <p className="italic">{selectedReview.content}</p>
              </div>
              
              <div className="flex justify-end gap-2">
                {selectedReview.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleStatusChange(selectedReview.id, "rejected")}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleStatusChange(selectedReview.id, "approved")}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => handleDeleteReview(selectedReview.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ReviewsAdmin;
