import type { LottieViewRef } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { Button } from '../Button';
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
    animation: {
      light: 'lotties/lottie-success.lottie',
      dark: 'lotties/lottie-success.lottie',
    },
    loop: true,
    className: 'size-80',
  },
};

export const WithRef: Story = {
  render: () => {
    const ref = useRef<LottieViewRef>(null);

    return (
      <div className='flex flex-col items-center gap-16'>
        <LottieView
          ref={ref}
          animation='lotties/lottie-loading.lottie'
          autoPlay={false}
          loop
          className='size-80'
        />
        <div className='flex gap-8'>
          {/* eslint-disable-next-line storybook/context-in-play-function -- LottieViewRef.play, not a story play function */}
          <Button size='sm' onClick={() => ref.current?.play()}>
            Play
          </Button>
          <Button size='sm' onClick={() => ref.current?.pause()}>
            Pause
          </Button>
          <Button size='sm' onClick={() => ref.current?.stop()}>
            Stop
          </Button>
        </div>
      </div>
    );
  },
};
