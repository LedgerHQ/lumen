import figma from '@figma/code-connect';
import { PageIndicator } from './PageIndicator';

figma.connect(
  PageIndicator,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11768-12849',
  {
    imports: ["import { PageIndicator } from '@ledgerhq/lumen-ui-react'"],
    example: () => <PageIndicator currentPage={2} totalPages={5} />,
  },
);
