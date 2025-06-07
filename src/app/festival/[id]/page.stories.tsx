import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FestivalDetail from '../[id]/page';
import { Suspense } from 'react';

const meta = {
  title: 'Festival/FestivalDetail',
  component: FestivalDetail,
  decorators: [
    (Story) => (
      <Suspense>
        <Story />
      </Suspense>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof FestivalDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    params: {
      id: '6',
    },
  },
};
