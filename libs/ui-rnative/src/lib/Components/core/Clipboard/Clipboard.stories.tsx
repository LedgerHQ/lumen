import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box } from '../../primitives';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { toast, Toaster } from '../Toast';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';
import type { ClipboardRenderProps } from './types';

const renderClipboardInput = ({
  value,
  handleCopy,
  Icon,
  statusLabel,
}: ClipboardRenderProps) => (
  <ClipboardInput
    label={value}
    icon={Icon}
    accessibilityLabel={`${value}, ${statusLabel}`}
    onPress={handleCopy}
  />
);

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
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof Clipboard>;

export default meta;
type Story = StoryObj<typeof Clipboard>;

export const Base: Story = {
  render: (args) => (
    <Clipboard
      {...args}
      render={({ value, handleCopy, Icon, statusLabel }) => (
        <ClipboardInput
          label={value}
          icon={Icon}
          accessibilityLabel={`${value}, ${statusLabel}`}
          onPress={handleCopy}
        />
      )}
    />
  ),
  args: {
    value: 'Label',
  },
};

export const CustomResetDelay: Story = {
  render: () => (
    <Clipboard
      value='Copied state lasts 1 second'
      resetDelay={1000}
      render={({ value, handleCopy, Icon, statusLabel }) => (
        <ClipboardInput
          label={value}
          icon={Icon}
          accessibilityLabel={`${value}, ${statusLabel}`}
          onPress={handleCopy}
        />
      )}
    />
  ),
};

export const WithToast: Story = {
  render: () => (
    <SafeAreaProvider>
      <Box lx={{ height: 's256', justifyContent: 'center' }}>
        <Clipboard
          value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
          onCopy={() => toast.info({ title: 'Copied to clipboard' })}
          render={({ value, handleCopy, Icon, statusLabel }) => (
            <ClipboardInput
              label={value}
              icon={Icon}
              accessibilityLabel={`${value}, ${statusLabel}`}
              onPress={handleCopy}
            />
          )}
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

export const Disabled: Story = {
  render: () => (
    <Clipboard
      value='Label'
      disabled
      render={({ value, handleCopy, Icon, statusLabel }) => (
        <ClipboardInput
          label={value}
          icon={Icon}
          accessibilityLabel={`${value}, ${statusLabel}`}
          onPress={handleCopy}
        />
      )}
    />
  ),
};

export const ResponsivenessShowcase: Story = {
  render: () => (
    <Box lx={{ gap: 's8' }}>
      <Clipboard
        value='A long label that wraps onto several lines when it does not fit on one'
        render={renderClipboardInput}
      />
      <Clipboard
        value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
        render={renderClipboardInput}
      />
    </Box>
  ),
};
