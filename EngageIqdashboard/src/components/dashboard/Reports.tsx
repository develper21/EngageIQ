'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Download, Calendar, Share2, Check } from 'lucide-react';

const reports = [
    { title: 'Monthly Performance Review', date: 'Oct 2024', size: '2.4 MB', status: 'Ready' },
    { title: 'Q3 Audience Growth', date: 'Jul - Sep 2024', size: '5.1 MB', status: 'Ready' },
    { title: 'Campaign Analysis: "Summer Sale"', date: 'August 2024', size: '1.8 MB', status: 'Ready' },
];

export function Reports() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100">Analytics Reports</h2>
                    <p className="text-slate-400">Download or share detailed performance reports.</p>
                </div>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate New Report
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {reports.map((report, i) => (
                    <Card key={i} className="border-slate-800 bg-slate-900/50 hover:bg-slate-800/50 transition-colors group">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                                    <FileText className="w-6 h-6 text-indigo-400" />
                                </div>
                                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full font-medium border border-emerald-500/20">
                                    {report.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <CardTitle className="text-base mb-2">{report.title}</CardTitle>
                            <CardDescription className="mb-4">{report.date} • {report.size}</CardDescription>

                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="w-full border-slate-700 hover:bg-slate-700 text-slate-300">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button variant="outline" size="icon" className="border-slate-700 hover:bg-slate-700 text-slate-300">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-slate-800 bg-slate-900/50">
                <CardHeader>
                    <CardTitle>Scheduled Reports</CardTitle>
                    <CardDescription>Manage your automated report delivery</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Calendar className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="font-medium text-slate-200">Weekly Executive Summary</h4>
                                <p className="text-sm text-slate-400">Sent every Monday at 9:00 AM to team@engageiq.com</p>
                            </div>
                        </div>
                        <Button variant="outline" className="border-slate-700 text-slate-300">
                            Edit Schedule
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
