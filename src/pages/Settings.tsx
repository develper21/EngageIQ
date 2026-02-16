import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Database,
  Smartphone,
  Mail,
  Lock,
  Globe,
  Trash2,
  Download,
  Key
} from 'lucide-react';

export default function Settings() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  // Profile Settings
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: user?.email || '',
    bio: 'Social media enthusiast and content creator',
    website: 'https://johndoe.com',
    location: 'San Francisco, CA'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReports: true,
    mentions: true,
    newFollowers: true,
    postPerformance: true,
    aiInsights: false
  });

  // Privacy Settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showLocation: true,
    dataSharing: false,
    analyticsTracking: true
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY'
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSaveProfile = () => {
    // Save profile logic here
    console.log('Saving profile:', profile);
  };

  const handleSaveNotifications = () => {
    // Save notification preferences here
    console.log('Saving notifications:', notifications);
  };

  const handleSavePrivacy = () => {
    // Save privacy settings here
    console.log('Saving privacy:', privacy);
  };

  const handleSaveAppearance = () => {
    // Save appearance settings here
    console.log('Saving appearance:', appearance);
  };

  const handleExportData = () => {
    // Export data logic here
    console.log('Exporting user data');
  };

  const handleDeleteAccount = () => {
    // Delete account logic here
    console.log('Deleting account');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and preferences
              </p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="advanced" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Input
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveProfile}>Save Profile</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, pushNotifications: checked }))
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Weekly Reports</Label>
                          <p className="text-sm text-muted-foreground">Get weekly performance summaries</p>
                        </div>
                        <Switch
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, weeklyReports: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Mentions</Label>
                          <p className="text-sm text-muted-foreground">When someone mentions you</p>
                        </div>
                        <Switch
                          checked={notifications.mentions}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, mentions: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>New Followers</Label>
                          <p className="text-sm text-muted-foreground">When you gain new followers</p>
                        </div>
                        <Switch
                          checked={notifications.newFollowers}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, newFollowers: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Post Performance</Label>
                          <p className="text-sm text-muted-foreground">Significant changes in post performance</p>
                        </div>
                        <Switch
                          checked={notifications.postPerformance}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, postPerformance: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>AI Insights</Label>
                          <p className="text-sm text-muted-foreground">New AI-powered insights available</p>
                        </div>
                        <Switch
                          checked={notifications.aiInsights}
                          onCheckedChange={(checked) => 
                            setNotifications(prev => ({ ...prev, aiInsights: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Settings */}
              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Profile Visibility</Label>
                        <Select
                          value={privacy.profileVisibility}
                          onValueChange={(value) => 
                            setPrivacy(prev => ({ ...prev, profileVisibility: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                            <SelectItem value="friends">Friends Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Email</Label>
                          <p className="text-sm text-muted-foreground">Display email on public profile</p>
                        </div>
                        <Switch
                          checked={privacy.showEmail}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, showEmail: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show Location</Label>
                          <p className="text-sm text-muted-foreground">Display location on public profile</p>
                        </div>
                        <Switch
                          checked={privacy.showLocation}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, showLocation: checked }))
                          }
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Data Sharing</Label>
                          <p className="text-sm text-muted-foreground">Share anonymized data for analytics</p>
                        </div>
                        <Switch
                          checked={privacy.dataSharing}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, dataSharing: checked }))
                          }
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Analytics Tracking</Label>
                          <p className="text-sm text-muted-foreground">Help us improve with usage analytics</p>
                        </div>
                        <Switch
                          checked={privacy.analyticsTracking}
                          onCheckedChange={(checked) => 
                            setPrivacy(prev => ({ ...prev, analyticsTracking: checked }))
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <Separator />
                      <div>
                        <Label className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                          Password
                        </Label>
                        <Button variant="outline" className="mt-2">
                          Change Password
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Two-Factor Authentication
                        </Label>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">Not Enabled</Badge>
                          <Button variant="outline" size="sm">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button onClick={handleSavePrivacy}>Save Privacy Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Appearance Settings */}
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Theme</Label>
                      <Select
                        value={appearance.theme}
                        onValueChange={(value) => 
                          setAppearance(prev => ({ ...prev, theme: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Language</Label>
                      <Select
                        value={appearance.language}
                        onValueChange={(value) => 
                          setAppearance(prev => ({ ...prev, language: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="zh">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Timezone</Label>
                      <Select
                        value={appearance.timezone}
                        onValueChange={(value) => 
                          setAppearance(prev => ({ ...prev, timezone: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                          <SelectItem value="UTC">UTC</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Date Format</Label>
                      <Select
                        value={appearance.dateFormat}
                        onValueChange={(value) => 
                          setAppearance(prev => ({ ...prev, dateFormat: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleSaveAppearance}>Save Appearance Settings</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Advanced Settings */}
              <TabsContent value="advanced">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        Data Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Export Your Data</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Download all your data in JSON format
                        </p>
                        <Button variant="outline" onClick={handleExportData}>
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <Label className="text-destructive">Danger Zone</Label>
                        <p className="text-sm text-muted-foreground mb-2">
                          Permanently delete your account and all associated data
                        </p>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Connected Devices
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Chrome on Windows</p>
                            <p className="text-sm text-muted-foreground">Last active: 2 hours ago</p>
                          </div>
                          <Badge variant="secondary">Current</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Safari on iPhone</p>
                            <p className="text-sm text-muted-foreground">Last active: 2 days ago</p>
                          </div>
                          <Button variant="outline" size="sm">Revoke</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
