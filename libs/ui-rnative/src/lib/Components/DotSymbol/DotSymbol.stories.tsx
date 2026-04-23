import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { CoinAlert } from '../../Symbols';
import { MediaImage } from '../MediaImage';
import { Spot } from '../Spot';
import { Box } from '../Utility';
import { DotSymbol, mediaImageDotSizeMap } from './DotSymbol';

const meta = {
  component: DotSymbol,
  title: 'Communication/DotSymbol',
  parameters: {
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
    size: 20,
    shape: 'circle',
  },
  render: (args) => (
    <DotSymbol {...args}>
      <MediaImage src={parentSrc} alt='Cardano' shape={args.shape} />
    </DotSymbol>
  ),
};

export const PinShowcase: Story = {
  args: { src: dotSrc, alt: 'Pin showcase' },
  render: () => (
    <Box lx={{ flexDirection: 'column', alignItems: 'center', gap: 's24' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
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
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
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
      </Box>
    </Box>
  ),
};

export const ShapeShowcase: Story = {
  args: { src: dotSrc, alt: 'Shape showcase' },
  render: () => (
    <Box lx={{ flexDirection: 'column', alignItems: 'center', gap: 's48' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's48' }}>
        <DotSymbol shape='square' src={dotSrc} pin='bottom-end'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
        <DotSymbol shape='circle' src={dotSrc} pin='bottom-end'>
          <MediaImage src={parentSrc} shape='circle' />
        </DotSymbol>
      </Box>
    </Box>
  ),
};

export const SizeShowcase: Story = {
  args: { src: dotSrc, alt: 'Size showcase' },
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's40' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'flex-end', gap: 's24' }}>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[20]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={20} shape='circle' />
        </DotSymbol>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[24]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={24} shape='circle' />
        </DotSymbol>
        <DotSymbol
          src={dotSrc}
          size={mediaImageDotSizeMap[32]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={32} shape='circle' />
        </DotSymbol>
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
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'flex-end', gap: 's24' }}>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[20]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={20} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[24]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={24} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[32]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={32} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[40]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={40} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={48} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[56]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={56} shape='square' />
        </DotSymbol>
        <DotSymbol
          shape='square'
          src={dotSrc}
          size={mediaImageDotSizeMap[64]}
          pin='bottom-end'
        >
          <MediaImage src={parentSrc} size={64} shape='square' />
        </DotSymbol>
      </Box>
    </Box>
  ),
};
