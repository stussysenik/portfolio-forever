import { Plugin } from 'vite';
import { execSync } from 'child_process';
import { watch } from 'fs';
import { resolve, relative } from 'path';

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

  function compileFile(filePath: string) {
    try {
      execSync(
        `npx squint compile "${filePath}" --output-dir "${outDir}" --paths "${srcDir}"`,
        { stdio: 'pipe', cwd: process.cwd() }
      );
      return true;
    } catch (err: any) {
      console.error('[squint] Compilation error:', err.stderr?.toString() || err.message);
      return false;
    }
  }

  function compileAll() {
    try {
      const files = execSync(`find ${srcDir} -name '*.cljs'`, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      let ok = true;
      for (const f of files) {
        if (!compileFile(f)) ok = false;
      }
      return ok;
    } catch {
      return false;
    }
  }

  return {
    name: 'vite-plugin-squint',

    buildStart() {
      if (!compileAll()) {
        console.warn('[squint] Initial compilation had errors — some modules may be stale');
      } else {
        console.log('[squint] Clojure sources compiled to ESM');
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