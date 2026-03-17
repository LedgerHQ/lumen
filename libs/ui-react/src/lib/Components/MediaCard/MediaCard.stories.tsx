import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from '../Tag/Tag';
import { MediaCard } from './MediaCard';

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
  onClick: () => ({}),
  onClose: () => ({}),
};

export const Base: Story = {
  args: baseArgs,
  parameters: {
    docs: {
      source: {
        code: `
<MediaCard
  imageUrl="/promo.jpg"
  text={
    <>
      <span>Black Friday sale. </span>
      <span className="text-interactive">3 days with no fees </span>
      <span>on your transactions.</span>
    </>
  }
  leadingContent={<Tag label="Label" size="md" />}
  onClick={() => {}}
  onClose={() => {}}
/>`.trim(),
      },
    },
  },
  render: (args) => (
    <div className='w-full xs:w-320'>
      <MediaCard
        imageUrl={args.imageUrl}
        onClick={args.onClick}
        onClose={args.onClose}
        leadingContent={<Tag label='Label' size='md' />}
        text={
          <>
            <span>Black Friday sale. </span>
            <span className='text-interactive'>3 days with no fees </span>
            <span>on your transactions.</span>
          </>
        }
      />
    </div>
  ),
};

export const LayoutShowcase: Story = {
  parameters: {
    docs: {
      source: {
        code: `
<MediaCard
  imageUrl="/promo.jpg"
  text="Fit displayed content"
  leadingContent={<Tag label="Label" size="md" />}
  className="w-fit"
  onClick={() => {}}
  onClose={() => {}}
/>

<MediaCard
  imageUrl="/promo.jpg"
  text="Defined width (320px)"
  leadingContent={<Tag label="Label" size="md" />}
  className="w-320"
  onClick={() => {}}
  onClose={() => {}}
/>

<MediaCard
  imageUrl="/promo.jpg"
  text="Full width (fills parent)"
  leadingContent={<Tag label="Label" size="md" />}
  onClick={() => {}}
  onClose={() => {}}
/>`.trim(),
      },
    },
  },
  render: () => (
    <div className='flex w-[640px] flex-col gap-16'>
      <MediaCard
        {...baseArgs}
        text='Fit displayed content'
        leadingContent={<Tag label='Label' size='md' />}
        className='w-fit'
      />

      <MediaCard
        {...baseArgs}
        text='Defined width (320px)'
        leadingContent={<Tag label='Label' size='md' />}
        className='w-320'
      />

      <MediaCard
        {...baseArgs}
        text='Full width (fills parent)'
        leadingContent={<Tag label='Label' size='md' />}
      />
    </div>
  ),
};

export const CompositionShowcase: Story = {
  parameters: {
    docs: {
      source: {
        code: `
{/* Title only */}
<MediaCard
  imageUrl="/promo.jpg"
  text="Title only"
  onClick={() => {}}
  onClose={() => {}}
/>

{/* With tag */}
<MediaCard
  imageUrl="/promo.jpg"
  text="With tag and text"
  leadingContent={<Tag label="Promo" size="md" />}
  onClick={() => {}}
  onClose={() => {}}
/>

{/* With rich text */}
<MediaCard
  imageUrl="/promo.jpg"
  text={
    <>
      With<span className="text-interactive"> rich text </span>styling
    </>
  }
  leadingContent={<Tag label="New" size="md" />}
  onClick={() => {}}
  onClose={() => {}}
/>

{/* With crypto icon */}
<MediaCard
  imageUrl="/promo.jpg"
  text="With crypto icon"
  leadingContent={<CryptoIcon ledgerId="bitcoin" ticker="BTC" size="32px" />}
  onClick={() => {}}
  onClose={() => {}}
/>`.trim(),
      },
    },
  },
  render: () => (
    <div className='flex w-400 flex-col gap-16'>
      <MediaCard {...baseArgs} text='Title only' />

      <MediaCard
        {...baseArgs}
        text='With tag and text'
        leadingContent={<Tag label='Promo' size='md' />}
      />

      <MediaCard
        {...baseArgs}
        text={
          <>
            With<span className='text-interactive'> rich text </span>styling
          </>
        }
        leadingContent={<Tag label='New' size='md' />}
      />

      <MediaCard
        {...baseArgs}
        text='With crypto icon'
        leadingContent={
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
        }
      />
    </div>
  ),
};
