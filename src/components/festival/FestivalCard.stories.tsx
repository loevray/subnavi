import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FestivalCard from './FestivalCard';

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
    title: '코믹월드 SUMMER 2025',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: '일산 킨텍스 제1전시장',
    thumbnailSrc:
      'https://comicw.co.kr/data/item/1748337413/11_7J6E7Iuc7Ys7Iqk7YSw_6riw67O4.png',
  },
};

export const Truncated: Story = {
  args: {
    title: '가나다라마바사아자차카타파하 가나다라마바사아자차카타파하',
    dateRange: { start: '2025.07.19', end: '2025.07.20' },
    address: '여기서 저기로 가면 저기서 여기로 가고 여기서 저기로',
    thumbnailSrc: 'https://picsum.photos/600/400',
  },
};
