import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Play, 
  Image, 
  Layers, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2,
  Clock,
  Target
} from 'lucide-react';

interface ContentFormat {
  type: 'reels' | 'carousels' | 'static';
  label: string;
  icon: React.ElementType;
  color: string;
  posts: number;
  avgEngagement: number;
  totalReach: number;
  bestPerformingTime: string;
  growth: number;
}

interface ComparisonMetric {
  metric: string;
  reels: number;
  carousels: number;
  static: number;
  unit: string;
}

const mockContentFormats: ContentFormat[] = [
  {
    type: 'reels',
    label: 'Reels',
    icon: Play,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    posts: 45,
    avgEngagement: 8.9,
    totalReach: 125000,
    bestPerformingTime: '7-9 PM',
    growth: 15.2
  },
  {
    type: 'carousels',
    label: 'Carousels',
    icon: Layers,
    color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    posts: 78,
    avgEngagement: 6.4,
    totalReach: 98000,
    bestPerformingTime: '12-2 PM',
    growth: 8.7
  },
  {
    type: 'static',
    label: 'Static Posts',
    icon: Image,
    color: 'bg-gradient-to-r from-green-500 to-emerald-500',
    posts: 156,
    avgEngagement: 3.2,
    totalReach: 65000,
    bestPerformingTime: '10-11 AM',
    growth: 2.1
  }
];

const comparisonMetrics: ComparisonMetric[] = [
  { metric: 'Avg Engagement Rate', reels: 8.9, carousels: 6.4, static: 3.2, unit: '%' },
  { metric: 'Total Reach', reels: 125000, carousels: 98000, static: 65000, unit: '' },
  { metric: 'Avg Likes per Post', reels: 1250, carousels: 890, static: 420, unit: '' },
  { metric: 'Avg Comments per Post', reels: 89, carousels: 67, static: 23, unit: '' },
  { metric: 'Avg Shares per Post', reels: 45, carousels: 34, static: 12, unit: '' },
  { metric: 'Completion Rate', reels: 78, carousels: 65, static: 92, unit: '%' }
];

export function ContentComparison() {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('engagement');

  const getBestFormat = (metric: string) => {
    const metricIndex = comparisonMetrics.findIndex(m => m.metric.toLowerCase().includes(metric.toLowerCase()));
    if (metricIndex === -1) return null;
    
    const metricData = comparisonMetrics[metricIndex];
    const formats = [
      { name: 'Reels', value: metricData.reels },
      { name: 'Carousels', value: metricData.carousels },
      { name: 'Static', value: metricData.static }
    ];
    
    return formats.reduce((best, current) => current.value > best.value ? current : best);
  };

  const getRecommendation = () => {
    const bestEngagement = getBestFormat('engagement');
    const bestReach = getBestFormat('reach');
    
    return {
      primary: `Focus on ${bestEngagement?.name} for maximum engagement (${bestEngagement?.value}${comparisonMetrics.find(m => m.metric.includes('Engagement'))?.unit})`,
      secondary: `Use ${bestReach?.name} for broader reach (${(bestReach?.value / 1000).toFixed(0)}K)`,
      insight: 'Reels show 2.8x better engagement than static posts'
    };
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Format Comparison</h2>
          <p className="text-muted-foreground">Analyze performance across different content types</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Detailed Analysis
          </Button>
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm font-medium text-primary mb-1">Primary Strategy</p>
              <p className="text-sm">{recommendation.primary}</p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm font-medium text-blue-600 mb-1">Reach Strategy</p>
              <p className="text-sm">{recommendation.secondary}</p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm font-medium text-green-600 mb-1">Key Insight</p>
              <p className="text-sm">{recommendation.insight}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockContentFormats.map((format) => {
          const Icon = format.icon;
          return (
            <Card key={format.type} className="relative overflow-hidden">
              <div className={`h-2 ${format.color}`} />
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${format.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{format.label}</CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{format.posts} posts</span>
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{format.growth}%
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Engagement</span>
                    <span className="font-medium">{format.avgEngagement}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Reach</span>
                    <span className="font-medium">{(format.totalReach / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Best Time</span>
                    <span className="font-medium">{format.bestPerformingTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="engagement" className="space-y-4">
            <TabsList>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="reach">Reach & Impressions</TabsTrigger>
              <TabsTrigger value="timing">Timing Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="engagement" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Comparison Table */}
                <div>
                  <h4 className="font-medium mb-3">Engagement Metrics</h4>
                  <div className="space-y-3">
                    {comparisonMetrics.slice(0, 4).map((metric) => (
                      <div key={metric.metric} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric.metric}</span>
                          <span className="font-medium">
                            {metric.unit === '%' && metric.reels > metric.carousels && metric.reels > metric.static && '🏆 '}
                            {metric.reels}{metric.unit}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-xs text-purple-600">Reels</div>
                            <div className="font-medium">{metric.reels}{metric.unit}</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-xs text-blue-600">Carousels</div>
                            <div className="font-medium">{metric.carousels}{metric.unit}</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-xs text-green-600">Static</div>
                            <div className="font-medium">{metric.static}{metric.unit}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visual Comparison */}
                <div>
                  <h4 className="font-medium mb-3">Performance Distribution</h4>
                  <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="text-center text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4" />
                      <p>Interactive comparison chart</p>
                      <p className="text-sm">Showing engagement distribution</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reach" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Reach Metrics</h4>
                  <div className="space-y-3">
                    {comparisonMetrics.slice(1, 3).map((metric) => (
                      <div key={metric.metric} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{metric.metric}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-purple-50 rounded">
                            <div className="text-xs text-purple-600">Reels</div>
                            <div className="font-medium">{(metric.reels / 1000).toFixed(0)}K</div>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-xs text-blue-600">Carousels</div>
                            <div className="font-medium">{(metric.carousels / 1000).toFixed(0)}K</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-xs text-green-600">Static</div>
                            <div className="font-medium">{(metric.static / 1000).toFixed(0)}K</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Reach Analysis</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Play className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">Reels</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Highest reach with 125K total impressions. Best for brand awareness and viral potential.
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Layers className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Carousels</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Balanced reach with good engagement. Ideal for detailed storytelling.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="timing" className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">Optimal Posting Times by Format</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockContentFormats.map((format) => {
                    const Icon = format.icon;
                    return (
                      <Card key={format.type}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <div className={`w-8 h-8 rounded ${format.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-medium">{format.label}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">Best Time: {format.bestPerformingTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm">Growth: +{format.growth}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
