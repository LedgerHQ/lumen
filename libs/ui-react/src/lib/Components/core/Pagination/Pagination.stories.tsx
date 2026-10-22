import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Pagination } from './Pagination';

const meta = {
  id: 'react-pagination',
  title: 'Core/Pagination',
  component: Pagination,
  parameters: {
    docs: { source: { language: 'tsx', format: true, type: 'code' } },
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
    density: { control: 'radio', options: ['expanded', 'compact'] },
    onPageChange: { action: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof Pagination>;

export const Base: Story = {
  args: {
    page: 5,
    totalPages: 10,
    siblingCount: 1,
  },
  render: (args) => {
    const [page, setPage] = useState(args.page);

    useEffect(() => {
      setPage(args.page);
    }, [args.page]);

    return <Pagination {...args} page={page} onPageChange={setPage} />;
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(2);

    return <Pagination page={page} totalPages={3} onPageChange={setPage} />;
  },
};

export const FirstPage: Story = {
  render: () => {
    const [page, setPage] = useState(1);

    return <Pagination page={page} totalPages={20} onPageChange={setPage} />;
  },
};

export const LastPage: Story = {
  render: () => {
    const [page, setPage] = useState(20);

    return <Pagination page={page} totalPages={20} onPageChange={setPage} />;
  },
};

export const WithMoreSiblings: Story = {
  render: () => {
    const [page, setPage] = useState(10);

    return (
      <Pagination
        page={page}
        totalPages={20}
        siblingCount={2}
        onPageChange={setPage}
      />
    );
  },
};

export const Compact: Story = {
  render: () => {
    const [page, setPage] = useState(2);

    return (
      <Pagination
        page={page}
        totalPages={8}
        density='compact'
        onPageChange={setPage}
      />
    );
  },
};
