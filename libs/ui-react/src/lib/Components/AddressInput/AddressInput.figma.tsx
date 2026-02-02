import React from 'react';
import { AddressInput } from './AddressInput';

import figma from '@figma/code-connect';

const openQrScanner = () => {};

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-react'"],
    props: {
      placeholder: figma.enum('input-state', {
        placeholder: figma.string('placeholder-text')
      }),
      value: figma.enum('input-state', {
        'input-address': figma.string('input-text')
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      errorMessage: figma.nestedProps('.status', {
        label: figma.string('label')
      })
    },
    example: (props) => (
      <AddressInput
        disabled={props.disabled}
        value={props.value}
        placeholder={props.placeholder}
        onQrCodeClick={openQrScanner}
        errorMessage={props.errorMessage.label}
      />
    ),
  },
);
