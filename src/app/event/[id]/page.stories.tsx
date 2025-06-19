import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventDetail from './page';
import { rscDecorator } from '../../../../.storybook/decorators';

const meta = {
  title: 'Event/EventDetail',
  component: EventDetail,
  decorators: [rscDecorator],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    params: Promise.resolve({
      id: '74a89fe6-25b7-4288-8606-006c0639cef1',
    }),
  },
};
