import type { Meta, StoryObj } from '@storybook/react-vite';
import { SectionHeader, ColorSection } from '../shared';

const meta: Meta = {
  title: 'Foundations/Colors',
  globals: { backgrounds: { grid: true } },
  parameters: {
    backgrounds: {
      grid: {
        cellSize: 20,
        opacity: 0.2,
        cellAmount: 5,
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Background: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Background Colors'
        description='Tailwind classes for controlling the background color of an element.'
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Canvas',
            className: 'bg-canvas',
            textClassName: 'text-base',
          },
          {
            name: 'Canvas Muted',
            className: 'bg-canvas-muted',
            textClassName: 'text-base',
          },
          {
            name: 'Canvas Sheet',
            className: 'bg-canvas-sheet',
            textClassName: 'text-base',
          },
          {
            name: 'Canvas Sheet Transparent',
            className: 'bg-canvas-sheet-transparent',
            textClassName: 'text-base',
          },
          {
            name: 'Canvas Overlay',
            className: 'bg-canvas-overlay',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          { name: 'Base', className: 'bg-base', textClassName: 'text-base' },
          {
            name: 'Base Hover',
            className: 'bg-base-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Base Pressed',
            className: 'bg-base-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Base Transparent',
            className: 'bg-base-transparent',
            textClassName: 'text-base',
          },
          {
            name: 'Base Transparent Hover',
            className: 'bg-base-transparent-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Base Transparent Pressed',
            className: 'bg-base-transparent-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          { name: 'Muted', className: 'bg-muted', textClassName: 'text-base' },
          {
            name: 'Muted Hover',
            className: 'bg-muted-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Pressed',
            className: 'bg-muted-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Muted Transparent',
            className: 'bg-muted-transparent',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Transparent Hover',
            className: 'bg-muted-transparent-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Transparent Pressed',
            className: 'bg-muted-transparent-pressed',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Transparent Disabled',
            className: 'bg-muted-transparent-disabled',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Muted Strong',
            className: 'bg-muted-strong',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Strong Hover',
            className: 'bg-muted-strong-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Muted Strong Pressed',
            className: 'bg-muted-strong-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Accent',
            className: 'bg-accent',
            textClassName: 'text-base',
          },
          {
            name: 'Accent Hover',
            className: 'bg-accent-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Accent Pressed',
            className: 'bg-accent-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Interactive',
            className: 'bg-interactive',
            textClassName: 'text-base',
          },
          {
            name: 'Interactive Hover',
            className: 'bg-interactive-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Interactive Pressed',
            className: 'bg-interactive-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          { name: 'Error', className: 'bg-error', textClassName: 'text-base' },
          {
            name: 'Error Strong',
            className: 'bg-error-strong',
            textClassName: 'text-base',
          },
          {
            name: 'Error Transparent',
            className: 'bg-error-transparent',
            textClassName: 'text-base',
          },
          {
            name: 'Warning',
            className: 'bg-warning',
            textClassName: 'text-base',
          },
          {
            name: 'Warning Strong',
            className: 'bg-warning-strong',
            textClassName: 'text-base',
          },
          {
            name: 'Success',
            className: 'bg-success',
            textClassName: 'text-base',
          },
          {
            name: 'Success Strong',
            className: 'bg-success-strong',
            textClassName: 'text-base',
          },
          {
            name: 'Success Transparent',
            className: 'bg-success-transparent',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Active',
            className: 'bg-active',
            textClassName: 'text-base',
          },
          {
            name: 'Active Hover',
            className: 'bg-active-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Active Pressed',
            className: 'bg-active-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Active Subtle',
            className: 'bg-active-subtle',
            textClassName: 'text-base',
          },
          {
            name: 'Active Subtle Hover',
            className: 'bg-active-subtle-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Active Subtle Pressed',
            className: 'bg-active-subtle-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Surface',
            className: 'bg-surface',
            textClassName: 'text-base',
          },
          {
            name: 'Surface Hover',
            className: 'bg-surface-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Surface Pressed',
            className: 'bg-surface-pressed',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Surface Transparent',
            className: 'bg-surface-transparent',
            textClassName: 'text-base',
          },
          {
            name: 'Surface Transparent Hover',
            className: 'bg-surface-transparent-hover',
            textClassName: 'text-base',
          },
          {
            name: 'Surface Transparent Pressed',
            className: 'bg-surface-transparent-pressed',
            textClassName: 'text-base',
          },
          {
            name: 'Surface Transparent Disabled',
            className: 'bg-surface-transparent-disabled',
            textClassName: 'text-base',
          },
        ]}
      />

      <ColorSection
        category='background'
        tokens={[
          { name: 'White', className: 'bg-white', textClassName: 'text-base' },
          { name: 'Black', className: 'bg-black', textClassName: 'text-base' },
          {
            name: 'Disabled',
            className: 'bg-disabled',
            textClassName: 'text-base',
          },
          {
            name: 'Disabled Strong',
            className: 'bg-disabled-strong',
            textClassName: 'text-base',
          },
        ]}
      />
    </div>
  ),
};

export const Text: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Text Colors'
        description='Tailwind classes for controlling the text color of an element.'
      />
      <ColorSection
        category='text'
        tokens={[
          { name: 'Base', className: '', textClassName: 'text-base' },
          {
            name: 'Base Hover',
            className: '',
            textClassName: 'text-base-hover',
          },
          {
            name: 'Base Pressed',
            className: '',
            textClassName: 'text-base-pressed',
          },
        ]}
      />

      <ColorSection
        category='text'
        tokens={[
          { name: 'Muted', className: '', textClassName: 'text-muted' },
          {
            name: 'Muted Hover',
            className: '',
            textClassName: 'text-muted-hover',
          },
          {
            name: 'Muted Pressed',
            className: '',
            textClassName: 'text-muted-pressed',
          },
          {
            name: 'Muted Subtle',
            className: '',
            textClassName: 'text-muted-subtle',
          },
        ]}
      />
      <ColorSection
        category='text'
        tokens={[
          {
            name: 'interactive',
            className: '',
            textClassName: 'text-interactive',
          },
          {
            name: 'interactive Hover',
            className: '',
            textClassName: 'text-interactive-hover',
          },
          {
            name: 'interactive Pressed',
            className: '',
            textClassName: 'text-interactive-pressed',
          },
        ]}
      />

      <ColorSection
        category='text'
        tokens={[
          { name: 'Error', className: '', textClassName: 'text-error' },
          { name: 'Warning', className: '', textClassName: 'text-warning' },
          { name: 'Success', className: '', textClassName: 'text-success' },
        ]}
      />

      <ColorSection
        category='text'
        tokens={[
          {
            name: 'On Accent',
            className: 'bg-accent',
            textClassName: 'text-on-accent',
          },
          {
            name: 'On Interactive',
            className: 'bg-interactive',
            textClassName: 'text-on-interactive',
          },
          {
            name: 'On Error Strong',
            className: 'bg-error-strong',
            textClassName: 'text-on-error-strong',
          },
          {
            name: 'On Warning Strong',
            className: 'bg-warning-strong',
            textClassName: 'text-on-warning',
          },
          {
            name: 'On success strong',
            className: 'bg-success-strong',
            textClassName: 'text-on-success-strong',
          },
        ]}
      />

      <ColorSection
        category='text'
        tokens={[
          {
            name: 'White',
            className: 'bg-black',
            textClassName: 'text-white',
          },
          {
            name: 'Black',
            className: 'bg-white',
            textClassName: 'text-black',
          },
          {
            name: 'Grey',
            className: 'bg-grey',
            textClassName: 'text-grey',
          },
        ]}
      />

      <ColorSection
        category='text'
        tokens={[
          { name: 'Disabled', className: '', textClassName: 'text-disabled' },
        ]}
      />
      <ColorSection
        category='text'
        tokens={[
          {
            name: 'active',
            className: '',
            textClassName: 'text-active',
          },
        ]}
      />
    </div>
  ),
};

