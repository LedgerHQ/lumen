import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { resetToastStore, toast } from '@ledgerhq/lumen-utils-shared';
import { act, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Toaster } from './Toaster';
import type { ToasterProps } from './types';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderToaster = (props?: ToasterProps) =>
  render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
        <Toaster {...props} />
      </ThemeProvider>
    </SafeAreaProvider>,
  );

const EXIT_ANIMATION_MS = 300;

const flushExit = (): void => {
  act(() => {
    jest.advanceTimersByTime(EXIT_ANIMATION_MS);
  });
};

describe('Toaster', () => {
  beforeEach(() => {
    resetToastStore();
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
        entry.props.onStart();
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Hold me');

      act(() => {
        entry.props.onFinalize();
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
        entry.props.onBegin();
        entry.props.onStart();
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
