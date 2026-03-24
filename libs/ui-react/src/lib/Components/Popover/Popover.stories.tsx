import type { Meta, StoryObj } from '@storybook/react-vite';
import * as React from 'react';
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Tag } from '../Tag';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  createPopoverHandle,
} from './Popover';
import type { PopoverProps } from './types';

const meta: Meta<typeof Popover> = {
  title: 'Containment/Popover',
  component: Popover,
  subcomponents: {
    PopoverTrigger,
    PopoverContent,
  },
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Popover>;

const DefaultContent = () => {
  return (
    <div className='flex flex-col gap-24'>
      <div className='flex items-center gap-12'>
        <Avatar
          size='lg'
          src='https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        />
        <div>
          <div className='heading-4-semi-bold text-base'>John Doe</div>
          <Tag label='Status: Active' appearance='success' />
        </div>
      </div>

      <div>
        <p className='heading-4-semi-bold text-base'>Notifications</p>
        <p className='body-2 text-muted'>
          You have 10 notifications in your account
        </p>
      </div>
      <div className='flex gap-12'>
        <Button size='sm' appearance='gray'>
          View all
        </Button>
        <Button size='sm' appearance='gray'>
          Settings
        </Button>
      </div>
    </div>
  );
};

export const Base: Story = {
  render: (args: PopoverProps) => (
    <Popover {...args}>
      <PopoverTrigger>
        <Button appearance='gray'>Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <DefaultContent />
      </PopoverContent>
    </Popover>
  ),
};

export const WidthShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-16'>
      <Popover>
        <PopoverTrigger>
          <Button appearance='gray'>Hug (default)</Button>
        </PopoverTrigger>
        <PopoverContent width='hug'>
          <p className='body-2 text-base'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button appearance='gray'>Hug (with custom width w-256)</Button>
        </PopoverTrigger>
        <PopoverContent width='hug' className='w-256'>
          <p className='body-2 text-base'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger>
          <Button appearance='gray'>Fixed (max-w 400px)</Button>
        </PopoverTrigger>
        <PopoverContent width='fixed'>
          <p className='body-2 text-base'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
            quos.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const PositionShowcase: Story = {
  render: () => {
    const side = ['top', 'bottom', 'left', 'right'] as const;
    const align = ['end', 'center', 'start'] as const;

    return (
      <div className='flex flex-col items-center gap-16'>
        {side.map((side) => (
          <div key={side} className='flex items-center gap-16'>
            {align.map((align) => (
              <Popover key={side} overlay={false}>
                <PopoverTrigger>
                  <Button appearance='gray'>{`${side}-${align}`}</Button>
                </PopoverTrigger>
                <PopoverContent side={side} align={align}>
                  <DefaultContent />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        ))}
      </div>
    );
  },
};

export const WithOverlay: Story = {
  render: () => (
    <div className='flex items-center gap-16'>
      <Popover overlay>
        <PopoverTrigger>
          <Button appearance='gray'>With Overlay (default)</Button>
        </PopoverTrigger>
        <PopoverContent width='fixed'>
          <DefaultContent />
        </PopoverContent>
      </Popover>

      <Popover overlay={false}>
        <PopoverTrigger>
          <Button appearance='gray'>Without Overlay</Button>
        </PopoverTrigger>
        <PopoverContent width='fixed'>
          <DefaultContent />
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <div className='flex items-center gap-16'>
        <Popover
          open={open}
          onOpenChange={(isOpen: boolean) => setOpen(isOpen)}
        >
          <PopoverTrigger>
            <Button appearance='gray'>{open ? 'Close' : 'Open'} Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className='flex flex-col gap-16'>
              <DefaultContent />
              <Button
                size='sm'
                appearance='gray'
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <span className='body-2 text-muted'>
          State: {open ? 'Open' : 'Closed'}
        </span>
      </div>
    );
  },
};

export const WithRenderProp: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={<Button appearance='gray'>Custom Trigger</Button>}
      />
      <PopoverContent>
        <div className='flex flex-col gap-8'>
          <p className='heading-4-semi-bold text-base'>Render Prop</p>
          <p className='body-2 text-muted'>
            The trigger uses the render prop to compose with a Button component.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const DetachedTrigger: Story = {
  render: () => {
    const handle = createPopoverHandle<{ label: string }>();

    return (
      <div className='flex items-center gap-16'>
        <PopoverTrigger handle={handle} payload={{ label: 'Button A' }}>
          <Button appearance='gray'>Trigger A</Button>
        </PopoverTrigger>

        <PopoverTrigger handle={handle} payload={{ label: 'Button B' }}>
          <Button appearance='gray'>Trigger B</Button>
        </PopoverTrigger>

        <Popover handle={handle}>
          {({ payload }: { payload: { label: string } | undefined }) => (
            <PopoverContent>
              <div className='flex flex-col gap-8'>
                <p className='heading-4-semi-bold text-base'>
                  Detached Trigger
                </p>
                <p className='body-2 text-muted'>
                  Opened by: {payload?.label ?? 'unknown'}
                </p>
              </div>
            </PopoverContent>
          )}
        </Popover>
      </div>
    );
  },
};
