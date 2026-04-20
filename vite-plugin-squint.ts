import { Plugin } from 'vite';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { watch } from 'fs';
import { resolve, relative } from 'path';

const execAsync = promisify(exec);

/**
 * Vite plugin: compiles Clojure (Squint) sources to ESM JavaScript.
 *
 * Watches clj/src/ cljs files for changes and recompiles the changed file
 * via `npx squint compile <file> --output-dir clj/out --paths clj/src`.
 * Svelte components import from clj/out/ as normal JS modules.
 */
export default function squintPlugin(options: {
  srcDir?: string;
  outDir?: string;
  watch?: boolean;
} = {}): Plugin {
  const srcDir = options.srcDir || 'clj/src';
  const outDir = options.outDir || 'clj/out';
  const shouldWatch = options.watch ?? (process.env.NODE_ENV === 'development');

  async function compileFile(filePath: string) {
    try {
      await execAsync(
        `npx squint compile "${filePath}" --output-dir "${outDir}" --paths "${srcDir}"`,
        { cwd: process.cwd() }
      );
      return true;
    } catch (err: any) {
      console.error('[squint] Compilation error:', err.stderr?.toString() || err.message);
      return false;
    }
  }

  async function compileAll() {
    try {
      const files = execSync(`find ${srcDir} -name '*.cljs'`, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      let ok = true;
      let completed = 0;
      const total = files.length;
      
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        process.stdout.write(`\r[squint] ⏱️  Live Timer: ${elapsed}s | Progress: ${completed}/${total} files compiled...`);
      }, 100);

      const CONCURRENCY = 5;
      for (let i = 0; i < total; i += CONCURRENCY) {
        const chunk = files.slice(i, i + CONCURRENCY);
        const results = await Promise.all(chunk.map(async (f) => {
          const res = await compileFile(f);
          completed++;
          return res;
        }));
        if (results.includes(false)) ok = false;
      }

      clearInterval(timer);
      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
      process.stdout.write(`\r[squint] ✅ Finished compiling ${total} files in ${totalTime}s!                      \n`);
      return ok;
    } catch {
      return false;
    }
  }

  return {
    name: 'vite-plugin-squint',

    async buildStart() {
      console.log('\n[squint] Starting batch compilation...');
      if (!(await compileAll())) {
        console.warn('[squint] Initial compilation had errors — some modules may be stale');
      } else {
        // console.log('[squint] Clojure sources compiled to ESM');
      }
    },

    configureServer(server) {
      if (!shouldWatch) return;

      const watcher = watch(resolve(process.cwd(), srcDir), { recursive: true });

      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      watcher.on('change', (_event, filename) => {
        if (typeof filename !== 'string' || !filename.endsWith('.cljs')) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          console.log(`[squint] Recompiling — ${filename} changed`);
          const absPath = resolve(process.cwd(), srcDir, filename);
          if (compileFile(absPath)) {
            // Compute the output path: namespace dots become slashes, .cljs → .mjs
            const relPath = relative(resolve(process.cwd(), srcDir), absPath);
            const outPath = resolve(
              process.cwd(),
              outDir,
              relPath.replace(/\.cljs$/, '.mjs')
            );

            // Invalidate the Vite module so HMR picks up the change
            const mod = server.moduleGraph.getModuleById(outPath);
            if (mod) {
              server.moduleGraph.invalidateModule(mod);
              server.ws.send({ type: 'full-reload' });
            } else {
              server.ws.send({ type: 'full-reload' });
            }
          }
        }, 150);
      });

      server.httpServer?.on('close', () => {
        watcher.close();
      });
    },
  };
}