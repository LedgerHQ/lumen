import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import { ToastProvider } from './ToastProvider';
import type { ToastController, ToastProviderProps } from './types';
import { useToast } from './useToast';

let controller: ToastController;

const Capture = () => {
  controller = useToast();
  return null;
};

const renderProvider = (props?: Omit<ToastProviderProps, 'children'>) =>
  render(
    <ToastProvider {...props}>
      <Capture />
    </ToastProvider>,
  );

const EXIT_ANIMATION_MS = 300;

const flushExit = (): void => {
  act(() => {
    vi.advanceTimersByTime(EXIT_ANIMATION_MS);
  });
};

const CLOSE_LABEL = 'components.toast.closeAriaLabel';

describe('ToastProvider', () => {
  describe('Timing', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        vi.runOnlyPendingTimers();
      });
      vi.useRealTimers();
    });

    it('should render a toast on notify', () => {
      renderProvider();
      act(() => {
        controller.info({ title: 'Hello' });
      });
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should auto-dismiss info after the short duration', () => {
      renderProvider();
      act(() => {
        controller.info({ title: 'Hello' });
      });

      act(() => {
        vi.advanceTimersByTime(4999);
      });
      expect(screen.getByText('Hello')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByText('Hello')).toBeInTheDocument();

      flushExit();
      expect(screen.queryByText('Hello')).not.toBeInTheDocument();
    });

    it('should keep warning toasts until dismissed', () => {
      renderProvider();
      act(() => {
        controller.warning({ title: 'Careful' });
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Careful')).toBeInTheDocument();
    });

    it('should queue items past maxItems and promote them as slots free', () => {
      renderProvider({ maxItems: 1 });
      act(() => {
        controller.info({ title: 'First' });
        controller.info({ title: 'Second' });
      });

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.queryByText('Second')).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();

      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('should not keep a per-item duration across an update that omits it', () => {
      renderProvider();
      let id = '';
      act(() => {
        id = controller.loading({ title: 'Loading', duration: 10000 }).id;
      });

      act(() => {
        controller.update(id, {
          appearance: 'success',
          loading: false,
          title: 'Done',
        });
      });

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    it('should restart the timer when a loading toast becomes a success', () => {
      renderProvider();
      let id = '';
      act(() => {
        id = controller.loading({ title: 'Loading' }).id;
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Loading')).toBeInTheDocument();

      act(() => {
        controller.update(id, {
          appearance: 'success',
          loading: false,
          title: 'Done',
        });
      });
      expect(screen.getByText('Done')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Done')).not.toBeInTheDocument();
    });

    it('should pause timers while the viewport is hovered and restart on leave', () => {
      renderProvider();
      act(() => {
        controller.info({ title: 'Hover me' });
      });

      const viewport = document.querySelector('[data-slot="toast-viewport"]');
      expect(viewport).not.toBeNull();

      fireEvent.mouseEnter(viewport as Element);
      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Hover me')).toBeInTheDocument();

      fireEvent.mouseLeave(viewport as Element);
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Hover me')).not.toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        vi.runOnlyPendingTimers();
      });
      vi.useRealTimers();
    });

    it('should collapse the stack slot while exiting', () => {
      renderProvider();
      act(() => {
        controller.warning({ title: 'Careful' });
      });

      const slot = document.querySelector('[data-slot="toast-collapse"]');
      expect(slot).toHaveClass('h-64', 'z-10');

      fireEvent.click(screen.getByRole('button', { name: CLOSE_LABEL }));
      expect(slot).toHaveClass('h-0', 'z-0');

      flushExit();
      expect(screen.queryByText('Careful')).not.toBeInTheDocument();
    });

    it('should dismiss via the close button', () => {
      renderProvider();
      act(() => {
        controller.warning({ title: 'Careful' });
      });

      fireEvent.click(screen.getByRole('button', { name: CLOSE_LABEL }));
      flushExit();
      expect(screen.queryByText('Careful')).not.toBeInTheDocument();
    });

    it('should not render a close button when dismissible is false', () => {
      renderProvider();
      act(() => {
        controller.warning({ title: 'Sticky', dismissible: false });
      });

      expect(
        screen.queryByRole('button', { name: CLOSE_LABEL }),
      ).not.toBeInTheDocument();
    });

    it('should dismiss a single item by id and dismiss all', () => {
      renderProvider();
      let first = '';
      act(() => {
        first = controller.warning({ title: 'A' }).id;
        controller.warning({ title: 'B' });
      });

      act(() => {
        controller.dismiss(first);
      });
      expect(screen.getByText('A')).toBeInTheDocument();

      flushExit();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();

      act(() => {
        controller.dismissAll();
      });
      flushExit();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
    });
  });

  describe('promise', () => {
    it('should move the toast from loading to success', async () => {
      render(
        <ToastProvider>
          <Capture />
        </ToastProvider>,
      );

      let resolveFn: (value: string) => void = () => {};
      const promise = new Promise<string>((resolve) => {
        resolveFn = resolve;
      });

      act(() => {
        controller.promise(promise, {
          loading: { title: 'Saving' },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(screen.getByText('Saving')).toBeInTheDocument();

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('should move the toast from loading to error on rejection', async () => {
      render(
        <ToastProvider>
          <Capture />
        </ToastProvider>,
      );

      let rejectFn: (reason: unknown) => void = () => {};
      const promise = new Promise<string>((_resolve, reject) => {
        rejectFn = reject;
      });

      act(() => {
        controller.promise(promise, {
          loading: { title: 'Saving' },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(screen.getByText('Saving')).toBeInTheDocument();

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeInTheDocument();
    });
  });

  describe('Position', () => {
    it.each([
      ['top-left', 'animate-slide-in-from-left'],
      ['top-center', 'animate-slide-in-from-top'],
      ['top-right', 'animate-slide-in-from-right'],
      ['bottom-left', 'animate-slide-in-from-left'],
      ['bottom-center', 'animate-slide-in-from-bottom'],
      ['bottom-right', 'animate-slide-in-from-right'],
    ] as const)(
      'should slide in from the anchored edge for %s',
      (position, animationClass) => {
        renderProvider({ position });
        act(() => {
          controller.warning({ title: 'Hello' });
        });
        expect(document.querySelector('[data-slot="toast-item"]')).toHaveClass(
          animationClass,
        );
      },
    );
  });

  describe('useToast', () => {
    it('should throw when used outside a provider', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<Capture />)).toThrow(/ToastProvider/);
      errorSpy.mockRestore();
    });
  });
});
