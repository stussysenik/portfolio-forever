<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { api } from "../../../convex/_generated/api.js";
	import { getConvexClient } from "../convex";
	import MediaAdmin from "./MediaAdmin.svelte";
	import ProjectShowcaseAdmin from "./ProjectShowcaseAdmin.svelte";
	import PhotoCollectionAdmin from "./PhotoCollectionAdmin.svelte";

	type Tab = "assets" | "showcases" | "collections";
	let activeTab: Tab = "assets";

	let assets: any[] = [];
	let showcases: any[] = [];
	let collections: any[] = [];
	
	let connected = false;
	let statusMessage = "Connecting to Convex...";

	let unsubscribeAssets: (() => void) | undefined;
	let unsubscribeShowcases: (() => void) | undefined;
	let unsubscribeCollections: (() => void) | undefined;

	onMount(() => {
		const client = getConvexClient();
		if (!client) {
			statusMessage = "Convex client unavailable.";
			return;
		}

		unsubscribeAssets = client.onUpdate(api.mediaAssets.getAll, {}, (data) => {
			assets = Array.isArray(data) ? data : [];
			connected = true;
			statusMessage = "Synced media assets.";
		});

		unsubscribeShowcases = client.onUpdate(api.projectShowcases.getAll, {}, (data) => {
			showcases = Array.isArray(data) ? data : [];
		});

		unsubscribeCollections = client.onUpdate(api.photoCollections.getAll, {}, (data) => {
			collections = Array.isArray(data) ? data : [];
		});
	});

	onDestroy(() => {
		unsubscribeAssets?.();
		unsubscribeShowcases?.();
		unsubscribeCollections?.();
	});
</script>

<div class="media-app">
	<header class="media-app__header">
		<nav class="media-app__tabs">
			<button 
				class:active={activeTab === 'assets'} 
				on:click={() => activeTab = 'assets'}
			>
				Assets ({assets.length})
			</button>
			<button 
				class:active={activeTab === 'showcases'} 
				on:click={() => activeTab = 'showcases'}
			>
				Showcases ({showcases.length})
			</button>
			<button 
				class:active={activeTab === 'collections'} 
				on:click={() => activeTab = 'collections'}
			>
				Collections ({collections.length})
			</button>
		</nav>
		<div class="media-app__status">
			<span class="status-dot" class:connected></span>
			{statusMessage}
		</div>
	</header>

	<main class="media-app__content">
		{#if activeTab === 'assets'}
			<MediaAdmin {assets} />
		{:else if activeTab === 'showcases'}
			<ProjectShowcaseAdmin {showcases} {assets} />
		{:else if activeTab === 'collections'}
			<PhotoCollectionAdmin {collections} {assets} />
		{/if}
	</main>
</div>

<style>
	.media-app {
		display: flex;
		flex-direction: column;
		min-height: 40rem;
	}

	.media-app__header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		border-bottom: 1px solid rgba(15, 23, 42, 0.1);
		background: rgba(255, 255, 255, 0.5);
	}

	.media-app__tabs {
		display: flex;
		gap: 0.5rem;
	}

	.media-app__tabs button {
		padding: 0.5rem 1rem;
		border: 1px solid transparent;
		background: none;
		font: inherit;
		font-weight: 500;
		color: rgba(15, 23, 42, 0.6);
		cursor: pointer;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.media-app__tabs button:hover {
		background: rgba(15, 23, 42, 0.05);
	}

	.media-app__tabs button.active {
		background: white;
		border-color: rgba(15, 23, 42, 0.1);
		color: #0f172a;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}

	.media-app__status {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: rgba(15, 23, 42, 0.5);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #ef4444;
	}

	.status-dot.connected {
		background: #10b981;
	}

	.media-app__content {
		flex: 1;
		padding: 1.5rem;
		overflow-y: auto;
	}
</style>
