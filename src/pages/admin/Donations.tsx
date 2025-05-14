
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard, 
  Loader2 
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Donation } from "@/types/donation";
import { 
  fetchDonations, 
  updateDonationStatus, 
  getDonationStats 
} from "@/services/donationService";

const DonationsAdmin = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    totalAmount: 0,
    totalDonations: 0,
    completedDonations: 0,
    processingDonations: 0,
    failedDonations: 0
  });
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        setLoading(true);
        const donationsData = await fetchDonations();
        setDonations(donationsData);
        
        const statsData = await getDonationStats();
        setStats({
          totalAmount: statsData.totalAmount,
          totalDonations: statsData.totalDonations,
          completedDonations: statsData.completedDonations,
          processingDonations: statsData.processingDonations,
          failedDonations: statsData.failedDonations
        });
      } catch (error) {
        console.error("Error loading donations:", error);
        toast.error("Failed to load donations data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadDonations();
  }, []);

  const handleStatusChange = async (donationId: string, newStatus: 'processing' | 'completed' | 'failed') => {
    setProcessingIds(prev => [...prev, donationId]);
    
    try {
      const success = await updateDonationStatus(donationId, newStatus);
      
      if (success) {
        // Update local state to reflect the change
        setDonations(donations.map(donation => 
          donation.id === donationId 
            ? { ...donation, status: newStatus } 
            : donation
        ));
        
        // Update stats
        if (newStatus === 'completed') {
          setStats(prev => ({
            ...prev,
            completedDonations: prev.completedDonations + 1,
            processingDonations: prev.processingDonations - 1
          }));
        } else if (newStatus === 'failed') {
          setStats(prev => ({
            ...prev,
            failedDonations: prev.failedDonations + 1,
            processingDonations: prev.processingDonations - 1
          }));
        }
      }
    } catch (error) {
      console.error("Error updating donation status:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== donationId));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-500"><CheckCircle2 className="h-4 w-4" /> Completed</span>;
      case 'processing':
        return <span className="flex items-center gap-1 text-yellow-500"><Clock className="h-4 w-4" /> Processing</span>;
      case 'failed':
        return <span className="flex items-center gap-1 text-red-500"><XCircle className="h-4 w-4" /> Failed</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'KSH',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const getPaymentMethodIcon = (method: string) => {
    if (method === 'card') {
      return <CreditCard className="h-4 w-4" />;
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Donations Management</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDonations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalAmount, 'KSH')}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedDonations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.processingDonations}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md border">
          <div className="p-4">
            <h2 className="text-lg font-medium">Donation Records</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-enf-green" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Program</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  donations.map((donation) => (
                    <TableRow key={donation.id}>
                      <TableCell>{format(new Date(donation.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{donation.transaction_id || "-"}</TableCell>
                      <TableCell>{formatCurrency(donation.amount, donation.currency)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPaymentMethodIcon(donation.method)}
                          <span className="capitalize">{donation.method}</span>
                        </div>
                      </TableCell>
                      <TableCell>{donation.program_name || "General"}</TableCell>
                      <TableCell>{donation.user_name || "Anonymous"}</TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        {processingIds.includes(donation.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : donation.status === 'processing' ? (
                          <Select 
                            onValueChange={(value) => 
                              handleStatusChange(donation.id, value as 'completed' | 'failed')
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Complete</SelectItem>
                              <SelectItem value="failed">Mark Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
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
    </AdminLayout>
  );
};

export default DonationsAdmin;
