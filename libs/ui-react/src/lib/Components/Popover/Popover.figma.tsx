import figma from '@figma/code-connect';
import { Button } from '../Button/Button';
import { Popover, PopoverTrigger, PopoverContent } from './Popover';

figma.connect(
  Popover,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=15407-33230',
  {
    imports: [
      "import { Popover, PopoverTrigger, PopoverContent, Button } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      width: figma.enum('width', {
        hug: 'fit',
        fixed: 'fixed',
      }),
    },
    example: (props) => (
      <Popover>
        <PopoverTrigger render={<Button>Open Popover</Button>} />
        <PopoverContent width={props.width}>
          <p>Popover content</p>
        </PopoverContent>
      </Popover>
    ),
  },
);
