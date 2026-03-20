import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Tell TypeScript that `chrome` may exist as a global (injected by Chrome extension)
declare const chrome: {
  storage: {
    local: {
      set: (items: Record<string, unknown>) => void;
      remove: (keys: string[]) => void;
    };
  };
} | undefined;

export function useExtensionSync() {
  useEffect(() => {
    // Only runs if the Chrome extension API is available
    if (typeof chrome === 'undefined' || !chrome?.storage?.local) return;

    const syncToken = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        chrome.storage.local.set({
          authToken:   session.access_token,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        });
      } else {
        chrome.storage.local.remove(['authToken', 'supabaseUrl', 'supabaseKey']);
      }
    };

    // Sync immediately on mount
    syncToken();

    // Re-sync on every auth state change (login / logout / token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (typeof chrome === 'undefined' || !chrome?.storage?.local) return;

      if (session?.access_token) {
        chrome.storage.local.set({
          authToken:   session.access_token,
          supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
          supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        });
      } else {
        chrome.storage.local.remove(['authToken', 'supabaseUrl', 'supabaseKey']);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}