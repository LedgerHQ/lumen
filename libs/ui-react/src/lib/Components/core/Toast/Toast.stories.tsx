import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
} from '../Select';
import { Toast } from './Toast';
import { ToastProvider } from './ToastProvider';
import type { ToastAppearance, ToastPosition } from './types';
import { useToast } from './useToast';

const meta = {
  component: Toast,
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
    action: { control: false },
    onClose: { control: false },
    ref: { control: false },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;

export const Base: Story = {
  args: {
    appearance: 'info',
    title: 'Your transaction was sent',
    onClose: () => {},
  },
  render: (args) => <Toast {...args} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <Toast
        appearance='info'
        title='Your transaction was sent'
        onClose={() => {}}
      />
      <Toast appearance='success' title='Payment done' onClose={() => {}} />
      <Toast appearance='warning' title='Low balance' onClose={() => {}} />
      <Toast appearance='error' title='Payment failed' onClose={() => {}} />
      <Toast loading title='Processing payment' onClose={() => {}} />
    </div>
  ),
};

export const WithAction: Story = {
  args: {
    appearance: 'error',
    title: 'Payment failed',
    action: { label: 'Retry', onAction: () => {} },
    onClose: () => {},
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
    onClose: () => {},
  },
  render: (args) => <Toast {...args} />,
};

const APPEARANCE_ITEMS = [
  { label: 'Info', value: 'info' },
  { label: 'Success', value: 'success' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
];

const POSITION_ITEMS = [
  { label: 'Top center', value: 'top-center' },
  { label: 'Bottom center', value: 'bottom-center' },
  { label: 'Top right', value: 'top-right' },
  { label: 'Bottom right', value: 'bottom-right' },
  { label: 'Top left', value: 'top-left' },
  { label: 'Bottom left', value: 'bottom-left' },
];

const PlaygroundControls = ({
  position,
  appearance,
  onAppearanceChange,
  onPositionChange,
}: {
  position: ToastPosition;
  appearance: ToastAppearance;
  onAppearanceChange: (appearance: ToastAppearance) => void;
  onPositionChange: (position: ToastPosition) => void;
}) => {
  const toast = useToast();

  return (
    <div className='flex w-256 flex-wrap gap-8'>
      <Select
        items={APPEARANCE_ITEMS}
        value={appearance}
        onValueChange={(value) =>
          onAppearanceChange((value ?? 'info') as ToastAppearance)
        }
      >
        <SelectTrigger />
        <SelectContent>
          <SelectList
            renderItem={(item) => (
              <SelectItem value={item.value}>{item.label}</SelectItem>
            )}
          />
        </SelectContent>
      </Select>
      <Select
        items={POSITION_ITEMS}
        value={position}
        onValueChange={(value) =>
          onPositionChange((value as ToastPosition) ?? 'bottom-right')
        }
      >
        <SelectTrigger />
        <SelectContent>
          <SelectList
            renderItem={(item) => (
              <SelectItem value={item.value}>{item.label}</SelectItem>
            )}
          />
        </SelectContent>
      </Select>
      <Button
        appearance='base'
        size='sm'
        onClick={() =>
          toast.notify({
            appearance,
            title: `${appearance[0].toUpperCase()}${appearance.slice(1)} toast`,
          })
        }
        isFull
      >
        Notify
      </Button>
    </div>
  );
};

export const WithProvider: Story = {
  render: () => {
    const [position, setPosition] = useState<ToastPosition>('bottom-right');
    const [appearance, setAppearance] = useState<ToastAppearance>('info');

    return (
      <ToastProvider
        position={position}
        maxItems={3}
        durations={{
          info: 3000,
          success: 3000,
          warning: 3000,
          error: 3000,
        }}
      >
        <PlaygroundControls
          position={position}
          appearance={appearance}
          onAppearanceChange={setAppearance}
          onPositionChange={setPosition}
        />
      </ToastProvider>
    );
  },
};

const UpdateDemo = () => {
  const toast = useToast();

  return (
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
};

export const WithUpdate: Story = {
  render: () => (
    <ToastProvider>
      <UpdateDemo />
    </ToastProvider>
  ),
};

const simulateSaveProfile = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 2000));

const PromiseDemo = () => {
  const toast = useToast();

  return (
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
};

export const WithPromise: Story = {
  render: () => (
    <ToastProvider>
      <PromiseDemo />
    </ToastProvider>
  ),
};
