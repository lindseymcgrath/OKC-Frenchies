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
    const mergedEnv = { ...env, ...process.env };

    const localApiMiddleware = () => ({
      name: 'local-api-middleware',
      configureServer(server: any) {
        server.middlewares.use('/api/google-reviews', async (req: any, res: any, next: any) => {
          if (req.method && req.method !== 'GET') {
            next();
            return;
          }
          try {
            const urlObj = new URL(req.url || '/', 'http://localhost');
            const queryParams = Object.fromEntries(urlObj.searchParams.entries());
            const mod = await import('./api/google-reviews.mjs');
            const payload = await mod.fetchGoogleReviewsPayload(queryParams, mergedEnv);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Google reviews lookup failed' }));
          }
        });

        server.middlewares.use('/api/generate-caption', async (req: any, res: any, next: any) => {
          if (req.method !== 'POST') {
            next();
            return;
          }
          try {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            const rawBody = Buffer.concat(chunks).toString('utf8');
            const body = rawBody ? JSON.parse(rawBody) : {};
            const mod = await import('./api/generate-caption.mjs');
            const payload = await mod.generateCaptionPayload(body, mergedEnv);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(payload));
          } catch (err: any) {
            res.statusCode = err?.statusCode || 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'Caption generation failed' }));
          }
        });
      }
    });

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), localApiMiddleware()],
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