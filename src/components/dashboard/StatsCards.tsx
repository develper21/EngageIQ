import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle } from 'lucide-react';

const stats = [
  {
    label: 'Total Followers',
    value: '124.5K',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    label: 'Total Reach',
    value: '2.3M',
    change: '+18.2%',
    trend: 'up',
    icon: Eye,
    color: 'text-chart-2',
    bgColor: 'bg-chart-2/10',
  },
  {
    label: 'Engagement Rate',
    value: '4.8%',
    change: '+2.1%',
    trend: 'up',
    icon: Heart,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    label: 'Comments',
    value: '8.2K',
    change: '-3.4%',
    trend: 'down',
    icon: MessageCircle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
        
        return (
          <div 
            key={stat.label}
            className="stat-card opacity-0 animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                <TrendIcon className="w-4 h-4" />
                <span>{stat.change}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
            <p className="font-display text-3xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
