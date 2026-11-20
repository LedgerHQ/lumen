import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { toast, Toaster } from '../Toast';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';

const meta = {
  id: 'react-clipboard',
  title: 'Core/Clipboard',
  component: Clipboard,
  subcomponents: { ClipboardInput },
  decorators: [
    (Story) => (
      <div className='w-320'>
        <Story />
      </div>
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
  parameters: {
    docs: { source: { type: 'dynamic' } },
  },
  args: {
    value: 'Label',
  },
};

export const CustomResetDelay: Story = {
  parameters: {
    docs: { source: { type: 'dynamic' } },
  },
  args: {
    value: 'Copied state lasts 1 second',
    resetAfterMs: 1000,
  },
};

export const WithToast: Story = {
  parameters: {
    docs: { story: { inline: false, height: '256px' } },
  },
  render: () => (
    <>
      <Clipboard
        value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        onCopy={() => toast.info({ title: 'Copied to clipboard' })}
      />
      <Toaster />
    </>
  ),
};

export const WithCustomRender: Story = {
  render: () => (
    <div className='flex items-center justify-center gap-16'>
      <Clipboard
        value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq'
        render={({ handleCopy, Icon, statusLabel }) => (
          <Button appearance='gray' size='sm' icon={Icon} onClick={handleCopy}>
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
            aria-label={statusLabel}
            onClick={handleCopy}
          />
        )}
      />
    </div>
  ),
};

export const ResponsivenessShowcase: Story = {
  parameters: {
    docs: { source: { type: 'dynamic' } },
  },
  render: () => (
    <div className='flex flex-col gap-8'>
      <Clipboard value='A long label that wraps onto several lines when it does not fit on one' />
      <Clipboard value='bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' />
    </div>
  ),
};
