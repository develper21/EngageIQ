import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', engagement: 4200, reach: 24000 },
  { name: 'Tue', engagement: 3800, reach: 21000 },
  { name: 'Wed', engagement: 5100, reach: 28000 },
  { name: 'Thu', engagement: 4600, reach: 26000 },
  { name: 'Fri', engagement: 6200, reach: 34000 },
  { name: 'Sat', engagement: 7100, reach: 42000 },
  { name: 'Sun', engagement: 5800, reach: 38000 },
];

export function EngagementChart() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg font-semibold">Engagement Overview</h3>
          <p className="text-sm text-muted-foreground">Weekly performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">Engagement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary" />
            <span className="text-sm text-muted-foreground">Reach</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(187, 100%, 50%)" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(265, 89%, 66%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(265, 89%, 66%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
              tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
            />
            <Area 
              type="monotone" 
              dataKey="engagement" 
              stroke="hsl(187, 100%, 50%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorEngagement)" 
            />
            <Area 
              type="monotone" 
              dataKey="reach" 
              stroke="hsl(265, 89%, 66%)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorReach)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
