import figma from '@figma/code-connect';
import { Divider } from './Divider';

figma.connect(
  Divider,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=285-5974',
  {
    imports: ["import { Divider } from '@ledgerhq/lumen-ui-react'"],
    example: () => <Divider orientation='horizontal' />,
  },
);
