'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Video, Image, PlaySquare, FileText } from 'lucide-react';

const contentPerformanceData = [
    { name: 'Reels', views: 4500, engagement: 8.5 },
    { name: 'Carousels', views: 3200, engagement: 6.2 },
    { name: 'Static Posts', views: 2100, engagement: 4.1 },
    { name: 'Stories', views: 1800, engagement: 3.8 },
];

const platformDistribution = [
    { name: 'Instagram', value: 45, color: '#ec4899' },
    { name: 'YouTube', value: 30, color: '#ef4444' },
    { name: 'Twitter', value: 25, color: '#3b82f6' },
];

export function ContentAnalysis() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Content Type Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={contentPerformanceData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        cursor={{ fill: '#334155', opacity: 0.2 }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Platform Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full flex justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={platformDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {platformDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <ContentStatCard
                    icon={Video}
                    title="Top Performing Format"
                    value="Reels"
                    desc="avg. 8.5% engagement"
                    color="text-pink-500"
                    bgColor="bg-pink-500/10"
                />
                <ContentStatCard
                    icon={PlaySquare}
                    title="Best Video Length"
                    value="15-30s"
                    desc="holds 70% retention"
                    color="text-blue-500"
                    bgColor="bg-blue-500/10"
                />
                <ContentStatCard
                    icon={Image}
                    title="Optimal Image Count"
                    value="5-7 Slides"
                    desc="for carousels (PDFs)"
                    color="text-purple-500"
                    bgColor="bg-purple-500/10"
                />
            </div>
        </div>
    );
}

function ContentStatCard({ icon: Icon, title, value, desc, color, bgColor }: any) {
    return (
        <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full ${bgColor}`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-100">{value}</h3>
                    <p className="text-sm font-medium text-slate-400">{title}</p>
                    <p className="text-xs text-slate-500 mt-1">{desc}</p>
                </div>
            </CardContent>
        </Card>
    )
}
