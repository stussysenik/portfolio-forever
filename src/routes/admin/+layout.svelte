<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { getConvexClient } from '$lib/convex';
	import { api } from '$convex/_generated/api';
	import { getClerk } from '$lib/clerk';
	import CommandPalette from '$lib/command-os/CommandPalette.svelte';
	import '$lib/admin/admin-shared.css';
	import '$lib/admin/tokens/admin-shell-tokens.css';
	import AdminIcon from '$lib/admin/AdminIcon.svelte';
	import { IconGithub } from '$lib/admin/admin-icons';

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
				authError = 'Clerk not configured. Add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to .env.local';
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
						<AdminIcon icon={IconGithub} size="lg" tone="inherit" />
						Sign in with GitHub
					</button>
				{/if}
			{/if}
		</div>
	{:else}
		<slot />
		<CommandPalette />
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
