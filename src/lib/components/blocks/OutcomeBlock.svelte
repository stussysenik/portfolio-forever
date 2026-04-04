<script lang="ts">
	import LiveContent from './LiveContent.svelte';

	export let problem: string = "Problem statement missing.";
	export let constraint: string = "Constraints missing.";
	export let result: string = "Results missing.";

	function updateProblem(e: CustomEvent<string>) { problem = e.detail; }
	function updateConstraint(e: CustomEvent<string>) { constraint = e.detail; }
	function updateResult(e: CustomEvent<string>) { result = e.detail; }
</script>

<div class="outcome-block p-4 border border-border-color-subtle rounded-md grid md:grid-cols-3 gap-md">
	<div class="outcome-segment">
		<h4 class="text-3xs uppercase tracking-widest text-muted mb-xs">Problem</h4>
		<LiveContent
			class="text-sm leading-snug"
			htmlContent={problem}
			placeholder="Define the core friction."
			on:change={updateProblem}
		/>
	</div>
	<div class="outcome-segment">
		<h4 class="text-3xs uppercase tracking-widest text-muted mb-xs">Constraint & User</h4>
		<LiveContent
			class="text-sm leading-snug"
			htmlContent={constraint}
			placeholder="What forced the design."
			on:change={updateConstraint}
		/>
	</div>
	<div class="outcome-segment result-segment">
		<h4 class="text-3xs uppercase tracking-widest text-accent mb-xs">Measurable Result</h4>
		<LiveContent
			class="text-sm font-semibold leading-snug text-text"
			htmlContent={result}
			placeholder="Outcome in % or absolute delta."
			on:change={updateResult}
		/>
	</div>
</div>

<style>
	.outcome-block {
		/* Grid layout gracefully maps to CSS standard box models */
		display: grid;
		gap: var(--space-md);
		padding: var(--space-md);
		border: 1px solid var(--border-color-subtle);
		border-radius: var(--radius-md);
		background: var(--color-bg-alt);
	}

	@media (min-width: 768px) {
		.outcome-block {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	h4 {
		margin-bottom: var(--space-xs);
	}
</style>
