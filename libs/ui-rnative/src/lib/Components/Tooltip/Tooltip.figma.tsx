import figma from '@figma/code-connect';
import { Text } from '../Utility/Text';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6387%3A409',
  {
    imports: [
      "import { Tooltip, TooltipTrigger, TooltipContent } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      header: figma.nestedProps('.bottom-sheet-header', {
        title: figma.string('title'),
        description: figma.string('description'),
      }),
    },
    example: (props) => (
      <Tooltip>
        <TooltipTrigger>
          <></>
        </TooltipTrigger>
        <TooltipContent
          title={props.header.title}
          content={<Text>{props.header.description}</Text>}
        />
      </Tooltip>
    ),
  },
);
