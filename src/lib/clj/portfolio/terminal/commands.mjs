import * as squint_core from 'squint-cljs/core.js';
var text = function (content) {
return ({"type": "text", "content": content});

};
var error_msg = function (msg) {
return text(`${"<span class=\"t-error\">"}${msg??''}${"</span>"}`);

};
var default_fortunes = ["\"Any sufficiently advanced technology is indistinguishable from magic.\" — Arthur C. Clarke", "\"The best way to predict the future is to invent it.\" — Alan Kay", "\"Simplicity is the ultimate sophistication.\" — Leonardo da Vinci", "\"Talk is cheap. Show me the code.\" — Linus Torvalds", "\"Make it work, make it right, make it fast.\" — Kent Beck", "\"Design is not just what it looks like. Design is how it works.\" — Steve Jobs", "\"In the middle of difficulty lies opportunity.\" — Albert Einstein"];
var default_ascii_logo = `${"<span class=\"t-accent\">  ███████╗████████╗██╗   ██╗</span>\n"}${"<span class=\"t-accent\">  ██╔════╝╚══██╔══╝██║   ██║</span>\n"}${"<span class=\"t-accent\">  ███████╗   ██║   ██║   ██║</span>\n"}${"<span class=\"t-accent\">  ╚════██║   ██║   ██║   ██║</span>\n"}${"<span class=\"t-accent\">  ███████║   ██║   ╚██████╔╝</span>\n"}${"<span class=\"t-accent\">  ╚══════╝   ╚═╝    ╚═════╝</span>"}`;
var default_whoami = "<span class=\"t-info\">stussysenik</span> <span class=\"t-muted\">— Design Engineer & Creative Producer, Bed-Stuy BK</span>";
var default_neofetch_fields = [({"label": "Role", "value": "Design Engineer & Creative Producer"}), ({"label": "Stack", "value": "SvelteKit · TypeScript · AR/XR"}), ({"label": "Location", "value": "Bed-Stuy, Brooklyn"}), ({"label": "Projects", "value": "11 live works"}), ({"label": "Themes", "value": "4 (minimal, studio, terminal, b&w)"}), ({"label": "Shell", "value": "portfolio-terminal v2.0.0"})];
var default_skills = [({"pid": "001", "name": "TypeScript", "cpu": 94, "status": "running"}), ({"pid": "002", "name": "SvelteKit", "cpu": 90, "status": "running"}), ({"pid": "003", "name": "React", "cpu": 85, "status": "running"}), ({"pid": "004", "name": "AR/XR", "cpu": 78, "status": "running"}), ({"pid": "005", "name": "Design Systems", "cpu": 88, "status": "running"}), ({"pid": "006", "name": "WebGPU/Three.js", "cpu": 72, "status": "running"}), ({"pid": "007", "name": "Zig/WASM", "cpu": 65, "status": "learning"}), ({"pid": "008", "name": "Elixir/Phoenix", "cpu": 60, "status": "learning"}), ({"pid": "009", "name": "Swift/SwiftUI", "cpu": 68, "status": "running"}), ({"pid": "010", "name": "Python/ML", "cpu": 70, "status": "running"}), ({"pid": "011", "name": "Rails", "cpu": 62, "status": "running"}), ({"pid": "012", "name": "Color Science", "cpu": 82, "status": "running"})];
var default_packages = ["svelte@5.0.0", "sveltekit@2.49.1", "typescript@5.x", "vite@7.2.6", "playwright@1.57.0", "tailwind-css@4.x", "three.js@latest", "zig@0.13", "elixir@1.17", "phoenix@1.7", "rails@8.1", "swift@5.10", "python@3.12", "bun@latest", "node@22"];
var pad = function (s, len) {
return `${s??''}`.padEnd(len, " ");

};
var fortune_cmd = function (fortunes) {
const f1 = squint_core.nth(fortunes, Math.floor((Math.random() * squint_core.count(fortunes))));
return text(`${"\n<span class=\"t-info\">"}${f1??''}${"</span>\n"}`);

};
var whoami_cmd = function (output) {
return text(output);

};
var date_cmd = function () {
return text(`${"<span class=\"t-info\">"}${(new Date()).toString()??''}${"</span>"}`);

};
var echo_cmd = function (args) {
return text(args.join(" "));

};
var cowsay_cmd = function (args) {
const msg1 = (() => {
const or__23461__auto__2 = args.join(" ");
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return "moo"};

})();
const border3 = squint_core.apply(squint_core.str, squint_core.repeat((squint_core.count(msg1) + 2), "_"));
return text(`${"<span class=\"t-success\">\n "}${border3??''}${"\n< "}${msg1??''}${" >\n "}${border3.replace(/_/, "-")??''}${"\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||</span>"}`);

};
var help_cmd = function (commands) {
const lines1 = squint_core.atom([`${"\n<span class=\"t-muted\">── COMMANDS ──</span>"}`]);
for (let G__2 of squint_core.iterable(Object.keys(commands))) {
const name3 = G__2;
const cmd4 = commands[name3];
squint_core.swap_BANG_(lines1, squint_core.conj, `${"  <span class=\"t-accent\">"}${pad(name3, 14)??''}${"</span> <span class=\"t-muted\">"}${cmd4.desc??''}${"</span>"}`)
};
return text(squint_core.deref(lines1).join("\n"));

};
var create_command_registry = function (data) {
const fortunes1 = (() => {
const or__23461__auto__2 = squint_core.get(data, "fortunes");
if (squint_core.truth_(or__23461__auto__2)) {
return or__23461__auto__2} else {
return default_fortunes};

})();
const commands3 = Object.create(null);
Object.assign(commands3, ({"help": ({"tier": 1, "desc": "Show available commands", "fn": (function (args, state) {
return help_cmd(commands3);

})}), "clear": ({"tier": 1, "desc": "Clear the terminal", "fn": (function (args, state) {
return squint_core.array(({"type": "text", "content": "__CLEAR__"}));

})}), "whoami": ({"tier": 1, "desc": "Display current user", "fn": (function (args, state) {
return whoami_cmd((() => {
const or__23461__auto__4 = squint_core.get(data, "whoami-output");
if (squint_core.truth_(or__23461__auto__4)) {
return or__23461__auto__4} else {
return default_whoami};

})());

})}), "date": ({"tier": 1, "desc": "Show current date and time", "fn": (function (args, state) {
return date_cmd();

})}), "echo": ({"tier": 1, "desc": "Echo text to terminal", "fn": (function (args, state) {
return echo_cmd(args);

})}), "fortune": ({"tier": 3, "desc": "Random wisdom", "fn": (function (args, state) {
return fortune_cmd(fortunes1);

})}), "cowsay": ({"tier": 3, "desc": "Cow says what?", "fn": (function (args, state) {
return cowsay_cmd(args);

})})}));
return ({"executeCommand": (function (input, state) {
const trimmed5 = input.trim();
if (squint_core.truth_(squint_core.empty_QMARK_(trimmed5))) {
return squint_core.array()} else {
state.history.push(trimmed5);
const parts6 = trimmed5.split(/\s+/);
const cmd7 = parts6[0];
const args8 = parts6.slice(1);
const temp__23055__auto__9 = commands3[cmd7];
if (squint_core.truth_(temp__23055__auto__9)) {
const command10 = temp__23055__auto__9;
return command10.fn(args8, state);
} else {
return squint_core.array(error_msg(`${"command not found: "}${cmd7??''}${". Type <span class=\"t-accent\">help</span> for available commands."}`))};
};

}), "getCommandNames": (function () {
return Object.keys(commands3);

}), "getCommands": (function () {
return commands3;

})});

};

export { echo_cmd, default_fortunes, pad, fortune_cmd, help_cmd, default_skills, create_command_registry, date_cmd, default_neofetch_fields, default_ascii_logo, cowsay_cmd, text, error_msg, whoami_cmd, default_whoami, default_packages }
