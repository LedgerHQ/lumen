import {
  resolveDurationMs,
  resolveMaxItems,
  toastStore,
  useToastBacklog,
  useToastLifecycle,
} from '@ledgerhq/lumen-utils-shared';
import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from 'react';
import { createPortal } from 'react-dom';
import {
  collapseVariants,
  positionVariants,
  queuedEnterVariants,
  slideEnterVariants,
  slideExitVariants,
} from './styles';
import { Toast } from './Toast';
import type { ToastItem, ToasterProps, ToastPosition } from './types';

// Toasts only come from client-side events, so the server always renders an
// empty queue. Module-level so React sees the same reference on every call.
const NO_TOASTS: ToastItem[] = [];
const getServerSnapshot = (): ToastItem[] => NO_TOASTS;

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState<number | null>(null);

  useToastLifecycle({ durationMs, paused, exiting, onDismiss });

  useEffect(() => {
    const element = contentRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setMeasuredHeight(entry.contentRect.height + 8);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

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
      style={{ height: exiting ? 0 : (measuredHeight ?? undefined) }}
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
 * more than one logs a console warning in development.
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
    getServerSnapshot,
  );
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return toastStore.registerRenderer();
  }, []);

  const visibleSlots = resolveMaxItems(maxItems);
  const visibleItems = items.slice(0, visibleSlots);
  const isQueued = useToastBacklog(items, visibleSlots);

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);
  const handleFocus = () => setFocusWithin(true);
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    setFocusWithin(false);
  };

  if (!mounted) return null;

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      data-slot='toast-viewport'
      className={positionVariants({ position })}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {visibleItems.map((item) => (
        <ToastQueueItem
          key={item.id}
          item={item}
          durationMs={resolveDurationMs(item, durations)}
          queued={isQueued(item.id)}
          position={position}
          paused={hovered || focusWithin}
          onDismiss={() => toastStore.dismiss(item.id)}
        />
      ))}
    </div>,
    document.body,
  );
};
