import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from '../../Symbols';
import { IconButton } from '../IconButton';
import { PageIndicator } from './PageIndicator';

const meta = {
  title: 'Communication/PageIndicator',
  component: PageIndicator,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
  },
} satisfies Meta<typeof PageIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {
    currentPage: 0,
    totalPages: 5,
  },
};

const InteractiveComponent = ({ totalPages }: { totalPages: number }) => {
  const [page, setPage] = useState(0);

  return (
    <div className='flex w-full flex-col items-center gap-16'>
      <div className='flex flex-row items-center justify-center gap-16'>
        <IconButton
          icon={ArrowLeft}
          size='xs'
          aria-label='Previous page'
          appearance='transparent'
          onClick={() => setPage((v) => Math.max(0, v - 1))}
        />
        <span className='w-28 text-center heading-2-semi-bold text-base'>
          {page}
        </span>
        <IconButton
          icon={ArrowRight}
          size='xs'
          aria-label='Next page'
          appearance='transparent'
          onClick={() => setPage((v) => Math.min(totalPages - 1, v + 1))}
        />
      </div>
      <PageIndicator currentPage={page} totalPages={totalPages} />
    </div>
  );
};

export const Interactive: Story = {
  args: {
    currentPage: 0,
    totalPages: 9,
  },
  render: (args) => <InteractiveComponent totalPages={args.totalPages} />,
};
