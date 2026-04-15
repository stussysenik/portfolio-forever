import type { Meta, StoryObj } from '@storybook/svelte';
import ThemeSwitcher from './ThemeSwitcher.svelte';

const meta = {
	title: 'Components/ThemeSwitcher',
	component: ThemeSwitcher,
	parameters: { layout: 'centered' },
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const makeThemeStory = (themeId: string): Story => ({
	decorators: [
		(Story) => {
			if (typeof document !== 'undefined') {
				document.documentElement.setAttribute('data-theme', themeId);
			}
			return Story();
		},
	],
});

export const Minimal = makeThemeStory('minimal');
export const Studio = makeThemeStory('studio');
export const Terminal = makeThemeStory('terminal');
export const Darkroom = makeThemeStory('darkroom');
export const Accessible = makeThemeStory('accessible');
export const Carbon = makeThemeStory('carbon');
