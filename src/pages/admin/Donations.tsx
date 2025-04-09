
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, Download } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock donations - in a real app, this would come from an API
const initialDonations = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    amount: 5000,
    currency: "KSH",
    method: "card",
    status: "completed",
    date: "2025-03-10",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    amount: 10000,
    currency: "KSH",
    method: "paypal",
    status: "completed",
    date: "2025-03-08",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    amount: 100,
    currency: "USD",
    method: "bank_transfer",
    status: "processing",
    date: "2025-03-05",
  },
  {
    id: "4",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    amount: 2000,
    currency: "KSH",
    method: "mobile_money",
    status: "failed",
    date: "2025-03-01",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "robert.b@example.com",
    amount: 50,
    currency: "USD",
    method: "card",
    status: "completed",
    date: "2025-02-28",
  },
  {
    id: "6",
    name: "Emily Davis",
    email: "emily.d@example.com",
    amount: 7500,
    currency: "KSH",
    method: "mobile_money",
    status: "completed",
    date: "2025-02-25",
  },
];

const DonationsAdmin = () => {
  const [donations, setDonations] = useState(initialDonations);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDonation, setSelectedDonation] = useState<(typeof initialDonations)[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState("all_time");
  
  // Calculate totals
  const totalAmountKSH = donations
    .filter(d => d.status === "completed" && d.currency === "KSH")
    .reduce((sum, donation) => sum + donation.amount, 0);
  
  const totalAmountUSD = donations
    .filter(d => d.status === "completed" && d.currency === "USD")
    .reduce((sum, donation) => sum + donation.amount, 0);
  
  const totalDonations = donations.filter(d => d.status === "completed").length;

  const filteredDonations = donations.filter(donation => {
    // Search filter
    const matchesSearch = 
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      activeTab === "all" ||
      (activeTab === "completed" && donation.status === "completed") ||
      (activeTab === "processing" && donation.status === "processing") ||
      (activeTab === "failed" && donation.status === "failed");
    
    // Date filter
    let matchesDate = true;
    const donationDate = new Date(donation.date);
    const today = new Date();
    
    if (dateFilter === "this_month") {
      const thisMonth = today.getMonth();
      const thisYear = today.getFullYear();
      matchesDate = donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear;
    } else if (dateFilter === "this_year") {
      matchesDate = donationDate.getFullYear() === today.getFullYear();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleViewDetails = (donation: typeof selectedDonation) => {
    setSelectedDonation(donation);
    setIsViewDialogOpen(true);
  };

  const handleExportDonations = () => {
    // In a real app, this would generate a CSV or PDF
    alert("Export functionality would be implemented here");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case "processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processing</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      case "bank_transfer":
        return "Bank Transfer";
      case "mobile_money":
        return "Mobile Money";
      default:
        return method;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Donations</h1>
          <Button
            onClick={handleExportDonations}
            className="mt-4 md:mt-0"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Donations (KSH)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSH {totalAmountKSH.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Donations (USD)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">USD {totalAmountUSD.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Number of Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDonations}</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_time">All Time</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No donations found
                  </TableCell>
                </TableRow>
              ) : (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.name}</TableCell>
                    <TableCell>{donation.currency} {donation.amount.toLocaleString()}</TableCell>
                    <TableCell>{getPaymentMethodDisplay(donation.method)}</TableCell>
                    <TableCell>{donation.date}</TableCell>
                    <TableCell>{getStatusBadge(donation.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(donation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Donation Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Donation Details</DialogTitle>
            <DialogDescription>
              Complete information about this donation.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDonation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Name:</div>
                <div className="col-span-2">{selectedDonation.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Email:</div>
                <div className="col-span-2">{selectedDonation.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Amount:</div>
                <div className="col-span-2">{selectedDonation.currency} {selectedDonation.amount.toLocaleString()}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Payment Method:</div>
                <div className="col-span-2">{getPaymentMethodDisplay(selectedDonation.method)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Date:</div>
                <div className="col-span-2">{selectedDonation.date}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Status:</div>
                <div className="col-span-2">{getStatusBadge(selectedDonation.status)}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="font-medium">Transaction ID:</div>
                <div className="col-span-2">{selectedDonation.id}</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default DonationsAdmin;
