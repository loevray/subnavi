import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import type { EventDetailResponse } from '@/dto/event/event-detail.dto';
import { Constants } from '../../../../database.types';
import { rscDecorator } from '../../../../.storybook/decorators';
import EventDetailView from './EventDetailView';

const meta = {
  title: 'Event/EventDetailView',
  component: EventDetailView,
  decorators: [
    rscDecorator,
    (Story) => (
      <div style={{ width: 'min(100vw - 32px, 1320px)', background: '#f6f4fb', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EventDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

const detailEventStoryData: EventDetailResponse = {
  ageRating: Constants.public.Enums.age_rating[0],
  bookingLink: 'https://example.com/tickets',
  description:
    '도심의 야경과 전자음악, 디지털 아트가 한 공간에서 어우러지는 나이트 이벤트입니다. 몰입형 사운드와 감각적인 비주얼 연출, 그리고 다양한 커뮤니티 프로그램을 함께 즐길 수 있습니다.',
  endDatetime: '2025-10-12T14:00:00+00:00',
  eventRules:
    '입장 시 신분증을 지참해 주세요. 외부 음식 반입은 제한되며, 현장 상황에 따라 프로그램 순서는 변경될 수 있습니다.',
  id: '7f12feb8-87fd-4fa4-9578-436ab1393f67',
  location: '서울 성동구 성수이로 18길 39, Warehouse District Hall',
  officialWebsite: 'https://example.com',
  organizerContact: 'hello@synthwavescollective.com',
  organizerName: 'SynthWaves Collective',
  participationFee: '₩25,000 - ₩45,000',
  posterImageUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1600&q=80',
  regionId: 1,
  snsLinks: {
    instagram: 'https://instagram.com',
    x: 'https://x.com',
  },
  startDatetime: '2025-10-12T10:00:00+00:00',
  status: Constants.public.Enums.event_status[0],
  title: 'Neo-Tokyo Synthwave Night',
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

export const Default: Story = {
  args: {
    event: detailEventStoryData,
  },
};

export const Mobile: Story = {
  args: {
    event: detailEventStoryData,
  },
  decorators: [
    rscDecorator,
    (Story) => (
      <div style={{ width: '390px', margin: '0 auto', background: '#f6f4fb', padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
};
