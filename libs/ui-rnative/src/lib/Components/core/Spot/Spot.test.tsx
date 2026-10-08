import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { View } from 'react-native';
import type { IconSize } from '../../symbols/Icon';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Spot } from './Spot';

const { colors } = ledgerLiveThemes.dark;

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

const TestIcon = ({
  style,
}: {
  size?: IconSize;
  style?: StyleProp<TextStyle>;
}) => <View testID='spot-icon' style={style} />;

describe('Spot', () => {
  it('should paint only the icon when fill is transparent', () => {
    render(
      <TestWrapper>
        <Spot appearance='success' icon={TestIcon} />
      </TestWrapper>,
    );

    expect(
      screen.getByTestId('spot-container').props.style.backgroundColor,
    ).toBe(colors.bg.mutedTransparent);
    expect(screen.getByTestId('spot-icon').props.style.color).toBe(
      colors.text.success,
    );
  });

  it('should paint the circle and a paired text color when fill is plain', () => {
    render(
      <TestWrapper>
        <Spot appearance='success' fill='plain' icon={TestIcon} />
      </TestWrapper>,
    );

    expect(
      screen.getByTestId('spot-container').props.style.backgroundColor,
    ).toBe(colors.bg.success);
    expect(screen.getByTestId('spot-icon').props.style.color).toBe(
      colors.text.successStrong,
    );
  });

  it('should use the disabled text color', () => {
    render(
      <TestWrapper>
        <Spot appearance='success' disabled icon={TestIcon} />
      </TestWrapper>,
    );

    expect(
      screen.getByTestId('spot-container').props.style.backgroundColor,
    ).toBe(colors.bg.mutedTransparent);
    expect(screen.getByTestId('spot-icon').props.style.color).toBe(
      colors.text.disabled,
    );
  });
});
