import { Box, MediaImage } from '@ledgerhq/lumen-ui-rnative';

export const ImageMedias = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <MediaImage
        src='https://crypto-icons.ledger.com/BTC.png'
        alt='Bitcoin'
        size={48}
        shape='square'
      />
      <MediaImage
        src='https://crypto-icons.ledger.com/ETH.png'
        alt='Ethereum'
        size={24}
        shape='square'
      />
      <MediaImage
        src='https://crypto-icons.ledger.com/BTC.png'
        alt='Bitcoin'
        size={48}
        shape='circle'
      />
      <MediaImage
        src='https://crypto-icons.ledger.com/USDC.png'
        alt='USDC'
        size={24}
        shape='circle'
      />
    </Box>
  );
};
