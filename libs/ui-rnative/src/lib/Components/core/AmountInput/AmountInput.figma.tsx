import figma from '@figma/code-connect';
import { AmountInput } from './AmountInput';

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=17523-37413',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-rnative'"],
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
      isInvalid: figma.enum('state', {
        error: true,
      }),
    },
    example: (props) => (
      <AmountInput
        size={props.size}
        disabled={props.disabled}
        isInvalid={props.isInvalid}
        value={props.value}
        onChangeText={() => {}}
        currencyText={props.currencyText}
        currencyPosition={props.currencyPosition}
      />
    ),
  },
);

figma.connect(
  AmountInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=17523-37413',
  {
    imports: ["import { AmountInput } from '@ledgerhq/lumen-ui-rnative'"],
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
      isInvalid: figma.enum('state', {
        error: true,
      }),
    },
    example: (props) => (
      <AmountInput
        size={props.size}
        disabled={props.disabled}
        isInvalid={props.isInvalid}
        value={props.value}
        onChangeText={() => {}}
        currencyText={props.currencyText}
        currencyPosition='right'
      />
    ),
  },
);