export const Border: Story = {
  render: () => (
    <div className='p-24 transition-colors duration-300'>
      <SectionHeader
        title='Border Colors'
        description='Tailwind classes for controlling the border color of an element.'
      />
      <ColorSection
        category='border'
        tokens={[
          { name: 'Base', className: 'bg-base border-base' },
          { name: 'Base Hover', className: 'bg-base border-base-hover' },
          {
            name: 'Base Pressed',
            className: 'bg-base border-base-pressed',
          },
        ]}
      />

      <ColorSection
        category='border'
        tokens={[
          { name: 'Muted', className: 'bg-base border-muted' },
          {
            name: 'Muted Hover',
            className: 'bg-base border-muted-hover',
          },
          {
            name: 'Muted Pressed',
            className: 'bg-base border-muted-pressed',
          },
          {
            name: 'Muted Subtle',
            className: 'bg-base border-muted-subtle',
          },
        ]}
      />

      <ColorSection
        category='border'
        tokens={[
          { name: 'Error', className: 'bg-base border-error' },
          { name: 'Warning', className: 'bg-base border-warning' },
          { name: 'Success', className: 'bg-base border-success' },
        ]}
      />

      <ColorSection
        category='border'
        tokens={[
          { name: 'Focus', className: 'bg-base border-focus' },
          { name: 'Active', className: 'bg-base border-active' },
        ]}
      />

      <ColorSection
        category='border'
        tokens={[
          { name: 'Black', className: 'bg-base border-black' },
          { name: 'White', className: 'bg-base border-white' },
        ]}
      />

      <ColorSection
        category='border'
        tokens={[{ name: 'Disabled', className: 'bg-base border-disabled' }]}
      />
    </div>
  ),
};

