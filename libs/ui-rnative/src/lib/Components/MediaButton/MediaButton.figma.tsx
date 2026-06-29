import figma from '@figma/code-connect';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { Placeholder } from '../../Symbols';
import { MediaButton } from './MediaButton';

figma.connect(
  MediaButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6389-45680',
  {
    imports: [
      "import { MediaButton } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        plain: 'gray',
        transparent: 'transparent',
        'no-background': 'no-background',
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
      leadingContent: figma.enum('leading-content', {
        'interface-icon': figma.enum('size', {
          sm: <Placeholder size={24} />,
          md: <Placeholder size={32} />,
        }),
        coin: figma.enum('size', {
          sm: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />,
          md: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />,
        }),
        stock: figma.enum('size', {
          sm: <CryptoIcon size={24} ledgerId='walmart' ticker='WMT' />,
          md: <CryptoIcon size={32} ledgerId='walmart' ticker='WMT' />,
        }),
        none: undefined,
      }),
      leadingContentShape: figma.enum('leading-content', {
        'interface-icon': 'flat',
        coin: 'rounded',
        stock: 'rounded',
        none: 'flat',
      }),
      children: figma.string('label'),
    },
    example: (props) => (
      <MediaButton
        appearance={props.appearance}
        size={props.size}
        leadingContent={props.leadingContent}
        leadingContentShape={props.leadingContentShape}
        onPress={() => {}}
      >
        {props.children}
      </MediaButton>
    ),
  },
);
