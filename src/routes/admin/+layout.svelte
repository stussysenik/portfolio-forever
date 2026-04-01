<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { getClerk } from '$lib/clerk';
	import '$lib/admin/admin-shared.css';

	const client = getConvexClient();

	const ALLOWED_GITHUB_USERNAMES = ['stussysenik', 's3nik', 'itsmxzou@gmail.com'];

	let authed = false;
	let authLoading = true;
	let authError = '';
	let userName = '';
	let userImage = '';
	let signInFn: (() => void) | null = null;

	setContext('admin', {
		get client() { return client; },
		get api() { return api; },
		get userName() { return userName; },
		get userImage() { return userImage; },
	});

	onMount(async () => {
		try {
			const clerk = await getClerk();

			if (clerk.user) {
				const ghAccount = clerk.user.externalAccounts?.find(
					(a: any) => a.provider === 'github' || a.provider === 'oauth_github'
				);
				const ghUsername = ghAccount?.username || clerk.user.username || '';
				const email = clerk.user.primaryEmailAddress?.emailAddress || '';
				const isAllowed =
					ALLOWED_GITHUB_USERNAMES.includes(ghUsername.toLowerCase()) ||
					ALLOWED_GITHUB_USERNAMES.includes(email.toLowerCase());

				if (isAllowed) {
					authed = true;
					userName = clerk.user.fullName || clerk.user.firstName || ghUsername;
					userImage = clerk.user.imageUrl || '';
				} else {
					authError = `Access denied. Account "${ghUsername || email}" is not authorized.`;
					authLoading = false;
					return;
				}
			} else {
				authLoading = false;
				signInFn = () => clerk.redirectToSignIn({ redirectUrl: window.location.href });
				return;
			}
		} catch (e: any) {
			if (e.message?.includes('publishable')) {
				authError = 'Clerk not configured. Add PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local';
			} else {
				authError = `Auth error: ${e.message}`;
			}
			authLoading = false;
			return;
		}

		authLoading = false;
	});
</script>

<svelte:head>
	<title>Admin | Portfolio CMS</title>
</svelte:head>

<div class="admin-layout">
	{#if authLoading}
		<div class="auth-gate">
			<div class="auth-loading">
				<span class="auth-spinner"></span>
				<span class="auth-loading-text">Authenticating...</span>
			</div>
		</div>
	{:else if !authed}
		<div class="auth-gate">
			{#if authError}
				<div class="auth-error">{authError}</div>
			{:else}
				<h1 class="auth-title">Portfolio Admin</h1>
				<p class="auth-subtitle">Sign in with GitHub to manage your portfolio.</p>
				{#if signInFn}
					<button class="btn-github" on:click={signInFn}>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
						</svg>
						Sign in with GitHub
					</button>
				{/if}
			{/if}
		</div>
	{:else}
		<slot />
	{/if}
</div>

<style>
	.admin-layout {
		min-height: 100vh;
		background: var(--color-bg);
		color: var(--color-text);
	}

	.auth-gate {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		text-align: center;
		gap: var(--space-md);
	}

	.auth-loading {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.auth-spinner {
		width: 12px;
		height: 12px;
		border: 2px solid var(--border-color-subtle);
		border-top-color: var(--color-text-muted);
		border-radius: 50%;
		animation: admin-spin 0.8s linear infinite;
	}

	@keyframes admin-spin {
		to { transform: rotate(360deg); }
	}

	.auth-loading-text {
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.auth-title {
		font-size: var(--font-size-2xl);
		font-weight: 600;
		color: var(--color-text);
	}

	.auth-subtitle {
		color: var(--color-text-muted);
		margin-bottom: var(--space-lg);
	}

	.auth-error {
		color: var(--color-error);
		padding: var(--space-md);
		border: 1px solid var(--color-error);
		border-radius: var(--radius-md);
		max-width: 400px;
		font-family: var(--font-mono);
		font-size: var(--font-size-sm);
	}

	.btn-github {
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		padding: 12px 24px;
		font-size: var(--font-size-base);
		font-weight: 500;
		font-family: inherit;
		color: var(--color-surface);
		background: var(--color-admin-github-bg);
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: background var(--duration-fast) var(--easing);
	}

	.btn-github:hover {
		background: var(--color-admin-github-hover);
	}
</style>
