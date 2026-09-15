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
import { Snackbar } from './Snackbar';
import { SnackbarProvider } from './SnackbarProvider';
import type { SnackbarAppearance, SnackbarPosition } from './types';
import { useSnackbar } from './useSnackbar';

const meta = {
  component: Snackbar,
  id: 'react-snackbar',
  title: 'Core/Snackbar',
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
} satisfies Meta<typeof Snackbar>;

export default meta;
type Story = StoryObj<typeof Snackbar>;

export const Base: Story = {
  args: {
    appearance: 'info',
    title: 'Your transaction was sent',
    onClose: () => {},
  },
  render: (args) => <Snackbar {...args} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <Snackbar
        appearance='info'
        title='Your transaction was sent'
        onClose={() => {}}
      />
      <Snackbar appearance='success' title='Payment done' onClose={() => {}} />
      <Snackbar appearance='warning' title='Low balance' onClose={() => {}} />
      <Snackbar appearance='error' title='Payment failed' onClose={() => {}} />
      <Snackbar loading title='Processing payment' onClose={() => {}} />
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
  render: (args) => <Snackbar {...args} />,
};

export const LoadingShowcase: Story = {
  args: {
    loading: true,
    title: 'Processing payment',
    action: { label: 'Cancel', onAction: () => {} },
  },
  render: (args) => <Snackbar {...args} />,
};

export const ResponsivenessShowcase: Story = {
  args: {
    appearance: 'success',
    title:
      'This is a very long snackbar message that will be truncated on a single line',
    action: { label: 'Undo', onAction: () => {} },
    onClose: () => {},
  },
  render: (args) => <Snackbar {...args} />,
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
  position: SnackbarPosition;
  appearance: SnackbarAppearance;
  onAppearanceChange: (appearance: SnackbarAppearance) => void;
  onPositionChange: (position: SnackbarPosition) => void;
}) => {
  const snackbar = useSnackbar();

  return (
    <div className='flex w-256 flex-wrap gap-8'>
      <Select
        items={APPEARANCE_ITEMS}
        value={appearance}
        onValueChange={(value) =>
          onAppearanceChange((value ?? 'info') as SnackbarAppearance)
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
          onPositionChange((value as SnackbarPosition) ?? 'bottom-right')
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
          snackbar.notify({
            appearance,
            title: `${appearance[0].toUpperCase()}${appearance.slice(1)} snackbar`,
          })
        }
        isFull
      >
        Notify
      </Button>
    </div>
  );
};

export const WithTrigger: Story = {
  render: () => {
    const [position, setPosition] = useState<SnackbarPosition>('bottom-right');
    const [appearance, setAppearance] = useState<SnackbarAppearance>('info');

    return (
      <SnackbarProvider
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
      </SnackbarProvider>
    );
  },
};
