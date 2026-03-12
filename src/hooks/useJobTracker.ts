import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  status: string;
  salary: string;
  notes: string;
  applied_date: string | null;
  deadline: string | null;
  reminder_date: string | null;
  created_at: string;
}

export interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  linkedin_url: string;
  resume_url: string;
  cover_letter_template: string;
  skills: string[];
  experience: string;
  education: string;
}

export function useJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user) { setJobs([]); setLoading(false); return; }
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { toast.error('Failed to load jobs'); }
    else { setJobs((data || []).map(j => ({ ...j, location: j.location || '', url: j.url || '', salary: j.salary || '', notes: j.notes || '' }))); }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const addJob = async (job: Partial<Job>) => {
    if (!user) return null;
    const { data, error } = await supabase.from('jobs').insert({
      user_id: user.id,
      title: job.title!,
      company: job.company!,
      location: job.location || '',
      url: job.url || '',
      status: job.status || 'saved',
      salary: job.salary || '',
      notes: job.notes || '',
      applied_date: job.applied_date || null,
      deadline: job.deadline || null,
      reminder_date: job.reminder_date || null,
    }).select().single();
    if (error) { toast.error('Failed to add job'); return null; }
    setJobs(prev => [{ ...data, location: data.location || '', url: data.url || '', salary: data.salary || '', notes: data.notes || '' }, ...prev]);
    toast.success('Job added!');
    return data;
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    const { error } = await supabase.from('jobs').update(updates).eq('id', id);
    if (error) { toast.error('Failed to update job'); return; }
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...updates } : j));
  };

  const deleteJob = async (id: string) => {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) { toast.error('Failed to delete job'); return; }
    setJobs(prev => prev.filter(j => j.id !== id));
    toast.success('Job deleted');
  };

  return { jobs, loading, addJob, updateJob, deleteJob };
}

const defaultProfile: UserProfile = {
  full_name: '', email: '', phone: '', linkedin_url: '', resume_url: '',
  cover_letter_template: '', skills: [], experience: '', education: '',
};

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setProfile(defaultProfile); setLoading(false); return; }
    supabase.from('profiles').select('*').eq('user_id', user.id).single().then(({ data }) => {
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          linkedin_url: data.linkedin_url || '',
          resume_url: data.resume_url || '',
          cover_letter_template: data.cover_letter_template || '',
          skills: data.skills || [],
          experience: data.experience || '',
          education: data.education || '',
        });
      }
      setLoading(false);
    });
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    const { error } = await supabase.from('profiles').update(updates).eq('user_id', user.id);
    if (error) toast.error('Failed to save profile');
  };

  return { profile, loading, updateProfile };
}
