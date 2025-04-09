
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Eye, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock volunteer applications - in a real app, this would come from an API
const initialVolunteers = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+254 712 345 678",
    program: "Tree Planting",
    status: "pending",
    message: "I'm passionate about environmental conservation and would love to help with tree planting initiatives.",
    date: "2025-03-10",
    paymentStatus: "completed",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+254 723 456 789",
    program: "Education Support",
    status: "approved",
    message: "I have experience in teaching and would like to contribute to the education program.",
    date: "2025-03-08",
    paymentStatus: "completed",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+254 734 567 890",
    program: "Shelter Building",
    status: "rejected",
    message: "I have construction skills and would love to help build shelters for those in need.",
    date: "2025-03-05",
    paymentStatus: "completed",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+254 745 678 901",
    program: "Food Cultivation",
    status: "pending",
    message: "I have experience in farming and would like to share my knowledge with the community.",
    date: "2025-03-01",
    paymentStatus: "pending",
  },
];

const VolunteersAdmin = () => {
  const [volunteers, setVolunteers] = useState(initialVolunteers);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedVolunteer, setSelectedVolunteer] = useState<(typeof initialVolunteers)[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.program.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pending") return matchesSearch && volunteer.status === "pending";
    if (activeTab === "approved") return matchesSearch && volunteer.status === "approved";
    if (activeTab === "rejected") return matchesSearch && volunteer.status === "rejected";
    return matchesSearch;
  });

  const handleViewDetails = (volunteer: typeof selectedVolunteer) => {
    setSelectedVolunteer(volunteer);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setVolunteers(volunteers.map(v => 
      v.id === id ? { ...v, status: newStatus } : v
    ));
    
    const volunteer = volunteers.find(v => v.id === id);
    if (volunteer) {
      toast.success(`Volunteer application ${newStatus === "approved" ? "approved" : "rejected"}`);
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
        <h1 className="text-2xl font-bold mb-6">Volunteer Applications</h1>
        
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVolunteers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No volunteer applications found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVolunteers.map((volunteer) => (
                  <TableRow key={volunteer.id}>
                    <TableCell className="font-medium">{volunteer.name}</TableCell>
                    <TableCell>{volunteer.program}</TableCell>
                    <TableCell>{volunteer.date}</TableCell>
                    <TableCell>
                      {volunteer.paymentStatus === "completed" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(volunteer)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      {volunteer.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(volunteer.id, "approved")}
                            className="text-green-500 hover:text-green-700 hover:bg-green-50"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStatusChange(volunteer.id, "rejected")}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Volunteer Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Volunteer Application Details</DialogTitle>
            <DialogDescription>
              Review the complete information for this application.
            </DialogDescription>
          </DialogHeader>
          
          {selectedVolunteer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedVolunteer.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedVolunteer.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Phone:</div>
                <div className="col-span-2">{selectedVolunteer.phone}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Program:</div>
                <div className="col-span-2">{selectedVolunteer.program}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Date Applied:</div>
                <div className="col-span-2">{selectedVolunteer.date}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{getStatusBadge(selectedVolunteer.status)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Payment:</div>
                <div className="col-span-2">
                  {selectedVolunteer.paymentStatus === "completed" ? (
                    <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                      Paid
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Message:</div>
                <div className="col-span-2 whitespace-pre-wrap">{selectedVolunteer.message}</div>
              </div>
              
              {selectedVolunteer.status === "pending" && (
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      handleStatusChange(selectedVolunteer.id, "rejected");
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => {
                      handleStatusChange(selectedVolunteer.id, "approved");
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default VolunteersAdmin;
