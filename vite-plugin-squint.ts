import { Plugin } from 'vite';
import { exec, execSync } from 'child_process';
import { watch } from 'fs';
import { resolve, relative } from 'path';
import { promisify } from 'util';

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

  async function compileFile(filePath: string): Promise<boolean> {
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

  async function compileAll(): Promise<boolean> {
    try {
      const files = execSync(`find ${srcDir} -name '*.cljs'`, { encoding: 'utf-8' })
        .trim()
        .split('\n')
        .filter(Boolean);
      
      if (files.length === 0) {
        console.log('[squint] No .cljs files found');
        return true;
      }
      
      console.log(`[squint] Compiling ${files.length} Clojure files in parallel...`);
      const results = await Promise.all(
        files.map(file => compileFile(file))
      );
      return results.every(r => r);
    } catch {
      return false;
    }
  }

  return {
    name: 'vite-plugin-squint',

    async buildStart() {
      const start = Date.now();
      const success = await compileAll();
      const elapsed = Date.now() - start;
      console.log(`[squint] ${success ? 'All' : 'Some'} Clojure sources compiled in ${elapsed}ms`);
    },

    configureServer(server) {
      if (!shouldWatch) return;

      const watcher = watch(resolve(process.cwd(), srcDir), { recursive: true });

      let debounceTimer: ReturnType<typeof setTimeout> | null = null;

      watcher.on('change', (_event, filename) => {
        if (typeof filename !== 'string' || !filename.endsWith('.cljs')) return;

        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
          console.log(`[squint] Recompiling — ${filename} changed`);
          const absPath = resolve(process.cwd(), srcDir, filename);
          if (await compileFile(absPath)) {
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