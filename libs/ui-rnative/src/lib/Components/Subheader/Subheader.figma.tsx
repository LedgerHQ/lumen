import figma from '@figma/code-connect';
import {
  Subheader,
  SubheaderDescription,
  SubheaderRow,
  SubheaderShowMore,
  SubheaderTitle,
  SubheaderCount,
} from './Subheader';

figma.connect(
  Subheader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16477-1522',
  {
    imports: [
      "import { Subheader, SubheaderRow, SubheaderTitle, SubheaderDescription, SubheaderCount } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'leading-action': 'none' },
    props: {
      title: figma.string('title'),
      descriptionBlock: figma.boolean('show-description', {
        true: <SubheaderDescription>Description</SubheaderDescription>,
        false: undefined,
      }),
      count: figma.boolean('show-number', {
        true: <SubheaderCount value={5} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <Subheader>
        <SubheaderRow>
          <SubheaderTitle>{props.title}</SubheaderTitle>
          {props.count}
        </SubheaderRow>
        {props.descriptionBlock}
      </Subheader>
    ),
  },
);

figma.connect(
  Subheader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16477-1522',
  {
    imports: [
      "import { Subheader, SubheaderRow, SubheaderTitle, SubheaderShowMore, SubheaderDescription } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'leading-action': 'show-more' },
    props: {
      title: figma.string('title'),
      descriptionBlock: figma.boolean('show-description', {
        true: <SubheaderDescription>Description</SubheaderDescription>,
        false: undefined,
      }),
      count: figma.boolean('show-number', {
        true: <SubheaderCount value={5} />,
        false: undefined,
      }),
    },
    example: ({ title, descriptionBlock, count }) => (
      <Subheader>
        <SubheaderRow onPress={() => {}}>
          <SubheaderTitle>{title}</SubheaderTitle>
          {count}
          <SubheaderShowMore />
        </SubheaderRow>
        {descriptionBlock}
      </Subheader>
    ),
  },
);
