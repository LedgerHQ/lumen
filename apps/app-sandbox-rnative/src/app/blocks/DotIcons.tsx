import {
  Box,
  DotIcon,
  mediaImageDotIconSizeMap,
  MediaImage,
  Spinner,
} from '@ledgerhq/lumen-ui-rnative';
import { ArrowDown, ArrowUp, Link } from '@ledgerhq/lumen-ui-rnative/symbols';

export const DotIcons = () => {
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
        {/* DotIcon */}
        <DotIcon
          appearance='success'
          icon={ArrowDown}
          size={mediaImageDotIconSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/USDC.png'
            alt='USDC'
            size={48}
            shape='circle'
          />
        </DotIcon>

        <DotIcon
          appearance='muted'
          icon={ArrowUp}
          size={mediaImageDotIconSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/ETH.png'
            alt='Ethereum'
            size={48}
            shape='circle'
          />
        </DotIcon>

        <DotIcon
          appearance='error'
          icon={Spinner}
          size={mediaImageDotIconSizeMap[48]}
          pin='bottom-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={48}
            shape='circle'
          />
        </DotIcon>

        <DotIcon
          appearance='muted'
          icon={Link}
          size={mediaImageDotIconSizeMap[40]}
          pin='bottom-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/USDC.png'
            alt='USDC'
            size={40}
            shape='circle'
          />
        </DotIcon>

        <DotIcon
          appearance='success'
          icon={ArrowDown}
          size={mediaImageDotIconSizeMap[64]}
          pin='top-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/ETH.png'
            alt='Ethereum'
            size={64}
            shape='circle'
          />
        </DotIcon>

        <DotIcon
          appearance='success'
          icon={ArrowDown}
          size={mediaImageDotIconSizeMap[48]}
          shape='square'
          pin='bottom-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/BTC.png'
            alt='Bitcoin'
            size={48}
            shape='square'
          />
        </DotIcon>

        <DotIcon
          appearance='muted'
          icon={Link}
          size={mediaImageDotIconSizeMap[40]}
          shape='square'
          pin='top-start'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/USDT.png'
            alt='Tether'
            size={40}
            shape='square'
          />
        </DotIcon>

        <DotIcon
          appearance='error'
          icon={ArrowUp}
          size={mediaImageDotIconSizeMap[64]}
          shape='square'
          pin='top-end'
        >
          <MediaImage
            src='https://crypto-icons.ledger.com/SOL.png'
            alt='Solana'
            size={64}
            shape='square'
          />
        </DotIcon>
      </Box>
    </Box>
  );
};
