import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';
import { Link } from './Link';
import type { LinkProps } from './types';

figma.connect(
  Link,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=9661-18364',
  {
    imports: [
      "import { Link } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
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
      icon: figma.boolean('show-icon', {
        true: Placeholder,
        false: undefined,
      }),
    },
    example: (
      props: Omit<LinkProps, 'icon' | 'children'> & {
        icon?: any;
      },
    ) => (
      <Link
        isExternal={props.isExternal}
        underline={props.underline}
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
        onPress={() => {}}
      >
        Label
      </Link>
    ),
  },
);
