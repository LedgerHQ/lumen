import React from 'react';
import { Stepper } from './Stepper';

import figma from '@figma/code-connect';

figma.connect(
  Stepper,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11977-94',
  {
    imports: ["import { Stepper } from '@ledgerhq/lumen-ui-react'"],
    example: () => <Stepper currentStep={2} totalSteps={4} />,
  },
);
