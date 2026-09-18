import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Box } from '../../primitives';
import { Button } from '../Button';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import type { ToastPosition } from './types';
import { useToast } from './useToast';

const meta = {
  component: Toast,
  id: 'rnative-toast',
  title: 'Core/Toast',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
  argTypes: {
    action: { control: false },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

export const Base: Story = {
  args: {
    appearance: 'info',
    title: 'Your transaction was sent',
  },
  render: (args) => <Toast {...args} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's8' }}>
      <Toast appearance='info' title='Your transaction was sent' />
      <Toast appearance='success' title='Payment done' />
      <Toast appearance='warning' title='Low balance' />
      <Toast appearance='error' title='Payment failed' />
      <Toast loading title='Processing payment' />
    </Box>
  ),
};

export const WithAction: Story = {
  args: {
    appearance: 'error',
    title: 'Payment failed',
    action: { label: 'Retry', onAction: () => {} },
  },
  render: (args) => <Toast {...args} />,
};

export const LoadingShowcase: Story = {
  args: {
    loading: true,
    title: 'Processing payment',
    action: { label: 'Cancel', onAction: () => {} },
  },
  render: (args) => <Toast {...args} />,
};

export const ResponsivenessShowcase: Story = {
  args: {
    appearance: 'success',
    title:
      'This is a very long toast message that will be truncated on a single line',
    action: { label: 'Undo', onAction: () => {} },
  },
  render: (args) => <Toast {...args} />,
};

const PlaygroundControls = ({
  position,
  onPositionChange,
}: {
  position: ToastPosition;
  onPositionChange: (position: ToastPosition) => void;
}) => {
  const toast = useToast();

  return (
    <Box lx={{ flexDirection: 'row', gap: 's8', flexWrap: 'wrap' }}>
      <Button
        appearance={position === 'top' ? 'base' : 'no-background'}
        size='sm'
        onPress={() => onPositionChange('top')}
      >
        Top
      </Button>
      <Button
        appearance={position === 'bottom' ? 'base' : 'no-background'}
        size='sm'
        onPress={() => onPositionChange('bottom')}
      >
        Bottom
      </Button>
      <Button
        appearance='base'
        size='sm'
        onPress={() => toast.notify({ title: 'A toast, swipe to dismiss' })}
      >
        Notify
      </Button>
    </Box>
  );
};

export const WithProvider: Story = {
  render: () => {
    const [position, setPosition] = useState<ToastPosition>('bottom');

    return (
      <SafeAreaProvider>
        <ToastProvider position={position} durations={{ info: 3000 }}>
          <PlaygroundControls
            position={position}
            onPositionChange={setPosition}
          />
        </ToastProvider>
      </SafeAreaProvider>
    );
  },
};

const UpdateDemo = () => {
  const toast = useToast();

  return (
    <Button
      appearance='base'
      size='sm'
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
};

export const WithUpdate: Story = {
  render: () => (
    <SafeAreaProvider>
      <ToastProvider>
        <UpdateDemo />
      </ToastProvider>
    </SafeAreaProvider>
  ),
};

const simulateSaveProfile = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 2000));

const PromiseDemo = () => {
  const toast = useToast();

  return (
    <Button
      appearance='base'
      size='sm'
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
};

export const WithPromise: Story = {
  render: () => (
    <SafeAreaProvider>
      <ToastProvider>
        <PromiseDemo />
      </ToastProvider>
    </SafeAreaProvider>
  ),
};
