import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { MediaImageGroup } from './MediaImageGroup';

const imports = [
  "import { MediaImageGroup } from '@ledgerhq/lumen-ui-react'",
  "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
];

figma.connect(
  MediaImageGroup,
  'https://www.figma.com/design/UCnMvFYyI50pCA2yJEcpXt?node-id=7970-737',
  {
    imports,
    props: {
      data: figma.enum('amount', {
        '2': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
        ],
        '3': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'solana', ledgerId: 'solana', ticker: 'SOL' },
        ],
        '4': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'solana', ledgerId: 'solana', ticker: 'SOL' },
          { id: 'cardano', ledgerId: 'cardano', ticker: 'ADA' },
        ],
        '4+': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'solana', ledgerId: 'solana', ticker: 'SOL' },
          { id: 'cardano', ledgerId: 'cardano', ticker: 'ADA' },
          { id: 'polkadot', ledgerId: 'polkadot', ticker: 'DOT' },
          { id: 'ripple', ledgerId: 'ripple', ticker: 'XRP' },
          { id: 'dogecoin', ledgerId: 'dogecoin', ticker: 'DOGE' },
          { id: 'litecoin', ledgerId: 'litecoin', ticker: 'LTC' },
          { id: 'tron', ledgerId: 'tron', ticker: 'TRX' },
        ],
      }),
      disabled: figma.enum('state', { disabled: true }),
    },
    example: (props) => (
      <MediaImageGroup
        size={16} // replace with the correct size 16, 24, 32, 40, 56
        shape='circle' // square, circle
        data={props.data}
        renderItem={(asset, { size, shape }) => (
          <CryptoIcon
            ledgerId={asset.ledgerId}
            ticker={asset.ticker}
            size={size}
            shape={shape}
            disabled={props.disabled}
          />
        )}
      />
    ),
  },
);

figma.connect(
  MediaImageGroup,
  'https://www.figma.com/design/UCnMvFYyI50pCA2yJEcpXt?node-id=6330-1183',
  {
    imports,
    props: {
      data: figma.enum('amount', {
        '2': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
        ],
        '3': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'bsc', ledgerId: 'bsc', ticker: 'BNB' },
        ],
        '4': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'bsc', ledgerId: 'bsc', ticker: 'BNB' },
          { id: 'algorand', ledgerId: 'algorand', ticker: 'ALGO' },
        ],
        '4+': [
          { id: 'bitcoin', ledgerId: 'bitcoin', ticker: 'BTC' },
          { id: 'ethereum', ledgerId: 'ethereum', ticker: 'ETH' },
          { id: 'bsc', ledgerId: 'bsc', ticker: 'BNB' },
          { id: 'algorand', ledgerId: 'algorand', ticker: 'ALGO' },
          { id: 'bitcoin_cash', ledgerId: 'bitcoin_cash', ticker: 'BCH' },
          { id: 'polkadot', ledgerId: 'polkadot', ticker: 'DOT' },
          { id: 'cosmos', ledgerId: 'cosmos', ticker: 'ATOM' },
          { id: 'solana', ledgerId: 'solana', ticker: 'SOL' },
          { id: 'tron', ledgerId: 'tron', ticker: 'TRX' },
        ],
      }),
      disabled: figma.enum('state', { disabled: true }),
    },
    example: (props) => (
      <MediaImageGroup
        size={16} // replace with the correct size 12, 16, 20, 24, 32, 40, 48, 56, 64, 72
        shape='square' // square, circle
        data={props.data}
        renderItem={(network, { size, shape }) => (
          <CryptoIcon
            ledgerId={network.ledgerId}
            ticker={network.ticker}
            size={size}
            shape={shape}
            disabled={props.disabled}
          />
        )}
      />
    ),
  },
);
