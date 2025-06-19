import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventDetailSkeleton from './loading';

const meta = {
  title: 'Skeletons/EventDetailSuspense',
  component: EventDetailSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventDetailSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
