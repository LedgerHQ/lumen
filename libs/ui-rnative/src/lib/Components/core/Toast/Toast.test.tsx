import { describe, it, expect, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Toast } from './Toast';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Toast', () => {
  describe('Rendering', () => {
    it('should render the title', () => {
      const { getByText } = render(
        <TestWrapper>
          <Toast title='Payment done' />
        </TestWrapper>,
      );
      getByText('Payment done');
    });

    it('should wrap the title over up to five lines', () => {
      const { getByText } = render(
        <TestWrapper>
          <Toast title='A very long toast title' />
        </TestWrapper>,
      );
      expect(getByText('A very long toast title').props.numberOfLines).toBe(5);
    });

    it('should not render a leading icon for the info appearance', () => {
      const { queryByTestId } = render(
        <TestWrapper>
          <Toast title='Info' appearance='info' />
        </TestWrapper>,
      );
      expect(queryByTestId('toast-icon')).toBeNull();
    });

    it('should render a status icon for non-info appearances', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast title='Saved' appearance='success' />
        </TestWrapper>,
      );
      getByTestId('toast-icon');
    });

    it('should render a spinner while loading', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast title='Uploading' loading />
        </TestWrapper>,
      );
      getByTestId('toast-spinner');
    });
  });

  describe('Layout', () => {
    it('should wrap the title and action together, so an action that does not fit drops to its own line under the title', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast
            title='Report ready'
            action={{ label: 'Download the report', onAction: jest.fn() }}
          />
        </TestWrapper>,
      );
      expect(getByTestId('toast-text-action').props.style).toEqual(
        expect.objectContaining({
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }),
      );
      expect(
        getByTestId('toast-text-action').props.style.justifyContent,
      ).toBeUndefined();
    });

    it('should not shift the action when there is no leading icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast
            appearance='info'
            title='Report ready'
            action={{ label: 'Open', onAction: jest.fn() }}
          />
        </TestWrapper>,
      );
      expect(
        StyleSheet.flatten(getByTestId('toast-action').props.style).marginLeft,
      ).toBeUndefined();
    });

    it('should shift the action to align its label with the title when there is a leading icon', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast
            appearance='success'
            title='Report ready'
            action={{ label: 'Open', onAction: jest.fn() }}
          />
        </TestWrapper>,
      );
      expect(
        StyleSheet.flatten(getByTestId('toast-action').props.style).marginLeft,
      ).toBe(-16);
    });

    it('should shift the action to align its label with the title when loading', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <Toast
            loading
            title='Uploading'
            action={{ label: 'Cancel', onAction: jest.fn() }}
          />
        </TestWrapper>,
      );
      expect(
        StyleSheet.flatten(getByTestId('toast-action').props.style).marginLeft,
      ).toBe(-16);
    });
  });

  describe('Accessibility', () => {
    it('should announce info and success politely', () => {
      const { getByTestId, rerender } = render(
        <TestWrapper>
          <Toast testID='toast' title='Info' appearance='info' />
        </TestWrapper>,
      );
      expect(getByTestId('toast').props.accessibilityLiveRegion).toBe('polite');

      rerender(
        <TestWrapper>
          <Toast testID='toast' title='Saved' appearance='success' />
        </TestWrapper>,
      );
      expect(getByTestId('toast').props.accessibilityLiveRegion).toBe('polite');
    });

    it('should announce warning and error assertively', () => {
      const { getByTestId, rerender } = render(
        <TestWrapper>
          <Toast testID='toast' title='Careful' appearance='warning' />
        </TestWrapper>,
      );
      expect(getByTestId('toast').props.accessibilityLiveRegion).toBe(
        'assertive',
      );

      rerender(
        <TestWrapper>
          <Toast testID='toast' title='Failed' appearance='error' />
        </TestWrapper>,
      );
      expect(getByTestId('toast').props.accessibilityLiveRegion).toBe(
        'assertive',
      );
    });
  });

  describe('Interactions', () => {
    it('should render the action and fire onAction', () => {
      const onAction = jest.fn();
      const { getByText } = render(
        <TestWrapper>
          <Toast title='Upload failed' action={{ label: 'Retry', onAction }} />
        </TestWrapper>,
      );

      fireEvent.press(getByText('Retry'));
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });
});
