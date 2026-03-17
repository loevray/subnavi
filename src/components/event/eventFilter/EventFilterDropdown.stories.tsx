import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CalendarDays, MapPin } from 'lucide-react';
import EventFilterDropdown from './EventFilterDropdown';

const LOCATION_OPTIONS = [
  { value: 'seoul', label: '서울' },
  { value: 'gyeonggi', label: '경기' },
  { value: 'busan', label: '부산' },
];

const meta = {
  title: 'Event/EventFilterDropdown',
  component: EventFilterDropdown,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', background: '#f5f3ff', borderRadius: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof EventFilterDropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Placeholder: Story = {
  args: {
    icon: <CalendarDays className="h-4 w-4" />,
    placeholder: '날짜',
    options: [
      { value: 'today', label: '오늘' },
      { value: 'weekend', label: '이번 주말' },
      { value: 'month', label: '이번 달' },
    ],
  },
};

export const Selected: Story = {
  args: {
    icon: <MapPin className="h-4 w-4" />,
    placeholder: '위치',
    value: 'seoul',
    options: LOCATION_OPTIONS,
  },
};
