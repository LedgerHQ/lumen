import { toast } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Toast } from './Toast';
import { Toaster } from './Toaster';
import type { ToastAppearance } from './types';

const RANDOM_APPEARANCES: ToastAppearance[] = [
  'info',
  'success',
  'warning',
  'error',
];

const RANDOM_TITLES = [
  'Payment done',
  'Report ready for review in 30 minutes',
  'This is a very long toast message that wraps over up to five lines without an action',
  'This is a very long toast message that wraps over up to five lines',
];

const RANDOM_ACTION_LABELS = [
  'Open',
  'Undo',
  'Retry',
  'Download the report',
  'Retry the upload',
];

const pickRandom = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

const showRandomToast = (): void => {
  toast.notify({
    appearance: pickRandom(RANDOM_APPEARANCES),
    title: pickRandom(RANDOM_TITLES),
    action:
      Math.random() > 0.5
        ? { label: pickRandom(RANDOM_ACTION_LABELS), onAction: () => {} }
        : undefined,
  });
};

const meta = {
  component: Toaster,
  id: 'react-toast',
  title: 'Core/Toast',
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
  argTypes: {
    durations: { control: 'object' },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Base: Story = {
  args: {
    position: 'bottom-right',
    maxItems: 3,
    durations: {
      info: 3000,
      success: 3000,
      warning: 3000,
      error: 3000,
    },
  },
  render: (args) => (
    <>
      <Toaster {...args} />
      <div className='flex w-256 flex-col items-center gap-8'>
        <Button
          appearance='base'
          size='sm'
          onClick={() => toast.info({ title: 'Your transaction was sent' })}
        >
          Show Info
        </Button>
        <Button
          appearance='base'
          size='sm'
          onClick={() => toast.success({ title: 'Payment done' })}
        >
          Show Success
        </Button>
        <Button
          appearance='base'
          size='sm'
          onClick={() => toast.warning({ title: 'Low balance' })}
        >
          Show Warning
        </Button>
        <Button
          appearance='base'
          size='sm'
          onClick={() => toast.error({ title: 'Payment failed' })}
        >
          Show Error
        </Button>
        <Button
          appearance='base'
          size='sm'
          onClick={() => toast.loading({ title: 'Processing payment' })}
        >
          Show Loading
        </Button>
        <Button appearance='base' size='sm' onClick={showRandomToast}>
          Show Random
        </Button>
      </div>
    </>
  ),
};

export const WithAction: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        appearance='base'
        onClick={() =>
          toast.error({
            title: 'Payment failed',
            action: { label: 'Retry', onAction: () => {} },
          })
        }
      >
        Show actionable toast
      </Button>
    </>
  ),
};

export const WithDuration: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        appearance='base'
        onClick={() => toast.success({ title: 'Payment done' })}
      >
        Show auto-dismissing toast
      </Button>
    </>
  ),
};

const DismissDemo = () => {
  const [id, setId] = useState<string | null>(null);

  return (
    <Button
      appearance='base'
      onClick={() => {
        if (id === null) {
          const next = toast.error({ title: 'Unable to save' });
          setId(next.id);
          return;
        }
        toast.dismiss(id);
        setId(null);
      }}
    >
      {id === null ? 'Show toast' : 'Hide toast'}
    </Button>
  );
};

export const WithDismiss: Story = {
  render: () => (
    <>
      <Toaster />
      <DismissDemo />
    </>
  ),
};

const UpdateDemo = () => (
  <Button
    appearance='base'
    onClick={() => {
      const { id } = toast.loading({ title: 'Uploading…' });
      setTimeout(() => {
        toast.update(id, {
          appearance: 'success',
          loading: false,
          title: 'Upload complete',
        });
      }, 2000);
    }}
  >
    Upload file
  </Button>
);

export const WithUpdate: Story = {
  render: () => (
    <>
      <Toaster />
      <UpdateDemo />
    </>
  ),
};

const simulateSaveProfile = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 2000));

const PromiseDemo = () => (
  <Button
    appearance='base'
    onClick={() =>
      toast.promise(simulateSaveProfile(), {
        loading: { title: 'Saving…' },
        success: { title: 'Profile saved' },
        error: { title: 'Could not save' },
      })
    }
  >
    Save profile
  </Button>
);

export const WithPromise: Story = {
  render: () => (
    <>
      <Toaster />
      <PromiseDemo />
    </>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex w-400 flex-col gap-8'>
      <Toast
        appearance='info'
        title='Your transaction was sent'
        onClose={() => {}}
      />
      <Toast appearance='success' title='Payment done' onClose={() => {}} />
      <Toast appearance='warning' title='Low balance' onClose={() => {}} />
      <Toast
        appearance='error'
        title='Payment failed'
        action={{ label: 'Retry', onAction: () => {} }}
        onClose={() => {}}
      />
      <Toast loading title='Processing payment' onClose={() => {}} />
    </div>
  ),
};
