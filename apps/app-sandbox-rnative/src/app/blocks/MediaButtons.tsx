import { Box, MediaButton, MediaImage } from '@ledgerhq/lumen-ui-rnative';
import { Star } from '@ledgerhq/lumen-ui-rnative/symbols';

export const MediaButtons = () => {
  return (
    <Box lx={{ gap: 's16' }}>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <MediaButton
          size='sm'
          leadingContent={<Star size={20} />}
          leadingContentShape='flat'
        >
          Small
        </MediaButton>
        <MediaButton
          size='md'
          leadingContent={<Star size={20} />}
          leadingContentShape='flat'
        >
          Medium
        </MediaButton>
      </Box>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <MediaButton
          size='sm'
          leadingContent={
            <MediaImage
              src='https://crypto-icons.ledger.com/BTC.png'
              alt='BTC'
              size={24}
              shape='circle'
            />
          }
          leadingContentShape='rounded'
          hideChevron
        >
          Small
        </MediaButton>
        <MediaButton
          size='md'
          leadingContent={
            <MediaImage
              src='https://crypto-icons.ledger.com/BTC.png'
              alt='BTC'
              size={32}
              shape='circle'
            />
          }
          leadingContentShape='rounded'
          hideChevron
        >
          Medium
        </MediaButton>
      </Box>
    </Box>
  );
};
