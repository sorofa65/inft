// Builds ./dist  (static site + bundled background-removal lib + self-hosted model files)
// Everything comes from npm packages -> Netlify runs `npm install` automatically, nothing to download by hand.
import { cpSync, rmSync, mkdirSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { build } from 'esbuild';

// @imgly/background-removal 1.4.5 decides "threads available" by testing SharedArrayBuffer only, but onnxruntime-web
// then silently runs single-threaded when the page is not cross-origin isolated and asks for the NON-threaded wasm,
// which the library never downloaded -> "Failed to create session ... Failed to parse URL from ort-wasm-simd.wasm".
// Fix: only report threads when the page really is cross-origin isolated (netlify.toml sends the headers for /card).
const fixThreads = { name: 'fix-threads', setup(b) {
  b.onLoad({ filter: /@imgly[\\/]background-removal[\\/]dist[\\/]index\.mjs$/ }, args => {
    let t = readFileSync(args.path, 'utf8');
    const from = 'threads: await threads(),';
    if (!t.includes(from)) throw new Error('fix-threads: pattern not found (library version changed?)');
    t = t.replace(from, 'threads: (await threads()) && self.crossOriginIsolated === true,');
    return { contents: t, loader: 'js' };
  });
} };

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/assets', { recursive: true });
for (const f of readdirSync('.')) if (f.endsWith('.html')) cpSync(f, 'dist/' + f);
cpSync('assets', 'dist/assets', { recursive: true });

// 1) background-removal library -> dist/assets/bg.js
await build({ entryPoints: ['src/bg.js'], bundle: true, format: 'esm', platform: 'browser',
  target: 'es2020', minify: true, plugins: [fixThreads], outfile: 'dist/assets/bg.js', logLevel: 'warning' });

// 2) model + wasm files (npm: @imgly/background-removal-data). Only what the card page needs:
//    the small (quint8, fastest) model and the CPU wasm runtimes. Skips ~130 MB of unused files.
const src = 'node_modules/@imgly/background-removal-data/dist';
if (!existsSync(src + '/resources.json')) throw new Error('@imgly/background-removal-data missing - run npm install');
const all = JSON.parse(readFileSync(src + '/resources.json', 'utf8'));
const keep = ['/models/small', '/onnxruntime-web/ort-wasm-simd-threaded.wasm', '/onnxruntime-web/ort-wasm-simd.wasm',
  '/onnxruntime-web/ort-wasm-threaded.wasm', '/onnxruntime-web/ort-wasm.wasm'];
const out = {}; mkdirSync('dist/assets/bg-data', { recursive: true });
for (const k of keep) {
  if (!all[k]) throw new Error('resource not found: ' + k);
  out[k] = all[k];
  for (const c of all[k].chunks) cpSync(`${src}/${c.hash}`, `dist/assets/bg-data/${c.hash}`);
}
writeFileSync('dist/assets/bg-data/resources.json', JSON.stringify(out));
console.log('✓ background-removal bundled + model files copied (' + Object.keys(out).length + ' resources)');
console.log('✓ dist ready');
