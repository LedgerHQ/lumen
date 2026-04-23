import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { act, render, screen } from '@testing-library/react-native';
import type { ReactElement } from 'react';
import { CheckmarkCircleFill } from '../../Symbols/Icons/CheckmarkCircleFill';
import { DeleteCircleFill } from '../../Symbols/Icons/DeleteCircleFill';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { TextInput } from './TextInput';

const { colors } = ledgerLiveThemes.dark;

const renderWithProvider = (
  component: ReactElement,
): Promise<ReturnType<typeof render>> => {
  let rendered: ReturnType<typeof render> | undefined;

  return act(async () => {
    rendered = render(
      <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
        {component}
      </ThemeProvider>,
    );
  }).then(() => rendered as ReturnType<typeof render>);
};

describe('TextInput', () => {
  describe('Helper text', () => {
    it('renders neutral helper text without feedback icons', async () => {
      await renderWithProvider(
        <TextInput label='Address' helperText='Enter your ETH address' />,
      );

      const helperText = screen.getByText('Enter your ETH address');

      expect(helperText).toBeTruthy();
      expect(helperText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.text.muted }),
        ]),
      );
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders error helper text with an error icon', async () => {
      await renderWithProvider(
        <TextInput
          label='Address'
          helperText='Invalid address format'
          status='error'
        />,
      );

      const helperText = screen.getByText('Invalid address format');

      expect(helperText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.text.error }),
        ]),
      );
      expect(screen.UNSAFE_getByType(DeleteCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(CheckmarkCircleFill)).toBeNull();
    });

    it('renders success helper text with a success icon', async () => {
      await renderWithProvider(
        <TextInput
          label='Address'
          helperText='Address verified'
          status='success'
        />,
      );

      const helperText = screen.getByText('Address verified');

      expect(helperText.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ color: colors.text.success }),
        ]),
      );
      expect(screen.UNSAFE_getByType(CheckmarkCircleFill)).toBeTruthy();
      expect(screen.UNSAFE_queryByType(DeleteCircleFill)).toBeNull();
    });
  });
});
