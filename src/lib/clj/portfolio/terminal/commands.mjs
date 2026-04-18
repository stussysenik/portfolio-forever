import * as squint_core from 'squint-cljs/core.js';
import * as fs from './filesystem.mjs';
import * as portfolio_DOT_terminal_DOT_filesystem from './filesystem.mjs';
import * as gh from './github.mjs';
import * as portfolio_DOT_terminal_DOT_github from './github.mjs';
var text = function (content) {
return ({"type": "text", "content": content});

};
var iframe = function (url, title) {
return ({"type": "iframe", "url": url, "title": title});

};
var animation = function (id) {
return ({"type": "animation", "id": id});

};
var image = function (src, alt) {
return ({"type": "image", "src": src, "alt": alt});

};
var error_msg = function (msg) {
return text(`${"<span class=\"t-error\">"}${msg??''}${"</span>"}`);

};
var escape_html = function (s) {
return `${s??''}`.replace(/\&/, "&amp;").replace(/\</, "&lt;").replace(/\>/, "&gt;").replace(/\"/, "&quot;");

};
var pad = function (s, len) {
return `${s??''}`.padEnd(len, " ");

};
var default_fortunes = ["\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke", "\"The best way to predict the future is to invent it.\" — Alan Kay", "\"Simplicity is the ultimate sophistication.\" — Leonardo da Vinci", "\"Talk is cheap. Show me the code.\" — Linus Torvalds", "\"First, solve the problem. Then, write the code.\" — John Johnson", "\"Code is like humor. When you have to explain it, it's bad.\" — Cory House", "\"The function of good software is to make the complex appear to be simple.\" — Grady Booch", "\"It's not a bug — it's an undocumented feature.\" — Anonymous", "\"Debugging is twice as hard as writing the code in the first place.\" — Brian Kernighan", "\"The only way to learn a new programming language is by writing programs in it.\" — Dennis Ritchie", "\"Design is not just what it looks like. Design is how it works.\" — Steve Jobs", "\"In the middle of difficulty lies opportunity.\" — Albert Einstein", "\"Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.\" — Antoine de Saint-Exupéry", "\"Make it work, make it right, make it fast.\" — Kent Beck", "\"The computer was born to solve problems that did not exist before.\" — Bill Gates"];
var create_shell_state = function () {
return ({"cwd": "~", "history": [], "inVim": false});

};
var default_ascii_logo = `${"<span class=\"t-accent\">  ███████╗████████╗██╗   ██╗</span>\n"}${"<span class=\"t-accent\">  ██╔════╝╚══██╔══╝██║   ██║</span>\n"}${"<span class=\"t-accent\">  ███████╗   ██║   ██║   ██║</span>\n"}${"<span class=\"t-accent\">  ╚════██║   ██║   ██║   ██║</span>\n"}${"<span class=\"t-accent\">  ███████║   ██║   ╚██████╔╝</span>\n"}${"<span class=\"t-accent\">  ╚══════╝   ╚═╝    ╚═════╝</span>"}`;
var default_whoami = "<span class=\"t-info\">stussysenik</span> <span class=\"t-muted\">— Design Engineer & Creative Producer, Bed-Stuy BK</span>";
var default_neofetch_fields = [({"label": "Role", "value": "Design Engineer & Creative Producer"}), ({"label": "Stack", "value": "SvelteKit · TypeScript · AR/XR"}), ({"label": "Location", "value": "Bed-Stuy, Brooklyn"}), ({"label": "Projects", "value": "11 live works"}), ({"label": "Themes", "value": "4 (minimal, studio, terminal, b&w)"}), ({"label": "Shell", "value": "portfolio-terminal v2.0.0"})];
var default_project_urls = ({"creative-block": ({"url": "https://creative-block.vercel.app", "title": "Creative Block"}), "mymind": ({"url": "https://curate-your-own-network.stussysenik.com", "title": "mymind.com Clone"}), "typewriter": ({"url": "https://clean-writer.vercel.app", "title": "Typewriter"}), "physics": ({"url": "https://ph213.vercel.app", "title": "PH-213 Physics"}), "checklist": ({"url": "https://infinite-checklist.vercel.app", "title": "Infinite Checklist"}), "radio": ({"url": "https://wavelength-radio.vercel.app", "title": "WAVELENGTH RADIO"}), "spinning-wheel": ({"url": "https://spinning-wheel-filter.vercel.app", "title": "Spinning Wheel AR"}), "bboy": ({"url": "https://bboy-filter.vercel.app", "title": "AR B-Boy Filter"}), "ipod-emulator": ({"url": "https://ipod-music.vercel.app", "title": "iPod Emulator"}), "wavelength": ({"url": "https://wavelength-radio.vercel.app", "title": "WAVELENGTH RADIO"}), "ipod": ({"url": "https://ipod-music.vercel.app", "title": "iPod Emulator"}), "uyr": ({"url": "https://uyr-problem.vercel.app", "title": "UYR Problem"}), "dvd": ({"url": "https://dvd-video-animation.vercel.app", "title": "DVD Corner"})});
var default_skills = [({"pid": "001", "name": "TypeScript", "cpu": 94, "status": "running"}), ({"pid": "002", "name": "SvelteKit", "cpu": 90, "status": "running"}), ({"pid": "003", "name": "React", "cpu": 85, "status": "running"}), ({"pid": "004", "name": "AR/XR", "cpu": 78, "status": "running"}), ({"pid": "005", "name": "Design Systems", "cpu": 88, "status": "running"}), ({"pid": "006", "name": "WebGPU/Three.js", "cpu": 72, "status": "running"}), ({"pid": "007", "name": "Zig/WASM", "cpu": 65, "status": "learning"}), ({"pid": "008", "name": "Elixir/Phoenix", "cpu": 60, "status": "learning"}), ({"pid": "009", "name": "Swift/SwiftUI", "cpu": 68, "status": "running"}), ({"pid": "010", "name": "Python/ML", "cpu": 70, "status": "running"}), ({"pid": "011", "name": "Rails", "cpu": 62, "status": "running"}), ({"pid": "012", "name": "Color Science", "cpu": 82, "status": "running"})];
var default_packages = ["svelte@5.0.0", "sveltekit@2.49.1", "typescript@5.x", "vite@7.2.6", "playwright@1.57.0", "tailwind-css@4.x", "three.js@latest", "zig@0.13", "elixir@1.17", "phoenix@1.7", "rails@8.1", "swift@5.10", "python@3.12", "bun@latest", "node@22"];
var create_command_registry = function (data) {
const fortunes1 = (() => {
const or__23461__auto__2 = ((squint_core.truth_(data)) ? (data["fortunes"]) : (null));
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return default_fortunes};

})();
const ascii_logo3 = (() => {
const or__23461__auto__4 = ((squint_core.truth_(data)) ? (data["asciiLogo"]) : (null));
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return default_ascii_logo};

})();
const whoami_output5 = (() => {
const or__23461__auto__6 = ((squint_core.truth_(data)) ? (data["whoamiOutput"]) : (null));
if (squint_core.truth_(or__23461__auto__6)) {
return or__23461__auto__6} else {
return default_whoami};

})();
const neofetch_fields7 = (() => {
const or__23461__auto__8 = ((squint_core.truth_(data)) ? (data["neofetchFields"]) : (null));
if (squint_core.truth_(or__23461__auto__8)) {
return or__23461__auto__8} else {
return default_neofetch_fields};

})();
const url_map9 = Object.assign(({}), default_project_urls);
const _10 = ((squint_core.truth_((() => {
const and__23501__auto__11 = data;
if (squint_core.truth_(and__23501__auto__11)) {
return data["projectUrls"]} else {
return and__23501__auto__11};

})())) ? ((() => {
for (let G__12 of squint_core.iterable(data["projectUrls"])) {
const p13 = G__12;
(url_map9[p13["name"].toLowerCase()] = ({"url": p13["url"], "title": p13["name"]}))
}
})()) : (null));
const skills14 = ((squint_core.truth_((() => {
const and__23501__auto__15 = data;
if (squint_core.truth_(and__23501__auto__15)) {
return data["skills"]} else {
return and__23501__auto__15};

})())) ? (squint_core.map_indexed((function (i, s) {
return ({"pid": `${(i + 1)??''}`.padStart(3, "0"), "name": s["name"], "cpu": s["proficiency"], "status": (((s["proficiency"] >= 70)) ? ("running") : ("learning"))});

}), data["skills"])) : (default_skills));
const packages16 = ((squint_core.truth_((() => {
const and__23501__auto__17 = data;
if (squint_core.truth_(and__23501__auto__17)) {
return data["packages"]} else {
return and__23501__auto__17};

})())) ? (squint_core.map((function (p) {
return `${p["name"]??''}${"@"}${p["version"]??''}`;

}), data["packages"])) : (default_packages));
const commands18 = Object.create(null);
Object.assign(commands18, ({"vim": ({"tier": 3, "desc": "Open vim", "fn": (function (args, state) {
(state["inVim"] = true);
return [text("<span class=\"t-warning\">You're now stuck in vim.</span>\n<span class=\"t-muted\">Type</span> <span class=\"t-accent\">:q!</span> <span class=\"t-muted\">to escape (if you can).</span>\n\n<span class=\"t-muted\">~\n~\n~\n~\n-- INSERT --</span>")];

})}), "gh": ({"tier": 2, "desc": "GitHub CLI (repos, stats)", "fn": (function (args, state) {
const sub19 = args[0];
if ((sub19 === "repos")) {
const header20 = `${"<span class=\"t-muted\">"}${pad("REPO", 24)??''}${" "}${pad("LANG", 12)??''}${" DESCRIPTION</span>"}`;
const divider21 = `${"<span class=\"t-muted\">"}${"─".repeat(72)??''}${"</span>"}`;
const lines22 = squint_core.map((function (r) {
const color23 = (() => {
const or__23461__auto__24 = squint_core.get(gh.lang_colors, squint_core.get(r, "language"));
if (squint_core.truth_(or__23461__auto__24)) {
return or__23461__auto__24} else {
return "#888"};

})();
const lang25 = `${"<span style=\"color:"}${color23??''}${"\">●</span> "}${pad(squint_core.get(r, "language"), 10)??''}`;
return `${"<span class=\"t-accent\">"}${pad(squint_core.get(r, "name"), 24)??''}${"</span> "}${lang25}${" <span class=\"t-muted\">"}${squint_core.get(r, "description")??''}${"</span>"}`;

}), gh.repos);
return [text(squint_core.into_array(squint_core.concat([header20, divider21], lines22)).join("\n"))];
} else {
if ((sub19 === "stats")) {
const langs26 = squint_core.reduce((function (acc, r) {
return squint_core.assoc(acc, squint_core.get(r, "language"), ((() => {
const or__23461__auto__27 = squint_core.get(acc, squint_core.get(r, "language"));
if (squint_core.truth_(or__23461__auto__27)) {
return or__23461__auto__27} else {
return 0};

})() + 1));

}), ({}), gh.repos);
const lang_lines28 = squint_core.map((function (p__1) {
const vec__2932 = p__1;
const lang33 = squint_core.nth(vec__2932, 0, null);
const count34 = squint_core.nth(vec__2932, 1, null);
const color35 = (() => {
const or__23461__auto__36 = squint_core.get(gh.lang_colors, lang33);
if (squint_core.truth_(or__23461__auto__36)) {
return or__23461__auto__36} else {
return "#888"};

})();
const bar37 = `${"█".repeat((count34 * 3))??''}${"░".repeat(squint_core.max(0, (15 - (count34 * 3))))??''}`;
return `${"  <span style=\"color:"}${color35??''}${"\">●</span> "}${pad(lang33, 14)??''}${" "}${bar37}${" "}${count34??''}`;

}), squint_core.sort_by(squint_core.val, squint_core._GT_, langs26));
return [text(squint_core.into_array(squint_core.concat([`${"<span class=\"t-info\">"}${squint_core.get(gh.github_profile, "username")??''}${"</span> <span class=\"t-muted\">— "}${squint_core.get(gh.github_profile, "bio")??''}${"</span>"}`, "", `${"<span class=\"t-accent\">Public repos:</span>  "}${squint_core.get(gh.github_profile, "public-repos")??''}`, `${"<span class=\"t-accent\">Location:</span>      "}${squint_core.get(gh.github_profile, "location")??''}`, `${"<span class=\"t-accent\">Website:</span>       "}${squint_core.get(gh.github_profile, "website")??''}`, "", "<span class=\"t-muted\">── LANGUAGES ──</span>"], lang_lines28)).join("\n"))];
} else {
if ("else") {
return [text("<span class=\"t-muted\">Usage: gh repos | gh stats</span>")]} else {
return null}}};

})}), "open": ({"tier": 2, "desc": "Open a project in browser", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">Usage: open &lt;project-name&gt; or open &lt;url&gt;</span>")]} else {
const target38 = args[0].toLowerCase();
const match39 = url_map9[target38];
if (squint_core.truth_(match39)) {
return [text(`${"<span class=\"t-muted\">Opening <span class=\"t-accent\">"}${match39["title"]??''}${"</span>...</span>"}`), iframe(match39["url"], match39["title"])]} else {
if (squint_core.truth_(target38.startsWith("http"))) {
return [text(`${"<span class=\"t-muted\">Opening <span class=\"t-accent\">"}${args[0]??''}${"</span>...</span>"}`), iframe(args[0], args[0])]} else {
if (squint_core.truth_(squint_core.set(["works", "cv", "talks", "likes", "blog", "gifts", "process", "terminal"])(target38))) {
return [text(`${"__NAV__/"}${target38??''}`)]} else {
if ("else") {
return [error_msg(`${"open: '"}${target38??''}${"' not found. Try: "}${Object.keys(url_map9).slice(0, 5).join(", ")??''}${"..."}`)]} else {
return null}}}};
};

})}), "cat": ({"tier": 1, "desc": "Read file contents", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [error_msg("cat: missing file operand")]} else {
const res40 = fs.resolve_path(state["cwd"], args[0]);
const node41 = res40["node"];
if (squint_core.not(node41)) {
return [error_msg(`${"cat: "}${args[0]??''}${": No such file or directory"}`)]} else {
if ((node41["type"] === "dir")) {
return [error_msg(`${"cat: "}${args[0]??''}${": Is a directory"}`)]} else {
if ((args[0] === "cv.pdf")) {
return [text(node41["content"]), text("__NAV__/cv")]} else {
if ("else") {
return [text(node41["content"])]} else {
return null}}}};
};

})}), "neofetch": ({"tier": 2, "desc": "System information", "fn": (function (args, state) {
const uptime_days42 = Math.floor((((new Date()).getTime() - (new Date("2026-01-01")).getTime()) / 86400000));
const info43 = squint_core.atom([`${"<span class=\"t-info\">stussysenik</span><span class=\"t-muted\">@</span><span class=\"t-info\">portfolio</span>"}`, `${"<span class=\"t-muted\">─────────────────────</span>"}`]);
const _44 = (() => {
for (let G__45 of squint_core.iterable(neofetch_fields7)) {
const f46 = G__45;
squint_core.swap_BANG_(info43, squint_core.conj, `${"<span class=\"t-accent\">"}${pad(f46["label"], 9)??''}${"</span> <span class=\"t-muted\">"}${f46["value"]??''}${"</span>"}`)
}
})();
const _47 = squint_core.swap_BANG_(info43, squint_core.concat, [`${"<span class=\"t-accent\">"}${pad("Uptime", 9)??''}${"</span> <span class=\"t-muted\">"}${uptime_days42??''}${" days (since Jan 2026)</span>"}`, `${"<span class=\"t-accent\">"}${pad("Repos", 9)??''}${"</span> <span class=\"t-muted\">"}${squint_core.get(gh.github_profile, "public-repos")??''}${" public</span>"}`, "", "<span style=\"background:#f7768e;color:#f7768e;\">██</span><span style=\"background:#e0af68;color:#e0af68;\">██</span><span style=\"background:#9ece6a;color:#9ece6a;\">██</span><span style=\"background:#2ac3de;color:#2ac3de;\">██</span><span style=\"background:#7aa2f7;color:#7aa2f7;\">██</span><span style=\"background:#bb9af7;color:#bb9af7;\">██</span>"]);
const logo_lines48 = ascii_logo3.split("\n");
const combined49 = squint_core.atom([]);
for (let G__50 of squint_core.iterable(squint_core.range(squint_core.max(squint_core.count(logo_lines48), squint_core.count(squint_core.deref(info43)))))) {
const i51 = G__50;
const line52 = (((i51 < squint_core.count(logo_lines48))) ? (logo_lines48[i51]) : (pad("", 30)));
const info_line53 = (((i51 < squint_core.count(squint_core.deref(info43)))) ? (squint_core.nth(squint_core.deref(info43), i51)) : (""));
squint_core.swap_BANG_(combined49, squint_core.conj, `${line52??''}${"    "}${info_line53??''}`)
};
return [text(`${"\n"}${squint_core.into_array(squint_core.deref(combined49)).join("\n")??''}${"\n"}`)];

})}), "date": ({"tier": 1, "desc": "Show current date and time", "fn": (function (args, state) {
return [text(`${"<span class=\"t-info\">"}${(new Date()).toString()??''}${"</span>"}`)];

})}), "tree": ({"tier": 1, "desc": "Show directory tree", "fn": (function (args, state) {
const target54 = (() => {
const or__23461__auto__55 = args[0];
if (squint_core.truth_(or__23461__auto__55)) {
return or__23461__auto__55} else {
return "."};

})();
const res56 = fs.resolve_path(state["cwd"], target54);
const node57 = res56["node"];
if (squint_core.truth_((() => {
const or__23461__auto__58 = squint_core.not(node57);
if (or__23461__auto__58) {
return or__23461__auto__58} else {
return !(node57["type"] === "dir")};

})())) {
return [error_msg(`${"tree: '"}${target54??''}${"' is not a directory"}`)]} else {
const header59 = `${"<span class=\"t-accent\">"}${res56["resolvedPath"]??''}${"/</span>"}`;
return [text(`${header59}${"\n"}${fs.build_tree(node57)??''}`)];
};

})}), "pipes": ({"tier": 3, "desc": "Pipes screensaver", "fn": (function (args, state) {
return [animation("pipes")];

})}), "welcome": ({"tier": 3, "desc": "Show welcome message", "fn": (function (args, state) {
return [text("__WELCOME__")];

})}), "exit": ({"tier": 3, "desc": "Exit terminal", "fn": (function (args, state) {
return [text("<span class=\"t-muted\">There is no escape. You live here now.</span>\n<span class=\"t-muted\">Try</span> <span class=\"t-accent\">open works</span> <span class=\"t-muted\">to explore projects instead.</span>")];

})}), "pwd": ({"tier": 1, "desc": "Print working directory", "fn": (function (args, state) {
return [text(`${"<span class=\"t-accent\">/home/stussysenik/"}${state["cwd"].replace("~", "")??''}${"</span>"}`.replace(/\/+$/, "").replace(/\/\/+/, "/"))];

})}), "top": ({"tier": 2, "desc": "Skills as running processes", "fn": (function (args, state) {
const header60 = `${"<span class=\"t-muted\">"}${pad("PID", 6)??''}${" "}${pad("SKILL", 18)??''}${" "}${pad("CPU%", 6)??''}${" "}${pad("BAR", 20)??''}${" STATUS</span>"}`;
const divider61 = `${"<span class=\"t-muted\">"}${"─".repeat(65)??''}${"</span>"}`;
const lines62 = squint_core.map((function (s) {
const filled63 = Math.round((s["cpu"] / 5));
const bar64 = `${"<span class=\"t-accent\">"}${"█".repeat(filled63)??''}${"</span><span class=\"t-muted\">"}${"░".repeat((20 - filled63))??''}${"</span>"}`;
const status_cls65 = (((s["status"] === "running")) ? ("t-success") : ("t-warning"));
return `${pad(s["pid"], 6)??''}${" <span class=\"t-info\">"}${pad(s["name"], 18)??''}${"</span> "}${pad(`${s["cpu"]??''}${"%"}`, 6)??''}${" "}${bar64}${" <span class=\""}${status_cls65??''}${"\">"}${s["status"]??''}${"</span>"}`;

}), skills14);
return [text(squint_core.into_array(squint_core.concat(["<span class=\"t-info\">top</span> <span class=\"t-muted\">— skill proficiency monitor</span>", "", header60, divider61], lines62)).join("\n"))];

})}), "fortune": ({"tier": 3, "desc": "Random wisdom", "fn": (function (args, state) {
const f66 = squint_core.nth(fortunes1, Math.floor((Math.random() * squint_core.count(fortunes1))));
return [text(`${"\n<span class=\"t-info\">"}${f66??''}${"</span>\n"}`)];

})}), "cd": ({"tier": 1, "desc": "Change directory", "fn": (function (args, state) {
const target67 = (() => {
const or__23461__auto__68 = args[0];
if (squint_core.truth_(or__23461__auto__68)) {
return or__23461__auto__68} else {
return "~"};

})();
const res69 = fs.resolve_path(state["cwd"], target67);
const node70 = res69["node"];
if (squint_core.not(node70)) {
return [error_msg(`${"cd: no such directory: "}${target67??''}`)]} else {
if (!(node70["type"] === "dir")) {
return [error_msg(`${"cd: not a directory: "}${target67??''}`)]} else {
if ("else") {
(state["cwd"] = res69["resolvedPath"]);
return [];
} else {
return null}}};

})}), "git": ({"tier": 2, "desc": "Show portfolio git log", "fn": (function (args, state) {
if (!(args[0] === "log")) {
return [text("<span class=\"t-muted\">Usage: git log</span>")]} else {
const commits71 = [({"hash": "bbd958e", "msg": "feat: 4-theme system, camera framing, footer BedStuy", "date": "2026-03-28"}), ({"hash": "287c38d", "msg": "feat: terminal default theme, works simplification", "date": "2026-03-27"}), ({"hash": "ea355fa", "msg": "docs: add badge bar and centered header to README", "date": "2026-03-26"}), ({"hash": "ec83993", "msg": "docs: update README, DOCS, PROGRESS for spacing", "date": "2026-03-25"}), ({"hash": "0c5d11b", "msg": "test: 317 Playwright tests — mobile works suite", "date": "2026-03-24"}), ({"hash": "8148cf4", "msg": "feat: colored highlight backgrounds on homepage", "date": "2026-03-23"}), ({"hash": "cd98983", "msg": "fix: nav polish — unified @ dropdown, email blue", "date": "2026-03-22"}), ({"hash": "c8b9a60", "msg": "fix: scroll to top on /works page load", "date": "2026-03-21"})];
const lines72 = squint_core.map((function (_PERCENT_1) {
return `${"<span class=\"t-warning\">"}${squint_core.get(_PERCENT_1, "hash")??''}${"</span> <span class=\"t-muted\">("}${squint_core.get(_PERCENT_1, "date")??''}${")</span> "}${squint_core.get(_PERCENT_1, "msg")??''}`;

}), commits71);
return [text(squint_core.into_array(lines72).join("\n"))];
};

})}), "browse": ({"tier": 2, "desc": "Browse a URL in terminal", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">Usage: browse &lt;url&gt; or browse &lt;project&gt;</span>")]} else {
return commands18["open"]["fn"](args, state)};

})}), "sl": ({"tier": 3, "desc": "Steam locomotive", "fn": (function (args, state) {
const train73 = "<span class=\"t-muted\">      ====        ________                ___________\n  _D _|  |_______/        \\__I_I_____===__|___________|\n   |(_)---  |   H\\________/ |   |        =|___ ___|\n   /     |  |   H  |  |     |   |         ||_| |_||\n  |      |  |   H  |__--------------------| [___] |\n  | ________|___H__/__|_____/[][]~\\_______|       |\n  |/ |   |-----------I_____I [][] []  D   |=======|__\n__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__\n |/-=|___|=    ||    ||    ||    |_____/~\\___/\n  \\_/      \\O=====O=====O=====O_/      \\_/</span>";
return [text(train73)];

})}), "history": ({"tier": 1, "desc": "Show command history", "fn": (function (args, state) {
if ((0 === squint_core.count(state["history"]))) {
return [text("<span class=\"t-muted\">No commands in history.</span>")]} else {
const lines74 = squint_core.map_indexed((function (i, cmd) {
return `${"  <span class=\"t-muted\">"}${`${(i + 1)??''}`.padStart(4, " ")??''}${"</span>  "}${cmd??''}`;

}), state["history"]);
return [text(squint_core.into_array(lines74).join("\n"))];
};

})}), "ssh": ({"tier": 3, "desc": "Connect via SSH", "fn": (function (args, state) {
const host75 = (() => {
const or__23461__auto__76 = args[0];
if (squint_core.truth_(or__23461__auto__76)) {
return or__23461__auto__76} else {
return "stussysenik.com"};

})();
return [text(`${"<span class=\"t-muted\">ssh: connect to host</span> <span class=\"t-accent\">"}${host75??''}${"</span> <span class=\"t-muted\">port 22</span>\n<span class=\"t-success\">Connection established.</span>\n<span class=\"t-muted\">Welcome to stussysenik's portfolio server.</span>\n<span class=\"t-muted\">Last login: "}${(new Date()).toLocaleDateString()??''}${" from 127.0.0.1</span>"}`)];

})}), "ls": ({"tier": 1, "desc": "List directory contents", "fn": (function (args, state) {
const detailed77 = (() => {
const or__23461__auto__78 = args.includes("-la");
if (squint_core.truth_(or__23461__auto__78)) {
return or__23461__auto__78} else {
const or__23461__auto__79 = args.includes("-l");
if (squint_core.truth_(or__23461__auto__79)) {
return or__23461__auto__79} else {
return args.includes("-al")};
};

})();
const target80 = (() => {
const or__23461__auto__81 = squint_core.first(squint_core.filter((function (_PERCENT_1) {
return squint_core.not(_PERCENT_1.startsWith("-"));

}), args));
if (squint_core.truth_(or__23461__auto__81)) {
return or__23461__auto__81} else {
return "."};

})();
const res82 = fs.resolve_path(state["cwd"], target80);
const node83 = res82["node"];
if (squint_core.truth_((() => {
const or__23461__auto__84 = squint_core.not(node83);
if (or__23461__auto__84) {
return or__23461__auto__84} else {
return !(node83["type"] === "dir")};

})())) {
return [error_msg(`${"ls: cannot access '"}${target80??''}${"': No such directory"}`)]} else {
const entries85 = fs.list_dir(node83);
if (squint_core.truth_(detailed77)) {
const lines86 = squint_core.map((function (e) {
const perm87 = ((squint_core.truth_(e["isDir"])) ? ("drwxr-xr-x") : ("-rw-r--r--"));
const cls88 = ((squint_core.truth_(e["isDir"])) ? ("t-accent") : ("t-muted"));
const suffix89 = ((squint_core.truth_(e["isDir"])) ? ("/") : (""));
return `${perm87??''}${"  "}${pad((() => {
const or__23461__auto__90 = e["size"];
if (squint_core.truth_(or__23461__auto__90)) {
return or__23461__auto__90} else {
return "—"};

})(), 6)??''}${" "}${pad((() => {
const or__23461__auto__91 = e["modified"];
if (squint_core.truth_(or__23461__auto__91)) {
return or__23461__auto__91} else {
return "—"};

})(), 10)??''}${" <span class=\""}${cls88??''}${"\">"}${e["name"]??''}${suffix89??''}${"</span>"}`;

}), entries85);
return [text(squint_core.into_array(lines86).join("\n"))];
} else {
const items92 = squint_core.map((function (e) {
const cls93 = ((squint_core.truth_(e["isDir"])) ? ("t-accent") : ("t-muted"));
const suffix94 = ((squint_core.truth_(e["isDir"])) ? ("/") : (""));
return `${"<span class=\""}${cls93??''}${"\">"}${e["name"]??''}${suffix94??''}${"</span>"}`;

}), entries85);
return [text(squint_core.into_array(items92).join("    "))];
};
};

})}), "brew": ({"tier": 2, "desc": "Tech stack as packages", "fn": (function (args, state) {
if (squint_core.truth_(((squint_core.count(args) > 0) && !(args[0] === "list")))) {
return [text("<span class=\"t-muted\">Usage: brew list</span>")]} else {
const cols95 = 3;
const col_width96 = 22;
const rows97 = squint_core.atom([]);
let i98 = 0;
while(true){
if ((i98 < squint_core.count(packages16))) {
const slice99 = squint_core.take(cols95, squint_core.drop(i98, packages16));
const row100 = squint_core.into_array(squint_core.map((function (_PERCENT_1) {
return `${"<span class=\"t-accent\">"}${pad(_PERCENT_1, col_width96)??''}${"</span>"}`;

}), slice99)).join("");
squint_core.swap_BANG_(rows97, squint_core.conj, row100);
let G__101 = (i98 + cols95);
i98 = G__101;
continue;
};break;
}
;
return [text(squint_core.into_array(squint_core.concat([`${"<span class=\"t-muted\">"}${squint_core.count(packages16)??''}${" packages installed:</span>"}`, ""], squint_core.deref(rows97))).join("\n"))];
};

})}), "theme": ({"tier": 3, "desc": "Switch theme", "fn": (function (args, state) {
const valid102 = squint_core.set(["minimal", "studio", "terminal", "bw"]);
if (squint_core.truth_((() => {
const or__23461__auto__103 = squint_core.not(args[0]);
if (or__23461__auto__103) {
return or__23461__auto__103} else {
return squint_core.not(valid102(args[0]))};

})())) {
return [text("<span class=\"t-muted\">Usage: theme &lt;minimal|studio|terminal|bw&gt;</span>")]} else {
return [text(`__THEME__${args[0]??''}`)]};

})}), "matrix": ({"tier": 3, "desc": "Enter the Matrix", "fn": (function (args, state) {
return [animation("matrix")];

})}), "echo": ({"tier": 1, "desc": "Echo text to terminal", "fn": (function (args, state) {
return [text(escape_html(args.join(" ")))];

})}), "cowsay": ({"tier": 3, "desc": "Cow says what?", "fn": (function (args, state) {
const msg104 = (((squint_core.count(args) > 0)) ? (args.join(" ")) : ("moo"));
const border105 = "_".repeat((squint_core.count(msg104) + 2));
const cow106 = `${"\n "}${border105??''}${"\n< "}${msg104??''}${" >\n "}${"-".repeat((squint_core.count(msg104) + 2))??''}${"\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||"}`;
return [text(`${"<span class=\"t-success\">"}${cow106}${"</span>"}`)];

})}), "man": ({"tier": 3, "desc": "Manual pages", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">What manual page do you want?\nUsage: man &lt;command&gt;</span>")]} else {
const cmd107 = commands18[args[0]];
if (squint_core.not(cmd107)) {
return [error_msg(`${"No manual entry for "}${args[0]??''}`)]} else {
return [text(`${"<span class=\"t-info\">"}${args[0].toUpperCase()??''}${"(1)</span>                    <span class=\"t-muted\">Portfolio Terminal Manual</span>\n\n<span class=\"t-accent\">NAME</span>\n       "}${args[0]??''}${" — "}${cmd107["desc"]??''}${"\n\n<span class=\"t-accent\">SYNOPSIS</span>\n       <span class=\"t-info\">"}${args[0]??''}${"</span> [options] [arguments]\n\n<span class=\"t-accent\">DESCRIPTION</span>\n       Part of the portfolio terminal, tier "}${cmd107["tier"]??''}${".\n       Type <span class=\"t-accent\">help</span> for all available commands."}`)]};
};

})}), "help": ({"tier": 1, "desc": "Show available commands", "fn": (function (args, state) {
const lines108 = squint_core.atom([]);
for (let G__109 of squint_core.iterable([["UNIX ESSENTIALS", squint_core.filter((function (_PERCENT_1) {
return (commands18[_PERCENT_1]["tier"] <= 1);

}), Object.keys(commands18))], ["DEV SHOWCASE", squint_core.filter((function (_PERCENT_1) {
return (commands18[_PERCENT_1]["tier"] === 2);

}), Object.keys(commands18))], ["EASTER EGGS", squint_core.filter((function (_PERCENT_1) {
return (commands18[_PERCENT_1]["tier"] === 3);

}), Object.keys(commands18))]])) {
const vec__110113 = G__109;
const group114 = squint_core.nth(vec__110113, 0, null);
const cmds115 = squint_core.nth(vec__110113, 1, null);
squint_core.swap_BANG_(lines108, squint_core.conj, `${"\n<span class=\"t-muted\">── "}${group114??''}${" ──</span>"}`);
for (let G__116 of squint_core.iterable(cmds115)) {
const name117 = G__116;
const cmd118 = commands18[name117];
squint_core.swap_BANG_(lines108, squint_core.conj, `${"  <span class=\"t-accent\">"}${pad(name117, 14)??''}${"</span> <span class=\"t-muted\">"}${cmd118["desc"]??''}${"</span>"}`)
}
};
return [text(squint_core.into_array(squint_core.deref(lines108)).join("\n"))];

})}), "curl": ({"tier": 3, "desc": "Fetch data", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">Usage: curl &lt;url&gt;</span>")]} else {
return [text("<span class=\"t-muted\">  % Total    % Received</span>\n<span class=\"t-muted\">  100   256    100   256    0     0   1024      0 --:--:-- --:--:--</span>\n\n{\n  <span class=\"t-accent\">\"name\"</span>: <span class=\"t-success\">\"Stüssy Senik\"</span>,\n  <span class=\"t-accent\">\"role\"</span>: <span class=\"t-success\">\"Design Engineer & Creative Producer\"</span>,\n  <span class=\"t-accent\">\"location\"</span>: <span class=\"t-success\">\"Bed-Stuy, Brooklyn\"</span>,\n  <span class=\"t-accent\">\"status\"</span>: <span class=\"t-success\">\"available\"</span>,\n  <span class=\"t-accent\">\"repos\"</span>: <span class=\"t-warning\">54</span>,\n  <span class=\"t-accent\">\"vibes\"</span>: <span class=\"t-success\">\"immaculate\"</span>\n}")]};

})}), "whoami": ({"tier": 1, "desc": "Display current user", "fn": (function (args, state) {
return [text(whoami_output5)];

})}), "sudo": ({"tier": 3, "desc": "Superuser do", "fn": (function (args, state) {
return [text("<span class=\"t-error\">Permission denied.</span> <span class=\"t-muted\">Nice try. 🔒</span>")];

})}), "img": ({"tier": 2, "desc": "Display an image inline", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">Usage: img &lt;path&gt;</span>")]} else {
const image_map119 = ({"logo.png": "/favicon.png", "preview.png": "/previews/curate-your-own-network.png"});
const src120 = (() => {
const or__23461__auto__121 = image_map119[args[0]];
if (squint_core.truth_(or__23461__auto__121)) {
return or__23461__auto__121} else {
return args[0]};

})();
return [image(src120, args[0])];
};

})}), "clear": ({"tier": 1, "desc": "Clear the terminal", "fn": (function (args, state) {
return [text("__CLEAR__")];

})}), "rm": ({"tier": 3, "desc": "Remove files", "fn": (function (args, state) {
if (squint_core.truth_((() => {
const and__23501__auto__122 = args.includes("-rf");
if (squint_core.truth_(and__23501__auto__122)) {
return args.includes("/")} else {
return and__23501__auto__122};

})())) {
return [text("<span class=\"t-error\">Nice try.</span> <span class=\"t-muted\">This portfolio is production. 🏗️</span>")]} else {
return [text("<span class=\"t-error\">rm: operation not permitted in portfolio terminal</span>")]};

})}), "wget": ({"tier": 2, "desc": "Download page info", "fn": (function (args, state) {
if (squint_core.not(args[0])) {
return [text("<span class=\"t-muted\">Usage: wget &lt;url&gt;</span>")]} else {
const url123 = args[0];
const timestamp124 = (new Date()).toISOString();
return [text(squint_core.into_array([`${"<span class=\"t-muted\">--"}${timestamp124??''}${"--</span>"}`, `${"<span class=\"t-muted\">Resolving "}${url123??''}${"...</span> <span class=\"t-success\">connected.</span>"}`, "<span class=\"t-muted\">HTTP request sent, awaiting response...</span> <span class=\"t-success\">200 OK</span>", "<span class=\"t-muted\">Length:</span> <span class=\"t-info\">unspecified</span> <span class=\"t-muted\">[text/html]</span>", "<span class=\"t-muted\">Saving to:</span> <span class=\"t-accent\">'index.html'</span>", "", "<span class=\"t-success\">index.html saved.</span> <span class=\"t-muted\">(portfolio terminal doesn't actually download files)</span>", "", `${"<span class=\"t-muted\">Try:</span> <span class=\"t-accent\">open "}${url123??''}${"</span> <span class=\"t-muted\">to view it inline instead.</span>"}`]).join("\n"))];
};

})})}));
return ({"executeCommand": (function (input, state) {
const trimmed125 = input.trim();
if (squint_core._EQ_(trimmed125, "")) {
return []} else {
state["history"].push(trimmed125);
if (squint_core.truth_(state["inVim"])) {
if (squint_core.truth_((() => {
const or__23461__auto__126 = (trimmed125 === ":q!");
if (or__23461__auto__126) {
return or__23461__auto__126} else {
const or__23461__auto__127 = (trimmed125 === ":q");
if (or__23461__auto__127) {
return or__23461__auto__127} else {
return (trimmed125 === ":wq")};
};

})())) {
(state["inVim"] = false);
return [text("<span class=\"t-success\">Escaped vim. You're free.</span>")];
} else {
return [text("<span class=\"t-muted\">-- INSERT -- (type :q! to exit)</span>")]}} else {
const parts128 = trimmed125.split(/\s+/);
const cmd_name129 = parts128[0];
const args130 = parts128.slice(1);
const command131 = commands18[cmd_name129];
if (squint_core.not(command131)) {
return [error_msg(`${"command not found: "}${cmd_name129??''}${". Type <span class=\"t-accent\">help</span> for available commands."}`)]} else {
return command131["fn"](args130, state)};
};
};

}), "getCommandNames": (function () {
return Object.keys(commands18);

}), "getCommands": (function () {
return commands18;

}), "getCompletions": (function (input, state) {
const parts132 = input.split(/\s+/);
if ((squint_core.count(parts132) <= 1)) {
const prefix133 = (() => {
const or__23461__auto__134 = parts132[0];
if (squint_core.truth_(or__23461__auto__134)) {
return or__23461__auto__134} else {
return ""};

})();
return Object.keys(commands18).filter((function (_PERCENT_1) {
return _PERCENT_1.startsWith(prefix133);

}));
} else {
const partial135 = (() => {
const or__23461__auto__136 = parts132[(squint_core.count(parts132) - 1)];
if (squint_core.truth_(or__23461__auto__136)) {
return or__23461__auto__136} else {
return ""};

})();
const last_slash137 = partial135.lastIndexOf("/");
const dir_path138 = (((last_slash137 >= 0)) ? ((() => {
const or__23461__auto__139 = partial135.substring(0, last_slash137);
if (squint_core.truth_(or__23461__auto__139)) {
return or__23461__auto__139} else {
return "."};

})()) : ("."));
const prefix140 = (((last_slash137 >= 0)) ? (partial135.substring((last_slash137 + 1))) : (partial135));
const res141 = fs.resolve_path(state["cwd"], dir_path138);
const node142 = res141["node"];
if (squint_core.truth_((() => {
const or__23461__auto__143 = squint_core.not(node142);
if (or__23461__auto__143) {
return or__23461__auto__143} else {
return !(node142["type"] === "dir")};

})())) {
return []} else {
const matches144 = squint_core.filter((function (_PERCENT_1) {
return _PERCENT_1.startsWith(prefix140);

}), Object.keys(node142["children"]));
const mapped145 = squint_core.map((function (name) {
const child146 = node142["children"][name];
const base147 = (((last_slash137 >= 0)) ? (`${dir_path138??''}${"/"}${name??''}`) : (name));
if ((child146["type"] === "dir")) {
return `${base147??''}${"/"}`} else {
return base147};

}), matches144);
return squint_core.into_array(mapped145).slice(0, 20);
};
};

})});

};
var default_registry = create_command_registry(null);
var get_commands = function () {
return default_registry["getCommands"]();

};
var execute_command = function (input, state) {
return default_registry["executeCommand"](input, state);

};
var get_command_names = function () {
return default_registry["getCommandNames"]();

};
var get_completions = function (input, state) {
return default_registry["getCompletions"](input, state);

};

export { get_command_names, default_fortunes, pad, default_skills, image, create_command_registry, get_completions, execute_command, default_neofetch_fields, create_shell_state, animation, default_ascii_logo, text, error_msg, iframe, default_project_urls, default_whoami, default_registry, escape_html, default_packages, get_commands }
