<script lang="ts">
	export let route: string = '/';
	export let refreshKey: number = 0;
	export let selectedSectionId: string = '';

	const QUICK_BREAKPOINTS = [
		{ id: '390', label: '390', title: 'iPhone 15' },
		{ id: '768', label: '768', title: 'Tablet' },
		{ id: '1440', label: '1440', title: 'Laptop' },
	];

	let viewportWidth: number = 0; // 0 means "responsive / fill container"
	let customWidth: string = '';
	let iframeEl: HTMLIFrameElement;
	let containerWidth: number = 0;
	let orientation: 'landscape' | 'portrait' = 'landscape';
	let containerHeight: number = 0;

	$: displayWidth = viewportWidth > 0 ? viewportWidth : containerWidth;
	$: displayHeight = containerHeight > 0 ? containerHeight : 0;

	$: if (refreshKey && iframeEl) {
		iframeEl.src = iframeEl.src;
	}

	$: iframeScale = viewportWidth > 0 ? Math.min(1, (containerWidth - 32) / viewportWidth) : 1;

	// Sync: scroll iframe to selected section when it changes
	$: if (selectedSectionId && iframeEl?.contentWindow) {
		iframeEl.contentWindow.postMessage(
			{ type: 'admin:scrollToSection', sectionId: selectedSectionId },
			'*'
		);
	}

	function toggleOrientation() {
		if (viewportWidth > 0 && containerHeight > 0) {
			const w = viewportWidth;
			viewportWidth = containerHeight;
			// Note: containerHeight is measured, so we store the desired height
		}
		orientation = orientation === 'landscape' ? 'portrait' : 'landscape';
	}
</script>

<div class="preview-pane">
	<header class="preview-header">
		<span class="admin-label admin-label--xs">PREVIEW</span>
		<span class="preview-route">{route}</span>
		<div class="viewport-bar">
			<button class="vp-chip" class:vp-chip-active={viewportWidth === 0}
				on:click={() => { viewportWidth = 0; }} title="Responsive (fill)">auto</button>
			<span class="vp-sep"></span>
			{#each QUICK_BREAKPOINTS as bp}
				<button class="vp-chip" class:vp-chip-active={viewportWidth === parseInt(bp.id)}
					on:click={() => { viewportWidth = parseInt(bp.id); }} title={bp.title}>{bp.label}</button>
			{/each}
			<span class="vp-sep"></span>
			<input class="vp-input" type="number" min="280" max="3840" placeholder="px"
				bind:value={customWidth}
				on:change={() => { const w = parseInt(customWidth); if (w >= 280 && w <= 3840) viewportWidth = w; }} />
			<span class="vp-sep"></span>
			<button class="vp-orient" class:active={orientation === 'landscape'}
				on:click={() => { orientation = 'landscape'; }} title="Landscape">&#x25ad;</button>
			<button class="vp-orient" class:active={orientation === 'portrait'}
				on:click={() => { orientation = 'portrait'; }} title="Portrait">&#x25af;</button>
		</div>
		<span class="vp-dims">
			{viewportWidth > 0 ? viewportWidth : '~'} &times; {displayHeight > 0 ? Math.round(displayHeight) : '~'}
		</span>
	</header>

	<div class="preview-container" bind:clientWidth={containerWidth} bind:clientHeight={containerHeight}>
		<div
			class="iframe-viewport"
			class:viewport-dashed={viewportWidth > 0}
			style={viewportWidth > 0
				? `width: ${viewportWidth}px; transform: scale(${iframeScale}); transform-origin: top center;`
				: 'width: 100%; height: 100%;'}
		>
			<iframe
				bind:this={iframeEl}
				src={route}
				title="Page preview"
				frameborder="0"
			></iframe>
		</div>
	</div>
</div>

<style>
	.preview-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}

	.preview-header {
		display: flex;
		align-items: center;
		gap: var(--admin-space-3, 12px);
		padding: var(--admin-space-2, 8px) var(--admin-space-4, 16px);
		border-bottom: 1px solid var(--border-color-subtle);
		flex-shrink: 0;
	}

	.preview-route {
		font-family: var(--font-mono);
		font-size: var(--admin-text-xs, 9px);
		color: var(--color-text-muted, #888);
		flex: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.viewport-bar {
		display: flex;
		align-items: center;
		gap: 2px;
		flex-wrap: wrap;
	}

	.vp-chip {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		padding: 2px 6px;
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-muted, #666);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		min-height: 20px;
	}

	.vp-chip:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.vp-chip-active {
		background: var(--admin-blue, #2563EB);
		border-color: var(--admin-blue, #2563EB);
		color: #fff;
	}

	.vp-input {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		width: 40px;
		padding: 2px 4px;
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text, #e5e5e5);
		text-align: center;
		min-height: 20px;
	}

	.vp-sep {
		width: 1px;
		height: 14px;
		background: var(--border-color-subtle, #222);
		margin: 0 2px;
		flex-shrink: 0;
	}

	.vp-orient {
		font-family: var(--font-mono);
		font-size: var(--admin-text-2xs, 7px);
		padding: 2px 5px;
		border: 1px solid var(--border-color-subtle, #222);
		border-radius: 2px;
		background: transparent;
		color: var(--color-text-subtle, #444);
		cursor: pointer;
		transition: all var(--admin-transition, 120ms ease);
		min-height: 20px;
		display: inline-flex;
		align-items: center;
	}
	.vp-orient:hover { border-color: var(--color-text-muted); color: var(--color-text-muted); }
	.vp-orient.active {
		background: var(--admin-blue, #2563EB);
		border-color: var(--admin-blue, #2563EB);
		color: #fff;
	}

	.vp-dims {
		font-family: var(--font-mono);
		font-size: var(--admin-text-3xs, 6px);
		color: var(--color-text-subtle, #444);
		white-space: nowrap;
		letter-spacing: 0.04em;
	}

	.vp-input:focus {
		border-color: var(--admin-blue, #2563EB);
		outline: none;
	}

	/* Remove spinner buttons from number input */
	.vp-input::-webkit-inner-spin-button,
	.vp-input::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
	.vp-input[type=number] {
		-moz-appearance: textfield;
	}

	/* Preview container */
	.preview-container {
		flex: 1;
		overflow: hidden;
		display: flex;
		align-items: start;
		justify-content: center;
		padding: 16px;
		min-height: 0;
	}

	.iframe-viewport {
		background: #fff;
		border: 1px solid var(--border-color-subtle);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
		overflow: hidden;
	}

	.iframe-viewport.viewport-dashed {
		border-style: dashed;
		border-color: var(--admin-blue, #2563EB);
		border-width: 1px;
	}

	.iframe-viewport iframe {
		border: none;
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
