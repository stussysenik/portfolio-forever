<script lang="ts">
	import IconCaretRight from "~icons/ph/caret-right";
	import IconArrowUpRight from "~icons/ph/arrow-up-right";

	export let navItems: { href: string; label: string; archived?: boolean }[] = [];
	export let socialLinks: { label: string; url: string }[] = [];
	export let profileName: string = "";
	export let currentPath: string = "/";
	export let profileAvailable: boolean = false;

	let navOpen = true;
	let connectionsOpen = true;
</script>

<aside class="sidebar">
	<a href="/" class="sidebar-name">{profileName}</a>

	<div class="sidebar-tree">
		{#if navItems.length > 0}
			<div class="sidebar-section" class:open={navOpen}>
				<button class="sidebar-section-header" on:click={() => navOpen = !navOpen}>
					<span class="arrow" style:transform={navOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> navigation
				</button>
				{#if navOpen}
					<div class="sidebar-section-links">
						{#each navItems as item}
							<a
								href={item.href}
								class="sidebar-link"
								class:active={currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href))}
								class:archived={item.archived}
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		{#if socialLinks.length > 0}
			<div class="sidebar-section" class:open={connectionsOpen}>
				<button class="sidebar-section-header" on:click={() => connectionsOpen = !connectionsOpen}>
					<span class="arrow" style:transform={connectionsOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> connections
				</button>
				{#if connectionsOpen}
					<div class="sidebar-section-links">
						{#each socialLinks as link}
							<a href={link.url} target="_blank" rel="noopener" class="sidebar-link external">
								{link.label}<IconArrowUpRight class="ext-icon" />
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="sidebar-footer">
		<span class="sidebar-path">~/portfolio</span>
		{#if profileAvailable}
			<span class="sidebar-status"><span class="status-dot"></span> available</span>
		{/if}
	</div>
</aside>

<style>
	.sidebar {
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		width: 220px;
		border-right: 1px solid var(--border-color-subtle);
		padding: var(--space-lg) var(--space-md) var(--space-md);
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		background: color-mix(in srgb, var(--color-bg), transparent 15%);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		z-index: var(--z-fixed);
	}

	@supports not (backdrop-filter: blur(12px)) {
		.sidebar {
			background: var(--color-bg);
		}
	}

	.sidebar-name {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		letter-spacing: var(--letter-spacing-tight);
		color: var(--color-text);
		text-decoration: none;
		margin-bottom: var(--space-xl);
		display: block;
	}

	.sidebar-tree {
		display: flex;
		flex-direction: column;
		gap: 0;
		flex: 1;
	}

	.sidebar-section {
		margin-bottom: var(--space-xs);
	}

	.sidebar-section-header {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: var(--color-text-subtle);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: 6px;
		padding: var(--space-2xs) 0;
		user-select: none;
		background: none;
		border: none;
		transition: color var(--duration-fast) var(--easing);
		width: 100%;
		text-align: left;
	}

	.sidebar-section-header:hover {
		color: var(--color-text-secondary);
	}

	.arrow {
		font-size: var(--font-size-2xs, 0.75rem);
		display: inline-block;
		transition: transform var(--duration-normal) var(--easing-out);
	}

	.sidebar-section.open .arrow {
		transform: rotate(90deg);
	}

	.sidebar-section-links {
		display: flex;
		flex-direction: column;
	}

	.sidebar-link {
		font-family: var(--font-sans);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		padding: var(--space-2xs) 0 var(--space-2xs) var(--space-md);
		display: flex;
		align-items: center;
		transition: color var(--duration-fast) var(--easing);
		position: relative;
		letter-spacing: var(--letter-spacing-normal);
	}

	.sidebar-link::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 50%;
		transform: translateY(-50%);
		width: 5px;
		height: 5px;
		border-radius: 50%;
		border: 1.5px solid var(--border-color);
		transition: all var(--duration-fast) var(--easing);
	}

	.sidebar-link:hover {
		color: var(--color-text);
	}

	.sidebar-link:hover::before {
		border-color: var(--color-text-secondary);
	}

	.sidebar-link.active {
		color: var(--color-text);
		font-weight: var(--font-weight-semibold);
	}

	.sidebar-link.active::before {
		background: var(--color-text);
		border-color: var(--color-text);
	}

	.sidebar-link.archived {
		color: #e54545;
		opacity: 0.55;
	}

	.sidebar-link.archived:hover {
		opacity: 0.85;
	}

	.sidebar-link.external {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: var(--letter-spacing-wider);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.sidebar-link.external::before {
		display: none;
	}

	.sidebar-link.external:hover {
		color: var(--color-text-secondary);
	}

	.ext-arrow {
		font-size: var(--font-size-2xs, 0.75rem);
		opacity: 0.4;
		margin-left: 2px;
	}

	.sidebar-footer {
		margin-top: auto;
		padding-top: var(--space-md);
		border-top: 1px solid var(--border-color-subtle);
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		color: var(--color-text-subtle);
		letter-spacing: 0.05em;
		display: flex;
		flex-direction: column;
		gap: var(--space-2xs);
	}

	.sidebar-status {
		display: flex;
		align-items: center;
		gap: 5px;
		color: var(--color-success);
	}

	.status-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: #00ff00;
		box-shadow: 0 0 4px #00ff00;
	}

	@media (max-width: 767px) {
		.sidebar {
			position: relative;
			width: 100%;
			bottom: auto;
			height: auto;
			border-right: none;
			border-bottom: 1px solid var(--border-color-subtle);
			padding: var(--space-sm) var(--space-md);
			gap: 0;
		}

		.sidebar-name {
			margin-bottom: var(--space-sm);
			font-size: var(--font-size-sm);
		}

		.sidebar-tree {
			flex-direction: row;
			flex-wrap: wrap;
			gap: var(--space-2xs) var(--space-sm);
		}

		.sidebar-section {
			margin-bottom: 0;
			display: contents;
		}

		.sidebar-section-header {
			display: none;
		}

		.sidebar-section-links {
			flex-direction: row;
			flex-wrap: wrap;
			gap: var(--space-2xs) var(--space-sm);
		}

		.sidebar-link {
			padding: 2px 0;
			font-size: 12px;
		}

		.sidebar-link::before {
			display: none;
		}

		.sidebar-link.external {
			font-size: var(--font-size-2xs, 0.75rem);
		}

		.sidebar-footer {
			display: none;
		}
	}
</style>