import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useEffect, useState } from 'react';
import { Box } from '../../primitives/Box';
import { Pagination } from './Pagination';

const meta = {
  id: 'rnative-pagination',
  title: 'Core/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: { source: { language: 'tsx', format: true, type: 'code' } },
    actions: { disable: true },
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
    onPageChange: { control: false },
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

export const DensityShowcase: Story = {
  render: () => {
    const [page, setPage] = useState(2);

    return (
      <Box lx={{ alignItems: 'center', gap: 's16' }}>
        <Pagination page={page} totalPages={8} onPageChange={setPage} />
        <Pagination
          page={page}
          totalPages={8}
          density='compact'
          onPageChange={setPage}
        />
      </Box>
    );
  },
};
