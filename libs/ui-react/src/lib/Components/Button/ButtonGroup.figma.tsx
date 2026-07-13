import figma from '@figma/code-connect';

figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6495-22228',
  {
    imports: ["import { Button } from '@ledgerhq/lumen-ui-react'"],
    props: {
      buttons: figma.children('*'),
    },
    example: (props) => <div className='flex gap-8'>{props.buttons}</div>,
  },
);
