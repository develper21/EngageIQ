import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Link as LinkIcon,
  Edit,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Music,
  BarChart3,
  Heart,
  MessageSquare,
  Users,
  Eye,
  TrendingUp,
  Award,
  Target,
  Clock,
  CheckCircle
} from 'lucide-react';

interface SocialAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  posts: number;
  engagement: number;
  connected: boolean;
  icon: React.ElementType;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  unlockedAt?: Date;
}

const mockSocialAccounts: SocialAccount[] = [
  {
    id: '1',
    platform: 'Instagram',
    username: '@johndoe',
    followers: 15420,
    posts: 342,
    engagement: 4.8,
    connected: true,
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500'
  },
  {
    id: '2',
    platform: 'Twitter',
    username: '@johndoe',
    followers: 8750,
    posts: 1250,
    engagement: 3.2,
    connected: true,
    icon: Twitter,
    color: 'bg-blue-400'
  },
  {
    id: '3',
    platform: 'LinkedIn',
    username: 'John Doe',
    followers: 3200,
    posts: 156,
    engagement: 5.1,
    connected: true,
    icon: Linkedin,
    color: 'bg-blue-600'
  },
  {
    id: '4',
    platform: 'Facebook',
    username: 'John Doe',
    followers: 5600,
    posts: 234,
    engagement: 2.8,
    connected: false,
    icon: Facebook,
    color: 'bg-blue-700'
  },
  {
    id: '5',
    platform: 'YouTube',
    username: 'John Doe',
    followers: 12800,
    posts: 89,
    engagement: 6.2,
    connected: false,
    icon: Youtube,
    color: 'bg-red-600'
  },
  {
    id: '6',
    platform: 'TikTok',
    username: '@johndoe',
    followers: 45200,
    posts: 234,
    engagement: 8.9,
    connected: false,
    icon: Music,
    color: 'bg-black'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'Social Starter',
    description: 'Connect your first social media account',
    icon: Users,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30)
  },
  {
    id: '2',
    title: 'Content Creator',
    description: 'Publish 100 posts across all platforms',
    icon: Edit,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15)
  },
  {
    id: '3',
    title: 'Engagement Master',
    description: 'Achieve 5% average engagement rate',
    icon: Heart,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  },
  {
    id: '4',
    title: 'Viral Sensation',
    description: 'Get a post with 10K+ engagements',
    icon: TrendingUp,
    unlocked: false
  },
  {
    id: '5',
    title: 'Consistency King',
    description: 'Post daily for 30 days straight',
    icon: Target,
    unlocked: false
  },
  {
    id: '6',
    title: 'Analytics Expert',
    description: 'Generate 10 detailed reports',
    icon: BarChart3,
    unlocked: false
  }
];

export default function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(mockSocialAccounts);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const totalFollowers = socialAccounts
    .filter(account => account.connected)
    .reduce((sum, account) => sum + account.followers, 0);

  const totalPosts = socialAccounts
    .filter(account => account.connected)
    .reduce((sum, account) => sum + account.posts, 0);

  const avgEngagement = socialAccounts
    .filter(account => account.connected)
    .reduce((sum, account) => sum + account.engagement, 0) / 
    socialAccounts.filter(account => account.connected).length || 0;

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

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
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Profile Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Profile Picture */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">John Doe</h1>
                      <Badge variant="secondary">Pro Plan</Badge>
                      <Badge variant="outline">Verified</Badge>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">
                      Social media enthusiast and content creator | Digital marketing specialist | Helping brands grow their online presence
                    </p>
                    
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        San Francisco, CA
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Joined November 2024
                      </div>
                      <div className="flex items-center gap-1">
                        <LinkIcon className="w-4 h-4" />
                        <a href="#" className="text-primary hover:underline">johndoe.com</a>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Button>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline">Share Profile</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalFollowers.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Followers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <Edit className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalPosts}</p>
                      <p className="text-sm text-muted-foreground">Total Posts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Avg Engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{unlockedAchievements}</p>
                      <p className="text-sm text-muted-foreground">Achievements</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="accounts" className="space-y-6">
              <TabsList>
                <TabsTrigger value="accounts">Connected Accounts</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Connected Accounts */}
              <TabsContent value="accounts">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media Accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {socialAccounts.map((account) => {
                        const Icon = account.icon;
                        return (
                          <Card key={account.id} className={account.connected ? '' : 'opacity-60'}>
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-4">
                                <div className={`w-10 h-10 rounded-lg ${account.color} flex items-center justify-center`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{account.platform}</h4>
                                  <p className="text-sm text-muted-foreground">{account.username}</p>
                                </div>
                                {account.connected && (
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                )}
                              </div>
                              
                              {account.connected ? (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Followers</span>
                                    <span className="font-medium">{account.followers.toLocaleString()}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Posts</span>
                                    <span className="font-medium">{account.posts}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Engagement</span>
                                    <span className="font-medium">{account.engagement}%</span>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full mt-2">
                                    View Analytics
                                  </Button>
                                </div>
                              ) : (
                                <Button variant="outline" size="sm" className="w-full">
                                  Connect Account
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Achievements */}
              <TabsContent value="achievements">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements & Milestones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {achievements.map((achievement) => {
                        const Icon = achievement.icon;
                        return (
                          <Card 
                            key={achievement.id} 
                            className={achievement.unlocked ? '' : 'opacity-50'}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3 mb-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  achievement.unlocked 
                                    ? 'bg-yellow-100 text-yellow-600' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-medium">{achievement.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {achievement.description}
                                  </p>
                                </div>
                              </div>
                              
                              {achievement.unlocked && achievement.unlockedAt && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  Unlocked {achievement.unlockedAt.toLocaleDateString()}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Activity */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Edit className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Posted on Instagram</p>
                            <p className="text-sm text-muted-foreground">
                              Shared a new photo about digital marketing tips
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Milestone Reached</p>
                            <p className="text-sm text-muted-foreground">
                              Your Instagram post reached 10K likes!
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Users className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">New Followers</p>
                            <p className="text-sm text-muted-foreground">
                              Gained 50 new followers across all platforms
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Award className="w-4 h-4 text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">Achievement Unlocked</p>
                            <p className="text-sm text-muted-foreground">
                              Engagement Master - Achieved 5% average engagement
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                        <p>Detailed analytics charts would be displayed here</p>
                        <p className="text-sm">Showing engagement, reach, and growth trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
