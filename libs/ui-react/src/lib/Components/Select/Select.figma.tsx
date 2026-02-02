import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
} from './Select';

import figma from '@figma/code-connect';

figma.connect(
  Select,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6397-463',
  {
    imports: [
      "import { Select, SelectContent, SelectItem, SelectItemText, SelectTrigger } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      opened: figma.boolean('opened'),
      triggerProps: figma.nestedProps('.select-trigger-input', {
        label: figma.string('label'),
        value: figma.string('input-value'),
        disabled: figma.enum('state', {
          disabled: true,
        })
      })
    },
    example: (props) => (
      <Select
        open={props.opened}
        disabled={props.triggerProps.disabled}
        value={props.triggerProps.value}
        onValueChange={() => {}}
      >
        <SelectTrigger label={props.triggerProps.label} />
        <SelectContent>
          <SelectItem value='option1'>
            <SelectItemText>Option 1</SelectItemText>
          </SelectItem>
          <SelectItem value='option2'>
            <SelectItemText>Option 2</SelectItemText>
          </SelectItem>
          <SelectItem value='option3'>
            <SelectItemText>Option 3</SelectItemText>
          </SelectItem>
        </SelectContent>
      </Select>
    ),
  },
);
