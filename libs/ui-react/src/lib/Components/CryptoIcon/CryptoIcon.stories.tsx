import type { Meta, StoryObj } from '@storybook/react-vite';

const CRYPTO_ICONS_URL = 'https://crypto-icons-storybook.pages.dev';

const meta: Meta = {
  title: 'Symbols/Crypto Icons',
};

export default meta;

export const CryptoIcons: StoryObj = {
  render: () => (
    <div className='flex flex-col items-center gap-4 p-16 text-center'>
      <p className='body-3 text-muted'>
        Browse the full set of crypto icons in the dedicated Storybook.
      </p>
      <a
        href={CRYPTO_ICONS_URL}
        target='_blank'
        rel='noreferrer'
        className='body-3-semi-bold text-interactive hover:text-interactive-hover'
      >
        Open Crypto Icons Storybook ↗
      </a>
    </div>
  ),
};
