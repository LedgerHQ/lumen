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
    children: {
      control: 'select',
      options: ['Settings', 'PenEdit', 'DeleteCircleFill'],
      mapping: {
        Settings: <Settings />,
        PenEdit: <PenEdit />,
        DeleteCircleFill: <DeleteCircleFill />,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof InteractiveIcon>;

export const Filled: Story = {
  args: {
    iconType: 'filled',
    children: <DeleteCircleFill />,
    'aria-label': 'Delete',
  },
  parameters: {
    docs: {
      source: {
        code: `
<InteractiveIcon iconType="filled" aria-label="Delete">
  <DeleteCircleFill />
</InteractiveIcon>
`,
      },
    },
  },
};

export const Stroked: Story = {
  args: {
    iconType: 'stroked',
    children: <MoreVertical />,
    'aria-label': 'More actions',
  },
  parameters: {
    docs: {
      source: {
        code: `
<InteractiveIcon iconType="stroked" aria-label="More actions">
  <MoreVertical />
</InteractiveIcon>
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
          <InteractiveIcon iconType='filled' aria-label='Delete'>
            <DeleteCircleFill />
          </InteractiveIcon>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked</span>
          <InteractiveIcon iconType='stroked' aria-label='More actions'>
            <MoreVertical />
          </InteractiveIcon>
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
              <InteractiveIcon key={size} iconType='stroked' aria-label='More'>
                <MoreVertical size={size} />
              </InteractiveIcon>
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
          <InteractiveIcon iconType='filled' aria-label='Delete'>
            <DeleteCircleFill />
          </InteractiveIcon>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked enabled</span>
          <InteractiveIcon iconType='stroked' aria-label='More actions'>
            <MoreVertical />
          </InteractiveIcon>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Filled disabled</span>
          <InteractiveIcon iconType='filled' aria-label='Delete' disabled>
            <DeleteCircleFill />
          </InteractiveIcon>
        </div>
        <div className='flex flex-col items-center gap-4'>
          <span className='text-muted'>Stroked disabled</span>
          <InteractiveIcon
            iconType='stroked'
            aria-label='More actions'
            disabled
          >
            <MoreVertical />
          </InteractiveIcon>
        </div>
      </div>
    );
  },
};
