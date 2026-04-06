<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let osConfig: any;
	export let compact: boolean = false;

	// ── Icons editing state ──────────────────────────────────────────
	let editingIcons = false;
	let iconsDraft: Array<{ label: string; icon: string; content: string; action: string; order: number }> = [];

	// ── Windows editing state ────────────────────────────────────────
	let editingWindows = false;
	let windowsDraft: Array<{ title: string; content: string; x: number; y: number }> = [];

	// ── Desktop color editing ────────────────────────────────────────
	let editingColor = false;
	let colorDraft = '';

	let saving = false;

	function startEditIcons() {
		iconsDraft = (osConfig?.icons ?? []).map((ic: any, i: number) => ({
			label: ic.label || '',
			icon: ic.icon || '',
			content: ic.content || '',
			action: ic.action || '',
			order: ic.order ?? i,
		}));
		editingIcons = true;
	}

	function addIcon() {
		iconsDraft = [...iconsDraft, {
			label: 'New Icon',
			icon: '',
			content: '',
			action: '',
			order: iconsDraft.length,
		}];
	}

	function removeIcon(idx: number) {
		iconsDraft = iconsDraft.filter((_, i) => i !== idx).map((ic, i) => ({ ...ic, order: i }));
	}

	async function saveIcons() {
		saving = true;
		try {
			const icons = iconsDraft.map((ic, i) => {
				const obj: any = { label: ic.label, icon: ic.icon, order: i };
				if (ic.content) obj.content = ic.content;
				if (ic.action) obj.action = ic.action;
				return obj;
			});

			if (osConfig?._id) {
				await client.mutation(api.os.upsertOsConfig, { id: osConfig._id, icons });
			} else {
				await client.mutation(api.os.upsertOsConfig, { icons, visible: true });
			}
			toast.success('Icons saved');
			editingIcons = false;
		} catch (err: any) {
			toast.error(err.message || 'Failed to save icons');
		} finally {
			saving = false;
		}
	}

	function startEditWindows() {
		windowsDraft = (osConfig?.initialWindows ?? []).map((w: any) => ({
			title: w.title || '',
			content: w.content || '',
			x: w.x ?? 100,
			y: w.y ?? 100,
		}));
		editingWindows = true;
	}

	function addWindow() {
		windowsDraft = [...windowsDraft, {
			title: 'New Window',
			content: '',
			x: 100 + windowsDraft.length * 30,
			y: 100 + windowsDraft.length * 30,
		}];
	}

	function removeWindow(idx: number) {
		windowsDraft = windowsDraft.filter((_, i) => i !== idx);
	}

	async function saveWindows() {
		saving = true;
		try {
			const initialWindows = windowsDraft.map((w) => ({
				title: w.title,
				content: w.content,
				x: w.x,
				y: w.y,
			}));

			if (osConfig?._id) {
				await client.mutation(api.os.upsertOsConfig, { id: osConfig._id, initialWindows });
			} else {
				await client.mutation(api.os.upsertOsConfig, { initialWindows, visible: true });
			}
			toast.success('Windows saved');
			editingWindows = false;
		} catch (err: any) {
			toast.error(err.message || 'Failed to save windows');
		} finally {
			saving = false;
		}
	}

	function startEditColor() {
		colorDraft = osConfig?.desktopColor || '#008080';
		editingColor = true;
	}

	async function saveColor() {
		saving = true;
		try {
			if (osConfig?._id) {
				await client.mutation(api.os.upsertOsConfig, { id: osConfig._id, desktopColor: colorDraft });
			} else {
				await client.mutation(api.os.upsertOsConfig, { desktopColor: colorDraft, visible: true });
			}
			toast.success('Desktop color saved');
			editingColor = false;
		} catch (err: any) {
			toast.error(err.message || 'Failed to save color');
		} finally {
			saving = false;
		}
	}

	async function initOsConfig() {
		try {
			await client.mutation(api.os.upsertOsConfig, { visible: true });
			toast.success('OS config initialized');
		} catch (err: any) {
			toast.error(err.message || 'Failed to initialize');
		}
	}
</script>

