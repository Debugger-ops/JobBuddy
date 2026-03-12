import { Briefcase, Send, MessageSquare, Trophy, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { STATUS_CONFIG, JobStatus } from '@/lib/types';
import { Job } from '@/hooks/useJobTracker';
import { differenceInDays, parseISO, format } from 'date-fns';
import '@/styles/dashboard.css';

interface DashboardViewProps {
  jobs: Job[];
}

const statusIcons: Record<JobStatus, React.ElementType> = {
  saved: Briefcase,
  applied: Send,
  interview: MessageSquare,
  offer: Trophy,
  rejected: XCircle,
};

export function DashboardView({ jobs }: DashboardViewProps) {
  const statusCounts = (Object.keys(STATUS_CONFIG) as JobStatus[]).map(status => ({
    status,
    count: jobs.filter(j => j.status === status).length,
    ...STATUS_CONFIG[status],
  }));

  const totalApplied = jobs.filter(j => j.status !== 'saved').length;
  const responseRate = totalApplied > 0
    ? Math.round((jobs.filter(j => ['interview', 'offer'].includes(j.status)).length / totalApplied) * 100)
    : 0;

  // Upcoming deadlines
  const upcomingDeadlines = jobs
    .filter(j => j.deadline && differenceInDays(parseISO(j.deadline), new Date()) >= 0)
    .sort((a, b) => parseISO(a.deadline!).getTime() - parseISO(b.deadline!).getTime())
    .slice(0, 5);

  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <p>Track your job application progress</p>
      </div>

      <div className="stats-grid">
        {statusCounts.map(({ status, count, label, bgClass, color }) => {
          const Icon = statusIcons[status];
          return (
            <div key={status} className="stat-card">
              <div className={`stat-icon ${bgClass}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="stat-value">{count}</p>
              <p className="stat-label">{label}</p>
            </div>
          );
        })}
      </div>

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Applications</h3>
          <p className="big-number">{jobs.length}</p>
          <p className="sub-text">{totalApplied} submitted</p>
        </div>
        <div className="summary-card">
          <h3>Response Rate</h3>
          <p className="big-number">{responseRate}%</p>
          <p className="sub-text">interviews + offers</p>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      {upcomingDeadlines.length > 0 && (
        <div className="reminders-section">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-warning" />
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            {upcomingDeadlines.map(job => {
              const daysLeft = differenceInDays(parseISO(job.deadline!), new Date());
              const urgencyClass = daysLeft <= 1 ? 'reminder-urgent' : daysLeft <= 3 ? 'reminder-soon' : 'reminder-normal';
              return (
                <div key={job.id} className="reminder-item">
                  <div>
                    <p className="font-medium text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company}</p>
                  </div>
                  <span className={`reminder-badge ${urgencyClass}`}>
                    {daysLeft === 0 ? 'Today' : daysLeft === 1 ? 'Tomorrow' : `${daysLeft} days`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Jobs</h3>
        {recentJobs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No jobs added yet. Click "Add Job" to get started.</p>
        ) : (
          <div className="space-y-3">
            {recentJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div>
                  <p className="font-medium text-sm">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CONFIG[job.status as JobStatus]?.bgClass} ${STATUS_CONFIG[job.status as JobStatus]?.color}`}>
                  {STATUS_CONFIG[job.status as JobStatus]?.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
