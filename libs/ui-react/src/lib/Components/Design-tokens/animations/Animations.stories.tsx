import { cn } from '@ledgerhq/lumen-utils-shared';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CursorTouch, Refresh } from '../../../Symbols';
import { Button } from '../../Button';
import { Tag } from '../../Tag';

const meta: Meta = {
  title: 'Foundations/Animations',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Interactive showcase of all available animations in the Ledger Design System.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

// Animation Demo Component
const AnimationDemo = ({
  animationClass,
  title,
  description,
}: {
  animationClass: string;
  title: string;
  description: string;
}) => {
  // Check if this is an "out" animation
  const isOutAnimation = animationClass.includes('out');

  // For out animations, start visible; for in animations, start hidden
  const [isVisible, setIsVisible] = useState(isOutAnimation);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTrigger = () => {
    if (isOutAnimation) {
      // For out animations, animate out and then hide
      setIsAnimating(true);
      setTimeout(() => {
        setIsVisible(false);
        setIsAnimating(false);
      }, 300); // Duration of the animation
    } else {
      // For in animations, start hidden and animate in
      setIsVisible(false);
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(true);
        setIsAnimating(true);
      }, 50);
    }
  };

  const handleReset = () => {
    setIsVisible(isOutAnimation);
    setIsAnimating(false);
  };

  return (
    <div className='flex flex-col items-center gap-16 rounded-sm p-24'>
      <div className='text-center'>
        <h3 className='mb-8 heading-4'>{title}</h3>
        <p className='mb-16 body-2 text-muted'>{description}</p>
        <Tag label={animationClass} appearance='gray' />
      </div>

      <div className='relative'>
        <button
          className='relative h-80 w-144 overflow-hidden rounded-sm border border-muted-subtle'
          onClick={handleTrigger}
        >
          {/* Placeholder for in animations when not visible */}
          {!isOutAnimation && !isVisible && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <CursorTouch className='text-muted' size={24} />
            </div>
          )}

          {/* Animated element */}
          <div
            className={cn(
              'absolute inset-0 flex items-center justify-center bg-accent body-2-semi-bold text-on-accent',
              // For out animations, show by default, hide when animating out
              isOutAnimation
                ? isVisible && !isAnimating
                  ? ''
                  : isAnimating
                    ? animationClass
                    : 'hidden'
                : isVisible
                  ? animationClass
                  : 'hidden',
            )}
          >
            {isOutAnimation ? (
              <CursorTouch
                className={cn(
                  'text-on-accent',
                  isAnimating && 'animate-fade-out',
                )}
                size={24}
              />
            ) : (
              <span className='body-4'>Animated Element</span>
            )}
          </div>
        </button>
      </div>
      <Button
        appearance='gray'
        onClick={handleReset}
        aria-label='Reset'
        icon={Refresh}
      >
        Reset
      </Button>
    </div>
  );
};

// Fade Animations
export const Fade: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-24'>
      <AnimationDemo
        animationClass='animate-fade-in'
        title='Fade In'
        description='Opacity transition from transparent to visible'
      />
      <AnimationDemo
        animationClass='animate-fade-out'
        title='Fade Out'
        description='Opacity transition from visible to transparent'
      />
    </div>
  ),
};

// Slide In Animations
export const SlideIn: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-24 lg:grid-cols-4'>
      <AnimationDemo
        animationClass='animate-slide-in-from-top'
        title='From Top'
        description='Slides in from above with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-in-from-bottom'
        title='From Bottom'
        description='Slides in from below with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-in-from-left'
        title='From Left'
        description='Slides in from left with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-in-from-right'
        title='From Right'
        description='Slides in from right with fade'
      />
    </div>
  ),
};

// Slide Out Animations
export const SlideOut: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-24 lg:grid-cols-4'>
      <AnimationDemo
        animationClass='animate-slide-out-to-top'
        title='To Top'
        description='Slides out upward with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-out-to-bottom'
        title='To Bottom'
        description='Slides out downward with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-out-to-left'
        title='To Left'
        description='Slides out to left with fade'
      />
      <AnimationDemo
        animationClass='animate-slide-out-to-right'
        title='To Right'
        description='Slides out to right with fade'
      />
    </div>
  ),
};

