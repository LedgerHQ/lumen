import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives';
import { MediaImage } from '../MediaImage';
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
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof MediaImageGroup>;

export default meta;
type Story = StoryObj<typeof MediaImageGroup>;

const assets = [
  { src: 'https://crypto-icons.ledger.com/BTC.png', id: 'btc', alt: 'Bitcoin' },
  {
    src: 'https://crypto-icons.ledger.com/ETH.png',
    id: 'eth',
    alt: 'Ethereum',
  },
  { src: 'https://crypto-icons.ledger.com/ADA.png', id: 'ada', alt: 'Cardano' },
  { src: 'https://crypto-icons.ledger.com/SOL.png', id: 'sol', alt: 'Solana' },
  {
    src: 'https://crypto-icons.ledger.com/DOT.png',
    id: 'dot',
    alt: 'Polkadot',
  },
  { src: 'https://crypto-icons.ledger.com/XRP.png', id: 'xrp', alt: 'XRP' },
];

const fallbackItems: MediaImageGroupItem[] = [
  { id: 'btc', fallback: 'Bitcoin' },
  { id: 'eth', fallback: 'Ethereum' },
  { id: 'loading', loading: true },
];

export const Base: Story = {
  args: {
    data: assets.slice(0, 3),
    size: 32,
    shape: 'circle',
    maxVisible: 4,
  },
};

export const SizeShowcase: Story = {
  args: { data: assets },
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
  args: { data: assets },
  render: () => (
    <Box lx={{ gap: 's24' }}>
      <MediaImageGroup data={assets} size={40} shape='circle' />
      <MediaImageGroup data={assets} size={40} shape='square' />
    </Box>
  ),
};

export const WithOverflow: Story = {
  args: { data: assets },
  render: () => (
    <Box lx={{ gap: 's24' }}>
      <MediaImageGroup data={assets.slice(0, 4)} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={3} />
    </Box>
  ),
};

export const Disabled: Story = {
  args: { data: assets, maxVisible: 4, disabled: true },
};

export const WithFallback: Story = {
  args: { data: fallbackItems },
};

export const WithRenderItem: Story = {
  args: { data: assets },
  render: () => (
    <MediaImageGroup
      data={assets}
      size={40}
      renderItem={(asset, { size, shape }) => (
        <MediaImage src={asset.src} alt={asset.alt} size={size} shape={shape} />
      )}
    />
  ),
};
