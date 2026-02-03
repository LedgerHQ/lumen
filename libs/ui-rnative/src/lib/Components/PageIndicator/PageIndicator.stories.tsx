import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { PageIndicator } from './PageIndicator';
import { Box, Text, IconButton } from '../';
import { ArrowLeft, ArrowRight } from '../../Symbols';
import { useTheme } from '../../../styles';

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
  const { theme } = useTheme();

  return (
    <Box lx={{ gap: 's16', alignItems: 'center', width: 'full' }}>
      <Box
        lx={{
          flexDirection: 'row',
          gap: 's16',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          icon={ArrowLeft}
          size='xs'
          accessibilityLabel='Previous page'
          appearance='transparent'
          onPress={() => setPage((v) => Math.max(0, v - 1))}
        />
        <Text
          lx={{ color: 'base', width: 's28', textAlign: 'center' }}
          style={{ ...theme.typographies.heading2SemiBold }}
        >
          {page}
        </Text>
        <IconButton
          icon={ArrowRight}
          size='xs'
          accessibilityLabel='Next page'
          appearance='transparent'
          onPress={() => setPage((v) => Math.min(totalPages - 1, v + 1))}
        />
      </Box>
      <PageIndicator currentPage={page} totalPages={totalPages} />
    </Box>
  );
};

export const Interactive: Story = {
  args: {
    totalPages: 9,
  },
  render: (args) => <InteractiveComponent totalPages={args.totalPages} />,
};
