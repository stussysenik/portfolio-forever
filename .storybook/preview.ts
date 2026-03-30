import '../src/app.css';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/i,
		},
	},
	a11y: {
		config: {
			rules: [
				{ id: 'color-contrast', enabled: true },
				{ id: 'html-has-lang', enabled: false }, // Storybook iframe
			],
		},
	},
};
