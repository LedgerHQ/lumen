import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { Box, Text } from '../Utility';
import { MediaCard, MediaCardTitle } from './MediaCard';

const meta = {
  component: MediaCard,
  title: 'Communication/MediaCard',
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
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof MediaCard>;

const EXAMPLE_SRC =
  'https://ledger-wp-website-s3-prd.ledger.com/uploads/2026/03/hero_visual-1.webp';

const baseArgs = {
  imageUrl: EXAMPLE_SRC,
  onPress: () => ({}),
  onClose: () => ({}),
};

export const Base: Story = {
  args: baseArgs,
  render: (args) => (
    <Box lx={{ width: 's320' }}>
      <MediaCard {...args}>
        <Tag label='Label' size='md' />
        <MediaCardTitle>
          Black Friday sale.
          <Text typography='heading3SemiBold' lx={{ color: 'active' }}>
            {' '}
            3 days with no fees{' '}
          </Text>
          on your transactions.
        </MediaCardTitle>
      </MediaCard>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<MediaCard imageUrl="/promo.jpg" onPress={() => {}} onClose={() => {}}>
  <Tag label='Label' size='md' />
  <MediaCardTitle>
    Black Friday sale.
    <Text typography='heading3SemiBold' lx={{ color: 'active' }}>
      {' '}
      3 days with no fees{' '}
    </Text>
    on your transactions.
  </MediaCardTitle>
</MediaCard>`,
      },
    },
  },
};

export const LayoutShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's320',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...baseArgs}>
        <Tag label='Label' size='md' />
        <MediaCardTitle>Full width card</MediaCardTitle>
      </MediaCard>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<MediaCard imageUrl="/promo.jpg" onPress={() => {}} onClose={() => {}}>
  <Tag label="Label" size="md" />
  <MediaCardTitle>Full width card</MediaCardTitle>
</MediaCard>`,
      },
    },
  },
};

export const CompositionShowcase: Story = {
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's320',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...baseArgs}>
        <MediaCardTitle>Title only</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <Tag label='Promo' size='md' />
        <MediaCardTitle>With tag and title</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
        <MediaCardTitle>With crypto icon</MediaCardTitle>
      </MediaCard>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
{/* Title only */}
<MediaCard imageUrl="/promo.jpg" onPress={() => {}} onClose={() => {}}>
  <MediaCardTitle>Title only</MediaCardTitle>
</MediaCard>

{/* With tag */}
<MediaCard imageUrl="/promo.jpg" onPress={() => {}} onClose={() => {}}>
  <Tag label="Promo" size="md" />
  <MediaCardTitle>With tag and title</MediaCardTitle>
</MediaCard>

{/* With crypto icon */}
<MediaCard imageUrl="/promo.jpg" onPress={() => {}} onClose={() => {}}>
  <CryptoIcon ledgerId="bitcoin" ticker="BTC" size="32px" />
  <MediaCardTitle>With crypto icon</MediaCardTitle>
</MediaCard>`,
      },
    },
  },
};

export const WithClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onPress={() => setVisible(true)}
        >
          Show card again
        </Button>
      );
    }

    return (
      <Box lx={{ width: 's320' }}>
        <MediaCard
          imageUrl={EXAMPLE_SRC}
          onPress={() => ({})}
          onClose={() => setVisible(false)}
        >
          <Tag label='Label' size='md' />
          <MediaCardTitle>
            Black Friday sale.
            <Text typography='heading3SemiBold' lx={{ color: 'active' }}>
              {' '}
              3 days with no fees{' '}
            </Text>
            on your transactions.
          </MediaCardTitle>
        </MediaCard>
      </Box>
    );
  },
};
