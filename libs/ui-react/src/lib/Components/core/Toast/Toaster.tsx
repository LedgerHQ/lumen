import {
  resolveDurationMs,
  resolveMaxItems,
  toastStore,
  useToastBacklog,
  useToastLifecycle,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import { useToastCollapse } from './hooks/useToastCollapse';
import { useToastViewportPause } from './hooks/useToastViewportPause';
import {
  collapseVariants,
  positionVariants,
  queuedEnterVariants,
  slideEnterVariants,
  slideExitVariants,
} from './styles';
import { Toast } from './Toast';
import type { ToastItem, ToasterProps, ToastPosition } from './types';

const ToastQueueItem = ({
  item,
  durationMs,
  queued,
  position,
  paused,
  onDismiss,
}: {
  item: ToastItem;
  durationMs: number;
  queued: boolean;
  position: ToastPosition;
  paused: boolean;
  onDismiss: () => void;
}) => {
  const exiting = item.exiting ?? false;
  const { contentRef, height } = useToastCollapse();

  useToastLifecycle({ durationMs, paused, exiting, onDismiss });

  const edge = position.startsWith('top') ? 'top' : 'bottom';
  const resolveMotionClass = (): string => {
    if (exiting) return slideExitVariants({ position });
    if (queued) return queuedEnterVariants({ edge });
    return slideEnterVariants({ position });
  };

  return (
    <div
      data-slot='toast-collapse'
      className={collapseVariants({ edge, exiting })}
      style={{ height: exiting ? 0 : height }}
    >
      <div
        ref={contentRef}
        data-slot='toast-item'
        className={resolveMotionClass()}
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
 * Subscribes to the module-level toast store and renders the queue viewport
 * in a portal on `document.body`. Mount it once, anywhere in the tree — it
 * takes no children. `toast.*` from `@ledgerhq/lumen-utils-shared` works even
 * before this mounts, or from outside the React tree entirely.
 *
 * Mount exactly one `<Toaster />` for the whole app. Every instance renders
 * the full queue, so a second one duplicates every toast on screen — mounting
 * more than one logs a console warning.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-toast--docs Guidelines}
 *
 * @example
 * import { Toaster } from '@ledgerhq/lumen-ui-react';
 *
 * function App() {
 *   return (
 *     <>
 *       <Toaster position="bottom-right" maxItems={3} />
 *       <Routes />
 *     </>
 *   );
 * }
 */
export const Toaster = ({
  maxItems = 3,
  position = 'bottom-right',
  durations,
}: ToasterProps) => {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  const [mounted, setMounted] = useState(false);
  const { paused, viewportProps } = useToastViewportPause();

  useEffect(() => {
    setMounted(true);
    return toastStore.registerRenderer();
  }, []);

  const visibleSlots = resolveMaxItems(maxItems);
  const visibleItems = items.slice(0, visibleSlots);
  const isQueued = useToastBacklog(items, visibleSlots);

  if (!mounted) return null;

  return createPortal(
    <div
      data-slot='toast-viewport'
      className={positionVariants({ position })}
      {...viewportProps}
    >
      {visibleItems.map((item) => (
        <ToastQueueItem
          key={item.id}
          item={item}
          durationMs={resolveDurationMs(item, durations)}
          queued={isQueued(item.id)}
          position={position}
          paused={paused}
          onDismiss={() => toastStore.dismiss(item.id)}
        />
      ))}
    </div>,
    document.body,
  );
};
