import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import EventTag from './EventTag';

const meta = {
  title: 'Event/EventTag',
  component: EventTag,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '24px', background: '#0f172a', borderRadius: '20px' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'tag label',
    },
    color: {
      control: 'text',
      description: 'tailwind background class',
    },
    className: {
      control: 'text',
      description: 'extra classes merged on top of the base tag styles',
    },
  },
} satisfies Meta<typeof EventTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SolidColor: Story = {
  args: {
    label: '공연',
    color: 'bg-rose-500',
  },
};

export const GradientColor: Story = {
  args: {
    label: '페스티벌',
    color: 'bg-gradient-to-r from-indigo-500/75 to-purple-500/75',
  },
};

export const WithExtraClassName: Story = {
  args: {
    label: '테크노',
    color: 'bg-cyan-500/75',
    className: 'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm',
  },
};

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <EventTag label="공연" color="bg-rose-500" />
      <EventTag label="전시" color="bg-emerald-500" />
      <EventTag label="게임" color="bg-amber-500 text-slate-950" />
      <EventTag
        label="테크노"
        color="bg-gradient-to-r from-indigo-500/75 to-purple-500/75"
        className="rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm"
      />
    </div>
  ),
};
