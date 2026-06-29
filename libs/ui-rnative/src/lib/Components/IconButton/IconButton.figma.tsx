import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols';
import { IconButton } from './IconButton';
import type { IconButtonProps } from './types';

figma.connect(
  IconButton,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=8166-17796',
  {
    imports: [
      "import { IconButton } from '@ledgerhq/lumen-ui-rnative'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
    props: {
      disabled: figma.enum('state', {
        disabled: true,
      }),
      loading: figma.enum('state', {
        loading: true,
      }),
      appearance: figma.enum('appearance', {
        base: 'base',
        gray: 'gray',
        accent: 'accent',
        transparent: 'transparent',
        'no-background': 'no-background',
        red: 'red',
      }),
      size: figma.enum('size', {
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        lg: 'lg',
      }),
      icon: Placeholder,
    },
    example: (
      props: Omit<IconButtonProps, 'icon' | 'accessibilityLabel'> & {
        icon?: any;
      },
    ) => (
      <IconButton
        disabled={props.disabled}
        loading={props.loading}
        appearance={props.appearance}
        size={props.size}
        icon={props.icon}
        accessibilityLabel='Icon button'
        onPress={() => {}}
      />
    ),
  },
);
