import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { SupportedLocale } from '@ledgerhq/lumen-ui-rnative';
import {
  BottomSheetModalProvider,
  GlobalTooltipBottomSheet,
  ThemeProvider,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Stack, useSegments } from 'expo-router';
import { useState } from 'react';
import type { ColorSchemeName } from 'react-native';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { getBlockTitle } from '../blocks';
import { Header } from '../components/Header';
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
          <BottomSheetModalProvider>
            <RootNavigator />
            <GlobalTooltipBottomSheet />
          </BottomSheetModalProvider>
        </ThemeControlsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const RootNavigator = () => {
  const segments = useSegments();
  const slug = segments[segments.length - 1] ?? '';
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg.canvas }}>
      <Stack>
        <Stack.Screen name='index' options={{ header: () => <Header /> }} />
        <Stack.Screen
          name='(blocks)'
          options={{ header: () => <Header title={getBlockTitle(slug)} /> }}
        />
      </Stack>
    </View>
  );
};
