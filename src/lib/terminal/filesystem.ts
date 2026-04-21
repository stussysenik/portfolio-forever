/**
 * Virtual filesystem — maps the portfolio as a Unix directory tree.
 * Ported from clj/portfolio/terminal/filesystem.cljs
 */

export interface FSNode {
	type: "dir" | "file";
	children?: Record<string, FSNode>;
	content?: string;
	size?: string;
	modified?: string;
}

export const filesystem: FSNode = {
	type: "dir",
	children: {
		"about.txt": {
			type: "file",
			size: "0.4K",
			modified: "Jan 2026",
			content: `<span class="t-info">Stüssy Senik</span>\n<span class="t-muted">Design Engineer & Creative Producer</span>\n\nBuilding at the intersection of science, design,\ncinema, computation and code.\n\nBased in <span class="t-accent">Bed-Stuy, Brooklyn</span>.\nVibe-coding since 2017.`,
		},
		"contact.nfo": {
			type: "file",
			size: "0.2K",
			modified: "Jan 2026",
			content: `<span class="t-accent">GitHub</span>    github.com/stussysenik\n<span class="t-accent">Email</span>     itsmxzou@gmail.com\n<span class="t-accent">Web</span>       stussysenik.com\n<span class="t-accent">Location</span>  NYC / Prague`,
		},
		"resume.txt": {
			type: "file",
			size: "2.1K",
			modified: "Mar 2026",
			content: `<span class="t-info">══════════════════════════════════════</span>\n<span class="t-info">  STÜSSY SENIK — Creative Technologist</span>\n<span class="t-info">══════════════════════════════════════</span>\n\n<span class="t-accent">FOCUS</span>\n  DevEx & Experience Design Engineering\n  クリエイティブ・テクノロジスト\n\n<span class="t-accent">STACK</span>\n  TypeScript · SvelteKit · React · Svelte 5\n  AR/XR · WebGPU · Three.js · Zig · WASM\n  Elixir/Phoenix · Rails · Swift · Python\n\n<span class="t-accent">HIGHLIGHTS</span>\n  ▸ 54 public repositories on GitHub\n  ▸ AI terminal tools (gemini-cli)\n  ▸ Background agents coding system\n  ▸ WebGL video-to-ASCII converter\n  ▸ Zig + WebGPU pixel-scene showcase\n  ▸ AR/XR filters and interactive experiences\n  ▸ Physics visualizations & simulations\n\n<span class="t-accent">EDUCATION</span>\n  ▸ Physics (PH-213 + computational)\n  ▸ Self-directed CS + design\n\n<span class="t-muted">Type 'cat cv.pdf' for the full CV page.</span>`,
		},
		"cv.pdf": {
			type: "file",
			size: "4.2K",
			modified: "Mar 2026",
			content: `<span class="t-muted">Binary file — opening in browser...</span>\n<span class="t-accent">→ /cv</span>`,
		},
		works: {
			type: "dir",
			modified: "Mar 2026",
			children: {
				"ipod-emulator": {
					type: "dir",
					children: {
						"README.md": {
							type: "file",
							size: "0.3K",
							modified: "Feb 2026",
							content: `<span class="t-info">iPod Emulator</span>\n<span class="t-muted">Category: tool</span>\n<span class="t-accent">URL:</span> https://ipod-music.vercel.app\nA faithful recreation of the classic iPod interface.`,
						},
					},
				},
				typewriter: {
					type: "dir",
					children: {
						"README.md": {
							type: "file",
							size: "0.2K",
							modified: "Feb 2026",
							content: `<span class="t-info">Typewriter</span>\n<span class="t-muted">Category: tool</span>\n<span class="t-accent">URL:</span> https://clean-writer.vercel.app\nA clean, distraction-free writing tool.`,
						},
					},
				},
				checklist: {
					type: "dir",
					children: {
						"README.md": {
							type: "file",
							size: "0.2K",
							modified: "Feb 2026",
							content: `<span class="t-info">Infinite Checklist</span>\n<span class="t-muted">Category: tool</span>\n<span class="t-accent">URL:</span> https://infinite-checklist.vercel.app\nA recursive checklist that goes as deep as you need.`,
						},
					},
				},
			},
		},
		repos: {
			type: "dir",
			modified: "Mar 2026",
			children: {
				"gemini-cli": {
					type: "dir",
					children: {
						"README.md": {
							type: "file",
							size: "0.3K",
							modified: "Mar 2026",
							content: `<span class="t-info">gemini-cli</span> <span class="t-muted">— geminicli.com</span>\nAn open-source AI agent that brings the power of\nGemini directly into your terminal.`,
						},
					},
				},
			},
		},
		secrets: {
			type: "dir",
			modified: "???",
			children: {
				hidden: {
					type: "file",
					size: "0.1K",
					modified: "???",
					content: `<span class="t-warning">🔒 ACCESS DENIED</span>\n<span class="t-muted">Just kidding. There are no secrets here.</span>\n<span class="t-muted">...or are there?</span>\n\nTry: <span class="t-accent">cowsay</span>, <span class="t-accent">matrix</span>, <span class="t-accent">fortune</span>, <span class="t-accent">pipes</span>`,
				},
			},
		},
	},
};

export function resolvePath(currentPath: string, target: string) {
	let normalizedTarget = target;
	if (target.startsWith("~")) {
		normalizedTarget = target.replace("~", "");
	}

	const isAbsolute = target.startsWith("/") || target.startsWith("~");
	const parts = (isAbsolute ? normalizedTarget : currentPath.replace("~", "") + "/" + target)
		.split("/")
		.filter((p) => p !== "" && p !== ".");

	const resolvedParts: string[] = [];
	for (const part of parts) {
		if (part === "..") {
			resolvedParts.pop();
		} else {
			resolvedParts.push(part);
		}
	}

	let node: FSNode | undefined = filesystem;
	for (const part of resolvedParts) {
		if (node?.type === "dir" && node.children) {
			node = node.children[part];
		} else {
			node = undefined;
			break;
		}
	}

	const resolvedPath = resolvedParts.length === 0 ? "~" : "~/" + resolvedParts.join("/");
	return { node, resolvedPath };
}

export function listDir(node: FSNode) {
	if (node.type !== "dir" || !node.children) return [];

	return Object.entries(node.children)
		.map(([name, child]) => ({
			name,
			isDir: child.type === "dir",
			size: child.type === "file" ? child.size || "0K" : "—",
			modified: child.modified || "—",
		}))
		.sort((a, b) => {
			if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
			return a.name.localeCompare(b.name);
		});
}

export function buildTree(node: FSNode, prefix = "", isLast = true): string {
	if (node.type !== "dir" || !node.children) return "";

	let result = "";
	const entries = Object.entries(node.children);
	entries.forEach(([name, child], i) => {
		const last = i === entries.length - 1;
		const connector = last ? "└── " : "├── ";
		const cls = child.type === "dir" ? "t-accent" : "t-muted";
		const suffix = child.type === "dir" ? "/" : "";

		result += `${prefix}${connector}<span class="${cls}">${name}${suffix}</span>\n`;
		if (child.type === "dir") {
			result += buildTree(child, prefix + (last ? "    " : "│   "), last);
		}
	});

	return result;
}
