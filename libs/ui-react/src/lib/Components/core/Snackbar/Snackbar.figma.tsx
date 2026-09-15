import figma from '@figma/code-connect';
import { Snackbar } from './Snackbar';

figma.connect(
  Snackbar,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21016-59623',
  {
    imports: ["import { Snackbar } from '@ledgerhq/lumen-ui-react'"],
    props: {
      appearance: figma.enum('appearance', {
        info: 'info',
        success: 'success',
        warning: 'warning',
        error: 'error',
      }),
      loading: figma.enum('state', {
        enabled: false,
        loading: true,
      }),
      title: figma.string('text'),
      action: figma.enum('action', {
        none: undefined,
        'short-action': { label: 'Label', onAction: () => {} },
        'long-action': { label: 'Label', onAction: () => {} },
      }),
    },
    example: (props) => (
      <Snackbar
        appearance={props.appearance}
        loading={props.loading}
        title={props.title}
        action={props.action}
        onClose={() => {}}
      />
    ),
  },
);
