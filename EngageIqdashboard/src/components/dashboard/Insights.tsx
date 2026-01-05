'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Clock, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const bestTimeData = [
    { time: '6 AM', engagement: 20 },
    { time: '9 AM', engagement: 45 },
    { time: '12 PM', engagement: 85 },
    { time: '3 PM', engagement: 65 },
    { time: '6 PM', engagement: 95 },
    { time: '9 PM', engagement: 70 },
    { time: '12 AM', engagement: 30 },
];

export function Insights() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-indigo-400" />
                            <CardTitle>Best Time to Post</CardTitle>
                        </div>
                        <CardDescription>Based on your audience activity (Last 30 Days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bestTimeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#94a3b8"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: '#334155', opacity: 0.2 }}
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <Bar dataKey="engagement" radius={[4, 4, 0, 0]}>
                                        {bestTimeData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.engagement > 80 ? '#ec4899' : '#6366f1'}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 rounded-full bg-[#ec4899]"></span>
                                <span className="text-slate-400">Peak Hours</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 rounded-full bg-[#6366f1]"></span>
                                <span className="text-slate-400">Average Hours</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-slate-800 bg-slate-900/50">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                <CardTitle>Strategic Recommendations</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                                <h4 className="font-semibold text-indigo-300 mb-1">Increase Video Frequency</h4>
                                <p className="text-sm text-slate-400">Your audience engages 40% more with video content. Try posting 2 Reels per week.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-pink-500/10 border border-pink-500/20">
                                <h4 className="font-semibold text-pink-300 mb-1">Hashtag Optimization</h4>
                                <p className="text-sm text-slate-400">Posts with #TechTrends are reaching 2x more non-followers.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-800 bg-slate-900/50">
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-amber-400" />
                                <CardTitle>Areas for Improvement</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <p className="text-sm text-slate-400">Reply rate dropped by 15% this week. Engage with comments within the first hour.</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2" />
                                <p className="text-sm text-slate-400">Twitter impressions are low on weekends. Consider scheduling threads for Saturday mornings.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
