import { Job } from '@/hooks/useJobTracker';
import { STATUS_CONFIG, JobStatus } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { format, parseISO, startOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns';
import '@/styles/dashboard.css';

interface AnalyticsViewProps {
  jobs: Job[];
}

const COLORS = ['hsl(220, 9%, 46%)', 'hsl(217, 91%, 60%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(0, 84%, 60%)'];

export function AnalyticsView({ jobs }: AnalyticsViewProps) {
  // Status distribution
  const statusData = (Object.keys(STATUS_CONFIG) as JobStatus[]).map(status => ({
    name: STATUS_CONFIG[status].label,
    value: jobs.filter(j => j.status === status).length,
  })).filter(d => d.value > 0);

  // Weekly application trend (last 8 weeks)
  const now = new Date();
  const weeks = eachWeekOfInterval({ start: subWeeks(now, 7), end: now });
  const weeklyData = weeks.map(weekStart => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const count = jobs.filter(j => {
      const d = parseISO(j.created_at);
      return d >= weekStart && d < weekEnd;
    }).length;
    return { week: format(weekStart, 'MMM d'), count };
  });

  // Top companies
  const companyCounts: Record<string, number> = {};
  jobs.forEach(j => { companyCounts[j.company] = (companyCounts[j.company] || 0) + 1; });
  const topCompanies = Object.entries(companyCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }));

  return (
    <div className="space-y-8">
      <div className="dashboard-header">
        <h2>Analytics</h2>
        <p>Visualize your job search progress</p>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">Add some jobs to see analytics.</p>
        </div>
      ) : (
        <>
          <div className="summary-grid">
            <div className="analytics-section">
              <h3 className="font-semibold mb-4">Status Distribution</h3>
              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {statusData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="analytics-section">
              <h3 className="font-semibold mb-4">Weekly Applications</h3>
              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="count" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={{ fill: 'hsl(217, 91%, 60%)' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {topCompanies.length > 0 && (
            <div className="analytics-section">
              <h3 className="font-semibold mb-4">Top Companies</h3>
              <div className="analytics-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topCompanies}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
