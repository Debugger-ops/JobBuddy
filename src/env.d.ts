// src/env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  // add other env variables you use starting with VITE_...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}