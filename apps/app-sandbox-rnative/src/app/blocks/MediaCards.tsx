import {
  Box,
  MediaCard,
  MediaCardTitle,
  Tag,
} from '@ledgerhq/lumen-ui-rnative';

const EXAMPLE_SRC =
  'https://ledger-wp-website-s3-prd.ledger.com/uploads/2026/03/hero_visual-1.webp';

export const MediaCards = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's12', width: 'full' }}>
      <MediaCard
        imageUrl={EXAMPLE_SRC}
        onPress={() => ({})}
        onClose={() => ({})}
      >
        <Tag label='Promo' size='md' />
        <MediaCardTitle>
          Black Friday sale. 3 days with no fees on your transactions.
        </MediaCardTitle>
      </MediaCard>

      <MediaCard
        imageUrl={EXAMPLE_SRC}
        onPress={() => ({})}
        onClose={() => ({})}
      >
        <MediaCardTitle>Secure your crypto assets</MediaCardTitle>
        Get started with Ledger and protect your digital assets today.
      </MediaCard>
    </Box>
  );
};
