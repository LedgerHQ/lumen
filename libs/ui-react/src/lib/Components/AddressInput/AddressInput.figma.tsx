import React from 'react';
import { AddressInput } from './AddressInput';

import figma from '@figma/code-connect';

const openQrScanner = () => {};

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { 
      'input-state': 'placeholder'
    },
    props: {
      placeholder: figma.string('placeholder-text'),
    },
    example: (props) => (
      <AddressInput
        placeholder={props.placeholder}
        onQrCodeClick={openQrScanner}
      />
    ),
  },
);

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { 
      'input-state': 'input-address'
    },
    props: {
      value: figma.string('input-text'),
    },
    example: (props) => (
      <AddressInput
        value={props.value}
        onQrCodeClick={openQrScanner}
      />
    ),
  },
);

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { 
      state: 'error',
      'input-state': 'placeholder'
    },
    props: {
      placeholder: figma.string('placeholder-text'),
      errorMessage: figma.nestedProps('.status', {
        label: figma.string('label')
      })
    },
    example: (props) => (
      <AddressInput
        placeholder={props.placeholder}
        onQrCodeClick={openQrScanner}
        errorMessage={props.errorMessage.label}
      />
    ),
  },
);

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { 
      state: 'error',
      'input-state': 'input-address'
    },
    props: {
      value: figma.string('input-text'),
      errorMessage: figma.nestedProps('.status', {
        label: figma.string('label')
      })
    },
    example: (props) => (
      <AddressInput
        value={props.value}
        onQrCodeClick={openQrScanner}
        errorMessage={props.errorMessage.label}
      />
    ),
  },
);