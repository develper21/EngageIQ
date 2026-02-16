import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bell, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Calendar,
  Check,
  X,
  Filter,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'engagement' | 'mention' | 'follower' | 'system' | 'report';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  platform?: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'engagement',
    title: 'Post Performance Alert',
    message: 'Your latest Instagram post is performing 50% better than average with 2.5K likes and 180 comments.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    platform: 'Instagram',
    actionUrl: '/analytics'
  },
  {
    id: '2',
    type: 'mention',
    title: 'New Mention',
    message: '@techstartup mentioned you in a tweet about social media marketing trends.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    platform: 'Twitter',
    actionUrl: '/mentions'
  },
  {
    id: '3',
    type: 'follower',
    title: 'Milestone Reached',
    message: 'Congratulations! You\'ve gained 100 new followers this week on LinkedIn.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    platform: 'LinkedIn'
  },
  {
    id: '4',
    type: 'system',
    title: 'Weekly Report Ready',
    message: 'Your weekly performance report is now available with detailed insights and recommendations.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    actionUrl: '/reports'
  },
  {
    id: '5',
    type: 'report',
    title: 'AI Insights Available',
    message: 'New AI-powered insights are ready for your content strategy optimization.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    actionUrl: '/assistant'
  }
];

const notificationIcons = {
  engagement: TrendingUp,
  mention: MessageSquare,
  follower: Users,
  system: Bell,
  report: TrendingUp
};

const notificationColors = {
  engagement: 'text-green-500',
  mention: 'text-blue-500',
  follower: 'text-purple-500',
  system: 'text-gray-500',
  report: 'text-orange-500'
};

export default function Notifications() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Notifications</h1>
                <p className="text-muted-foreground">
                  Stay updated with your social media activities and insights
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead} variant="outline" size="sm">
                    <Check className="w-4 h-4 mr-2" />
                    Mark All Read
                  </Button>
                )}
                <Button onClick={clearAll} variant="outline" size="sm">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{notifications.length}</p>
                      <p className="text-sm text-muted-foreground">Total</p>
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
                      <p className="text-2xl font-bold">{unreadCount}</p>
                      <p className="text-sm text-muted-foreground">Unread</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-muted-foreground">This Week</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-muted-foreground">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({notifications.length})
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({unreadCount})
              </Button>
              <Button
                variant={filter === 'read' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read ({notifications.length - unreadCount})
              </Button>
            </div>

            {/* Notifications List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notifications found</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredNotifications.map((notification) => {
                        const Icon = notificationIcons[notification.type];
                        const colorClass = notificationColors[notification.type];
                        
                        return (
                          <div
                            key={notification.id}
                            className={`p-4 hover:bg-muted/50 transition-colors ${
                              !notification.read ? 'bg-blue-50/50' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-semibold text-sm">{notification.title}</h4>
                                  {!notification.read && (
                                    <Badge variant="secondary" className="text-xs">New</Badge>
                                  )}
                                  {notification.platform && (
                                    <Badge variant="outline" className="text-xs">
                                      {notification.platform}
                                    </Badge>
                                  )}
                                </div>
                                
                                <p className="text-sm text-muted-foreground mb-2">
                                  {notification.message}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <p className="text-xs text-muted-foreground">
                                    {notification.timestamp.toLocaleString()}
                                  </p>
                                  
                                  <div className="flex items-center gap-2">
                                    {notification.actionUrl && (
                                      <Button variant="ghost" size="sm" className="text-xs">
                                        View
                                      </Button>
                                    )}
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="text-xs"
                                      >
                                        <Check className="w-3 h-3 mr-1" />
                                        Mark Read
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteNotification(notification.id)}
                                      className="text-xs text-destructive hover:text-destructive"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
