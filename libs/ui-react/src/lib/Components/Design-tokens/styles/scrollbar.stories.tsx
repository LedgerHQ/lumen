import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  title: 'Foundations/Styles/Scrollbar',
};

export default meta;
type Story = StoryObj;

const PLACEHOLDER_ITEMS = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

const ScrollableBox = ({
  title,
  utilityClass,
  description,
}: {
  title: string;
  utilityClass: string;
  description?: string;
}) => (
  <div>
    <div
      className={`h-224 overflow-y-auto rounded-lg border border-muted-subtle bg-canvas p-16 ${utilityClass}`}
    >
      {PLACEHOLDER_ITEMS.map((item) => (
        <div
          key={item}
          className='border-b border-muted-subtle py-12 body-2 text-base'
        >
          {item}
        </div>
      ))}
    </div>
    <div className='mt-8 body-2 text-base'>{title}</div>
    <div className='mt-4 body-4 text-muted'>
      <code>{utilityClass}</code> {description}
    </div>
  </div>
);

export const Scrollbar: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Scrollbar'
        description='Tailwind utilities for controlling the scrollbar appearance of scrollable elements.'
      />
      <div className='grid grid-cols-1 gap-40 lg:grid-cols-3'>
        <ScrollableBox
          title='Default'
          utilityClass=''
          description='Browser default scrollbar'
        />
        <ScrollableBox title='Custom' utilityClass='scrollbar-custom' />
        <ScrollableBox title='None' utilityClass='scrollbar-none' />
      </div>
    </div>
  ),
};
