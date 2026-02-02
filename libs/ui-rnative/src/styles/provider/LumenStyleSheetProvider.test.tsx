import { describe, expect, it, jest } from '@jest/globals';
import { render, userEvent } from '@testing-library/react-native';
import React, { useState } from 'react';
import { ColorSchemeName, Pressable, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { LumenStyleSheetProvider } from './LumenStyleSheetProvider';

// Test themes
const testThemes: any = {
  light: {
    colors: {
      bg: {
        base: '#FFFFFF',
        accent: '#007AFF',
      },
    },
    typographies: {
      xs: {
        body1: {
          fontSize: 16,
          fontWeight: 'normal',
        },
      },
    },
  },
  dark: {
    colors: {
      bg: {
        base: '#000000',
        accent: '#0A84FF',
      },
    },
    typographies: {
      xs: {
        body1: {
          fontSize: 16,
          fontWeight: 'normal',
        },
      },
    },
  },
};

const Content = ({ setState, state }: any) => {
  const { theme, colorScheme } = useTheme();
  return (
    <View testID='container'>
      <Text testID='color-scheme'>{colorScheme}</Text>
      <Text testID='bg-color'>{theme.colors.bg.base}</Text>
      <Pressable
        testID='toggle-button'
        onPress={() => setState(state === 'dark' ? 'light' : 'dark')}
      />
    </View>
  );
};
// Test component that uses theme
const TestComponent = ({
  initialColorScheme,
}: {
  initialColorScheme: ColorSchemeName;
}): React.JSX.Element => {
  const [state, setState] = useState(initialColorScheme);

  return (
    <LumenStyleSheetProvider colorScheme={state} themes={testThemes}>
      <Content state={state} setState={setState} />
    </LumenStyleSheetProvider>
  );
};

describe('LumenStyleSheetProvider', () => {
  it('provides dark theme by default', () => {
    const { getByTestId } = render(<TestComponent initialColorScheme='dark' />);

    expect(getByTestId('color-scheme').props.children).toBe('dark');
    expect(getByTestId('bg-color').props.children).toBe('#000000');
  });

  it('provides light theme when initialColorScheme is light', () => {
    const { getByTestId } = render(
      <TestComponent initialColorScheme='light' />,
    );

    expect(getByTestId('color-scheme').props.children).toBe('light');
    expect(getByTestId('bg-color').props.children).toBe('#FFFFFF');
  });

  it('switches theme when setColorScheme is called', async () => {
    const { getByTestId } = render(
      <TestComponent initialColorScheme='light' />,
    );

    // Initially light
    expect(getByTestId('color-scheme').props.children).toBe('light');
    expect(getByTestId('bg-color').props.children).toBe('#FFFFFF');

    // Toggle to dark
    await userEvent.press(getByTestId('toggle-button'));
    expect(getByTestId('color-scheme').props.children).toBe('dark');
    expect(getByTestId('bg-color').props.children).toBe('#000000');

    // Toggle back to light
    await userEvent.press(getByTestId('toggle-button'));
    expect(getByTestId('color-scheme').props.children).toBe('light');
    expect(getByTestId('bg-color').props.children).toBe('#FFFFFF');
  });

  it('throws error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      .mockImplementation(() => {});

    expect(() => {
      render(<Content />);
    }).toThrow('useTheme must be used within LumenStyleSheetProvider');

    consoleErrorSpy.mockRestore();
  });
});
