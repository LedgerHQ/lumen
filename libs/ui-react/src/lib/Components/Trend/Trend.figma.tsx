import figma from '@figma/code-connect';
import { Trend } from './Trend';

figma.connect(
  Trend,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=892%3A5393',
  {
    imports: ["import { Trend } from '@ledgerhq/lumen-ui-react'"],
    props: {
      type: figma.enum('type', {
        increasing: 5.25,
        decreasing: -3.14,
        neutral: 0,
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      disabled: figma.enum('state', {
        enabled: false,
        disabled: true,
      }),
    },
    example: (props) => (
      <Trend value={props.type} size={props.size} disabled={props.disabled} />
    ),
  },
);
