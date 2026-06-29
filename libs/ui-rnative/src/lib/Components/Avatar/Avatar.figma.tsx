import figma from '@figma/code-connect';
import { getDotSize } from '../Dot';
import { DotIndicator } from '../DotIndicator';
import { Avatar } from './Avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11097-8',
  {
    imports: [
      "import { Avatar, DotIndicator, getDotSize } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      appearance: figma.enum('appearance', {
        gray: 'gray',
        transparent: 'transparent',
      }),
      size: figma.enum('size', {
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
      }),
      showNotification: figma.boolean('show-notification'),
    },
    example: (props) => {
      const avatar = (
        <Avatar
          src='https://example-image.com'
          appearance={props.appearance}
          size={props.size}
          alt="John Doe's Avatar"
        />
      );

      return props.showNotification &&
        (props.size === 'sm' || props.size === 'md') ? (
        <DotIndicator size={getDotSize('avatar', props.size)}>
          {avatar}
        </DotIndicator>
      ) : (
        avatar
      );
    },
  },
);
