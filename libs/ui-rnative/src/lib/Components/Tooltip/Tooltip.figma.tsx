import figma from '@figma/code-connect';
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip';

figma.connect(
  Tooltip,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6387%3A409',
  {
    imports: [
      "import { Tooltip, TooltipTrigger, TooltipContent } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      label: figma.string('label'),
    },
    example: (props) => (
      <Tooltip>
        <TooltipTrigger>
          <></>
        </TooltipTrigger>
        <TooltipContent content={props.label} />
      </Tooltip>
    ),
  },
);
