import figma from '@figma/code-connect';
import { Spinner } from './Spinner';

figma.connect(
  Spinner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=9023-3681',
  {
    imports: ["import { Spinner } from '@ledgerhq/lumen-ui-react'"],
    example: () => <Spinner size={40} />,
  },
);
