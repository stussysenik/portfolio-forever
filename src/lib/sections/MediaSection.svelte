<script lang="ts">
	import { onMount } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';

	export let id = "media";

	let activeFilter: string = 'all';
	let galleryItems: any[] = [];
	let selected: any | null = null;

	const categories = ['all', 'design', 'technology', 'art', 'film'];

	const categoryColors: Record<string, string> = {
		design: 'var(--color-design)',
		technology: 'var(--color-technology)',
		art: 'var(--color-art)',
		film: 'var(--color-film)',
	};

	onMount(() => {
		const client = getConvexClient();
		const unsub = client.onUpdate((api as any).gallery.getVisibleGallery, {}, (data: any) => {
			if (data) galleryItems = data;
		});
		return () => unsub();
	});

	$: filteredItems = activeFilter === 'all'
		? galleryItems
		: galleryItems.filter((item: any) => {
			const cats = Array.isArray(item.category) ? item.category : [item.category];
			return cats.includes(activeFilter);
		});

	function isVideo(item: any): boolean {
		if (item.muxPlaybackId) return true;
		if (item.fullUrl) {
			const ext = item.fullUrl.split('.').pop()?.toLowerCase() ?? '';
			return ['mp4', 'webm', 'mov', 'avi'].includes(ext);
		}
		if (item.thumbnailUrl) {
			const ext = item.thumbnailUrl.split('.').pop()?.toLowerCase() ?? '';
			return ['mp4', 'webm', 'mov', 'avi'].includes(ext);
		}
		return false;
	}

	function mediaSrc(item: any): string {
		return item.fullUrl || item.thumbnailUrl || '';
	}

	function posterSrc(item: any): string {
		return item.thumbnailUrl || '';
	}

	let playingVideo: string | null = null;

	function togglePlay(item: any) {
		const src = mediaSrc(item);
		if (playingVideo === src) {
			playingVideo = null;
		} else {
			playingVideo = src;
		}
	}
</script>

<svelte:head>
	<title>Media</title>
	<meta name="description" content="Photo and video archive" />
</svelte:head>

<svelte:window on:keydown={(e) => {
	if (e.key === 'Escape') { selected = null; playingVideo = null; }
}} />

