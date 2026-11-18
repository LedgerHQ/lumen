import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box } from '../../primitives';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { toast, Toaster } from '../Toast';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';

const meta = {
  id: 'rnative-clipboard',
  title: 'Core/Clipboard',
  component: Clipboard,
  subcomponents: { ClipboardInput },
  decorators: [
    (Story) => (
      <Box lx={{ width: 's320' }}>
        <Story />
      </Box>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof Clipboard>;

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Base: Story = {
  render: (args) => <Clipboard {...args} />,
  args: {
    value: 'Label',
  },
};

export const CustomResetDelay: Story = {
  render: (args) => <Clipboard {...args} />,
  args: {
    value: 'Copied state lasts 1 second',
    resetAfterMs: 1000,
  },
};

export const WithToast: Story = {
  render: () => (
    <SafeAreaProvider>
      <Box lx={{ height: 's256', justifyContent: 'center' }}>
        <Clipboard
          value='Copy'
          onCopy={() => toast.info({ title: 'Copied to clipboard' })}
        />
        <Toaster />
      </Box>
    </SafeAreaProvider>
  ),
};

export const WithCustomRender: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 's16',
      }}
    >
      <Clipboard
        value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
        render={({ handleCopy, Icon, statusLabel }) => (
          <Button appearance='gray' size='sm' icon={Icon} onPress={handleCopy}>
            {statusLabel}
          </Button>
        )}
      />
      <Clipboard
        value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
        render={({ handleCopy, Icon, statusLabel }) => (
          <IconButton
            appearance='gray'
            icon={Icon}
            accessibilityLabel={statusLabel}
            onPress={handleCopy}
          />
        )}
      />
    </Box>
  ),
};

export const ResponsivenessShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's8' }}>
      <Clipboard value='A long label that wraps onto several lines when it does not fit on one' />
      <Clipboard value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' />
    </Box>
  ),
};
