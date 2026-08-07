import { describe, expect, it, jest } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { AmountInput } from './AmountInput';

const hidden = { includeHiddenElements: true } as const;

const renderWithProvider = (component: React.ReactElement) =>
  render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );

describe('AmountInput', () => {
  describe('Rendering', () => {
    it('renders with an empty value', () => {
      renderWithProvider(
        <AmountInput value='' onChangeText={jest.fn()} testID='input' />,
      );
      expect(screen.getByTestId('input')).toBeTruthy();
    });

    it('renders the currency text', () => {
      renderWithProvider(
        <AmountInput value='' onChangeText={jest.fn()} currencyText='USD' />,
      );
      expect(screen.getByText('USD', hidden)).toBeTruthy();
    });

    it('displays 0 when value is empty', () => {
      renderWithProvider(<AmountInput value='' onChangeText={jest.fn()} />);
      expect(screen.getByText('0', hidden)).toBeTruthy();
    });
  });

  describe('Interactions', () => {
    it('calls onChangeText with formatted text on change', () => {
      const onChangeText = jest.fn();
      renderWithProvider(
        <AmountInput
          value=''
          onChangeText={onChangeText}
          testID='input'
          thousandsSeparator={false}
        />,
      );
      fireEvent.changeText(screen.getByTestId('input'), '123.45');
      expect(onChangeText).toHaveBeenCalledWith('123.45');
    });

    it('formats with thousands separator on user input', () => {
      const onChangeText = jest.fn();
      renderWithProvider(
        <AmountInput value='' onChangeText={onChangeText} testID='input' />,
      );
      fireEvent.changeText(screen.getByTestId('input'), '1000');
      expect(onChangeText).toHaveBeenCalledWith('1 000');
    });

    it('strips decimal input when allowDecimals is false', () => {
      const onChangeText = jest.fn();
      renderWithProvider(
        <AmountInput
          value=''
          onChangeText={onChangeText}
          allowDecimals={false}
          thousandsSeparator={false}
          testID='input'
        />,
      );
      fireEvent.changeText(screen.getByTestId('input'), '12.34');
      expect(onChangeText).toHaveBeenCalledWith('1234');
    });

    it('truncates decimal part with maxDecimalLength on user input', () => {
      const onChangeText = jest.fn();
      renderWithProvider(
        <AmountInput
          value=''
          onChangeText={onChangeText}
          maxDecimalLength={2}
          thousandsSeparator={false}
          testID='input'
        />,
      );
      fireEvent.changeText(screen.getByTestId('input'), '1.2345');
      expect(onChangeText).toHaveBeenCalledWith('1.23');
    });
  });

  describe('programmatic value formatting', () => {
    it('formats a raw unformatted string on initial render', () => {
      renderWithProvider(
        <AmountInput value='2433.123456789' onChangeText={jest.fn()} />,
      );
      expect(screen.getByText('2 433.123456789', hidden)).toBeTruthy();
    });

    it('formats a number value on initial render', () => {
      renderWithProvider(
        <AmountInput value={2433.123456789} onChangeText={jest.fn()} />,
      );
      expect(screen.getByText('2 433.123456789', hidden)).toBeTruthy();
    });

    it('adds thousands grouping for a large number value', () => {
      renderWithProvider(
        <AmountInput value={1000000} onChangeText={jest.fn()} />,
      );
      expect(screen.getByText('1 000 000', hidden)).toBeTruthy();
    });

    it('applies maxDecimalLength to a programmatically set value', () => {
      renderWithProvider(
        <AmountInput
          value='2433.123456789'
          maxDecimalLength={2}
          onChangeText={jest.fn()}
        />,
      );
      expect(screen.getByText('2 433.12', hidden)).toBeTruthy();
    });

    it('applies maxIntegerLength to a programmatically set value', () => {
      renderWithProvider(
        <AmountInput
          value='1234567890'
          maxIntegerLength={3}
          allowDecimals={false}
          thousandsSeparator={false}
          onChangeText={jest.fn()}
        />,
      );
      expect(screen.getByText('123', hidden)).toBeTruthy();
    });

    it('omits thousands separator when thousandsSeparator is false', () => {
      renderWithProvider(
        <AmountInput
          value='2433.12'
          thousandsSeparator={false}
          onChangeText={jest.fn()}
        />,
      );
      expect(screen.getByText('2433.12', hidden)).toBeTruthy();
    });

    it('formats consistently with what typing the same digits produces', () => {
      const onChangeText = jest.fn();
      renderWithProvider(
        <AmountInput
          value='2433.123456789'
          onChangeText={onChangeText}
          testID='input'
        />,
      );

      expect(screen.getByText('2 433.123456789', hidden)).toBeTruthy();

      fireEvent.changeText(screen.getByTestId('input'), '2433.123456789');
      expect(onChangeText).toHaveBeenCalledWith('2 433.123456789');
    });
  });
});
