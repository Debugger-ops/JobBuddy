import { useState } from 'react';
import { ExternalLink, Trash2, Search, Filter, Download, Calendar } from 'lucide-react';
import { STATUS_CONFIG, JobStatus } from '@/lib/types';
import { Job } from '@/hooks/useJobTracker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parseISO } from 'date-fns';
import '@/styles/jobs.css';

interface JobsListViewProps {
  jobs: Job[];
  onUpdateJob: (id: string, updates: Partial<Job>) => void;
  onDeleteJob: (id: string) => void;
}

export function JobsListView({ jobs, onUpdateJob, onDeleteJob }: JobsListViewProps) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Title', 'Company', 'Location', 'Status', 'Salary', 'URL', 'Deadline', 'Applied Date', 'Notes', 'Created'];
    const rows = filtered.map(j => [
      j.title, j.company, j.location, j.status, j.salary, j.url,
      j.deadline || '', j.applied_date || '', j.notes, j.created_at
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${(c || '').replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobtrackr-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="jobs-header">
          <h2>My Jobs</h2>
          <p>{jobs.length} jobs tracked</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV} className="export-btn">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <div className="jobs-toolbar">
        <div className="jobs-search">
          <Search className="jobs-search-icon" />
          <Input placeholder="Search jobs..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => (
              <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="jobs-empty">
          <p className="text-muted-foreground">No jobs found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <div key={job.id} className="job-card">
              <div className="job-card-body">
                <div className="job-card-title-row">
                  <h3 className="job-card-title">{job.title}</h3>
                  <span className={`job-status-badge ${STATUS_CONFIG[job.status as JobStatus]?.bgClass} ${STATUS_CONFIG[job.status as JobStatus]?.color}`}>
                    {STATUS_CONFIG[job.status as JobStatus]?.label}
                  </span>
                </div>
                <p className="job-card-company">{job.company} · {job.location}</p>
                {job.salary && <p className="job-card-salary">{job.salary}</p>}
                {job.notes && <p className="job-card-notes">{job.notes}</p>}
                <div className="job-card-meta">
                  <span>Added {format(parseISO(job.created_at), 'MMM d, yyyy')}</span>
                  {job.deadline && (
                    <span className="job-card-deadline flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Due {format(parseISO(job.deadline), 'MMM d')}
                    </span>
                  )}
                </div>
              </div>

              <div className="job-card-actions">
                <Select value={job.status} onValueChange={(v) => onUpdateJob(job.id, { status: v as JobStatus })}>
                  <SelectTrigger className="w-32 h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_CONFIG) as JobStatus[]).map(s => (
                      <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {job.url && (
                  <a href={job.url} target="_blank" rel="noopener noreferrer" className="job-action-btn">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}

                <button onClick={() => onDeleteJob(job.id)} className="job-delete-btn">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
