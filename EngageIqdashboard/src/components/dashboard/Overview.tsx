'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Instagram, Youtube, Twitter, TrendingUp, Users, ArrowUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";

const mockEngagementData = [
    { date: 'Mon', instagram: 2400, youtube: 1398, twitter: 9800 },
    { date: 'Tue', instagram: 1398, youtube: 8000, twitter: 12089 },
    { date: 'Wed', instagram: 9800, youtube: 2008, twitter: 8900 },
    { date: 'Thu', instagram: 3908, youtube: 2780, twitter: 9800 },
    { date: 'Fri', instagram: 4800, youtube: 1890, twitter: 10389 },
    { date: 'Sat', instagram: 3800, youtube: 2390, twitter: 12489 },
    { date: 'Sun', instagram: 4300, youtube: 3490, twitter: 11289 },
];

export function Overview() {
    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Reach"
                    value="89.2K"
                    change="+23%"
                    icon={Users}
                    color="text-indigo-400"
                    bgColor="bg-indigo-500/10"
                />
                <KPICard
                    title="Instagram Engagement"
                    value="12.4K"
                    change="+12%"
                    icon={Instagram}
                    color="text-pink-500"
                    bgColor="bg-pink-500/10"
                />
                <KPICard
                    title="YouTube Views"
                    value="45.2K"
                    change="+8%"
                    icon={Youtube}
                    color="text-red-500"
                    bgColor="bg-red-500/10"
                />
                <KPICard
                    title="Twitter Impressions"
                    value="15.6K"
                    change="+15%"
                    icon={Twitter}
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Engagement Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockEngagementData}>
                                    <defs>
                                        <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorYt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                                    <XAxis
                                        dataKey="date"
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
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="instagram" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#colorIg)" />
                                    <Area type="monotone" dataKey="youtube" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorYt)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 border-slate-800 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle>Platform Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { name: "Instagram", value: 45, color: "bg-pink-500", label: "2.4k followers" },
                                { name: "YouTube", value: 30, color: "bg-red-500", label: "850 subscribers" },
                                { name: "Twitter", value: 25, color: "bg-blue-500", label: "1.2k followers" },
                            ].map((item) => (
                                <div key={item.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-200">{item.name}</span>
                                        <span className="text-slate-400">{item.label}</span>
                                    </div>
                                    <div className="h-2 w-full rounded-full bg-slate-800">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className={`h-full rounded-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function KPICard({ title, value, change, icon: Icon, color, bgColor }: any) {
    return (
        <Card className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0 pb-2">
                    <div className={`p-2 rounded-lg ${bgColor}`}>
                        <Icon className={`h-5 w-5 ${color}`} />
                    </div>
                    {change && (
                        <div className="flex items-center space-x-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded text-xs font-medium">
                            <ArrowUp className="h-3 w-3" />
                            <span>{change}</span>
                        </div>
                    )}
                </div>
                <div className="space-y-1 pt-4">
                    <h3 className="text-sm font-medium text-slate-400">{title}</h3>
                    <div className="text-2xl font-bold text-slate-100">{value}</div>
                </div>
            </CardContent>
        </Card>
    )
}
