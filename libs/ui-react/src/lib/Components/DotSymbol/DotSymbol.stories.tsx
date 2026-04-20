import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowDown,
  ArrowUp,
  Close,
  CoinAlert,
  Link,
  StarFill as Star,
} from '../../Symbols';
import { MediaImage } from '../MediaImage';
import { Spinner } from '../Spinner';
import { Spot } from '../Spot';
import { DotSymbol, mediaImageDotSizeMap } from './DotSymbol';

const meta = {
  component: DotSymbol,
  title: 'Communication/DotSymbol',
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
} satisfies Meta<typeof DotSymbol>;

export default meta;
type Story = StoryObj<typeof meta>;

const parentSrc = 'https://crypto-icons.ledger.com/ADA.png';
const dotSrc = 'https://crypto-icons.ledger.com/BTC.png';

export const Base: Story = {
  args: {
    src: dotSrc,
    alt: 'Ethereum network',
    pin: 'bottom-end',
    size: mediaImageDotSizeMap[48],
    shape: 'circle',
    children: <MediaImage src={parentSrc} alt='Cardano' shape='circle' />,
  },
};

export const PinShowcase: Story = {
  args: { src: dotSrc, alt: 'Pin showcase' },
  render: () => (
    <div className='flex flex-col items-center gap-24'>
      <div className='flex items-center gap-32'>
        <DotSymbol src={dotSrc} pin='bottom-end'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='top-end'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='bottom-start'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='top-start'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
      </div>
      <div className='flex items-center gap-32'>
        <DotSymbol src={dotSrc} pin='bottom-end'>
          <Spot appearance='icon' icon={CoinAlert} />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='top-end'>
          <Spot appearance='icon' icon={CoinAlert} />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='bottom-start'>
          <Spot appearance='icon' icon={CoinAlert} />
        </DotSymbol>
        <DotSymbol src={dotSrc} pin='top-start'>
          <Spot appearance='icon' icon={CoinAlert} />
        </DotSymbol>
      </div>
    </div>
  ),
};

export const ShapeShowcase: Story = {
  args: { src: dotSrc, alt: 'Shape showcase' },
  render: () => (
    <div className='flex flex-col items-center gap-48 body-2'>
      <div className='inline-flex items-center gap-48'>
        <DotSymbol shape='square' src={dotSrc} pin='bottom-end'>
          <MediaImage src={parentSrc} size={48} shape='circle' />
        </DotSymbol>
        <DotSymbol shape='square' src={dotSrc} pin='bottom-end'>
          <MediaImage src={parentSrc} size={48} shape='circle' />
        </DotSymbol>
      </div>
    </div>
  ),
};

export const SizeShowcase: Story = {
  args: { src: dotSrc, alt: 'Size showcase' },
  render: () => (
    <div className='flex flex-col gap-40'>
      <div className='inline-flex items-end gap-24 body-2'>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[40]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={40} shape='circle' />
        </DotSymbol>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={48} shape='circle' />
        </DotSymbol>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[56]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={56} shape='circle' />
        </DotSymbol>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[64]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={64} shape='circle' />
        </DotSymbol>
      </div>
      <div className='inline-flex items-end gap-24 body-2'>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[40]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={40} shape='circle' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={48} shape='circle' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[56]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={56} shape='circle' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[64]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={64} shape='circle' />
        </DotSymbol>
      </div>
    </div>
  ),
};

export const IconVariant: Story = {
  args: {
    type: 'icon',
    appearance: 'success',
    shape: 'circle',
    icon: ArrowDown,
    pin: 'bottom-end',
    size: mediaImageDotSizeMap[48],
    children: (
      <MediaImage src={parentSrc} alt='Cardano' size={48} shape='circle' />
    ),
  },
};

export const IconAppearanceShowcase: Story = {
  args: { type: 'icon', appearance: 'success', icon: ArrowDown },
  render: () => (
    <div className='flex items-center gap-32'>
      <DotSymbol
        type='icon'
        appearance='success'
        icon={ArrowDown}
        size={mediaImageDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotSymbol>
      <DotSymbol
        type='icon'
        appearance='muted'
        icon={ArrowUp}
        size={mediaImageDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotSymbol>
      <DotSymbol
        type='icon'
        appearance='error'
        icon={Close}
        size={mediaImageDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotSymbol>
    </div>
  ),
};

export const IconSizeShowcase: Story = {
  args: { type: 'icon', appearance: 'muted', icon: Link },
  render: () => (
    <div className='inline-flex items-end gap-24'>
      <DotSymbol
        type='icon'
        appearance='muted'
        icon={Link}
        size={mediaImageDotSizeMap[40]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={40} shape='circle' />
      </DotSymbol>
      <DotSymbol
        type='icon'
        appearance='success'
        icon={Star}
        size={mediaImageDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotSymbol>
      <DotSymbol
        type='icon'
        appearance='success'
        icon={ArrowDown}
        size={mediaImageDotSizeMap[56]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={56} shape='circle' />
      </DotSymbol>
      <DotSymbol
        type='icon'
        appearance='muted'
        icon={Spinner}
        size={mediaImageDotSizeMap[64]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={64} shape='circle' />
      </DotSymbol>
    </div>
  ),
};
