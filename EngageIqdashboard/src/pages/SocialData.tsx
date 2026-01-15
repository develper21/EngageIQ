import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { ContentComparison } from '@/components/dashboard/ContentComparison';
import { OptimalPostingTime } from '@/components/dashboard/OptimalPostingTime';
import { ViralityAnalysis } from '@/components/dashboard/ViralityAnalysis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Music,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Filter,
  Download,
  RefreshCw,
  Play,
  Image,
  FileText,
  Link,
  ExternalLink
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: string;
  type: 'image' | 'video' | 'text' | 'link';
  content: string;
  url?: string;
  imageUrl?: string;
  publishedAt: Date;
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
    engagement: number;
  };
  performance: 'excellent' | 'good' | 'average' | 'poor';
}

interface PlatformData {
  platform: string;
  icon: React.ElementType;
  color: string;
  followers: number;
  following: number;
  posts: number;
  engagement: number;
  reach: number;
  impressions: number;
  growth: number;
}

const mockPlatformData: PlatformData[] = [
  {
    platform: 'Instagram',
    icon: Instagram,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
    followers: 15420,
    following: 892,
    posts: 342,
    engagement: 4.8,
    reach: 125000,
    impressions: 450000,
    growth: 8.5
  },
  {
    platform: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-400',
    followers: 8750,
    following: 456,
    posts: 1250,
    engagement: 3.2,
    reach: 85000,
    impressions: 280000,
    growth: 5.2
  },
  {
    platform: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-600',
    followers: 3200,
    following: 234,
    posts: 156,
    engagement: 5.1,
    reach: 45000,
    impressions: 120000,
    growth: 12.8
  }
];

const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'Instagram',
    type: 'image',
    content: 'Check out these amazing digital marketing tips that will transform your social media game! 🚀 #DigitalMarketing #SocialMediaTips',
    imageUrl: '/api/placeholder/400/300',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    metrics: {
      likes: 2450,
      comments: 89,
      shares: 34,
      engagement: 6.2
    },
    performance: 'excellent'
  },
  {
    id: '2',
    platform: 'Twitter',
    type: 'text',
    content: 'Just launched my new course on content creation! 50% off for the first 100 students. Link in bio! 🎓 #CourseLaunch #ContentCreation',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    metrics: {
      likes: 156,
      comments: 23,
      shares: 45,
      engagement: 3.8
    },
    performance: 'good'
  },
  {
    id: '3',
    platform: 'LinkedIn',
    type: 'text',
    content: '5 key strategies for building a personal brand on social media:\n\n1. Consistency is key\n2. Provide value first\n3. Engage with your audience\n4. Share your journey\n5. Be authentic\n\nWhat strategies have worked for you?',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    metrics: {
      likes: 423,
      comments: 67,
      shares: 12,
      engagement: 5.4
    },
    performance: 'excellent'
  },
  {
    id: '4',
    platform: 'Instagram',
    type: 'video',
    content: 'Behind the scenes of my latest photoshoot! ✨ #BehindTheScenes #ContentCreator',
    imageUrl: '/api/placeholder/400/300',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    metrics: {
      likes: 3200,
      comments: 156,
      shares: 78,
      views: 12500,
      engagement: 8.9
    },
    performance: 'excellent'
  },
  {
    id: '5',
    platform: 'Twitter',
    type: 'link',
    content: 'Great article on the future of social media marketing. Must read for all marketers! 📖',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    metrics: {
      likes: 89,
      comments: 12,
      shares: 23,
      engagement: 2.1
    },
    performance: 'average'
  }
];

const contentTypeIcons = {
  image: Image,
  video: Play,
  text: FileText,
  link: Link
};

const performanceColors = {
  excellent: 'text-green-600 bg-green-100',
  good: 'text-blue-600 bg-blue-100',
  average: 'text-yellow-600 bg-yellow-100',
  poor: 'text-red-600 bg-red-100'
};

