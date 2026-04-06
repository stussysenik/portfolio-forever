<script lang="ts">
	import { toast } from '$lib/stores/toast';

	export let client: any;
	export let api: any;
	export let terminalConfig: any;
	export let compact: boolean = false;

	// ── Section editing state ─────────────────────────────────
	let editingSection: string | null = null;
	let saving = false;

	// Fortunes
	let fortunesBuffer: string[] = [];

	// Neofetch fields
	let neofetchBuffer: { label: string; value: string }[] = [];

	// Whoami
	let whoamiBuffer = '';

	// Projects
	let projectsBuffer: { name: string; url: string }[] = [];

	// Skills
	let skillsBuffer: { name: string; proficiency: number }[] = [];

	// Packages
	let packagesBuffer: { name: string; version: string; description: string }[] = [];

	// ── Helpers ────────────────────────────────────────────────

	function startEdit(section: string) {
		editingSection = section;
		switch (section) {
			case 'fortunes':
				fortunesBuffer = [...(terminalConfig?.fortunes ?? [])];
				break;
			case 'neofetch':
				neofetchBuffer = (terminalConfig?.neofetchFields ?? []).map((f: any) => ({ ...f }));
				break;
			case 'whoami':
				whoamiBuffer = terminalConfig?.whoamiOutput ?? '';
				break;
			case 'projects':
				projectsBuffer = (terminalConfig?.projectUrls ?? []).map((p: any) => ({ ...p }));
				break;
			case 'skills':
				skillsBuffer = (terminalConfig?.skills ?? []).map((s: any) => ({ ...s }));
				break;
			case 'packages':
				packagesBuffer = (terminalConfig?.packages ?? []).map((p: any) => ({ ...p }));
				break;
		}
	}

	function cancelEdit() {
		editingSection = null;
	}

	async function saveSection(section: string) {
		saving = true;
		try {
			const payload: Record<string, any> = {};
			if (terminalConfig?._id) payload.id = terminalConfig._id;
			else payload.visible = true;

			switch (section) {
				case 'fortunes':
					payload.fortunes = fortunesBuffer.filter(f => f.trim() !== '');
					break;
				case 'neofetch':
					payload.neofetchFields = neofetchBuffer.filter(f => f.label.trim() !== '');
					break;
				case 'whoami':
					payload.whoamiOutput = whoamiBuffer;
					break;
				case 'projects':
					payload.projectUrls = projectsBuffer.filter(p => p.name.trim() !== '');
					break;
				case 'skills':
					payload.skills = skillsBuffer.filter(s => s.name.trim() !== '');
					break;
				case 'packages':
					payload.packages = packagesBuffer.filter(p => p.name.trim() !== '');
					break;
			}

			await client.mutation(api.terminal.upsertTerminalConfig, payload);
			toast.success('Saved');
			editingSection = null;
		} catch (e: any) {
			toast.error(`Save failed: ${e.message}`);
		} finally {
			saving = false;
		}
	}

	async function initConfig() {
		try {
			await client.mutation(api.terminal.upsertTerminalConfig, { visible: true });
			toast.success('Terminal config initialized');
		} catch (e: any) {
			toast.error(`Init failed: ${e.message}`);
		}
	}
</script>

