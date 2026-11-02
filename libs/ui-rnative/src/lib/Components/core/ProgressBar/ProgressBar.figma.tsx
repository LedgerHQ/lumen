import figma from '@figma/code-connect';
import { ProgressBar } from './ProgressBar';

figma.connect(
  ProgressBar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=21807-57957&m=dev',
  {
    imports: ["import { ProgressBar } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      appearance: figma.enum('appearance', {
        base: 'base',
        accent: 'accent',
        success: 'success',
        error: 'error',
        warning: 'warning',
        'decorative-blue': 'decorative-blue',
        'decorative-pink': 'decorative-pink',
        'decorative-purple': 'decorative-purple',
        'decorative-green': 'decorative-green',
        'decorative-turquoise': 'decorative-turquoise',
        'decorative-yellow': 'decorative-yellow',
        'decorative-orange': 'decorative-orange',
        'decorative-red': 'decorative-red',
      }),
      labelPosition: figma.enum('labelPosition', {
        'start-top': 'start-top',
        'start-bottom': 'start-bottom',
        'end-top': 'end-top',
        'end-bottom': 'end-bottom',
      }),
      label: figma.string('label'),
    },
    example: (props) => (
      <ProgressBar
        value={25}
        accessibilityLabel='Progress'
        appearance={props.appearance}
        labelPosition={props.labelPosition}
        label={props.label}
      />
    ),
  },
);
