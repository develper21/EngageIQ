import { Heart, MessageCircle, Share2, Eye, Youtube, Instagram, Twitter } from 'lucide-react';

const activities = [
  {
    platform: 'Instagram',
    platformIcon: Instagram,
    platformColor: 'text-pink-500',
    action: 'Your Reel went viral!',
    metric: '125K views',
    time: '2 hours ago',
    icon: Eye,
  },
  {
    platform: 'YouTube',
    platformIcon: Youtube,
    platformColor: 'text-red-500',
    action: 'New comment milestone',
    metric: '1K comments',
    time: '4 hours ago',
    icon: MessageCircle,
  },
  {
    platform: 'Twitter',
    platformIcon: Twitter,
    platformColor: 'text-sky-400',
    action: 'High engagement post',
    metric: '2.5K likes',
    time: '6 hours ago',
    icon: Heart,
  },
  {
    platform: 'Instagram',
    platformIcon: Instagram,
    platformColor: 'text-pink-500',
    action: 'Carousel shared',
    metric: '450 shares',
    time: '8 hours ago',
    icon: Share2,
  },
];

export function RecentActivity() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">Latest updates across platforms</p>
        </div>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const PlatformIcon = activity.platformIcon;
          const ActionIcon = activity.icon;
          
          return (
            <div 
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl bg-muted/20 border border-white/5 hover:border-white/10 transition-all opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <PlatformIcon className={`w-5 h-5 ${activity.platformColor}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <ActionIcon className="w-4 h-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">{activity.platform}</p>
              </div>

              <div className="text-right">
                <p className="font-display font-semibold text-primary">{activity.metric}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
