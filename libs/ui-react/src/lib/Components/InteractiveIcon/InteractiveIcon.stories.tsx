import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Settings,
  PenEdit,
  DeleteCircleFill,
  MoreVertical,
} from '../../Symbols';
import { InteractiveIcon } from './InteractiveIcon';

const meta: Meta<typeof InteractiveIcon> = {
  component: InteractiveIcon,
  title: 'Action/InteractiveIcon',
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
    icon: {
      control: 'select',
      options: ['Settings', 'PenEdit', 'DeleteCircleFill'],
      mapping: {
        Settings,
        PenEdit,
        DeleteCircleFill,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveIcon>;

export const Filled: Story = {
  args: {
    iconType: 'filled',
    icon: DeleteCircleFill,
    'aria-label': 'Delete',
  },
  parameters: {
    docs: {
      source: {
        code: `
<InteractiveIcon iconType="filled" icon={DeleteCircleFill} aria-label="Delete" />
`,
      },
    },
  },
};

export const Stroked: Story = {
  args: {
    iconType: 'stroked',
    icon: MoreVertical,
    'aria-label': 'More actions',
  },
  parameters: {
    docs: {
      source: {
        code: `
<InteractiveIcon iconType="stroked" icon={MoreVertical} aria-label="More actions" />
`,
      },
    },
  },
};

export const IconTypeShowcase: Story = {
  render: () => {
    return (
      <div className='flex gap-16 p-8'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Filled</span>
          <InteractiveIcon
            iconType='filled'
            icon={DeleteCircleFill}
            aria-label='Delete'
          />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked</span>
          <InteractiveIcon
            iconType='stroked'
            icon={MoreVertical}
            aria-label='More actions'
          />
        </div>
      </div>
    );
  },
};

export const SizesShowcase: Story = {
  render: () => {
    const iconSizes = [16, 20, 24, 40] as const;
    return (
      <div className='flex flex-col gap-16 p-8'>
        {iconSizes.map((size) => (
          <div className='flex items-center gap-16' key={size}>
            <div className='flex w-56 justify-center'>
              <InteractiveIcon
                iconType='stroked'
                icon={MoreVertical}
                size={size}
                aria-label='More'
              />
            </div>
            <div>{size}px</div>
          </div>
        ))}
      </div>
    );
  },
};

export const StatesShowcase: Story = {
  render: () => {
    return (
      <div className='flex gap-16 bg-base p-8'>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Filled enabled</span>
          <InteractiveIcon
            iconType='filled'
            icon={DeleteCircleFill}
            aria-label='Delete'
          />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked enabled</span>
          <InteractiveIcon
            iconType='stroked'
            icon={MoreVertical}
            aria-label='More actions'
          />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Filled disabled</span>
          <InteractiveIcon
            iconType='filled'
            icon={DeleteCircleFill}
            aria-label='Delete'
            disabled
          />
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked disabled</span>
          <InteractiveIcon
            iconType='stroked'
            icon={MoreVertical}
            aria-label='More actions'
            disabled
          />
        </div>
      </div>
    );
  },
};
