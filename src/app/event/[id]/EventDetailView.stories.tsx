import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventDetailView from './EventDetailView';
import { rscDecorator } from '../../../../.storybook/decorators';

const meta = {
  title: 'Event/EventDetailView',
  component: EventDetailView,
  decorators: [rscDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    event: {
      ageRating: '전체관람가',
      bookingLink:
        'https://docs.google.com/forms/d/e/1FAIpQLSdROzW9BYyCNLmJVw-8IB6KJHMQSzEnZ38DR8c6CnrTo7ARaA/viewform',
      description: null,
      endDatetime: '2025-06-28T00:00:00+00:00',
      eventRules: null,
      id: '7f12feb8-87fd-4fa4-9578-436ab1393f67',
      location: '서울 마포 상암, 제일라 아트홀',
      officialWebsite: 'https://www.anikure.com/',
      organizerContact: null,
      organizerName: '아니쿠레',
      participationFee: '28000원',
      posterImageUrl:
        'https://pbs.twimg.com/media/GsF7IvAWgAAcWho?format=jpg&name=large',
      regionId: 1,
      snsLinks: null,
      startDatetime: '2025-06-28T00:00:00+00:00',
      status: 'active',
      title: '아니쿠레 v11',
      categories: [
        {
          id: 4,
          name: '코스프레',
        },
        {
          id: 8,
          name: '장르무관',
        },
      ],
      region: '서울',
    },
  },
};
