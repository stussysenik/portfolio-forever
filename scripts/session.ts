#!/usr/bin/env bun
/**
 * session.ts - MTS-Level Agent Tracing CLI
 * Maintains tmp/sessions/SESSION.json, SESSION.md, and SESSION.sqlite
 */

import { appendFileSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { Database } from "bun:sqlite";

const SESSIONS_DIR = "tmp/sessions";
const JSON_LOG = join(SESSIONS_DIR, "SESSION.json");
const MD_LOG = join(SESSIONS_DIR, "SESSION.md");
const DB_LOG = join(SESSIONS_DIR, "SESSION.sqlite");

const args = Bun.argv.slice(2);
const command = args[0];

function ensureSetup() {
  if (!existsSync(SESSIONS_DIR)) mkdirSync(SESSIONS_DIR, { recursive: true });
  const db = new Database(DB_LOG);
  db.run(`
    CREATE TABLE IF NOT EXISTS session_trace (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL,
      intent TEXT NOT NULL,
      detail TEXT,
      rationale TEXT,
      constraints TEXT,
      impact TEXT,
      status TEXT,
      confidence REAL,
      phase TEXT,
      tool TEXT
    );
  `);
  
  // Migration for existing tables
  try {
    db.run("ALTER TABLE session_trace ADD COLUMN phase TEXT");
  } catch (e) {
    // Column already exists
  }
  
  db.close();
  if (!existsSync(JSON_LOG)) writeFileSync(JSON_LOG, "[]");
  if (!existsSync(MD_LOG)) writeFileSync(MD_LOG, "# Session Log\n\n");
}

function parseArgs() {
  const params: any = {
    intent: args[1] || "unknown",
    detail: [],
    rationale: [],
    constraints: [],
    impact: [],
    status: "",
    confidence: "",
    phase: ""
  };

  let currentKey = "detail";
  
  for (let i = 2; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--rationale") { currentKey = "rationale"; continue; }
    if (arg === "--constraints") { currentKey = "constraints"; continue; }
    if (arg === "--impact") { currentKey = "impact"; continue; }
    if (arg === "--status") { currentKey = "status"; continue; }
    if (arg === "--confidence") { currentKey = "confidence"; continue; }
    if (arg === "--phase") { currentKey = "phase"; continue; }
    
    if (Array.isArray(params[currentKey])) {
      params[currentKey].push(arg);
    } else {
      params[currentKey] = params[currentKey] ? params[currentKey] + " " + arg : arg;
    }
  }
  
  params.detail = params.detail.join(" ");
  params.rationale = params.rationale.join(" ");
  params.constraints = params.constraints.join(" ");
  params.impact = params.impact.join(" ");
  if (!params.status) params.status = "unknown";
  if (!params.phase) params.phase = "strategy"; // Default to strategy
  
  return params;
}

function logToSQLite(data: any) {
  const db = new Database(DB_LOG);
  const query = db.prepare(`
    INSERT INTO session_trace (timestamp, intent, detail, rationale, constraints, impact, status, confidence, phase, tool)
    VALUES ($timestamp, $intent, $detail, $rationale, $constraints, $impact, $status, $confidence, $phase, $tool)
  `);
  query.run({
    $timestamp: data.timestamp,
    $intent: data.intent,
    $detail: data.detail,
    $rationale: data.rationale,
    $constraints: data.constraints,
    $impact: data.impact,
    $status: data.status,
    $confidence: data.confidence ? parseFloat(data.confidence) : null,
    $phase: data.phase,
    $tool: "mts-session-logger"
  });
  db.close();
}

function logToJSON(data: any) {
  const logs = JSON.parse(readFileSync(JSON_LOG, "utf8"));
  logs.push({ ...data, tool: "mts-session-logger" });
  writeFileSync(JSON_LOG, JSON.stringify(logs, null, 2));
}

function logToMD(data: any) {
  const timestamp = new Date().toLocaleTimeString();
  const phaseEmoji = data.phase === "red" ? "🔴" : data.phase === "green" ? "🟢" : "🔘";
  let entry = `### [${timestamp}] ${phaseEmoji} ${data.intent}\n`;
  if (data.detail) entry += `- **Detail**: ${data.detail}\n`;
  if (data.rationale) entry += `- **Rationale**: ${data.rationale}\n`;
  if (data.phase) entry += `- **Phase**: ${data.phase.toUpperCase()}\n`;
  entry += `- **Status**: ${data.status}\n`;
  entry += `\n---\n`;
  appendFileSync(MD_LOG, entry);
}

ensureSetup();

if (command === "log") {
  const params = parseArgs();
  const logData = {
    timestamp: new Date().toISOString(),
    ...params
  };
  logToSQLite(logData);
  logToJSON(logData);
  logToMD(logData);
  console.log(`✅ Trace recorded: ${params.intent} [${params.phase}:${params.status}]`);
} else if (command === "init") {
  const db = new Database(DB_LOG);
  db.run("DELETE FROM session_trace");
  db.close();
  writeFileSync(JSON_LOG, "[]");
  writeFileSync(MD_LOG, `# Session Log: ${new Date().toLocaleDateString()}\n\n`);
  console.log("🚀 MTS Trace initialized.");
}