export const Crypto: Story = {
  name: 'Crypto background',
  render: () => (
    <div className='p-24'>
      <SectionHeader
        title='Crypto Colors'
        description='Tailwind classes for crypto colors tokens for different cryptocurrencies'
      />
      <ColorSection
        category='background'
        tokens={[
          {
            name: 'Aion',
            className: 'bg-crypto-aion',
          },
          {
            name: 'Algorand',
            className: 'bg-crypto-algorand',
          },
          {
            name: 'Avalanche',
            className: 'bg-crypto-avax',
          },
          { name: 'BAT', className: 'bg-crypto-bat' },
          { name: 'BGB', className: 'bg-crypto-bgb' },
          {
            name: 'Bitcoin',
            className: 'bg-crypto-bitcoin',
          },
          {
            name: 'Bitcoin Cash',
            className: 'bg-crypto-bitcoin-cash',
          },
          {
            name: 'Bitcoin Gold',
            className: 'bg-crypto-bitcoin-gold',
          },
          {
            name: 'Bitcoin SV',
            className: 'bg-crypto-bitcoin-sv',
          },
          {
            name: 'Binance',
            className: 'bg-crypto-binance',
          },
          {
            name: 'Bytecoin',
            className: 'bg-crypto-bytecoin',
          },
          {
            name: 'Cardano',
            className: 'bg-crypto-cardano',
          },
          {
            name: 'Cosmos',
            className: 'bg-crypto-cosmos',
          },
          {
            name: 'Compound',
            className: 'bg-crypto-compound',
          },
          {
            name: 'Celo',
            className: 'bg-crypto-celo',
            textClassName: 'text-black',
          },
          {
            name: 'Chainlink',
            className: 'bg-crypto-chainlink',
          },
          { name: 'CRO', className: 'bg-crypto-cro' },
          { name: 'Dash', className: 'bg-crypto-dash' },
          { name: 'DAI', className: 'bg-crypto-dai' },
          {
            name: 'Decred',
            className: 'bg-crypto-decred',
          },
          {
            name: 'Digibyte',
            className: 'bg-crypto-digibyte',
          },
          {
            name: 'Dogecoin',
            className: 'bg-crypto-dogecoin',
          },
          { name: 'dYdX', className: 'bg-crypto-dydx' },
          {
            name: 'Dymension',
            className: 'bg-crypto-dym',
            textClassName: 'text-black',
          },
          {
            name: 'Elrond',
            className: 'bg-crypto-elrond',
          },
          { name: 'Enigma', className: 'bg-crypto-eng' },
          { name: 'EOS', className: 'bg-crypto-eos' },
          {
            name: 'EtherGem',
            className: 'bg-crypto-ethergem',
          },
          {
            name: 'Ethereum',
            className: 'bg-crypto-ethereum',
          },
          {
            name: 'Ethereum Classic',
            className: 'bg-crypto-ethereum-classic',
          },
          { name: 'Flare', className: 'bg-crypto-flr' },
          { name: 'Fantom', className: 'bg-crypto-ftm' },
          {
            name: 'Hedera',
            className: 'bg-crypto-hedera',
          },
          { name: 'Helium', className: 'bg-crypto-hnt' },
          { name: 'Huobi', className: 'bg-crypto-huobi' },
          { name: 'IOTA', className: 'bg-crypto-iota' },
          {
            name: 'Komodo',
            className: 'bg-crypto-komodo',
          },
          { name: 'LEO', className: 'bg-crypto-leo' },
          {
            name: 'Litecoin',
            className: 'bg-crypto-litecoin',
          },
          {
            name: 'Monero',
            className: 'bg-crypto-monero',
          },
          {
            name: 'MultiversX',
            className: 'bg-crypto-multiverse-x',
          },
          { name: 'Nano', className: 'bg-crypto-nano' },
          { name: 'Near', className: 'bg-crypto-near' },
          { name: 'NEO', className: 'bg-crypto-neo' },
          { name: 'Nimiq', className: 'bg-crypto-nimiq' },
          {
            name: 'OMG Network',
            className: 'bg-crypto-omg-network',
          },
          { name: 'OKB', className: 'bg-crypto-okb' },
          {
            name: 'Osmosis',
            className: 'bg-crypto-osmo',
          },
          {
            name: 'Peercoin',
            className: 'bg-crypto-peercoin',
          },
          { name: 'Pirl', className: 'bg-crypto-pirl' },
          { name: 'PIVX', className: 'bg-crypto-pivx' },
          {
            name: 'Polkadot',
            className: 'bg-crypto-polkadot',
          },
          {
            name: 'Polygon',
            className: 'bg-crypto-polygon',
          },
          { name: 'Sats', className: 'bg-crypto-sats' },
          {
            name: 'Stellar',
            className: 'bg-crypto-stellar',
          },
          {
            name: 'Solana',
            className: 'bg-crypto-sol',
            textClassName: 'text-base',
          },
          {
            name: 'USDT',
            className: 'bg-crypto-tether-usdt',
          },
          { name: 'Tezos', className: 'bg-crypto-tezos' },
          { name: 'TKX', className: 'bg-crypto-tkx' },
          { name: 'Tron', className: 'bg-crypto-tron' },
          {
            name: 'Uniswap',
            className: 'bg-crypto-uniswap',
          },
          {
            name: 'TrueUSD',
            className: 'bg-crypto-tusd',
          },
          {
            name: 'USDC',
            className: 'bg-crypto-usdc',
            textClassName: 'text-base',
          },
          { name: 'UNI', className: 'bg-crypto-uni' },
          { name: 'Waves', className: 'bg-crypto-waves' },
          { name: 'XRP', className: 'bg-crypto-xrp' },
          { name: 'Mixin', className: 'bg-crypto-xin' },
          {
            name: 'Yieldly',
            className: 'bg-crypto-yieldly',
          },
          { name: 'Zcash', className: 'bg-crypto-zcash' },
        ]}
      />
    </div>
  ),
};

