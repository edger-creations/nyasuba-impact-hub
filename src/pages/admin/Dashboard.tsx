
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartBar, Users, HandCoins, Calendar, RefreshCw, LineChart, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";

// Mock data for donation trends
const donationData = [
  { name: "Jan", amount: 24000 },
  { name: "Feb", amount: 18000 },
  { name: "Mar", amount: 29000 },
  { name: "Apr", amount: 32000 },
  { name: "May", amount: 27000 },
  { name: "Jun", amount: 38000 },
  { name: "Jul", amount: 42000 },
];

// Mock data for volunteer growth
const volunteerData = [
  { name: "Jan", count: 12 },
  { name: "Feb", count: 15 },
  { name: "Mar", count: 18 },
  { name: "Apr", count: 24 },
  { name: "May", count: 28 },
  { name: "Jun", count: 32 },
  { name: "Jul", count: 42 },
];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeVolunteers: 0,
    totalPrograms: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    setRefreshing(true);
    // Mock data - in a real app, this would be an API call
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate slightly different numbers each time to simulate real updates
      const randomFactor = Math.random() * 0.1 + 0.95; // Random factor between 0.95 and 1.05
      
      setStats({
        totalDonations: Math.floor(158900 * randomFactor),
        activeVolunteers: Math.floor(42 * randomFactor),
        totalPrograms: 6,
        upcomingEvents: Math.floor(3 * randomFactor),
      });
      
      setLastUpdated(new Date());
      toast.success("Dashboard data refreshed successfully");
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to refresh dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up periodic refresh (every 2 minutes)
    const intervalId = setInterval(() => {
      fetchStats();
    }, 120000); // 2 minutes
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-1" />
              )}
              Refresh
            </Button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className={`transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
              <HandCoins className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KSH {stats.totalDonations.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2.5% from last month</p>
            </CardContent>
          </Card>
          
          <Card className={`transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Active Volunteers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeVolunteers}</div>
              <p className="text-xs text-muted-foreground">+4 since last month</p>
            </CardContent>
          </Card>
          
          <Card className={`transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Programs</CardTitle>
              <ChartBar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPrograms}</div>
              <p className="text-xs text-muted-foreground">All active and running</p>
            </CardContent>
          </Card>
          
          <Card className={`transition-opacity duration-200 ${loading ? 'opacity-70' : 'opacity-100'}`}>
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
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Donation Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-enf-green" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    amount: {
                      theme: {
                        light: "hsl(142, 76%, 36%)",  // enf-green
                        dark: "hsl(143, 85%, 96%)",   // enf-light-green
                      },
                    },
                  }}
                >
                  <AreaChart
                    data={donationData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      name="Donations (KSH)"
                      stroke="var(--color-amount)"
                      fill="var(--color-amount)"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Volunteer Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              {chartLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader className="h-8 w-8 animate-spin text-enf-green" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    count: {
                      theme: {
                        light: "hsl(142, 76%, 36%)",  // enf-green
                        dark: "hsl(143, 85%, 96%)",   // enf-light-green
                      },
                    },
                  }}
                >
                  <BarChart
                    data={volunteerData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="count"
                      name="Volunteers"
                      fill="var(--color-count)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              )}
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
