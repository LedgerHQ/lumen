import { createSafeContext } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Snackbar } from './Snackbar';
import type {
  SnackbarController,
  SnackbarItem,
  SnackbarPosition,
  SnackbarPromiseState,
  SnackbarProviderProps,
} from './types';
import { useSnackbarQueue } from './useSnackbarQueue';

const EXIT_ANIMATION_MS = 300;

const [SnackbarContextProvider, useSnackbarContext] =
  createSafeContext<SnackbarController>('SnackbarProvider');

export { useSnackbarContext };

const positionVariants = cva('pointer-events-none fixed z-snackbar flex', {
  variants: {
    position: {
      'top-left': 'top-24 left-24 flex-col items-start',
      'top-center': 'top-24 right-24 left-24 flex-col items-center',
      'top-right': 'top-24 right-24 flex-col items-end',
      'bottom-left': 'bottom-24 left-24 flex-col-reverse items-start',
      'bottom-center':
        'right-24 bottom-24 left-24 flex-col-reverse items-center',
      'bottom-right': 'right-24 bottom-24 flex-col-reverse items-end',
    } satisfies Record<SnackbarPosition, string>,
  },
});

const collapseVariants = cva(
  'flex flex-col transition-[height] duration-300 ease-out',
  {
    variants: {
      edge: {
        top: 'justify-start',
        bottom: 'justify-end',
      },
      exiting: {
        true: 'z-0 h-0',
        false: 'z-10 h-64',
      },
    },
  },
);

const slideEnterVariants = cva('pointer-events-auto', {
  variants: {
    position: {
      'top-left': 'animate-slide-in-from-left',
      'top-center': 'animate-slide-in-from-top',
      'top-right': 'animate-slide-in-from-right',
      'bottom-left': 'animate-slide-in-from-left',
      'bottom-center': 'animate-slide-in-from-bottom',
      'bottom-right': 'animate-slide-in-from-right',
    },
  },
});

const slideExitVariants = cva('pointer-events-auto', {
  variants: {
    position: {
      'top-left': 'animate-slide-out-to-left',
      'top-center': 'animate-slide-out-to-top',
      'top-right': 'animate-slide-out-to-right',
      'bottom-left': 'animate-slide-out-to-left',
      'bottom-center': 'animate-slide-out-to-bottom',
      'bottom-right': 'animate-slide-out-to-right',
    } satisfies Record<SnackbarPosition, string>,
  },
});

const resolvePromiseState = <Arg,>(
  state: SnackbarPromiseState | ((arg: Arg) => SnackbarPromiseState),
  arg: Arg,
): SnackbarPromiseState => (typeof state === 'function' ? state(arg) : state);

/**
 * Runs a single snackbar's countdown. The timer starts when the item mounts
 * (i.e. becomes visible) and pauses/resumes from the remaining time on
 * `paused` toggles. A real `durationMs` change (e.g. loading -> success)
 * restarts from the full new duration. `exiting` stops tracking entirely —
 * the item's fate is already owned by the exit-animation effect.
 */
const useSnackbarTimer = ({
  durationMs,
  paused,
  exiting,
  onExpire,
}: {
  durationMs: number;
  paused: boolean;
  exiting: boolean;
  onExpire: () => void;
}): void => {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const remainingRef = useRef(durationMs);
  const prevDurationMsRef = useRef(durationMs);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (exiting) return;

    if (durationMs !== prevDurationMsRef.current) {
      prevDurationMsRef.current = durationMs;
      remainingRef.current = durationMs;
    }

    if (paused || !Number.isFinite(remainingRef.current)) return;

    startedAtRef.current = Date.now();
    const timeoutId = setTimeout(
      () => onExpireRef.current(),
      remainingRef.current,
    );

    return () => {
      clearTimeout(timeoutId);
      if (startedAtRef.current !== null) {
        remainingRef.current -= Date.now() - startedAtRef.current;
        startedAtRef.current = null;
      }
    };
  }, [paused, exiting, durationMs]);
};

const SnackbarQueueItem = ({
  item,
  position,
  paused,
  onDismiss,
}: {
  item: SnackbarItem;
  position: SnackbarPosition;
  paused: boolean;
  onDismiss: () => void;
}) => {
  const exiting = item.exiting ?? false;

  useSnackbarTimer({
    durationMs: item.durationMs,
    paused,
    exiting,
    onExpire: onDismiss,
  });

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  useEffect(() => {
    if (!exiting) return;
    const timeoutId = setTimeout(
      () => onDismissRef.current(),
      EXIT_ANIMATION_MS,
    );
    return () => clearTimeout(timeoutId);
  }, [exiting]);

  const edge = position.startsWith('top') ? 'top' : 'bottom';

  return (
    <div
      data-slot='snackbar-collapse'
      className={collapseVariants({ edge, exiting })}
    >
      <div
        data-slot='snackbar-item'
        className={
          exiting
            ? slideExitVariants({ position })
            : slideEnterVariants({ position })
        }
        style={exiting ? { animationFillMode: 'forwards' } : undefined}
      >
        <Snackbar
          appearance={item.appearance}
          loading={item.loading}
          title={item.title}
          action={item.action}
          onClose={item.dismissible ? onDismiss : undefined}
        />
      </div>
    </div>
  );
};

/**
 * Provides the imperative snackbar controller to `useSnackbar` and renders the
 * queue viewport in a portal on `document.body`. Wrap your app once; there is no
 * separate viewport component to mount.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-snackbar--docs Guidelines}
 *
 * @example
 * import { SnackbarProvider } from '@ledgerhq/lumen-ui-react';
 *
 * function App() {
 *   return (
 *     <SnackbarProvider position="bottom-right" maxItems={3}>
 *       <Routes />
 *     </SnackbarProvider>
 *   );
 * }
 */
export const SnackbarProvider = ({
  children,
  maxItems = 3,
  position = 'bottom-right',
  durations,
}: SnackbarProviderProps) => {
  const { items, add, update, dismiss, dismissAll } = useSnackbarQueue(
    maxItems,
    durations,
  );
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const controller = useMemo<SnackbarController>(() => {
    const notify: SnackbarController['notify'] = (options) => ({
      id: add(options),
    });

    return {
      notify,
      info: (options) => notify({ ...options, appearance: 'info' }),
      success: (options) => notify({ ...options, appearance: 'success' }),
      warning: (options) => notify({ ...options, appearance: 'warning' }),
      error: (options) => notify({ ...options, appearance: 'error' }),
      loading: (options) =>
        notify({ ...options, appearance: 'info', loading: true }),
      update,
      dismiss,
      dismissAll,
      promise: (promise, options) => {
        const { id } = notify({
          ...options.loading,
          appearance: 'info',
          loading: true,
        });
        void promise.then(
          (value) =>
            update(id, {
              ...resolvePromiseState(options.success, value),
              appearance: 'success',
              loading: false,
            }),
          (error: unknown) =>
            update(id, {
              ...resolvePromiseState(options.error, error),
              appearance: 'error',
              loading: false,
            }),
        );
        return { id };
      },
    };
  }, [add, update, dismiss, dismissAll]);

  const visibleItems = items.slice(0, maxItems);

  return (
    <SnackbarContextProvider value={controller}>
      {children}
      {mounted &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            data-slot='snackbar-viewport'
            className={positionVariants({ position })}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {visibleItems.map((item) => (
              <SnackbarQueueItem
                key={item.id}
                item={item}
                position={position}
                paused={paused}
                onDismiss={() => dismiss(item.id)}
              />
            ))}
          </div>,
          document.body,
        )}
    </SnackbarContextProvider>
  );
};
