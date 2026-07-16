import figma from '@figma/code-connect';
import { SectionHeader, SectionHeaderTitle } from './SectionHeader';

figma.connect(
  SectionHeader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=18640-48457',
  {
    imports: [
      "import { SectionHeader, SectionHeaderTitle } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        plain: 'plain',
      }),
      title: figma.string('label'),
    },
    example: (props) => (
      <SectionHeader appearance={props.appearance}>
        <SectionHeaderTitle>{props.title}</SectionHeaderTitle>
      </SectionHeader>
    ),
  },
);
