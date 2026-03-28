/**
 * Virtual filesystem — maps the portfolio as a Unix directory tree.
 * Each node is either a directory (children) or a file (content).
 */

export interface FSFile {
  type: 'file';
  content: string;
  size?: string;
  modified?: string;
}

export interface FSDir {
  type: 'dir';
  children: Record<string, FSNode>;
  modified?: string;
}

export type FSNode = FSFile | FSDir;

export const filesystem: FSDir = {
  type: 'dir',
  children: {
    'about.txt': {
      type: 'file',
      size: '0.4K',
      modified: 'Jan 2026',
      content: `<span class="t-info">Stüssy Senik</span>
<span class="t-muted">Creative Technologist & DevEx Engineer</span>

Building at the intersection of science, design,
cinema, computation and code.

Based in <span class="t-accent">Bed-Stuy, Brooklyn</span>.
Vibe-coding since 2017.`,
    },
    'contact.nfo': {
      type: 'file',
      size: '0.2K',
      modified: 'Jan 2026',
      content: `<span class="t-accent">GitHub</span>    github.com/stussysenik
<span class="t-accent">Email</span>     itsmxzou@gmail.com
<span class="t-accent">Web</span>       stussysenik.com
<span class="t-accent">Location</span>  NYC / Prague`,
    },
    'resume.txt': {
      type: 'file',
      size: '2.1K',
      modified: 'Mar 2026',
      content: `<span class="t-info">══════════════════════════════════════</span>
<span class="t-info">  STÜSSY SENIK — Creative Technologist</span>
<span class="t-info">══════════════════════════════════════</span>

<span class="t-accent">FOCUS</span>
  DevEx & Experience Design Engineering
  クリエイティブ・テクノロジスト

<span class="t-accent">STACK</span>
  TypeScript · SvelteKit · React · Svelte 5
  AR/XR · WebGPU · Three.js · Zig · WASM
  Elixir/Phoenix · Rails · Swift · Python

<span class="t-accent">HIGHLIGHTS</span>
  ▸ 54 public repositories on GitHub
  ▸ AI terminal tools (gemini-cli)
  ▸ Background agents coding system
  ▸ WebGL video-to-ASCII converter
  ▸ Zig + WebGPU pixel-scene showcase
  ▸ AR/XR filters and interactive experiences
  ▸ Physics visualizations & simulations

<span class="t-accent">EDUCATION</span>
  ▸ Physics (PH-213 + computational)
  ▸ Self-directed CS + design

<span class="t-muted">Type 'cat cv.pdf' for the full CV page.</span>`,
    },
    'cv.pdf': {
      type: 'file',
      size: '4.2K',
      modified: 'Mar 2026',
      content: `<span class="t-muted">Binary file — opening in browser...</span>
<span class="t-accent">→ /cv</span>`,
    },
    works: {
      type: 'dir',
      modified: 'Mar 2026',
      children: {
        'ipod-emulator': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Feb 2026',
              content: `<span class="t-info">iPod Emulator</span>
<span class="t-muted">Category: tool</span>
<span class="t-accent">URL:</span> https://ipod-music.vercel.app
A faithful recreation of the classic iPod interface.`,
            },
          },
        },
        'typewriter': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Feb 2026',
              content: `<span class="t-info">Typewriter</span>
<span class="t-muted">Category: tool</span>
<span class="t-accent">URL:</span> https://clean-writer.vercel.app
A clean, distraction-free writing tool.`,
            },
          },
        },
        'checklist': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Feb 2026',
              content: `<span class="t-info">Infinite Checklist</span>
<span class="t-muted">Category: tool</span>
<span class="t-accent">URL:</span> https://infinite-checklist.vercel.app
A recursive checklist that goes as deep as you need.`,
            },
          },
        },
        'physics': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Feb 2026',
              content: `<span class="t-info">PH-213 Physics</span>
<span class="t-muted">Category: science</span>
<span class="t-accent">URL:</span> https://ph213.vercel.app
Interactive physics visualizations — waves, electrostatics, circuits.`,
            },
          },
        },
        'dvd-corner': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.1K',
              modified: 'Jan 2026',
              content: `<span class="t-info">DVD Corner</span>
<span class="t-muted">Category: art</span>
<span class="t-accent">URL:</span> https://dvd-video-animation.vercel.app
Will it hit the corner? Classic DVD screensaver.`,
            },
          },
        },
        'wavelength-radio': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Jan 2026',
              content: `<span class="t-info">WAVELENGTH RADIO</span>
<span class="t-muted">Category: music</span>
<span class="t-accent">URL:</span> https://wavelength-radio.vercel.app
Internet radio with a visual frequency display.`,
            },
          },
        },
        'creative-block': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.1K',
              modified: 'Jan 2026',
              content: `<span class="t-info">Creative Block</span>
<span class="t-muted">Category: art</span>
<span class="t-accent">URL:</span> https://creative-block.vercel.app
Interactive generative art piece.`,
            },
          },
        },
        'spinning-wheel': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Jan 2026',
              content: `<span class="t-info">Spinning Wheel AR Filter</span>
<span class="t-muted">Category: AR/XR</span>
<span class="t-accent">URL:</span> https://spinning-wheel-filter.vercel.app
Augmented reality spinning wheel experience.`,
            },
          },
        },
        'bboy-filter': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Jan 2026',
              content: `<span class="t-info">AR B-Boy Filter</span>
<span class="t-muted">Category: AR/XR</span>
<span class="t-accent">URL:</span> https://bboy-filter.vercel.app
Breakdancing augmented reality filter.`,
            },
          },
        },
        'uyr-problem': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Feb 2026',
              content: `<span class="t-info">UYR Problem</span>
<span class="t-muted">Category: tool</span>
<span class="t-accent">URL:</span> https://uyr-problem.vercel.app
Utility for understanding your own problem space.`,
            },
          },
        },
        'mymind-clone': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Feb 2026',
              content: `<span class="t-info">mymind.com Clone</span>
<span class="t-muted">Category: personal software</span>
<span class="t-accent">URL:</span> https://curate-your-own-network.stussysenik.com
Curate your own network — personal curation tool.`,
            },
          },
        },
      },
    },
    repos: {
      type: 'dir',
      modified: 'Mar 2026',
      children: {
        'gemini-cli': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">gemini-cli</span> <span class="t-muted">— geminicli.com</span>
An open-source AI agent that brings the power of
Gemini directly into your terminal.`,
            },
          },
        },
        'background-agents': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">background-agents</span> <span class="t-muted">— backgroundagents.dev</span>
An open-source background agents coding system.`,
            },
          },
        },
        'video2ascii': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">video2ascii</span> <span class="t-muted">— npm: video2ascii</span>
