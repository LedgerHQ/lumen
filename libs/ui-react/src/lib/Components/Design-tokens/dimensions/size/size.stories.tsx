import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../../shared';
import { SizeTable } from '../dimensionTable';

const meta: Meta = {
  id: 'react-size',
  title: 'Foundations/Size',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Size'
        description='Tailwind classes for controlling the size of an element. Includes width and height.'
      />
      <SizeTable utilityPrefix='size' />
    </div>
  ),
};
