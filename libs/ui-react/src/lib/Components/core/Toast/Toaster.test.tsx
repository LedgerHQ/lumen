import { resetToastStore, toast } from '@ledgerhq/lumen-utils-shared';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { useLayoutEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Toaster } from './Toaster';
import type { ToasterProps } from './types';

const renderToaster = (props?: ToasterProps) => render(<Toaster {...props} />);

const EXIT_ANIMATION_MS = 300;

const flushExit = (): void => {
  act(() => {
    vi.advanceTimersByTime(EXIT_ANIMATION_MS);
  });
};

const CLOSE_LABEL = 'components.toast.closeAriaLabel';

describe('Toaster', () => {
  beforeEach(() => {
    resetToastStore();
  });

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
      renderToaster();
      act(() => {
        toast.info({ title: 'Hello' });
      });
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });

    it('should show a toast that was notified before the toaster mounted', () => {
      act(() => {
        toast.info({ title: 'Queued early' });
      });
      expect(screen.queryByText('Queued early')).not.toBeInTheDocument();

      renderToaster();
      expect(screen.getByText('Queued early')).toBeInTheDocument();
    });

    it('should apply Toaster props to toasts fired before its effects run', () => {
      const EarlyNotifier = () => {
        useLayoutEffect(() => {
          toast.info({ title: 'First' });
          toast.info({ title: 'Second' });
        }, []);
        return null;
      };
      render(
        <>
          <EarlyNotifier />
          <Toaster maxItems={1} durations={{ info: 1000 }} />
        </>,
      );

      expect(screen.queryByText('Second')).not.toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      flushExit();
      expect(screen.queryByText('First')).not.toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('should auto-dismiss info after the short duration', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Hello' });
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
      renderToaster();
      act(() => {
        toast.warning({ title: 'Careful' });
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Careful')).toBeInTheDocument();
    });

    it('should queue items past maxItems and promote them as slots free', () => {
      renderToaster({ maxItems: 1 });
      act(() => {
        toast.info({ title: 'First' });
        toast.info({ title: 'Second' });
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
      renderToaster();
      let id = '';
      act(() => {
        id = toast.loading({ title: 'Loading', duration: 10000 }).id;
      });

      act(() => {
        toast.update(id, {
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
      renderToaster();
      let id = '';
      act(() => {
        id = toast.loading({ title: 'Loading' }).id;
      });

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Loading')).toBeInTheDocument();

      act(() => {
        toast.update(id, {
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

    it('should pause timers while the viewport is hovered and resume the remaining time on leave', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Hover me' });
      });

      const viewport = document.querySelector('[data-slot="toast-viewport"]');
      expect(viewport).not.toBeNull();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      fireEvent.mouseEnter(viewport as Element);
      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Hover me')).toBeInTheDocument();

      fireEvent.mouseLeave(viewport as Element);
      act(() => {
        vi.advanceTimersByTime(2999);
      });
      expect(screen.getByText('Hover me')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      flushExit();
      expect(screen.queryByText('Hover me')).not.toBeInTheDocument();
    });

    it('should stay paused when the pointer leaves while focus is still inside', () => {
      renderToaster();
      act(() => {
        toast.info({
          title: 'Focus me',
          action: { label: 'Undo', onAction: () => {} },
        });
      });

      const viewport = document.querySelector('[data-slot="toast-viewport"]');
      const action = screen.getByRole('button', { name: 'Undo' });

      fireEvent.mouseEnter(viewport as Element);
      fireEvent.focus(action);
      fireEvent.mouseLeave(viewport as Element);

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Focus me')).toBeInTheDocument();

      fireEvent.blur(action, { relatedTarget: document.body });
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Focus me')).not.toBeInTheDocument();
    });

    it('should resume on pointer leave after clicking the action', () => {
      renderToaster();
      act(() => {
        toast.info({
          title: 'Click me',
          action: { label: 'Undo', onAction: () => {} },
        });
      });

      const viewport = document.querySelector('[data-slot="toast-viewport"]');
      const action = screen.getByRole('button', { name: 'Undo' });

      fireEvent.mouseEnter(viewport as Element);
      fireEvent.pointerDown(action);
      fireEvent.focus(action);
      fireEvent.pointerUp(action);
      fireEvent.click(action);
      fireEvent.mouseLeave(viewport as Element);

      act(() => {
        vi.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    });

    it('should stay paused while focus moves between controls of a toast', () => {
      renderToaster();
      act(() => {
        toast.info({
          title: 'Tab me',
          action: { label: 'Undo', onAction: () => {} },
        });
      });

      const action = screen.getByRole('button', { name: 'Undo' });
      const close = screen.getByRole('button', { name: CLOSE_LABEL });

      fireEvent.focus(action);
      fireEvent.blur(action, { relatedTarget: close });
      fireEvent.focus(close);

      act(() => {
        vi.advanceTimersByTime(60000);
      });
      expect(screen.getByText('Tab me')).toBeInTheDocument();
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
      renderToaster();
      act(() => {
        toast.warning({ title: 'Careful' });
      });

      const slot = document.querySelector('[data-slot="toast-collapse"]');
      expect(slot).toHaveClass('z-10');

      fireEvent.click(screen.getByRole('button', { name: CLOSE_LABEL }));
      expect(slot).toHaveClass('z-0');
      expect(slot).toHaveStyle({ height: '0px' });

      flushExit();
      expect(screen.queryByText('Careful')).not.toBeInTheDocument();
    });

    it('should dismiss via the close button', () => {
      renderToaster();
      act(() => {
        toast.warning({ title: 'Careful' });
      });

      fireEvent.click(screen.getByRole('button', { name: CLOSE_LABEL }));
      flushExit();
      expect(screen.queryByText('Careful')).not.toBeInTheDocument();
    });

    it('should not render a close button when dismissible is false', () => {
      renderToaster();
      act(() => {
        toast.warning({ title: 'Sticky', dismissible: false });
      });

      expect(
        screen.queryByRole('button', { name: CLOSE_LABEL }),
      ).not.toBeInTheDocument();
    });

    it('should dismiss a single item by id and dismiss all', () => {
      renderToaster();
      let first = '';
      act(() => {
        first = toast.warning({ title: 'A' }).id;
        toast.warning({ title: 'B' });
      });

      act(() => {
        toast.dismiss(first);
      });
      expect(screen.getByText('A')).toBeInTheDocument();

      flushExit();
      expect(screen.queryByText('A')).not.toBeInTheDocument();
      expect(screen.getByText('B')).toBeInTheDocument();

      act(() => {
        toast.dismissAll();
      });
      flushExit();
      expect(screen.queryByText('B')).not.toBeInTheDocument();
    });
  });

  describe('promise', () => {
    it('should move the toast from loading to success', async () => {
      render(<Toaster />);

      let resolveFn: (value: string) => void = () => {};
      const promise = new Promise<string>((resolve) => {
        resolveFn = resolve;
      });

      act(() => {
        toast.promise(promise, {
          loading: { title: 'Saving' },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(screen.getByText('Saving')).toBeInTheDocument();

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
    });

    it('should drop the loading action when success omits it', async () => {
      render(<Toaster />);

      let resolveFn: (value: string) => void = () => {};
      const promise = new Promise<string>((resolve) => {
        resolveFn = resolve;
      });

      act(() => {
        toast.promise(promise, {
          loading: {
            title: 'Saving',
            action: { label: 'Cancel', onAction: () => {} },
          },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument();
    });

    it('should drop the loading action when error omits it', async () => {
      render(<Toaster />);

      let rejectFn: (reason: unknown) => void = () => {};
      const promise = new Promise<string>((_resolve, reject) => {
        rejectFn = reject;
      });

      act(() => {
        toast.promise(promise, {
          loading: {
            title: 'Saving',
            action: { label: 'Cancel', onAction: () => {} },
          },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(
        screen.getByRole('button', { name: 'Cancel' }),
      ).toBeInTheDocument();

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Cancel' }),
      ).not.toBeInTheDocument();
    });

    it('should restore the close button when error omits dismissible', async () => {
      render(<Toaster />);

      let rejectFn: (reason: unknown) => void = () => {};
      const promise = new Promise<string>((_resolve, reject) => {
        rejectFn = reject;
      });

      act(() => {
        toast.promise(promise, {
          loading: { title: 'Saving', dismissible: false },
          success: { title: 'Saved' },
          error: { title: 'Failed' },
        });
      });
      expect(
        screen.queryByRole('button', { name: CLOSE_LABEL }),
      ).not.toBeInTheDocument();

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: CLOSE_LABEL }),
      ).toBeInTheDocument();
    });

    it('should move the toast from loading to error on rejection', async () => {
      render(<Toaster />);

      let rejectFn: (reason: unknown) => void = () => {};
      const promise = new Promise<string>((_resolve, reject) => {
        rejectFn = reject;
      });

      act(() => {
        toast.promise(promise, {
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
        renderToaster({ position });
        act(() => {
          toast.warning({ title: 'Hello' });
        });
        expect(document.querySelector('[data-slot="toast-item"]')).toHaveClass(
          animationClass,
        );
      },
    );
  });

  describe('Multiple instances', () => {
    it('warns when a second Toaster mounts while one is already mounted', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const first = renderToaster();
      expect(warnSpy).not.toHaveBeenCalled();

      const second = renderToaster();
      expect(warnSpy).toHaveBeenCalledTimes(1);
      expect(warnSpy.mock.calls[0][0]).toContain('<Toaster />');

      first.unmount();
      second.unmount();
      warnSpy.mockRestore();
    });
  });

  describe('SSR', () => {
    it('should server-render an empty queue even when toasts are pending', () => {
      toast.warning({ title: 'Queued before render' });

      expect(renderToString(<Toaster />)).toBe('');
    });
  });
});
