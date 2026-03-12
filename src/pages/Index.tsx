import { useState } from 'react';
import { AppSidebar } from '@/components/AppSidebar';
import { DashboardView } from '@/components/DashBoardView';
import { JobsListView } from '@/components/JobsListView';
import { AddJobView } from '@/components/AddJobView';
import { ProfileView } from '@/components/ProfileView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { useJobs, useProfile } from '@/hooks/useJobTracker';
import { Menu, X } from 'lucide-react';

type View = 'dashboard' | 'jobs' | 'profile' | 'add' | 'analytics';

const Index = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { jobs, addJob, updateJob, deleteJob } = useJobs();
  const { profile, updateProfile } = useProfile();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView jobs={jobs} />;
      case 'jobs':
        return <JobsListView jobs={jobs} onUpdateJob={updateJob} onDeleteJob={deleteJob} />;
      case 'add':
        return <AddJobView onAddJob={addJob} onDone={() => setCurrentView('jobs')} profile={profile} />;
      case 'analytics':
        return <AnalyticsView jobs={jobs} />;
      case 'profile':
        return <ProfileView profile={profile} onUpdateProfile={updateProfile} />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed lg:static inset-y-0 left-0 z-50 transform transition-transform lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <AppSidebar
          currentView={currentView}
          onViewChange={(v) => { setCurrentView(v); setSidebarOpen(false); }}
          jobCount={jobs.length}
        />
      </div>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden p-4 border-b border-border">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-accent">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <div className="p-6 lg:p-10 max-w-4xl">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default Index;
