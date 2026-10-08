import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { SpotNumber } from './SpotNumber';
import type { SpotSize } from './types';

const { colors } = ledgerLiveThemes.dark;
const typographies = {
  ...ledgerLiveThemes.dark.typographies.xs.heading,
  ...ledgerLiveThemes.dark.typographies.xs.body,
};

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const sizeTypography: [SpotSize, keyof typeof typographies][] = [
  [32, 'body2SemiBold'],
  [40, 'body1SemiBold'],
  [48, 'heading5'],
  [56, 'heading4'],
  [72, 'heading2'],
];

describe('SpotNumber', () => {
  it('should color the digit when fill is transparent', () => {
    render(
      <TestWrapper>
        <SpotNumber appearance='success' value={5} />
      </TestWrapper>,
    );

    expect(screen.getByTestId('spot-number').props.style.backgroundColor).toBe(
      colors.bg.mutedTransparent,
    );
    expect(StyleSheet.flatten(screen.getByText('5').props.style)).toEqual(
      expect.objectContaining({
        color: colors.text.success,
        fontSize: typographies.heading5.fontSize,
      }),
    );
  });

  it('should paint the circle and a paired text color when fill is plain', () => {
    render(
      <TestWrapper>
        <SpotNumber appearance='success' fill='plain' value={5} />
      </TestWrapper>,
    );

    expect(screen.getByTestId('spot-number').props.style.backgroundColor).toBe(
      colors.bg.success,
    );
    expect(StyleSheet.flatten(screen.getByText('5').props.style).color).toBe(
      colors.text.successStrong,
    );
  });

  it('should use the disabled text color', () => {
    render(
      <TestWrapper>
        <SpotNumber appearance='success' disabled value={5} />
      </TestWrapper>,
    );

    expect(screen.getByTestId('spot-number').props.style.backgroundColor).toBe(
      colors.bg.mutedTransparent,
    );
    expect(StyleSheet.flatten(screen.getByText('5').props.style).color).toBe(
      colors.text.disabled,
    );
  });

  it.each(sizeTypography)(
    'should apply size %s typography %s',
    (size, token) => {
      render(
        <TestWrapper>
          <SpotNumber size={size} value={5} />
        </TestWrapper>,
      );

      expect(
        StyleSheet.flatten(screen.getByText('5').props.style).fontSize,
      ).toBe(typographies[token].fontSize);
    },
  );
});
