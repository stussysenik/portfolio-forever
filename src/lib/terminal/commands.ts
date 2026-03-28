/**
 * Terminal command registry — 30 commands across 4 tiers.
 * Each command returns OutputLine[] for rich rendering.
 */

import { filesystem, resolvePath, listDir, buildTree, type FSDir } from './filesystem';
import { repos, githubProfile, langColors } from './github';

// ── Output Types ──────────────────────────────────────────

export type OutputLine =
  | { type: 'text'; content: string }
  | { type: 'iframe'; url: string; title: string }
  | { type: 'animation'; id: 'matrix' | 'pipes' }
  | { type: 'image'; src: string; alt: string };

// ── Shell State ───────────────────────────────────────────

export interface ShellState {
  cwd: string;
  history: string[];
  inVim: boolean;
}

export function createShellState(): ShellState {
  return { cwd: '~', history: [], inVim: false };
}

// ── Command Type ──────────────────────────────────────────

type CmdFn = (args: string[], state: ShellState) => OutputLine[];

interface CommandDef {
  fn: CmdFn;
  desc: string;
  tier: 1 | 2 | 3 | 4;
}

// ── Helpers ───────────────────────────────────────────────

function text(content: string): OutputLine {
  return { type: 'text', content };
}

function error(msg: string): OutputLine {
  return text(`<span class="t-error">${msg}</span>`);
}

