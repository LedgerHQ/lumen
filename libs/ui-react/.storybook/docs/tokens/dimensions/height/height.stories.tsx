import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../../shared';
import { SizeTable } from '../dimensionTable';

const meta = {
  id: 'react-height',
  title: 'Foundations/Height',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Height'
        description='Tailwind classes for controlling the height of an element. Use the `h-*` prefix followed by the size value.'
      />
      <SizeTable utilityPrefix='h' />
    </div>
  ),
};
