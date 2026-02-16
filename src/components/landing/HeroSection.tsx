import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, Zap, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 opacity-0 animate-fade-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Social Analytics</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 opacity-0 animate-fade-in stagger-1">
            Unlock the Power of
            <span className="block gradient-text">Social Analytics</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 opacity-0 animate-fade-in stagger-2">
            Connect all your social platforms in one unified dashboard. Get AI-powered insights, 
            track engagement patterns, and optimize your content strategy with data-driven decisions.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 opacity-0 animate-fade-in stagger-3">
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="hero-outline" size="xl">
              Watch Demo
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-0 animate-fade-in stagger-4">
            <StatPreview 
              icon={<BarChart3 className="w-6 h-6 text-primary" />}
              value="10M+"
              label="Posts Analyzed"
            />
            <StatPreview 
              icon={<TrendingUp className="w-6 h-6 text-success" />}
              value="45%"
              label="Avg. Engagement Boost"
            />
            <StatPreview 
              icon={<Zap className="w-6 h-6 text-warning" />}
              value="Real-time"
              label="AI Insights"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatPreview({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="glass-card-hover p-6 text-center">
      <div className="flex justify-center mb-3">{icon}</div>
      <div className="font-display text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
