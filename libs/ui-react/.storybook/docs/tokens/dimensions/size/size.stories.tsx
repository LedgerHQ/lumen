import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../../shared';
import { SizeTable } from '../dimensionTable';

const meta = {
  id: 'react-size',
  title: 'Foundations/Size',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

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
