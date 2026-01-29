import React from 'react';
import { Link } from './Link';
import { LinkProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  Link,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=9661-18364',
  {
    imports: [
      "import { Link } from '@ledgerhq/lumen-ui-react'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/Symbols'",
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
      icon: figma.instance('icon'),
    },
    example: (
      props: Omit<LinkProps, 'icon' | 'children'> & {
        icon?: any;
      },
    ) => (
      <Link
        isExternal={props.isExternal}
        underline={props.underline}
        icon={props.icon}
        appearance={props.appearance}
        size={props.size}
        href='#'
      >
        Label
      </Link>
    ),
  },
);
