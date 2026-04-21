<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { createDialog, melt } from '@melt-ui/svelte';
	import { goto } from '$lib/app-shims';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { registry, type RegistryKey } from './registry';
	import { getRegistrySchema } from './schema';
	import { parseLocally, suggestActions } from './parser';
	import { commandCache } from './cache';
	import { toast } from '$lib/stores/toast';
	import { pendingChanges, pendingCount, pendingLabels } from './pending';
	import { formatRelativeTime } from '$lib/admin/constants';

	type Status = 'idle' | 'loading' | 'preview' | 'error' | 'success';

	// Desktop-only: the palette never mounts below 768px. Mobile admin uses
	// the PAGES · SECTIONS · PREVIEW dock (see redesign-admin-shell proposal).
	const DESKTOP_QUERY = '(min-width: 768px)';
	let isDesktop = $state(true);

	let input = $state('');
	let status: Status = $state('idle');
	let errorMessage = $state('');
	let pendingAction: { name: string; args: Record<string, unknown> } | null = $state(null);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	let stagedCount = $state(0);
	let stagedLabels = $state<string[]>([]);
	let recentHistory = $state<Array<{ field: string; newValue: any; timestamp: number }>>([]);
	pendingCount.subscribe((v) => { stagedCount = v; });
	pendingLabels.subscribe((v) => { stagedLabels = v; });

	const client = getConvexClient();

	const {
		elements: { portalled, overlay, content, title, close },
		states: { open }
	} = createDialog({
		forceVisible: true,
		preventScroll: true
	});

	async function openPalette() {
		open.set(true);
		status = 'idle';
		errorMessage = '';
		pendingAction = null;
		queueMicrotask(() => {
			const el = document.getElementById('cmd-os-input') as HTMLInputElement | null;
			el?.focus();
		});
		// Fetch recent changes from adminHistory
		try {
			const rows = await (client as any).query((api as any).adminHistory.getRecentByTable, {
				table: 'commandOs',
				limit: 5,
			});
			recentHistory = rows ?? [];
		} catch (_) {
			recentHistory = [];
		}
	}

	function closePalette() {
		open.set(false);
		input = '';
		status = 'idle';
		errorMessage = '';
		pendingAction = null;
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!isDesktop) return;
		const isK = e.key === 'k' || e.key === 'K';
		if (isK && (e.metaKey || e.ctrlKey)) {
			e.preventDefault();
			$open ? closePalette() : openPalette();
			return;
		}
		if ($open && e.key === 'Escape') {
			e.preventDefault();
			closePalette();
		}
	}

	let mediaQueryList: MediaQueryList | null = null;
	function updateIsDesktop(e: MediaQueryList | MediaQueryListEvent) {
		isDesktop = e.matches;
		if (!isDesktop && $open) closePalette();
	}

	onMount(() => {
		if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
			mediaQueryList = window.matchMedia(DESKTOP_QUERY);
			updateIsDesktop(mediaQueryList);
			mediaQueryList.addEventListener('change', updateIsDesktop);
		}
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
		if (mediaQueryList) {
			mediaQueryList.removeEventListener('change', updateIsDesktop);
			mediaQueryList = null;
		}
	});

	async function resolve(text: string) {
		const trimmed = text.trim();
		if (!trimmed) {
			status = 'idle';
			pendingAction = null;
			return;
		}

		const cached = commandCache.get(trimmed);
		if (cached) {
			pendingAction = { name: cached.action, args: cached.args };
			status = 'preview';
			return;
		}

		const local = parseLocally(trimmed);
		if (local && local.success) {
			pendingAction = { name: local.action, args: local.args };
			status = 'preview';
			return;
		}

		status = 'loading';
		try {
			const schema = getRegistrySchema();
			const response: any = await (client as any).action((api as any).commandOs.routeCommand, {
				input: trimmed,
				tools: schema
			});

			if (response?.success) {
				const spec = (registry as Record<string, any>)[response.action];
				if (!spec) {
					status = 'error';
					errorMessage = `unknown_action: ${response.action}`;
					return;
				}
				const parsed = spec.parameters.safeParse(response.args);
				if (!parsed.success) {
					status = 'error';
					errorMessage = `schema_validation_failed: ${parsed.error.issues[0]?.message ?? 'unknown'}`;
					return;
				}
				pendingAction = { name: response.action, args: parsed.data };
				commandCache.set(trimmed, { action: response.action, args: parsed.data });
				status = 'preview';
				return;
			}

			// LLM unavailable → fall back to suggestions
			if (local && !local.success) {
				status = 'error';
				errorMessage = local.error;
				return;
			}
			status = 'error';
			errorMessage =
				response?.message ??
				response?.error ??
				'No match. Try "set theme terminal" or "go to /works".';
		} catch (err: any) {
			status = 'error';
			errorMessage = String(err?.message ?? err);
		}
	}

	function handleInput(e: Event) {
		input = (e.currentTarget as HTMLInputElement).value;
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => resolve(input), 300);
	}

	async function confirmAction() {
		if (!pendingAction) return;
		const spec = (registry as Record<string, any>)[pendingAction.name];
		if (!spec) return;
		try {
			await spec.execute(pendingAction.args, { client, api, goto });
			status = 'success';
			toast.success(`${pendingAction.name} ✓`);
			setTimeout(() => closePalette(), 400);
		} catch (err: any) {
			status = 'error';
			errorMessage = String(err?.message ?? err);
		}
	}

	function handleInputKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (status === 'preview') {
				confirmAction();
			} else if (status === 'idle' || status === 'error') {
				if (debounceTimer) clearTimeout(debounceTimer);
				resolve(input);
			}
		}
	}

	const suggestions = $derived(suggestActions(input, 5));

	function formatArgs(args: Record<string, unknown>): string {
		const lines: string[] = [];
		for (const [k, v] of Object.entries(args)) {
			const val = typeof v === 'string' ? v : JSON.stringify(v);
			lines.push(`${k.padEnd(14)} ${val}`);
		}
		return lines.join('\n');
	}
