import type { Meta, StoryObj } from '@storybook/react-vite';
import { MediaImage } from '../MediaImage';
import { Tooltip, TooltipContent, TooltipTrigger } from '../Tooltip';
import { MediaImageGroup } from './MediaImageGroup';
import type { MediaImageGroupItem } from './types';

const meta = {
  component: MediaImageGroup,
  id: 'react-mediaimagegroup',
  title: 'Core/MediaImageGroup',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
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
  {
    src: 'https://crypto-icons.ledger.com/BTC.png',
    id: 'btc',
    alt: 'Bitcoin',
  },
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
    <div className='flex flex-col gap-16'>
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
    </div>
  ),
};

export const ShapeShowcase: Story = {
  args: { data: assets },
  render: () => (
    <div className='flex flex-col gap-24'>
      <MediaImageGroup data={assets} size={40} shape='circle' />
      <MediaImageGroup data={assets} size={40} shape='square' />
    </div>
  ),
};

export const WithOverflow: Story = {
  args: { data: assets },
  render: () => (
    <div className='flex flex-col gap-24'>
      <MediaImageGroup data={assets.slice(0, 4)} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={4} />
      <MediaImageGroup data={assets} maxVisible={3} />
    </div>
  ),
};

export const Disabled: Story = {
  args: { data: assets, maxVisible: 4, disabled: true },
};

export const DisabledItem: Story = {
  args: {
    data: assets.map((asset) => ({ ...asset, disabled: asset.id === 'eth' })),
    maxVisible: 4,
  },
};

export const WithFallback: Story = {
  args: { data: fallbackItems },
};

export const WithRenderItem: Story = {
  args: { data: assets },
  parameters: {
    docs: {
      source: {
        type: 'code',
      },
    },
  },
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

export const WithTooltip: Story = {
  args: { data: assets },
  render: () => (
    <Tooltip>
      <TooltipTrigger asChild>
        <MediaImageGroup data={assets} tabIndex={0} />
      </TooltipTrigger>
      <TooltipContent>
        {assets.map((asset) => asset.alt).join(', ')}
      </TooltipContent>
    </Tooltip>
  ),
};
