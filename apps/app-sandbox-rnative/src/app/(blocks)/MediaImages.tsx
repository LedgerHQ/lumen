import { Box, MediaImage, MediaImageGroup } from '@ledgerhq/lumen-ui-rnative';

const assets = [
  { src: 'https://crypto-icons.ledger.com/BTC.png', id: 'btc', alt: 'Bitcoin' },
  {
    src: 'https://crypto-icons.ledger.com/ETH.png',
    id: 'eth',
    alt: 'Ethereum',
  },
  { src: 'https://crypto-icons.ledger.com/ADA.png', id: 'ada', alt: 'Cardano' },
  { src: 'https://crypto-icons.ledger.com/SOL.png', id: 'sol', alt: 'Solana' },
  {
    src: 'https://crypto-icons.ledger.com/DOT.png',
    id: 'dot',
    alt: 'Polkadot',
  },
  { src: 'https://crypto-icons.ledger.com/XRP.png', id: 'xrp', alt: 'XRP' },
];

export default function MediaImages() {
  return (
    <Box lx={{ gap: 's32' }}>
      <MediaImage
        src='https://crypto-icons.ledger.com/BTC.png'
        alt='Bitcoin'
        size={48}
        shape='square'
      />
      <MediaImage
        loading={true}
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
      <MediaImage
        src='https://crypto-icons.ledger.com/ETH.png'
        alt='Ethereum'
        size={64}
        shape='circle'
      />
      <MediaImage fallback='Bitcoin' size={48} shape='square' />
      <MediaImage
        src='https://crypto-icons.ledger.com/INVALID.png'
        alt='Ethereum'
        fallback='Ethereum'
        size={48}
        shape='circle'
      />
      <MediaImageGroup data={assets.slice(0, 3)} size={32} />
      <MediaImageGroup data={assets} size={24} maxVisible={4} />
      <MediaImageGroup data={assets} size={48} shape='square' maxVisible={4} />
      <MediaImageGroup data={assets} size={72} maxVisible={3} />
      <MediaImageGroup
        data={[
          { id: 'btc', fallback: 'Bitcoin' },
          { id: 'eth', fallback: 'Ethereum' },
          { id: 'loading', loading: true },
        ]}
        size={40}
      />
      <MediaImageGroup
        data={assets}
        size={40}
        renderItem={(asset, { size, shape }) => (
          <MediaImage
            src={asset.src}
            alt={asset.alt}
            size={size}
            shape={shape}
            disabled={asset.alt === 'Cardano'}
          />
        )}
      />
    </Box>
  );
}