<section class="admin-section">
	{#if !compact}
	<div class="section-header">
		<h2 class="section-label">OS Desktop</h2>
		{#if !osConfig}
			<button class="btn-sm btn-add" on:click={initOsConfig}>Initialize</button>
		{/if}
	</div>
	{/if}

	{#if osConfig}
		<!-- ── Icons Group ─────────────────────────────────────────────── -->
		<div class="card">
			<div class="taglines-header">
				<span class="field-label">Icons ({osConfig.icons?.length ?? 0})</span>
				{#if !editingIcons}
					<button class="btn-sm" on:click={startEditIcons}>Edit</button>
				{/if}
			</div>

			{#if editingIcons}
				<div class="taglines-list">
					{#each iconsDraft as icon, idx}
						<div class="tagline-row">
							<div class="field-row">
								<span class="field-label" style="width: 32px">{icon.icon || '?'}</span>
								<input class="field-input" style="width: 36px" bind:value={icon.icon} placeholder="emoji" />
								<input class="field-input" style="flex:1" bind:value={icon.label} placeholder="Label" />
							</div>
							<div class="field-row">
								<input class="field-input" style="flex:1" bind:value={icon.content} placeholder="Content (window text)" />
								<input class="field-input" style="width: 60px" bind:value={icon.action} placeholder="action" />
								<button class="btn-sm btn-remove" on:click={() => removeIcon(idx)}>x</button>
							</div>
						</div>
					{/each}
				</div>
				<div class="taglines-footer">
					<button class="btn-sm btn-add" on:click={addIcon}>+ Icon</button>
					<button class="btn-sm btn-save" on:click={saveIcons} disabled={saving}>Save Icons</button>
					<button class="btn-sm" on:click={() => (editingIcons = false)}>Cancel</button>
				</div>
			{:else}
				<div class="taglines-list">
					{#each osConfig.icons ?? [] as icon}
						<div class="tagline-row">
							<span class="field-value">{icon.icon} {icon.label}{icon.action ? ` [${icon.action}]` : ''}</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ── Windows Group ───────────────────────────────────────────── -->
		<div class="card">
			<div class="taglines-header">
				<span class="field-label">Initial Windows ({osConfig.initialWindows?.length ?? 0})</span>
				{#if !editingWindows}
					<button class="btn-sm" on:click={startEditWindows}>Edit</button>
				{/if}
			</div>

			{#if editingWindows}
				<div class="taglines-list">
					{#each windowsDraft as win, idx}
						<div class="tagline-row">
							<div class="field-row">
								<input class="field-input" style="flex:1" bind:value={win.title} placeholder="Window title" />
								<input class="field-input" style="width: 50px" bind:value={win.x} type="number" placeholder="x" />
								<input class="field-input" style="width: 50px" bind:value={win.y} type="number" placeholder="y" />
								<button class="btn-sm btn-remove" on:click={() => removeWindow(idx)}>x</button>
							</div>
							<div class="field-row">
								<textarea class="field-input" style="flex:1; min-height: 40px" bind:value={win.content} placeholder="Window content"></textarea>
							</div>
						</div>
					{/each}
				</div>
				<div class="taglines-footer">
					<button class="btn-sm btn-add" on:click={addWindow}>+ Window</button>
					<button class="btn-sm btn-save" on:click={saveWindows} disabled={saving}>Save Windows</button>
					<button class="btn-sm" on:click={() => (editingWindows = false)}>Cancel</button>
				</div>
			{:else}
				<div class="taglines-list">
					{#each osConfig.initialWindows ?? [] as win}
						<div class="tagline-row">
							<span class="field-value">{win.title} ({win.x}, {win.y})</span>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- ── Desktop Color ───────────────────────────────────────────── -->
		<div class="card">
			<div class="field-row">
				<span class="field-label">Desktop Color</span>
				{#if editingColor}
					<input class="field-input" style="width: 80px" type="color" bind:value={colorDraft} />
					<input class="field-input" style="width: 80px" bind:value={colorDraft} placeholder="#008080" />
					<button class="btn-sm btn-save" on:click={saveColor} disabled={saving}>Save</button>
					<button class="btn-sm" on:click={() => (editingColor = false)}>Cancel</button>
				{:else}
					<span class="field-value" style="display: flex; align-items: center; gap: 6px; cursor: pointer"
						role="button" tabindex="0"
						on:click={startEditColor}
						on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') startEditColor(); }}
					>
						<span style="display:inline-block; width:14px; height:14px; background:{osConfig.desktopColor || '#008080'}; border:1px solid #333; border-radius:2px"></span>
						{osConfig.desktopColor || '#008080'}
					</span>
				{/if}
			</div>
		</div>
	{:else}
		<p class="card" style="padding: var(--space-md); color: var(--color-text-muted);">Click "Initialize" to set up the OS desktop config.</p>
	{/if}
</section>

<style>
	/* Shared admin styles come from admin-shared.css */
</style>
