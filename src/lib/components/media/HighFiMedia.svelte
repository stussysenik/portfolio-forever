<script lang="ts">
	import { match } from "ts-pattern";
	import DeviceFrame from '$lib/components/media/DeviceFrame.svelte';
	import AnimationPlayer from '$lib/components/media/AnimationPlayer.svelte';

	type PhotoAsset = {
		type: "photo";
		url: string;
		alt?: string;
		srcset?: {
			avif?: Array<{ width: number; url: string }>;
			webp?: Array<{ width: number; url: string }>;
			jpeg?: Array<{ width: number; url: string }>;
		};
		blurPlaceholder?: string;
		width?: number;
		height?: number;
	};

	type VideoAsset = {
		type: "video";
		playbackId: string;
		poster?: string;
		autoplay?: boolean;
    deviceFrame?: 'ios' | 'terminal' | 'browser' | 'none';
	};

	type GifAsset = {
		type: "gif";
		url: string;
		poster?: string;
	};

	export type MediaAsset = PhotoAsset | VideoAsset | GifAsset;

	export let asset: MediaAsset;
	export let priority = false;
	
	let loaded = false;

	$: renderType = match(asset)
		.with({ type: "photo" }, () => "photo" as const)
		.with({ type: "video" }, () => "video" as const)
		.with({ type: "gif" }, () => "gif" as const)
		.exhaustive();
</script>

<div class="highfi-media" class:loaded>
	{#if renderType === "photo" && asset.type === "photo"}
		{#if !loaded && asset.blurPlaceholder}
			<img class="blur-placeholder" src={asset.blurPlaceholder} alt="" aria-hidden="true" />
		{/if}
		<picture>
			{#if asset.srcset?.avif}
				{#each asset.srcset.avif as { width, url }}
					<source srcset={url} media={`(min-width: ${width}px)`} type="image/avif" />
				{/each}
			{/if}
			{#if asset.srcset?.webp}
				{#each asset.srcset.webp as { width, url }}
					<source srcset={url} media={`(min-width: ${width}px)`} type="image/webp" />
				{/each}
			{/if}
			<img
				src={asset.srcset?.jpeg?.[0]?.url ?? asset.url}
				alt={asset.alt ?? ""}
				loading={priority ? "eager" : "lazy"}
				decoding="async"
				on:load={() => (loaded = true)}
			/>
		</picture>
	{:else if renderType === "video" && asset.type === "video"}
		<DeviceFrame type={asset.deviceFrame ?? 'none'}>
		<mux-player
			playback-id={asset.playbackId}
			poster={asset.poster}
			muted={asset.autoplay}
			loop={asset.autoplay}
			autoplay={asset.autoplay ? "any" : false}
			stream-type="on-demand"
			style="width: 100%; height: 100%;"
		></mux-player>
	</DeviceFrame>
	{:else if renderType === "gif" && asset.type === "gif"}
		<AnimationPlayer {asset} {priority} />
	{/if}
</div>

<style>
	.highfi-media {
		position: relative;
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		border-radius: var(--radius-md, 8px);
		overflow: hidden;
		background: var(--color-surface);
	}
	.highfi-media img,
	.highfi-media picture {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
	.blur-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		filter: blur(20px);
		transform: scale(1.1);
		z-index: 1;
		transition: opacity var(--duration-normal, 0.3s) ease;
	}
	.loaded .blur-placeholder {
		opacity: 0;
		pointer-events: none;
	}
</style>
