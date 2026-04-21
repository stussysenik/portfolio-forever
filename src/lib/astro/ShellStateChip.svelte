<script lang="ts">
	import { shellState } from "../stores/shellState";
</script>

<div class="shell-chip" data-state={$shellState}>
	<span class="shell-chip__label">nano</span>
	<span class="shell-chip__value">{$shellState}</span>
</div>

<style>
	.shell-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.8rem;
		border: 1px solid rgba(15, 23, 42, 0.16);
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(14px);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.shell-chip__label {
		color: rgba(15, 23, 42, 0.52);
	}

	.shell-chip__value {
		color: #0f172a;
		font-weight: 600;
	}

	.shell-chip[data-state="spread"] {
		border-color: rgba(190, 24, 93, 0.28);
		box-shadow: 0 0 0 1px rgba(190, 24, 93, 0.08);
	}
</style>
