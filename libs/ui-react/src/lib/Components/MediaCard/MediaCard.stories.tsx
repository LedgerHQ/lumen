import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import { MediaCard, MediaCardTitle } from './MediaCard';

const meta = {
  component: MediaCard,
  subcomponents: { MediaCardTitle },
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
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="Label" size="md" />
  <MediaCardTitle>
    <span>Black Friday sale. </span>
    <span className="text-interactive">3 days with no fees </span>
    <span>on your transactions.</span>
  </MediaCardTitle>
</MediaCard>`.trim(),
      },
    },
  },
  render: (args) => (
    <div className='w-full xs:w-320'>
      <MediaCard
        imageUrl={args.imageUrl}
        onClick={args.onClick}
        onClose={args.onClose}
      >
        <Tag label='Label' size='md' />
        <MediaCardTitle>
          <span>Black Friday sale. </span>
          <span className='text-interactive'>3 days with no fees </span>
          <span>on your transactions.</span>
        </MediaCardTitle>
      </MediaCard>
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
  className="w-fit"
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="Label" size="md" />
  <MediaCardTitle>Fit displayed content</MediaCardTitle>
</MediaCard>

<MediaCard
  imageUrl="/promo.jpg"
  className="w-320"
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="Label" size="md" />
  <MediaCardTitle>Defined width (320px)</MediaCardTitle>
</MediaCard>

<MediaCard
  imageUrl="/promo.jpg"
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="Label" size="md" />
  <MediaCardTitle>Full width (fills parent)</MediaCardTitle>
</MediaCard>`.trim(),
      },
    },
  },
  render: () => (
    <div className='flex w-[640px] flex-col gap-16'>
      <MediaCard {...baseArgs} className='w-fit'>
        <Tag label='Label' size='md' />
        <MediaCardTitle>Fit displayed content</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs} className='w-320'>
        <Tag label='Label' size='md' />
        <MediaCardTitle>Defined width (320px)</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <Tag label='Label' size='md' />
        <MediaCardTitle>Full width (fills parent)</MediaCardTitle>
      </MediaCard>
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
  onClick={() => {}}
  onClose={() => {}}
>
  <MediaCardTitle>Title only</MediaCardTitle>
</MediaCard>

{/* With tag */}
<MediaCard
  imageUrl="/promo.jpg"
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="Promo" size="md" />
  <MediaCardTitle>With tag and text</MediaCardTitle>
</MediaCard>

{/* With rich text */}
<MediaCard
  imageUrl="/promo.jpg"
  onClick={() => {}}
  onClose={() => {}}
>
  <Tag label="New" size="md" />
  <MediaCardTitle>
    With<span className="text-interactive"> rich text </span>styling
  </MediaCardTitle>
</MediaCard>

{/* With crypto icon */}
<MediaCard
  imageUrl="/promo.jpg"
  onClick={() => {}}
  onClose={() => {}}
>
  <CryptoIcon ledgerId="bitcoin" ticker="BTC" size={32} />
  <MediaCardTitle>With crypto icon</MediaCardTitle>
</MediaCard>`.trim(),
      },
    },
  },
  render: () => (
    <div className='flex w-400 flex-col gap-16'>
      <MediaCard {...baseArgs}>
        <MediaCardTitle>Title only</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <Tag label='Promo' size='md' />
        <MediaCardTitle>With tag and text</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <Tag label='New' size='md' />
        <MediaCardTitle>
          With<span className='text-interactive'> rich text </span>styling
        </MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />
        <MediaCardTitle>With crypto icon</MediaCardTitle>
      </MediaCard>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onClick={() => setVisible(true)}
        >
          Show card again
        </Button>
      );
    }

    return (
      <div className='w-320'>
        <MediaCard
          imageUrl={EXAMPLE_SRC}
          onClick={() => ({})}
          onClose={() => setVisible(false)}
        >
          <Tag label='Label' size='md' />
          <MediaCardTitle>
            <span>Black Friday sale. </span>
            <span className='text-interactive'>3 days with no fees </span>
            <span>on your transactions.</span>
          </MediaCardTitle>
        </MediaCard>
      </div>
    );
  },
};
