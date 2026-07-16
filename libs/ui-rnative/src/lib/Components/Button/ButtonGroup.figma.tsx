import figma from '@figma/code-connect';
import { Box } from '../Utility';

figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6495-22228',
  {
    imports: ["import { Box, Button } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      buttons: figma.children('*'),
    },
    example: (props) => (
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>{props.buttons}</Box>
    ),
  },
);
