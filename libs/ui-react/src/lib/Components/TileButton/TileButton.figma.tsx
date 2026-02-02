import React from 'react';
import { TileButton } from './TileButton';
import { TileButtonProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  TileButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11291-620',
  {
    imports: [
      "import { TileButton } from '@ledgerhq/lumen-ui-react'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      children: figma.string('label'),
      icon: figma.instance('icon'),
    },
    example: (
      props: Omit<TileButtonProps, 'icon'> & {
        icon: any;
      },
    ) => (
      <TileButton disabled={props.disabled} icon={props.icon}>
        {props.children}
      </TileButton>
    ),
  },
);
