import type { Meta, StoryObj } from '@storybook/react-vite';
import { Information } from '../../Symbols';
import { Button } from '../Button';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

const meta: Meta<typeof TooltipContent> = {
  title: 'Communication/Tooltip',
  component: TooltipContent,
  subcomponents: {
    TooltipTrigger,
    Tooltip,
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    side: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    sideOffset: {
      control: 'number',
    },
    children: {
      control: 'text',
    },
    className: {
      control: false,
    },
    asChild: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof TooltipContent>;

export const Basic: Story = {
  render: () => (
    <div className='flex h-256 items-center justify-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>This is a basic tooltip</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Tooltip>
  <TooltipTrigger asChild>
    <Button>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>
    This is a basic tooltip
  </TooltipContent>
</Tooltip>
        `,
      },
    },
  },
};

export const AnimatedPlacements: Story = {
  render: () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const;
    return (
      <div className='grid grid-cols-2 gap-32 p-16'>
        {placements.map((placement) => (
          <div key={placement} className='flex flex-col items-center gap-8'>
            <p className='capitalize'>{placement}</p>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button>Hover</Button>
              </TooltipTrigger>
              <TooltipContent side={placement}>
                Slides in from {placement}
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each placement has its own directional slide animation that matches the tooltip position.',
      },
    },
  },
};

export const WithIconTrigger: Story = {
  render: () => (
    <div className='flex h-256 items-center justify-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Information size={20} />
        </TooltipTrigger>
        <TooltipContent>Animated tooltip with icon trigger</TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const LongContent: Story = {
  render: () => (
    <div className='flex h-256 items-center justify-center'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover for details</Button>
        </TooltipTrigger>
        <TooltipContent className='max-w-192'>
          This is a longer tooltip content that demonstrates smooth animations
          even with multi-line content. The tooltip slides in and out based on
          its placement.
        </TooltipContent>
      </Tooltip>
    </div>
  ),
};

export const CustomDelay: Story = {
  render: () => (
    <div className='flex h-256 flex-col items-center justify-center gap-8'>
      <p className='body-2 text-muted'>Compare different delay durations</p>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Default delay (200ms)</Button>
        </TooltipTrigger>
        <TooltipContent>Default 200ms delay with animations</TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button>Longer delay (500ms)</Button>
        </TooltipTrigger>
        <TooltipContent>Longer 500ms delay with animations</TooltipContent>
      </Tooltip>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button>No delay</Button>
        </TooltipTrigger>
        <TooltipContent>Instant tooltip with animations</TooltipContent>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The default 200ms delay provides a good balance between responsiveness and preventing accidental triggers, while maintaining smooth animations.',
      },
    },
  },
};
