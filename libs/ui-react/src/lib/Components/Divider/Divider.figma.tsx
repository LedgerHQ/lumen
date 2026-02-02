import React from 'react';
import { Divider } from './Divider';

import figma from '@figma/code-connect';

figma.connect(
  Divider,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=285-5974',
  {
    imports: ["import { Divider } from '@ledgerhq/lumen-ui-react'"],
    example: () => (
      <Divider orientation='horizontal' />
    ),
  },
);
