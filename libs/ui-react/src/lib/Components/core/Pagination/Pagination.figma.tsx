import figma from '@figma/code-connect';
import { Pagination } from './Pagination';

figma.connect(
  Pagination,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11768-12849',
  {
    imports: ["import { Pagination } from '@ledgerhq/lumen-ui-react'"],
    props: {
      density: figma.enum('content', {
        number: 'expanded',
        text: 'compact',
        none: 'compact',
      }),
    },
    example: (props) => (
      <Pagination
        page={2}
        totalPages={8}
        density={props.density}
        onPageChange={() => {}}
      />
    ),
  },
);
