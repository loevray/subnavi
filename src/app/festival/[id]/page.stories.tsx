import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import FestivalDetail from '../[id]/page';
import { rscDecorator } from '../../../../.storybook/decorators';

const meta = {
  title: 'Festival/FestivalDetail',
  component: FestivalDetail,
  decorators: [rscDecorator],
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
