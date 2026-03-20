import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable/index';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/auth.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('Welcome back!');
        navigate('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await lovable.auth.signInWithOAuth('google', {
      redirect_uri: `${window.location.origin}/dashboard`,
    });
    if (error) toast.error('Google sign-in failed');
  };

  return (
    <div className="auth-page">
      {/* Back to landing */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'fixed', top: 20, left: 24,
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#64748b', fontSize: '0.875rem', fontWeight: 500,
          padding: '8px 12px', borderRadius: 8,
          transition: 'color 0.2s, background 0.2s',
          zIndex: 10,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#2563eb';
          (e.currentTarget as HTMLButtonElement).style.background = '#eff6ff';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.color = '#64748b';
          (e.currentTarget as HTMLButtonElement).style.background = 'none';
        }}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="auth-card">
        <div className="auth-header">
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(37,99,235,0.35)'
            }}>🎯</div>
            <span style={{
              fontSize: '1.5rem', fontWeight: 800,
              color: '#0f172a', letterSpacing: '-0.02em'
            }}>
              Track<span style={{ color: '#2563eb' }}>r</span>
            </span>
          </div>

          <h2 className="auth-title">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to manage your job applications'
              : 'Start tracking your job search for free'}
          </p>
        </div>

        <div className="auth-form">
          {/* Google */}
          <button onClick={handleGoogleSignIn} className="google-btn">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <span className="auth-divider-text">or continue with email</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="John Doe"
                    className="pl-9"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Label htmlFor="password">Password</Label>
                {isLogin && (
                  <span style={{ fontSize: '0.78rem', color: '#2563eb', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'Please wait…' : isLogin ? 'Sign In →' : 'Create Account →'}
            </Button>
          </form>
        </div>

        <p className="auth-footer">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span className="auth-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign up free' : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}