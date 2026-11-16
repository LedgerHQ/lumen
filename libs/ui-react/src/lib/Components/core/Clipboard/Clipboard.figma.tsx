import figma from '@figma/code-connect';
import { Clipboard } from './Clipboard';

figma.connect(
  Clipboard,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=23359-110294',
  {
    imports: ["import { Clipboard } from '@ledgerhq/lumen-ui-react'"],
    example: () => (
      <Clipboard
        value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        onCopy={(_value: string) => {}}
      />
    ),
  },
);
