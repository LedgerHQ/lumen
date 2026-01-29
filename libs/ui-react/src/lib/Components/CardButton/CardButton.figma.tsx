import React from 'react';
import { CardButton } from './CardButton';
import { CardButtonProps } from './types';

import figma from '@figma/code-connect';

figma.connect(
  CardButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=89%3A525',
  {
    imports: [
      "import { CardButton } from '@ledgerhq/lumen-ui-react'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/Symbols'",
    ],
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      hideChevron: figma.boolean('show-chevron', {
        true: false,
        false: true,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      appearance: figma.enum('appearance', {
        base: 'base',
        outlined: 'outline',
      }),
      icon: figma.instance('icon'),
    },
    example: (
      props: Omit<CardButtonProps, 'icon'> & {
        icon?: any,
      },
    ) => (
      <CardButton
        title={props.title}
        description={props.description}
        icon={props.icon}
        hideChevron={props.hideChevron}
        disabled={props.disabled}
        appearance={props.appearance}
      />
    ),
  },
);
