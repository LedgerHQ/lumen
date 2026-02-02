import { describe, expect, it } from '@jest/globals';
import {
  fireEvent,
  render,
  userEvent,
  waitFor,
} from '@testing-library/react-native';
import React, { useState } from 'react';
import { ColorSchemeName, Pressable, Text, View } from 'react-native';
import { LumenStyleSheetProvider } from '../provider/LumenStyleSheetProvider';
import { useStyleSheet } from './useStyleSheet';

// Wrapper that allows testing uncontrolled theme switching
const TestProviderWrapper = ({
  children,
  themes,
  initialColorScheme = 'dark',
}: {
  children: React.ReactNode;
  themes: any;
  initialColorScheme?: ColorSchemeName;
}): React.JSX.Element => {
  return (
    <LumenStyleSheetProvider themes={themes} colorScheme={initialColorScheme}>
      {children}
    </LumenStyleSheetProvider>
  );
};

// Test themes
const testThemes: any = {
  light: {
    colors: {
      bg: {
        base: '#FFFFFF',
        accent: '#007AFF',
        surface: '#F5F5F5',
      },
      text: {
        base: '#000000',
        muted: '#666666',
      },
      border: {
        base: '#E0E0E0',
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
    spacings: {
      s8: 8,
      s16: 16,
      s24: 24,
    },
  },
  dark: {
    colors: {
      bg: {
        base: '#000000',
        accent: '#0A84FF',
        surface: '#1C1C1E',
      },
      text: {
        base: '#FFFFFF',
        muted: '#999999',
      },
      border: {
        base: '#38383A',
        accent: '#0A84FF',
      },
    },
    spacings: {
      s8: 8,
      s16: 16,
      s24: 24,
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

describe('useStyleSheet', () => {
  describe('Static styles', () => {
    it('creates static styles with theme tokens', () => {
      const TestComponent = (): React.JSX.Element => {
        const styles = useStyleSheet(
          (theme: any) => ({
            container: {
              backgroundColor: theme.colors.bg.base,
              padding: theme.spacings.s8,
            },
            text: {
              color: theme.colors.text.base,
              fontSize: 16,
            },
          }),
          [],
        );

        return (
          <View style={styles.container} testID='container'>
            <Text style={styles.text} testID='text'>
              Test
            </Text>
          </View>
        );
      };

      const { getByTestId } = render(
        <LumenStyleSheetProvider themes={testThemes} colorScheme='dark'>
          <TestComponent />
        </LumenStyleSheetProvider>,
      );

      const container = getByTestId('container');
      const text = getByTestId('text');

      expect(container.props.style).toEqual({
        backgroundColor: '#000000',
        padding: 8,
      });
      expect(text.props.style).toEqual({
        color: '#FFFFFF',
        fontSize: 16,
      });
    });

    it('updates styles when theme changes', async () => {
      const Content = ({
        colorScheme,
        setColorScheme,
      }: {
        colorScheme: ColorSchemeName;
        setColorScheme: (colorScheme: ColorSchemeName) => void;
      }) => {
        const styles = useStyleSheet(
          (theme: any) => ({
            container: {
              backgroundColor: theme.colors.bg.base,
              borderColor: theme.colors.border.base,
            },
          }),
          [],
        );

        return (
          <>
            <View style={styles.container} testID='container' />
            <Pressable
              testID='toggle'
              onPress={() =>
                setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
              }
            >
              <Text>Toggle</Text>
            </Pressable>
          </>
        );
      };

      const TestComponent = (): React.JSX.Element => {
        const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');

        return (
          <TestProviderWrapper
            themes={testThemes}
            initialColorScheme={colorScheme}
          >
            <Content
              colorScheme={colorScheme}
              setColorScheme={setColorScheme}
            />
          </TestProviderWrapper>
        );
      };

      const { getByTestId } = render(<TestComponent />);

      const container = getByTestId('container');

      // Initially dark theme
      expect(container.props.style).toEqual({
        backgroundColor: '#000000',
        borderColor: '#38383A',
      });

      // Switch to light theme
      await userEvent.press(getByTestId('toggle'));

      // Should update to light theme colors
      expect(container.props.style).toEqual({
        backgroundColor: '#FFFFFF',
        borderColor: '#E0E0E0',
      });
    });

    it('handles nested theme properties', () => {
      const TestComponent = (): React.JSX.Element => {
        const styles = useStyleSheet(
          (theme: any) => ({
            card: {
              backgroundColor: theme.colors.bg.surface,
              padding: theme.spacings.s24,
              borderWidth: 1,
              borderColor: theme.colors.border.accent,
            },
          }),
          [],
        );

        return <View style={styles.card} testID='card' />;
      };

      const { getByTestId } = render(
        <LumenStyleSheetProvider themes={testThemes} colorScheme='dark'>
          <TestComponent />
        </LumenStyleSheetProvider>,
      );

      expect(getByTestId('card').props.style).toEqual({
        backgroundColor: '#1C1C1E',
        padding: 24,
        borderWidth: 1,
        borderColor: '#0A84FF',
      });
    });
  });

  describe('Dynamic functions', () => {
    it('creates dynamic styles with function parameters', () => {
      const TestComponent = (): React.JSX.Element => {
        const styles = useStyleSheet(
          (theme: any) => ({
            container: (width: number, highlighted: boolean) => ({
              backgroundColor: highlighted
                ? theme.colors.bg.accent
                : theme.colors.bg.base,
              width,
              borderWidth: highlighted ? 2 : 1,
              borderColor: theme.colors.border.accent,
            }),
          }),
          [],
        );

        return (
          <View testID='wrapper'>
            <View style={styles.container(200, true)} testID='container-1' />
            <View style={styles.container(150, false)} testID='container-2' />
          </View>
        );
      };

      const { getByTestId } = render(
        <LumenStyleSheetProvider themes={testThemes} colorScheme='dark'>
          <TestComponent />
        </LumenStyleSheetProvider>,
      );

      expect(getByTestId('container-1').props.style).toEqual({
        backgroundColor: '#0A84FF',
        width: 200,
        borderWidth: 2,
        borderColor: '#0A84FF',
      });

      expect(getByTestId('container-2').props.style).toEqual({
        backgroundColor: '#000000',
        width: 150,
        borderWidth: 1,
        borderColor: '#0A84FF',
      });
    });

    it('updates dynamic styles when theme changes', async () => {
      const Content = ({
        setColorScheme,
      }: {
        setColorScheme: (colorScheme: ColorSchemeName) => void;
      }) => {
        const styles = useStyleSheet(
          (theme: any) => ({
            container: (isActive: boolean) => ({
              backgroundColor: isActive
                ? theme.colors.bg.accent
                : theme.colors.bg.base,
              borderColor: theme.colors.border.base,
            }),
          }),
          [],
        );

        return (
          <View testID='wrapper'>
            <View style={styles.container(true)} testID='active' />
            <View style={styles.container(false)} testID='inactive' />
            <Pressable testID='toggle' onPress={() => setColorScheme('light')}>
              <Text>Toggle</Text>
            </Pressable>
          </View>
        );
      };

      const TestComponent = (): React.JSX.Element => {
        const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');

        return (
          <TestProviderWrapper
            themes={testThemes}
            initialColorScheme={colorScheme}
          >
            <Content setColorScheme={setColorScheme} />
          </TestProviderWrapper>
        );
      };

      const { getByTestId } = render(<TestComponent />);

      // Dark theme
      expect(getByTestId('active').props.style).toEqual({
        backgroundColor: '#0A84FF',
        borderColor: '#38383A',
      });
      expect(getByTestId('inactive').props.style).toEqual({
        backgroundColor: '#000000',
        borderColor: '#38383A',
      });

      // Switch to light
      fireEvent.press(getByTestId('toggle'));
      await waitFor(() => {
        expect(getByTestId('active').props.style).toEqual({
          backgroundColor: '#007AFF',
          borderColor: '#E0E0E0',
        });
        expect(getByTestId('inactive').props.style).toEqual({
          backgroundColor: '#FFFFFF',
          borderColor: '#E0E0E0',
        });
      });
    });

    it('handles multiple parameters in dynamic functions', () => {
      const TestComponent = (): React.JSX.Element => {
        const styles = useStyleSheet(
          (theme: any) => ({
            box: (size: number, color: string, rounded: boolean) => ({
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: rounded ? size / 2 : 0,
              padding: theme.spacings.s8,
            }),
          }),
          [],
        );

        return (
          <View testID='wrapper'>
            <View style={styles.box(100, '#FF0000', true)} testID='box-1' />
            <View style={styles.box(50, '#00FF00', false)} testID='box-2' />
          </View>
        );
      };

      const { getByTestId } = render(
        <LumenStyleSheetProvider themes={testThemes} colorScheme='dark'>
          <TestComponent />
        </LumenStyleSheetProvider>,
      );

      expect(getByTestId('box-1').props.style).toEqual({
        width: 100,
        height: 100,
        backgroundColor: '#FF0000',
        borderRadius: 50,
        padding: 8,
      });

      expect(getByTestId('box-2').props.style).toEqual({
        width: 50,
        height: 50,
        backgroundColor: '#00FF00',
        borderRadius: 0,
        padding: 8,
      });
    });
  });

  describe('Mixed static and dynamic styles', () => {
    it('supports both static and dynamic styles in the same stylesheet', () => {
      const TestComponent = (): React.JSX.Element => {
        const styles = useStyleSheet(
          (theme: any) => ({
            staticContainer: {
              backgroundColor: theme.colors.bg.base,
              padding: theme.spacings.s16,
            },
            dynamicText: (size: number, bold: boolean) => ({
              color: theme.colors.text.base,
              fontSize: size,
              fontWeight: bold ? '700' : '400',
            }),
          }),
          [],
        );

        return (
          <View style={styles.staticContainer} testID='container'>
            <Text style={styles.dynamicText(16, false)} testID='text-1'>
              Normal
            </Text>
            <Text style={styles.dynamicText(20, true)} testID='text-2'>
              Bold
            </Text>
          </View>
        );
      };

      const { getByTestId } = render(
        <LumenStyleSheetProvider themes={testThemes} colorScheme='dark'>
          <TestComponent />
        </LumenStyleSheetProvider>,
      );

      expect(getByTestId('container').props.style).toEqual({
        backgroundColor: '#000000',
        padding: 16,
      });

      expect(getByTestId('text-1').props.style).toEqual({
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
      });

      expect(getByTestId('text-2').props.style).toEqual({
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '700',
      });
    });
  });

  describe('Memoization', () => {
    it('recalculates styles when colorScheme changes but not on component re-render', () => {
      let styleCreationCount = 0;

      const Content = ({
        colorScheme,
        setColorScheme,
      }: {
        colorScheme: ColorSchemeName;
        setColorScheme: (colorScheme: ColorSchemeName) => void;
      }) => {
        const styles = useStyleSheet((theme: any) => {
          styleCreationCount++;
          return {
            container: {
              backgroundColor: theme.colors.bg.base,
            },
          };
        }, []);

        return (
          <View testID='wrapper'>
            <View style={styles.container} testID='container' />
            <Text testID='color-scheme'>{colorScheme}</Text>
            <Pressable testID='toggle' onPress={() => setColorScheme('light')}>
              <Text>Toggle</Text>
            </Pressable>
          </View>
        );
      };

      const TestComponent = (): React.JSX.Element => {
        const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');

        return (
          <TestProviderWrapper
            themes={testThemes}
            initialColorScheme={colorScheme}
          >
            <Content
              colorScheme={colorScheme}
              setColorScheme={setColorScheme}
            />
          </TestProviderWrapper>
        );
      };

      const { getByTestId } = render(<TestComponent />);

      const initialCount = styleCreationCount;
      expect(initialCount).toBeGreaterThan(0);

      // Change theme - should recalculate styles
      fireEvent.press(getByTestId('toggle'));

      expect(getByTestId('color-scheme').props.children).toBe('light');
      expect(styleCreationCount).toBeGreaterThan(initialCount);
      expect(getByTestId('container').props.style.backgroundColor).toBe(
        '#FFFFFF',
      );
    });
  });
});
