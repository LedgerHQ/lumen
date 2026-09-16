import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  capitalize,
  resolveAvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';
import { renderHook } from '@testing-library/react-native';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { useResolveAvatarColor } from './useResolveAvatarColor';

const decorativeBgKeyFor = (identifier: string): string =>
  `decorative${capitalize(resolveAvatarColorKey(identifier))}`;

const LightWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='light' locale='en'>
    {children}
  </ThemeProvider>
);

const DarkWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

let currentColorScheme: 'light' | 'dark' = 'light';

const SwitchableThemeWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <ThemeProvider
    themes={ledgerLiveThemes}
    colorScheme={currentColorScheme}
    locale='en'
  >
    {children}
  </ThemeProvider>
);

describe('useResolveAvatarColor', () => {
  it('should resolve the identifier to the light-theme decorative color', () => {
    const key = decorativeBgKeyFor('user-1');
    const { result } = renderHook(() => useResolveAvatarColor('user-1'), {
      wrapper: LightWrapper,
    });

    expect(result.current).toBe(
      (ledgerLiveThemes.light.colors.bg as Record<string, string>)[key],
    );
  });

  it('should resolve the identifier to the dark-theme decorative color, distinct from light', () => {
    const key = decorativeBgKeyFor('user-1');
    const { result } = renderHook(() => useResolveAvatarColor('user-1'), {
      wrapper: DarkWrapper,
    });

    const darkColor = (
      ledgerLiveThemes.dark.colors.bg as Record<string, string>
    )[key];
    const lightColor = (
      ledgerLiveThemes.light.colors.bg as Record<string, string>
    )[key];

    expect(result.current).toBe(darkColor);
    expect(result.current).not.toBe(lightColor);
  });

  it('should react to the theme changing after the initial render', () => {
    const key = decorativeBgKeyFor('user-1');
    const lightColor = (
      ledgerLiveThemes.light.colors.bg as Record<string, string>
    )[key];
    const darkColor = (
      ledgerLiveThemes.dark.colors.bg as Record<string, string>
    )[key];

    currentColorScheme = 'light';
    const { result, rerender } = renderHook(
      () => useResolveAvatarColor('user-1'),
      { wrapper: SwitchableThemeWrapper },
    );

    expect(result.current).toBe(lightColor);

    currentColorScheme = 'dark';
    rerender({});

    expect(result.current).toBe(darkColor);
  });

  it('should always resolve the same identifier to the same color within a theme', () => {
    const { result: first } = renderHook(
      () => useResolveAvatarColor('same-user'),
      { wrapper: LightWrapper },
    );
    const { result: second } = renderHook(
      () => useResolveAvatarColor('same-user'),
      { wrapper: LightWrapper },
    );

    expect(first.current).toBe(second.current);
  });
});
