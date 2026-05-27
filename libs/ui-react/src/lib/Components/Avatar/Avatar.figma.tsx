import figma from '@figma/code-connect';
import { Avatar } from './Avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11097-8',
  {
    imports: ["import { Avatar } from '@ledgerhq/lumen-ui-react'"],
    props: {
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      showNotification: figma.boolean('show-notification', {
        true: true,
        false: false,
      }),
    },
    example: (props) => (
      <Avatar
        src='https://example-image.com'
        size={props.size}
        alt="John Doe's Avatar"
        imgLoading='eager'
        showNotification={props.showNotification}
      />
    ),
  },
);
