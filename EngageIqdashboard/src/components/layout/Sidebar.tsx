'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, FileText, Brain, Settings, LogOut, PieChart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: PieChart, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: FileText, label: 'Content', href: '/dashboard/content' },
    { icon: Brain, label: 'AI Insights', href: '/dashboard/insights' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 glass-panel h-screen fixed left-0 top-0 flex flex-col border-r border-slate-800 z-50">
            <div className="p-6 flex items-center space-x-3 border-b border-slate-800/50">
                <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/30">
                    <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                    EngageIQ
                </span>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                        <Link key={item.href} href={item.href} className="block relative group">
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-indigo-600/10 rounded-lg border border-indigo-500/20"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <div className={cn(
                                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative z-10",
                                isActive ? "text-indigo-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                            )}>
                                <item.icon className={cn("w-5 h-5", isActive && "text-indigo-400")} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800/50">
                <button className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
