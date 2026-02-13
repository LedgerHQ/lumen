import React from 'react';
import { Stepper } from './Stepper';

import figma from '@figma/code-connect';

figma.connect(
  Stepper,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11439-7755',
  {
    imports: ["import { Stepper } from '@ledgerhq/lumen-ui-react'"],
    example: () => <Stepper currentStep={2} totalSteps={4} />,
  },
);
