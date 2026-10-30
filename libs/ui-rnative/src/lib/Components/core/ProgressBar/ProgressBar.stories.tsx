import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { ProgressBar } from './ProgressBar';

const meta = {
  id: 'rnative-progress-bar',
  title: 'Core/ProgressBar',
  component: ProgressBar,
  parameters: {
    docs: { source: { language: 'tsx', format: true, type: 'code' } },
    actions: { disable: true },
  },
  decorators: [
    (Story) => (
      <Box lx={{ width: 's320' }}>
        <Story />
      </Box>
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
    accessibilityLabel: 'Upload progress',
  },
  render: (args) => <ProgressBar {...args} />,
};

export const ValueShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's16' }}>
      <ProgressBar value={0} accessibilityLabel='Empty' />
      <ProgressBar value={25} accessibilityLabel='A quarter' />
      <ProgressBar value={50} accessibilityLabel='Half' />
      <ProgressBar value={75} accessibilityLabel='Three quarters' />
      <ProgressBar value={100} accessibilityLabel='Complete' />
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's16' }}>
      <ProgressBar value={60} appearance='base' accessibilityLabel='base' />
      <ProgressBar value={60} appearance='accent' accessibilityLabel='accent' />
      <ProgressBar
        value={60}
        appearance='success'
        accessibilityLabel='success'
      />
      <ProgressBar value={60} appearance='error' accessibilityLabel='error' />
      <ProgressBar
        value={60}
        appearance='warning'
        accessibilityLabel='warning'
      />
      <ProgressBar
        value={60}
        appearance='decorative-blue'
        accessibilityLabel='decorative-blue'
      />
      <ProgressBar
        value={60}
        appearance='decorative-pink'
        accessibilityLabel='decorative-pink'
      />
      <ProgressBar
        value={60}
        appearance='decorative-purple'
        accessibilityLabel='decorative-purple'
      />
      <ProgressBar
        value={60}
        appearance='decorative-green'
        accessibilityLabel='decorative-green'
      />
      <ProgressBar
        value={60}
        appearance='decorative-turquoise'
        accessibilityLabel='decorative-turquoise'
      />
      <ProgressBar
        value={60}
        appearance='decorative-yellow'
        accessibilityLabel='decorative-yellow'
      />
      <ProgressBar
        value={60}
        appearance='decorative-orange'
        accessibilityLabel='decorative-orange'
      />
      <ProgressBar
        value={60}
        appearance='decorative-red'
        accessibilityLabel='decorative-red'
      />
    </Box>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <ProgressBar
      value={72}
      accessibilityLabel='Sync progress'
      label='Syncing accounts'
    />
  ),
};

export const LabelPositionShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's32' }}>
      <ProgressBar
        value={40}
        accessibilityLabel='Start top'
        labelPosition='start-top'
        label='Start top'
      />
      <ProgressBar
        value={40}
        accessibilityLabel='Start bottom'
        labelPosition='start-bottom'
        label='Start bottom'
      />
      <ProgressBar
        value={40}
        accessibilityLabel='End top'
        labelPosition='end-top'
        label='End top'
      />
      <ProgressBar
        value={40}
        accessibilityLabel='End bottom'
        labelPosition='end-bottom'
        label='End bottom'
      />
    </Box>
  ),
};

export const WithRichLabel: Story = {
  render: () => (
    <ProgressBar
      value={33}
      appearance='accent'
      accessibilityLabel='Account sync progress'
      label={
        <>
          4 of <Text typography='body4SemiBold'>12</Text> accounts
        </>
      }
    />
  ),
};
