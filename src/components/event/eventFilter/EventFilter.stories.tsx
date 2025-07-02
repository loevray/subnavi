import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventFilter from './EventFilter';

const meta = {
  title: 'Event/EventFilter',
  component: EventFilter,

  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: [
      { id: 1, name: '만화' },
      { id: 2, name: '웹툰' },
      { id: 3, name: '게임' },
      { id: 4, name: '코스프레' },
    ],
  },
};
