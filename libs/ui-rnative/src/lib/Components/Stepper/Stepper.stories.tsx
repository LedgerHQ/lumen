import { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility/Box';
import { Text } from '../Utility/Text';
import { Stepper } from './Stepper';

const meta: Meta<typeof Stepper> = {
  title: 'Communication/Stepper',
  component: Stepper,
  parameters: {
    actions: { disable: true },
  },
  argTypes: {
    currentStep: { control: 'number' },
    totalSteps: { control: 'number' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Stepper>;

export const Base: Story = {
  args: {
    currentStep: 2,
    totalSteps: 4,
  },
  render: (args) => <Stepper {...args} />,
};

export const DisabledShowcase: Story = {
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
          Unstarted (0/9)
        </Text>
        <Stepper currentStep={0} totalSteps={9} />
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
