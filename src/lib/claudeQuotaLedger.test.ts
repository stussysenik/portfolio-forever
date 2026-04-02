import { describe, expect, it } from "vitest";
import {
  buildDefaultConfig,
  getScheduledSlots,
  resolveScheduledSlot,
  summarizeStreamEvents,
} from "./claudeQuotaLedger";

describe("claude quota ledger scheduling", () => {
  it("builds a 7-day plan with 2 control days then treatment days", () => {
    const config = buildDefaultConfig(
      "/tmp/project",
      new Date("2026-04-01T12:00:00Z"),
      "Europe/Prague",
    );

    expect(config.days).toHaveLength(7);
    expect(config.days[0]?.phase).toBe("control");
    expect(config.days[1]?.phase).toBe("control");
    expect(config.days[2]?.phase).toBe("treatment");
    expect(config.days[6]?.phase).toBe("treatment");
  });

  it("expands scheduled slots and only includes warmups on treatment days", () => {
    const config = buildDefaultConfig(
      "/tmp/project",
      new Date("2026-04-01T12:00:00Z"),
      "Europe/Prague",
    );
    const slots = getScheduledSlots(config);
    const controlWarmups = slots.filter(
      (slot) => slot.phase === "control" && slot.kind === "warmup",
    );
    const treatmentWarmups = slots.filter(
      (slot) => slot.phase === "treatment" && slot.kind === "warmup",
    );

    expect(controlWarmups).toHaveLength(0);
    expect(treatmentWarmups.length).toBeGreaterThan(0);
  });

  it("matches the current invocation time to a scheduled slot within tolerance", () => {
    const config = buildDefaultConfig(
      "/tmp/project",
      new Date("2026-04-01T12:00:00Z"),
      "UTC",
    );
    const scheduled = resolveScheduledSlot(
      config,
      new Date(`${config.days[0]?.date}T08:22:00Z`),
    );

    expect(scheduled?.kind).toBe("observe");
    expect(scheduled?.phase).toBe("control");
  });
});

describe("claude quota ledger event parsing", () => {
  it("extracts result and rate-limit data from stream events", () => {
    const summary = summarizeStreamEvents([
      {
        type: "system",
        subtype: "init",
        session_id: "session-1",
        model: "claude-haiku",
        claude_code_version: "2.1.81",
      },
      {
        type: "rate_limit_event",
        rate_limit_info: {
          status: "allowed_warning",
          rateLimitType: "five_hour",
          resetsAt: 1775318400,
          utilization: 0.91,
          isUsingOverage: false,
        },
      },
      {
        type: "result",
        session_id: "session-1",
        total_cost_usd: 0.0042,
        usage: {
          input_tokens: 10,
          cache_creation_input_tokens: 5807,
          cache_read_input_tokens: 0,
          output_tokens: 12,
        },
      },
    ]);

    expect(summary.sessionId).toBe("session-1");
    expect(summary.model).toBe("claude-haiku");
    expect(summary.rateLimit?.rateLimitType).toBe("five_hour");
    expect(summary.rateLimit?.resetsAt).toBe(1775318400);
    expect(summary.totalCostUsd).toBe(0.0042);
    expect(summary.usage?.cacheCreationInputTokens).toBe(5807);
  });
});
