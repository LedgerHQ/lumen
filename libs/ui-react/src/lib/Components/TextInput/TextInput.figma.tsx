import figma from '@figma/code-connect';
import { TextInput } from './TextInput';

figma.connect(
  TextInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2248-3905',
  {
    imports: ["import { TextInput } from '@ledgerhq/lumen-ui-react'"],
    props: {
      label: figma.string('label'),
      placeholder: figma.enum('input-state', {
        placeholder: figma.string('placeholder'),
      }),
      value: figma.enum('input-state', {
        input: figma.string('value'),
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      helperText: figma.nestedProps('.status', {
        label: figma.string('label'),
      }),
    },
    example: (props) => (
      <TextInput
        disabled={props.disabled}
        label={props.label}
        placeholder={props.placeholder}
        value={props.value}
        helperText={props.helperText.label}
        status='error'
      />
    ),
  },
);
