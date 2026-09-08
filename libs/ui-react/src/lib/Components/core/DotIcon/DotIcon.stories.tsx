import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ArrowDown,
  ArrowUp,
  Close,
  Link,
  StarFill as Star,
} from '../../symbols';
import { MediaImage } from '../MediaImage';
import { Spinner } from '../Spinner';
import { DotIcon } from './DotIcon';
import { getDotIconProps } from './getDotIconProps';

const meta = {
  component: DotIcon,
  id: 'react-doticon',
  title: 'Core/DotIcon',
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
} satisfies Meta<typeof DotIcon>;

export default meta;
type Story = StoryObj<typeof DotIcon>;

const parentSrc = 'https://crypto-icons.ledger.com/ADA.png';

export const Base: Story = {
  args: {
    appearance: 'success',
    icon: ArrowDown,
    pin: 'bottom-end',
    ...getDotIconProps('mediaImage', 48),
    shape: 'circle',
    children: (
      <MediaImage src={parentSrc} alt='Cardano' size={48} shape='circle' />
    ),
  },
};

export const PinShowcase: Story = {
  args: { appearance: 'success', icon: ArrowDown },
  render: () => (
    <div className='flex items-center gap-32'>
      <DotIcon appearance='success' icon={ArrowDown} pin='bottom-end'>
        <MediaImage src={parentSrc} shape='circle' aria-label='Arrow down' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='top-end'>
        <MediaImage src={parentSrc} shape='circle' aria-label='Arrow down' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='bottom-start'>
        <MediaImage src={parentSrc} shape='circle' aria-label='Arrow down' />
      </DotIcon>
      <DotIcon appearance='success' icon={ArrowDown} pin='top-start'>
        <MediaImage src={parentSrc} shape='circle' aria-label='Arrow down' />
      </DotIcon>
    </div>
  ),
};

export const ShapeShowcase: Story = {
  args: { appearance: 'muted', icon: ArrowDown },
  render: () => (
    <div className='inline-flex items-center gap-48'>
      <DotIcon
        appearance='muted'
        icon={ArrowDown}
        shape='circle'
        pin='bottom-end'
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Arrow down'
        />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={ArrowDown}
        shape='square'
        pin='bottom-end'
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='square'
          aria-label='Arrow down'
        />
      </DotIcon>
    </div>
  ),
};

export const AppearanceShowcase: Story = {
  args: { appearance: 'success', icon: ArrowDown },
  render: () => (
    <div className='flex items-center gap-32'>
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Arrow down'
        />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={ArrowUp}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Arrow up'
        />
      </DotIcon>
      <DotIcon
        appearance='error'
        icon={Close}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Close'
        />
      </DotIcon>
    </div>
  ),
};

export const DisabledShowcase: Story = {
  args: { appearance: 'success', icon: ArrowDown },
  render: () => (
    <div className='flex items-center gap-32'>
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='bottom-end'
        disabled
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Arrow down'
        />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={ArrowUp}
        pin='bottom-end'
        disabled
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Arrow up'
        />
      </DotIcon>
      <DotIcon
        appearance='error'
        icon={Close}
        pin='bottom-end'
        disabled
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Close'
        />
      </DotIcon>
    </div>
  ),
};

export const SizeShowcase: Story = {
  args: { appearance: 'muted', icon: Link },
  render: () => (
    <div className='inline-flex items-end gap-24'>
      <DotIcon
        appearance='muted'
        icon={Link}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 40)}
      >
        <MediaImage
          src={parentSrc}
          size={40}
          shape='circle'
          aria-label='Link'
        />
      </DotIcon>
      <DotIcon
        appearance='success'
        icon={Star}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 48)}
      >
        <MediaImage
          src={parentSrc}
          size={48}
          shape='circle'
          aria-label='Star'
        />
      </DotIcon>
      <DotIcon
        appearance='success'
        icon={ArrowDown}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 56)}
      >
        <MediaImage
          src={parentSrc}
          size={56}
          shape='circle'
          aria-label='Arrow down'
        />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={Spinner}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 64)}
      >
        <MediaImage
          src={parentSrc}
          size={64}
          shape='circle'
          aria-label='Spinner'
        />
      </DotIcon>
      <DotIcon
        appearance='muted'
        icon={Spinner}
        pin='bottom-end'
        {...getDotIconProps('mediaImage', 72)}
      >
        <MediaImage
          src={parentSrc}
          size={72}
          shape='circle'
          aria-label='Spinner'
        />
      </DotIcon>
    </div>
  ),
};
