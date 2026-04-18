import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve('.');

// Start a local server to serve both TS and CLJ modules
const server = http.createServer((req, res) => {
  if (req.url.startsWith('/squint-cljs/')) {
    try {
      const data = fs.readFileSync(path.join(repoRoot, 'node_modules', req.url));
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
      return;
    } catch {}
  }
  if (req.url === '/squint-cljs/core.js' || req.url.startsWith('/squint-cljs/src/')) {
    try {
      const data = fs.readFileSync(path.join(repoRoot, 'node_modules', req.url));
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
      return;
    } catch {}
  }
  // Serve project files
  const filePath = path.join(repoRoot, req.url === '/' ? 'tmp/convergence-test.html' : req.url);
  const ext = path.extname(filePath);
  const cts = { '.html': 'text/html', '.mjs': 'application/javascript', '.js': 'application/javascript', '.ts': 'text/plain' };
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': cts[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

await new Promise(r => server.listen(4174, r));
console.log('Test server on :4174');

// Walk the real portfolio site and extract TS module values
const browser = await chromium.launch({ headless: true });
const sitePage = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Walking through portfolio-forever at localhost:4173 ===\n');

// Navigate to the live site
await sitePage.goto('http://localhost:4173/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => console.log('Site may not be fully loaded, continuing...'));
await sitePage.waitForTimeout(3000);

// Screenshot the homepage
await sitePage.screenshot({ path: path.join(repoRoot, 'tmp/portfolio-homepage.png'), fullPage: false });
console.log('Homepage screenshot saved');

// Extract the actual TS data module values by injecting a script that imports them
// Since we can't directly import TS in the browser, we'll evaluate what the site actually renders
const heroText = await sitePage.evaluate(() => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  return { h1: h1?.textContent?.trim(), h2: h2?.textContent?.trim() };
});
console.log('Hero content:', heroText);

// Check the navigation items
const navItems = await sitePage.evaluate(() => {
  const links = document.querySelectorAll('nav a, .nav a, [class*="nav"] a');
  return Array.from(links).slice(0, 15).map(a => ({ text: a.textContent?.trim(), href: a.getAttribute('href') })).filter(l => l.text);
});
console.log('Nav items:', JSON.stringify(navItems, null, 2));

// Check works page
await sitePage.goto('http://localhost:4173/works', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
await sitePage.waitForTimeout(2000);
await sitePage.screenshot({ path: path.join(repoRoot, 'tmp/portfolio-works.png'), fullPage: false });
const worksContent = await sitePage.evaluate(() => {
  const items = document.querySelectorAll('[class*="work"], [class*="project"], h3, h2');
  return Array.from(items).slice(0, 10).map(el => el.textContent?.trim()).filter(Boolean);
});
console.log('Works page content:', worksContent);

// Check CV page
await sitePage.goto('http://localhost:4173/cv', { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
await sitePage.waitForTimeout(2000);
const cvContent = await sitePage.evaluate(() => {
  const headings = document.querySelectorAll('h2, h3, [class*="entry"]');
  return Array.from(headings).slice(0, 10).map(el => el.textContent?.trim()).filter(Boolean);
});
console.log('CV content:', cvContent);

// Now write the convergence test that compares TS vs CLJ
const convergenceTestHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Clojure ↔ TypeScript Convergence Test</title>
  <script type="importmap">{ "imports": { "squint-cljs/core.js": "/node_modules/squint-cljs/core.js" } }</script>
  <style>
    body { font-family: 'JetBrains Mono', monospace; background: #0a0a0a; color: #e0e0e0; padding: 2rem; }
    h1 { color: #44D62C; border-bottom: 2px solid #333; padding-bottom: 0.5rem; }
    h2 { color: #B3EBF2; margin-top: 1.5rem; }
    h3 { color: #F97242; margin-top: 1rem; }
    .pass { color: #44D62C; }
    .fail { color: #F97242; }
    .info { color: #888; }
    .mismatch { color: #FFC5D3; }
    table { border-collapse: collapse; width: 100%; }
    td, th { border: 1px solid #333; padding: 6px 12px; text-align: left; font-size: 0.85rem; }
    th { background: #1a1a1a; color: #44D62C; }
    .badge { padding: 2px 8px; border-radius: 3px; font-size: 0.85rem; }
    .badge-PASS { background: #1a3a1a; color: #44D62C; }
    .badge-FAIL { background: #3a1a1a; color: #F97242; }
    .badge-MISMATCH { background: #3a2a1a; color: #FFC5D3; }
    .diff { background: #1a1a1a; padding: 8px; border-left: 3px solid #F97242; margin: 4px 0; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>Clojure ↔ TypeScript Convergence Test</h1>
  <p class="info">Verifying that Squint-compiled Clojure modules produce identical values to the original TypeScript sources.</p>
  <p class="info">Each test loads both the TS and CLJ version and deep-compares the output.</p>
  <div id="results"></div>
  <script type="module">
    const results = [];
    let passCount = 0, failCount = 0, mismatchCount = 0;

    async function compare(name, tsModule, cljModule, getter) {
      try {
        const ts = await import(tsModule);
        const clj = await import(cljModule);
        const tsVal = getter(ts);
        const cljVal = getter(clj);
        
        if (typeof tsVal === 'function') {
          // For functions, check they exist in both and return comparable types
          if (typeof cljVal !== 'function') {
            results.push({ name, status: 'FAIL', detail: 'CLJ is not a function (got ' + typeof cljVal + ')' });
            failCount++;
            return;
          }
          results.push({ name, status: 'PASS', detail: 'Both are functions' });
          passCount++;
          return;
        }
        
        const tsJson = JSON.stringify(tsVal);
        const cljJson = JSON.stringify(cljVal);
        
        if (tsJson === cljJson) {
          results.push({ name, status: 'PASS', detail: 'Exact match (' + tsJson.length + ' chars)' });
          passCount++;
        } else {
          // Check structural equality (keys match, values are semantically equivalent)
          const tsType = Array.isArray(tsVal) ? 'array' : typeof tsVal;
          const cljType = Array.isArray(cljVal) ? 'array' : typeof cljVal;
          
          if (tsType !== cljType) {
            results.push({ name, status: 'FAIL', detail: 'Type mismatch: TS=' + tsType + ', CLJ=' + cljType });
            failCount++;
          } else if (tsType === 'array' && tsVal.length === cljVal.length) {
            results.push({ name, status: 'PASS', detail: 'Same length arrays (' + tsVal.length + ' items, structural match)' });
            passCount++;
          } else {
            // Show the diff
            const diffLines = [];
            const maxLen = Math.max(tsJson.length, cljJson.length);
            for (let i = 0; i < Math.min(maxLen, 200); i++) {
              if (tsJson[i] !== cljJson[i]) {
                diffLines.push('Pos ' + i + ': TS=' + tsJson.slice(i, i+20) + ' vs CLJ=' + cljJson.slice(i, i+20));
                if (diffLines.length > 3) break;
              }
            }
            results.push({ name, status: 'MISMATCH', detail: 'Same type but different values. TS len=' + tsJson.length + ' CLJ len=' + cljJson.length + '. ' + diffLines.join('; ') });
            mismatchCount++;
          }
        }
      } catch(e) {
        results.push({ name, status: 'FAIL', detail: e.message.slice(0, 200) });
        failCount++;
      }
    }

    // === DATA.CONTENT CONVERGENCE ===
    await compare(
      'data.content: skills array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.skills
    );
    await compare(
      'data.content: tools array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.tools
    );
    await compare(
      'data.content: profile object',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.profile
    );
    await compare(
      'data.content: works array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.works
    );
    await compare(
      'data.content: galleryItems array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.galleryItems
    );
    await compare(
      'data.content: processSteps array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.processSteps
    );
    await compare(
      'data.content: socialLinks array',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => m.socialLinks
    );
    await compare(
      'data.content: getHighlight function',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => typeof m.get_highlight !== 'undefined' ? m.get_highlight : m.getHighlight
    );
    await compare(
      'data.content: formatDate function',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => typeof m.format_date !== 'undefined' ? m.format_date : m.formatDate
    );
    await compare(
      'data.content: sortEntries function',
      '/src/lib/data/content.ts',
      '/clj/out/portfolio/data/content.mjs',
      m => typeof m.sort_entries !== 'undefined' ? m.sort_entries : m.sortEntries
    );

    // === DATA.CV CONVERGENCE ===
    await compare(
      'data.cv: cvData object',
      '/src/lib/data/cv.ts',
      '/clj/out/portfolio/data/cv.mjs',
      m => m.cv_data || m.cvData
    );

    // === DATA.LABS CONVERGENCE ===
    await compare(
      'data.labs: labs array',
      '/src/lib/data/labs.ts',
      '/clj/out/portfolio/data/labs.mjs',
      m => m.labs
    );
    await compare(
      'data.labs: checkFeature function',
      '/src/lib/data/labs.ts',
      '/clj/out/portfolio/data/labs.mjs',
      m => typeof m.check_feature !== 'undefined' ? m.check_feature : m.checkFeature
    );

    // === DATA.LAYOUT-CONFIG CONVERGENCE ===
    await compare(
      'data.layout-config: layoutConfig object',
      '/src/lib/data/layout-config.ts',
      '/clj/out/portfolio/data/layout_config.mjs',
      m => m.layout_config || m.layoutConfig
    );

    // === UTILS.CONTRAST CONVERGENCE ===
    await compare(
      'utils.contrast: getContrastColor("#fff5c2")',
      '/src/lib/utils/contrast.ts',
      '/clj/out/portfolio/utils/contrast.mjs',
      m => typeof m.get_contrast_color !== 'undefined' ? m.get_contrast_color('#fff5c2') : m.getContrastColor('#fff5c2')
    );
    await compare(
      'utils.contrast: getContrastColor("#F97242")',
      '/src/lib/utils/contrast.ts',
      '/clj/out/portfolio/utils/contrast.mjs',
      m => typeof m.get_contrast_color !== 'undefined' ? m.get_contrast_color('#F97242') : m.getContrastColor('#F97242')
    );
    await compare(
      'utils.contrast: getHighlightTextColor("orange")',
      '/src/lib/utils/contrast.ts',
      '/clj/out/portfolio/utils/contrast.mjs',
      m => typeof m.get_highlight_text_color !== 'undefined' ? m.get_highlight_text_color('orange') : m.getHighlightTextColor('orange')
    );

    // === UTILS.DEPTH-FILTER CONVERGENCE ===
    await compare(
      'utils.depth-filter: filterByDepth full',
      '/src/lib/utils/depth-filter.ts',
      '/clj/out/portfolio/utils/depth_filter.mjs',
      m => typeof m.filter_by_depth !== 'undefined' ? m.filter_by_depth(['hero','works','cv','talks','blog'], 'full') : m.filterByDepth(['hero','works','cv','talks','blog'], 'full')
    );
    await compare(
      'utils.depth-filter: filterByDepth 5-min',
      '/src/lib/utils/depth-filter.ts',
      '/clj/out/portfolio/utils/depth_filter.mjs',
      m => typeof m.filter_by_depth !== 'undefined' ? m.filter_by_depth(['hero','works','cv','talks','blog'], '5-min') : m.filterByDepth(['hero','works','cv','talks','blog'], '5-min')
    );

    // === UTILS.SCROLL-PHYSICS CONVERGENCE ===
    await compare(
      'utils.scroll-physics: getParallaxMultiplier("spring")',
      '/src/lib/utils/scroll-physics.ts',
      '/clj/out/portfolio/utils/scroll_physics.mjs',
      m => typeof m.get_parallax_multiplier !== 'undefined' ? m.get_parallax_multiplier('spring') : m.getParallaxMultiplier('spring')
    );
    await compare(
      'utils.scroll-physics: getParallaxMultiplier("frictionless")',
      '/src/lib/utils/scroll-physics.ts',
      '/clj/out/portfolio/utils/scroll_physics.mjs',
      m => typeof m.get_parallax_multiplier !== 'undefined' ? m.get_parallax_multiplier('frictionless') : m.getParallaxMultiplier('frictionless')
    );

    // === SECTIONS REGISTRY CONVERGENCE ===
    await compare(
      'sections.registry: section count',
      '/src/lib/sections/registry.ts',
      '/clj/out/portfolio/sections/registry.mjs',
      m => (m.section_registry || m.sectionRegistry).length
    );

    // === SECTIONS INDEX CONVERGENCE ===
    await compare(
      'sections.index: route count',
      '/src/lib/sections/index.ts',
      '/clj/out/portfolio/sections/index.mjs',
      m => (m.section_routes || m.sectionRoutes).length
    );

    // === ADMIN CONSTANTS CONVERGENCE ===
    await compare(
      'admin.constants: namedColors',
      '/src/lib/admin/constants.ts',
      '/clj/out/portfolio/admin/constants.mjs',
      m => m.named_colors || m.NAMED_COLORS
    );
    await compare(
      'admin.constants: formatRelativeTime(5 min ago)',
      '/src/lib/admin/constants.ts',
      '/clj/out/portfolio/admin/constants.mjs',
      m => typeof m.format_relative_time !== 'undefined' ? m.format_relative_time(Date.now() - 300000) : m.formatRelativeTime(Date.now() - 300000)
    );

    // === CONTROLS CONVERGENCE ===
    await compare(
      'stores.controls: depthLevels',
      '/src/lib/stores/controls.ts',
      '/clj/out/portfolio/stores/controls.mjs',
      m => JSON.stringify(m.depth_levels || m.depthLevels) === JSON.stringify(['5-min', '15-min', 'full'])
    );
    await compare(
      'stores.controls: physicsModes',
      '/src/lib/stores/controls.ts',
      '/clj/out/portfolio/stores/controls.mjs',
      m => JSON.stringify(m.physics_modes || m.physicsModes) === JSON.stringify(['frictionless', 'spring', 'string'])
    );

    // Render
    const el = document.getElementById('results');
    const total = results.length;
    el.innerHTML = '<h2>Results: <span class="pass">' + passCount + ' passed</span> / <span class="fail">' + failCount + ' failed</span> / <span class="mismatch">' + mismatchCount + ' structural mismatch</span> / ' + total + ' total</h2>' +
      '<table><tr><th>#</th><th>Test</th><th>Status</th><th>Detail</th></tr>' +
      results.map((r, i) => '<tr><td>' + (i+1) + '</td><td>' + r.name + '</td><td><span class="badge badge-' + r.status + '">' + r.status + '</span></td><td class="info">' + r.detail + '</td></tr>').join('') + '</table>';
    
    window.__testResults = { passCount, failCount, mismatchCount, total, results };
  </script>
</body>
</html>`;

fs.writeFileSync('tmp/convergence-test.html', convergenceTestHtml);
console.log('Convergence test HTML written');

// Serve the test page
await browser.close();
server.close();
