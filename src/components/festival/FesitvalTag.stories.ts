import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import FestivalTag from './FestivalTag';

const meta = {
  title: 'Festival/FestivalTag',
  component: FestivalTag,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    label: {
      control: 'text',
      description: 'tag label',
    },
    color: {
      control: 'text',
      description: 'tailwind bg color like `bg-red-500`',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof FestivalTag>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Comic: Story = {
  args: {
    label: '만화',
    color: 'bg-red-500',
  },
};

export const Game: Story = {
  args: {
    label: '게임',
    color: 'bg-blue-500',
  },
};
