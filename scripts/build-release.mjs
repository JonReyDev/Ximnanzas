import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { build, resolveConfig } from 'vite';

// Keep the existing Supabase-backed panel on its own asset base.
await build({ base: '/panel/', build: { outDir: 'dist/release/panel', emptyOutDir: true } });
mkdirSync('dist/release', { recursive: true });
cpSync('release/ximnanzas', 'dist/release', { recursive: true });

const { define } = await resolveConfig({}, 'build', 'production', 'production');
const config = {
  supabaseUrl: JSON.parse(define['import.meta.env.VITE_SUPABASE_URL']),
  supabaseAnonKey: JSON.parse(define['import.meta.env.VITE_SUPABASE_ANON_KEY']),
};
writeFileSync('dist/release/assets/published-ideas-config.js', Object.entries(config)
  .map(([name, value]) => `export const ${name} = ${JSON.stringify(value)};\n`).join(''));
