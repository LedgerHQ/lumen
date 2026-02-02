import React from 'react';
import { AmountDisplay } from './AmountDisplay';

import figma from '@figma/code-connect';

figma.connect(
  AmountDisplay,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11065-2691',
  {
    imports: [
      "import { AmountDisplay } from '@ledgerhq/lumen-ui-react'",
      "import type { FormattedValue } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      hidden: figma.boolean('hide-amount', {
        true: true,
        false: false,
      }),
    },
    example: (props) => (
      <AmountDisplay
        value={2258.93}
        hidden={props.hidden}
        formatter={() => {
          return {
            integerPart: '2568',
            decimalPart: '93',
            currencyText: '$',
            decimalSeparator: '.',
            currencyPosition: 'start',
          };
        }}
      />
    ),
  },
);
