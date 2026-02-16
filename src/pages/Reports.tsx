import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { AIInsightsSummary } from '@/components/dashboard/AIInsightsSummary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileBarChart, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Filter,
  Eye,
  Share,
  BarChart3,
  PieChart,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Clock
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'custom';
  dateRange: string;
  generatedAt: Date;
  status: 'completed' | 'generating' | 'scheduled';
  platforms: string[];
  metrics: {
    totalEngagement: number;
    followerGrowth: number;
    postCount: number;
    reach: number;
  };
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Weekly Performance Report',
    type: 'weekly',
    dateRange: 'Dec 8 - Dec 14, 2024',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    status: 'completed',
    platforms: ['Instagram', 'Twitter', 'LinkedIn'],
    metrics: {
      totalEngagement: 15420,
      followerGrowth: 8.5,
      postCount: 21,
      reach: 125000
    }
  },
  {
    id: '2',
    name: 'Monthly Analytics Summary',
    type: 'monthly',
    dateRange: 'November 2024',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    status: 'completed',
    platforms: ['Instagram', 'Twitter', 'LinkedIn', 'Facebook'],
    metrics: {
      totalEngagement: 68900,
      followerGrowth: 15.2,
      postCount: 84,
      reach: 520000
    }
  },
  {
    id: '3',
    name: 'Campaign Performance Report',
    type: 'custom',
    dateRange: 'Nov 15 - Dec 15, 2024',
    generatedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    status: 'completed',
    platforms: ['Instagram', 'Twitter'],
    metrics: {
      totalEngagement: 32100,
      followerGrowth: 12.8,
      postCount: 35,
      reach: 280000
    }
  }
];

export default function Reports() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedReport, setSelectedReport] = useState<Report | null>(mockReports[0]);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleGenerateReport = (type: 'weekly' | 'monthly' | 'custom') => {
    const newReport: Report = {
      id: Date.now().toString(),
      name: `${type === 'weekly' ? 'Weekly' : type === 'monthly' ? 'Monthly' : 'Custom'} Report`,
      type,
      dateRange: type === 'weekly' ? 'Dec 15 - Dec 21, 2024' : type === 'monthly' ? 'December 2024' : 'Custom Range',
      generatedAt: new Date(),
      status: 'generating',
      platforms: ['Instagram', 'Twitter', 'LinkedIn'],
      metrics: {
        totalEngagement: 0,
        followerGrowth: 0,
        postCount: 0,
        reach: 0
      }
    };
    
    setReports(prev => [newReport, ...prev]);
    
    setTimeout(() => {
      setReports(prev => 
        prev.map(r => 
          r.id === newReport.id 
            ? { 
                ...r, 
                status: 'completed',
                metrics: {
                  totalEngagement: Math.floor(Math.random() * 50000) + 10000,
                  followerGrowth: Math.random() * 20 + 5,
                  postCount: Math.floor(Math.random() * 50) + 10,
                  reach: Math.floor(Math.random() * 300000) + 100000
                }
              }
            : r
        )
      );
    }, 3000);
  };

  const filteredReports = reports.filter(report => {
    if (timeFilter !== 'all') {
      if (timeFilter === 'weekly' && report.type !== 'weekly') return false;
      if (timeFilter === 'monthly' && report.type !== 'monthly') return false;
      if (timeFilter === 'custom' && report.type !== 'custom') return false;
    }
    return true;
  });

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Reports & Analytics</h1>
                <p className="text-muted-foreground">
                  Comprehensive analytics and AI-powered insights
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={() => handleGenerateReport('weekly')}>
                  <FileBarChart className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </div>

            <Tabs defaultValue="insights" className="space-y-6">
              <TabsList>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="reports">Report Library</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="insights">
                <AIInsightsSummary />
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card>
                      <CardHeader>
                        <CardTitle>Report Library</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="h-[600px]">
                          <div className="p-4 space-y-3">
                            {filteredReports.map((report) => (
                              <div
                                key={report.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                  selectedReport?.id === report.id
                                    ? 'border-primary bg-primary/5'
                                    : 'hover:bg-muted/50'
                                }`}
                                onClick={() => setSelectedReport(report)}
                              >
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm">{report.name}</h4>
                                  <Badge
                                    variant={report.status === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {report.status}
                                  </Badge>
                                </div>
                                
                                <p className="text-xs text-muted-foreground mb-2">
                                  {report.dateRange}
                                </p>
                                
                                <div className="flex items-center gap-2 mb-2">
                                  {report.platforms.map((platform, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {platform}
                                    </Badge>
                                  ))}
                                </div>
                                
                                <p className="text-xs text-muted-foreground">
                                  {report.generatedAt.toLocaleDateString()}
                                </p>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    {selectedReport ? (
                      <Card>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle>{selectedReport.name}</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Share className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                          <p className="text-muted-foreground">
                            {selectedReport.dateRange} • Generated on {selectedReport.generatedAt.toLocaleDateString()}
                          </p>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Heart className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold">
                                      {selectedReport.metrics.totalEngagement.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">Total Engagement</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card>
                              <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Users className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div>
                                    <p className="text-2xl font-bold">
                                      {selectedReport.metrics.followerGrowth.toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-muted-foreground">Follower Growth</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-12">
                          <div className="text-center text-muted-foreground">
                            <FileBarChart className="w-12 h-12 mx-auto mb-4" />
                            <p>Select a report to view details</p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

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
