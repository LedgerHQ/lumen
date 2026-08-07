import figma from '@figma/code-connect';
import { AmountDisplay } from './AmountDisplay';

figma.connect(
  AmountDisplay,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11065-2691',
  {
    imports: [
      "import { AmountDisplay } from '@ledgerhq/lumen-ui-rnative'",
      "import type { FormattedValue } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      hidden: figma.boolean('hide-amount', {
        true: true,
        false: false,
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
    },
    example: (props) => (
      <AmountDisplay
        value={2258.93}
        hidden={props.hidden}
        size={props.size}
        formatter={() => ({
          integerPart: '2568',
          decimalPart: '93',
          currencyText: '$',
          decimalSeparator: '.',
          currencyPosition: 'start',
        })}
      />
    ),
  },
);
