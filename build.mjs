// Builds ./dist  (static site + bundled background-removal lib + self-hosted model files)
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });
for (const f of readdirSync('.')) if (f.endsWith('.html')) cpSync(f, 'dist/' + f);
cpSync('assets', 'dist/assets', { recursive: true });

try {
  const { build } = await import('esbuild');
  await build({ entryPoints: ['src/bg.js'], bundle: true, format: 'esm', platform: 'browser',
    target: 'es2020', minify: true, outfile: 'dist/assets/bg.js', logLevel: 'warning' });
  const data = 'node_modules/@imgly/background-removal/dist';
  if (existsSync(data)) cpSync(data, 'dist/assets/bg-data', { recursive: true });
  console.log('✓ background-removal bundled + model files copied');
} catch (e) {
  // Site still works: card.html falls back to the CDN copy of the same library.
  console.warn('⚠ bundle step failed, card.html will use CDN fallback:', e.message);
}
console.log('✓ dist ready');
