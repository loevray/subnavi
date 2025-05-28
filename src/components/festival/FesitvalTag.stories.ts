import type { Meta, StoryObj } from '@storybook/react';

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
    festivalType: {
      control: 'text',
      description: 'all | comic | game',
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof FestivalTag>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {
    festivalType: 'comic',
  },
};
