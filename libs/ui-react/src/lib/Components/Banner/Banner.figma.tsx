import React from 'react';
import { Banner } from './Banner';
import { Button } from '../Button/Button';

import figma from '@figma/code-connect';

figma.connect(
  Banner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=129%3A201',
  {
    imports: [
      "import { Banner } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: {'show-close': true},
    props: {
      appearance: figma.enum('appearance', {
        info: 'info',
        success: 'success',
        warning: 'warning',
        error: 'error',
      }),
      title: figma.boolean('show-title', {
        true: figma.string('title'),
        false: undefined,
      }),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      primaryAction: figma.boolean('show-actions', {
        true: (
          <Button appearance='transparent' size='sm' onClick={() => {}}>
            Primary Action
          </Button>
        ),
        false: undefined,
      }),
      secondaryAction: figma.boolean('show-actions', {
        true: figma.boolean('show-secondary-action', {
          true: (
            <Button appearance='no-background' size='sm' onClick={() => {}}>
              Secondary Action
            </Button>
          ),
        }),
        false: undefined,
      }),
    },
    example: (props) => (
      <Banner
        appearance={props.appearance}
        title={props.title}
        description={props.description}
        primaryAction={props.primaryAction}
        secondaryAction={props.secondaryAction}
        onClose={() => {}}
        closeAriaLabel='Close Banner'
      />
    ),
  },
);

figma.connect(
  Banner,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=129%3A201',
  {
    imports: [
      "import { Banner } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: {'show-close': false},
    props: {
      appearance: figma.enum('appearance', {
        info: 'info',
        success: 'success',
        warning: 'warning',
        error: 'error',
      }),
      title: figma.boolean('show-title', {
        true: figma.string('title'),
        false: undefined,
      }),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      primaryAction: figma.boolean('show-actions', {
        true: (
          <Button appearance='transparent' size='sm' onClick={() => {}}>
            Primary Action
          </Button>
        ),
        false: undefined,
      }),
      secondaryAction: figma.boolean('show-actions', {
        true: figma.boolean('show-secondary-action', {
          true: (
            <Button appearance='no-background' size='sm' onClick={() => {}}>
              Secondary Action
            </Button>
          ),
        }),
        false: undefined,
      }),
    },
    example: (props) => (
      <Banner
        appearance={props.appearance}
        title={props.title}
        description={props.description}
        primaryAction={props.primaryAction}
        secondaryAction={props.secondaryAction}
      />
    ),
  },
);