'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Overview } from '@/components/dashboard/Overview';
import { ContentAnalysis } from '@/components/dashboard/ContentAnalysis';
import { AIAssistant } from '@/components/dashboard/AIAssistant';
import { Insights } from '@/components/dashboard/Insights';
import { Reports } from '@/components/dashboard/Reports';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-400 mt-1">
              Welcome back! Here's what's happening today.
            </p>
          </div>
          <div className="flex space-x-3">
            <div className="flex bg-slate-900/50 rounded-lg p-1 border border-slate-800">
              {['overview', 'content', 'insights', 'reports', 'ai'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                    }`}
                >
                  {tab === 'ai' ? 'AI Assistant' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="min-h-[500px]">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'content' && <ContentAnalysis />}
          {activeTab === 'insights' && <Insights />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'ai' && <AIAssistant />}
        </div>
      </div>
    </DashboardLayout>
  );
}
