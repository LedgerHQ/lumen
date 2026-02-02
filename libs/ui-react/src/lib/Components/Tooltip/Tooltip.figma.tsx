import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './Tooltip';

import figma from '@figma/code-connect';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6387%3A409',
  {
    imports: [
      "import { Tooltip, TooltipContent, TooltipTrigger } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      label: figma.string('label'),
      side: figma.enum('direction', {
        top: 'top',
        bottom: 'bottom',
        left: 'left',
        right: 'right',
      }),
    },
    example: (props) => (
      <Tooltip>
        <TooltipTrigger>
          <button>Hover me</button>
        </TooltipTrigger>
        <TooltipContent side={props.side}>{props.label}</TooltipContent>
      </Tooltip>
    ),
  },
);
