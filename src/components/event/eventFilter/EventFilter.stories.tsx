import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventFilter from './EventFilter';

const meta = {
  title: 'Event/EventFilter',
  component: EventFilter,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(100vw - 32px, 760px)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof EventFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: [
      { id: 1, name: '공연' },
      { id: 2, name: '전시' },
      { id: 3, name: '게임' },
      { id: 4, name: '페스티벌' },
    ],
  },
};
