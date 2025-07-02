import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventList from './EventList';
import { EventListResponse } from '@/dto/event/event-list.dto';

const DUMMY_EVENT_LIST_DATA: EventListResponse['events'] = [
  {
    id: '909149e8-d5d1-4ead-a108-b045ac5847e5',
    title: 'ILLUSTAR FES 8 (일러스타 페스 8)',
    posterImageUrl:
      'https://i.namu.wiki/i/olPEGB1nC71wROG3xdr3nHrGhrmvsBEuLOmSXHp34zkZvS5Z9DmmdkJeo7hnD6OCIp4Ke0cj2BlqKELOqeAfKQ.webp',
    startDatetime: '2025-08-09T01:00:00+00:00',
    endDatetime: '2025-08-10T01:00:00+00:00',
    location: '부산 BEXCO 1전시장',
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
    region: '부산',
  },
  {
    id: '74a89fe6-25b7-4288-8606-006c0639cef1',
    title: '코믹월드 SUMMER 2025',
    posterImageUrl:
      'https://comicw.co.kr/data/item/1748337413/thumb-11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4_600x600.png',
    startDatetime: '2025-07-19T01:00:00+00:00',
    endDatetime: '2025-07-20T01:00:00+00:00',
    location: '일산 킨텍스 제1전시장',
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
    region: '경기',
  },
];

const meta = {
  title: 'Event/EventList',
  component: EventList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    events: {
      control: 'object',
    },
  },
} satisfies Meta<typeof EventList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    events: DUMMY_EVENT_LIST_DATA,
  },
};
