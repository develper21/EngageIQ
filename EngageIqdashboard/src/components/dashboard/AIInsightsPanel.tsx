import { Sparkles, TrendingUp, Clock, AlertCircle } from 'lucide-react';

const insights = [
  {
    icon: TrendingUp,
    title: 'Peak Performance',
    description: 'Your Reels posted on Saturdays get 2.3x more engagement.',
    type: 'success',
  },
  {
    icon: Clock,
    title: 'Best Posting Time',
    description: 'Posting between 6-8 PM leads to 40% higher reach.',
    type: 'info',
  },
  {
    icon: AlertCircle,
    title: 'Engagement Drop',
    description: 'Static posts have seen 15% less engagement this week.',
    type: 'warning',
  },
];

export function AIInsightsPanel() {
  return (
    <div className="glass-card p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">AI Insights</h3>
          <p className="text-xs text-muted-foreground">Smart recommendations</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          const bgColor = insight.type === 'success' 
            ? 'bg-success/10' 
            : insight.type === 'warning' 
            ? 'bg-warning/10' 
            : 'bg-primary/10';
          const iconColor = insight.type === 'success' 
            ? 'text-success' 
            : insight.type === 'warning' 
            ? 'text-warning' 
            : 'text-primary';

          return (
            <div 
              key={index}
              className="p-4 rounded-xl bg-muted/30 border border-white/5 hover:border-white/10 transition-colors opacity-0 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button className="w-full mt-4 p-3 rounded-xl border border-dashed border-white/10 text-sm text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
        Ask AI a question...
      </button>
    </div>
  );
}
