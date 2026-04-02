export type ExperimentPhase = "control" | "treatment";
export type ProbeKind = "warmup" | "observe" | "manual";

export type ExperimentDay = {
  date: string;
  phase: ExperimentPhase;
  notes?: string;
};

export type CleanProfileConfig = {
  model: string;
  prompt: string;
  settingSources: string;
  mcpConfig: {
    mcpServers: Record<string, never>;
  };
};

export type ScheduleConfig = {
  warmupTimes: string[];
  observeTimes: string[];
  toleranceMinutes: number;
};

export type LedgerConfig = {
  experimentName: string;
  timezone: string;
  dataDir: string;
  rootDir: string;
  cleanProfile: CleanProfileConfig;
  schedule: ScheduleConfig;
  days: ExperimentDay[];
};

export type LocalParts = {
  date: string;
  time: string;
  hour: number;
  minute: number;
};

export type ScheduledSlot = {
  date: string;
  time: string;
  kind: ProbeKind;
  phase: ExperimentPhase;
  label: string;
};

export type StreamEventSummary = {
  sessionId?: string;
  model?: string;
  claudeCodeVersion?: string;
  totalCostUsd?: number;
  usage?: {
    inputTokens?: number;
    cacheCreationInputTokens?: number;
    cacheReadInputTokens?: number;
    outputTokens?: number;
  };
  rateLimit?: {
    status?: string;
    rateLimitType?: string;
    resetsAt?: number;
    utilization?: number;
    isUsingOverage?: boolean;
    surpassedThreshold?: number;
  };
};

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function pad2(value: number): string {
  return value.toString().padStart(2, "0");
}

export function getLocalParts(
  date: Date,
  timeZone: string,
): LocalParts {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);
  const hour = Number(values.hour);
  const minute = Number(values.minute);

  return {
    date: `${year}-${pad2(month)}-${pad2(day)}`,
    time: `${pad2(hour)}:${pad2(minute)}`,
    hour,
    minute,
  };
}

export function buildDefaultConfig(
  rootDir: string,
  now: Date = new Date(),
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone,
): LedgerConfig {
  const start = addDays(now, 1);
  const days: ExperimentDay[] = [];

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(start, index);
    days.push({
      date: toDateKey(date),
      phase: index < 2 ? "control" : "treatment",
      notes:
        index < 2
          ? "No automated warmup. Observation only."
          : "Warmup plus observation probes.",
    });
  }

  return {
    experimentName: `claude-window-${days[0]?.date ?? "unknown"}`,
    timezone: timeZone,
    dataDir: `${rootDir}/.claude-quota-ledger`,
    rootDir,
    cleanProfile: {
      model: "haiku",
      prompt: "Reply with exactly OK.",
      settingSources: "local",
      mcpConfig: {
        mcpServers: {},
      },
    },
    schedule: {
      warmupTimes: ["06:00"],
      observeTimes: ["08:20", "10:50", "11:10", "13:10"],
      toleranceMinutes: 5,
    },
    days,
  };
}

export function getScheduledSlots(config: LedgerConfig): ScheduledSlot[] {
  const slots: ScheduledSlot[] = [];

  for (const day of config.days) {
    if (day.phase === "treatment") {
      for (const time of config.schedule.warmupTimes) {
        slots.push({
          date: day.date,
          time,
          kind: "warmup",
          phase: day.phase,
          label: `${day.phase}:${time}:warmup`,
        });
      }
    }

    for (const time of config.schedule.observeTimes) {
      slots.push({
        date: day.date,
        time,
        kind: "observe",
        phase: day.phase,
        label: `${day.phase}:${time}:observe`,
      });
    }
  }

  return slots.sort((left, right) =>
    `${left.date}T${left.time}`.localeCompare(`${right.date}T${right.time}`),
  );
}

function timeToMinutes(time: string): number {
  const [hour, minute] = time.split(":").map(Number);
  return (hour ?? 0) * 60 + (minute ?? 0);
}

export function resolveScheduledSlot(
  config: LedgerConfig,
  now: Date = new Date(),
): ScheduledSlot | null {
  const local = getLocalParts(now, config.timezone);
  const currentMinutes = local.hour * 60 + local.minute;

  for (const slot of getScheduledSlots(config)) {
    if (slot.date !== local.date) {
      continue;
    }

    const delta = Math.abs(timeToMinutes(slot.time) - currentMinutes);
    if (delta <= config.schedule.toleranceMinutes) {
      return slot;
    }
  }

  return null;
}

type RawStreamEvent = {
  type?: string;
  subtype?: string;
  session_id?: string;
  model?: string;
  claude_code_version?: string;
  total_cost_usd?: number;
  usage?: {
    input_tokens?: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
    output_tokens?: number;
  };
  rate_limit_info?: {
    status?: string;
    rateLimitType?: string;
    resetsAt?: number;
    utilization?: number;
    isUsingOverage?: boolean;
    surpassedThreshold?: number;
  };
};

export function summarizeStreamEvents(
  events: RawStreamEvent[],
): StreamEventSummary {
  const summary: StreamEventSummary = {};

  for (const event of events) {
    if (event.type === "system" && event.subtype === "init") {
      summary.sessionId ??= event.session_id;
      summary.model ??= event.model;
      summary.claudeCodeVersion ??= event.claude_code_version;
    }

    if (event.type === "rate_limit_event" && event.rate_limit_info) {
      summary.rateLimit = {
        status: event.rate_limit_info.status,
        rateLimitType: event.rate_limit_info.rateLimitType,
        resetsAt: event.rate_limit_info.resetsAt,
        utilization: event.rate_limit_info.utilization,
        isUsingOverage: event.rate_limit_info.isUsingOverage,
        surpassedThreshold: event.rate_limit_info.surpassedThreshold,
      };
    }

    if (event.type === "result") {
      summary.sessionId ??= event.session_id;
      summary.totalCostUsd = event.total_cost_usd;
      summary.usage = {
        inputTokens: event.usage?.input_tokens,
        cacheCreationInputTokens: event.usage?.cache_creation_input_tokens,
        cacheReadInputTokens: event.usage?.cache_read_input_tokens,
        outputTokens: event.usage?.output_tokens,
      };
    }
  }

  return summary;
}
