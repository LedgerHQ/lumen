import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { CheckmarkCircleFill } from '../../Symbols/Icons/CheckmarkCircleFill';
import { DeleteCircleFill } from '../../Symbols/Icons/DeleteCircleFill';
import { InformationFill } from '../../Symbols/Icons/InformationFill';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TextInput } from './TextInput';

const { colors } = ledgerLiveThemes.dark;

const renderWithProvider = (
  component: ReactElement,
): ReturnType<typeof render> => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('TextInput', () => {
  describe('Placeholder and label (BaseInput parity with web)', () => {
    it('uses the provided placeholder when label and placeholder are both set', async () => {
      await renderWithProvider(
        <TextInput
          label='Username'
          placeholder='jane.doe'
          value=''
          onChangeText={() => {}}
        />,
      );

      expect(screen.getByPlaceholderText('jane.doe')).toBeTruthy();
    });
  });

  describe('Helper text', () => {
    it('renders neutral helper text with an info icon', () => {
      renderWithProvider(
        <TextInput label='Address' helperText='Enter your ETH address' />,
      );

      const helperText = screen.getByText('Enter your ETH address');

      expect(helperText).toBeTruthy();
      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.muted }),
      );
      expect(screen.UNSAFE_getByType(InformationFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders error helper text with an error icon', () => {
      renderWithProvider(
        <TextInput
          label='Address'
          helperText='Invalid address format'
          status='error'
        />,
      );

      const helperText = screen.getByText('Invalid address format');

      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.error }),
      );
      expect(screen.UNSAFE_getByType(DeleteCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders success helper text with a success icon', () => {
      renderWithProvider(
        <TextInput
          label='Address'
          helperText='Address verified'
          status='success'
        />,
      );

      const helperText = screen.getByText('Address verified');

      expect(helperText.props.style).toEqual(
        expect.objectContaining({ color: colors.text.success }),
      );
      expect(screen.UNSAFE_getByType(CheckmarkCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
    });
  });

  describe('Character counter', () => {
    it('renders character counter when maxCount is set', () => {
      renderWithProvider(
        <TextInput
          label='Bio'
          value='Hello'
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      expect(screen.getByText('5/32')).toBeTruthy();
    });

    it('does not render character counter when maxCount is omitted', () => {
      renderWithProvider(
        <TextInput label='Bio' value='Hello' onChangeText={() => {}} />,
      );

      expect(screen.queryByText(/\d+\/\d+/)).toBeNull();
    });

    it('keeps counter muted when count exceeds maxCount', () => {
      const longValue = 'This text exceeds the character limit';

      renderWithProvider(
        <TextInput
          label='Bio'
          value={longValue}
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      const counter = screen.getByText(`${longValue.length}/32`);

      expect(counter.props.style).toEqual(
        expect.objectContaining({ color: colors.text.muted }),
      );
    });

    it('does not truncate input when count exceeds maxCount', () => {
      const longValue = 'This text exceeds the character limit';

      renderWithProvider(
        <TextInput
          label='Bio'
          value={longValue}
          onChangeText={() => {}}
          maxCount={32}
        />,
      );

      expect(screen.getByDisplayValue(longValue)).toBeTruthy();
    });
  });
});
