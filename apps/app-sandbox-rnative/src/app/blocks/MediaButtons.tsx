import { Box, MediaButton, MediaImage } from '@ledgerhq/lumen-ui-rnative';
import { Star } from '@ledgerhq/lumen-ui-rnative/symbols';

export const MediaButtons = () => {
  return (
    <Box lx={{ gap: 's16' }}>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <MediaButton size='sm' icon={<Star size={20} />} iconType='flat'>
          Small
        </MediaButton>
        <MediaButton size='md' icon={<Star size={20} />} iconType='flat'>
          Medium
        </MediaButton>
      </Box>
      <Box lx={{ gap: 's16', flexDirection: 'row' }}>
        <MediaButton
          size='sm'
          icon={
            <MediaImage
              src='https://crypto-icons.ledger.com/BTC.png'
              alt='BTC'
              size={24}
              shape='circle'
            />
          }
          iconType='rounded'
          hideChevron
        >
          Small
        </MediaButton>
        <MediaButton
          size='md'
          icon={
            <MediaImage
              src='https://crypto-icons.ledger.com/BTC.png'
              alt='BTC'
              size={32}
              shape='circle'
            />
          }
          iconType='rounded'
          hideChevron
        >
          Medium
        </MediaButton>
      </Box>
    </Box>
  );
};
