import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const agentsPath = path.join(repoRoot, "AGENTS.md");
const rootGeminiPath = path.join(repoRoot, "GEMINI.md");
const localGeminiDir = path.join(repoRoot, ".gemini");
const localGeminiPath = path.join(localGeminiDir, "GEMINI.md");
const globalGeminiPath = path.join(homedir(), ".gemini", "GEMINI.md");

const agents = (await readFile(agentsPath, "utf8")).trimEnd();

let globalGemini = "";
try {
  globalGemini = (await readFile(globalGeminiPath, "utf8")).trimEnd();
} catch (error) {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
    globalGemini = "";
  } else {
    throw error;
  }
}

const localGemini = globalGemini
  ? [
      "# Repo Gemini Compatibility File",
      "",
      "This file exists for tools that only scan `.gemini/GEMINI.md`.",
      "When this file and the repo root instructions overlap, prefer the repo-specific section.",
      "",
      "## Global defaults",
      "",
      globalGemini,
      "",
      "## Repo-specific overrides",
      "",
      agents,
      "",
    ].join("\n")
  : `${agents}\n`;

await mkdir(localGeminiDir, { recursive: true });
await writeFile(rootGeminiPath, `${agents}\n`);
await writeFile(localGeminiPath, localGemini);
