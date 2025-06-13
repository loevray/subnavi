import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventPagination from './EventPagination';

const meta = {
  title: 'Event/EventPagination',
  component: EventPagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventPagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    totalItems: 63,
    maxVisiblePages: 5,
    itemsPerPage: 10,
  },
};
