import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../../shared';
import { SizeTable } from '../dimensionTable';

const meta: Meta = {
  id: 'react-width',
  title: 'Foundations/Width',
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Width'
        description='Tailwind classes for controlling the width of an element. Use the `w-*` prefix followed by the size value.'
      />
      <SizeTable utilityPrefix='w' />
    </div>
  ),
};
