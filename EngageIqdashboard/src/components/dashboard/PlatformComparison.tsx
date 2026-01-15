import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Youtube, Instagram, Twitter } from 'lucide-react';

const data = [
  { name: 'YouTube', followers: 45200, color: 'hsl(0, 70%, 50%)', icon: Youtube },
  { name: 'Instagram', followers: 62300, color: 'hsl(340, 82%, 60%)', icon: Instagram },
  { name: 'Twitter', followers: 17000, color: 'hsl(200, 80%, 55%)', icon: Twitter },
];

export function PlatformComparison() {
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold">Platform Comparison</h3>
        <p className="text-sm text-muted-foreground">Followers across platforms</p>
      </div>

      {/* Platform Icons */}
      <div className="flex gap-4 mb-6">
        {data.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.name} className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${platform.color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color: platform.color }} />
              </div>
              <div>
                <p className="text-sm font-medium">{platform.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(platform.followers / 1000).toFixed(1)}K
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" horizontal={false} />
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis 
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
              width={80}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              formatter={(value: number) => [`${(value / 1000).toFixed(1)}K`, 'Followers']}
            />
            <Bar dataKey="followers" radius={[0, 8, 8, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
