import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { act, render, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { ToastProvider } from './ToastProvider';
import type { ToastController, ToastProviderProps } from './types';
import { useToast } from './useToast';

let controller: ToastController;

const Capture = () => {
  controller = useToast();
  return null;
};

const initialMetrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

const renderProvider = (props?: Omit<ToastProviderProps, 'children'>) =>
  render(
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
        <ToastProvider {...props}>
          <Capture />
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>,
  );

const EXIT_ANIMATION_MS = 300;

const flushExit = (): void => {
  act(() => {
    jest.advanceTimersByTime(EXIT_ANIMATION_MS);
  });
};

describe('ToastProvider', () => {
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
      renderProvider();
      act(() => {
        controller.info({ title: 'Hello' });
      });
      screen.getByText('Hello');
    });

    it('should auto-dismiss info after the default 5s', () => {
      renderProvider();
      act(() => {
        controller.info({ title: 'Hello' });
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
      renderProvider();
      act(() => {
        controller.warning({ title: 'Careful' });
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Careful');
    });

    it('should queue items past maxItems and promote them as slots free', () => {
      renderProvider({ maxItems: 1 });
      act(() => {
        controller.info({ title: 'First' });
        controller.info({ title: 'Second' });
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

    it('should restart the timer when a loading toast becomes a success', () => {
      renderProvider();
      let id = '';
      act(() => {
        id = controller.loading({ title: 'Loading' }).id;
      });

      act(() => {
        jest.advanceTimersByTime(60000);
      });
      screen.getByText('Loading');

      act(() => {
        controller.update(id, {
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
      renderProvider();
      act(() => {
        controller.info({ title: 'First' });
        controller.info({ title: 'Second' });
      });

      screen.getByText('First');
      expect(screen.queryByText('Second')).toBeNull();
    });

    it('should default position to bottom', () => {
      const { getByTestId } = renderProvider();
      const viewport = getByTestId('toast-viewport');
      expect(viewport.props.style.bottom).toBeDefined();
      expect(viewport.props.style.top).toBeUndefined();
    });

    it('should default insets to 0 and still apply the breathing-room gap', () => {
      const { getByTestId } = renderProvider();
      expect(getByTestId('toast-viewport').props.style.bottom).toBe(24);
    });

    it('adds a custom bottom inset to the gap instead of replacing it', () => {
      const { getByTestId } = renderProvider({ insets: { bottom: 80 } });
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
      renderProvider({ maxItems: 2 });
      let first = '';
      act(() => {
        first = controller.warning({ title: 'A' }).id;
        controller.warning({ title: 'B' });
      });

      act(() => {
        controller.dismiss(first);
      });
      screen.getByText('A');

      flushExit();
      expect(screen.queryByText('A')).toBeNull();
      screen.getByText('B');

      act(() => {
        controller.dismissAll();
      });
      flushExit();
      expect(screen.queryByText('B')).toBeNull();
    });

    it('should dismiss on a swipe past the threshold', () => {
      const { getByTestId } = renderProvider();
      act(() => {
        controller.warning({ title: 'Swipe me' });
      });

      const entry = getByTestId('toast-entry');
      act(() => {
        entry.props.onEnd({ translationX: 150 });
      });

      flushExit();
      expect(screen.queryByText('Swipe me')).toBeNull();
    });

    it('should spring back and stay visible on a swipe under the threshold', () => {
      const { getByTestId } = renderProvider();
      act(() => {
        controller.warning({ title: 'Stays put' });
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
      renderProvider();

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
      screen.getByText('Saving');

      resolveFn('ok');
      expect(await screen.findByText('Saved')).toBeTruthy();
    });
  });

  describe('useToast', () => {
    it('should throw when used outside a provider', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {
        return;
      });
      expect(() =>
        render(
          <ThemeProvider
            themes={ledgerLiveThemes}
            colorScheme='dark'
            locale='en'
          >
            <Capture />
          </ThemeProvider>,
        ),
      ).toThrow(/ToastProvider/);
      errorSpy.mockRestore();
    });
  });
});
