import figma from '@figma/code-connect';
import { Clipboard } from './Clipboard';
import { ClipboardInput } from './ClipboardInput';

figma.connect(
  Clipboard,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=23359-110294',
  {
    imports: [
      "import { Clipboard, ClipboardInput } from '@ledgerhq/lumen-ui-rnative'",
    ],
    example: () => (
      <Clipboard
        value='0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
        onCopy={(_value: string) => {}}
        render={({ value, handleCopy, Icon, statusLabel }) => (
          <ClipboardInput
            label={value}
            icon={Icon}
            accessibilityLabel={`${value}, ${statusLabel}`}
            onPress={handleCopy}
          />
        )}
      />
    ),
  },
);
