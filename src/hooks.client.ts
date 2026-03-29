import * as Sentry from '@sentry/sveltekit';

Sentry.init({
	dsn: import.meta.env.PUBLIC_SENTRY_DSN || '',
	tracesSampleRate: 1.0,
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
	environment: import.meta.env.MODE,
	enabled: !!import.meta.env.PUBLIC_SENTRY_DSN,
});

export const handleError = Sentry.handleErrorWithSentry();
