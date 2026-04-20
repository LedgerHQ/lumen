import { Box, DotSymbol, MediaImage, Spot } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export const DotSymbols = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <DotSymbol
        src='https://crypto-icons.ledger.com/ETH.png'
        alt='Ethereum'
        pin='bottom-end'
        size={20}
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/USDC.png'
          alt='USDC'
          size={48}
          shape='circle'
        />
      </DotSymbol>

      <DotSymbol
        src='https://crypto-icons.ledger.com/BTC.png'
        alt='Bitcoin'
        pin='bottom-end'
        size={16}
        shape='square'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          size={40}
          shape='square'
        />
      </DotSymbol>

      <DotSymbol
        src='https://crypto-icons.ledger.com/ETH.png'
        alt='Ethereum'
        pin='top-end'
        size={12}
      >
        <Spot appearance='icon' icon={ExternalLink} size={48} />
      </DotSymbol>

      <DotSymbol
        src='https://crypto-icons.ledger.com/BTC.png'
        alt='Bitcoin'
        pin='bottom-start'
        size={24}
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/USDC.png'
          alt='USDC'
          size={56}
          shape='circle'
        />
      </DotSymbol>
    </Box>
  );
};
