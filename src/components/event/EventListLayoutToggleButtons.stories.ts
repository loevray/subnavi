import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventListLayoutToggleButtons from './EventListLayoutToggleButtons';

const meta = {
  title: 'Event/EventListLayoutToggleButtons',
  component: EventListLayoutToggleButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventListLayoutToggleButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
