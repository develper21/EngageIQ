import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  TrendingUp, 
  Users, 
  Calendar,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface TimeSlot {
  hour: number;
  time: string;
  engagement: number;
  reach: number;
  followers: number;
  recommendation: string;
}

interface DayAnalysis {
  day: string;
  bestTime: string;
  avgEngagement: number;
  totalPosts: number;
  peakHours: TimeSlot[];
}

const mockTimeSlots: TimeSlot[] = [
  { hour: 6, time: '6-7 AM', engagement: 12, reach: 850, followers: 5, recommendation: 'Low activity - avoid posting' },
  { hour: 7, time: '7-8 AM', engagement: 18, reach: 1200, followers: 8, recommendation: 'Moderate activity - educational content' },
  { hour: 8, time: '8-9 AM', engagement: 25, reach: 1800, followers: 12, recommendation: 'Good activity - how-to content' },
  { hour: 9, time: '9-10 AM', engagement: 22, reach: 1600, followers: 10, recommendation: 'Good activity - business content' },
  { hour: 10, time: '10-11 AM', engagement: 28, reach: 2100, followers: 15, recommendation: 'High activity - trending topics' },
  { hour: 11, time: '11-12 PM', engagement: 24, reach: 1900, followers: 11, recommendation: 'Good activity - behind-the-scenes' },
  { hour: 12, time: '12-1 PM', engagement: 35, reach: 2800, followers: 20, recommendation: 'Peak activity - lunch break browsing' },
  { hour: 13, time: '1-2 PM', engagement: 32, reach: 2600, followers: 18, recommendation: 'High activity - inspirational content' },
  { hour: 14, time: '2-3 PM', engagement: 20, reach: 1500, followers: 9, recommendation: 'Moderate activity - quick tips' },
  { hour: 15, time: '3-4 PM', engagement: 18, reach: 1400, followers: 8, recommendation: 'Low activity - save important content' },
  { hour: 16, time: '4-5 PM', engagement: 15, reach: 1100, followers: 6, recommendation: 'Low activity - avoid posting' },
  { hour: 17, time: '5-6 PM', engagement: 22, reach: 1700, followers: 10, recommendation: 'Moderate activity - commute time' },
  { hour: 18, time: '6-7 PM', engagement: 45, reach: 3500, followers: 28, recommendation: 'Peak activity - prime time' },
  { hour: 19, time: '7-8 PM', engagement: 52, reach: 4200, followers: 32, recommendation: 'Peak activity - entertainment content' },
  { hour: 20, time: '8-9 PM', engagement: 48, reach: 3800, followers: 25, recommendation: 'Peak activity - storytelling' },
  { hour: 21, time: '9-10 PM', engagement: 38, reach: 3000, followers: 22, recommendation: 'High activity - wind-down content' },
  { hour: 22, time: '10-11 PM', engagement: 25, reach: 2000, followers: 12, recommendation: 'Moderate activity - late night browsing' },
  { hour: 23, time: '11-12 AM', engagement: 15, reach: 1200, followers: 7, recommendation: 'Low activity - save for tomorrow' }
];

const mockDayAnalysis: DayAnalysis[] = [
  {
    day: 'Monday',
    bestTime: '7-9 PM',
    avgEngagement: 4.2,
    totalPosts: 12,
    peakHours: mockTimeSlots.filter(slot => [18, 19, 20].includes(slot.hour))
  },
  {
    day: 'Tuesday',
    bestTime: '7-9 PM',
    avgEngagement: 5.8,
    totalPosts: 15,
    peakHours: mockTimeSlots.filter(slot => [18, 19, 20].includes(slot.hour))
  },
  {
    day: 'Wednesday',
    bestTime: '12-2 PM',
    avgEngagement: 4.5,
    totalPosts: 10,
    peakHours: mockTimeSlots.filter(slot => [12, 13].includes(slot.hour))
  },
  {
    day: 'Thursday',
    bestTime: '7-9 PM',
    avgEngagement: 6.1,
    totalPosts: 14,
    peakHours: mockTimeSlots.filter(slot => [18, 19, 20].includes(slot.hour))
  },
  {
    day: 'Friday',
    bestTime: '6-8 PM',
    avgEngagement: 5.2,
    totalPosts: 13,
    peakHours: mockTimeSlots.filter(slot => [18, 19].includes(slot.hour))
  },
  {
    day: 'Saturday',
    bestTime: '4-6 PM',
    avgEngagement: 3.8,
    totalPosts: 8,
    peakHours: mockTimeSlots.filter(slot => [16, 17, 18].includes(slot.hour))
  },
  {
    day: 'Sunday',
    bestTime: '4-6 PM',
    avgEngagement: 3.5,
    totalPosts: 7,
    peakHours: mockTimeSlots.filter(slot => [16, 17, 18].includes(slot.hour))
  }
];

