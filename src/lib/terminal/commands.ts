/**
 * Terminal command registry — ported from clj/portfolio/terminal/commands.cljs
 */
import * as fs from "./filesystem";
import * as gh from "./github";
import { navigateTo } from "../utils/navigation";

export interface CommandOutput {
	type: "text" | "iframe" | "animation" | "image";
	content?: string;
	url?: string;
	title?: string;
	id?: string;
	src?: string;
	alt?: string;
}

export const text = (content: string): CommandOutput => ({ type: "text", content });
export const iframe = (url: string, title: string): CommandOutput => ({ type: "iframe", url, title });
export const animation = (id: string): CommandOutput => ({ type: "animation", id });
export const image = (src: string, alt: string): CommandOutput => ({ type: "image", src, alt });
export const errorMsg = (msg: string): CommandOutput => text(`<span class="t-error">${msg}</span>`);

export function escapeHtml(s: string) {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export function pad(s: string, len: number) {
	return s.padEnd(len, " ");
}

export const defaultFortunes = [
	"\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke",
	"\"The best way to predict the future is to invent it.\" — Alan Kay",
	"\"Simplicity is the ultimate sophistication.\" — Leonardo da Vinci",
	"\"Talk is cheap. Show me the code.\" — Linus Torvalds",
	"\"First, solve the problem. Then, write the code.\" — John Johnson",
];

export interface ShellState {
	cwd: string;
	history: string[];
	inVim: boolean;
}

export function createShellState(): ShellState {
	return { cwd: "~", history: [], inVim: false };
}

export const defaultAsciiLogo = `
<span class="t-accent">  ███████╗████████╗██╗   ██╗</span>
<span class="t-accent">  ██╔════╝╚══██╔══╝██║   ██║</span>
<span class="t-accent">  ███████╗   ██║   ██║   ██║</span>
<span class="t-accent">  ╚════██║   ██║   ██║   ██║</span>
<span class="t-accent">  ███████║   ██║   ╚██████╔╝</span>
<span class="t-accent">  ╚══════╝   ╚═╝    ╚═════╝</span>`;

export function createCommandRegistry(data?: any) {
	const fortunes = data?.fortunes || defaultFortunes;
	const asciiLogo = data?.asciiLogo || defaultAsciiLogo;
	
	const commands: Record<string, any> = {
		help: {
			tier: 1,
			desc: "Show available commands",
			fn: () => {
				let output = "\n<span class=\"t-muted\">── UNIX ESSENTIALS ──</span>\n";
				Object.keys(commands).filter(k => commands[k].tier === 1).forEach(k => {
					output += `  <span class="t-accent">${pad(k, 14)}</span> <span class="t-muted">${commands[k].desc}</span>\n`;
				});
				output += "\n<span class=\"t-muted\">── DEV SHOWCASE ──</span>\n";
				Object.keys(commands).filter(k => commands[k].tier === 2).forEach(k => {
					output += `  <span class="t-accent">${pad(k, 14)}</span> <span class="t-muted">${commands[k].desc}</span>\n`;
				});
				return [text(output)];
			}
		},
		clear: {
			tier: 1,
			desc: "Clear terminal",
			fn: () => [text("__CLEAR__")]
		},
		ls: {
			tier: 1,
			desc: "List directory contents",
			fn: (args: string[], state: ShellState) => {
				const detailed = args.includes("-l") || args.includes("-la") || args.includes("-al");
				const target = args.find(a => !a.startsWith("-")) || ".";
				const { node } = fs.resolvePath(state.cwd, target);
				
				if (!node || node.type !== "dir") {
					return [errorMsg(`ls: cannot access '${target}': No such directory`)];
				}
				
				const entries = fs.listDir(node);
				if (detailed) {
					const lines = entries.map(e => {
						const perm = e.isDir ? "drwxr-xr-x" : "-rw-r--r--";
						const cls = e.isDir ? "t-accent" : "t-muted";
						return `${perm}  ${pad(e.size, 6)} ${pad(e.modified, 10)} <span class="${cls}">${e.name}${e.isDir ? "/" : ""}</span>`;
					});
					return [text(lines.join("\n"))];
				}
				const items = entries.map(e => `<span class="${e.isDir ? "t-accent" : "t-muted"}">${e.name}${e.isDir ? "/" : ""}</span>`);
				return [text(items.join("    "))];
			}
		},
		cd: {
			tier: 1,
			desc: "Change directory",
			fn: (args: string[], state: ShellState) => {
				const target = args[0] || "~";
				const { node, resolvedPath } = fs.resolvePath(state.cwd, target);
				if (!node) return [errorMsg(`cd: no such directory: ${target}`)];
				if (node.type !== "dir") return [errorMsg(`cd: not a directory: ${target}`)];
				state.cwd = resolvedPath;
				return [];
			}
		},
		pwd: {
			tier: 1,
			desc: "Print working directory",
			fn: (_args: string[], state: ShellState) => [text(`<span class="t-accent">/home/stussysenik/${state.cwd.replace("~", "")}</span>`.replace(/\/+$/, "").replace(/\/+/g, "/"))]
		},
		whoami: {
			tier: 1,
			desc: "Display current user",
			fn: () => [text("<span class=\"t-info\">stussysenik</span> <span class=\"t-muted\">— Design Engineer & Creative Producer</span>")]
		},
		neofetch: {
			tier: 2,
			desc: "System information",
			fn: () => {
				const uptimeDays = Math.floor((Date.now() - new Date("2026-01-01").getTime()) / 86400000);
				const info = [
					`<span class="t-info">stussysenik</span><span class="t-muted">@</span><span class="t-info">portfolio</span>`,
					`<span class="t-muted">─────────────────────</span>`,
					`<span class="t-accent">${pad("Role", 9)}</span> <span class="t-muted">Design Engineer</span>`,
					`<span class="t-accent">${pad("Stack", 9)}</span> <span class="t-muted">Svelte 5 · TypeScript</span>`,
					`<span class="t-accent">${pad("Uptime", 9)}</span> <span class="t-muted">${uptimeDays} days</span>`,
					`<span class="t-accent">${pad("Repos", 9)}</span> <span class="t-muted">${gh.githubProfile.publicRepos} public</span>`,
					"",
					`<span style="background:#f7768e;color:#f7768e;">██</span><span style="background:#e0af68;color:#e0af68;">██</span><span style="background:#9ece6a;color:#9ece6a;">██</span><span style="background:#2ac3de;color:#2ac3de;">██</span>`
				];
				const logoLines = asciiLogo.trim().split("\n");
				const maxLines = Math.max(logoLines.length, info.length);
				let output = "";
				for (let i = 0; i < maxLines; i++) {
					const logo = logoLines[i] || pad("", 30);
					const inf = info[i] || "";
					output += logo + "    " + inf + "\n";
				}
				return [text("\n" + output)];
			}
		},
		fortune: {
			tier: 3,
			desc: "Random wisdom",
			fn: () => [text(`\n<span class="t-info">${fortunes[Math.floor(Math.random() * fortunes.length)]}</span>\n`)]
		}
	};

	return {
		executeCommand: (input: string, state: ShellState): CommandOutput[] => {
			const trimmed = input.trim();
			if (!trimmed) return [];
			state.history.push(trimmed);
			
			if (state.inVim) {
				if ([":q!", ":q", ":wq"].includes(trimmed)) {
					state.inVim = false;
					return [text("<span class=\"t-success\">Escaped vim.</span>")];
				}
				return [text("<span class=\"t-muted\">-- INSERT -- (type :q! to exit)</span>")];
			}

			const [cmdName, ...args] = trimmed.split(/\s+/);
			const command = commands[cmdName];
			if (!command) {
				return [errorMsg(`command not found: ${cmdName}. Type help for available commands.`)];
			}
			return command.fn(args, state);
		},
		getCompletions: (input: string, state: ShellState): string[] => {
			const parts = input.split(/\s+/);
			if (parts.length <= 1) {
				const prefix = parts[0] || "";
				return Object.keys(commands).filter(k => k.startsWith(prefix));
			}
			return []; // File completion simplified for now
		}
	};
}

export const defaultRegistry = createCommandRegistry();
