import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  component: Divider,
  title: 'Core/Divider',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Base: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => {
    const isVertical = args.orientation === 'vertical';
    return (
      <div
        className={
          isVertical
            ? 'flex items-center gap-16'
            : 'flex w-full flex-col gap-16'
        }
      >
        <div className='body-2 text-base'>
          {isVertical ? 'Left content' : 'Content above'}
        </div>
        <Divider {...args} className={isVertical ? 'h-48' : undefined} />
        <div className='body-2 text-base'>
          {isVertical ? 'Right content' : 'Content below'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
<Divider />
`,
      },
    },
  },
};

export const OrientationShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-32'>
      <div className='flex flex-col gap-8'>
        <span className='body-3 text-muted'>Horizontal (default)</span>
        <div className='flex w-full flex-col gap-16'>
          <div className='body-2 text-base'>Content above</div>
          <Divider orientation='horizontal' />
          <div className='body-2 text-base'>Content below</div>
        </div>
      </div>

      <div className='flex flex-col gap-8'>
        <span className='body-3 text-muted'>Vertical</span>
        <div className='flex items-center gap-16'>
          <div className='body-2 text-base'>Left content</div>
          <Divider orientation='vertical' className='h-48' />
          <div className='body-2 text-base'>Right content</div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
// Horizontal divider
<Divider orientation="horizontal" />

// Vertical divider
<Divider orientation="vertical" className="h-48" />
`,
      },
    },
  },
};

export const InList: Story = {
  render: () => (
    <div className='flex w-full max-w-400 flex-col rounded-lg border border-muted bg-canvas'>
      <div className='flex items-center justify-between p-16'>
        <span className='body-2 text-base'>Item 1</span>
        <span className='body-3 text-muted'>$100</span>
      </div>
      <Divider />
      <div className='flex items-center justify-between p-16'>
        <span className='body-2 text-base'>Item 2</span>
        <span className='body-3 text-muted'>$200</span>
      </div>
      <Divider />
      <div className='flex items-center justify-between p-16'>
        <span className='body-2 text-base'>Item 3</span>
        <span className='body-3 text-muted'>$300</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<div className="flex flex-col rounded-lg border border-muted">
  <div className="p-16">Item 1</div>
  <Divider />
  <div className="p-16">Item 2</div>
  <Divider />
  <div className="p-16">Item 3</div>
</div>
`,
      },
    },
  },
};
