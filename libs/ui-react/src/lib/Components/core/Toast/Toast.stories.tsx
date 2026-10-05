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

const meta = {
  component: Toaster,
  id: 'react-toast',
  title: 'Core/Toast',
  subcomponents: { Toast },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      story: { inline: false, height: '448px' },
      source: {
        language: 'tsx',
        format: true,
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
  },
  render: (args) => (
    <>
      <Toaster {...args} />
      <Button
        appearance='base'
        onClick={() =>
          toast.notify({
            appearance: 'success',
            title: 'Payment done',
            duration: 5000,
            dismissible: true,
            action: { label: 'View', onAction: () => {} },
          })
        }
      >
        Show toast
      </Button>
    </>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <>
      <Toaster />
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
        <Button
          appearance='base'
          size='sm'
          onClick={() =>
            toast.notify({
              appearance: pickRandom(RANDOM_APPEARANCES),
              title: pickRandom(RANDOM_TITLES),
              action:
                Math.random() > 0.5
                  ? {
                      label: pickRandom(RANDOM_ACTION_LABELS),
                      onAction: () => {},
                    }
                  : undefined,
            })
          }
        >
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

export const WithDurations: Story = {
  render: () => (
    <>
      <Toaster durations={{ success: 3000 }} />
      <div className='flex flex-col items-center gap-8'>
        <Button
          appearance='base'
          onClick={() => toast.success({ title: 'Payment done' })}
        >
          Show success
        </Button>
        <Button
          appearance='base'
          onClick={() => toast.warning({ title: 'Low balance', duration: 0 })}
        >
          Show persistent warning
        </Button>
      </div>
    </>
  ),
};

export const WithInsets: Story = {
  parameters: {
    docs: { story: { inline: false, height: '448px' } },
  },
  render: () => (
    <>
      <Toaster insets={{ bottom: 112 }} />
      <Button
        appearance='base'
        onClick={() => toast.success({ title: 'Toast with insets' })}
      >
        Show toast
      </Button>
    </>
  ),
};

export const WithDismiss: Story = {
  render: () => {
    const [id, setId] = useState<string | null>(null);

    return (
      <>
        <Toaster />
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
      </>
    );
  },
};

export const WithUpdate: Story = {
  render: () => (
    <>
      <Toaster />
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
    </>
  ),
};

export const WithPromise: Story = {
  render: () => (
    <>
      <Toaster />
      <Button
        appearance='base'
        onClick={() =>
          toast.promise(
            new Promise<void>((resolve) => setTimeout(resolve, 2000)),
            {
              loading: { title: 'Saving…' },
              success: { title: 'Profile saved' },
              error: { title: 'Could not save' },
            },
          )
        }
      >
        Save profile
      </Button>
    </>
  ),
};
