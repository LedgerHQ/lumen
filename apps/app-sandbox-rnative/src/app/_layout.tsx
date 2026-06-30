import 'intl-pluralrules';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { SupportedLocale } from '@ledgerhq/lumen-ui-rnative';
import {
  BottomSheetModalProvider,
  GlobalTooltipBottomSheet,
  ThemeProvider,
} from '@ledgerhq/lumen-ui-rnative';
import { Stack } from 'expo-router';
import { useState } from 'react';
import type { ColorSchemeName } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SandboxHeader } from '../components/ui/Header';
import { SandboxProvider } from '../contexts/SandboxContext';
import { ThemeControlsProvider } from '../hooks/useThemeControls';

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');
  const [locale, setLocale] = useState<SupportedLocale>('en');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider
        themes={ledgerLiveThemes}
        colorScheme={colorScheme}
        locale={locale}
      >
        <ThemeControlsProvider
          value={{ colorScheme, setColorScheme, locale, setLocale }}
        >
          <SandboxProvider>
            <BottomSheetModalProvider>
              <RootNavigator />
              <GlobalTooltipBottomSheet />
            </BottomSheetModalProvider>
          </SandboxProvider>
        </ThemeControlsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const RootNavigator = () => {
  return (
    <Stack screenOptions={{ header: () => <SandboxHeader /> }}>
      <Stack.Screen name='index' />
    </Stack>
  );
};
