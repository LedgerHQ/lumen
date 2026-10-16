import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Box, Text, IconButton } from '../..';
import { useTheme } from '../../../../styles';
import { ArrowLeft, ArrowRight } from '../../symbols';
import { PageIndicator } from './PageIndicator';

const meta = {
  id: 'rnative-pageindicator',
  title: 'Core/PageIndicator',
  component: PageIndicator,
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    currentPage: { control: 'number' },
    totalPages: { control: 'number' },
  },
} satisfies Meta<typeof PageIndicator>;

export default meta;

type Story = StoryObj<typeof PageIndicator>;

export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    currentPage: 1,
    totalPages: 5,
  },
};

export const Interactive: Story = {
  render: () => {
    const totalPages = 9;
    const [page, setPage] = useState(1);
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
            onPress={() => setPage((v) => Math.max(1, v - 1))}
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
            onPress={() => setPage((v) => Math.min(totalPages, v + 1))}
          />
        </Box>
        <PageIndicator currentPage={page} totalPages={totalPages} />
      </Box>
    );
  },
};
