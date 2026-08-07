import figma from '@figma/code-connect';
import { Switch } from './Switch';

// Standalone Switch component
figma.connect(
  Switch,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=802-186',
  {
    imports: ["import { Switch } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      checked: figma.boolean('selected', {
        true: true,
        false: false,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
    },
    example: (props) => (
      <Switch
        checked={props.checked}
        defaultChecked={false}
        onCheckedChange={(_checked: boolean) => {}}
        size={props.size}
        disabled={props.disabled}
      />
    ),
  },
);

// Switch embedded inside a compound component (e.g. ListItem toggle)
figma.connect(
  Switch,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8739-1875',
  {
    imports: ["import { Switch } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      switchProps: figma.nestedProps('.switch', {
        checked: figma.boolean('selected', {
          true: true,
          false: false,
        }),
        disabled: figma.enum('state', {
          disabled: true,
        }),
        size: figma.enum('size', {
          sm: 'sm',
          md: 'md',
        }),
      }),
    },
    example: (props) => (
      <Switch
        checked={props.switchProps.checked}
        defaultChecked={false}
        onCheckedChange={(_checked: boolean) => {}}
        size={props.switchProps.size}
        disabled={props.switchProps.disabled}
      />
    ),
  },
);
