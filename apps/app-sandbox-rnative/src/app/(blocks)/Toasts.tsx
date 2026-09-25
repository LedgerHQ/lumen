import type { ToastAppearance } from '@ledgerhq/lumen-ui-rnative';
import { Box, Button, useToast } from '@ledgerhq/lumen-ui-rnative';
import { useToastControls } from '../../hooks/useToastControls';

const simulateSaveProfile = () =>
  new Promise<void>((resolve, reject) =>
    setTimeout(
      () => (Math.random() > 0.3 ? resolve() : reject(new Error('Network'))),
      1500,
    ),
  );

const RANDOM_APPEARANCES: ToastAppearance[] = [
  'info',
  'success',
  'warning',
  'error',
];

const RANDOM_TITLES = [
  'Payment done',
  'Report ready for review in 30 minutes',
  'This is a very long toast message that wraps over up to five lines without an action',
  'This is a very long toast message that wraps over up to five lines',
];

const RANDOM_ACTION_LABELS = [
  'Open',
  'Undo',
  'Retry',
  'Download the report',
  'Retry the upload',
];

const pickRandom = <T,>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

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
        onPress={() =>
          toast.notify({
            appearance: pickRandom(RANDOM_APPEARANCES),
            title: pickRandom(RANDOM_TITLES),
            action:
              Math.random() > 0.5
                ? {
                    label: pickRandom(RANDOM_ACTION_LABELS),
                    onAction: () => console.log('Retry'),
                  }
                : undefined,
          })
        }
      >
        Notify random
      </Button>
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
