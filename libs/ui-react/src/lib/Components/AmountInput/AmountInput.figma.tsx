import figma from '@figma/code-connect';
import { AmountInput } from './AmountInput';

const sizeProp = figma.enum('size', {
  lg: 'md',
  md: 'sm',
});

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6245-2067',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { type: 'fiat' },
    props: {
      size: sizeProp,
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
        size={props.size}
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
      size: sizeProp,
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
        size={props.size}
        disabled={props.disabled}
        aria-invalid={props.ariaInvalid}
        value={props.value}
        onChange={() => {}}
        currencyText={props.currencyText}
        currencyPosition='right'
      />
    ),
  },
);

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=17523-37413',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { type: 'fiat' },
    props: {
      size: sizeProp,
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
        size={props.size}
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
