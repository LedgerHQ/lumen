import {
  Box,
  MediaCard,
  MediaCardDescription,
  MediaCardLeadingContent,
  MediaCardTitle,
  MediaCardTrailingContent,
  Tag,
} from '@ledgerhq/lumen-ui-rnative';

const EXAMPLE_SRC =
  'https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

export const MediaCards = () => {
  return (
    <Box lx={{ flexDirection: 'column', gap: 's12', width: 'full' }}>
      <MediaCard
        imageUrl={EXAMPLE_SRC}
        onPress={() => ({})}
        onClose={() => ({})}
      >
        <MediaCardLeadingContent>
          <Tag label='Promo' size='md' />
        </MediaCardLeadingContent>
        <MediaCardTrailingContent>
          <MediaCardTitle>
            Black Friday sale. 3 days with no fees on your transactions.
          </MediaCardTitle>
        </MediaCardTrailingContent>
      </MediaCard>

      <MediaCard
        imageUrl={EXAMPLE_SRC}
        onPress={() => ({})}
        onClose={() => ({})}
      >
        <MediaCardTrailingContent>
          <MediaCardTitle>Secure your crypto assets</MediaCardTitle>
          <MediaCardDescription>
            Get started with Ledger and protect your digital assets today.
          </MediaCardDescription>
        </MediaCardTrailingContent>
      </MediaCard>
    </Box>
  );
};
