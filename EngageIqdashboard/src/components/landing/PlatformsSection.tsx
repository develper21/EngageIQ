import { Youtube, Instagram, Twitter } from 'lucide-react';

const platforms = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
  { name: 'Twitter', icon: Twitter, color: 'text-sky-400', bg: 'bg-sky-400/10' },
];

export function PlatformsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-muted/30" />
      
      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Connect Your <span className="gradient-text">Favorite Platforms</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Integrate with all major social media platforms and consolidate your analytics in one place.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <div 
                key={platform.name}
                className="glass-card-hover p-8 flex flex-col items-center gap-4 min-w-[200px] opacity-0 animate-scale-in"
                style={{ animationDelay: `${index * 0.15}s`, animationFillMode: 'forwards' }}
              >
                <div className={`w-20 h-20 rounded-2xl ${platform.bg} flex items-center justify-center`}>
                  <Icon className={`w-10 h-10 ${platform.color}`} />
                </div>
                <span className="font-display font-semibold text-lg">{platform.name}</span>
              </div>
            );
          })}
          
          {/* Coming Soon Badge */}
          <div 
            className="glass-card p-8 flex flex-col items-center gap-4 min-w-[200px] opacity-60"
          >
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center">
              <span className="text-3xl">+</span>
            </div>
            <span className="font-display font-semibold text-lg text-muted-foreground">More Coming</span>
          </div>
        </div>
      </div>
    </section>
  );
}
