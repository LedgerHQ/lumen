import figma from '@figma/code-connect';
import { MediaTag } from './MediaTag';

figma.connect(
  MediaTag,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=16793-36383',
  {
    imports: ["import { MediaTag } from '@ledgerhq/lumen-ui-react'"],
    props: {
      label: figma.string('label'),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        'accent-subtle': 'accent-subtle',
        success: 'success',
        error: 'error',
        warning: 'warning',
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm',
      }),
      leadingContent: figma.instance('leading-icon'),
      disabled: figma.enum('appearance', {
        disabled: true,
      }),
    },
    example: (props) => (
      <MediaTag
        disabled={props.disabled}
        label={props.label}
        appearance={props.appearance}
        size={props.size}
        leadingContent={props.leadingContent}
      />
    ),
  },
);