function pad(str: string, len: number): string {
  return str.padEnd(len);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Fortunes ──────────────────────────────────────────────

const fortunes = [
  '"Any sufficiently advanced technology is indistinguishable from magic." — Arthur C. Clarke',
  '"The best way to predict the future is to invent it." — Alan Kay',
  '"Simplicity is the ultimate sophistication." — Leonardo da Vinci',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Code is like humor. When you have to explain it, it\'s bad." — Cory House',
  '"The function of good software is to make the complex appear to be simple." — Grady Booch',
  '"It\'s not a bug — it\'s an undocumented feature." — Anonymous',
  '"Debugging is twice as hard as writing the code in the first place." — Brian Kernighan',
  '"The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie',
  '"Design is not just what it looks like. Design is how it works." — Steve Jobs',
  '"In the middle of difficulty lies opportunity." — Albert Einstein',
  '"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." — Antoine de Saint-Exupéry',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"The computer was born to solve problems that did not exist before." — Bill Gates',
];

// ── Neofetch ASCII ────────────────────────────────────────

const asciiLogo = `<span class="t-accent">  ███████╗████████╗██╗   ██╗</span>
<span class="t-accent">  ██╔════╝╚══██╔══╝██║   ██║</span>
<span class="t-accent">  ███████╗   ██║   ██║   ██║</span>
<span class="t-accent">  ╚════██║   ██║   ██║   ██║</span>
<span class="t-accent">  ███████║   ██║   ╚██████╔╝</span>
<span class="t-accent">  ╚══════╝   ╚═╝    ╚═════╝</span>`;

// ── Command Implementations ───────────────────────────────

const commands: Record<string, CommandDef> = {

  // ── TIER 1: Unix Essentials ─────────────────────────────

  help: {
    tier: 1,
    desc: 'Show available commands',
    fn: () => {
      const grouped: Record<string, [string, string][]> = {
        'UNIX ESSENTIALS': [],
        'DEV SHOWCASE': [],
        'EASTER EGGS': [],
      };
      for (const [name, cmd] of Object.entries(commands)) {
        const tier = cmd.tier;
        const group = tier <= 1 ? 'UNIX ESSENTIALS' : tier === 2 ? 'DEV SHOWCASE' : 'EASTER EGGS';
        grouped[group].push([name, cmd.desc]);
      }
      const lines: string[] = [];
      for (const [group, cmds] of Object.entries(grouped)) {
        lines.push(`\n<span class="t-muted">── ${group} ──</span>`);
        for (const [name, desc] of cmds) {
          lines.push(`  <span class="t-accent">${pad(name, 14)}</span> <span class="t-muted">${desc}</span>`);
        }
      }
      return [text(lines.join('\n'))];
    },
  },

  clear: {
    tier: 1,
    desc: 'Clear the terminal',
    fn: () => [{ type: 'text', content: '__CLEAR__' }],
  },

  ls: {
    tier: 1,
    desc: 'List directory contents',
    fn: (args, state) => {
      const detailed = args.includes('-la') || args.includes('-l') || args.includes('-al');
      const target = args.find(a => !a.startsWith('-')) || '.';
      const { node } = resolvePath(state.cwd, target);

      if (!node || node.type !== 'dir') {
        return [error(`ls: cannot access '${target}': No such directory`)];
      }

      const entries = listDir(node as FSDir);
      if (detailed) {
        const lines = entries.map(e => {
          const perm = e.isDir ? 'drwxr-xr-x' : '-rw-r--r--';
          const cls = e.isDir ? 't-accent' : 't-muted';
          const suffix = e.isDir ? '/' : '';
          return `${perm}  ${pad(e.size || '—', 6)} ${pad(e.modified || '—', 10)} <span class="${cls}">${e.name}${suffix}</span>`;
        });
        return [text(lines.join('\n'))];
      }

      const items = entries.map(e => {
        const cls = e.isDir ? 't-accent' : 't-muted';
        const suffix = e.isDir ? '/' : '';
        return `<span class="${cls}">${e.name}${suffix}</span>`;
      });
      return [text(items.join('    '))];
    },
  },

  cd: {
    tier: 1,
    desc: 'Change directory',
    fn: (args, state) => {
      const target = args[0] || '~';
      const { node, resolvedPath } = resolvePath(state.cwd, target);
      if (!node) return [error(`cd: no such directory: ${target}`)];
      if (node.type !== 'dir') return [error(`cd: not a directory: ${target}`)];
      state.cwd = resolvedPath;
      return [];
    },
  },

  pwd: {
    tier: 1,
    desc: 'Print working directory',
    fn: (_args, state) => [text(`<span class="t-accent">/home/stussysenik/${state.cwd.replace('~', '')}</span>`.replace(/\/+$/, '').replace(/\/\//g, '/'))],
  },

  tree: {
    tier: 1,
    desc: 'Show directory tree',
    fn: (args, state) => {
      const target = args[0] || '.';
      const { node, resolvedPath } = resolvePath(state.cwd, target);
      if (!node || node.type !== 'dir') return [error(`tree: '${target}' is not a directory`)];
      const header = `<span class="t-accent">${resolvedPath}/</span>`;
      return [text(header + '\n' + buildTree(node as FSDir))];
    },
  },

  cat: {
    tier: 1,
    desc: 'Read file contents',
    fn: (args, state) => {
      if (!args[0]) return [error('cat: missing file operand')];
      const { node } = resolvePath(state.cwd, args[0]);
      if (!node) return [error(`cat: ${args[0]}: No such file or directory`)];
      if (node.type === 'dir') return [error(`cat: ${args[0]}: Is a directory`)];
      // Special case: cv.pdf opens the page
      if (args[0] === 'cv.pdf') {
        return [text(node.content), { type: 'text', content: '__NAV__/cv' }];
      }
      return [text(node.content)];
    },
  },

  whoami: {
    tier: 1,
    desc: 'Display current user',
    fn: () => [text(`<span class="t-info">stussysenik</span> <span class="t-muted">— Design Engineer & Creative Producer, Bed-Stuy BK</span>`)],
  },

  echo: {
    tier: 1,
    desc: 'Echo text to terminal',
    fn: (args) => [text(escapeHtml(args.join(' ')))],
  },

  date: {
    tier: 1,
    desc: 'Show current date and time',
    fn: () => [text(`<span class="t-info">${new Date().toString()}</span>`)],
  },

  history: {
    tier: 1,
    desc: 'Show command history',
    fn: (_args, state) => {
      if (state.history.length === 0) return [text('<span class="t-muted">No commands in history.</span>')];
      const lines = state.history.map((cmd, i) =>
        `  <span class="t-muted">${String(i + 1).padStart(4)}</span>  ${cmd}`
      );
      return [text(lines.join('\n'))];
    },
  },

  // ── TIER 2: Dev Showcase ────────────────────────────────

  neofetch: {
    tier: 2,
    desc: 'System information',
    fn: () => {
      const uptimeDays = Math.floor((Date.now() - new Date('2026-01-01').getTime()) / 86400000);
      const info = [
        `<span class="t-info">stussysenik</span><span class="t-muted">@</span><span class="t-info">portfolio</span>`,
        `<span class="t-muted">─────────────────────</span>`,
        `<span class="t-accent">Role</span>     <span class="t-muted">Design Engineer & Creative Producer</span>`,
        `<span class="t-accent">Stack</span>    <span class="t-muted">SvelteKit · TypeScript · AR/XR</span>`,
        `<span class="t-accent">Location</span> <span class="t-muted">Bed-Stuy, Brooklyn</span>`,
        `<span class="t-accent">Uptime</span>   <span class="t-muted">${uptimeDays} days (since Jan 2026)</span>`,
        `<span class="t-accent">Projects</span> <span class="t-muted">11 live works</span>`,
        `<span class="t-accent">Repos</span>    <span class="t-muted">${githubProfile.publicRepos} public</span>`,
        `<span class="t-accent">Themes</span>   <span class="t-muted">4 (minimal, studio, darkroom, accessible)</span>`,
        `<span class="t-accent">Shell</span>    <span class="t-muted">portfolio-terminal v2.0.0</span>`,
        ``,
        `<span style="background:#f7768e;color:#f7768e;">██</span><span style="background:#e0af68;color:#e0af68;">██</span><span style="background:#9ece6a;color:#9ece6a;">██</span><span style="background:#2ac3de;color:#2ac3de;">██</span><span style="background:#7aa2f7;color:#7aa2f7;">██</span><span style="background:#bb9af7;color:#bb9af7;">██</span>`,
      ];

      const logoLines = asciiLogo.split('\n');
      const combined = logoLines.map((line, i) => {
        const infoLine = info[i] || '';
        return `${line}    ${infoLine}`;
      });
      // Add remaining info lines
      for (let i = logoLines.length; i < info.length; i++) {
        combined.push(`${''.padEnd(30)}    ${info[i]}`);
      }
      return [text('\n' + combined.join('\n') + '\n')];
    },
  },

  gh: {
    tier: 2,
    desc: 'GitHub CLI (repos, stats)',
    fn: (args) => {
      const sub = args[0];
      if (sub === 'repos') {
        const header = `<span class="t-muted">${pad('REPO', 24)} ${pad('LANG', 12)} DESCRIPTION</span>`;
        const divider = '<span class="t-muted">─'.repeat(72) + '</span>';
        const lines = repos.map(r => {
          const color = langColors[r.language] || '#888';
          const lang = `<span style="color:${color}">●</span> ${pad(r.language, 10)}`;
          return `<span class="t-accent">${pad(r.name, 24)}</span> ${lang} <span class="t-muted">${r.description}</span>`;
        });
        return [text([header, divider, ...lines].join('\n'))];
      }
      if (sub === 'stats') {
        const langs = repos.reduce((acc, r) => {
          acc[r.language] = (acc[r.language] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        const langLines = Object.entries(langs)
          .sort((a, b) => b[1] - a[1])
          .map(([lang, count]) => {
            const color = langColors[lang] || '#888';
            const bar = '█'.repeat(count * 3) + '░'.repeat(Math.max(0, 15 - count * 3));
            return `  <span style="color:${color}">●</span> ${pad(lang, 14)} ${bar} ${count}`;
          });
        return [text([
          `<span class="t-info">${githubProfile.username}</span> <span class="t-muted">— ${githubProfile.bio}</span>`,
          ``,
          `<span class="t-accent">Public repos:</span>  ${githubProfile.publicRepos}`,
          `<span class="t-accent">Location:</span>      ${githubProfile.location}`,
          `<span class="t-accent">Website:</span>       ${githubProfile.website}`,
          ``,
          `<span class="t-muted">── LANGUAGES ──</span>`,
          ...langLines,
        ].join('\n'))];
      }
      return [text(`<span class="t-muted">Usage: gh repos | gh stats</span>`)];
    },
  },

  'git': {
    tier: 2,
    desc: 'Show portfolio git log',
    fn: (args) => {
      if (args[0] !== 'log') return [text('<span class="t-muted">Usage: git log</span>')];
      const commits = [
        { hash: 'bbd958e', msg: 'feat: 4-theme system, camera framing, footer BedStuy', date: '2026-03-28' },
        { hash: '287c38d', msg: 'feat: terminal default theme, works simplification', date: '2026-03-27' },
        { hash: 'ea355fa', msg: 'docs: add badge bar and centered header to README', date: '2026-03-26' },
        { hash: 'ec83993', msg: 'docs: update README, DOCS, PROGRESS for spacing', date: '2026-03-25' },
        { hash: '0c5d11b', msg: 'test: 317 Playwright tests — mobile works suite', date: '2026-03-24' },
        { hash: '8148cf4', msg: 'feat: colored highlight backgrounds on homepage', date: '2026-03-23' },
        { hash: 'cd98983', msg: 'fix: nav polish — unified @ dropdown, email blue', date: '2026-03-22' },
        { hash: 'c8b9a60', msg: 'fix: scroll to top on /works page load', date: '2026-03-21' },
      ];
      const lines = commits.map(c =>
        `<span class="t-warning">${c.hash}</span> <span class="t-muted">(${c.date})</span> ${c.msg}`
      );
      return [text(lines.join('\n'))];
    },
  },

  top: {
    tier: 2,
    desc: 'Skills as running processes',
    fn: () => {
      const skills = [
        { pid: '001', name: 'TypeScript', cpu: 94, status: 'running' },
        { pid: '002', name: 'SvelteKit', cpu: 90, status: 'running' },
        { pid: '003', name: 'React', cpu: 85, status: 'running' },
        { pid: '004', name: 'AR/XR', cpu: 78, status: 'running' },
        { pid: '005', name: 'Design Systems', cpu: 88, status: 'running' },
        { pid: '006', name: 'WebGPU/Three.js', cpu: 72, status: 'running' },
        { pid: '007', name: 'Zig/WASM', cpu: 65, status: 'learning' },
        { pid: '008', name: 'Elixir/Phoenix', cpu: 60, status: 'learning' },
        { pid: '009', name: 'Swift/SwiftUI', cpu: 68, status: 'running' },
        { pid: '010', name: 'Python/ML', cpu: 70, status: 'running' },
        { pid: '011', name: 'Rails', cpu: 62, status: 'running' },
        { pid: '012', name: 'Color Science', cpu: 82, status: 'running' },
      ];
      const header = `<span class="t-muted">${pad('PID', 6)} ${pad('SKILL', 18)} ${pad('CPU%', 6)} ${pad('BAR', 20)} STATUS</span>`;
      const divider = '<span class="t-muted">' + '─'.repeat(65) + '</span>';
      const lines = skills.map(s => {
        const filled = Math.round(s.cpu / 5);
        const bar = `<span class="t-accent">${'█'.repeat(filled)}</span><span class="t-muted">${'░'.repeat(20 - filled)}</span>`;
        const statusCls = s.status === 'running' ? 't-success' : 't-warning';
        return `${pad(s.pid, 6)} <span class="t-info">${pad(s.name, 18)}</span> ${pad(String(s.cpu) + '%', 6)} ${bar} <span class="${statusCls}">${s.status}</span>`;
      });
      return [text([
        `<span class="t-info">top</span> <span class="t-muted">— skill proficiency monitor</span>`,
        '',
        header,
        divider,
        ...lines,
      ].join('\n'))];
    },
  },

  brew: {
    tier: 2,
    desc: 'Tech stack as packages',
    fn: (args) => {
      if (args[0] !== 'list' && args.length > 0) return [text('<span class="t-muted">Usage: brew list</span>')];
      const packages = [
        'svelte@5.0.0', 'sveltekit@2.49.1', 'typescript@5.x', 'vite@7.2.6',
        'playwright@1.57.0', 'tailwind-css@4.x', 'three.js@latest',
        'zig@0.13', 'elixir@1.17', 'phoenix@1.7', 'rails@8.1',
        'swift@5.10', 'python@3.12', 'bun@latest', 'node@22',
      ];
      const cols = 3;
      const colWidth = 22;
      const rows: string[] = [];
      for (let i = 0; i < packages.length; i += cols) {
        const row = packages.slice(i, i + cols).map(p => `<span class="t-accent">${pad(p, colWidth)}</span>`).join('');
        rows.push(row);
      }
      return [text([
        `<span class="t-muted">${packages.length} packages installed:</span>`,
        '',
        ...rows,
      ].join('\n'))];
    },
  },

  open: {
    tier: 2,
    desc: 'Open a project in browser',
    fn: (args, state) => {
      if (!args[0]) return [text('<span class="t-muted">Usage: open &lt;project-name&gt; or open &lt;url&gt;</span>')];
      const target = args[0].toLowerCase();

      // URL map for project names
      const urlMap: Record<string, { url: string; title: string }> = {
        'ipod': { url: 'https://ipod-music.vercel.app', title: 'iPod Emulator' },
        'ipod-emulator': { url: 'https://ipod-music.vercel.app', title: 'iPod Emulator' },
        'typewriter': { url: 'https://clean-writer.vercel.app', title: 'Typewriter' },
        'checklist': { url: 'https://infinite-checklist.vercel.app', title: 'Infinite Checklist' },
        'physics': { url: 'https://ph213.vercel.app', title: 'PH-213 Physics' },
        'dvd': { url: 'https://dvd-video-animation.vercel.app', title: 'DVD Corner' },
        'radio': { url: 'https://wavelength-radio.vercel.app', title: 'WAVELENGTH RADIO' },
        'wavelength': { url: 'https://wavelength-radio.vercel.app', title: 'WAVELENGTH RADIO' },
        'creative-block': { url: 'https://creative-block.vercel.app', title: 'Creative Block' },
        'spinning-wheel': { url: 'https://spinning-wheel-filter.vercel.app', title: 'Spinning Wheel AR' },
        'bboy': { url: 'https://bboy-filter.vercel.app', title: 'AR B-Boy Filter' },
        'uyr': { url: 'https://uyr-problem.vercel.app', title: 'UYR Problem' },
        'mymind': { url: 'https://curate-your-own-network.stussysenik.com', title: 'mymind.com Clone' },
      };

      const match = urlMap[target];
      if (match) {
        return [
          text(`<span class="t-muted">Opening <span class="t-accent">${match.title}</span>...</span>`),
          { type: 'iframe', url: match.url, title: match.title },
        ];
      }

      // If it's a URL, open it directly
      if (target.startsWith('http')) {
        return [
          text(`<span class="t-muted">Opening <span class="t-accent">${args[0]}</span>...</span>`),
          { type: 'iframe', url: args[0], title: args[0] },
        ];
      }

      // If it's a route, navigate
      const routes = ['works', 'cv', 'talks', 'likes', 'blog', 'gifts', 'process', 'terminal'];
      if (routes.includes(target)) {
        return [text(`__NAV__/${target}`)];
      }

      return [error(`open: '${target}' not found. Try: ${Object.keys(urlMap).slice(0, 5).join(', ')}...`)];
    },
  },

  browse: {
    tier: 2,
    desc: 'Browse a URL in terminal',
    fn: (args, state) => {
      if (!args[0]) return [text('<span class="t-muted">Usage: browse &lt;url&gt; or browse &lt;project&gt;</span>')];
      return commands.open.fn(args, state);
    },
  },

  wget: {
    tier: 2,
    desc: 'Download page info',
    fn: (args) => {
      if (!args[0]) return [text('<span class="t-muted">Usage: wget &lt;url&gt;</span>')];
      const url = args[0];
      const timestamp = new Date().toISOString();
      return [text([
        `<span class="t-muted">--${timestamp}--</span>`,
        `<span class="t-muted">Resolving ${url}...</span> <span class="t-success">connected.</span>`,
        `<span class="t-muted">HTTP request sent, awaiting response...</span> <span class="t-success">200 OK</span>`,
        `<span class="t-muted">Length:</span> <span class="t-info">unspecified</span> <span class="t-muted">[text/html]</span>`,
        `<span class="t-muted">Saving to:</span> <span class="t-accent">'index.html'</span>`,
        ``,
        `<span class="t-success">index.html saved.</span> <span class="t-muted">(portfolio terminal doesn't actually download files)</span>`,
        ``,
        `<span class="t-muted">Try:</span> <span class="t-accent">open ${url}</span> <span class="t-muted">to view it inline instead.</span>`,
      ].join('\n'))];
    },
  },

  img: {
    tier: 2,
    desc: 'Display an image inline',
    fn: (args) => {
      if (!args[0]) return [text('<span class="t-muted">Usage: img &lt;path&gt;</span>')];
      const imageMap: Record<string, string> = {
        'logo.png': '/favicon.png',
        'preview.png': '/previews/curate-your-own-network.png',
      };
      const src = imageMap[args[0]] || args[0];
      return [{ type: 'image', src, alt: args[0] }];
    },
  },

  // ── TIER 3: Easter Eggs ─────────────────────────────────

  matrix: {
    tier: 3,
    desc: 'Enter the Matrix',
    fn: () => [{ type: 'animation', id: 'matrix' }],
  },

  cowsay: {
    tier: 3,
    desc: 'Cow says what?',
    fn: (args) => {
      const msg = args.join(' ') || 'moo';
      const border = '_'.repeat(msg.length + 2);
      const cow = `
 ${border}
< ${msg} >
 ${'-'.repeat(msg.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`;
      return [text(`<span class="t-success">${cow}</span>`)];
    },
  },

  fortune: {
    tier: 3,
    desc: 'Random wisdom',
    fn: () => {
      const f = fortunes[Math.floor(Math.random() * fortunes.length)];
      return [text(`\n<span class="t-info">${f}</span>\n`)];
    },
  },

  sudo: {
    tier: 3,
    desc: 'Superuser do',
    fn: () => [text(`<span class="t-error">Permission denied.</span> <span class="t-muted">Nice try. 🔒</span>`)],
  },

  vim: {
    tier: 3,
    desc: 'Open vim',
    fn: (_args, state) => {
      state.inVim = true;
      return [text(`<span class="t-warning">You're now stuck in vim.</span>
<span class="t-muted">Type</span> <span class="t-accent">:q!</span> <span class="t-muted">to escape (if you can).</span>

<span class="t-muted">~
~
~
~
-- INSERT --</span>`)];
    },
  },

  pipes: {
    tier: 3,
    desc: 'Pipes screensaver',
    fn: () => [{ type: 'animation', id: 'pipes' }],
  },

  sl: {
    tier: 3,
    desc: 'Steam locomotive',
    fn: () => {
      const train = `<span class="t-muted">      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|___________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\\___/
  \\_/      \\O=====O=====O=====O_/      \\_/</span>`;
      return [text(train)];
    },
  },

  theme: {
    tier: 3,
    desc: 'Switch theme',
    fn: (args) => {
      const valid = ['minimal', 'studio', 'darkroom', 'accessible'];
      if (!args[0] || !valid.includes(args[0])) {
        return [text(`<span class="t-muted">Usage: theme &lt;${valid.join('|')}&gt;</span>`)];
      }
      return [text(`__THEME__${args[0]}`)];
    },
  },

  welcome: {
    tier: 3,
    desc: 'Show welcome message',
    fn: () => [text('__WELCOME__')],
  },

  'rm': {
    tier: 3,
    desc: 'Remove files',
    fn: (args) => {
      if (args.includes('-rf') && args.includes('/')) {
        return [text(`<span class="t-error">Nice try.</span> <span class="t-muted">This portfolio is production. 🏗️</span>`)];
      }
      return [text(`<span class="t-error">rm: operation not permitted in portfolio terminal</span>`)];
    },
  },

  exit: {
    tier: 3,
    desc: 'Exit terminal',
    fn: () => [text(`<span class="t-muted">There is no escape. You live here now.</span>
<span class="t-muted">Try</span> <span class="t-accent">open works</span> <span class="t-muted">to explore projects instead.</span>`)],
  },

  ssh: {
    tier: 3,
    desc: 'Connect via SSH',
    fn: (args) => {
      const host = args[0] || 'stussysenik.com';
      return [text(`<span class="t-muted">ssh: connect to host</span> <span class="t-accent">${host}</span> <span class="t-muted">port 22</span>
<span class="t-success">Connection established.</span>
<span class="t-muted">Welcome to stussysenik's portfolio server.</span>
<span class="t-muted">Last login: ${new Date().toLocaleDateString()} from 127.0.0.1</span>`)];
    },
  },

  man: {
    tier: 3,
    desc: 'Manual pages',
    fn: (args) => {
      if (!args[0]) return [text('<span class="t-muted">What manual page do you want?\nUsage: man &lt;command&gt;</span>')];
      const cmd = commands[args[0]];
      if (!cmd) return [error(`No manual entry for ${args[0]}`)];
      return [text(`<span class="t-info">${args[0].toUpperCase()}(1)</span>                    <span class="t-muted">Portfolio Terminal Manual</span>

<span class="t-accent">NAME</span>
       ${args[0]} — ${cmd.desc}

<span class="t-accent">SYNOPSIS</span>
       <span class="t-info">${args[0]}</span> [options] [arguments]

<span class="t-accent">DESCRIPTION</span>
       Part of the portfolio terminal, tier ${cmd.tier}.
       Type <span class="t-accent">help</span> for all available commands.`)];
    },
  },

  curl: {
    tier: 3,
    desc: 'Fetch data',
    fn: (args) => {
      if (!args[0]) return [text('<span class="t-muted">Usage: curl &lt;url&gt;</span>')];
      return [text(`<span class="t-muted">  % Total    % Received</span>
<span class="t-muted">  100   256    100   256    0     0   1024      0 --:--:-- --:--:--</span>

{
  <span class="t-accent">"name"</span>: <span class="t-success">"Stüssy Senik"</span>,
  <span class="t-accent">"role"</span>: <span class="t-success">"Design Engineer & Creative Producer"</span>,
  <span class="t-accent">"location"</span>: <span class="t-success">"Bed-Stuy, Brooklyn"</span>,
  <span class="t-accent">"status"</span>: <span class="t-success">"available"</span>,
  <span class="t-accent">"repos"</span>: <span class="t-warning">54</span>,
  <span class="t-accent">"vibes"</span>: <span class="t-success">"immaculate"</span>
}`)];
    },
  },
};

// ── Public API ─────────────────────────────────────────────

export function getCommands(): Record<string, CommandDef> {
  return commands;
}

export function executeCommand(input: string, state: ShellState): OutputLine[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  state.history.push(trimmed);

  // Handle vim mode
  if (state.inVim) {
    if (trimmed === ':q!' || trimmed === ':q' || trimmed === ':wq') {
      state.inVim = false;
      return [text('<span class="t-success">Escaped vim. You\'re free.</span>')];
    }
    return [text(`<span class="t-muted">-- INSERT -- (type :q! to exit)</span>`)];
  }

  const [cmd, ...args] = trimmed.split(/\s+/);
  const command = commands[cmd];

  if (!command) {
    return [error(`command not found: ${cmd}. Type <span class="t-accent">help</span> for available commands.`)];
  }

  return command.fn(args, state);
}

/** Get all command names for tab completion */
export function getCommandNames(): string[] {
  return Object.keys(commands);
}

/** Get completion suggestions for current input */
export function getCompletions(input: string, state: ShellState): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    // Complete command names
    const prefix = parts[0] || '';
    return Object.keys(commands).filter(c => c.startsWith(prefix));
  }

  // Complete filesystem paths
  const cmd = parts[0];
  const partial = parts[parts.length - 1] || '';

  // Determine the directory to list
  const lastSlash = partial.lastIndexOf('/');
  const dirPath = lastSlash >= 0 ? partial.substring(0, lastSlash) || '.' : '.';
  const prefix = lastSlash >= 0 ? partial.substring(lastSlash + 1) : partial;

  const { node } = resolvePath(state.cwd, dirPath);
  if (!node || node.type !== 'dir') return [];

  const matches = Object.entries(node.children)
    .filter(([name]) => name.startsWith(prefix))
    .map(([name, child]) => {
      const base = lastSlash >= 0 ? `${dirPath}/${name}` : name;
      return child.type === 'dir' ? `${base}/` : base;
    });

  return matches.slice(0, 20);
}
