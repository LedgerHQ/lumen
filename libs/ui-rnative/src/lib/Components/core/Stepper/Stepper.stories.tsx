import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives/Box';
import { Text } from '../../primitives/Text';
import { Stepper } from './Stepper';

const meta = {
  id: 'rnative-stepper',
  title: 'Core/Stepper',
  component: Stepper,
  parameters: {
    actions: { disable: true },
  },
  argTypes: {
    currentStep: { control: 'number' },
    totalSteps: { control: 'number' },
    appearance: { control: 'select', options: ['accent', 'success'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Base: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  render: (args) => <Stepper {...args} />,
};

export const AppearanceShowcase: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  render: () => (
    <Box lx={{ flexDirection: 'row', gap: 's32', alignItems: 'center' }}>
      <Box lx={{ alignItems: 'center', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Accent
        </Text>
        <Stepper currentStep={2} totalSteps={4} appearance='accent' />
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Success
        </Text>
        <Stepper currentStep={4} totalSteps={4} appearance='success' />
      </Box>
    </Box>
  ),
};

export const DisabledShowcase: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  render: () => (
    <Box lx={{ gap: 's32', alignItems: 'center' }}>
      <Box lx={{ alignItems: 'center', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Default (2/4)
        </Text>
        <Stepper currentStep={2} totalSteps={4} />
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Disabled (2/4)
        </Text>
        <Stepper currentStep={2} totalSteps={4} disabled />
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Unstarted (0/8)
        </Text>
        <Stepper currentStep={0} totalSteps={8} />
      </Box>
    </Box>
  ),
};

export const WithCustomLabel: Story = {
  args: {
    currentStep: 5,
    totalSteps: 5,
    label: '🎉',
  },
  render: (args) => <Stepper {...args} />,
};
