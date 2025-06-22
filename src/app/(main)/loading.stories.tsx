import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Loading from './loading';

const meta = {
  title: 'Skeletons/MainPageSuspensed',
  component: Loading,

  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof Loading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
