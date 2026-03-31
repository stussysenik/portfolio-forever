<script lang="ts">
    import { toast } from '$lib/stores/toast';

    export let client: any;
    export let api: any;
    export let displayConfigs: any[];

    const SECTIONS = ['hero', 'works', 'talks', 'academia', 'likes', 'gifts', 'gallery', 'minor', 'labs', 'blog'];
    const VIEW_MODES = ['grid', 'case-study', 'minimal-list', 'pixel-universe'];
    const ANIM_OPTIONS = ['none', 'conway', 'kanagawa', 'balatro'];

    function getConfig(section: string) {
        return displayConfigs.find((c: any) => c.section === section);
    }

    async function save(section: string, field: string, value: any) {
        const existing = getConfig(section);
        try {
            if (existing) {
                await client.mutation(api.display.upsertConfig, {
                    id: existing._id, section, [field]: value,
                });
            } else {
                await client.mutation(api.display.upsertConfig, {
                    section, viewMode: 'grid', animationBg: 'none',
                    animationSpeed: 1.0, animationOpacity: 0.5, immune: false,
                    [field]: value,
                });
            }
            toast.success(`${section} display updated`);
        } catch (e: any) {
            toast.error(e.message || 'Failed to save');
        }
    }
</script>

<section class="admin-section">
    <div class="section-header">
        <h2 class="section-label">Display Modes</h2>
        <span class="section-count">{SECTIONS.length} sections</span>
    </div>

    {#each SECTIONS as section}
        {@const config = getConfig(section)}
        <div class="card" class:immune={config?.immune}>
            <div class="card-header">
                <span class="card-title">
                    {#if config?.immune}<span class="lock-badge">L</span>{/if}
                    {section}
                </span>
                <button class="btn-sm" class:btn-danger={config?.immune}
                    on:click={() => save(section, 'immune', !(config?.immune ?? false))}>
                    {config?.immune ? 'Unlock' : 'Lock'}
                </button>
            </div>

            <div class="card-body" class:disabled={config?.immune}>
                <div class="field-row">
                    <span class="field-label">View Mode</span>
                    <select class="field-input-sm"
                        value={config?.viewMode ?? 'grid'}
                        on:change={(e) => save(section, 'viewMode', e.currentTarget.value)}>
                        {#each VIEW_MODES as mode}
                            <option value={mode}>{mode}</option>
                        {/each}
                    </select>
                </div>

                <div class="field-row">
                    <span class="field-label">Animation BG</span>
                    <select class="field-input-sm"
                        value={config?.animationBg ?? 'none'}
                        on:change={(e) => save(section, 'animationBg', e.currentTarget.value)}>
                        {#each ANIM_OPTIONS as opt}
                            <option value={opt}>{opt}</option>
                        {/each}
                    </select>
                </div>

                <div class="field-row">
                    <span class="field-label">Speed ({(config?.animationSpeed ?? 1.0).toFixed(1)})</span>
                    <input type="range" min="0" max="2" step="0.1"
                        value={config?.animationSpeed ?? 1.0}
                        on:change={(e) => save(section, 'animationSpeed', parseFloat(e.currentTarget.value))} />
                </div>

                <div class="field-row">
                    <span class="field-label">Opacity ({(config?.animationOpacity ?? 0.5).toFixed(2)})</span>
                    <input type="range" min="0" max="1" step="0.05"
                        value={config?.animationOpacity ?? 0.5}
                        on:change={(e) => save(section, 'animationOpacity', parseFloat(e.currentTarget.value))} />
                </div>
            </div>
        </div>
    {/each}
</section>

<style>
    .immune { border-left: 3px solid var(--color-warning, #d97706); }
    .disabled { opacity: 0.5; pointer-events: none; }
    .lock-badge { font-size: 0.7rem; color: var(--color-warning, #d97706); margin-right: 4px; }
    .field-row { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; }
    .field-label { font-family: var(--font-mono); font-size: 0.75rem; color: var(--color-text-muted, #666); }
    .field-input-sm { font-family: var(--font-mono); font-size: 0.75rem; padding: 4px 8px;
        border: 1px solid var(--color-border, #e0e0e0); border-radius: 4px; background: var(--color-bg, #fff); }
    input[type="range"] { flex: 1; margin-left: 12px; }
</style>
