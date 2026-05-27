import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader } from '../shared';

const meta: Meta = {
  title: 'Foundations/Styles/Gradients',
};

export default meta;
type Story = StoryObj;

const GradientShowcase = () => (
  <div className='mb-32'>
    <div className='space-y-32'>
      <div>
        <h4 className='mb-16 heading-5 text-base'>Directional Gradients</h4>
        <div className='grid grid-cols-1 gap-16 sm:grid-cols-2'>
          {[
            { name: 'Top', class: 'bg-gradient-top' },
            { name: 'Bottom', class: 'bg-gradient-bottom' },
          ].map(({ name, class: gradientClass }) => (
            <div key={name}>
              <div
                className={`h-96 rounded-lg border border-muted-subtle ${gradientClass}`}
              />
              <div className='mt-8 body-2 text-base'>{name}</div>
              <div className='mt-8 body-4 text-muted'>{gradientClass}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className='mb-16 heading-5 text-base'>Status Gradients</h4>
        <div className='grid grid-cols-1 gap-16 sm:grid-cols-3'>
          {[
            { name: 'Error', class: 'bg-gradient-error' },
            { name: 'Success', class: 'bg-gradient-success' },
            { name: 'Muted', class: 'bg-gradient-muted' },
          ].map(({ name, class: gradientClass }) => (
            <div key={name}>
              <div
                className={`h-224 rounded-lg border border-muted-subtle ${gradientClass}`}
              />
              <div className='mt-8 body-2 text-base'>{name}</div>
              <div className='mt-8 body-4 text-muted'>{gradientClass}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className='mb-16 heading-5 text-base'>Asset Gradients</h4>
        <div className='grid grid-cols-2 gap-16 sm:grid-cols-3 lg:grid-cols-6'>
          {[
            { name: 'Aion', class: 'bg-gradient-aion' },
            { name: 'Algorand', class: 'bg-gradient-algorand' },
            { name: 'Avalanche', class: 'bg-gradient-avax' },
            { name: 'BAT', class: 'bg-gradient-bat' },
            { name: 'BGB', class: 'bg-gradient-bgb' },
            { name: 'Bitcoin', class: 'bg-gradient-bitcoin' },
            { name: 'Bitcoin Cash', class: 'bg-gradient-bitcoin-cash' },
            { name: 'Bitcoin Gold', class: 'bg-gradient-bitcoin-gold' },
            { name: 'Bitcoin SV', class: 'bg-gradient-bitcoin-sv' },
            { name: 'Binance', class: 'bg-gradient-binance' },
            { name: 'Bytecoin', class: 'bg-gradient-bytecoin' },
            { name: 'Cardano', class: 'bg-gradient-cardano' },
            { name: 'Celo', class: 'bg-gradient-celo' },
            { name: 'Chainlink', class: 'bg-gradient-chainlink' },
            { name: 'Compound', class: 'bg-gradient-compound' },
            { name: 'Cosmos', class: 'bg-gradient-cosmos' },
            { name: 'CRO', class: 'bg-gradient-cro' },
            { name: 'DAI', class: 'bg-gradient-dai' },
            { name: 'Dash', class: 'bg-gradient-dash' },
            { name: 'Decred', class: 'bg-gradient-decred' },
            { name: 'Digibyte', class: 'bg-gradient-digibyte' },
            { name: 'Dogecoin', class: 'bg-gradient-dogecoin' },
            { name: 'dYdX', class: 'bg-gradient-dydx' },
            { name: 'Dymension', class: 'bg-gradient-dym' },
            { name: 'Elrond', class: 'bg-gradient-elrond' },
            { name: 'Enigma', class: 'bg-gradient-eng' },
            { name: 'EOS', class: 'bg-gradient-eos' },
            { name: 'EtherGem', class: 'bg-gradient-ethergem' },
            { name: 'Ethereum', class: 'bg-gradient-ethereum' },
            { name: 'Ethereum Classic', class: 'bg-gradient-ethereum-classic' },
            { name: 'Fantom', class: 'bg-gradient-ftm' },
            { name: 'Flare', class: 'bg-gradient-flr' },
            { name: 'Hedera', class: 'bg-gradient-hedera' },
            { name: 'Helium', class: 'bg-gradient-hnt' },
            { name: 'Huobi', class: 'bg-gradient-huobi' },
            { name: 'IOTA', class: 'bg-gradient-iota' },
            { name: 'Komodo', class: 'bg-gradient-komodo' },
            { name: 'LEO', class: 'bg-gradient-leo' },
            { name: 'Litecoin', class: 'bg-gradient-litecoin' },
            { name: 'Mixin', class: 'bg-gradient-xin' },
            { name: 'Monero', class: 'bg-gradient-monero' },
            { name: 'MultiversX', class: 'bg-gradient-multiverse-x' },
            { name: 'Nano', class: 'bg-gradient-nano' },
            { name: 'Near', class: 'bg-gradient-near' },
            { name: 'NEO', class: 'bg-gradient-neo' },
            { name: 'Nimiq', class: 'bg-gradient-nimiq' },
            { name: 'OKB', class: 'bg-gradient-okb' },
            { name: 'OMG Network', class: 'bg-gradient-omg-network' },
            { name: 'Osmosis', class: 'bg-gradient-osmo' },
            { name: 'Peercoin', class: 'bg-gradient-peercoin' },
            { name: 'Pirl', class: 'bg-gradient-pirl' },
            { name: 'PIVX', class: 'bg-gradient-pivx' },
            { name: 'Polkadot', class: 'bg-gradient-polkadot' },
            { name: 'Polygon', class: 'bg-gradient-polygon' },
            { name: 'Sats', class: 'bg-gradient-sats' },
            { name: 'Solana', class: 'bg-gradient-sol' },
            { name: 'Stellar', class: 'bg-gradient-stellar' },
            { name: 'Tezos', class: 'bg-gradient-tezos' },
            { name: 'TKX', class: 'bg-gradient-tkx' },
            { name: 'Tron', class: 'bg-gradient-tron' },
            { name: 'TrueUSD', class: 'bg-gradient-tusd' },
            { name: 'UNI', class: 'bg-gradient-uni' },
            { name: 'Uniswap', class: 'bg-gradient-uniswap' },
            { name: 'USDC', class: 'bg-gradient-usdc' },
            { name: 'USDT', class: 'bg-gradient-tether-usdt' },
            { name: 'Waves', class: 'bg-gradient-waves' },
            { name: 'XRP', class: 'bg-gradient-xrp' },
            { name: 'Yieldly', class: 'bg-gradient-yieldly' },
            { name: 'Zcash', class: 'bg-gradient-zcash' },
          ].map(({ name, class: gradientClass }) => (
            <div key={name}>
              <div
                className={`h-64 rounded-lg border border-muted-subtle ${gradientClass}`}
              />
              <div className='mt-8 body-2 text-base'>{name}</div>
              <div className='mt-8 body-4 text-muted'>{gradientClass}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const Gradients: Story = {
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Gradients'
        description='Tailwind classes for controlling the gradient of an element.'
      />
      <GradientShowcase />
    </div>
  ),
};
