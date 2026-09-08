import {
  Box,
  DotIcon,
  getDotIconProps,
  MediaImage,
  Spinner,
} from '@ledgerhq/lumen-ui-rnative';
import { ArrowDown, ArrowUp, Link } from '@ledgerhq/lumen-ui-rnative/symbols';

export default function DotIcons() {
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
          pin='bottom-end'
          {...getDotIconProps('mediaImage', 48)}
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
          pin='bottom-end'
          {...getDotIconProps('mediaImage', 48)}
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
          pin='bottom-end'
          {...getDotIconProps('mediaImage', 48)}
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
          pin='bottom-end'
          {...getDotIconProps('mediaImage', 40)}
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
          pin='top-end'
          {...getDotIconProps('mediaImage', 64)}
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
          shape='square'
          pin='bottom-end'
          {...getDotIconProps('mediaImage', 48)}
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
          shape='square'
          pin='top-start'
          {...getDotIconProps('mediaImage', 40)}
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
          shape='square'
          pin='top-end'
          {...getDotIconProps('mediaImage', 64)}
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
}
