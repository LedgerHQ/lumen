import {
  Box,
  DotSymbol,
  mediaImageDotSizeMap,
  MediaImage,
  Spot,
  spotDotSizeMap,
} from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export const DotSymbols = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's32',
          alignItems: 'flex-end',
        }}
      >
        <DotSymbol
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          pin='bottom-end'
          size={mediaImageDotSizeMap[48]}
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
          pin='bottom-start'
          size={mediaImageDotSizeMap[56]}
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/USDC.png'
            alt='USDC'
            size={56}
            shape='circle'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          pin='top-start'
          size={mediaImageDotSizeMap[40]}
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/XRP.png'
            alt='XRP'
            size={40}
            shape='circle'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/AVAX.png'
          alt='Avalanche'
          pin='top-end'
          size={mediaImageDotSizeMap[64]}
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/ADA.png'
            alt='Cardano'
            size={64}
            shape='circle'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          pin='top-end'
          size={spotDotSizeMap[48]}
        >
          <Spot appearance='icon' icon={ExternalLink} size={48} />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/BTC.png'
          alt='Bitcoin'
          pin='bottom-end'
          size={mediaImageDotSizeMap[40]}
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
          pin='bottom-end'
          size={mediaImageDotSizeMap[48]}
          shape='square'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={48}
            shape='square'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/USDC.png'
          alt='USD Coin'
          pin='top-start'
          size={mediaImageDotSizeMap[40]}
          shape='square'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/XRP.png'
            alt='XRP'
            size={40}
            shape='square'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/AVAX.png'
          alt='Avalanche'
          pin='top-end'
          size={mediaImageDotSizeMap[64]}
          shape='square'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/ADA.png'
            alt='Cardano'
            size={64}
            shape='square'
          />
        </DotSymbol>

        <DotSymbol
          src='https://crypto-icons.ledger.com/DOGE.png'
          alt='Dogecoin'
          pin='bottom-start'
          size={mediaImageDotSizeMap[56]}
          shape='square'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/TRX.png'
            alt='Tron'
            size={56}
            shape='square'
          />
        </DotSymbol>
      </Box>
    </Box>
  );
};
