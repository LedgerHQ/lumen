import React from 'react';
import { TextInput } from './TextInput';

import figma from '@figma/code-connect';

figma.connect(
  TextInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2248-3905',
  {
    imports: ["import { TextInput } from '@ledgerhq/lumen-ui-react'"],
    props: {
      label: figma.enum('input-state', {
        label: figma.string('label-text'),
        placeholder: figma.string('label-text'),
        input: figma.string('label-text'),
      }),
      placeholder: figma.enum('input-state', {
        placeholder: figma.string('placeholder-text'),
      }),
      value: figma.enum('input-state', {
        input: figma.string('input-text'),
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      errorMessage: figma.nestedProps('.status', {
        label: figma.string('label')
      })
    },
    example: (props) => (
      <TextInput
        disabled={props.disabled}
        label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        errorMessage={props.errorMessage.label}
      />
    ),
  },
);
