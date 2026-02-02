import React from 'react';
import { Skeleton } from './Skeleton';

import figma from '@figma/code-connect';

figma.connect(
  Skeleton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8004-10676',
  {
    imports: ["import { Skeleton } from '@ledgerhq/lumen-ui-react'"],
    props: {
      component: figma.enum('appearance', {
        'list-item': 'list-item',
        tile: 'tile',
      }),
      className: figma.enum('appearance', {
        circle: 'size-48 rounded-full',
        square: 'h-56 w-112 rounded-md',
        line: 'h-12 w-112 rounded-full',
      }),
    },
    example: (props) => (
      <Skeleton component={props.component} className={props.className} />
    ),
  },
);
