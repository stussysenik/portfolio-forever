<script lang="ts">
	import SectionShell from '../layout/SectionShell.svelte';
	import PhotoViewer from './PhotoViewer.svelte';
	import MuxVideo from '../MuxVideo.svelte';
	import AnimationPlayer from './AnimationPlayer.svelte';
	import DeviceFrame from './DeviceFrame.svelte';

	export let showcase: any;

	$: heroMedia = showcase.media.find(m => m.featured) || showcase.media[0];
	$: supportingMedia = showcase.media.filter(m => m !== heroMedia);
</script>

<div class="project-showcase-detail">
	<SectionShell 
		title={showcase.title} 
		subtitle={showcase.tagline}
		showLayoutSwitcher={false}
	>
		<div class="showcase-content">
			<div class="hero-section">
				{#if heroMedia}
					<div class="hero-media-container">
						{#if heroMedia.asset.type === 'video'}
							<DeviceFrame type={heroMedia.asset.deviceFrame || 'none'}>
								<MuxVideo 
									playbackId={heroMedia.asset.muxPlaybackId} 
									title={heroMedia.label}
								/>
							</DeviceFrame>
						{:else if heroMedia.asset.type === 'photo'}
							<PhotoViewer asset={heroMedia.asset} priority={true} />
						{:else if heroMedia.asset.type === 'gif'}
							<AnimationPlayer asset={heroMedia.asset} />
						{/if}
					</div>
				{/if}
				
				<div class="project-info">
					<div class="meta-grid">
						{#if showcase.year}
							<div class="meta-item">
								<span class="label">YEAR</span>
								<span class="value">{showcase.year}</span>
							</div>
						{/if}
						{#if showcase.languages && showcase.languages.length > 0}
							<div class="meta-item">
								<span class="label">LANGUAGES</span>
								<span class="value">{showcase.languages.join(' · ')}</span>
							</div>
						{/if}
						{#if showcase.categories && showcase.categories.length > 0}
							<div class="meta-item">
								<span class="label">CATEGORIES</span>
								<span class="value">{showcase.categories.join(' · ')}</span>
							</div>
						{/if}
					</div>

					<div class="description">
						{@html showcase.description}
					</div>

					<div class="links">
						{#if showcase.githubUrl}
							<a href={showcase.githubUrl} target="_blank" rel="noopener noreferrer" class="link-btn">
								VIEW SOURCE ↗
							</a>
						{/if}
						{#if showcase.liveUrl}
							<a href={showcase.liveUrl} target="_blank" rel="noopener noreferrer" class="link-btn primary">
								LIVE DEMO ↗
							</a>
						{/if}
					</div>
				</div>
			</div>

			{#if supportingMedia.length > 0}
				<div class="supporting-media-grid">
					{#each supportingMedia as item}
						<div class="media-item" class:wide={item.featured}>
							{#if item.asset.type === 'photo'}
								<PhotoViewer asset={item.asset} />
							{:else if item.asset.type === 'video'}
								<DeviceFrame type={item.asset.deviceFrame || 'none'}>
									<MuxVideo playbackId={item.asset.muxPlaybackId} title={item.label} />
								</DeviceFrame>
							{:else if item.asset.type === 'gif'}
								<AnimationPlayer asset={item.asset} />
							{/if}
							{#if item.label}
								<span class="caption">{item.label}</span>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</SectionShell>
</div>

<style>
	.showcase-content {
		display: flex;
		flex-direction: column;
		gap: 6rem;
		padding: 2rem 0;
	}

	.hero-section {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: 4rem;
		align-items: start;
	}

	.hero-media-container {
		width: 100%;
		border-radius: 4px;
		overflow: hidden;
		background: var(--color-bg-secondary);
	}

	.project-info {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	.meta-grid {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-border);
	}

	.meta-item {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.meta-item .label {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--color-text-subtle);
		letter-spacing: 0.1em;
	}

	.meta-item .value {
		font-family: var(--font-mono);
		font-size: 0.9rem;
		color: var(--color-text);
		font-weight: 500;
	}

	.description {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--color-text-secondary);
	}

	.links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.link-btn {
		padding: 0.75rem 1.5rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		text-decoration: none;
		border: 1px solid var(--color-border);
		color: var(--color-text);
		transition: all 0.2s ease;
	}

	.link-btn:hover {
		background: var(--color-bg-secondary);
		border-color: var(--color-text);
	}

	.link-btn.primary {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}

	.supporting-media-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3rem;
	}

	.media-item {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.media-item.wide {
		grid-column: span 2;
	}

	.caption {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--color-text-subtle);
		text-align: center;
	}

	@media (max-width: 1024px) {
		.hero-section {
			grid-template-columns: 1fr;
			gap: 3rem;
		}

		.supporting-media-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.media-item.wide {
			grid-column: span 1;
		}
	}
</style>
