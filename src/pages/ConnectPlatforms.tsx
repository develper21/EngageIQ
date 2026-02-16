import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Youtube, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook,
  Music,
  CheckCircle, 
  ExternalLink,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  AlertCircle
} from 'lucide-react';

interface Platform {
  id: string;
  name: string; 
  icon: React.ElementType;
  color: string; 
  bg: string;
  description: string;
  connected: boolean;
  followers?: number;
  posts?: number;
  engagement?: number;
  lastSync?: Date;
}

const platforms: Platform[] = [
  { 
    id: 'youtube',
    name: 'YouTube', 
    icon: Youtube, 
    color: 'text-red-500', 
    bg: 'bg-red-500/10',
    description: 'Connect your YouTube channel to track video performance, subscribers, and engagement.',
    connected: false,
  },
  { 
    id: 'instagram',
    name: 'Instagram', 
    icon: Instagram, 
    color: 'text-pink-500', 
    bg: 'bg-pink-500/10',
    description: 'Link your Instagram account to analyze posts, reels, and story performance.',
    connected: true,
    followers: 15420,
    posts: 342,
    engagement: 4.8,
    lastSync: new Date(Date.now() - 1000 * 60 * 30)
  },
  { 
    id: 'twitter',
    name: 'Twitter/X', 
    icon: Twitter, 
    color: 'text-sky-400', 
    bg: 'bg-sky-400/10',
    description: 'Connect Twitter/X to monitor tweets, engagement, and follower growth.',
    connected: true,
    followers: 8750,
    posts: 1250,
    engagement: 3.2,
    lastSync: new Date(Date.now() - 1000 * 60 * 45)
  },
  { 
    id: 'linkedin',
    name: 'LinkedIn', 
    icon: Linkedin, 
    color: 'text-blue-600', 
    bg: 'bg-blue-600/10',
    description: 'Connect LinkedIn for professional networking analytics and content performance.',
    connected: false,
  },
  { 
    id: 'facebook',
    name: 'Facebook', 
    icon: Facebook, 
    color: 'text-blue-700', 
    bg: 'bg-blue-700/10',
    description: 'Link your Facebook page to track post performance and audience insights.',
    connected: false,
  },
  { 
    id: 'tiktok',
    name: 'TikTok', 
    icon: Music, 
    color: 'text-black', 
    bg: 'bg-gray-100',
    description: 'Connect TikTok to analyze short-form video performance and viral content.',
    connected: false,
  }
];

export default function ConnectPlatforms() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [platformsState, setPlatformsState] = useState<Platform[]>(platforms);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleConnect = async (platformId: string) => {
    setConnectingPlatform(platformId);
    
    // Simulate API connection process
    setTimeout(() => {
      setPlatformsState(prev => 
        prev.map(platform => 
          platform.id === platformId 
            ? { 
                ...platform, 
                connected: true,
                followers: Math.floor(Math.random() * 50000) + 1000,
                posts: Math.floor(Math.random() * 500) + 50,
                engagement: Math.random() * 8 + 2,
                lastSync: new Date()
              }
            : platform
        )
      );
      setConnectingPlatform(null);
    }, 2000);
  };

  const handleDisconnect = async (platformId: string) => {
    setPlatformsState(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, connected: false, followers: undefined, posts: undefined, engagement: undefined }
          : platform
      )
    );
  };

  const handleSync = async (platformId: string) => {
    setPlatformsState(prev => 
      prev.map(platform => 
        platform.id === platformId 
          ? { ...platform, lastSync: new Date() }
          : platform
      )
    );
  };

  const connectedPlatforms = platformsState.filter(p => p.connected);
  const totalFollowers = connectedPlatforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  const totalPosts = connectedPlatforms.reduce((sum, p) => sum + (p.posts || 0), 0);
  const avgEngagement = connectedPlatforms.length > 0 
    ? connectedPlatforms.reduce((sum, p) => sum + (p.engagement || 0), 0) / connectedPlatforms.length 
    : 0;

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
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Connect Social Platforms</h1>
              <p className="text-muted-foreground">
                Connect your social media accounts to unlock comprehensive analytics and AI-powered insights
              </p>
            </div>

            {/* Connection Stats */}
            {connectedPlatforms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{connectedPlatforms.length}</p>
                        <p className="text-sm text-muted-foreground">Connected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-600" />
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
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Eye className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalPosts.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Posts</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{avgEngagement.toFixed(1)}%</p>
                        <p className="text-sm text-muted-foreground">Avg Engagement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Platform Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {platformsState.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Card key={platform.id} className={platform.connected ? 'border-green-200 bg-green-50' : ''}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${platform.bg} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${platform.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{platform.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            {platform.connected && (
                              <Badge variant="default" className="text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Connected
                              </Badge>
                            )}
                            {platform.lastSync && (
                              <Badge variant="outline" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Synced {Math.floor((Date.now() - platform.lastSync.getTime()) / (1000 * 60))}m ago
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        {platform.description}
                      </p>
                      
                      {platform.connected ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="text-center">
                              <p className="font-medium">{(platform.followers || 0).toLocaleString()}</p>
                              <p className="text-muted-foreground">Followers</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{platform.posts || 0}</p>
                              <p className="text-muted-foreground">Posts</p>
                            </div>
                            <div className="text-center">
                              <p className="font-medium">{platform.engagement?.toFixed(1) || 0}%</p>
                              <p className="text-muted-foreground">Engagement</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleSync(platform.id)}
                              className="flex-1"
                            >
                              <Clock className="w-4 h-4 mr-2" />
                              Sync Now
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDisconnect(platform.id)}
                            >
                              Disconnect
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-yellow-700">
                              <AlertCircle className="w-4 h-4" />
                              <span>Not connected - Missing analytics data</span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => handleConnect(platform.id)}
                            disabled={connectingPlatform === platform.id}
                            className="w-full"
                          >
                            {connectingPlatform === platform.id ? (
                              <>
                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Connect {platform.name}
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Benefits Section */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>Why Connect Your Accounts?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">🎯 Advanced Analytics</h4>
                    <p className="text-sm text-muted-foreground">
                      Get detailed insights across all your platforms in one unified dashboard.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">🤖 AI-Powered Insights</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive personalized recommendations based on your actual performance data.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">⏰ Optimal Timing</h4>
                    <p className="text-sm text-muted-foreground">
                      Discover the best times to post based on your audience behavior patterns.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">📈 Growth Tracking</h4>
                    <p className="text-sm text-muted-foreground">
                      Monitor follower growth, engagement trends, and content performance over time.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
