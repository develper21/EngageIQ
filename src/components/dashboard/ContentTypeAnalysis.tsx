import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Reels', value: 45, color: 'hsl(187, 100%, 50%)' },
  { name: 'Carousels', value: 30, color: 'hsl(265, 89%, 66%)' },
  { name: 'Static Posts', value: 15, color: 'hsl(142, 76%, 46%)' },
  { name: 'Stories', value: 10, color: 'hsl(38, 92%, 50%)' },
];

export function ContentTypeAnalysis() {
  return (
    <div className="glass-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-lg font-semibold">Content Performance</h3>
        <p className="text-sm text-muted-foreground">Engagement by content type</p>
      </div>

      <div className="h-[280px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
              }}
              formatter={(value: number) => [`${value}%`, 'Engagement']}
            />
            <Legend 
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span style={{ color: 'hsl(215, 20%, 65%)', fontSize: 12 }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Best Performer */}
      <div className="mt-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
        <p className="text-sm text-muted-foreground">Top Performer</p>
        <p className="font-display text-lg font-semibold text-primary">Reels • 45% Engagement</p>
      </div>
    </div>
  );
}
