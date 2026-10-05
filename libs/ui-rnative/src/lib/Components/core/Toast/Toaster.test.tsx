import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  toast,
  toastStore,
  EXIT_ANIMATION_MS,
} from '@ledgerhq/lumen-utils-shared';
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { useLayoutEffect, type ReactNode } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Toaster } from './Toaster';
import type { ToasterProps } from './types';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const TestProviders = ({ children }: { children: ReactNode }) => (
  <SafeAreaProvider initialMetrics={initialMetrics}>
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {children}
    </ThemeProvider>
  </SafeAreaProvider>
);

const renderToaster = (props?: ToasterProps) =>
  render(
    <TestProviders>
      <Toaster {...props} />
    </TestProviders>,
  );

const clearToastItems = (): void => {
  for (const { id } of toastStore.getSnapshot()) {
    toastStore.dismiss(id);
    toastStore.dismiss(id);
  }
};

const flushExit = (): void => {
  act(() => {
    jest.advanceTimersByTime(EXIT_ANIMATION_MS);
  });
};

describe('Toaster', () => {
  beforeEach(() => {
    clearToastItems();
  });

  describe('Timing', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it('should render a toast on notify', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Hello' });
      });
      screen.getByText('Hello');
    });

    it('should show a toast that was notified before the toaster mounted', () => {
      act(() => {
        toast.info({ title: 'Queued early' });
      });

      renderToaster();
      screen.getByText('Queued early');
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
        <TestProviders>
          <EarlyNotifier />
          <Toaster maxItems={1} durations={{ info: 1000 }} />
        </TestProviders>,
      );

      expect(screen.queryByText('Second')).toBeNull();
      act(() => {
        jest.advanceTimersByTime(1000);
      });
      flushExit();
      expect(screen.queryByText('First')).toBeNull();
      screen.getByText('Second');
    });

    it('should auto-dismiss info after the default 5s', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Hello' });
      });

      act(() => {
        jest.advanceTimersByTime(4999);
      });
      screen.getByText('Hello');

      act(() => {
        jest.advanceTimersByTime(1);
      });
      flushExit();
      expect(screen.queryByText('Hello')).toBeNull();
    });

    it('should keep warning toasts until dismissed', () => {
      renderToaster();
      act(() => {
        toast.warning({ title: 'Careful' });
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Careful');
    });

    it('should queue items past maxItems and promote them as slots free', () => {
      renderToaster({ maxItems: 1 });
      act(() => {
        toast.info({ title: 'First' });
        toast.info({ title: 'Second' });
      });

      screen.getByText('First');
      expect(screen.queryByText('Second')).toBeNull();

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      flushExit();

      expect(screen.queryByText('First')).toBeNull();
      screen.getByText('Second');
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
        jest.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Done')).toBeNull();
    });

    it('should pause the timer while held and resume remaining time on release', () => {
      const { getByTestId } = renderToaster();
      act(() => {
        toast.info({ title: 'Hold me' });
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onTouchesDown();
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Hold me');

      act(() => {
        entry.props.onTouchesUp({ numberOfTouches: 0 });
      });

      act(() => {
        jest.advanceTimersByTime(2999);
      });
      screen.getByText('Hold me');

      act(() => {
        jest.advanceTimersByTime(1);
      });
      flushExit();
      expect(screen.queryByText('Hold me')).toBeNull();
    });

    it('should stay paused while swiping and resume once the toast springs back', () => {
      const { getByTestId } = renderToaster();
      act(() => {
        toast.info({ title: 'Swipe me' });
      });

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onTouchesDown();
        entry.props.onUpdate({ translationX: 40 });
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Swipe me');

      act(() => {
        entry.props.onEnd({ translationX: 20 });
        entry.props.onFinalize();
      });

      act(() => {
        jest.advanceTimersByTime(2999);
      });
      screen.getByText('Swipe me');

      act(() => {
        jest.advanceTimersByTime(1);
      });
      flushExit();
      expect(screen.queryByText('Swipe me')).toBeNull();
    });

    it('should restart the timer when a loading toast becomes a success', () => {
      renderToaster();
      let id = '';
      act(() => {
        id = toast.loading({ title: 'Loading' }).id;
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Loading');

      act(() => {
        toast.update(id, {
          appearance: 'success',
          loading: false,
          title: 'Done',
        });
      });
      screen.getByText('Done');

      act(() => {
        jest.advanceTimersByTime(5000);
      });
      flushExit();
      expect(screen.queryByText('Done')).toBeNull();
    });
  });

  describe('Defaults', () => {
    it('should default maxItems to 1', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'First' });
        toast.info({ title: 'Second' });
      });

      screen.getByText('First');
      expect(screen.queryByText('Second')).toBeNull();
    });

    it('should default position to bottom', () => {
      const { getByTestId } = renderToaster();
      const viewport = getByTestId('toast-viewport');
      expect(viewport.props.style.bottom).toBeDefined();
      expect(viewport.props.style.top).toBeUndefined();
    });

    it('should anchor the viewport to the top when position is top', () => {
      const { getByTestId } = renderToaster({ position: 'top' });
      const viewport = getByTestId('toast-viewport');
      expect(viewport.props.style.top).toBeDefined();
      expect(viewport.props.style.bottom).toBeUndefined();
    });

    it('should default insets to 0 and still apply the breathing-room gap', () => {
      const { getByTestId } = renderToaster();
      expect(getByTestId('toast-viewport').props.style.bottom).toBe(24);
    });

    it('adds a custom bottom inset to the gap instead of replacing it', () => {
      const { getByTestId } = renderToaster({ insets: { bottom: 80 } });
      expect(getByTestId('toast-viewport').props.style.bottom).toBe(104);
    });
  });

  describe('Dismissal', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it('should collapse the stack slot while exiting', () => {
      renderToaster();
      let id = '';
      act(() => {
        id = toast.warning({ title: 'Careful' }).id;
      });

      act(() => {
        toast.dismiss(id);
      });
      expect(screen.getByTestId('toast-collapse')).toHaveStyle({ height: 0 });

      flushExit();
      expect(screen.queryByText('Careful')).toBeNull();
    });

    it('should dismiss a single item by id and dismiss all', () => {
      renderToaster({ maxItems: 2 });
      let first = '';
      act(() => {
        first = toast.warning({ title: 'A' }).id;
        toast.warning({ title: 'B' });
      });

      act(() => {
        toast.dismiss(first);
      });
      screen.getByText('A');

      flushExit();
      expect(screen.queryByText('A')).toBeNull();
      screen.getByText('B');

      act(() => {
        toast.dismissAll();
      });
      flushExit();
      expect(screen.queryByText('B')).toBeNull();
    });

    it('should dismiss on a swipe past the threshold', () => {
      const { getByTestId } = renderToaster();
      act(() => {
        toast.warning({ title: 'Swipe me' });
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onEnd({ translationX: 150 });
      });

      flushExit();
      expect(screen.queryByText('Swipe me')).toBeNull();
    });

    it('should spring back and stay visible on a swipe under the threshold', () => {
      const { getByTestId } = renderToaster();
      act(() => {
        toast.warning({ title: 'Stays put' });
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onEnd({ translationX: 20 });
      });

      screen.getByText('Stays put');
    });

    it('should stay visible when swiped past the threshold if not dismissible', () => {
      const { getByTestId } = renderToaster();
      act(() => {
        toast.warning({ title: 'Locked', dismissible: false });
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onEnd({ translationX: 150 });
      });

      flushExit();
      screen.getByText('Locked');
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      jest.useRealTimers();
    });

    it('should expose the toast as one element labelled by its title', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Saved' });
      });

      const entry = screen.getByTestId('toast-entry');
      expect(entry.props.accessible).toBe(true);
      expect(entry.props.accessibilityLabel).toBe('Saved');
    });

    it('should dismiss through the dismiss accessibility action', () => {
      renderToaster();
      act(() => {
        toast.warning({ title: 'Dismiss me' });
      });

      expect(
        screen.getByTestId('toast-entry').props.accessibilityActions,
      ).toContainEqual({ name: 'dismiss', label: 'Close' });
      fireEvent(screen.getByTestId('toast-entry'), 'accessibilityAction', {
        nativeEvent: { actionName: 'dismiss' },
      });
      flushExit();
      expect(screen.queryByText('Dismiss me')).toBeNull();
    });

    it('should dismiss on the iOS escape gesture', () => {
      renderToaster();
      act(() => {
        toast.warning({ title: 'Escape me' });
      });

      fireEvent(screen.getByTestId('toast-entry'), 'accessibilityEscape');
      flushExit();
      expect(screen.queryByText('Escape me')).toBeNull();
    });

    it('should expose the inline action as an accessibility action', () => {
      const onAction = jest.fn();
      renderToaster();
      act(() => {
        toast.warning({
          title: 'Deleted',
          action: { label: 'Undo', onAction },
        });
      });

      const entry = screen.getByTestId('toast-entry');
      expect(entry.props.accessibilityActions).toContainEqual({
        name: 'toastAction',
        label: 'Undo',
      });
      fireEvent(entry, 'accessibilityAction', {
        nativeEvent: { actionName: 'toastAction' },
      });
      expect(onAction).toHaveBeenCalledTimes(1);
      screen.getByText('Deleted');
    });

    it('should not offer dismissal for a non-dismissible toast', () => {
      renderToaster();
      act(() => {
        toast.info({ title: 'Locked', dismissible: false });
      });

      const entry = screen.getByTestId('toast-entry');
      expect(entry.props.accessibilityActions).toEqual([]);
      expect(entry.props.onAccessibilityEscape).toBeUndefined();
    });

    describe('on iOS', () => {
      const originalOS = Platform.OS;

      beforeEach(() => {
        Platform.OS = 'ios';
      });

      afterEach(() => {
        Platform.OS = originalOS;
      });

      it('should announce the title, interrupting only for warning and error', () => {
        const announce = jest
          .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
          .mockImplementation(() => undefined);
        renderToaster({ maxItems: 2 });
        act(() => {
          toast.info({ title: 'Heads up' });
          toast.error({ title: 'Failed' });
        });

        expect(announce).toHaveBeenCalledWith('Heads up', { queue: true });
        expect(announce).toHaveBeenCalledWith('Failed', { queue: false });
        announce.mockRestore();
      });

      it('should announce again when the title changes', () => {
        const announce = jest
          .spyOn(AccessibilityInfo, 'announceForAccessibilityWithOptions')
          .mockImplementation(() => undefined);
        renderToaster();
        let id = '';
        act(() => {
          id = toast.info({ title: 'Uploading', loading: true }).id;
        });
        act(() => {
          toast.update(id, { title: 'Uploaded', appearance: 'success' });
        });

        expect(announce).toHaveBeenLastCalledWith('Uploaded', { queue: true });
        announce.mockRestore();
      });
    });
  });

  describe('promise', () => {
    it('should move the toast from loading to success', async () => {
      renderToaster();

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
      screen.getByText('Saving');

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeTruthy();
    });

    it('should drop the loading action when success omits it', async () => {
      renderToaster();

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
      screen.getByText('Cancel');

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeTruthy();
      expect(screen.queryByText('Cancel')).toBeNull();
    });

    it('should drop the loading action when error omits it', async () => {
      renderToaster();

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
      screen.getByText('Cancel');

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeTruthy();
      expect(screen.queryByText('Cancel')).toBeNull();
    });

    it('should restore dismissal when error omits dismissible', async () => {
      renderToaster();

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
        screen.getByTestId('toast-entry').props.onAccessibilityEscape,
      ).toBeUndefined();

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeTruthy();
      expect(
        screen.getByTestId('toast-entry').props.accessibilityActions,
      ).toContainEqual(expect.objectContaining({ name: 'dismiss' }));
    });

    it('should move the toast from loading to error on rejection', async () => {
      renderToaster();

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
      screen.getByText('Saving');

      rejectFn(new Error('nope'));
      expect(await screen.findByText('Failed')).toBeTruthy();
    });
  });

  describe('Multiple instances', () => {
    it('warns when a second Toaster mounts while one is already mounted', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {
        return;
      });

      const first = renderToaster();
      expect(warnSpy).not.toHaveBeenCalled();

      const second = renderToaster();
      expect(warnSpy).toHaveBeenCalledTimes(1);

      first.unmount();
      second.unmount();
      warnSpy.mockRestore();
    });
  });
});
