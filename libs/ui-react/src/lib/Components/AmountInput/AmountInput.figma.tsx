import figma from '@figma/code-connect';
import { AmountInput } from './AmountInput';

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=17523-37413',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    props: {
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      value: figma.string('amount'),
      currencyText: figma.enum('currency', {
        $: '$',
        '€': '€',
        '£': '£',
      }),
      currencyPosition: figma.enum('currency', {
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
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=17523-37413&',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-react'"],
    variant: { currency: 'crypto' },
    props: {
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      value: figma.string('amount'),
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
