import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FestivalCard, { DUMMY_FESTIVAL_CARD_DATA } from './FestivalCard';

const meta = {
  title: 'Festival/FestivalCard',
  component: FestivalCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '1000px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title: {
      control: 'text',
      description: 'festival title',
    },
    thumbnailSrc: {
      control: 'text',
      description: 'festival thumbnail image URL',
    },
    dateRange: {
      description: 'festival start date, end date',
      control: 'object',
    },
    address: {
      control: 'text',
      description: 'festival address',
    },
  },
} satisfies Meta<typeof FestivalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ...DUMMY_FESTIVAL_CARD_DATA[0],
  },
};

export const Truncated: Story = {
  args: {
    ...DUMMY_FESTIVAL_CARD_DATA[1], //long text
  },
};
