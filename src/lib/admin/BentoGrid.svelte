<script lang="ts">
	import { onMount } from 'svelte';

	export let userName: string = '';
	export let userImage: string = '';

	$: void userImage;

	let isDark = false;
	let columns = 12;

	onMount(() => {
		isDark = document.documentElement.dataset.theme === 'terminal' || document.documentElement.dataset.theme === 'bw';
		updateColumns();
		const mql1024 = window.matchMedia('(max-width: 1024px)');
		const mql640 = window.matchMedia('(max-width: 640px)');
		const handler = () => updateColumns();
		mql1024.addEventListener('change', handler);
		mql640.addEventListener('change', handler);
		return () => {
			mql1024.removeEventListener('change', handler);
			mql640.removeEventListener('change', handler);
		};
	});

	function updateColumns() {
		if (window.innerWidth <= 640) columns = 4;
		else if (window.innerWidth <= 1024) columns = 8;
		else columns = 12;
	}

	function toggleTheme() {
		const html = document.documentElement;
		const next = isDark ? 'minimal' : 'terminal';
		html.dataset.theme = next;
		localStorage.setItem('theme', next);
		isDark = !isDark;
	}
</script>

<div class="bento-admin">
	<header class="bento-header">
		<div class="bento-header-left">
			<span class="bento-status-dot" aria-label="Live"></span>
			<span class="bento-breadcrumb">
				/admin<span class="bento-breadcrumb-sep"> · </span><span class="bento-breadcrumb-name">{userName || 'admin'}</span>
			</span>
		</div>

		<div class="bento-header-right">
			<button
				class="bento-theme-toggle"
				on:click={toggleTheme}
				aria-label="Toggle dark mode"
			>
				<span class="bento-pill-option" class:active={!isDark}>light</span>
				<span class="bento-pill-option" class:active={isDark}>dark</span>
			</button>

			<span class="bento-badge bento-badge--convex">convex ↻</span>
			<span class="bento-badge bento-badge--col">{columns}-col</span>
		</div>
	</header>

	<div class="bento-grid" style="--bento-columns: {columns}">
		<slot />
	</div>
</div>

<style>
	.bento-admin {
		--bento-blue: #2563EB;
		--bento-green: #44D62C;
		max-width: 1440px;
		margin: 0 auto;
		padding: 16px;
	}

	/* ── Header bar ── */
	.bento-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 8px 0;
		margin-bottom: 12px;
		border-bottom: 1px solid var(--border-color-subtle);
		gap: 12px;
		flex-wrap: wrap;
	}

	.bento-header-left {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.bento-header-right {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	/* Green pulsing status dot */
	.bento-status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--bento-green);
		flex-shrink: 0;
		animation: bento-pulse 2s ease-in-out infinite;
	}

	@keyframes bento-pulse {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.4; }
	}

	/* Breadcrumb */
	.bento-breadcrumb {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-muted);
		letter-spacing: 0.01em;
	}

	.bento-breadcrumb-sep {
		color: var(--color-text-subtle);
	}

	.bento-breadcrumb-name {
		color: var(--color-text);
		font-weight: 500;
	}

	/* Theme toggle pill */
	.bento-theme-toggle {
		display: inline-flex;
		align-items: center;
		border: 1px solid var(--border-color);
		border-radius: 999px;
		padding: 2px;
		background: var(--color-bg-alt);
		cursor: pointer;
		gap: 0;
		font-family: var(--font-mono);
	}

	.bento-pill-option {
		font-size: var(--font-size-3xs);
		padding: 2px 8px;
		border-radius: 999px;
		color: var(--color-text-subtle);
		transition: all var(--duration-fast) var(--easing);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		line-height: 1;
	}

	.bento-pill-option.active {
		background: var(--color-text);
		color: var(--color-bg);
	}

	/* Badges */
	.bento-badge {
		font-family: var(--font-mono);
		font-size: var(--font-size-3xs);
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color-subtle);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.4;
		user-select: none;
	}

	.bento-badge--convex {
		color: var(--bento-green);
		border-color: color-mix(in oklch, var(--bento-green), transparent 70%);
	}

	.bento-badge--col {
		font-variant-numeric: tabular-nums;
	}

	/* ── Grid ── */
	.bento-grid {
		display: grid;
		grid-template-columns: repeat(var(--bento-columns, 12), 1fr);
		gap: 8px;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.bento-grid {
			grid-template-columns: repeat(8, 1fr);
		}
	}

	@media (max-width: 640px) {
		.bento-admin {
			padding: 12px 8px;
		}
		.bento-grid {
			grid-template-columns: repeat(4, 1fr);
		}
		.bento-header {
			gap: 8px;
		}
	}
</style>
