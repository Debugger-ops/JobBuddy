import { useState, useRef } from 'react';
import { UserProfile } from '@/hooks/useJobTracker';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Copy, Check, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/profile.css';

interface ProfileViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export function ProfileView({ profile, onUpdateProfile }: ProfileViewProps) {
  const { user } = useAuth();
  const [skillInput, setSkillInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addSkill = () => {
    if (skillInput.trim() && !profile.skills.includes(skillInput.trim())) {
      onUpdateProfile({ skills: [...profile.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onUpdateProfile({ skills: profile.skills.filter(s => s !== skill) });
  };

  const copyProfile = () => {
    const text = `${profile.full_name}\n${profile.email}\n${profile.phone}\n${profile.linkedin_url}\n\nSkills: ${profile.skills.join(', ')}\n\nExperience:\n${profile.experience}\n\nEducation:\n${profile.education}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Profile copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('resumes').upload(path, file);
    if (error) { toast.error('Upload failed'); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(path);
    onUpdateProfile({ resume_url: publicUrl });
    toast.success('Resume uploaded!');
    setUploading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>Quick Fill Profile</h2>
          <p>Save your info for fast autofill</p>
        </div>
        <Button variant="outline" size="sm" onClick={copyProfile}>
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? 'Copied' : 'Copy All'}
        </Button>
      </div>

      <div className="profile-form">
        <div className="profile-grid">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={profile.full_name} onChange={e => onUpdateProfile({ full_name: e.target.value })} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={profile.email} onChange={e => onUpdateProfile({ email: e.target.value })} placeholder="john@example.com" />
          </div>
        </div>

        <div className="profile-grid">
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={profile.phone} onChange={e => onUpdateProfile({ phone: e.target.value })} placeholder="+1 (555) 123-4567" />
          </div>
          <div className="space-y-2">
            <Label>LinkedIn URL</Label>
            <Input value={profile.linkedin_url} onChange={e => onUpdateProfile({ linkedin_url: e.target.value })} placeholder="linkedin.com/in/..." />
          </div>
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <Label>Resume</Label>
          <input type="file" ref={fileRef} onChange={handleResumeUpload} accept=".pdf,.doc,.docx" className="hidden" />
          {profile.resume_url ? (
            <div className="resume-file-info">
              <FileText className="w-5 h-5 text-primary shrink-0" />
              <span className="text-sm truncate flex-1">Resume uploaded</span>
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                Replace
              </Button>
            </div>
          ) : (
            <div className="resume-upload-area" onClick={() => fileRef.current?.click()}>
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {uploading ? 'Uploading...' : 'Click to upload your resume (PDF, DOC)'}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Skills</Label>
          <div className="skills-input-row">
            <Input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
            />
            <Button type="button" variant="outline" onClick={addSkill}>Add</Button>
          </div>
          <div className="skills-tags">
            {profile.skills.map(skill => (
              <Badge key={skill} variant="secondary" className="gap-1">
                {skill}
                <button onClick={() => removeSkill(skill)}><X className="w-3 h-3" /></button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Experience</Label>
          <Textarea value={profile.experience} onChange={e => onUpdateProfile({ experience: e.target.value })} placeholder="Brief summary of your work experience..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>Education</Label>
          <Textarea value={profile.education} onChange={e => onUpdateProfile({ education: e.target.value })} placeholder="Your education background..." rows={2} />
        </div>

        <div className="space-y-2">
          <Label>Cover Letter Template</Label>
          <Textarea value={profile.cover_letter_template} onChange={e => onUpdateProfile({ cover_letter_template: e.target.value })} placeholder="Dear Hiring Manager,..." rows={5} />
        </div>
      </div>
    </div>
  );
}
