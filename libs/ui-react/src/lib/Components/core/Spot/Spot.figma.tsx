import figma from '@figma/code-connect';
import {
  CheckmarkCircleFill,
  ClockFill,
  DeleteCircleFill,
  InformationFill,
  Placeholder,
  WarningFill,
} from '../../symbols';
import { Spot } from './Spot';
import type { SpotAppearance, SpotFill } from './types';

figma.connect(
  Spot,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6786%3A4738',
  {
    imports: [
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { CheckmarkCircleFill, ClockFill, DeleteCircleFill, InformationFill, Placeholder, WarningFill } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      fill: figma.enum('appearance', {
        transparent: 'transparent',
        plain: 'plain',
      }),
      appearance: figma.enum('color', {
        base: 'base',
        success: 'success',
        error: 'error',
        warning: 'warning',
        muted: 'muted',
        'decorative-blue': 'decorative-blue',
        'decorative-pink': 'decorative-pink',
        'decorative-purple': 'decorative-purple',
        'decorative-green': 'decorative-green',
        'decorative-turquoise': 'decorative-turquoise',
        'decorative-yellow': 'decorative-yellow',
        'decorative-orange': 'decorative-orange',
        'decorative-red': 'decorative-red',
      }),
      icon: figma.enum('preset', {
        none: Placeholder,
        success: CheckmarkCircleFill,
        error: DeleteCircleFill,
        warning: WarningFill,
        info: InformationFill,
        pending: ClockFill,
      }),
    },
    example: (props: {
      disabled: boolean;
      fill: SpotFill;
      appearance: SpotAppearance;
      icon: typeof Placeholder;
    }) => (
      <Spot
        appearance={props.appearance}
        fill={props.fill}
        icon={props.icon}
        disabled={props.disabled}
      />
    ),
  },
);
