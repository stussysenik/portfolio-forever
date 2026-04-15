import type { Meta, StoryObj } from '@storybook/svelte';
import AsciiDonut from './AsciiDonut.svelte';

const meta = {
	title: 'Components/AsciiDonut',
	component: AsciiDonut,
	parameters: { layout: 'centered' },
} satisfies Meta<typeof AsciiDonut>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DraggableDemo: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Click and drag the donut to rotate. Release to see inertia and automatic resume.',
			},
		},
	},
};
