import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta = {
  component: ProgressBar,
  id: 'react-progress-bar',
  title: 'Core/ProgressBar',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className='w-320'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    value: 40,
    appearance: 'base',
    'aria-label': 'Upload progress',
    label: 'Upload progress',
  },
};

export const ValueShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <div className='flex flex-col gap-16'>
      <ProgressBar value={0} aria-label='Empty' />
      <ProgressBar value={25} aria-label='A quarter' />
      <ProgressBar value={50} aria-label='Half' />
      <ProgressBar value={75} aria-label='Three quarters' />
      <ProgressBar value={100} aria-label='Complete' />
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <div className='flex flex-col gap-16'>
      <ProgressBar value={60} appearance='base' aria-label='base' />
      <ProgressBar value={60} appearance='accent' aria-label='accent' />
      <ProgressBar value={60} appearance='success' aria-label='success' />
      <ProgressBar value={60} appearance='error' aria-label='error' />
      <ProgressBar value={60} appearance='warning' aria-label='warning' />
      <ProgressBar
        value={60}
        appearance='decorative-blue'
        aria-label='decorative-blue'
      />
      <ProgressBar
        value={60}
        appearance='decorative-pink'
        aria-label='decorative-pink'
      />
      <ProgressBar
        value={60}
        appearance='decorative-purple'
        aria-label='decorative-purple'
      />
      <ProgressBar
        value={60}
        appearance='decorative-green'
        aria-label='decorative-green'
      />
      <ProgressBar
        value={60}
        appearance='decorative-turquoise'
        aria-label='decorative-turquoise'
      />
      <ProgressBar
        value={60}
        appearance='decorative-yellow'
        aria-label='decorative-yellow'
      />
      <ProgressBar
        value={60}
        appearance='decorative-orange'
        aria-label='decorative-orange'
      />
      <ProgressBar
        value={60}
        appearance='decorative-red'
        aria-label='decorative-red'
      />
    </div>
  ),
};

export const WithLabel: Story = {
  render: () => <ProgressBar value={72} label='Syncing accounts' />,
};

export const LabelPositionShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-32'>
      <ProgressBar value={40} labelPosition='start-top' label='Start top' />
      <ProgressBar
        value={40}
        labelPosition='start-bottom'
        label='Start bottom'
      />
      <ProgressBar value={40} labelPosition='end-top' label='End top' />
      <ProgressBar value={40} labelPosition='end-bottom' label='End bottom' />
    </div>
  ),
};

export const WithRichLabel: Story = {
  render: () => (
    <ProgressBar
      value={33}
      appearance='accent'
      label={
        <>
          4 of <strong>12</strong> accounts
        </>
      }
    />
  ),
};
