import { success } from '@ledgerhq/lumen-symbols/lotties/success';
import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../../core/Button';
import { LottieView } from './LottieView';

const meta = {
  id: 'react-lottieview',
  title: 'Core/LottieView',
  component: LottieView,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: { source: { language: 'tsx', format: true, type: 'code' } },
    chromatic: { disableSnapshot: true },
  },
} satisfies Meta<typeof LottieView>;

export default meta;
type Story = StoryObj<typeof LottieView>;

export const Base: Story = {
  parameters: {
    docs: { source: { type: 'dynamic' } },
  },
  args: {
    animation: success,
    loop: true,
    className: 'size-80',
  },
};

export const WithRef: Story = {
  render: () => {
    const ref = useRef<LottieViewRef>(null);
    const [status, setStatus] = useState<'playing' | 'paused' | 'stopped'>(
      'playing',
    );

    const togglePlayback = (): void => {
      if (status === 'playing') {
        ref.current?.pause();
        setStatus('paused');
      } else {
        // eslint-disable-next-line storybook/context-in-play-function -- LottieViewRef.play, not a story play function
        ref.current?.play();
        setStatus('playing');
      }
    };

    const stop = (): void => {
      ref.current?.stop();
      setStatus('stopped');
    };

    const toggleLabel = {
      playing: 'Pause',
      paused: 'Resume',
      stopped: 'Start',
    }[status];

    return (
      <div className='flex flex-col items-center gap-16'>
        <LottieView ref={ref} animation={success} loop className='size-80' />
        <div className='flex gap-8'>
          <Button size='sm' onClick={togglePlayback}>
            {toggleLabel}
          </Button>
          <Button size='sm' onClick={stop}>
            Stop
          </Button>
        </div>
      </div>
    );
  },
};
