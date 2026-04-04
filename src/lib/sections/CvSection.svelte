<script lang="ts">
	// The complex HTML layout was deprecated to enforce ATS-compliance.
	// Recruiters explicitly prefer standard parsable PDFs over artistic HTML implementations.
	export let id = "cv";
</script>

<svelte:head>
	<title>CV Summary | ATS Optimized</title>
	<meta name="description" content="Official ATS-compliant CV for Stüssy Senik." />
</svelte:head>

<section class="cv-wrapper" {id}>
	<header class="cv-header mb-lg">
		<h1 class="text-2xl weight-bold tracking-tight mb-2xs">Curriculum Vitae</h1>
		<p class="text-sm text-muted">Standard ATS-compliant format. Embedded directly for precision rendering and download capabilities.</p>
	</header>

	<div class="pdf-container mt-sm rounded-md border border-border-color-subtle overflow-hidden relative shadow-sm">
		<!-- Adding height directly on the embed tag ensures better cross browser compat -->
		<embed
			src="/data/cv.pdf"
			type="application/pdf"
			width="100%"
			height="800px"
			class="pdf-embed"
		/>

		<!-- Fallback for aggressive browsers blocking PDF embeds -->
		<div class="pdf-fallback absolute inset-0 flex flex-col items-center justify-center bg-bg-alt text-center p-xl">
			<p class="text-sm text-muted mb-sm">Unable to render PDF natively.</p>
			<a href="/data/cv.pdf" download class="text-sm weight-medium text-accent hover:underline">Download Official CV</a>
		</div>
	</div>
</section>

<style>
	.cv-wrapper {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-xl) var(--space-md);
	}

	.pdf-container {
		/* Ensures a massive canvas for embedded desktop screens while allowing scroll */
		min-height: 800px;
		background: var(--color-surface);
	}

	.pdf-embed {
		position: relative;
		z-index: 10;
		background: transparent;
	}

	.pdf-fallback {
		z-index: 1; /* Sits behind the native embed object */
	}
</style>
