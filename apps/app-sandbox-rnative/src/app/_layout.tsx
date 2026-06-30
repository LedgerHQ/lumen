import 'intl-pluralrules';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { SupportedLocale } from '@ledgerhq/lumen-ui-rnative';
import {
  BottomSheetModalProvider,
  GlobalTooltipBottomSheet,
  ThemeProvider,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Stack } from 'expo-router';
import { useState } from 'react';
import type { ColorSchemeName } from 'react-native';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SandboxProvider } from '../components/SandboxContext';
import { SandboxHeader } from '../components/SandboxHeader';
import { ThemeControlsProvider } from '../components/ThemeControls';

export default function RootLayout() {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');
  const [locale, setLocale] = useState<SupportedLocale>('en');

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
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
                <StatusBar />
                <RootNavigator />
                <GlobalTooltipBottomSheet />
              </BottomSheetModalProvider>
            </SandboxProvider>
          </ThemeControlsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const RootNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        header: () => <SandboxHeader />,
        contentStyle: { backgroundColor: theme.colors.bg.canvas },
      }}
    >
      <Stack.Screen name='index' />
    </Stack>
  );
};
