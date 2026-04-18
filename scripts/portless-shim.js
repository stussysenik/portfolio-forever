#!/usr/bin/env bun
import { spawn } from "child_process";

// Dummy portless shim to allow "bun run dev" to work
const args = process.argv.slice(2);
// portless portfolio vite dev -> we just want "vite dev"
const viteIdx = args.indexOf("vite");
const commandArgs = viteIdx !== -1 ? args.slice(viteIdx) : ["vite", "dev"];

console.log(`[portless-shim] Executing: ${commandArgs.join(" ")}`);

const child = spawn("npx", commandArgs, {
  stdio: "inherit",
  shell: true
});

child.on("exit", (code) => {
  process.exit(code || 0);
});