const getEngagementColor = (engagement: number) => {
  if (engagement >= 45) return 'bg-green-500';
  if (engagement >= 30) return 'bg-blue-500';
  if (engagement >= 20) return 'bg-yellow-500';
  return 'bg-gray-300';
};

const getRecommendationIcon = (recommendation: string) => {
  if (recommendation.includes('Peak')) return CheckCircle;
  if (recommendation.includes('High')) return TrendingUp;
  if (recommendation.includes('Low')) return AlertCircle;
  return Clock;
};

export function OptimalPostingTime() {
  const bestOverallTime = mockTimeSlots.reduce((best, current) => 
    current.engagement > best.engagement ? current : best
  );

  const bestDay = mockDayAnalysis.reduce((best, current) => 
    current.avgEngagement > best.avgEngagement ? current : best
  );

  const primeTimeSlots = mockTimeSlots.filter(slot => slot.engagement >= 45);
  const highActivitySlots = mockTimeSlots.filter(slot => slot.engagement >= 30);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Optimal Posting Time Analysis
          </h3>
          <p className="text-muted-foreground">
            AI-powered analysis of your audience activity patterns
          </p>
        </div>
        
        <Button variant="outline">
          <Calendar className="w-4 h-4 mr-2" />
          Schedule Content
        </Button>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-700">Prime Time</p>
                <p className="text-sm text-green-600">{bestOverallTime.time}</p>
                <p className="text-xs text-green-600">
                  {bestOverallTime.engagement} avg engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-blue-700">Best Day</p>
                <p className="text-sm text-blue-600">{bestDay.day}</p>
                <p className="text-xs text-blue-600">
                  {bestDay.avgEngagement}% avg engagement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-purple-700">Peak Hours</p>
                <p className="text-sm text-purple-600">{primeTimeSlots.length} slots</p>
                <p className="text-xs text-purple-600">
                  {highActivitySlots.length} high-activity periods
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hourly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour Activity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visual Timeline */}
              <div>
                <h4 className="font-medium mb-3">Engagement Timeline</h4>
                <div className="space-y-2">
                  {mockTimeSlots.map((slot) => {
                    const Icon = getRecommendationIcon(slot.recommendation);
                    return (
                      <div key={slot.hour} className="flex items-center gap-3">
                        <div className="w-16 text-sm text-muted-foreground">
                          {slot.time}
                        </div>
                        <div className="flex-1 relative">
                          <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${getEngagementColor(slot.engagement)}`}
                              style={{ width: `${(slot.engagement / 52) * 100}%` }}
                            />
                          </div>
                        </div>
                        <div className="w-8 text-right">
                          <span className="text-sm font-medium">{slot.engagement}</span>
                        </div>
                        <div className="w-6 flex justify-center">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-medium mb-3">AI Recommendations</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-700">Prime Time Strategy</span>
                    </div>
                    <p className="text-sm text-green-600">
                      Post between 7-9 PM for maximum reach. Your audience is most active during evening hours.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-700">Content Timing</span>
                    </div>
                    <p className="text-sm text-blue-600">
                      Educational content performs best at 12-2 PM, entertainment content peaks in evening hours.
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                      <span className="font-medium text-yellow-700">Avoid These Times</span>
                    </div>
                    <p className="text-sm text-yellow-600">
                      6-7 AM and 4-5 PM show lowest engagement. Save important content for better times.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day-by-Day Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Performance Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockDayAnalysis.map((day) => (
              <div key={day.day} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{day.day}</h4>
                  <Badge 
                    variant={day.avgEngagement >= 5 ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {day.avgEngagement >= 5 ? 'Peak' : 'Moderate'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Best Time</span>
                    <span className="font-medium">{day.bestTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg Engagement</span>
                    <span className="font-medium">{day.avgEngagement}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Posts</span>
                    <span className="font-medium">{day.totalPosts}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Plan */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            AI-Generated Posting Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Optimal Schedule</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 bg-background rounded">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">7:00 PM - Prime posting time</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">12:30 PM - Educational content</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-background rounded">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <span className="text-sm">8:30 PM - Storytelling content</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Content Strategy</h4>
              <div className="space-y-2 text-sm">
                <p>• <strong>Tue/Thu evenings:</strong> High-impact content</p>
                <p>• <strong>Wed lunch:</strong> Educational posts</p>
                <p>• <strong>Weekend afternoons:</strong> Light entertainment</p>
                <p>• <strong>Morning posts:</strong> Quick tips only</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Pro Tip:</strong> This schedule is based on your audience's actual behavior. 
              Consistency is key - try to post within these optimal windows for best results.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