export default function SocialData() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [platformData, setPlatformData] = useState<PlatformData[]>(mockPlatformData);
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedContentType, setSelectedContentType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const filteredPosts = posts.filter(post => {
    if (selectedPlatform !== 'all' && post.platform !== selectedPlatform) return false;
    if (selectedContentType !== 'all' && post.type !== selectedContentType) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'recent') return b.publishedAt.getTime() - a.publishedAt.getTime();
    if (sortBy === 'engagement') return b.metrics.engagement - a.metrics.engagement;
    if (sortBy === 'likes') return b.metrics.likes - a.metrics.likes;
    return 0;
  });

  const totalFollowers = platformData.reduce((sum, platform) => sum + platform.followers, 0);
  const totalEngagement = platformData.reduce((sum, platform) => sum + platform.engagement, 0) / platformData.length;
  const totalPosts = platformData.reduce((sum, platform) => sum + platform.posts, 0);
  const avgGrowth = platformData.reduce((sum, platform) => sum + platform.growth, 0) / platformData.length;

  const handleRefresh = () => {
    // Simulate data refresh
    console.log('Refreshing social media data...');
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
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Social Media Data</h1>
                <p className="text-muted-foreground">
                  Comprehensive view of your social media performance and content
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleRefresh}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Overview Stats */}
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
                      <Heart className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalEngagement.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Avg Engagement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-purple-600" />
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
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">+{avgGrowth.toFixed(1)}%</p>
                      <p className="text-sm text-muted-foreground">Growth Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="comparison" className="space-y-6">
              <TabsList>
                <TabsTrigger value="comparison">Content Comparison</TabsTrigger>
                <TabsTrigger value="timing">Optimal Timing</TabsTrigger>
                <TabsTrigger value="virality">Virality Analysis</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="content">Content Feed</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Content Comparison */}
              <TabsContent value="comparison">
                <ContentComparison />
              </TabsContent>

              {/* Optimal Posting Time */}
              <TabsContent value="timing">
                <OptimalPostingTime />
              </TabsContent>

              {/* Virality Analysis */}
              <TabsContent value="virality">
                <ViralityAnalysis />
              </TabsContent>

              {/* Platform Overview */}
              <TabsContent value="platforms">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {platformData.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <Card key={platform.platform}>
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${platform.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{platform.platform}</CardTitle>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">+{platform.growth}%</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Followers</span>
                              <span className="font-medium">{platform.followers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Following</span>
                              <span className="font-medium">{platform.following.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Posts</span>
                              <span className="font-medium">{platform.posts}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Engagement</span>
                              <span className="font-medium">{platform.engagement}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Reach</span>
                              <span className="font-medium">{platform.reach.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Impressions</span>
                              <span className="font-medium">{platform.impressions.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full mt-4">
                            View Details
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              {/* Content Feed */}
              <TabsContent value="content">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Content</CardTitle>
                      <div className="flex items-center gap-2">
                        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Platforms</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="image">Images</SelectItem>
                            <SelectItem value="video">Videos</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="link">Links</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="recent">Most Recent</SelectItem>
                            <SelectItem value="engagement">Most Engaging</SelectItem>
                            <SelectItem value="likes">Most Liked</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {filteredPosts.map((post) => {
                          const Icon = contentTypeIcons[post.type];
                          const platformIcon = mockPlatformData.find(p => p.platform === post.platform)?.icon || Instagram;
                          const PlatformIcon = platformIcon;
                          
                          return (
                            <div key={post.id} className="border rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                  <PlatformIcon className="w-4 h-4" />
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-medium">{post.platform}</span>
                                    <Badge variant="outline" className="text-xs">
                                      <Icon className="w-3 h-3 mr-1" />
                                      {post.type}
                                    </Badge>
                                    <Badge 
                                      variant="secondary" 
                                      className={`text-xs ${performanceColors[post.performance]}`}
                                    >
                                      {post.performance}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground ml-auto">
                                      {post.publishedAt.toLocaleString()}
                                    </span>
                                  </div>
                                  
                                  <p className="text-sm mb-3">{post.content}</p>
                                  
                                  {post.imageUrl && (
                                    <div className="w-full h-48 bg-muted rounded-lg mb-3 flex items-center justify-center">
                                      <Image className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                      <Heart className="w-4 h-4" />
                                      <span>{post.metrics.likes.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MessageSquare className="w-4 h-4" />
                                      <span>{post.metrics.comments}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Share2 className="w-4 h-4" />
                                      <span>{post.metrics.shares}</span>
                                    </div>
                                    {post.metrics.views && (
                                      <div className="flex items-center gap-1">
                                        <Eye className="w-4 h-4" />
                                        <span>{post.metrics.views.toLocaleString()}</span>
                                      </div>
                                    )}
                                    <div className="flex items-center gap-1 ml-auto">
                                      <BarChart3 className="w-4 h-4" />
                                      <span className="font-medium">{post.metrics.engagement}%</span>
                                    </div>
                                  </div>
                                  
                                  {post.url && (
                                    <Button variant="outline" size="sm" className="mt-2">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      View Post
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                          <p>Performance trends chart would be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Content Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                          <PieChart className="w-12 h-12 mx-auto mb-4" />
                          <p>Content type distribution chart would be displayed here</p>
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
