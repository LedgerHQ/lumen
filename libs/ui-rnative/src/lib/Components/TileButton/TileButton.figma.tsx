import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';
import { TileButton } from './TileButton';
import type { TileButtonProps } from './types';

figma.connect(
  TileButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11291-620',
  {
    imports: [
      "import { TileButton } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      children: figma.string('label'),
      icon: Placeholder,
    },
    example: (
      props: Omit<TileButtonProps, 'icon'> & {
        icon: any;
      },
    ) => (
      <TileButton
        disabled={props.disabled}
        icon={props.icon}
        onPress={() => {}}
      >
        {props.children}
      </TileButton>
    ),
  },
);
