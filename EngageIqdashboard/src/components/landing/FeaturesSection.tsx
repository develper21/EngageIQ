import { 
  BarChart3, 
  Brain, 
  Globe, 
  MessageSquare, 
  TrendingUp, 
  Zap,
  FileBarChart,
  Bell
} from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: "Multi-Platform Integration",
    description: "Connect YouTube, Instagram, Twitter, TikTok, and more in one unified dashboard.",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track likes, comments, shares, reach, and engagement rate across all platforms.",
    color: "text-chart-2"
  },
  {
    icon: TrendingUp,
    title: "Performance Comparison",
    description: "Compare Reels vs Carousels vs Static posts to identify top-performing content types.",
    color: "text-success"
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get automated recommendations and strategic insights powered by advanced AI.",
    color: "text-warning"
  },
  {
    icon: MessageSquare,
    title: "Natural Language Queries",
    description: "Ask questions like 'Which post had the highest engagement?' and get instant answers.",
    color: "text-chart-5"
  },
  {
    icon: Zap,
    title: "Best Posting Time",
    description: "Discover optimal posting times based on your audience's activity patterns.",
    color: "text-primary"
  },
  {
    icon: FileBarChart,
    title: "Exportable Reports",
    description: "Generate comprehensive reports for planning and decision-making.",
    color: "text-chart-2"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get alerts for viral posts, engagement spikes, and important metrics.",
    color: "text-success"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to
            <span className="gradient-text"> Dominate Social</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Powerful features designed to help creators and businesses make data-driven decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const Icon = feature.icon;
  
  return (
    <div 
      className="glass-card-hover p-6 opacity-0 animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
    >
      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${feature.color}`} />
      </div>
      <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
      <p className="text-sm text-muted-foreground">{feature.description}</p>
    </div>
  );
}
