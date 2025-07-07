import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventCard, { DUMMY_EVENT_CARD_DATA } from './EventCard';

const meta = {
  title: 'Event/EventCard',
  component: EventCard,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '300px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'event title',
    },
    posterImageUrl: {
      control: 'text',
      description: 'event thumbnail image URL',
    },
    dateRange: {
      description: 'event start date, end date',
      control: 'object',
    },
    address: {
      control: 'text',
      description: 'event address',
    },
  },
} satisfies Meta<typeof EventCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...DUMMY_EVENT_CARD_DATA[0],
  },
};
