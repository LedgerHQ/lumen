import React from 'react';
import { Button } from './Button';
import { ButtonProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  Button,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=9%3A28',
  {
    imports: [
      "import { Button } from '@ledgerhq/lumen-ui-react'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/Symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      loading: figma.enum('state', {
        loading: true,
      }),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        transparent: 'transparent',
        'no-background': 'no-background',
        red: 'red',
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      className: figma.enum('width', {
        'min-width': 'min-w-128'
      }),
      children: figma.string('label'),
      icon: figma.instance('icon'),
    },
    example: (
      props: Omit<ButtonProps, 'icon'> & {
        icon?: any;
      },
    ) => (
      <Button
        disabled={props.disabled}
        loading={props.loading}
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
        className={props.className}
      >
        {props.children}
      </Button>
    ),
  },
);
