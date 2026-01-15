import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Zap, 
  Eye, 
  Heart, 
  Share2,
  MessageSquare,
  Users,
  Target,
  Clock,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';

interface ViralPost {
  id: string;
  content: string;
  platform: string;
  type: 'reel' | 'carousel' | 'static';
  publishedAt: Date;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    engagement: number;
    reach: number;
  };
  viralScore: number;
  viralityFactors: string[];
  status: 'viral' | 'trending' | 'moderate' | 'low';
}

interface ViralityPattern {
  factor: string;
  description: string;
  impact: number;
  frequency: number;
  recommendation: string;
}

const mockViralPosts: ViralPost[] = [
  {
    id: '1',
    content: '10 social media myths that are actually hurting your growth 🚀',
    platform: 'Instagram',
    type: 'reel',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    metrics: {
      views: 125000,
      likes: 8500,
      comments: 340,
      shares: 280,
      saves: 420,
      engagement: 8.9,
      reach: 250000
    },
    viralScore: 92,
    viralityFactors: [
      'Controversial topic',
      'Educational value',
      'Optimal timing (8:15 PM)',
      'Trending hashtags',
      'Video format'
    ],
    status: 'viral'
  },
  {
    id: '2',
    content: 'The ultimate guide to content creation in 2024 ✨',
    platform: 'Instagram',
    type: 'carousel',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    metrics: {
      views: 68000,
      likes: 4200,
      comments: 180,
      shares: 120,
      saves: 890,
      engagement: 6.2,
      reach: 145000
    },
    viralScore: 78,
    viralityFactors: [
      'High-value content',
      'Save-worthy information',
      'Multi-slide format',
      'Clear call-to-action'
    ],
    status: 'trending'
  },
  {
    id: '3',
    content: 'Behind the scenes of my content creation process 🎬',
    platform: 'Instagram',
    type: 'reel',
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
    metrics: {
      views: 45000,
      likes: 2800,
      comments: 95,
      shares: 45,
      saves: 120,
      engagement: 6.8,
      reach: 89000
    },
    viralScore: 65,
    viralityFactors: [
      'Authentic content',
      'Behind-the-scenes',
      'Relatable experience'
    ],
    status: 'moderate'
  }
];

const mockViralityPatterns: ViralityPattern[] = [
  {
    factor: 'Educational Content',
    description: 'Posts that teach valuable skills or share knowledge',
    impact: 85,
    frequency: 12,
    recommendation: 'Create more how-to and educational content series'
  },
  {
    factor: 'Controversial Topics',
    description: 'Content that challenges common beliefs or debates',
    impact: 92,
    frequency: 3,
    recommendation: 'Handle controversial topics carefully with balanced perspectives'
  },
  {
    factor: 'Trending Hashtags',
    description: 'Using currently trending and relevant hashtags',
    impact: 68,
    frequency: 8,
    recommendation: 'Research and use 3-5 trending hashtags per post'
  },
  {
    factor: 'Video Format',
    description: 'Reels and video content generally perform better',
    impact: 78,
    frequency: 15,
    recommendation: 'Prioritize video content, especially Reels format'
  },
  {
    factor: 'Emotional Triggers',
    description: 'Content that evokes strong emotions',
    impact: 88,
    frequency: 6,
    recommendation: 'Create content that inspires, motivates, or entertains emotionally'
  }
];

const getStatusColor = (status: ViralPost['status']) => {
  switch (status) {
    case 'viral': return 'bg-green-100 text-green-700 border-green-200';
    case 'trending': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'moderate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'low': return 'bg-gray-100 text-gray-700 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusIcon = (status: ViralPost['status']) => {
  switch (status) {
    case 'viral': return TrendingUp;
    case 'trending': return Zap;
    case 'moderate': return BarChart3;
    case 'low': return AlertTriangle;
    default: return BarChart3;
  }
};

export function ViralityAnalysis() {
  const viralPosts = mockViralPosts.sort((a, b) => b.viralScore - a.viralScore);
  const topViralPost = viralPosts[0];
  const avgViralScore = viralPosts.reduce((sum, post) => sum + post.viralScore, 0) / viralPosts.length;
  
  const highImpactPatterns = mockViralityPatterns.filter(pattern => pattern.impact >= 80);
  const frequentPatterns = mockViralityPatterns.filter(pattern => pattern.frequency >= 8);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Virality Pattern Analysis
          </h3>
          <p className="text-muted-foreground">
            AI-powered detection of viral content patterns and factors
          </p>
        </div>
        
        <Button variant="outline">
          <Target className="w-4 h-4 mr-2" />
          Create Viral Content
        </Button>
      </div>

      {/* Viral Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {topViralPost.viralScore}
                </p>
                <p className="text-sm text-green-600">Highest Viral Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">
                  {avgViralScore.toFixed(0)}
                </p>
                <p className="text-sm text-blue-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-700">
                  {(topViralPost.metrics.views / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-purple-600">Peak Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {topViralPost.metrics.shares}
                </p>
                <p className="text-sm text-orange-600">Max Shares</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viral Posts Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Viral Content Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {viralPosts.map((post) => {
                const StatusIcon = getStatusIcon(post.status);
                return (
                  <div
                    key={post.id}
                    className={`p-4 border rounded-lg ${getStatusColor(post.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center flex-shrink-0">
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {post.platform}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {post.type}
                          </Badge>
                          <Badge 
                            variant={post.status === 'viral' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            Viral Score: {post.viralScore}
                          </Badge>
                        </div>
                        
                        <p className="text-sm font-medium mb-2 line-clamp-2">
                          {post.content}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{(post.metrics.views / 1000).toFixed(0)}K views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            <span>{post.metrics.likes.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            <span>{post.metrics.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-3 h-3" />
                            <span>{post.metrics.shares}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs font-medium">Virality Factors:</p>
                          <div className="flex flex-wrap gap-1">
                            {post.viralityFactors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mt-2">
                          {post.publishedAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Virality Patterns */}
        <Card>
          <CardHeader>
            <CardTitle>Detected Virality Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockViralityPatterns.map((pattern, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{pattern.factor}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        Impact: {pattern.impact}%
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {pattern.frequency} times
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {pattern.description}
                  </p>
                  
                  <div className="p-2 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                      <strong>AI Recommendation:</strong> {pattern.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Virality Strategy */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            AI Virality Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">High-Impact Factors</h4>
              <div className="space-y-2">
                {highImpactPatterns.map((pattern, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-background rounded">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{pattern.factor}</span>
                    <Badge variant="secondary" className="text-xs">
                      {pattern.impact}% impact
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Content Strategy</h4>
              <div className="space-y-2 text-sm">
                <p>• <strong>Educational content:</strong> 85% virality impact rate</p>
                <p>• <strong>Controversial topics:</strong> Highest engagement but use sparingly</p>
                <p>• <strong>Video format:</strong> 78% more likely to go viral</p>
                <p>• <strong>Emotional triggers:</strong> Key for shareability</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              <strong>Virality Formula:</strong> Educational Value + Emotional Trigger + Optimal Timing + Trending Hashtags = High Viral Potential
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
