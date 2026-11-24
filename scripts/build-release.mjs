import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { build, loadEnv } from 'vite';

// Keep the existing Supabase-backed panel on its own asset base.
await build({ base: '/panel/', build: { outDir: 'dist/release/panel', emptyOutDir: true } });
mkdirSync('dist/release', { recursive: true });
cpSync('release/ximnanzas', 'dist/release', { recursive: true });

const env = loadEnv('production', process.cwd(), 'VITE_SUPABASE_');
const config = {
  supabaseUrl: env.VITE_SUPABASE_URL ?? '',
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY ?? '',
};
writeFileSync('dist/release/assets/published-ideas-config.js', Object.entries(config)
  .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};\n`).join(''));
