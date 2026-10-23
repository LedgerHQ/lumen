import figma from '@figma/code-connect';
import { ProgressBar } from './ProgressBar';

figma.connect(
  ProgressBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=21807-57957&m=dev',
  {
    imports: ["import { ProgressBar } from '@ledgerhq/lumen-ui-react'"],
    example: () => (
      <ProgressBar value={25} label='Label' labelPosition='start-bottom' />
    ),
  },
);
