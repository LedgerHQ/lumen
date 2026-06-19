import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box, Text } from '../Utility';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
  parameters: {
    layout: 'fullscreen',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The controlled checked state of the switch',
    },
    defaultChecked: {
      control: 'boolean',
      description: 'The default checked state (uncontrolled)',
    },
    disabled: {
      control: 'boolean',
      description: 'If true, the switch is disabled',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback function called when the checked state changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The base switch in its normal state.
 */
export const Base: Story = {
  render: (args) => {
    return (
      <Box
        style={{
          flex: 1,
          minHeight: 96,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Box style={{ width: '100%', maxWidth: 400 }}>
          <Switch {...args} />
        </Box>
      </Box>
    );
  },
};

/**
 * Interactive example showing all states.
 */
export const AllStates: Story = {
  render: () => (
    <Box
      style={{
        flex: 1,
        minHeight: 96,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Box style={{ width: '100%', maxWidth: 400 }}>
        <Box
          style={{
            flexDirection: 'row',
            gap: 48,
          }}
        >
          <Box style={{ gap: 16 }}>
            <Text typography='heading5'>Enabled</Text>
            <Box style={{ gap: 8 }}>
              <Switch defaultChecked={false} />
              <Switch aria-labelledby='' defaultChecked />
            </Box>
          </Box>
          <Box style={{ gap: 16 }}>
            <Text typography='heading5'>Disabled</Text>
            <Box style={{ gap: 8 }}>
              <Switch disabled defaultChecked={false} />
              <Switch disabled defaultChecked />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  ),
};
