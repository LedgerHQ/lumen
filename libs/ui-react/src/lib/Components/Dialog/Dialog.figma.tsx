import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from './Dialog';
import { Button } from '../Button/Button';

import figma from '@figma/code-connect';

figma.connect(
  Dialog,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6345-2641',
  {
    imports: [
      "import { Dialog, DialogContent, DialogTrigger, DialogHeader } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      dialogHeader: figma.nestedProps('.dialog-header', {
        appearance: figma.enum('appearance', {
          compact: 'compact',
          expanded: 'extended',
        }),
        title: figma.boolean('show-title', {
          true: figma.string('title'),
          false: undefined,
        }),
        description: figma.boolean('show-description', {
          true: figma.string('description'),
          false: undefined,
        }),
        onBack: figma.boolean('show-back-icon', {
          true: () => {},
          false: undefined,
        }),
      }),
      dialogFooter: figma.boolean('show-sticky-button', {
        true:
        <DialogFooter>
          <Button appearance='base' isFull>
            Confirm
          </Button>
        </DialogFooter>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Dialog open={false} onOpenChange={() => {}}>
        <DialogTrigger asChild>
          <Button>Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader
            appearance={props.dialogHeader.appearance}
            title={props.dialogHeader.title}
            description={props.dialogHeader.description}
            onBack={props.dialogHeader.onBack}
            onClose={() => {}}
          />
          <DialogBody>
            <p>Dialog content goes here</p>
          </DialogBody>
          {props.dialogFooter}
        </DialogContent>
      </Dialog>
    ),
  },
);
