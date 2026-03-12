export type JobStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; bgClass: string }> = {
  saved: { label: 'Saved', color: 'text-muted-foreground', bgClass: 'bg-muted' },
  applied: { label: 'Applied', color: 'text-primary', bgClass: 'bg-primary/10' },
  interview: { label: 'Interview', color: 'text-warning', bgClass: 'bg-warning/10' },
  offer: { label: 'Offer', color: 'text-success', bgClass: 'bg-success/10' },
  rejected: { label: 'Rejected', color: 'text-destructive', bgClass: 'bg-destructive/10' },
};