</script>

{#if $open && isDesktop}
	<div {...$portalled} use:melt={$portalled}>
		<div {...$overlay} use:melt={$overlay} class="cmd-overlay"></div>
		<div {...$content} use:melt={$content} class="cmd-content">
			<header class="cmd-header">
				<span class="cmd-prompt">:</span>
				<input
					id="cmd-os-input"
					type="text"
					class="cmd-input"
					placeholder="type a command in english…"
					value={input}
					oninput={handleInput}
					onkeydown={handleInputKeydown}
					autocomplete="off"
					spellcheck="false"
				/>
				<span class="cmd-status">{status}</span>
			</header>

			<div class="cmd-body">
				{#if status === 'idle'}
					<p class="cmd-hint" {...$title} use:melt={$title}>
						available actions
					</p>
					{#if stagedCount > 0}
						<div class="cmd-pending-card">
							<span class="cmd-pending-badge">{stagedCount} staged</span>
							<ul class="cmd-pending-list">
								{#each stagedLabels as label}
									<li class="cmd-pending-item">{label}</li>
								{/each}
							</ul>
							<p class="cmd-hint" style="margin-top:4px">type "save" to commit</p>
						</div>
					{/if}
					<ul class="cmd-list">
						{#each suggestions as s}
							<li class="cmd-row">
								<span class="cmd-row-name">{s.name}</span>
								<span class="cmd-row-desc">{s.description}</span>
							</li>
						{/each}
					</ul>
					{#if recentHistory.length > 0}
						<p class="cmd-hint" style="margin-top:8px">recent changes</p>
						<ul class="cmd-list">
							{#each recentHistory as entry}
								<li class="cmd-row cmd-row-history">
									<span class="cmd-row-name">{entry.field}</span>
									<span class="cmd-row-desc">{formatRelativeTime(entry.timestamp)}</span>
								</li>
							{/each}
						</ul>
					{/if}
				{:else if status === 'loading'}
					<p class="cmd-hint">thinking…</p>
				{:else if status === 'preview' && pendingAction}
					<p class="cmd-hint">
						{#if pendingAction.name === 'setWipBadge' || pendingAction.name === 'toggleFlag'}
							preview (staged) &mdash; press enter to stage, then "save" to commit
						{:else}
							preview &mdash; press enter to run
						{/if}
					</p>
					<div class="cmd-preview">
						<div class="cmd-row">
							<span class="cmd-row-name">action</span>
							<span class="cmd-row-desc">{pendingAction.name}</span>
						</div>
						<pre class="cmd-args">{formatArgs(pendingAction.args)}</pre>
					</div>
					{#if stagedCount > 0}
						<div class="cmd-pending">
							<span class="cmd-pending-label">{stagedCount} staged</span>
							<ul class="cmd-pending-list">
								{#each stagedLabels as label}
									<li class="cmd-pending-item">{label}</li>
								{/each}
							</ul>
							<p class="cmd-hint">type "save" to commit all staged changes</p>
						</div>
					{/if}
				{:else if status === 'error'}
					<p class="cmd-hint cmd-hint-error">{errorMessage}</p>
					{#if suggestions.length > 0}
						<ul class="cmd-list">
							{#each suggestions as s}
								<li class="cmd-row">
									<span class="cmd-row-name">{s.name}</span>
									<span class="cmd-row-desc">{s.description}</span>
								</li>
							{/each}
						</ul>
					{/if}
				{:else if status === 'success'}
					<p class="cmd-hint">ok</p>
				{/if}
			</div>

			<footer class="cmd-footer">
				<span>enter · run</span>
				<span>esc · close</span>
				<button class="cmd-close" {...$close} use:melt={$close}>close</button>
			</footer>
		</div>
	</div>
{/if}

<style>
	.cmd-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.35);
		backdrop-filter: blur(2px);
		z-index: 9998;
	}

	.cmd-content {
		position: fixed;
		top: 20vh;
		left: 50%;
		transform: translateX(-50%);
		width: min(640px, 92vw);
		background: var(--color-bg, #fff);
		border: 1px solid var(--color-text, #111);
		border-radius: 0;
		font-family: var(--font-mono, ui-monospace, monospace);
		color: var(--color-text, #111);
		z-index: 9999;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.22);
	}

	.cmd-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.12));
	}

	.cmd-prompt {
		font-size: 0.875rem;
		color: var(--color-text-subtle, #666);
	}

	.cmd-input {
		flex: 1;
		background: transparent;
		border: none;
		outline: none;
		font-family: inherit;
		font-size: 0.9375rem;
		color: inherit;
		letter-spacing: 0.01em;
	}

	.cmd-input::placeholder {
		color: var(--color-text-subtle, #888);
	}

	.cmd-status {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #888);
	}

	.cmd-body {
		padding: 0.5rem 0;
		max-height: 50vh;
		overflow-y: auto;
	}

	.cmd-hint {
		margin: 0;
		padding: 0.25rem 1rem 0.5rem;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-subtle, #888);
	}

	.cmd-hint-error {
		color: var(--color-danger, #c33);
	}

	.cmd-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.cmd-row {
		display: flex;
		align-items: baseline;
		gap: 0.75rem;
		padding: 0.375rem 1rem;
		font-size: 0.8125rem;
	}

	.cmd-row:hover {
		background: var(--color-bg-alt, rgba(0, 0, 0, 0.03));
	}

	.cmd-row-history .cmd-row-name {
		color: var(--color-text-subtle, #888);
	}

	.cmd-row-history .cmd-row-desc {
		font-size: 0.6875rem;
	}

	.cmd-row-name {
		flex: 0 0 auto;
		min-width: 10ch;
		color: var(--color-text, #111);
	}

	.cmd-row-desc {
		flex: 1;
		color: var(--color-text-subtle, #666);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.cmd-preview {
		padding: 0 1rem;
	}

	.cmd-args {
		margin: 0.5rem 0 0;
		padding: 0.75rem;
		background: var(--color-bg-alt, rgba(0, 0, 0, 0.03));
		font-family: inherit;
		font-size: 0.75rem;
		line-height: 1.5;
		white-space: pre;
		overflow-x: auto;
	}

	.cmd-footer {
		display: flex;
		gap: 1rem;
		align-items: center;
		padding: 0.5rem 1rem;
		border-top: 1px solid var(--border-color, rgba(0, 0, 0, 0.12));
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #888);
	}

	.cmd-close {
		margin-left: auto;
		background: transparent;
		border: 1px solid currentColor;
		padding: 0.125rem 0.5rem;
		font: inherit;
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: inherit;
		cursor: pointer;
	}

	.cmd-close:hover {
		background: var(--color-bg-alt, rgba(0, 0, 0, 0.05));
	}

	.cmd-pending {
		margin: 0.5rem 1rem 0;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-text-subtle, #666);
		border-radius: 2px;
		background: var(--color-bg-alt, rgba(0, 0, 0, 0.03));
	}

	.cmd-pending-label {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-subtle, #888);
	}

	.cmd-pending-list {
		list-style: none;
		margin: 0.25rem 0 0;
		padding: 0;
	}

	.cmd-pending-item {
		font-size: 0.75rem;
		color: var(--color-text, #111);
		padding: 0.125rem 0;
	}

	.cmd-pending-item::before {
		content: '→ ';
		color: var(--color-text-subtle, #888);
	}

	.cmd-pending-card {
		margin: 0.25rem 1rem 0.5rem;
		padding: 0.5rem 0.75rem;
		border: 1px dashed var(--color-text-subtle, #666);
		border-radius: 2px;
	}

	.cmd-pending-badge {
		display: inline-block;
		font-size: 0.625rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding: 0.125rem 0.375rem;
		background: var(--color-text, #111);
		color: var(--color-bg, #fff);
		border-radius: 2px;
	}
</style>
