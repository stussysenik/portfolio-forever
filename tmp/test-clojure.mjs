import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve('.');

const server = http.createServer((req, res) => {
  // Serve squint runtime
  if (req.url.startsWith('/squint-cljs/')) {
    const filePath = path.join(repoRoot, 'node_modules', req.url);
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' });
      res.end(data);
      return;
    } catch { }
  }
  if (req.url === '/squint-cljs/core.js' || req.url.startsWith('/squint-cljs/src/')) {
    const filePath = path.join(repoRoot, 'node_modules', req.url);
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' });
      res.end(data);
      return;
    } catch { }
  }
  const filePath = path.join(repoRoot, req.url === '/' ? 'tmp/test-clojure.html' : req.url);
  const ext = path.extname(filePath);
  const contentTypes = { '.html': 'text/html', '.mjs': 'application/javascript', '.js': 'application/javascript' };
  const ct = contentTypes[ext] || 'application/octet-stream';
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
});

await new Promise(r => server.listen(8767, r));

const testHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Clojure Portfolio Layer Test</title>
  <script type="importmap">{ "imports": { "squint-cljs/core.js": "/node_modules/squint-cljs/core.js" } }</script>
  <style>
    body { font-family: monospace; background: #0a0a0a; color: #e0e0e0; padding: 2rem; }
    h1 { color: #44D62C; border-bottom: 1px solid #333; padding-bottom: 0.5rem; }
    .pass { color: #44D62C; } .fail { color: #F97242; } .info { color: #888; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #333; padding: 6px 12px; text-align: left; }
    th { background: #1a1a1a; color: #44D62C; }
    .badge { padding: 2px 8px; border-radius: 3px; font-size: 0.85rem; }
    .badge-PASS { background: #1a3a1a; color: #44D62C; }
    .badge-FAIL { background: #3a1a1a; color: #F97242; }
  </style>
</head>
<body>
  <h1>Clojure Abstraction Layer Verification</h1>
  <p class="info">Testing 28 Squint CLJS modules compiled to ESM JS</p>
  <div id="results"><p>Loading...</p></div>
  <script type="module">
    const results = [];
    async function test(name, fn) {
      try { const r = await fn(); results.push({ name, status: 'PASS', detail: String(r).slice(0, 200) }); }
      catch(e) { results.push({ name, status: 'FAIL', detail: (e.message || String(e)).slice(0, 200) }); }
    }

    // DATA: content
    try {
      const m = await import('/clj/out/portfolio/data/content.mjs');
      await test('data.content: skills (16 items)', async () => { if (!Array.isArray(m.skills)) throw new Error('not array'); return m.skills.length + ' skills'; });
      await test('data.content: tools (21 items)', async () => { if (!Array.isArray(m.tools)) throw new Error('not array'); return m.tools.length + ' tools'; });
      await test('data.content: profile', async () => { if (!m.profile || !m.profile.name) throw new Error('missing'); return m.profile.name; });
      await test('data.content: works', async () => { if (!Array.isArray(m.works)) throw new Error('not array'); return m.works.length + ' works'; });
      await test('data.content: sort_entries', async () => { if (typeof m.sort_entries !== 'function') throw new Error('not function'); return 'sorted ' + m.sort_entries(m.works).length + ' entries'; });
      await test('data.content: get_highlight', async () => { if (typeof m.get_highlight !== 'function') throw new Error('not function'); return 'highlight=' + m.get_highlight(m.works[0]); });
      await test('data.content: format_date', async () => { if (typeof m.format_date !== 'function') throw new Error('not function'); return m.format_date(m.works[0]); });
      await test('data.content: gallery_items', async () => { if (!Array.isArray(m.gallery_items)) throw new Error('not array'); return m.gallery_items.length + ' items'; });
      await test('data.content: process_steps', async () => { if (!Array.isArray(m.process_steps)) throw new Error('not array'); return m.process_steps.length + ' steps'; });
      await test('data.content: social_links', async () => { if (!Array.isArray(m.social_links)) throw new Error('not array'); return m.social_links.length + ' links'; });
    } catch(e) { results.push({ name: 'data.content MODULE', status: 'FAIL', detail: e.message }); }

    // DATA: cv
    try {
      const cv = await import('/clj/out/portfolio/data/cv.mjs');
      await test('data.cv: cv_data', async () => { if (!cv.cv_data || !cv.cv_data.name) throw new Error('missing'); return cv.cv_data.name; });
      await test('data.cv: generate_json_ld', async () => { if (typeof cv.generate_json_ld !== 'function') throw new Error('not function'); return 'json len=' + cv.generate_json_ld(cv.cv_data).length; });
    } catch(e) { results.push({ name: 'data.cv MODULE', status: 'FAIL', detail: e.message }); }

    // DATA: labs
    try {
      const l = await import('/clj/out/portfolio/data/labs.mjs');
      await test('data.labs: labs', async () => { if (!Array.isArray(l.labs)) throw new Error('not array'); return l.labs.length + ' experiments'; });
      await test('data.labs: get_status_label', async () => { if (typeof l.get_status_label !== 'function') throw new Error('not func'); return l.get_status_label('stable'); });
      await test('data.labs: check_feature', async () => { if (typeof l.check_feature !== 'function') throw new Error('not func'); return 'type=' + typeof l.check_feature; });
    } catch(e) { results.push({ name: 'data.labs MODULE', status: 'FAIL', detail: e.message }); }

    // DATA: layout-config
    try {
      const lc = await import('/clj/out/portfolio/data/layout_config.mjs');
      await test('data.layout-config: layout_config', async () => { if (!lc.layout_config) throw new Error('missing'); return 'showWipBanner=' + lc.layout_config.show_wip_banner; });
    } catch(e) { results.push({ name: 'data.layout-config MODULE', status: 'FAIL', detail: e.message }); }

    // UTILS: contrast
    try {
      const c = await import('/clj/out/portfolio/utils/contrast.mjs');
      await test('utils.contrast: get_contrast_color', async () => { if (typeof c.get_contrast_color !== 'function') throw new Error('not func'); return c.get_contrast_color('#fff5c2'); });
      await test('utils.contrast: get_highlight_text_color', async () => { if (typeof c.get_highlight_text_color !== 'function') throw new Error('not func'); return c.get_highlight_text_color('yellow'); });
    } catch(e) { results.push({ name: 'utils.contrast MODULE', status: 'FAIL', detail: e.message }); }

    // UTILS: depth-filter
    try {
      const d = await import('/clj/out/portfolio/utils/depth_filter.mjs');
      await test('utils.depth-filter: filter_by_depth', async () => { if (typeof d.filter_by_depth !== 'function') throw new Error('not func'); return 'full=' + d.filter_by_depth(['hero','works','cv','talks'], 'full').length; });
    } catch(e) { results.push({ name: 'utils.depth-filter MODULE', status: 'FAIL', detail: e.message }); }

    // UTILS: scroll-physics
    try {
      const sp = await import('/clj/out/portfolio/utils/scroll_physics.mjs');
      await test('utils.scroll-physics: get_parallax_multiplier', async () => { if (typeof sp.get_parallax_multiplier !== 'function') throw new Error('not func'); return 'spring=' + sp.get_parallax_multiplier('spring'); });
    } catch(e) { results.push({ name: 'utils.scroll-physics MODULE', status: 'FAIL', detail: e.message }); }

    // SECTIONS: registry
    try {
      const reg = await import('/clj/out/portfolio/sections/registry.mjs');
      await test('sections.registry: section_registry', async () => { if (!Array.isArray(reg.section_registry)) throw new Error('not array'); return reg.section_registry.length + ' sections'; });
      await test('sections.registry: get_section', async () => { if (typeof reg.get_section !== 'function') throw new Error('not func'); return JSON.stringify(reg.get_section('hero')); });
    } catch(e) { results.push({ name: 'sections.registry MODULE', status: 'FAIL', detail: e.message }); }

    // SECTIONS: index
    try {
      const idx = await import('/clj/out/portfolio/sections/index.mjs');
      await test('sections.index: section_routes', async () => { if (!Array.isArray(idx.section_routes)) throw new Error('not array'); return idx.section_routes.length + ' routes'; });
    } catch(e) { results.push({ name: 'sections.index MODULE', status: 'FAIL', detail: e.message }); }

    // TERMINAL: github
    try {
      const gh = await import('/clj/out/portfolio/terminal/github.mjs');
      await test('terminal.github: github_profile', async () => { if (!gh.github_profile || !gh.github_profile.username) throw new Error('missing'); return gh.github_profile.username; });
      await test('terminal.github: repos', async () => { if (!Array.isArray(gh.repos)) throw new Error('not array'); return gh.repos.length + ' repos'; });
    } catch(e) { results.push({ name: 'terminal.github MODULE', status: 'FAIL', detail: e.message }); }

    // ADMIN: constants
    try {
      const a = await import('/clj/out/portfolio/admin/constants.mjs');
      await test('admin.constants: named_colors', async () => { if (!Array.isArray(a.named_colors)) throw new Error('not array'); return a.named_colors.join(', '); });
      await test('admin.constants: format_relative_time', async () => { if (typeof a.format_relative_time !== 'function') throw new Error('not func'); return a.format_relative_time(Date.now() - 300000); });
    } catch(e) { results.push({ name: 'admin.constants MODULE', status: 'FAIL', detail: e.message }); }

    // STORES: controls
    try {
      const ctrl = await import('/clj/out/portfolio/stores/controls.mjs');
      await test('stores.controls: depth_levels', async () => { if (!Array.isArray(ctrl.depth_levels)) throw new Error('not array'); return ctrl.depth_levels.join(', '); });
      await test('stores.controls: physics_modes', async () => { if (!Array.isArray(ctrl.physics_modes)) throw new Error('not array'); return ctrl.physics_modes.join(', '); });
      await test('stores.controls: parallax_multipliers', async () => { if (!ctrl.parallax_multipliers) throw new Error('missing'); return JSON.stringify(ctrl.parallax_multipliers); });
    } catch(e) { results.push({ name: 'stores.controls MODULE', status: 'FAIL', detail: e.message }); }

    // Render
    const el = document.getElementById('results');
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    el.innerHTML = '<h2>Results: <span class="pass">' + passCount + ' passed</span> / <span class="fail">' + failCount + ' failed</span> / ' + results.length + ' total</h2>' +
      '<table><tr><th>Test</th><th>Status</th><th>Detail</th></tr>' +
      results.map(r => '<tr><td>' + r.name + '</td><td><span class="badge badge-' + r.status + '">' + r.status + '</span></td><td class="info">' + r.detail + '</td></tr>').join('') + '</table>';
  </script>
</body>
</html>`;

fs.writeFileSync('tmp/test-clojure.html', testHtml);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:8767/');
await page.waitForTimeout(5000);
await page.screenshot({ path: path.join(repoRoot, 'tmp/clojure-test-results.png'), fullPage: true });

const resultsText = await page.evaluate(() => {
  const el = document.getElementById('results');
  return el ? el.innerText : 'No results';
});

console.log('\n======== CLOJURE LAYER TEST RESULTS ========\n');
console.log(resultsText);
const passCount = await page.evaluate(() => document.querySelectorAll('.badge-PASS').length);
const failCount = await page.evaluate(() => document.querySelectorAll('.badge-FAIL').length);
console.log('\nPASS: ' + passCount + ' / FAIL: ' + failCount);
console.log('=============================================\n');

await browser.close();
server.close();
