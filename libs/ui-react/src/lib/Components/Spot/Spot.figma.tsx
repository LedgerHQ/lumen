import React from 'react';
import { Spot } from './Spot';
import { SpotAppearance } from './types';

import figma from '@figma/code-connect';

figma.connect(
  Spot,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6786%3A4738',
  {
    imports: ["import { Spot } from '@ledgerhq/lumen-ui-react'"],
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
      icon: figma.instance('icon'),
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