<div {id}>
	<header class="media-header">
		<h1 class="media-title">MEDIA</h1>
		<span class="media-count">[{filteredItems.length}]</span>
	</header>

	<nav class="filter-bar" role="tablist" aria-label="Filter by category">
		{#each categories as cat}
			<button
				role="tab"
				aria-selected={activeFilter === cat}
				class="filter-pill"
				class:active={activeFilter === cat}
				on:click={() => activeFilter = cat}
			>
				{#if cat !== 'all'}
					<span class="cat-dot" style="background: {categoryColors[cat] || 'var(--color-text-subtle)'}"></span>
				{/if}
				{cat}
			</button>
		{/each}
	</nav>

	{#if filteredItems.length === 0}
		<div class="empty-state">
			<p>No media yet.</p>
		</div>
	{:else}
		<div class="media-grid">
			{#each filteredItems as item (item._id)}
				{@const video = isVideo(item)}
				{@const src = mediaSrc(item)}
				{@const poster = posterSrc(item)}
				{@const cats = Array.isArray(item.category) ? item.category : item.category ? [item.category] : []}

				<button
					class="media-card"
					on:click={() => selected = item}
				>
					<div class="media-thumb">
						{#if video}
							<video
								src={src}
								poster={poster}
								muted
								playsinline
								preload="metadata"
								class="thumb-asset"
							></video>
							<span class="media-badge video-badge">▶</span>
						{:else if src}
							<img
								src={src}
								alt={item.title || ''}
								loading="lazy"
								decoding="async"
								class="thumb-asset"
							/>
						{:else}
							<div class="thumb-placeholder" style="--accent: {categoryColors[cats[0]] || 'var(--color-text-subtle)'}">
								<span class="placeholder-char">{(item.title || '?').charAt(0)}</span>
							</div>
						{/if}

						{#if item.title}
							<div class="thumb-label">
								<span class="thumb-title">{item.title}</span>
								{#if item.year}
									<span class="thumb-year">{item.year}</span>
								{/if}
							</div>
						{/if}
					</div>

					{#if cats.length > 0}
						<div class="thumb-tags">
							{#each cats as cat}
								<span class="cat-tag" style="--dot: {categoryColors[cat] || 'var(--color-text-subtle)'}">{cat}</span>
							{/each}
						</div>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

{#if selected}
	<div class="lightbox" role="dialog" aria-modal="true" aria-label="Media viewer">
		<button class="lb-dismiss" aria-label="Close" on:click={() => { selected = null; playingVideo = null; }}></button>
		<div class="lb-content">
			<button class="lb-close" on:click={() => { selected = null; playingVideo = null; }} aria-label="Close">&times;</button>

			<div class="lb-media">
				{#if isVideo(selected)}
					<video
						src={mediaSrc(selected)}
						poster={posterSrc(selected)}
						controls
						autoplay
						playsinline
						class="lb-asset lb-video"
					></video>
				{:else if mediaSrc(selected)}
					<img src={mediaSrc(selected)} alt={selected.title || ''} class="lb-asset lb-image" />
				{:else}
					<div class="lb-empty">No media available</div>
				{/if}
			</div>

			<div class="lb-info">
				<h2 class="lb-title">{selected.title || ''}</h2>
				<div class="lb-meta">
					{#if selected.year}
						<span class="lb-year">{selected.year}</span>
					{/if}
					{#if selected.description}
						<p class="lb-desc">{selected.description}</p>
					{/if}
				</div>
				{#if Array.isArray(selected.category) && selected.category.length > 0}
					<div class="lb-tags">
						{#each selected.category as cat}
							<span class="cat-tag" style="--dot: {categoryColors[cat] || 'var(--color-text-subtle)'}">{cat}</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.media-header {
		display: flex;
		align-items: baseline;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
		padding-bottom: var(--space-sm);
		border-bottom: var(--border-width-thick) solid var(--color-text);
	}

	.media-title {
		font-family: var(--font-sans);
		font-size: var(--font-size-xl);
		font-weight: 600;
		letter-spacing: var(--letter-spacing-tight);
		margin: 0;
	}

	.media-count {
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		color: var(--color-text-subtle);
	}

	/* Filter bar */
	.filter-bar {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-bottom: var(--space-xl);
	}

	.filter-pill {
		display: inline-flex;
		align-items: center;
		gap: var(--space-xs);
		font-family: var(--font-mono);
		font-size: var(--font-size-xs);
		padding: var(--space-xs) var(--space-sm);
		min-height: 36px;
		background: transparent;
		border: var(--border-width) solid var(--border-color);
		border-radius: var(--radius-sm);
		color: var(--color-text-muted);
		cursor: pointer;
		transition: all var(--duration-fast) var(--easing);
		-webkit-tap-highlight-color: transparent;
	}

	.filter-pill:hover {
		border-color: var(--color-text-muted);
		color: var(--color-text);
	}

	.filter-pill.active {
		background: var(--color-text);
		border-color: var(--color-text);
		color: var(--color-bg);
	}

	.cat-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	/* Grid — mobile first, 2 cols */
	.media-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-xs);
	}

	@media (min-width: 480px) {
		.media-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-sm);
		}
	}

	@media (min-width: 768px) {
		.media-grid {
			grid-template-columns: repeat(3, 1fr);
			gap: var(--space-lg);
		}
	}

	@media (min-width: 1024px) {
		.media-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	/* Card */
	.media-card {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
		text-align: left;
		-webkit-tap-highlight-color: transparent;
	}

	.media-thumb {
		position: relative;
		aspect-ratio: 1;
		border-radius: var(--radius-md);
		overflow: hidden;
		background: var(--color-bg-alt);
	}

	.thumb-asset {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.thumb-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg-alt);
	}

	.placeholder-char {
		font-family: var(--font-sans);
		font-size: var(--font-size-2xl);
		font-weight: 700;
		color: var(--accent);
		opacity: 0.3;
		text-transform: uppercase;
	}

	.media-badge {
		position: absolute;
		bottom: var(--space-xs);
		right: var(--space-xs);
		width: 28px;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.6);
		color: white;
		font-size: 10px;
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	.video-badge {
		font-size: 9px;
		letter-spacing: -0.5px;
	}

	.thumb-label {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: var(--space-sm) var(--space-xs) var(--space-xs);
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
		opacity: 0;
		transition: opacity var(--duration-fast) var(--easing);
	}

	@media (hover: none) {
		.thumb-label {
			opacity: 1;
		}
	}

	.media-card:hover .thumb-label {
		opacity: 1;
	}

	.thumb-title {
		font-size: 11px;
		font-weight: 500;
		color: white;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 1.2;
	}

	.thumb-year {
		font-family: var(--font-mono);
		font-size: 10px;
		color: rgba(255, 255, 255, 0.6);
	}

	.thumb-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
		padding: 0 2px;
	}

	.cat-tag {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		font-family: var(--font-mono);
		font-size: 10px;
		text-transform: lowercase;
		color: var(--color-text-muted);
		padding: 1px 6px;
		border-radius: var(--radius-sm);
		background: var(--color-bg-alt);
	}

	.cat-tag::before {
		content: '';
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--dot);
		flex-shrink: 0;
	}

	/* Empty state */
	.empty-state {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 40vh;
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	/* Lightbox */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 2000;
		background: rgba(0, 0, 0, 0.92);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-md);
		animation: lb-fade var(--duration-fast) var(--easing);
	}

	.lb-dismiss {
		position: absolute;
		inset: 0;
		border: none;
		background: transparent;
		padding: 0;
		cursor: pointer;
	}

	.lb-content {
		position: relative;
		z-index: 1;
		max-width: 720px;
		width: 100%;
		max-height: 90vh;
		overflow-y: auto;
		border-radius: var(--radius-lg);
		background: var(--color-surface);
	}

	.lb-close {
		position: absolute;
		top: var(--space-sm);
		right: var(--space-sm);
		width: 36px;
		height: 36px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-bg);
		border: var(--border-width) solid var(--border-color);
		border-radius: 50%;
		font-size: var(--font-size-lg);
		color: var(--color-text-muted);
		cursor: pointer;
		z-index: 10;
		transition: all var(--duration-fast) var(--easing);
	}

	.lb-close:hover {
		background: var(--color-text);
		color: var(--color-bg);
	}

	.lb-media {
		width: 100%;
		background: #000;
	}

	.lb-asset {
		display: block;
		max-width: 100%;
		max-height: 60vh;
		margin: 0 auto;
	}

	.lb-video {
		width: 100%;
		max-height: none;
	}

	.lb-image {
		object-fit: contain;
	}

	.lb-empty {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 200px;
		color: var(--color-text-subtle);
		font-family: var(--font-mono);
	}

	.lb-info {
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.lb-title {
		font-family: var(--font-sans);
		font-size: var(--font-size-lg);
		font-weight: 600;
		margin: 0;
		color: var(--color-text);
	}

	.lb-meta {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.lb-year {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
	}

	.lb-desc {
		font-size: var(--font-size-sm);
		color: var(--color-text-secondary);
		line-height: var(--line-height-relaxed);
		margin: 0;
	}

	.lb-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	/* Mobile */
	@media (max-width: 767px) {
		.media-header {
			flex-wrap: wrap;
			gap: var(--space-sm);
		}

		.filter-bar {
			gap: 4px;
			margin-bottom: var(--space-md);
		}

		.filter-pill {
			font-size: 11px;
			padding: 6px 10px;
		}

		.thumb-title {
			font-size: 10px;
		}

		.thumb-year {
			font-size: 9px;
		}

		.cat-tag {
			font-size: 9px;
		}

		.lb-content {
			max-height: 85vh;
			border-radius: var(--radius-md);
		}

		.lb-info {
			padding: var(--space-md);
		}

		.lb-title {
			font-size: var(--font-size-base);
		}
	}

	@keyframes lb-fade {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
