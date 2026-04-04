import type { Meta, StoryObj } from '@storybook/svelte';
import Toast from './Toast.svelte';
import { toast } from '$lib/stores/toast';

const meta = {
	title: 'Components/Toast',
	component: Toast,
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
	play: () => { toast.success('Entry saved successfully'); },
};

export const Error: Story = {
	play: () => { toast.error('Failed to save entry'); },
};

export const Info: Story = {
	play: () => { toast.info('Changes will be published shortly'); },
};
