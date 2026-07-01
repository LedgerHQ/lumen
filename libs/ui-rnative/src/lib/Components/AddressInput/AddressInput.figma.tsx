import figma from '@figma/code-connect';
import { AddressInput } from './AddressInput';

figma.connect(
  AddressInput,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=7887-67',
  {
    imports: ["import { AddressInput } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      placeholder: figma.enum('input-state', {
        placeholder: figma.string('placeholder'),
      }),
      value: figma.enum('input-state', {
        'input-address': figma.string('value'),
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      status: figma.enum('state', {
        error: 'error',
        success: 'success',
      }),
      helperText: figma.nestedProps('.status', {
        label: figma.string('label'),
      }),
    },
    example: (props) => (
      <AddressInput
        disabled={props.disabled}
        value={props.value}
        placeholder={props.placeholder}
        onQrCodeClick={() => {}}
        helperText={props.helperText.label}
        status={props.status}
        onChangeText={() => {}}
      />
    ),
  },
);
