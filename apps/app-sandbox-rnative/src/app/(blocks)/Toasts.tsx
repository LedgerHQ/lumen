import { Box, Button, useToast } from '@ledgerhq/lumen-ui-rnative';
import { useToastControls } from '../../hooks/useToastControls';

const simulateSaveProfile = () =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (Math.random() > 0.3 ? resolve() : reject(new Error('Network'))),
      1500,
    ),
  );

export default function Toasts() {
  const toast = useToast();
  const { position, setPosition } = useToastControls();

  return (
    <Box lx={{ flexDirection: 'column', gap: 's12' }}>
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Button
          appearance={position === 'top' ? 'base' : 'no-background'}
          size='sm'
          onPress={() => setPosition('top')}
        >
          Top
        </Button>
        <Button
          appearance={position === 'bottom' ? 'base' : 'no-background'}
          size='sm'
          onPress={() => setPosition('bottom')}
        >
          Bottom
        </Button>
      </Box>

      <Button
        appearance='base'
        onPress={() => toast.info({ title: 'Info toast' })}
      >
        Info
      </Button>
      <Button
        appearance='base'
        onPress={() => toast.success({ title: 'Payment done' })}
      >
        Success
      </Button>
      <Button
        appearance='base'
        onPress={() => toast.warning({ title: 'Low balance (persists)' })}
      >
        Warning
      </Button>
      <Button
        appearance='base'
        onPress={() =>
          toast.error({
            title: 'Payment failed',
            action: { label: 'Retry', onAction: () => console.log('Retry') },
          })
        }
      >
        Error with action
      </Button>
      <Button
        appearance='base'
        onPress={() => {
          const { id } = toast.loading({ title: 'Uploading…' });
          setTimeout(() => {
            toast.update(id, {
              appearance: 'success',
              loading: false,
              title: 'Upload complete',
            });
          }, 2000);
        }}
      >
        Loading → success
      </Button>
      <Button
        appearance='base'
        onPress={() =>
          toast.promise(simulateSaveProfile(), {
            loading: { title: 'Saving…' },
            success: { title: 'Profile saved' },
            error: {
              title: 'Could not save',
              action: { label: 'Retry', onAction: () => console.log('Retry') },
            },
          })
        }
      >
        Promise (random outcome)
      </Button>
      <Button
        appearance='base'
        onPress={() =>
          toast.notify({
            title: 'Sticky — swipe disabled',
            dismissible: false,
          })
        }
      >
        Not dismissible
      </Button>
      <Button appearance='gray' onPress={() => toast.dismissAll()}>
        Dismiss all
      </Button>
    </Box>
  );
}
