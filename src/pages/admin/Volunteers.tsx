
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Loader2, 
  Mail,
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Volunteer, fetchVolunteers, updateVolunteerStatus, getVolunteerStats } from "@/services/volunteerService";

const VolunteersAdmin = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    pendingVolunteers: 0,
    approvedVolunteers: 0,
    rejectedVolunteers: 0,
  });
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        setLoading(true);
        const volunteersData = await fetchVolunteers();
        setVolunteers(volunteersData);
        
        const statsData = await getVolunteerStats();
        setStats(statsData);
        
        filterVolunteers(volunteersData, currentFilter, searchTerm);
      } catch (error) {
        console.error("Error loading volunteers:", error);
        toast.error("Failed to load volunteers data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, []);

  // Filtering logic
  const filterVolunteers = (volunteers: Volunteer[], filter: string, search: string) => {
    let filtered = [...volunteers];
    
    // Apply status filter
    if (filter !== "all") {
      filtered = filtered.filter(v => v.status === filter);
    }
    
    // Apply search term
    if (search.trim() !== "") {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(
        v =>
          v.firstName.toLowerCase().includes(lowerSearch) ||
          v.lastName.toLowerCase().includes(lowerSearch) ||
          v.email.toLowerCase().includes(lowerSearch) ||
          v.skills.some(skill => skill.toLowerCase().includes(lowerSearch))
      );
    }
    
    setFilteredVolunteers(filtered);
  };

  useEffect(() => {
    filterVolunteers(volunteers, currentFilter, searchTerm);
  }, [searchTerm, currentFilter, volunteers]);

  const handleStatusChange = async (volunteerId: string, status: 'pending' | 'approved' | 'rejected') => {
    setProcessingIds(prev => [...prev, volunteerId]);
    
    try {
      const success = await updateVolunteerStatus(volunteerId, status);
      
      if (success) {
        // Update local state to reflect the change
        const updatedVolunteers = volunteers.map(volunteer => 
          volunteer.id === volunteerId 
            ? { ...volunteer, status: status } 
            : volunteer
        );
        setVolunteers(updatedVolunteers);
        
        // Update stats
        const oldStatus = volunteers.find(v => v.id === volunteerId)?.status;
        if (oldStatus && status !== oldStatus) {
          setStats(prev => ({
            ...prev,
            [`${oldStatus}Volunteers`]: Math.max(0, prev[`${oldStatus}Volunteers` as keyof typeof prev] as number - 1),
            [`${status}Volunteers`]: (prev[`${status}Volunteers` as keyof typeof prev] as number) + 1
          }));
        }
      }
    } catch (error) {
      console.error("Error updating volunteer status:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== volunteerId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100 dark:border-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800">Rejected</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const openVolunteerDetail = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setIsDetailOpen(true);
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Volunteer Management</h1>

        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVolunteers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingVolunteers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.approvedVolunteers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rejectedVolunteers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search volunteers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Tabs 
            value={currentFilter} 
            onValueChange={setCurrentFilter}
            className="sm:w-[400px]"
          >
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md border">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-enf-green" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVolunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No volunteers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVolunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium">
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-left justify-start"
                          onClick={() => openVolunteerDetail(volunteer)}
                        >
                          {volunteer.firstName} {volunteer.lastName}
                        </Button>
                      </TableCell>
                      <TableCell>{volunteer.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[300px]">
                          {volunteer.skills.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {volunteer.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{volunteer.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{format(new Date(volunteer.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(volunteer.status)}</TableCell>
                      <TableCell className="text-right">
                        {processingIds.includes(volunteer.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                        ) : volunteer.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-500"
                              onClick={() => handleStatusChange(volunteer.id, 'approved')}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-500"
                              onClick={() => handleStatusChange(volunteer.id, 'rejected')}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : volunteer.status === 'approved' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(volunteer.id, 'pending')}
                          >
                            Reset to Pending
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleStatusChange(volunteer.id, 'pending')}
                          >
                            Reset to Pending
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Volunteer Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Volunteer Details</SheetTitle>
            <SheetDescription>
              {selectedVolunteer ? `Applied on ${format(new Date(selectedVolunteer.created_at), "MMMM d, yyyy")}` : ""}
            </SheetDescription>
          </SheetHeader>
          {selectedVolunteer && (
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-xl font-medium mb-1">
                  {selectedVolunteer.firstName} {selectedVolunteer.lastName}
                </h3>
                <div className="mt-2">{getStatusBadge(selectedVolunteer.status)}</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{selectedVolunteer.email}</div>
                  </div>
                </div>
                
                {selectedVolunteer.phone && (
                  <div className="flex items-start gap-2">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{selectedVolunteer.phone}</div>
                    </div>
                  </div>
                )}
                
                {selectedVolunteer.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-sm text-muted-foreground">{selectedVolunteer.address}</div>
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="font-medium mb-1">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedVolunteer.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {selectedVolunteer.availability && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">Availability</div>
                      <div className="text-sm text-muted-foreground">{selectedVolunteer.availability}</div>
                    </div>
                  </div>
                )}
                
                {selectedVolunteer.interests && (
                  <div>
                    <div className="font-medium mb-1">Interests & Motivation</div>
                    <div className="text-sm text-muted-foreground">{selectedVolunteer.interests}</div>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <h4 className="font-medium">Change Status</h4>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className={`flex-1 ${
                          selectedVolunteer.status === 'approved' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''
                        }`}
                        disabled={selectedVolunteer.status === 'approved' || processingIds.includes(selectedVolunteer.id)}
                      >
                        Approve
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Approve Volunteer</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to approve {selectedVolunteer.firstName} {selectedVolunteer.lastName} as a volunteer?
                          They will be added to the volunteer team.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange(selectedVolunteer.id, 'approved')}
                        >
                          Approve
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="outline"
                        className={`flex-1 ${
                          selectedVolunteer.status === 'rejected' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''
                        }`}
                        disabled={selectedVolunteer.status === 'rejected' || processingIds.includes(selectedVolunteer.id)}
                      >
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Application</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to reject the application from {selectedVolunteer.firstName} {selectedVolunteer.lastName}?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleStatusChange(selectedVolunteer.id, 'rejected')}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
};

export default VolunteersAdmin;
