<script lang="ts">
	import IconCaretRight from "~icons/ph/caret-right";
	import IconArrowUpRight from "~icons/ph/arrow-up-right";

	export let navItems: { href: string; label: string; archived?: boolean }[] = [];
	export let socialLinks: { label: string; url: string }[] = [];
	export let profileName: string = "";
	export let currentPath: string = "/";

	let drawerOpen = false;
	let navGroupOpen = true;
	let connectionsGroupOpen = true;

	function toggle() {
		drawerOpen = !drawerOpen;
	}

	function close() {
		drawerOpen = false;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && drawerOpen) {
			close();
		}
	}
</script>

<header class="drawer-header" class:open={drawerOpen}>
	<a href="/" class="drawer-name">{profileName}</a>
	<button class="drawer-trigger" class:open={drawerOpen} on:click={toggle}>
		{#if drawerOpen}close{:else}index{/if}
	</button>
</header>

{#if drawerOpen}
	<button class="drawer-overlay" on:click={close} aria-label="Close navigation"></button>
{/if}

<svelte:window on:keydown={handleKeydown} />

<div class="drawer-panel" class:open={drawerOpen}>
	<button class="drawer-close" on:click={close} aria-label="Close drawer">&times;</button>
	<div class="drawer-inner">
		<div class="drawer-group" class:open={navGroupOpen}>
			<button class="drawer-group-header" on:click={() => navGroupOpen = !navGroupOpen}>
				<span class="arrow" style:transform={navGroupOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> navigation
			</button>
			{#if navGroupOpen}
				<div class="drawer-group-links">
					{#each navItems as item}
						<a
							href={item.href}
							class="drawer-link"
							class:active={currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href))}
							class:archived={item.archived}
							on:click={close}
						>
							{item.label}
						</a>
					{/each}
				</div>
			{/if}
		</div>

		{#if socialLinks.length > 0}
			<div class="drawer-group" class:open={connectionsGroupOpen}>
				<button class="drawer-group-header" on:click={() => connectionsGroupOpen = !connectionsGroupOpen}>
					<span class="arrow" style:transform={connectionsGroupOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> connections
				</button>
				{#if connectionsGroupOpen}
					<div class="drawer-group-links">
						{#each socialLinks as link}
							<a href={link.url} target="_blank" rel="noopener" class="drawer-link external" on:click={close}>
								{link.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.drawer-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-fixed);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-lg);
		background: color-mix(in srgb, var(--color-bg), transparent 15%);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-color-subtle);
	}

	.drawer-header.open {
		z-index: calc(var(--z-modal) + 1);
	}

	@supports not (backdrop-filter: blur(12px)) {
		.drawer-header {
			background: var(--color-bg);
		}
	}

	.drawer-name {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		letter-spacing: var(--letter-spacing-tight);
		color: var(--color-text);
		text-decoration: none;
	}

	.drawer-trigger {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: var(--letter-spacing-wider);
		text-transform: uppercase;
		color: var(--color-text);
		background: none;
		border: 1px solid var(--border-color);
		padding: 6px 16px;
		cursor: pointer;
		transition: border-color 160ms cubic-bezier(0.23, 1, 0.32, 1),
			background 160ms cubic-bezier(0.23, 1, 0.32, 1),
			color 160ms cubic-bezier(0.23, 1, 0.32, 1);
		border-radius: var(--radius-sm);
		-webkit-tap-highlight-color: transparent;
	}

	.drawer-trigger:active {
		transform: scale(0.97);
	}

	.drawer-trigger:hover {
		border-color: var(--color-text);
	}

	.drawer-trigger.open {
		background: var(--color-text);
		color: var(--color-bg);
	}

	.drawer-overlay {
		position: fixed;
		inset: 0;
		z-index: calc(var(--z-modal) - 1);
		background: rgba(0, 0, 0, 0);
		border: none;
		cursor: pointer;
		transition: background 200ms ease-out;
	}

	.drawer-panel {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-modal);
		padding: 96px var(--space-2xl) var(--space-2xl);
		border-bottom: 1px solid var(--border-color);
		background: var(--color-bg);
		transform: translateY(-100%);
		transition: transform 350ms cubic-bezier(0.32, 0.72, 0, 1);
		overflow: hidden;
	}

	.drawer-panel.open {
		transform: translateY(0);
	}

	.drawer-inner {
		max-width: 560px;
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.drawer-close {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-lg);
		width: 44px;
		height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 1px solid var(--border-color);
		border-radius: var(--radius-md);
		font-size: var(--font-size-xl);
		line-height: 1;
		color: var(--color-text-muted);
		cursor: pointer;
		transition: border-color 160ms cubic-bezier(0.23, 1, 0.32, 1),
			background 160ms cubic-bezier(0.23, 1, 0.32, 1),
			color 160ms cubic-bezier(0.23, 1, 0.32, 1),
			transform 160ms cubic-bezier(0.23, 1, 0.32, 1);
		z-index: 1;
		-webkit-tap-highlight-color: transparent;
	}

	.drawer-close:active {
		transform: scale(0.95);
	}

	.drawer-close:hover {
		border-color: var(--color-text);
		background: var(--color-text);
		color: var(--color-bg);
	}

	.drawer-group {
		margin-bottom: var(--space-xs);
	}

	.drawer-group:last-child {
		margin-bottom: 0;
	}

	.drawer-group-header {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		padding: var(--space-2xs) 0;
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 5px;
		user-select: none;
		background: none;
		border: none;
		transition: color 160ms cubic-bezier(0.23, 1, 0.32, 1);
		width: 100%;
		text-align: left;
		-webkit-tap-highlight-color: transparent;
	}

	.drawer-group-header:active {
		transform: scale(0.98);
	}

	.drawer-group-header:hover {
		color: var(--color-text-secondary);
	}

	.arrow {
		font-size: var(--font-size-2xs, 0.75rem);
		display: inline-block;
		transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
	}

	.drawer-group.open .arrow {
		transform: rotate(90deg);
	}

	.drawer-group-links {
		display: flex;
		flex-direction: column;
		padding-top: var(--space-xs);
	}

	.drawer-link {
		font-family: var(--font-sans);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		padding: var(--space-sm) 0;
		transition: color 160ms cubic-bezier(0.23, 1, 0.32, 1);
		letter-spacing: var(--letter-spacing-tight);
		-webkit-tap-highlight-color: transparent;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.drawer-link:hover {
		color: var(--color-text);
	}

	.drawer-link.active {
		color: var(--color-text);
		font-weight: var(--font-weight-semibold);
	}

	.drawer-link.archived {
		color: #e54545;
		opacity: 0.55;
	}

	.drawer-link.archived:hover {
		opacity: 0.85;
	}

	.drawer-link.external {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		letter-spacing: var(--letter-spacing-wider);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.drawer-link.external:hover {
		color: var(--color-text-secondary);
	}

	@media (max-width: 767px) {
		.drawer-header {
			padding: var(--space-xs) var(--space-md);
		}

		.drawer-panel {
			padding: 76px var(--space-md) var(--space-lg);
		}

		.drawer-close {
			right: var(--space-md);
		}

		.drawer-link {
			font-size: var(--font-size-xl);
			min-height: 44px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.drawer-panel {
			transition: none;
		}

		.arrow {
			transition: none;
		}

		.drawer-close,
		.drawer-trigger,
		.drawer-link,
		.drawer-group-header {
			transition: none;
		}
	}
</style>
