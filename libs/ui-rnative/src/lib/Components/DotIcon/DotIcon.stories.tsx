import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { ArrowDown, ArrowUp, Close, Link, Star } from '../../Symbols';
import { MediaImage } from '../MediaImage';
import { Spinner } from '../Spinner';
import { Box } from '../Utility';
import { DotIcon, mediaImageDotIconSizeMap } from './DotIcon';

const meta = {
  component: DotIcon,
  title: 'Communication/DotIcon',
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
} satisfies Meta<typeof DotIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

const parentSrc = 'https://crypto-icons.ledger.com/ADA.png';

export const Base: Story = {
  args: {
    appearance: 'success',
    icon: ArrowDown,
    pin: 'bottom-end',
    size: mediaImageDotIconSizeMap[48],
    shape: 'circle',
    children: (
      <MediaImage src={parentSrc} alt='Cardano' size={48} shape='circle' />
    ),
  },
};

export const PinShowcase: Story = {
  args: { appearance: 'success', icon: ArrowDown },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DotIcon appearance='success' icon={ArrowDown} pin='bottom-end'>
        <MediaImage src={parentSrc} shape='circle' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='top-end'>
        <MediaImage src={parentSrc} shape='circle' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='bottom-start'>
        <MediaImage src={parentSrc} shape='circle' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='top-start'>
        <MediaImage src={parentSrc} shape='circle' />
      </DotIcon>
    </Box>
  ),
};

export const ShapeShowcase: Story = {
  args: { appearance: 'muted', icon: ArrowDown },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's48' }}>
      <DotIcon
        appearance='muted'
        icon={ArrowDown}
        shape='circle'
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={ArrowDown}
        shape='square'
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='square' />
      </DotIcon>
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  args: { appearance: 'success', icon: ArrowDown },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's32' }}>
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        size={mediaImageDotIconSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={ArrowUp}
        size={mediaImageDotIconSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='error'
        icon={Close}
        size={mediaImageDotIconSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotIcon>
    </Box>
  ),
};

export const SizeShowcase: Story = {
  args: { appearance: 'muted', icon: Link },
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'flex-end', gap: 's24' }}>
      <DotIcon
        appearance='muted'
        icon={Link}
        size={mediaImageDotIconSizeMap[40]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={40} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='success'
        icon={Star}
        size={mediaImageDotIconSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={48} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        size={mediaImageDotIconSizeMap[56]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={56} shape='circle' />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={Spinner}
        size={mediaImageDotIconSizeMap[64]}
        pin='bottom-end'
      >
        <MediaImage src={parentSrc} size={64} shape='circle' />
      </DotIcon>
    </Box>
  ),
};
