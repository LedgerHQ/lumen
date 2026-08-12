import figma from '@figma/code-connect';
import { Skeleton } from './Skeleton';

figma.connect(
  Skeleton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8004-10676',
  {
    imports: ["import { Skeleton } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      component: figma.enum('appearance', {
        'list-item': 'list-item',
        tile: 'tile',
      }),
    },
    example: (props) => <Skeleton component={props.component} />,
  },
);
