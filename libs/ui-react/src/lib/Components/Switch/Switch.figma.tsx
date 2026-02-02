import React from 'react';
import { Switch } from './Switch';

import figma from '@figma/code-connect';

figma.connect(
  Switch,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8739-1875',
  {
    imports: ["import { Switch } from '@ledgerhq/lumen-ui-react'"],
    props: {
      switchProps: figma.nestedProps('.switch', {
        selected: figma.boolean('selected', {
          true: true,
          false: false,
        }),
        disabled: figma.enum('state', {
          disabled: true,
        }),
        size: figma.enum('size', {
          sm: 'sm',
          md: 'md',
        }),
      }),
    },
    example: (props) => (
      <Switch
        selected={props.switchProps.selected}
        defaultSelected={false}
        onChange={(selected: boolean) => {}}
        size={props.switchProps.size}
        disabled={props.switchProps.disabled}
      />
    ),
  },
);

figma.connect(
  Switch,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=802-186',
  {
    imports: ["import { Switch } from '@ledgerhq/lumen-ui-react'"],
    props: {
      selected: figma.boolean('selected', {
        true: true,
        false: false,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
    },
    example: (props) => (
      <Switch
        selected={props.selected}
        defaultSelected={false}
        onChange={(selected: boolean) => {}}
        size={props.size}
        disabled={props.disabled}
      />
    ),
  },
);