// Default Tailwind Animations
export const DefaultTailwindAnimations: Story = {
  render: () => (
    <>
      <h2 className='mt-32 mb-16 text-start heading-3'>Static animation</h2>
      <div className='rounded-2xl border border-muted-subtle bg-canvas p-16'>
        <div className='grid grid-cols-1 gap-24 md:grid-cols-2 lg:grid-cols-4'>
          {/* Spin Animation */}
          <div className='flex flex-col items-center gap-16 p-24'>
            <div className='text-center'>
              <h3 className='mb-8 heading-4'>Spin</h3>
              <Tag label='animate-spin' appearance='gray' />
            </div>
            <div className='flex h-80 w-144 items-center justify-center rounded-sm border border-muted-subtle'>
              <div className='relative size-24'>
                <div className='absolute inset-0 animate-spin bg-accent' />
              </div>
            </div>
          </div>

          {/* Ping Animation */}
          <div className='flex flex-col items-center gap-16 p-24'>
            <div className='text-center'>
              <h3 className='mb-8 heading-4'>Ping</h3>
              <Tag label='animate-ping' appearance='gray' />
            </div>
            <div className='flex h-80 w-144 items-center justify-center rounded-sm border border-muted-subtle'>
              <div className='relative size-24'>
                <div className='absolute inset-0 animate-ping bg-accent' />
                <div className='relative size-full bg-accent' />
              </div>
            </div>
          </div>

          {/* Pulse Animation */}
          <div className='flex flex-col items-center gap-16 p-24'>
            <div className='text-center'>
              <h3 className='mb-8 heading-4'>Pulse</h3>
              <Tag label='animate-pulse' appearance='gray' />
            </div>
            <div className='flex h-80 w-144 items-center justify-center rounded-sm border border-muted-subtle'>
              <div className='relative size-24'>
                <div className='absolute inset-0 animate-pulse bg-accent' />
              </div>
            </div>
          </div>

          {/* Bounce Animation */}
          <div className='flex flex-col items-center gap-16 p-24'>
            <div className='text-center'>
              <h3 className='mb-8 heading-4'>Bounce</h3>
              <Tag label='animate-bounce' appearance='gray' />
            </div>
            <div className='flex h-80 w-144 items-center justify-center rounded-sm border border-muted-subtle'>
              <div className='relative size-24'>
                <div className='absolute inset-0 animate-bounce bg-accent' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// All Animations Grid
export const AllAnimations: Story = {
  render: () => (
    <div className='space-y-48'>
      {/* Fade Animations Section */}
      <div>
        <h2 className='mt-32 mb-16 text-start heading-3'>Fade</h2>
        <div className='rounded-2xl border border-muted-subtle bg-canvas p-16'>
          <div className='grid grid-cols-1 gap-24 md:grid-cols-2'>
            <AnimationDemo
              animationClass='animate-fade-in'
              title='In'
              description=''
            />
            <AnimationDemo
              animationClass='animate-fade-out'
              title='Out'
              description=''
            />
          </div>
        </div>
      </div>

      {/* Slide In Animations Section */}
      <div>
        <h2 className='mt-32 mb-16 text-start heading-3'>Slide in</h2>
        <div className='rounded-2xl border border-muted-subtle bg-canvas p-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <AnimationDemo
              animationClass='animate-slide-in-from-top'
              title='From top'
              description='From above with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-in-from-bottom'
              title='From bottom'
              description='From below with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-in-from-left'
              title='From left'
              description='From left with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-in-from-right'
              title='From right'
              description='From right with fade'
            />
          </div>
        </div>
      </div>

      {/* Slide Out Animations Section */}
      <div>
        <h2 className='mt-32 mb-16 text-start heading-3'>Slide out</h2>
        <div className='rounded-2xl border border-muted-subtle bg-canvas p-8'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
            <AnimationDemo
              animationClass='animate-slide-out-to-top'
              title='To top'
              description='To above with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-out-to-bottom'
              title='To bottom'
              description='To below with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-out-to-left'
              title='To left'
              description='To left with fade'
            />
            <AnimationDemo
              animationClass='animate-slide-out-to-right'
              title='To right'
              description='To right with fade'
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
