import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';
import { Spot } from './Spot';
import type { SpotAppearance } from './types';

figma.connect(
  Spot,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6786%3A4738',
  {
    imports: [
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      appearance: figma.enum('appearance', {
        'interface-icon': 'icon',
        loader: 'loader',
        number: 'number',
        'info-muted': 'info',
        warning: 'warning',
        error: 'error',
        check: 'check',
        bluetooth: 'bluetooth',
      }),
      icon: figma.enum('appearance', {
        'interface-icon': Placeholder,
      }),
      number: figma.enum('appearance', {
        number: 1,
      }),
    },
    example: (props: {
      disabled: boolean;
      appearance: SpotAppearance;
      icon: any;
      number: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
    }) => (
      <Spot
        appearance={props.appearance}
        icon={props.icon}
        number={props.number}
        disabled={props.disabled}
      />
    ),
  },
);
