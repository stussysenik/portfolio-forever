"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";

/**
 * routeCommand — server-side NLP routing for the cmd+K palette.
 *
 * Strategy:
 *  1. If ANTHROPIC_API_KEY is set in Convex env, call Claude with the registry
 *     tool schema and return the first tool_use block.
 *  2. Otherwise, return a compact "unconfigured" response so the client can
 *     fall back to the local keyword parser (src/lib/command-os/parser.ts).
 *
 * The response is shaped for deterministic client handling and never throws.
 */
export const routeCommand = action({
	args: {
		input: v.string(),
		tools: v.array(
			v.object({
				name: v.string(),
				description: v.string(),
				input_schema: v.any(),
			})
		),
	},
	handler: async (_ctx, { input, tools }) => {
		const apiKey = process.env.ANTHROPIC_API_KEY;
		if (!apiKey) {
			return {
				success: false as const,
				error: "llm_unconfigured",
				message:
					"ANTHROPIC_API_KEY is not set in Convex env. Using local parser only. Run: npx convex env set ANTHROPIC_API_KEY sk-...",
			};
		}

		try {
			const response = await fetch("https://api.anthropic.com/v1/messages", {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"anthropic-version": "2023-06-01",
					"x-api-key": apiKey,
				},
				body: JSON.stringify({
					model: "claude-haiku-4-5-20251001",
					max_tokens: 1024,
					system:
						"You are a command router. Read the user's English instruction and call EXACTLY ONE tool from the provided list. Do not produce any free-form prose. If the instruction is ambiguous, pick the closest match.",
					tools,
					tool_choice: { type: "any" },
					messages: [{ role: "user", content: input }],
				}),
			});

			if (!response.ok) {
				const text = await response.text();
				return {
					success: false as const,
					error: "llm_http_error",
					status: response.status,
					message: text.slice(0, 500),
				};
			}

			const data = (await response.json()) as {
				content?: Array<{
					type: string;
					name?: string;
					input?: Record<string, unknown>;
				}>;
			};
			const toolUse = data.content?.find((b) => b.type === "tool_use");
			if (!toolUse || !toolUse.name) {
				return {
					success: false as const,
					error: "model_refused_tool",
					message: "Model did not emit a tool_use block.",
				};
			}
			return {
				success: true as const,
				action: toolUse.name,
				args: toolUse.input ?? {},
			};
		} catch (err: any) {
			return {
				success: false as const,
				error: "llm_exception",
				message: String(err?.message ?? err),
			};
		}
	},
});
