<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let flags: any[] = [];
	export let client: any;
	export let api: any;

	const DEFAULT_FLAGS = [
		{ key: 'pixel-engine', label: 'Pixel Engine', category: 'visual' },
		{ key: 'ascii-donut', label: 'ASCII Donut', category: 'visual' },
		{ key: 'parallax', label: 'Parallax', category: 'visual' },
		{ key: 'view-transitions', label: 'View Trans.', category: 'visual' },
		{ key: 'wip-banner', label: 'WIP Banner', category: 'layout' },
		{ key: 'elevator', label: 'Elevator', category: 'visual' },
		{ key: 'terminal-matrix', label: 'Terminal Mtx', category: 'visual' },
		{ key: 'os-desktop', label: 'OS Desktop', category: 'visual' },
		{ key: 'social-links', label: 'Social Links', category: 'layout' },
		{ key: 'command-palette', label: 'Cmd Palette', category: 'layout' },
	];

	function isEnabled(key: string): boolean {
		const flag = flags.find((f: any) => f.key === key);
		return flag ? flag.enabled : true;
	}

	async function toggle(key: string, category: string) {
		const newState = !isEnabled(key);
		try {
			await client.mutation(api.siteConfig.setFeatureFlag, {
				key,
				enabled: newState,
				category,
			});
			toast.success(`${key}: ${newState ? 'ON' : 'OFF'}`);
		} catch (e: any) {
			toast.error(e.message || 'Failed to toggle flag');
		}
	}
</script>

<div class="flags-cell">
	{#each DEFAULT_FLAGS as flag}
		<div class="flag-row">
			<button
				class="flag-toggle"
				class:on={isEnabled(flag.key)}
				on:click={() => toggle(flag.key, flag.category)}
				aria-label="Toggle {flag.label}"
				aria-pressed={isEnabled(flag.key)}
				role="switch"
			>
				<span class="flag-thumb"></span>
			</button>
			<span class="flag-name">{flag.label}</span>
		</div>
	{/each}
</div>

<style>
	.flags-cell {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.flag-row {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 2px 0;
	}

	.flag-toggle {
		position: relative;
		width: 20px;
		height: 10px;
		border-radius: 999px;
		border: none;
		padding: 0;
		cursor: pointer;
		background: #737373;
		transition: background 160ms ease;
		flex-shrink: 0;
	}

	.flag-toggle.on {
		background: #44D62C;
	}

	.flag-thumb {
		position: absolute;
		top: 1px;
		left: 1px;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #fff;
		transition: transform 160ms ease;
		pointer-events: none;
	}

	.flag-toggle.on .flag-thumb {
		transform: translateX(10px);
	}

	.flag-name {
		font-family: var(--font-mono);
		font-size: 7px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--color-text-muted);
	}
</style>
