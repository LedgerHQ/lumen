import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    page: 1,
    totalPages: 10,
    onPageChange: () => {},
  },
  argTypes: {
    page: { control: 'number' },
    totalPages: { control: 'number' },
    siblingCount: { control: 'number' },
    onPageChange: { action: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

const InteractivePagination = ({
  totalPages,
  initialPage = 1,
  siblingCount,
}: {
  totalPages: number;
  initialPage?: number;
  siblingCount?: number;
}) => {
  const [page, setPage] = useState(initialPage);

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      siblingCount={siblingCount}
      onPageChange={setPage}
    />
  );
};

export const Base: Story = {
  render: () => <InteractivePagination totalPages={10} initialPage={5} />,
};

export const FewPages: Story = {
  render: () => <InteractivePagination totalPages={3} initialPage={2} />,
};

export const FirstPage: Story = {
  render: () => <InteractivePagination totalPages={20} initialPage={1} />,
};

export const LastPage: Story = {
  render: () => <InteractivePagination totalPages={20} initialPage={20} />,
};

export const WithMoreSiblings: Story = {
  render: () => (
    <InteractivePagination totalPages={20} initialPage={10} siblingCount={2} />
  ),
};
