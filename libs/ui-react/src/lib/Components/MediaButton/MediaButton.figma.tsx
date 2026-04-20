import figma from '@figma/code-connect';
import { MediaButton } from './MediaButton';

figma.connect(
  MediaButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=6389-45680',
  {
    imports: ["import { MediaButton } from '@ledgerhq/lumen-ui-react'"],
    props: {
      appearance: figma.enum('appearance', {
        plain: 'gray',
        transparent: 'transparent',
        'no-background': 'no-background',
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
      }),
      icon: figma.instance('leading-content'),
      children: figma.string('label'),
    },
    example: (props) => (
      <MediaButton
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
      >
        {props.children}
      </MediaButton>
    ),
  },
);