WebGL-powered React Component for video to ASCII conversion.
<span class="t-accent">Language:</span> TypeScript`,
            },
          },
        },
        'zig-web-gpu': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">zig-web-gpu-graphics</span>
Zig + WebGPU pixel-scene showcase compiled to WASM.
Procedural retro graphics and cinematic scene variations.
<span class="t-accent">Language:</span> Zig`,
            },
          },
        },
        'phoenix-math': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">phoenix-math-stream</span>
Phoenix LiveView math streaming app with SymPy and NVIDIA NIM.
<span class="t-accent">Language:</span> Elixir`,
            },
          },
        },
        'bitchat': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Mar 2026',
              content: `<span class="t-info">bitchat</span>
Bluetooth mesh chat, IRC vibes.
<span class="t-accent">Language:</span> Swift`,
            },
          },
        },
        'ANE': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.3K',
              modified: 'Mar 2026',
              content: `<span class="t-info">ANE</span>
Training neural networks on Apple Neural Engine
via reverse-engineered private APIs.
<span class="t-accent">Language:</span> Objective-C`,
            },
          },
        },
        'invoices': {
          type: 'dir',
          children: {
            'README.md': {
              type: 'file',
              size: '0.2K',
              modified: 'Mar 2026',
              content: `<span class="t-info">invoices</span> <span class="t-muted">— billable.me</span>
Invoicing software with editable everything,
print to PDF and logo support.`,
            },
          },
        },
      },
    },
    talks: {
      type: 'dir',
      modified: 'Feb 2026',
      children: {
        'README.md': {
          type: 'file',
          size: '0.1K',
          modified: 'Feb 2026',
          content: `<span class="t-muted">Navigate to /talks for the full list.</span>
<span class="t-accent">→ /talks</span>`,
        },
      },
    },
    blog: {
      type: 'dir',
      modified: 'Mar 2026',
      children: {
        'README.md': {
          type: 'file',
          size: '0.1K',
          modified: 'Mar 2026',
          content: `<span class="t-muted">Navigate to /blog for all posts.</span>
<span class="t-accent">→ /blog</span>`,
        },
      },
    },
    secrets: {
      type: 'dir',
      modified: '???',
      children: {
        '.hidden': {
          type: 'file',
          size: '0.1K',
          modified: '???',
          content: `<span class="t-warning">🔒 ACCESS DENIED</span>
<span class="t-muted">Just kidding. There are no secrets here.</span>
<span class="t-muted">...or are there?</span>

Try: <span class="t-accent">cowsay</span>, <span class="t-accent">matrix</span>, <span class="t-accent">fortune</span>, <span class="t-accent">pipes</span>`,
        },
      },
    },
  },
};

/** Resolve a path string to a filesystem node */
export function resolvePath(currentPath: string, target: string): { node: FSNode | null; resolvedPath: string } {
  // Handle absolute vs relative
  let parts: string[];
  if (target.startsWith('/') || target.startsWith('~')) {
    parts = target.replace('~', '').split('/').filter(Boolean);
  } else {
    const currentParts = currentPath.replace('~', '').split('/').filter(Boolean);
    parts = [...currentParts, ...target.split('/').filter(Boolean)];
  }

  // Resolve .. and .
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === '..') resolved.pop();
    else if (part !== '.') resolved.push(part);
  }

  // Walk the tree
  let node: FSNode = filesystem;
  for (const part of resolved) {
    if (node.type !== 'dir' || !node.children[part]) {
      return { node: null, resolvedPath: '~/' + resolved.join('/') };
    }
    node = node.children[part];
  }

  const resolvedPath = resolved.length === 0 ? '~' : '~/' + resolved.join('/');
  return { node, resolvedPath };
}

/** Get directory listing for a path */
export function listDir(node: FSDir): { name: string; isDir: boolean; size?: string; modified?: string }[] {
  return Object.entries(node.children).map(([name, child]) => ({
    name,
    isDir: child.type === 'dir',
    size: child.type === 'file' ? child.size : '—',
    modified: child.modified || '—',
  })).sort((a, b) => {
    // Directories first, then alphabetical
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

/** Build a tree string recursively */
export function buildTree(node: FSDir, prefix: string = '', isLast: boolean = true): string {
  const entries = Object.entries(node.children);
  let result = '';
  entries.forEach(([name, child], i) => {
    const last = i === entries.length - 1;
    const connector = last ? '└── ' : '├── ';
    const cls = child.type === 'dir' ? 't-accent' : 't-muted';
    const suffix = child.type === 'dir' ? '/' : '';
    result += `${prefix}${connector}<span class="${cls}">${name}${suffix}</span>\n`;
    if (child.type === 'dir') {
      const newPrefix = prefix + (last ? '    ' : '│   ');
      result += buildTree(child, newPrefix, last);
    }
  });
  return result;
}
