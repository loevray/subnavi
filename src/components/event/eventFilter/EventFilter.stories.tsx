import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Constants } from '../../../../database.types';
import EventFilter from './EventFilter';

const meta = {
  title: 'Event/EventFilter',
  component: EventFilter,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'min(100vw - 32px, 760px)' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof EventFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    categories: [
      { id: 1, name: Constants.public.Enums.category_name[0] },
      { id: 2, name: Constants.public.Enums.category_name[1] },
      { id: 3, name: Constants.public.Enums.category_name[2] },
      { id: 4, name: Constants.public.Enums.category_name[7] },
    ],
  },
};
