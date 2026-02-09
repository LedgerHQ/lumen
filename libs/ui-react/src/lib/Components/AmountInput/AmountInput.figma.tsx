import React from 'react';
import { AmountInput } from './AmountInput';
import figma from '@figma/code-connect';

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6245-2067',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { type: 'fiat' },
    props: {
      value: figma.string('fiat-amount'),
      currencyText: figma.enum('fiat', {
        $: '$',
        '€': '€',
        '£': '£',
      }),
      currencyPosition: figma.enum('fiat', {
        $: 'left',
        '£': 'left',
        '€': 'right',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      ariaInvalid: figma.enum('state', {
        error: true,
      }),
    },
    example: (props) => (
      <AmountInput
        disabled={props.disabled}
        aria-invalid={props.ariaInvalid}
        value={props.value}
        onChange={() => {}}
        currencyText={props.currencyText}
        currencyPosition={props.currencyPosition}
      />
    ),
  },
);

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6245-2067',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { type: 'crypto' },
    props: {
      value: figma.string('crypto-amount'),
      currencyText: figma.string('crypto'),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      ariaInvalid: figma.enum('state', {
        error: true,
      }),
    },
    example: (props) => (
      <AmountInput
        disabled={props.disabled}
        aria-invalid={props.ariaInvalid}
        value={props.value}
        onChange={() => {}}
        currencyText={props.currencyText}
        currencyPosition="right"
      />
    ),
  },
);