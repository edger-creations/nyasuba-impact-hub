
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, Users, HandCoins, Calendar } from "lucide-react";

const AdminDashboard = () => {
  // In a real app, this would come from an API
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeVolunteers: 0,
    totalPrograms: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    // Simulate fetching stats from an API
    const fetchStats = async () => {
      // Mock data - in a real app, this would be an API call
      setTimeout(() => {
        setStats({
          totalDonations: 158900,
          activeVolunteers: 42,
          totalPrograms: 6,
          upcomingEvents: 3,
        });
      }, 1000);
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSH {stats.totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
              <p className="text-xs text-muted-foreground">+4 since last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPrograms}</div>
              <p className="text-xs text-muted-foreground">All active and running</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">In the next 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Activity</h2>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="border-b pb-2">
                  <p className="font-medium">New donation received</p>
                  <p className="text-sm text-muted-foreground">John Doe donated KSH 5,000</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">New volunteer application</p>
                  <p className="text-sm text-muted-foreground">Jane Smith applied for tree planting program</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
                <div className="border-b pb-2">
                  <p className="font-medium">Program updated</p>
                  <p className="text-sm text-muted-foreground">Education Assistance program details modified</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
                <div>
                  <p className="font-medium">New review</p>
                  <p className="text-sm text-muted-foreground">Mary Johnson left a 5-star review</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
