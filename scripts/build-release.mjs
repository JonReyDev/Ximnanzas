import { cpSync, mkdirSync } from 'node:fs';
import { build } from 'vite';

// Keep the existing Supabase-backed panel on its own asset base.
await build({ base: '/panel/', build: { outDir: 'dist/release/panel', emptyOutDir: true } });
mkdirSync('dist/release', { recursive: true });
cpSync('release/ximnanzas', 'dist/release', { recursive: true });
