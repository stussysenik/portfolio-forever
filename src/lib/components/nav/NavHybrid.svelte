<script lang="ts">
	import IconCaretRight from "~icons/ph/caret-right";
	import IconArrowUpRight from "~icons/ph/arrow-up-right";

	export let navItems: { href: string; label: string; archived?: boolean }[] = [];
	export let socialLinks: { label: string; url: string }[] = [];
	export let profileName: string = "";
	export let currentPath: string = "/";

	let accordionOpen = false;
	let navGroupOpen = true;
	let connectionsGroupOpen = true;

	function toggle() {
		accordionOpen = !accordionOpen;
	}

	function getCurrentLabel(): string {
		const current = navItems.find(
			(item) => currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href))
		);
		return current?.label ?? "";
	}
</script>

<header class="hybrid-header">
	<div class="hybrid-inner">
		<a href="/" class="hybrid-name">{profileName}</a>
		<div class="hybrid-right">
			<span class="hybrid-current">{getCurrentLabel()}</span>
			<button class="hybrid-toggle" class:open={accordionOpen} on:click={toggle} aria-label="Toggle navigation">
				<span class="bar"></span>
				<span class="bar"></span>
				<span class="bar"></span>
			</button>
		</div>
	</div>
	<div class="hybrid-accordion" class:open={accordionOpen}>
		<div class="hybrid-accordion-inner">
			<div class="hybrid-group" class:open={navGroupOpen}>
				<button class="hybrid-group-header" on:click={() => navGroupOpen = !navGroupOpen}>
					<span class="arrow" style:transform={navGroupOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> navigation
				</button>
				{#if navGroupOpen}
					<div class="hybrid-group-links">
						{#each navItems as item}
							<a
								href={item.href}
								class="hybrid-link"
								class:active={currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href))}
								class:archived={item.archived}
								on:click={() => accordionOpen = false}
							>
								{item.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>

			{#if socialLinks.length > 0}
				<div class="hybrid-group" class:open={connectionsGroupOpen}>
					<button class="hybrid-group-header" on:click={() => connectionsGroupOpen = !connectionsGroupOpen}>
						<span class="arrow" style:transform={connectionsGroupOpen ? 'rotate(90deg)' : 'none'}><IconCaretRight /></span> connections
					</button>
					{#if connectionsGroupOpen}
						<div class="hybrid-group-links">
							{#each socialLinks as link}
								<a href={link.url} target="_blank" rel="noopener" class="hybrid-link external">
									{link.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</header>

<style>
	.hybrid-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: var(--z-fixed);
		background: color-mix(in srgb, var(--color-bg), transparent 15%);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--border-color-subtle);
	}

	@supports not (backdrop-filter: blur(12px)) {
		.hybrid-header {
			background: var(--color-bg);
		}
	}

	.hybrid-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-sm) var(--space-md);
		max-width: var(--container-max);
		margin: 0 auto;
	}

	@media (min-width: 768px) {
		.hybrid-inner {
			padding: var(--space-sm) calc(var(--container-padding) + var(--space-md));
		}
	}

	.hybrid-name {
		font-family: var(--font-sans);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-semibold);
		letter-spacing: var(--letter-spacing-tight);
		color: var(--color-text);
		text-decoration: none;
	}

	@media (min-width: 768px) {
		.hybrid-name {
			font-size: var(--font-size-lg);
		}
	}

	.hybrid-right {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.hybrid-current {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: var(--letter-spacing-wider);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hybrid-toggle {
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: 1px solid var(--border-color);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
		border-radius: var(--radius-sm);
		position: relative;
		flex-shrink: 0;
	}

	.hybrid-toggle:hover {
		border-color: var(--color-text);
		background: var(--color-text);
	}

	.hybrid-toggle:hover .bar {
		background: var(--color-bg);
	}

	.bar {
		display: block;
		width: 14px;
		height: 1.5px;
		background: var(--color-text);
		transition: all var(--duration-normal) var(--easing-out);
		position: absolute;
	}

	.bar:first-child {
		transform: translateY(-4px);
	}

	.bar:nth-child(2) {
		transition: opacity var(--duration-fast) var(--easing);
	}

	.bar:last-child {
		transform: translateY(4px);
	}

	.hybrid-toggle.open .bar:first-child {
		transform: translateY(0) rotate(45deg);
	}

	.hybrid-toggle.open .bar:nth-child(2) {
		opacity: 0;
	}

	.hybrid-toggle.open .bar:last-child {
		transform: translateY(0) rotate(-45deg);
	}

	.hybrid-accordion {
		overflow: hidden;
		max-height: 0;
		transition: max-height 400ms var(--easing-out);
		border-bottom: 1px solid transparent;
	}

	.hybrid-accordion.open {
		max-height: 600px;
		border-bottom-color: var(--border-color-subtle);
	}

	.hybrid-accordion-inner {
		padding: var(--space-sm) var(--space-md) var(--space-lg);
		max-width: var(--container-max);
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	@media (min-width: 768px) {
		.hybrid-accordion-inner {
			padding: var(--space-sm) calc(var(--container-padding) + var(--space-md)) var(--space-lg);
		}
	}

	.hybrid-group {
		margin-bottom: var(--space-2xs);
	}

	.hybrid-group-header {
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
		transition: color var(--duration-fast) var(--easing);
		width: 100%;
		text-align: left;
	}

	.hybrid-group-header:hover {
		color: var(--color-text-secondary);
	}

	.arrow {
		font-size: var(--font-size-2xs, 0.75rem);
		display: inline-block;
		transition: transform var(--duration-normal) var(--easing-out);
	}

	.hybrid-group.open .arrow {
		transform: rotate(90deg);
	}

	.hybrid-group-links {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2xs) 0;
		padding-left: 14px;
	}

	.hybrid-link {
		font-family: var(--font-sans);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
		text-decoration: none;
		padding: var(--space-2xs) var(--space-sm) var(--space-2xs) 0;
		transition: color var(--duration-fast) var(--easing);
		letter-spacing: var(--letter-spacing-normal);
	}

	.hybrid-link:hover {
		color: var(--color-text);
	}

	.hybrid-link.active {
		color: var(--color-text);
		font-weight: var(--font-weight-semibold);
	}

	.hybrid-link.archived {
		color: #e54545;
		opacity: 0.55;
	}

	.hybrid-link.archived:hover {
		opacity: 0.85;
	}

	.hybrid-link.external {
		font-family: var(--font-mono);
		font-size: var(--font-size-2xs, 0.75rem);
		letter-spacing: var(--letter-spacing-wider);
		text-transform: uppercase;
		color: var(--color-text-subtle);
	}

	.hybrid-link.external:hover {
		color: var(--color-text-secondary);
	}

	@media (max-width: 767px) {
		.hybrid-inner {
			padding: var(--space-xs) var(--space-sm);
		}

		.hybrid-link {
			font-size: 12px;
		}

		.hybrid-link.external {
			font-size: var(--font-size-2xs, 0.75rem);
		}
	}
</style>