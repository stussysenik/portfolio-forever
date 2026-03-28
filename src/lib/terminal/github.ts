/**
 * GitHub repos snapshot — static data from stussysenik's GitHub profile.
 * Avoids API rate limits and loading delays in the terminal.
 */

export interface Repo {
  name: string;
  description: string;
  language: string;
  url: string;
  homepage?: string;
}

export const githubProfile = {
  username: 'stussysenik',
  name: 'senik',
  bio: 'i code with alphabet',
  location: 'NYC / PRG',
  company: 'vibe-coding since 2017',
  publicRepos: 54,
  followers: 5,
  website: 'stussysenik.com',
};

export const repos: Repo[] = [
  { name: 'gemini-cli', description: 'AI agent that brings Gemini into your terminal', language: 'TypeScript', url: 'https://github.com/stussysenik/gemini-cli', homepage: 'geminicli.com' },
  { name: 'background-agents', description: 'Open-source background agents coding system', language: 'TypeScript', url: 'https://github.com/stussysenik/background-agents', homepage: 'backgroundagents.dev' },
  { name: 'video2ascii', description: 'WebGL-powered React Component for video to ASCII', language: 'TypeScript', url: 'https://github.com/stussysenik/video2ascii' },
  { name: 'zig-web-gpu-graphics', description: 'Zig + WebGPU pixel-scene showcase → WASM', language: 'Zig', url: 'https://github.com/stussysenik/zig-web-gpu-graphics' },
  { name: 'phoenix-math-stream', description: 'Phoenix LiveView math streaming with SymPy + NVIDIA NIM', language: 'Elixir', url: 'https://github.com/stussysenik/phoenix-math-stream' },
  { name: 'bitchat', description: 'Bluetooth mesh chat, IRC vibes', language: 'Swift', url: 'https://github.com/stussysenik/bitchat' },
  { name: 'ANE', description: 'Neural network training on Apple Neural Engine via reverse-engineered APIs', language: 'Obj-C', url: 'https://github.com/stussysenik/ANE' },
  { name: 'invoices', description: 'Invoicing software — editable everything, print to PDF', language: 'JavaScript', url: 'https://github.com/stussysenik/invoices', homepage: 'billable.me' },
  { name: 'ruby-millionaire', description: 'AeroParts Pro — aerospace e-commerce (Rails 8 + Stripe)', language: 'Ruby', url: 'https://github.com/stussysenik/ruby-millionaire' },
  { name: 'autoresearch', description: 'AI agents running research on single-GPU nanochat training', language: 'Python', url: 'https://github.com/stussysenik/autoresearch' },
  { name: 'SwiftUI-Agent-Skill', description: 'SwiftUI agent skill for Claude Code & Codex', language: 'Swift', url: 'https://github.com/stussysenik/SwiftUI-Agent-Skill' },
  { name: 'portfolio-forever', description: 'This portfolio — SvelteKit + design systems', language: 'Svelte', url: 'https://github.com/stussysenik/portfolio-forever' },
];

/** Language color map for terminal display */
export const langColors: Record<string, string> = {
  'TypeScript': '#3178c6',
  'JavaScript': '#f1e05a',
  'Svelte': '#ff3e00',
  'Zig': '#f7a41d',
  'Elixir': '#6e4a7e',
  'Swift': '#f05138',
  'Obj-C': '#438eff',
  'Python': '#3572a5',
  'Ruby': '#701516',
  'HTML': '#e34c26',
};
