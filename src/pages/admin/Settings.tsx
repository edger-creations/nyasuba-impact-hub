
import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const SettingsAdmin = () => {
  const { user } = useAuth();
  
  // Organization settings
  const [orgSettings, setOrgSettings] = useState({
    orgName: "Esther Nyasuba Foundation",
    contactEmail: "contact@estherfoundation.org",
    contactPhone: "+254 712 345 678",
    address: "123 NGO Way, Nairobi, Kenya",
    donationOptions: "KSH,USD,EUR,GBP",
  });
  
  // Website settings
  const [websiteSettings, setWebsiteSettings] = useState({
    siteTitle: "Esther Nyasuba Foundation",
    siteDescription: "Transforming communities through sustainable development.",
    enableReviews: true,
    enableDonations: true,
    enableVolunteerApplications: true,
    showFeaturedPrograms: true,
    mainColor: "#00796b", // enf-green
  });
  
  // Social media settings
  const [socialMediaSettings, setSocialMediaSettings] = useState({
    facebook: "https://facebook.com/estherfoundation",
    twitter: "https://twitter.com/estherfoundation",
    instagram: "https://instagram.com/estherfoundation",
    linkedin: "https://linkedin.com/company/estherfoundation",
  });
  
  // User settings
  const [userSettings, setUserSettings] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const handleOrgSettingsSave = () => {
    // In a real app, this would update the database
    toast.success("Organization settings saved successfully!");
  };
  
  const handleWebsiteSettingsSave = () => {
    // In a real app, this would update the database
    toast.success("Website settings saved successfully!");
  };
  
  const handleSocialMediaSettingsSave = () => {
    // In a real app, this would update the database
    toast.success("Social media settings saved successfully!");
  };
  
  const handleChangePassword = () => {
    // Validate passwords
    if (userSettings.newPassword !== userSettings.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    if (userSettings.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    
    // In a real app, this would update the database
    toast.success("Password changed successfully!");
    
    // Reset password fields
    setUserSettings({
      ...userSettings,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="organization" className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="website">Website</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          {/* Organization Settings */}
          <TabsContent value="organization">
            <Card>
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>
                  Manage your organization's basic information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgSettings.orgName}
                    onChange={(e) => setOrgSettings({ ...orgSettings, orgName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={orgSettings.contactEmail}
                    onChange={(e) => setOrgSettings({ ...orgSettings, contactEmail: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={orgSettings.contactPhone}
                    onChange={(e) => setOrgSettings({ ...orgSettings, contactPhone: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={orgSettings.address}
                    onChange={(e) => setOrgSettings({ ...orgSettings, address: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="donationOptions">Donation Currency Options (comma-separated)</Label>
                  <Input
                    id="donationOptions"
                    value={orgSettings.donationOptions}
                    onChange={(e) => setOrgSettings({ ...orgSettings, donationOptions: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter currency codes separated by commas (e.g., KSH,USD,EUR)
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleOrgSettingsSave}
                  className="bg-enf-green hover:bg-enf-dark-green"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Website Settings */}
          <TabsContent value="website">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
                <CardDescription>
                  Customize how your website looks and behaves.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Site Title</Label>
                  <Input
                    id="siteTitle"
                    value={websiteSettings.siteTitle}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteTitle: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={websiteSettings.siteDescription}
                    onChange={(e) => setWebsiteSettings({ ...websiteSettings, siteDescription: e.target.value })}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    This description appears in search results and social media shares.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="mainColor">Main Theme Color</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="mainColor"
                      type="color"
                      value={websiteSettings.mainColor}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, mainColor: e.target.value })}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={websiteSettings.mainColor}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, mainColor: e.target.value })}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-6 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableReviews">Enable Reviews</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow visitors to submit reviews.
                      </p>
                    </div>
                    <Switch
                      id="enableReviews"
                      checked={websiteSettings.enableReviews}
                      onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, enableReviews: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableDonations">Enable Donations</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow visitors to make donations.
                      </p>
                    </div>
                    <Switch
                      id="enableDonations"
                      checked={websiteSettings.enableDonations}
                      onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, enableDonations: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enableVolunteers">Enable Volunteer Applications</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow visitors to apply as volunteers.
                      </p>
                    </div>
                    <Switch
                      id="enableVolunteers"
                      checked={websiteSettings.enableVolunteerApplications}
                      onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, enableVolunteerApplications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="showFeatured">Show Featured Programs</Label>
                      <p className="text-sm text-muted-foreground">
                        Display featured programs on the homepage.
                      </p>
                    </div>
                    <Switch
                      id="showFeatured"
                      checked={websiteSettings.showFeaturedPrograms}
                      onCheckedChange={(checked) => setWebsiteSettings({ ...websiteSettings, showFeaturedPrograms: checked })}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleWebsiteSettingsSave}
                  className="bg-enf-green hover:bg-enf-dark-green"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Social Media Settings */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>
                  Connect your organization's social media profiles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={socialMediaSettings.facebook}
                    onChange={(e) => setSocialMediaSettings({ ...socialMediaSettings, facebook: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input
                    id="twitter"
                    value={socialMediaSettings.twitter}
                    onChange={(e) => setSocialMediaSettings({ ...socialMediaSettings, twitter: e.target.value })}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={socialMediaSettings.instagram}
                    onChange={(e) => setSocialMediaSettings({ ...socialMediaSettings, instagram: e.target.value })}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={socialMediaSettings.linkedin}
                    onChange={(e) => setSocialMediaSettings({ ...socialMediaSettings, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSocialMediaSettingsSave}
                  className="bg-enf-green hover:bg-enf-dark-green"
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Update your personal information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={userSettings.name}
                      onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                      readOnly
                    />
                    <p className="text-sm text-muted-foreground">
                      Email address cannot be changed directly. Please contact support.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={() => toast.success("Account information saved!")}
                    className="bg-enf-green hover:bg-enf-dark-green"
                  >
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={userSettings.currentPassword}
                      onChange={(e) => setUserSettings({ ...userSettings, currentPassword: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={userSettings.newPassword}
                      onChange={(e) => setUserSettings({ ...userSettings, newPassword: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={userSettings.confirmPassword}
                      onChange={(e) => setUserSettings({ ...userSettings, confirmPassword: e.target.value })}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button 
                    onClick={handleChangePassword}
                    className="bg-enf-green hover:bg-enf-dark-green"
                    disabled={!userSettings.currentPassword || !userSettings.newPassword || !userSettings.confirmPassword}
                  >
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsAdmin;
