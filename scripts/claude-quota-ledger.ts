#!/usr/bin/env bun

import { Database } from "bun:sqlite";
import { randomUUID } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { homedir, hostname } from "node:os";
import { dirname, join } from "node:path";
import {
  buildDefaultConfig,
  getLocalParts,
  getScheduledSlots,
  resolveScheduledSlot,
  summarizeStreamEvents,
  type LedgerConfig,
  type ProbeKind,
  type ScheduledSlot,
} from "../src/lib/claudeQuotaLedger";

const rootDir = dirname(import.meta.dir);
const defaultDataDir = join(rootDir, ".claude-quota-ledger");
const configPath = join(defaultDataDir, "config.json");
const dbPath = join(defaultDataDir, "ledger.sqlite");
const rawDir = join(defaultDataDir, "raw");
const runsJsonlPath = join(defaultDataDir, "runs.jsonl");
const schedulerJsonlPath = join(defaultDataDir, "scheduler.jsonl");
const cleanWorkspaceDir = join(defaultDataDir, "workspace");

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true, mode: 0o700 });
  chmodSync(path, 0o700);
}

function ensureCleanWorkspace(): void {
  ensureDir(cleanWorkspaceDir);
  ensureDir(join(cleanWorkspaceDir, ".claude"));
}

function readConfig(): LedgerConfig {
  if (!existsSync(configPath)) {
    throw new Error(
      `Missing config at ${configPath}. Run \`bun run quota:init\` first.`,
    );
  }

  return JSON.parse(readFileSync(configPath, "utf8")) as LedgerConfig;
}

function writeConfig(config: LedgerConfig): void {
  ensureDir(defaultDataDir);
  writeFileSync(configPath, JSON.stringify(config, null, 2));
}

