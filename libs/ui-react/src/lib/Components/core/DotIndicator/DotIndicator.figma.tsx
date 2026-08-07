import figma from '@figma/code-connect';
import { DotIndicator } from './DotIndicator';

figma.connect(
  DotIndicator,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=16470-25597',
  {
    imports: ["import { DotIndicator } from '@ledgerhq/lumen-ui-react'"],
    props: {
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
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
      <DotIndicator
        size={props.size}
        appearance={props.appearance}
        disabled={props.disabled}
      />
    ),
  },
);
