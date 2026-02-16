import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Target, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

interface Insight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: string;
  confidence: number;
}

interface AIInsightSummary {
  period: string;
  totalInsights: number;
  keyMetrics: {
    engagementChange: number;
    reachChange: number;
    bestPerformingFormat: string;
    optimalPostingTime: string;
  };
  insights: Insight[];
  recommendations: string[];
}

const mockAIInsights: AIInsightSummary = {
  period: 'Last 30 Days',
  totalInsights: 8,
  keyMetrics: {
    engagementChange: 24.5,
    reachChange: 18.2,
    bestPerformingFormat: 'Reels',
    optimalPostingTime: '7-9 PM'
  },
  insights: [
    {
      id: '1',
      type: 'success',
      title: 'Engagement Growth Detected',
      description: 'Your engagement rate increased by 24.5% this month, driven by video content performance.',
      impact: 'high',
      actionable: false,
      confidence: 95
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Untapped Potential in Carousels',
      description: 'Carousel posts receive 3.2x more saves than other formats. Educational content performs best.',
      impact: 'high',
      actionable: true,
      action: 'Create weekly educational carousel series',
      confidence: 88
    },
    {
      id: '3',
      type: 'warning',
      title: 'Posting Time Inconsistency',
      description: 'Posts published outside 7-9 PM window perform 45% worse. 30% of your posts were suboptimal.',
      impact: 'medium',
      actionable: true,
      action: 'Optimize posting schedule for peak hours',
      confidence: 92
    },
    {
      id: '4',
      type: 'recommendation',
      title: 'Content Diversification Needed',
      description: 'Video content dominates your strategy (68% of posts). Audience engagement varies by platform.',
      impact: 'medium',
      actionable: true,
      action: 'Balance content mix across formats',
      confidence: 78
    }
  ],
  recommendations: [
    'Focus on Reels during peak hours (7-9 PM) for maximum reach',
    'Create educational carousel series to increase saves and shares',
    'Maintain consistent posting schedule (3-4 posts per week)',
    'Experiment with behind-the-scenes content to boost authenticity',
    'Use trending hashtags in your niche to increase discoverability'
  ]
};

const getInsightIcon = (type: Insight['type']) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'opportunity': return TrendingUp;
    case 'warning': return AlertTriangle;
    case 'recommendation': return Lightbulb;
    default: return Brain;
  }
};

const getInsightColor = (type: Insight['type']) => {
  switch (type) {
    case 'success': return 'text-green-600 bg-green-100';
    case 'opportunity': return 'text-blue-600 bg-blue-100';
    case 'warning': return 'text-yellow-600 bg-yellow-100';
    case 'recommendation': return 'text-purple-600 bg-purple-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const getImpactColor = (impact: Insight['impact']) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-700';
    case 'medium': return 'bg-yellow-100 text-yellow-700';
    case 'low': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export function AIInsightsSummary() {
  const { period, keyMetrics, insights, recommendations } = mockAIInsights;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Powered Insights
          </h3>
          <p className="text-muted-foreground">
            Automated analysis and strategic recommendations for {period}
          </p>
        </div>
        
        <Badge variant="secondary" className="text-sm">
          {mockAIInsights.totalInsights} Insights Generated
        </Badge>
      </div>

      {/* Key Metrics Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-2xl font-bold">+{keyMetrics.engagementChange}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Engagement Growth</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-2xl font-bold">+{keyMetrics.reachChange}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Reach Increase</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="w-4 h-4 text-purple-500" />
                <span className="text-2xl font-bold">{keyMetrics.bestPerformingFormat}</span>
              </div>
              <p className="text-sm text-muted-foreground">Best Format</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="text-2xl font-bold">{keyMetrics.optimalPostingTime}</span>
              </div>
              <p className="text-sm text-muted-foreground">Peak Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight) => {
                const Icon = getInsightIcon(insight.type);
                return (
                  <div
                    key={insight.id}
                    className="p-4 border rounded-lg space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant="outline" className={getImpactColor(insight.impact)}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">
                          {insight.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Confidence: {insight.confidence}%
                            </span>
                            {insight.actionable && (
                              <Badge variant="secondary" className="text-xs">
                                Actionable
                              </Badge>
                            )}
                          </div>
                          
                          {insight.action && (
                            <Button variant="outline" size="sm">
                              {insight.action}
                              <ArrowRight className="w-3 h-3 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategic Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 border rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-primary">{index + 1}</span>
                  </div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-600">Pro Tip</span>
              </div>
              <p className="text-sm text-blue-700">
                Implement these recommendations gradually and track performance changes. 
                Focus on high-impact items first for maximum results.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Action Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-green-600">Immediate (This Week)</h4>
              <ul className="text-sm space-y-1">
                <li>• Optimize posting schedule for 7-9 PM</li>
                <li>• Create 2 educational carousels</li>
                <li>• Review underperforming posts</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-blue-600">Short-term (Next 2 Weeks)</h4>
              <ul className="text-sm space-y-1">
                <li>• Launch weekly content series</li>
                <li>• Experiment with video formats</li>
                <li>• Update hashtag strategy</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2 text-purple-600">Long-term (Next Month)</h4>
              <ul className="text-sm space-y-1">
                <li>• Diversify content mix</li>
                <li>• Develop brand consistency</li>
                <li>• Build content calendar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
