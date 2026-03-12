import { Briefcase, LayoutDashboard, User, Plus, LogOut, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import '@/styles/sidebar.css';

type View = 'dashboard' | 'jobs' | 'profile' | 'add' | 'analytics';

interface AppSidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  jobCount: number;
}

const navItems = [
  { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'jobs' as View, label: 'My Jobs', icon: Briefcase },
  { id: 'analytics' as View, label: 'Analytics', icon: BarChart3 },
  { id: 'profile' as View, label: 'Quick Fill', icon: User },
];

export function AppSidebar({ currentView, onViewChange, jobCount }: AppSidebarProps) {
  const { user, signOut } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>
          <Briefcase className="w-6 h-6 text-sidebar-primary" />
          <span>JobTrackr</span>
        </h1>
        <p>Quick Apply Assistant</p>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              'sidebar-nav-item',
              currentView === item.id ? 'sidebar-nav-item--active' : 'sidebar-nav-item--inactive'
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
            {item.id === 'jobs' && jobCount > 0 && (
              <span className="sidebar-badge">{jobCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-2">
        <button onClick={() => onViewChange('add')} className="sidebar-add-btn">
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-info">
            <div className="sidebar-user-avatar">
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="sidebar-user-name">{user.user_metadata?.full_name || 'User'}</p>
              <p className="sidebar-user-email">{user.email}</p>
            </div>
          </div>
          <button onClick={signOut} className="sidebar-signout">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
