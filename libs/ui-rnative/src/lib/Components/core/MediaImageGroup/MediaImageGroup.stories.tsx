import CryptoIcon from '@ledgerhq/crypto-icons/native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives';
import { MediaImageGroup } from './MediaImageGroup';
import type { MediaImageGroupItem } from './types';

const meta = {
  component: MediaImageGroup,
  id: 'rnative-mediaimagegroup',
  title: 'Core/MediaImageGroup',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof MediaImageGroup>;

export default meta;
type Story = StoryObj<typeof MediaImageGroup>;

const assets = [
  { id: 'btc', src: 'https://crypto-icons.ledger.com/BTC.png', alt: 'Bitcoin' },
  {
    id: 'eth',
    src: 'https://crypto-icons.ledger.com/ETH.png',
    alt: 'Ethereum',
  },
  { id: 'ada', src: 'https://crypto-icons.ledger.com/ADA.png', alt: 'Cardano' },
  { id: 'sol', src: 'https://crypto-icons.ledger.com/SOL.png', alt: 'Solana' },
  {
    id: 'dot',
    src: 'https://crypto-icons.ledger.com/DOT.png',
    alt: 'Polkadot',
  },
  { id: 'xrp', src: 'https://crypto-icons.ledger.com/XRP.png', alt: 'XRP' },
];

const fallbackItems: MediaImageGroupItem[] = [
  { id: 'btc', fallback: 'Bitcoin' },
  { id: 'eth', fallback: 'Ethereum' },
  { id: 'loading', loading: true },
];

export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    data: [
      {
        id: 'btc',
        src: 'https://crypto-icons.ledger.com/BTC.png',
        alt: 'Bitcoin',
      },
      {
        id: 'eth',
        src: 'https://crypto-icons.ledger.com/ETH.png',
        alt: 'Ethereum',
      },
      {
        id: 'ada',
        src: 'https://crypto-icons.ledger.com/ADA.png',
        alt: 'Cardano',
      },
    ],
    size: 32,
    shape: 'circle',
    maxVisible: 4,
  },
};

export const SizeShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's16' }}>
      <MediaImageGroup data={assets} size={12} />
      <MediaImageGroup data={assets} size={16} />
      <MediaImageGroup data={assets} size={20} />
      <MediaImageGroup data={assets} size={24} />
      <MediaImageGroup data={assets} size={32} />
      <MediaImageGroup data={assets} size={40} />
      <MediaImageGroup data={assets} size={48} />
      <MediaImageGroup data={assets} size={56} />
      <MediaImageGroup data={assets} size={64} />
      <MediaImageGroup data={assets} size={72} />
    </Box>
  ),
};

export const ShapeShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's24' }}>
      <MediaImageGroup data={assets} size={40} shape='circle' />
      <MediaImageGroup data={assets} size={40} shape='square' />
    </Box>
  ),
};

export const WithOverflow: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  render: () => (
    <Box lx={{ gap: 's24' }}>
      <MediaImageGroup data={assets.slice(0, 4)} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={3} />
    </Box>
  ),
};

export const Disabled: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: { data: assets, maxVisible: 4, disabled: true },
};

export const DisabledItem: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    data: assets.map((asset) => ({ ...asset, disabled: asset.id === 'eth' })),
    maxVisible: 4,
  },
};

export const WithFallback: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: { data: fallbackItems },
};

export const WithRenderItem: Story = {
  render: () => (
    <MediaImageGroup
      data={[
        { id: 'btc', ledgerId: 'bitcoin', ticker: 'BTC' },
        { id: 'eth', ledgerId: 'ethereum', ticker: 'ETH' },
        { id: 'ada', ledgerId: 'cardano', ticker: 'ADA' },
        { id: 'sol', ledgerId: 'solana', ticker: 'SOL' },
        { id: 'dot', ledgerId: 'polkadot', ticker: 'DOT' },
        { id: 'xrp', ledgerId: 'ripple', ticker: 'XRP' },
      ]}
      size={40}
      maxVisible={4}
      renderItem={(asset, { size, shape }) => (
        <CryptoIcon
          ledgerId={asset.ledgerId}
          ticker={asset.ticker}
          size={size}
          shape={shape}
        />
      )}
    />
  ),
};
