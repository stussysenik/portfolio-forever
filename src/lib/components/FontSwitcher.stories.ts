import type { Meta, StoryObj } from '@storybook/svelte';
import FontSwitcher from './FontSwitcher.svelte';

const meta = {
	title: 'Components/FontSwitcher',
	component: FontSwitcher,
	parameters: { layout: 'centered' },
} satisfies Meta<typeof FontSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const makeFontStory = (fontId: string): Story => ({
	decorators: [
		(Story) => {
			if (typeof document !== 'undefined') {
				document.documentElement.setAttribute('data-font', fontId);
			}
			return Story();
		},
	],
});

export const Inter = makeFontStory('inter');
export const Crimson = makeFontStory('crimson');
export const JetBrains = makeFontStory('jetbrains');
export const Fira = makeFontStory('fira');
export const Space = makeFontStory('space');
export const Rubik = makeFontStory('rubik');
export const IbmPlex = makeFontStory('ibm-plex');
