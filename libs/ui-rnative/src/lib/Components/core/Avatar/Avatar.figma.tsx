import figma from '@figma/code-connect';
import { DotIndicator, getDotIndicatorProps } from '../DotIndicator';
import { Avatar } from './Avatar';

figma.connect(
  Avatar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11097-8',
  {
    imports: [
      "import { Avatar, DotIndicator, getDotIndicatorProps } from '@ledgerhq/lumen-ui-rnative'",
    ],
    props: {
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
        xl: 'xl',
        '2xl': '2xl',
      }),
      showNotification: figma.boolean('show-notification'),
    },
    example: (props) => {
      const avatar = (
        <Avatar
          src='https://example-image.com'
          size={props.size}
          alt="John Doe's Avatar"
        />
      );

      return props.showNotification &&
        (props.size === 'sm' || props.size === 'md') ? (
        <DotIndicator {...getDotIndicatorProps('avatar', props.size)}>
          {avatar}
        </DotIndicator>
      ) : (
        avatar
      );
    },
  },
);