<section class="admin-section">
	{#if !compact}
	<div class="section-header">
		<h2 class="section-label">Terminal</h2>
		{#if !terminalConfig}
			<button class="btn-sm btn-add" on:click={initConfig}>Initialize</button>
		{/if}
	</div>
	{/if}

	{#if terminalConfig}
		<div class="card">

			<!-- Fortunes -->
			<div class="field-row field-row--column">
				<div class="group-header">
					<span class="field-label">Fortunes ({terminalConfig.fortunes?.length ?? 0})</span>
					{#if editingSection !== 'fortunes'}
						<button class="btn-sm" on:click={() => startEdit('fortunes')}>Edit</button>
					{/if}
				</div>
				{#if editingSection === 'fortunes'}
					<div class="list-editor">
						{#each fortunesBuffer as fortune, i}
							<div class="list-row">
								<input class="field-input" placeholder="Quote..." bind:value={fortunesBuffer[i]} />
								<button class="btn-sm btn-remove" on:click={() => { fortunesBuffer = fortunesBuffer.filter((_, idx) => idx !== i); }}>&#10005;</button>
							</div>
						{/each}
						<div class="list-footer">
							<button class="btn-sm" on:click={() => { fortunesBuffer = [...fortunesBuffer, '']; }}>+ Add fortune</button>
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveSection('fortunes')} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="preview-chips">
						{#if terminalConfig.fortunes?.length}
							{#each terminalConfig.fortunes.slice(0, 3) as f}
								<span class="chip">{f.length > 60 ? f.slice(0, 60) + '...' : f}</span>
							{/each}
							{#if terminalConfig.fortunes.length > 3}
								<span class="chip chip-muted">+{terminalConfig.fortunes.length - 3} more</span>
							{/if}
						{:else}
							<span class="field-value-muted">(using defaults)</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Whoami -->
			<div class="field-row">
				<span class="field-label">Whoami</span>
				{#if editingSection === 'whoami'}
					<input class="field-input" bind:value={whoamiBuffer}
						on:keydown={(e) => { if (e.key === 'Enter') saveSection('whoami'); if (e.key === 'Escape') cancelEdit(); }} />
					<div class="field-actions">
						<button class="btn-sm btn-save" on:click={() => saveSection('whoami')} disabled={saving}>Save</button>
						<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
					</div>
				{:else}
					<button class="field-value" on:click={() => startEdit('whoami')}>
						{terminalConfig.whoamiOutput || '(using default)'}
					</button>
				{/if}
			</div>

			<!-- Neofetch Fields -->
			<div class="field-row field-row--column">
				<div class="group-header">
					<span class="field-label">Neofetch Fields ({terminalConfig.neofetchFields?.length ?? 0})</span>
					{#if editingSection !== 'neofetch'}
						<button class="btn-sm" on:click={() => startEdit('neofetch')}>Edit</button>
					{/if}
				</div>
				{#if editingSection === 'neofetch'}
					<div class="list-editor">
						{#each neofetchBuffer as field, i}
							<div class="list-row">
								<input class="field-input field-sm" placeholder="Label" bind:value={neofetchBuffer[i].label} />
								<input class="field-input" placeholder="Value" bind:value={neofetchBuffer[i].value} />
								<button class="btn-sm btn-remove" on:click={() => { neofetchBuffer = neofetchBuffer.filter((_, idx) => idx !== i); }}>&#10005;</button>
							</div>
						{/each}
						<div class="list-footer">
							<button class="btn-sm" on:click={() => { neofetchBuffer = [...neofetchBuffer, { label: '', value: '' }]; }}>+ Add field</button>
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveSection('neofetch')} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="preview-chips">
						{#if terminalConfig.neofetchFields?.length}
							{#each terminalConfig.neofetchFields as f}
								<span class="chip"><strong>{f.label}:</strong> {f.value}</span>
							{/each}
						{:else}
							<span class="field-value-muted">(using defaults)</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Projects -->
			<div class="field-row field-row--column">
				<div class="group-header">
					<span class="field-label">Project URLs ({terminalConfig.projectUrls?.length ?? 0})</span>
					{#if editingSection !== 'projects'}
						<button class="btn-sm" on:click={() => startEdit('projects')}>Edit</button>
					{/if}
				</div>
				{#if editingSection === 'projects'}
					<div class="list-editor">
						{#each projectsBuffer as project, i}
							<div class="list-row">
								<input class="field-input field-sm" placeholder="Name (e.g. ipod)" bind:value={projectsBuffer[i].name} />
								<input class="field-input" placeholder="URL" bind:value={projectsBuffer[i].url} />
								<button class="btn-sm btn-remove" on:click={() => { projectsBuffer = projectsBuffer.filter((_, idx) => idx !== i); }}>&#10005;</button>
							</div>
						{/each}
						<div class="list-footer">
							<button class="btn-sm" on:click={() => { projectsBuffer = [...projectsBuffer, { name: '', url: '' }]; }}>+ Add project</button>
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveSection('projects')} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="preview-chips">
						{#if terminalConfig.projectUrls?.length}
							{#each terminalConfig.projectUrls as p}
								<span class="chip">{p.name}</span>
							{/each}
						{:else}
							<span class="field-value-muted">(using defaults)</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Skills -->
			<div class="field-row field-row--column">
				<div class="group-header">
					<span class="field-label">Skills ({terminalConfig.skills?.length ?? 0})</span>
					{#if editingSection !== 'skills'}
						<button class="btn-sm" on:click={() => startEdit('skills')}>Edit</button>
					{/if}
				</div>
				{#if editingSection === 'skills'}
					<div class="list-editor">
						{#each skillsBuffer as skill, i}
							<div class="list-row">
								<input class="field-input" placeholder="Skill name" bind:value={skillsBuffer[i].name} />
								<input class="field-input field-xs" type="number" min="0" max="100" placeholder="%" bind:value={skillsBuffer[i].proficiency} />
								<button class="btn-sm btn-remove" on:click={() => { skillsBuffer = skillsBuffer.filter((_, idx) => idx !== i); }}>&#10005;</button>
							</div>
						{/each}
						<div class="list-footer">
							<button class="btn-sm" on:click={() => { skillsBuffer = [...skillsBuffer, { name: '', proficiency: 50 }]; }}>+ Add skill</button>
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveSection('skills')} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="preview-chips">
						{#if terminalConfig.skills?.length}
							{#each terminalConfig.skills as s}
								<span class="chip">{s.name} ({s.proficiency}%)</span>
							{/each}
						{:else}
							<span class="field-value-muted">(using defaults)</span>
						{/if}
					</div>
				{/if}
			</div>

			<!-- Packages -->
			<div class="field-row field-row--column">
				<div class="group-header">
					<span class="field-label">Packages ({terminalConfig.packages?.length ?? 0})</span>
					{#if editingSection !== 'packages'}
						<button class="btn-sm" on:click={() => startEdit('packages')}>Edit</button>
					{/if}
				</div>
				{#if editingSection === 'packages'}
					<div class="list-editor">
						{#each packagesBuffer as pkg, i}
							<div class="list-row">
								<input class="field-input field-sm" placeholder="Name" bind:value={packagesBuffer[i].name} />
								<input class="field-input field-xs" placeholder="Version" bind:value={packagesBuffer[i].version} />
								<input class="field-input" placeholder="Description" bind:value={packagesBuffer[i].description} />
								<button class="btn-sm btn-remove" on:click={() => { packagesBuffer = packagesBuffer.filter((_, idx) => idx !== i); }}>&#10005;</button>
							</div>
						{/each}
						<div class="list-footer">
							<button class="btn-sm" on:click={() => { packagesBuffer = [...packagesBuffer, { name: '', version: '', description: '' }]; }}>+ Add package</button>
							<div class="field-actions">
								<button class="btn-sm btn-save" on:click={() => saveSection('packages')} disabled={saving}>Save</button>
								<button class="btn-sm" on:click={cancelEdit}>Cancel</button>
							</div>
						</div>
					</div>
				{:else}
					<div class="preview-chips">
						{#if terminalConfig.packages?.length}
							{#each terminalConfig.packages.slice(0, 5) as p}
								<span class="chip">{p.name}@{p.version}</span>
							{/each}
							{#if terminalConfig.packages.length > 5}
								<span class="chip chip-muted">+{terminalConfig.packages.length - 5} more</span>
							{/if}
						{:else}
							<span class="field-value-muted">(using defaults)</span>
						{/if}
					</div>
				{/if}
			</div>

		</div>
	{:else}
		<p class="card" style="padding: var(--space-md); color: var(--color-text-muted);">Click "Initialize" to set up terminal data.</p>
	{/if}
</section>

<style>
	.admin-section { margin-bottom: var(--space-lg); }

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.section-label {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		letter-spacing: 0.02em;
		color: var(--color-text-subtle);
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.field-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: 10px 0;
		border-bottom: 1px solid var(--border-color-subtle, rgba(0,0,0,0.06));
		min-height: 40px;
	}

	.field-row:last-child { border-bottom: none; }

	.field-row--column {
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-xs);
	}

	.field-label {
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		color: var(--color-text-muted);
		min-width: 80px;
		flex-shrink: 0;
	}

	.field-value {
		flex: 1;
		cursor: pointer;
		padding: 4px 8px;
		margin: -4px -8px;
		border-radius: 6px;
		border: none;
		background: none;
		font: inherit;
		color: var(--color-text);
		text-align: left;
		width: 100%;
		min-width: 0;
		transition: background-color 0.15s ease;
	}

	.field-value:hover { background: var(--color-surface, rgba(0,0,0,0.03)); }

	.field-value-muted {
		color: var(--color-text-subtle);
		font-size: 12px;
	}

	.field-input {
		flex: 1;
		width: 100%;
		font-family: inherit;
		font-size: 13px;
		padding: 5px 8px;
		border: 1.5px solid var(--color-accent);
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text);
		resize: vertical;
	}

	.field-input:focus-visible {
		outline: none;
		box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
	}

	.field-sm { flex: 0 0 100px; min-width: 0; }
	.field-xs { flex: 0 0 64px; min-width: 0; }

	.field-actions {
		display: flex;
		gap: 6px;
		margin-top: 6px;
	}

	.group-header {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		width: 100%;
	}

	.list-editor {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 6px;
	}

	.list-row {
		display: flex;
		gap: 6px;
		align-items: center;
	}

	.list-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 8px;
	}

	.preview-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		padding: 2px 10px;
		background: var(--color-surface, rgba(0,0,0,0.03));
		border-radius: 2px;
		font-size: 11px;
		color: var(--color-text-secondary);
		max-width: 280px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.chip-muted {
		color: var(--color-text-subtle);
		font-style: italic;
	}

	.btn-sm {
		padding: 4px 12px;
		font-family: var(--font-mono);
		font-size: 11px;
		font-weight: 500;
		border: 1px solid var(--border-color, rgba(0,0,0,0.1));
		border-radius: 6px;
		background: var(--color-bg);
		color: var(--color-text-muted);
		cursor: pointer;
		transition: border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease;
	}

	.btn-sm:hover {
		border-color: var(--color-text-subtle);
		color: var(--color-text);
		background: var(--color-surface, rgba(0,0,0,0.02));
	}

	.btn-save {
		background: var(--color-text);
		color: var(--color-bg);
		border-color: var(--color-text);
	}

	.btn-save:hover { opacity: 0.85; }

	.btn-add {
		background: var(--color-accent);
		color: #fff;
		border-color: var(--color-accent);
	}

	.btn-remove {
		flex-shrink: 0;
		padding: 4px 6px;
		line-height: 1;
		color: var(--color-text-subtle);
	}

	.btn-remove:hover { color: var(--color-text); }

	@media (max-width: 600px) {
		.field-row {
			flex-direction: column;
			align-items: flex-start;
			gap: 4px;
		}
		.field-label { min-width: unset; }
		.field-actions { width: 100%; justify-content: flex-end; }
		.list-row { flex-wrap: wrap; }
		.field-sm { flex: 1 1 80px; }
		.field-xs { flex: 1 1 56px; }
	}
</style>
