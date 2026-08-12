import figma from '@figma/code-connect';
import { DotCount } from './DotCount';

figma.connect(
  DotCount,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=38-998',
  {
    imports: ["import { DotCount } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      value: figma.string('value'),
      size: figma.enum('size', {
        md: 'md',
        lg: 'lg',
      }),
      appearance: figma.enum('appearance', {
        base: 'base',
        red: 'red',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <DotCount
        value={Number(props.value)}
        size={props.size}
        appearance={props.appearance}
        disabled={props.disabled}
      />
    ),
  },
);