export const Discover: Story = {
  name: 'Discover background',
  render: () => (
    <div className='border p-24'>
      <SectionHeader
        title='Discover Colors'
        description='Tailwind classes for brand colors for discover services and platform integrations'
      />
      <ColorSection
        category='background'
        tokens={[
          {
            name: '1inch',
            className: 'bg-discover-1inch',
            textClassName: 'text-base',
          },
          {
            name: 'Changelly',
            className: 'bg-discover-changelly',
          },
          {
            name: 'Compound',
            className: 'bg-discover-compound',
          },

          {
            name: 'Deversifi',
            className: 'bg-discover-deversifi',
          },
          {
            name: 'Lido',
            className: 'bg-discover-lido',
          },
          {
            name: 'OpenSea',
            className: 'bg-discover-opensea',
          },
          {
            name: 'Paraswap',
            className: 'bg-discover-paraswap',
          },
          {
            name: 'Rarible',
            className: 'bg-discover-rarible',
          },
          {
            name: 'Zerion',
            className: 'bg-discover-zerion',
          },
          {
            name: 'Bitrefill',
            className: 'bg-discover-bitrefill',
          },
          {
            name: 'Loopipay Blue',
            className: 'bg-discover-loopipay-blue',
          },
          {
            name: 'Loopipay Black',
            className: 'bg-discover-loopipay-black',
          },
          {
            name: 'Loopipay Lime',
            className: 'bg-discover-loopipay-lime',
          },
          {
            name: 'Simplex',
            className: 'bg-discover-simplex',
          },
          {
            name: 'Baanx',
            className: 'bg-discover-baanx',
          },
          {
            name: 'Mercuryo',
            className: 'bg-discover-mercuryo',
          },
          {
            name: 'Juno',
            className: 'bg-discover-juno',
          },
          {
            name: 'Sardine',
            className: 'bg-discover-sardine',
          },
        ]}
      />
    </div>
  ),
};
