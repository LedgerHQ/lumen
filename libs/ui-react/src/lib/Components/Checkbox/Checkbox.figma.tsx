import React from 'react';
import { Checkbox } from './Checkbox';

import figma from '@figma/code-connect';

figma.connect(
  Checkbox,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6688-3600',
  {
    imports: ["import { Checkbox } from '@ledgerhq/lumen-ui-react'"],
    variant: { 'show-label': true },
    props: {
      checkbox: figma.nestedProps('.checkbox', {
        checked: figma.boolean('selected'),
        disabled: figma.enum('state', {
          disabled: true,
        }),
      }),
      label: figma.string('label')
    },
    example: (props) => (
      <>
        <Checkbox
          id='checkbox-id'
          name='checkbox-name'
          checked={props.checkbox.checked}
          onCheckedChange={(checked: boolean) => {}}
          defaultChecked={false}
          disabled={props.checkbox.disabled}
        />
        <label htmlFor="checkbox-id" className="cursor-pointer body-2">
          {props.label}
        </label>
      </>
    ),
  },
);

figma.connect(
  Checkbox,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6688-3600',
  {
    imports: ["import { Checkbox } from '@ledgerhq/lumen-ui-react'"],
    variant: { 'show-label': false },
    props: {
      checkbox: figma.nestedProps('.checkbox', {
        checked: figma.boolean('selected'),
        disabled: figma.enum('state', {
          disabled: true,
        }),
      }),
    },
    example: (props) => (
      <Checkbox
        id='checkbox-id'
        name='checkbox-name'
        checked={props.checkbox.checked}
        onCheckedChange={(checked: boolean) => {}}
        defaultChecked={false}
        disabled={props.checkbox.disabled}
      />
    ),
  },
);
