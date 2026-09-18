import {
  createSafeContext,
  createToastController,
  useToastQueue,
  useToastTimer,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  collapseVariants,
  positionVariants,
  queuedEnterVariants,
  slideEnterVariants,
  slideExitVariants,
} from './styles';
import { Toast } from './Toast';
import type {
  ToastController,
  ToastItem,
  ToastPosition,
  ToastProviderProps,
} from './types';

const EXIT_ANIMATION_MS = 300;

const [ToastContextProvider, useToastContext] =
  createSafeContext<ToastController>('ToastProvider');

export { useToastContext };

const ToastQueueItem = ({
  item,
  position,
  paused,
  onDismiss,
}: {
  item: ToastItem;
  position: ToastPosition;
  paused: boolean;
  onDismiss: () => void;
}) => {
  const exiting = item.exiting ?? false;

  useToastTimer({
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
      data-slot='toast-collapse'
      className={collapseVariants({ edge, exiting })}
    >
      <div
        data-slot='toast-item'
        className={
          exiting
            ? slideExitVariants({ position })
            : item.queued
              ? queuedEnterVariants({ edge })
              : slideEnterVariants({ position })
        }
        style={exiting ? { animationFillMode: 'forwards' } : undefined}
      >
        <Toast
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
 * Provides the imperative toast controller to `useToast` and renders the
 * queue viewport in a portal on `document.body`. Wrap your app once; there is no
 * separate viewport component to mount.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-toast--docs Guidelines}
 *
 * @example
 * import { ToastProvider } from '@ledgerhq/lumen-ui-react';
 *
 * function App() {
 *   return (
 *     <ToastProvider position="bottom-right" maxItems={3}>
 *       <Routes />
 *     </ToastProvider>
 *   );
 * }
 */
export const ToastProvider = ({
  children,
  maxItems = 3,
  position = 'bottom-right',
  durations,
}: ToastProviderProps) => {
  const { items, add, update, dismiss, dismissAll } = useToastQueue(
    maxItems,
    durations,
  );
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const controller = useMemo(
    () => createToastController({ add, update, dismiss, dismissAll }),
    [add, update, dismiss, dismissAll],
  );

  const visibleItems = items.slice(0, maxItems);

  return (
    <ToastContextProvider value={controller}>
      {children}
      {mounted &&
        createPortal(
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            data-slot='toast-viewport'
            className={positionVariants({ position })}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {visibleItems.map((item) => (
              <ToastQueueItem
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
    </ToastContextProvider>
  );
};
