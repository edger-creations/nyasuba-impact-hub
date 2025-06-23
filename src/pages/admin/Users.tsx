
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  CheckCircle2, 
  XCircle, 
  Search, 
  Shield, 
  Users as UsersIcon,
  UserCheck,
  Loader2
} from "lucide-react";

import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import { User, fetchUsers, updateUserVerificationStatus, getUserStats } from "@/services/userService";

const UsersAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    adminUsers: 0,
  });
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await fetchUsers();
        setUsers(usersData);
        setFilteredUsers(usersData);
        
        const statsData = await getUserStats();
        setStats({
          totalUsers: statsData.totalUsers,
          verifiedUsers: statsData.verifiedUsers,
          adminUsers: statsData.adminUsers,
        });
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          title: "Error",
          description: "Failed to load users data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          user =>
            user.name?.toLowerCase().includes(lowerSearch) ||
            user.email.toLowerCase().includes(lowerSearch)
        )
      );
    }
  }, [searchTerm, users]);

  const handleVerificationChange = async (userId: string, isVerified: boolean) => {
    setProcessingIds(prev => [...prev, userId]);
    
    try {
      const success = await updateUserVerificationStatus(userId, isVerified);
      
      if (success) {
        // Update local state to reflect the change
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, is_verified: isVerified } 
            : user
        ));
        
        // Update stats
        setStats(prev => ({
          ...prev,
          verifiedUsers: isVerified
            ? prev.verifiedUsers + 1
            : Math.max(0, prev.verifiedUsers - 1),
          adminUsers: isVerified
            ? prev.adminUsers + 1
            : Math.max(0, prev.adminUsers - 1)
        }));
      }
    } catch (error) {
      console.error("Error updating user verification status:", error);
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <UserCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.adminUsers}</div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-md border">
          <div className="p-4">
            <h2 className="text-lg font-medium">User List</h2>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-enf-green" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Avatar</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{user.name || "Unnamed"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{format(new Date(user.created_at), "PPP")}</TableCell>
                      <TableCell>
                        {user.is_verified ? (
                          <span className="flex items-center gap-1 text-green-500">
                            <CheckCircle2 className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-gray-500">
                            <XCircle className="h-4 w-4" /> Unverified
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {processingIds.includes(user.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : user.is_verified ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">Revoke Admin</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Revoke Admin Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to revoke admin access for {user.name || user.email}? 
                                  This user will no longer be able to access the admin dashboard.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleVerificationChange(user.id, false)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Revoke Access
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-blue-500">
                                Grant Admin
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Grant Admin Access</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to grant admin access to {user.name || user.email}? 
                                  This user will be able to access all admin features and modify content.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleVerificationChange(user.id, true)}
                                >
                                  Grant Access
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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

export default UsersAdmin;