function openDb(): Database {
  ensureDir(defaultDataDir);
  const db = new Database(dbPath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS runs (
      run_id TEXT PRIMARY KEY,
      run_kind TEXT NOT NULL,
      phase TEXT,
      slot_label TEXT,
      observed_at_utc TEXT NOT NULL,
      observed_local_date TEXT NOT NULL,
      observed_local_time TEXT NOT NULL,
      timezone TEXT NOT NULL,
      host TEXT NOT NULL,
      claude_path TEXT NOT NULL,
      command_json TEXT NOT NULL,
      exit_code INTEGER NOT NULL,
      duration_ms INTEGER NOT NULL,
      session_id TEXT,
      model TEXT,
      claude_code_version TEXT,
      total_cost_usd REAL,
      input_tokens INTEGER,
      cache_creation_input_tokens INTEGER,
      cache_read_input_tokens INTEGER,
      output_tokens INTEGER,
      rate_limit_status TEXT,
      rate_limit_type TEXT,
      resets_at INTEGER,
      utilization REAL,
      is_using_overage INTEGER,
      surpassed_threshold REAL,
      raw_path TEXT NOT NULL,
      stderr_path TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_id TEXT NOT NULL,
      observed_at_utc TEXT NOT NULL,
      event_type TEXT,
      event_subtype TEXT,
      payload_json TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS scheduler_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      observed_at_utc TEXT NOT NULL,
      observed_local_date TEXT NOT NULL,
      observed_local_time TEXT NOT NULL,
      timezone TEXT NOT NULL,
      status TEXT NOT NULL,
      slot_label TEXT,
      detail_json TEXT NOT NULL
    );
  `);
  return db;
}

function appendJsonl(path: string, value: unknown): void {
  ensureDir(dirname(path));
  Bun.write(path, `${JSON.stringify(value)}\n`, { createPath: true, append: true });
}

function getClaudePath(): string {
  const claudePath = Bun.which("claude");
  if (!claudePath) {
    throw new Error("`claude` was not found in PATH.");
  }
  return claudePath;
}

function getRunPaths(runId: string, config: LedgerConfig): {
  rawPath: string;
  stderrPath: string;
} {
  const local = getLocalParts(new Date(), config.timezone);
  const dayDir = join(rawDir, local.date);
  ensureDir(dayDir);
  return {
    rawPath: join(dayDir, `${runId}.jsonl`),
    stderrPath: join(dayDir, `${runId}.stderr.log`),
  };
}

function buildClaudeArgs(config: LedgerConfig): string[] {
  return [
    "-p",
    "--verbose",
    "--output-format",
    "stream-json",
    "--tools",
    "",
    "--no-session-persistence",
    "--model",
    config.cleanProfile.model,
    "--setting-sources",
    config.cleanProfile.settingSources,
    "--disable-slash-commands",
    "--strict-mcp-config",
    "--mcp-config",
    JSON.stringify(config.cleanProfile.mcpConfig),
    "--",
    config.cleanProfile.prompt,
  ];
}

function parseJsonLines(rawText: string): unknown[] {
  return rawText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function recordSchedulerEvent(
  db: Database,
  config: LedgerConfig,
  status: string,
  slot: ScheduledSlot | null,
  detail: Record<string, unknown>,
): void {
  const now = new Date();
  const local = getLocalParts(now, config.timezone);
  const observedAtUtc = now.toISOString();
  const event = {
    observedAtUtc,
    observedLocalDate: local.date,
    observedLocalTime: local.time,
    timezone: config.timezone,
    status,
    slotLabel: slot?.label ?? null,
    detail,
  };

  db
    .query(
      `
        INSERT INTO scheduler_events (
          observed_at_utc,
          observed_local_date,
          observed_local_time,
          timezone,
          status,
          slot_label,
          detail_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      observedAtUtc,
      local.date,
      local.time,
      config.timezone,
      status,
      slot?.label ?? null,
      JSON.stringify(detail),
    );

  appendJsonl(schedulerJsonlPath, event);
}

function runProbe(kind: ProbeKind, slot: ScheduledSlot | null = null): void {
  const config = readConfig();
  const db = openDb();
  const claudePath = getClaudePath();
  ensureCleanWorkspace();

  const startedAt = new Date();
  const runId = randomUUID();
  const local = getLocalParts(startedAt, config.timezone);
  const paths = getRunPaths(runId, config);
  const args = buildClaudeArgs(config);

  const result = Bun.spawnSync({
    cmd: [claudePath, ...args],
    cwd: cleanWorkspaceDir,
    stdout: "pipe",
    stderr: "pipe",
    env: {
      ...process.env,
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: "1",
    },
  });

  const endedAt = new Date();
  const durationMs = endedAt.getTime() - startedAt.getTime();
  const stdout = result.stdout.toString();
  const stderr = result.stderr.toString();
  const exitCode = result.exitCode ?? 1;

  writeFileSync(paths.rawPath, stdout);
  writeFileSync(paths.stderrPath, stderr);

  const parsedEvents = parseJsonLines(stdout) as Array<Record<string, unknown>>;
  const summary = summarizeStreamEvents(parsedEvents as never);

  db
    .query(
      `
        INSERT INTO runs (
          run_id,
          run_kind,
          phase,
          slot_label,
          observed_at_utc,
          observed_local_date,
          observed_local_time,
          timezone,
          host,
          claude_path,
          command_json,
          exit_code,
          duration_ms,
          session_id,
          model,
          claude_code_version,
          total_cost_usd,
          input_tokens,
          cache_creation_input_tokens,
          cache_read_input_tokens,
          output_tokens,
          rate_limit_status,
          rate_limit_type,
          resets_at,
          utilization,
          is_using_overage,
          surpassed_threshold,
          raw_path,
          stderr_path
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
    )
    .run(
      runId,
      kind,
      slot?.phase ?? null,
      slot?.label ?? null,
      startedAt.toISOString(),
      local.date,
      local.time,
      config.timezone,
      hostname(),
      claudePath,
      JSON.stringify([claudePath, ...args]),
      exitCode,
      durationMs,
      summary.sessionId ?? null,
      summary.model ?? null,
      summary.claudeCodeVersion ?? null,
      summary.totalCostUsd ?? null,
      summary.usage?.inputTokens ?? null,
      summary.usage?.cacheCreationInputTokens ?? null,
      summary.usage?.cacheReadInputTokens ?? null,
      summary.usage?.outputTokens ?? null,
      summary.rateLimit?.status ?? null,
      summary.rateLimit?.rateLimitType ?? null,
      summary.rateLimit?.resetsAt ?? null,
      summary.rateLimit?.utilization ?? null,
      summary.rateLimit?.isUsingOverage ? 1 : 0,
      summary.rateLimit?.surpassedThreshold ?? null,
      paths.rawPath,
      paths.stderrPath,
    );

  const eventInsert = db.query(
    `
      INSERT INTO events (
        run_id,
        observed_at_utc,
        event_type,
        event_subtype,
        payload_json
      ) VALUES (?, ?, ?, ?, ?)
    `,
  );

  for (const event of parsedEvents) {
    const typedEvent = event as Record<string, unknown>;
    eventInsert.run(
      runId,
      startedAt.toISOString(),
      typeof typedEvent.type === "string" ? typedEvent.type : null,
      typeof typedEvent.subtype === "string" ? typedEvent.subtype : null,
      JSON.stringify(typedEvent),
    );
  }

  appendJsonl(runsJsonlPath, {
    runId,
    runKind: kind,
    phase: slot?.phase ?? null,
    slotLabel: slot?.label ?? null,
    observedAtUtc: startedAt.toISOString(),
    observedLocalDate: local.date,
    observedLocalTime: local.time,
    timezone: config.timezone,
    host: hostname(),
    exitCode,
    durationMs,
    sessionId: summary.sessionId ?? null,
    model: summary.model ?? null,
    claudeCodeVersion: summary.claudeCodeVersion ?? null,
    totalCostUsd: summary.totalCostUsd ?? null,
    usage: summary.usage ?? null,
    rateLimit: summary.rateLimit ?? null,
    rawPath: paths.rawPath,
    stderrPath: paths.stderrPath,
  });

  if (stderr.trim()) {
    console.error(stderr.trim());
  }

  console.log(
    JSON.stringify(
      {
        runId,
        runKind: kind,
        phase: slot?.phase ?? null,
        slotLabel: slot?.label ?? null,
        exitCode,
        durationMs,
        sessionId: summary.sessionId ?? null,
        totalCostUsd: summary.totalCostUsd ?? null,
        rateLimit: summary.rateLimit ?? null,
        rawPath: paths.rawPath,
      },
      null,
      2,
    ),
  );
}

function printDoctor(): void {
  const claudePath = getClaudePath();
  const authStatus = Bun.spawnSync({
    cmd: [claudePath, "auth", "status", "--json"],
    stdout: "pipe",
    stderr: "pipe",
  });

  console.log(
    JSON.stringify(
      {
        claudePath,
        bunPath: process.execPath,
        rootDir,
        dataDir: defaultDataDir,
        configExists: existsSync(configPath),
        dbExists: existsSync(dbPath),
        authStatus:
          authStatus.exitCode === 0
            ? JSON.parse(authStatus.stdout.toString())
            : {
                exitCode: authStatus.exitCode,
                stderr: authStatus.stderr.toString(),
              },
      },
      null,
      2,
    ),
  );
}

function renderLaunchAgentLabel(config: LedgerConfig): string {
  return `com.s3nik.${config.experimentName}.claude-quota-ledger`;
}

function renderLaunchdPlist(config: LedgerConfig): string {
  const label = renderLaunchAgentLabel(config);
  const slots = getScheduledSlots(config);
  const programArgs = [
    process.execPath,
    join(rootDir, "scripts", "claude-quota-ledger.ts"),
    "scheduled",
  ];

  const startCalendarIntervals = slots
    .map((slot) => {
      const [year, month, day] = slot.date.split("-").map(Number);
      const [hour, minute] = slot.time.split(":").map(Number);
      return `
        <dict>
          <key>Year</key><integer>${year}</integer>
          <key>Month</key><integer>${month}</integer>
          <key>Day</key><integer>${day}</integer>
          <key>Hour</key><integer>${hour}</integer>
          <key>Minute</key><integer>${minute}</integer>
        </dict>`;
    })
    .join("\n");

  const programArgsXml = programArgs
    .map((value) => `<string>${value}</string>`)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>${label}</string>
    <key>ProgramArguments</key>
    <array>
${programArgsXml}
    </array>
    <key>WorkingDirectory</key>
    <string>${rootDir}</string>
    <key>RunAtLoad</key>
    <false/>
    <key>StandardOutPath</key>
    <string>${join(defaultDataDir, "launchd.stdout.log")}</string>
    <key>StandardErrorPath</key>
    <string>${join(defaultDataDir, "launchd.stderr.log")}</string>
    <key>StartCalendarInterval</key>
    <array>
${startCalendarIntervals}
    </array>
  </dict>
</plist>`;
}

function installLaunchd(): void {
  const config = readConfig();
  ensureDir(defaultDataDir);

  const plistPath = join(
    homedir(),
    "Library",
    "LaunchAgents",
    `${renderLaunchAgentLabel(config)}.plist`,
  );

  ensureDir(dirname(plistPath));
  writeFileSync(plistPath, renderLaunchdPlist(config));

  Bun.spawnSync({ cmd: ["launchctl", "unload", plistPath], stderr: "ignore" });
  const load = Bun.spawnSync({ cmd: ["launchctl", "load", plistPath] });
  if (load.exitCode !== 0) {
    throw new Error(load.stderr.toString() || "Failed to load launchd agent.");
  }

  console.log(
    JSON.stringify(
      {
        installed: true,
        plistPath,
        label: renderLaunchAgentLabel(config),
        slots: getScheduledSlots(config),
      },
      null,
      2,
    ),
  );
}

function uninstallLaunchd(): void {
  const config = readConfig();
  const plistPath = join(
    homedir(),
    "Library",
    "LaunchAgents",
    `${renderLaunchAgentLabel(config)}.plist`,
  );

  Bun.spawnSync({ cmd: ["launchctl", "unload", plistPath], stderr: "ignore" });
  if (existsSync(plistPath)) {
    unlinkSync(plistPath);
  }

  console.log(
    JSON.stringify(
      {
        uninstalled: true,
        plistPath,
      },
      null,
      2,
    ),
  );
}

function printReport(): void {
  const config = readConfig();
  const db = openDb();

  const totals = db
    .query<
      [number, number | null, string | null],
      {
        runs: number;
        total_cost_usd: number | null;
        latest_rate_limit_type: string | null;
      }
    >(
      `
        SELECT
          COUNT(*) AS runs,
          ROUND(COALESCE(SUM(total_cost_usd), 0), 6) AS total_cost_usd,
          MAX(rate_limit_type) AS latest_rate_limit_type
        FROM runs
      `,
    )
    .get();

  const byKind = db
    .query<
      never,
      {
        run_kind: string;
        runs: number;
        total_cost_usd: number | null;
      }
    >(
      `
        SELECT
          run_kind,
          COUNT(*) AS runs,
          ROUND(COALESCE(SUM(total_cost_usd), 0), 6) AS total_cost_usd
        FROM runs
        GROUP BY run_kind
        ORDER BY run_kind
      `,
    )
    .all();

  const rateEvents = db
    .query<
      never,
      {
        observed_at_utc: string;
        run_kind: string;
        phase: string | null;
        rate_limit_status: string | null;
        rate_limit_type: string | null;
        resets_at: number | null;
        utilization: number | null;
      }
    >(
      `
        SELECT
          observed_at_utc,
          run_kind,
          phase,
          rate_limit_status,
          rate_limit_type,
          resets_at,
          utilization
        FROM runs
        WHERE rate_limit_type IS NOT NULL
        ORDER BY observed_at_utc DESC
      `,
    )
    .all();

  console.log(
    JSON.stringify(
      {
        experimentName: config.experimentName,
        timezone: config.timezone,
        days: config.days,
        schedule: getScheduledSlots(config),
        totals,
        byKind,
        rateEvents,
      },
      null,
      2,
    ),
  );
}

function initExperiment(): void {
  ensureDir(defaultDataDir);
  ensureDir(rawDir);
  ensureCleanWorkspace();

  const config = buildDefaultConfig(rootDir);
  writeConfig(config);
  rmSync(dbPath, { force: true });
  rmSync(runsJsonlPath, { force: true });
  rmSync(schedulerJsonlPath, { force: true });
  openDb().close();

  console.log(
    JSON.stringify(
      {
        initialized: true,
        configPath,
        config,
      },
      null,
      2,
    ),
  );
}

function runScheduled(): void {
  const config = readConfig();
  const db = openDb();
  const slot = resolveScheduledSlot(config);

  if (!slot) {
    recordSchedulerEvent(db, config, "skip", null, {
      reason: "no matching slot within tolerance",
    });
    console.log(
      JSON.stringify(
        {
          skipped: true,
          reason: "no matching slot within tolerance",
        },
        null,
        2,
      ),
    );
    return;
  }

  recordSchedulerEvent(db, config, "run", slot, {
    reason: "matched scheduled slot",
  });
  runProbe(slot.kind, slot);
}

function main(): void {
  const [command, ...rest] = Bun.argv.slice(2);

  switch (command) {
    case "init":
      initExperiment();
      return;
    case "doctor":
      printDoctor();
      return;
    case "probe": {
      const kindArg = rest[0];
      const kind =
        kindArg === "warmup" || kindArg === "observe" || kindArg === "manual"
          ? kindArg
          : "manual";
      runProbe(kind);
      return;
    }
    case "scheduled":
      runScheduled();
      return;
    case "report":
      printReport();
      return;
    case "install-launchd":
      installLaunchd();
      return;
    case "uninstall-launchd":
      uninstallLaunchd();
      return;
    default:
      console.error(
        [
          "Usage:",
          "  bun scripts/claude-quota-ledger.ts init",
          "  bun scripts/claude-quota-ledger.ts doctor",
          "  bun scripts/claude-quota-ledger.ts probe [warmup|observe|manual]",
          "  bun scripts/claude-quota-ledger.ts scheduled",
          "  bun scripts/claude-quota-ledger.ts report",
          "  bun scripts/claude-quota-ledger.ts install-launchd",
          "  bun scripts/claude-quota-ledger.ts uninstall-launchd",
        ].join("\n"),
      );
      process.exitCode = 1;
  }
}

main();
