import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const cwd = (process as any).cwd();
    const env = loadEnv(mode, cwd, '');

    // Prioritize process.env (system vars) over loaded env files for Vercel compatibility
    const GEMINI_KEY = process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || env.GEMINI_API_KEY;
    const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
    const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Define replacement strings for client-side code
        'process.env.API_KEY': JSON.stringify(GEMINI_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(GEMINI_KEY),
        'process.env.VITE_SUPABASE_URL': JSON.stringify(SUPABASE_URL),
        'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(SUPABASE_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(cwd, '.'),
        }
      }
    };
});