import { useState } from 'react';
import { JobStatus } from '@/lib/types';
import { Job, UserProfile } from '@/hooks/useJobTracker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import '@/styles/add-job.css';

interface AddJobViewProps {
  onAddJob: (job: Partial<Job>) => Promise<any>;
  onDone: () => void;
  profile: UserProfile;
}

export function AddJobView({ onAddJob, onDone }: AddJobViewProps) {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [url, setUrl] = useState('');
  const [salary, setSalary] = useState('');
  const [status, setStatus] = useState<JobStatus>('saved');
  const [notes, setNotes] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company) return;
    setLoading(true);
    await onAddJob({ title, company, location, url, salary, status, notes, deadline: deadline || null });
    setLoading(false);
    onDone();
  };

  return (
    <div className="add-job-container">
      <div className="add-job-header">
        <h2>Add New Job</h2>
        <p>Save a job listing to track</p>
      </div>

      <form onSubmit={handleSubmit} className="add-job-form">
        <div className="add-job-grid">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Software Engineer" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Google" required />
          </div>
        </div>

        <div className="add-job-grid">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Remote / City" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" value={salary} onChange={e => setSalary(e.target.value)} placeholder="$120k - $150k" />
          </div>
        </div>

        <div className="add-job-grid">
          <div className="space-y-2">
            <Label htmlFor="url">Job URL</Label>
            <Input id="url" type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://linkedin.com/jobs/..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Application Deadline</Label>
            <Input id="deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={status} onValueChange={v => setStatus(v as JobStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="saved">Saved</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any notes about this position..." rows={3} />
        </div>

        <div className="add-job-actions">
          <Button type="submit" className="flex-1" disabled={loading}>
            {loading ? 'Saving...' : 'Save Job'}
          </Button>
          <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
