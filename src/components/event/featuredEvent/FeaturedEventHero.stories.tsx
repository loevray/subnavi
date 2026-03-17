import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Constants } from '../../../../database.types';

import type { EventListItem } from '@/dto/event/event-list.dto';
import FeaturedEventHero from './FeaturedEventHero';

const featuredEventStoryData: EventListItem = {
  id: '7f12feb8-87fd-4fa4-9578-436ab1393f67',
  title: 'Seoul Night Universe Festival 2026',
  startDatetime: '2026-04-18T09:00:00+00:00',
  endDatetime: '2026-04-19T13:00:00+00:00',
  location: '서울 성수 Warehouse District Hall',
  posterImageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1600&q=80',
  ageRating: Constants.public.Enums.age_rating[0],
  categories: [
    {
      id: 4,
      name: Constants.public.Enums.category_name[7],
    },
    {
      id: 8,
      name: Constants.public.Enums.category_name[6],
    },
  ],
  region: Constants.public.Enums.region_name[0],
};

const meta = {
  title: 'Event/FeaturedEventHero',
  component: FeaturedEventHero,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(100vw - 32px, 1320px)', margin: '0 auto', padding: '24px', background: '#f8fafc' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof FeaturedEventHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: featuredEventStoryData,
  },
};

export const Mobile: Story = {
  args: {
    event: featuredEventStoryData,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '390px', margin: '0 auto', padding: '16px', background: '#f8fafc' }}>
        <Story />
      </div>
    ),
  ],
};
