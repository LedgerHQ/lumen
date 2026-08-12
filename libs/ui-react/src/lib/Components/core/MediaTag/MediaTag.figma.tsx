import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { MediaTag } from './MediaTag';

figma.connect(
  MediaTag,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16793-36383',
  {
    imports: [
      "import { MediaTag } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
    ],
    variant: { 'leading-icon': 'coin' },
    props: {
      label: figma.string('label'),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        'accent-subtle': 'accent-subtle',
        success: 'success',
        error: 'error',
        warning: 'warning',
        white: 'white',
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      tagSize: figma.enum('size', {
        md: 16,
        sm: 12,
      }),
      disabled: figma.enum('appearance', {
        disabled: true,
      }),
      coin: figma.nestedProps('coin', {
        asset: figma.enum('asset', {
          btc: 'bitcoin',
          eth: 'ethereum',
        }),
        ticker: figma.enum('asset', {
          btc: 'BTC',
          eth: 'ETH',
        }),
      }),
    },
    example: (props) => (
      <MediaTag
        disabled={props.disabled}
        label={props.label}
        appearance={props.appearance}
        size={props.size}
        leadingContent={
          <CryptoIcon
            ticker={props.coin.ticker}
            ledgerId={props.coin.asset}
            size={props.tagSize}
          />
        }
      />
    ),
  },
);

figma.connect(
  MediaTag,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16793-36383',
  {
    imports: [
      "import { MediaTag } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
    ],
    variant: { 'leading-icon': 'network' },
    props: {
      label: figma.string('label'),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        'accent-subtle': 'accent-subtle',
        success: 'success',
        error: 'error',
        warning: 'warning',
        white: 'white',
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      tagSize: figma.enum('size', {
        md: 16,
        sm: 12,
      }),
      disabled: figma.enum('appearance', {
        disabled: true,
      }),
      network: figma.nestedProps('network', {
        ledgerId: figma.enum('network', {
          eth: 'ethereum',
        }),
        ticker: figma.enum('network', {
          eth: 'ETH',
        }),
      }),
    },
    example: (props) => (
      <MediaTag
        disabled={props.disabled}
        label={props.label}
        appearance={props.appearance}
        size={props.size}
        leadingContent={
          <CryptoIcon
            ticker={props.network.ticker}
            ledgerId={props.network.ledgerId}
            size={props.tagSize}
          />
        }
      />
    ),
  },
);
