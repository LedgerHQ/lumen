import figma from '@figma/code-connect';
import { Link } from './Link';

figma.connect(
  Link,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=9661-18364',
  {
    imports: ["import { Link } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      isExternal: figma.boolean('show-external-link', {
        true: true,
        false: false,
      }),
      underline: figma.boolean('underline', {
        true: true,
        false: false,
      }),
      appearance: figma.enum('appearance', {
        base: 'base',
        accent: 'accent',
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
    },
    example: (props) => (
      <Link
        isExternal={props.isExternal}
        underline={props.underline}
        appearance={props.appearance}
        size={props.size}
        onPress={() => {}}
      >
        Label
      </Link>
    ),
  },
);
