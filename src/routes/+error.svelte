<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="error-page">
	<h1>{$page.status}</h1>
	<p>{$page.error?.message || 'Something went wrong'}</p>
	<pre style="text-align: left; max-width: 800px; overflow: auto; padding: 1rem; background: #eee;">{JSON.stringify($page.error, Object.getOwnPropertyNames($page.error || {}), 2)}</pre>
	<a href="/">← Back to home</a>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 50vh;
		gap: var(--space-md);
		text-align: center;
	}

	h1 {
		font-size: var(--font-size-3xl, 3rem);
		font-weight: 600;
		opacity: 0.3;
	}

	p {
		color: var(--color-text-muted);
		max-width: 400px;
	}

	a {
		color: var(--color-accent);
		text-decoration: none;
		font-size: var(--font-size-sm);
	}

	a:hover {
		text-decoration: underline;
	}
</style>
