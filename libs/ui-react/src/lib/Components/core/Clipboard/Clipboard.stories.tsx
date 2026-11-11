import type { Meta, StoryObj } from '@storybook/react-vite';
import { toast, Toaster } from '../Toast';
import { Clipboard } from './Clipboard';

const meta = {
  id: 'react-clipboard',
  title: 'Core/Clipboard',
  component: Clipboard,
  decorators: [
    (Story) => (
      <div className='w-256'>
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

export const WithToast: Story = {
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
