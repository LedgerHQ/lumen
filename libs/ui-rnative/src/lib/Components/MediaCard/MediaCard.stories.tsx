import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Tag } from '../Tag';
import { Box } from '../Utility';
import {
  MediaCard,
  MediaCardDescription,
  MediaCardLeadingContent,
  MediaCardTitle,
  MediaCardTrailingContent,
} from './MediaCard';

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

export const Base: Story = {
  args: {
    imageUrl: EXAMPLE_SRC,
    onPress: () => ({}),
    onClose: () => ({}),
  },
  render: (args) => (
    <Box lx={{ width: 's400' }}>
      <MediaCard {...args}>
        <MediaCardLeadingContent>
          <Tag label='Label' size='md' />
        </MediaCardLeadingContent>
        <MediaCardTrailingContent>
          <MediaCardTitle>
            Black Friday sale. 3 days with no fees on your transactions.
          </MediaCardTitle>
        </MediaCardTrailingContent>
      </MediaCard>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<MediaCard imageUrl="..." onPress={() => {}} onClose={() => {}}>
  <MediaCardLeadingContent>
    <Tag label="Label" size="md" />
  </MediaCardLeadingContent>
  <MediaCardTrailingContent>
    <MediaCardTitle>Card title</MediaCardTitle>
  </MediaCardTrailingContent>
</MediaCard>
`,
      },
    },
  },
};

export const LayoutShowcase: Story = {
  args: {
    imageUrl: EXAMPLE_SRC,
    onPress: () => ({}),
    onClose: () => ({}),
  },
  render: (args) => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's400',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...args}>
        <MediaCardTrailingContent>
          <MediaCardTitle>Full width card</MediaCardTitle>
        </MediaCardTrailingContent>
      </MediaCard>
    </Box>
  ),
};

export const CompositionShowcase: Story = {
  args: {
    imageUrl: EXAMPLE_SRC,
    onPress: () => ({}),
    onClose: () => ({}),
  },
  render: (args) => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's400',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...args}>
        <MediaCardTrailingContent>
          <MediaCardTitle>Title only</MediaCardTitle>
        </MediaCardTrailingContent>
      </MediaCard>

      <MediaCard {...args}>
        <MediaCardLeadingContent>
          <Tag label='Promo' size='md' />
        </MediaCardLeadingContent>
        <MediaCardTrailingContent>
          <MediaCardTitle>With tag and title</MediaCardTitle>
        </MediaCardTrailingContent>
      </MediaCard>

      <MediaCard {...args}>
        <MediaCardTrailingContent>
          <MediaCardTitle>Title and description</MediaCardTitle>
          <MediaCardDescription>
            A short description below the main title.
          </MediaCardDescription>
        </MediaCardTrailingContent>
      </MediaCard>

      <MediaCard {...args}>
        <MediaCardLeadingContent>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
        </MediaCardLeadingContent>
        <MediaCardTrailingContent>
          <MediaCardTitle>With crypto icon</MediaCardTitle>
          <MediaCardDescription>
            Leading content can be any element.
          </MediaCardDescription>
        </MediaCardTrailingContent>
      </MediaCard>
    </Box>
  ),
};
