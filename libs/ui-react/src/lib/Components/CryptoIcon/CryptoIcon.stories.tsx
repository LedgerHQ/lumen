import type { Meta, StoryObj } from '@storybook/react-vite';

const CRYPTO_ICONS_URL = 'https://crypto-icons-storybook.pages.dev';

const meta: Meta = {
  title: 'Symbols/Crypto Icons',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const CryptoIcons: StoryObj = {
  render: () => (
    <iframe
      src={CRYPTO_ICONS_URL}
      title='Crypto Icons'
      style={{ width: '100%', height: '100vh', border: 'none' }}
    />
  ),
};
