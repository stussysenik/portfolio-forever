<script lang="ts">
	import type { AdminIconComponent } from "./admin-icons";

	export let icon: AdminIconComponent;
	export let size: "xs" | "sm" | "md" | "lg" = "sm";
	export let tone: "default" | "accent" | "subtle" | "success" | "inherit" = "default";
	let cls: string = "";
	export { cls as class };
	export let ariaLabel: string | undefined = undefined;
</script>

<span
	class="admin-icon admin-icon--{size} admin-icon--{tone} {cls}"
	role={ariaLabel ? "img" : undefined}
	aria-label={ariaLabel}
	aria-hidden={ariaLabel ? undefined : "true"}
>
	<svelte:component this={icon} />
</span>

<style>
	.admin-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		line-height: 0;
	}
	.admin-icon :global(svg) {
		width: 100%;
		height: 100%;
		stroke: currentColor;
		stroke-width: 1.75;
		fill: none;
		display: block;
	}
	.admin-icon--xs {
		width: 12px;
		height: 12px;
	}
	.admin-icon--sm {
		width: 14px;
		height: 14px;
	}
	.admin-icon--md {
		width: 16px;
		height: 16px;
	}
	.admin-icon--lg {
		width: 20px;
		height: 20px;
	}
	.admin-icon--default {
		color: var(--admin-text, currentColor);
	}
	.admin-icon--subtle {
		color: var(--admin-text-subtle, var(--admin-text, currentColor));
		opacity: 0.75;
	}
	.admin-icon--accent {
		color: var(--admin-accent, currentColor);
	}
	.admin-icon--success {
		color: var(--admin-success, var(--color-success, #16a34a));
	}
	.admin-icon--inherit {
		color: inherit;
	}
</style>
