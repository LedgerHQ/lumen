import { toast } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box } from '../../primitives';
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
  id: 'rnative-toast',
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
    insets: { control: 'object' },
  },
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Base: Story = {
  args: {
    position: 'bottom',
    maxItems: 1,
    durations: {
      info: 3000,
      success: 3000,
      warning: 3000,
      error: 3000,
    },
  },
  render: (args) => (
    <SafeAreaProvider>
      <Toaster {...args} />
      <Box lx={{ flexDirection: 'column', alignItems: 'center', gap: 's8' }}>
        <Button
          appearance='base'
          size='sm'
          onPress={() => toast.info({ title: 'Your transaction was sent' })}
        >
          Show Info
        </Button>
        <Button
          appearance='base'
          size='sm'
          onPress={() => toast.success({ title: 'Payment done' })}
        >
          Show Success
        </Button>
        <Button
          appearance='base'
          size='sm'
          onPress={() => toast.warning({ title: 'Low balance' })}
        >
          Show Warning
        </Button>
        <Button
          appearance='base'
          size='sm'
          onPress={() => toast.error({ title: 'Payment failed' })}
        >
          Show Error
        </Button>
        <Button
          appearance='base'
          size='sm'
          onPress={() => toast.loading({ title: 'Processing payment' })}
        >
          Show Loading
        </Button>
        <Button appearance='base' size='sm' onPress={showRandomToast}>
          Show Random
        </Button>
      </Box>
    </SafeAreaProvider>
  ),
};

export const WithAction: Story = {
  render: () => (
    <SafeAreaProvider>
      <Toaster />
      <Button
        appearance='base'
        onPress={() =>
          toast.error({
            title: 'Payment failed',
            action: { label: 'Retry', onAction: () => {} },
          })
        }
      >
        Show actionable toast
      </Button>
    </SafeAreaProvider>
  ),
};

export const WithDuration: Story = {
  render: () => (
    <SafeAreaProvider>
      <Toaster />
      <Button
        appearance='base'
        onPress={() => toast.success({ title: 'Payment done' })}
      >
        Show auto-dismissing toast
      </Button>
    </SafeAreaProvider>
  ),
};

const DismissDemo = () => {
  const [id, setId] = useState<string | null>(null);

  return (
    <Button
      appearance='base'
      onPress={() => {
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
    <SafeAreaProvider>
      <Toaster />
      <DismissDemo />
    </SafeAreaProvider>
  ),
};

const UpdateDemo = () => (
  <Button
    appearance='base'
    onPress={() => {
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
    <SafeAreaProvider>
      <Toaster />
      <UpdateDemo />
    </SafeAreaProvider>
  ),
};

const simulateSaveProfile = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 2000));

const PromiseDemo = () => (
  <Button
    appearance='base'
    onPress={() =>
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
    <SafeAreaProvider>
      <Toaster />
      <PromiseDemo />
    </SafeAreaProvider>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8', width: 'sMd' }}>
      <Toast appearance='info' title='Your transaction was sent' />
      <Toast appearance='success' title='Payment done' />
      <Toast appearance='warning' title='Low balance' />
      <Toast
        appearance='error'
        title='Payment failed'
        action={{ label: 'Retry', onAction: () => {} }}
      />
      <Toast loading title='Processing payment' />
    </Box>
  ),
};
