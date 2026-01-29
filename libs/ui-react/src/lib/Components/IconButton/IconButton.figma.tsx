import React from 'react';
import { IconButton } from './IconButton';
import { IconButtonProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  IconButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8166-17796',
  {
    imports: [
      "import { IconButton } from '@ledgerhq/lumen-ui-react'",
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
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      icon: figma.instance('icon'),
    },
    example: (
      props: Omit<IconButtonProps, 'icon' | 'aria-label'> & {
        icon?: any;
      },
    ) => (
      <IconButton
        disabled={props.disabled}
        loading={props.loading}
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
        aria-label='Icon button'
      />
    ),
  },
);
