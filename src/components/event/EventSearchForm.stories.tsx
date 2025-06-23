import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventSearchForm from './EventSearchForm';

const meta = {
  title: 'Event/EventSearchForm',
  component: EventSearchForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof EventSearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
