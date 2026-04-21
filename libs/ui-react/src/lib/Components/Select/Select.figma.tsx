import figma from '@figma/code-connect';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectList,
  SelectTrigger,
} from './Select';
import type { SelectItemData } from './types';

const figmaSelectItems = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

figma.connect(
  Select,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6397-463',
  {
    imports: [
      "import { Select, SelectContent, SelectItem, SelectItemText, SelectList, SelectTrigger } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      opened: figma.boolean('opened'),
      triggerProps: figma.nestedProps('.select-trigger-input', {
        label: figma.string('label'),
        value: figma.string('input-value'),
        disabled: figma.enum('state', {
          disabled: true,
        }),
      }),
    },
    example: (props) => (
      <Select
        items={figmaSelectItems}
        open={props.opened}
        disabled={props.triggerProps.disabled}
        value={props.triggerProps.value || null}
        onValueChange={() => {}}
      >
        <SelectTrigger label={props.triggerProps.label} />
        <SelectContent>
          <SelectList
            renderItem={(item: SelectItemData) => (
              <SelectItem key={item.value} value={item.value}>
                <SelectItemText>{item.label}</SelectItemText>
              </SelectItem>
            )}
          />
        </SelectContent>
      </Select>
    ),
  },
);
