import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { EngagementChart } from '@/components/dashboard/EngagementChart';
import { PlatformComparison } from '@/components/dashboard/PlatformComparison';
import { ContentTypeAnalysis } from '@/components/dashboard/ContentTypeAnalysis';
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen ml-64">
        <DashboardHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Row */}
            <StatsCards />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <EngagementChart />
              </div>
              <div>
                <AIInsightsPanel />
              </div>
            </div>

            {/* Analysis Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PlatformComparison />
              <ContentTypeAnalysis />
            </div>

            {/* Recent Activity */}
            <RecentActivity />
          </div>
        </main>
      </div>
    </div>
  );
}
