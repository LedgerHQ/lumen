import type { Meta, StoryObj } from '@storybook/react-vite';
import { Check } from '../../Symbols/Icons/Check';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: 'Communication/Tag',
  argTypes: {
    icon: {
      control: {
        type: 'boolean',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Default: Story = {
  args: {
    label: 'Label',
    appearance: 'accent',
    size: 'md',
  },
  render: (args) => <Tag {...args} icon={args.icon ? Check : undefined} />,
};

export const Showcase: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <div className='flex gap-4'>
        <Tag appearance='base' label='Base' />
        <Tag appearance='gray' label='Gray' />
        <Tag appearance='accent' label='Accent' />
        <Tag appearance='success' label='Success' />
        <Tag appearance='error' label='Error' />
        <Tag appearance='warning' label='Warning' />
        <Tag label='Disabled' disabled />
      </div>
      <div className='flex gap-4'>
        <Tag appearance='base' label='Base' icon={Check} />
        <Tag appearance='gray' label='Gray' icon={Check} />
        <Tag appearance='accent' label='Accent' icon={Check} />
        <Tag appearance='success' label='Success' icon={Check} />
        <Tag appearance='error' label='Error' icon={Check} />
        <Tag appearance='warning' label='Warning' icon={Check} />
        <Tag label='Disabled' icon={Check} disabled />
      </div>
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Tag size='md' label='Large Tag' />
      <Tag size='sm' label='Small Tag' />
    </div>
  ),
};

export const ContentTypesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Tag label='Label only' />
      <Tag icon={Check} label='Icon and Label' />
    </div>
  ),
};

export const TruncateShowcase: Story = {
  render: () => (
    <div className='flex max-w-160 items-center gap-4'>
      <Tag label='Very long custom Tag text that should truncate' />
    </div>
  ),
};
