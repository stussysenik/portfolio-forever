import type { Meta, StoryObj } from '@storybook/svelte';
import Elevator from './Elevator.svelte';

const meta = {
	title: 'Components/Elevator',
	component: Elevator,
	parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Elevator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
