import {
  Box,
  DotSymbol,
  iconDotSizeMap,
  MediaImage,
  Spot,
} from '@ledgerhq/lumen-ui-rnative';
import {
  ArrowDown,
  ArrowUp,
  Close,
  ExternalLink,
  Link,
} from '@ledgerhq/lumen-ui-rnative/symbols';

export const DotSymbols = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      {/* Image variant */}
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

      {/* Icon variant – appearances */}
      <DotSymbol
        type='icon'
        appearance='success'
        icon={ArrowDown}
        size={iconDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/USDC.png'
          alt='USDC'
          size={48}
          shape='circle'
        />
      </DotSymbol>

      <DotSymbol
        type='icon'
        appearance='muted'
        icon={ArrowUp}
        size={iconDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          size={48}
          shape='circle'
        />
      </DotSymbol>

      <DotSymbol
        type='icon'
        appearance='error'
        icon={Close}
        size={iconDotSizeMap[48]}
        pin='bottom-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/BTC.png'
          alt='Bitcoin'
          size={48}
          shape='circle'
        />
      </DotSymbol>

      {/* Icon variant – different sizes */}
      <DotSymbol
        type='icon'
        appearance='muted'
        icon={Link}
        size={iconDotSizeMap[40]}
        pin='bottom-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/USDC.png'
          alt='USDC'
          size={40}
          shape='circle'
        />
      </DotSymbol>

      <DotSymbol
        type='icon'
        appearance='success'
        icon={ArrowDown}
        size={iconDotSizeMap[64]}
        pin='top-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/ETH.png'
          alt='Ethereum'
          size={64}
          shape='circle'
        />
      </DotSymbol>

      {/* Icon variant – square shape */}
      <DotSymbol
        type='icon'
        appearance='success'
        icon={ArrowDown}
        size={iconDotSizeMap[48]}
        shape='square'
        pin='bottom-end'
      >
        <MediaImage
          src='https://crypto-icons.ledger.com/BTC.png'
          alt='Bitcoin'
          size={48}
          shape='square'
        />
      </DotSymbol>
    </Box>
  );
};
