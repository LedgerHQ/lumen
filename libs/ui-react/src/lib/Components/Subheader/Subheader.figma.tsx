import figma from '@figma/code-connect';
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip/Tooltip';
import {
  Subheader,
  SubheaderRow,
  SubheaderTitle,
  SubheaderCount,
  SubheaderDescription,
  SubheaderInfo,
  SubheaderShowMore,
} from './Subheader';

figma.connect(
  Subheader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16477-1522',
  {
    imports: [
      "import { Subheader, SubheaderRow, SubheaderTitle, SubheaderInfo, SubheaderDescription } from '@ledgerhq/lumen-ui-react'",
      "import { Tooltip, TooltipTrigger, TooltipContent } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { action: 'none' },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      info: figma.boolean('show-info', {
        true: (
          <Tooltip>
            <TooltipTrigger>
              <SubheaderInfo />
            </TooltipTrigger>
            <TooltipContent>Additional information</TooltipContent>
          </Tooltip>
        ),
        false: undefined,
      }),
      descriptionBlock: figma.boolean('show-description', {
        true: <SubheaderDescription>Description</SubheaderDescription>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>{props.title}</SubheaderTitle>
          {props.info}
        </SubheaderRow>
        {props.descriptionBlock}
      </Subheader>
    ),
  },
);

figma.connect(
  Subheader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10438-1354',
  {
    imports: [
      "import { SubheaderShowMore, SubheaderCount } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { action: 'show-more' },
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      count: figma.boolean('show-number', {
        true: <SubheaderCount value={5} />,
        false: undefined,
      }),
      descriptionBlock: figma.boolean('show-description', {
        true: <SubheaderDescription>Description</SubheaderDescription>,
        false: undefined,
      }),
    },
    example: ({ title, count, descriptionBlock }) => (
      <Subheader>
        <SubheaderRow onClick={() => {}}>
          <SubheaderTitle>{title}</SubheaderTitle>
          {count}
          <SubheaderShowMore />
        </SubheaderRow>
        {descriptionBlock}
      </Subheader>
    ),
  },
);
