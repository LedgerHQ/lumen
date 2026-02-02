import React from 'react';
import { InteractiveIcon } from './InteractiveIcon';

import figma from '@figma/code-connect';
import { InteractiveIconProps } from './types';

figma.connect(
  InteractiveIcon,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6975%3A2571',
  {
    variant: { appearance: 'filled' },
    imports: ["import { InteractiveIcon } from '@ledgerhq/lumen-ui-react'"],
    props: {
      iconType: figma.enum('appearance', {
        filled: 'filled',
        stroked: 'stroked',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      children: figma.instance('icon-filled'),
    },
    example: (props: InteractiveIconProps) => (
      <InteractiveIcon
        iconType={props.iconType}
        disabled={props.disabled}
        aria-label='Interactive icon'
      >
        {props.children}
      </InteractiveIcon>
    ),
  },
);

figma.connect(
  InteractiveIcon,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6975%3A2571',
  {
    variant: { appearance: 'stroked' },
    imports: ["import { InteractiveIcon } from '@ledgerhq/lumen-ui-react'"],
    props: {
      iconType: figma.enum('appearance', {
        filled: 'filled',
        stroked: 'stroked',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      children: figma.instance('icon-stroked'),
    },
    example: (props: InteractiveIconProps) => (
      <InteractiveIcon
        iconType={props.iconType}
        disabled={props.disabled}
        aria-label='Interactive icon'
      >
        {props.children}
      </InteractiveIcon>
    ),
  },
);