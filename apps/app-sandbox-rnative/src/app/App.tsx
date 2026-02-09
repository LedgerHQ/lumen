import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import {
  BottomSheetModalProvider,
  Box,
  GlobalSelectBottomSheet,
  GlobalTooltipBottomSheet,
  SupportedLocale,
  ThemeProvider,
  useBottomSheetRef,
} from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { useState } from 'react';
import {
  ColorSchemeName,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  AmountDisplays,
  AmountInputs,
  BottomSheetDynamicSize,
  BottomSheetFlatLists,
  BottomSheetsButton,
  Buttons,
  Checkboxes,
  Dividers,
  IconButtons,
  Links,
  Selects,
  Spots,
  Switches,
  Tags,
  TextInputs,
  Tiles,
  ToggleLocaleSwitch,
  ToggleThemeSwitch,
  InteractiveIcons,
  Banners,
  CardButtons,
  Tooltips,
  ListItems,
  Gradients,
  ExampleTabBar,
  Subheaders,
  Avatars,
} from './blocks';
import { SandboxBlock } from './SandboxBlock';

export const App = () => {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('dark');
  const [locale, setLocale] = useState<SupportedLocale>('en');

  return (
    <ThemeProvider
      themes={ledgerLiveThemes}
      colorScheme={colorScheme}
      locale={locale}
    >
      <AppContent
        locale={locale}
        colorScheme={colorScheme}
        setLocale={setLocale}
        setColorScheme={setColorScheme}
      />
    </ThemeProvider>
  );
};

const AppContent = ({
  locale,
  colorScheme,
  setLocale,
  setColorScheme,
}: any) => {
  const { theme } = useTheme();
  const bottomSheetFlatListsRef = useBottomSheetRef();
  const bottomSheetDynamicSizeRef = useBottomSheetRef();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg.canvas,
      }}
    >
      <StatusBar />
      <GestureHandlerRootView
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: theme.colors.bg.accent,
        }}
      >
        <BottomSheetModalProvider>
          <ScrollView
            contentInsetAdjustmentBehavior='automatic'
            style={{
              height: '100%',
              backgroundColor: theme.colors.bg.canvas,
              paddingHorizontal: theme.spacings.s16,
            }}
          >
            <Box
              lx={{
                flexDirection: 'column',
                gap: 's32',
                paddingVertical: 's40',
              }}
            >
              <SandboxBlock title='InteractiveIcons'>
                <InteractiveIcons />
              </SandboxBlock>
              <SandboxBlock title='Select'>
                <Selects />
              </SandboxBlock>
              <SandboxBlock title='Text inputs'>
                <TextInputs />
              </SandboxBlock>
              <SandboxBlock title='Amount displays'>
                <AmountDisplays />
              </SandboxBlock>
              <SandboxBlock title='Amount inputs'>
                <AmountInputs />
              </SandboxBlock>
              <SandboxBlock title='CardButtons'>
                <CardButtons />
              </SandboxBlock>
              <SandboxBlock title='Checkboxes'>
                <Checkboxes />
              </SandboxBlock>
              <SandboxBlock title='Avatar'>
                <Avatars />
              </SandboxBlock>
              <SandboxBlock title='Spots'>
                <Spots />
              </SandboxBlock>
              <SandboxBlock title='Tags'>
                <Tags />
              </SandboxBlock>
              <SandboxBlock title='Subheaders'>
                <Subheaders />
              </SandboxBlock>
              <SandboxBlock title='Switches'>
                <Switches />
              </SandboxBlock>
              <SandboxBlock title='Buttons'>
                <Buttons />
              </SandboxBlock>
              <SandboxBlock title='IconButtons'>
                <IconButtons />
              </SandboxBlock>
              <SandboxBlock title='Theme Provider toggles'>
                <Box lx={{ gap: 's12' }}>
                  <ToggleThemeSwitch
                    colorScheme={colorScheme}
                    setColorScheme={setColorScheme}
                  />
                  <ToggleLocaleSwitch locale={locale} setLocale={setLocale} />
                </Box>
              </SandboxBlock>
              <SandboxBlock title='Tiles'>
                <Tiles />
              </SandboxBlock>
              <SandboxBlock title='ListItems'>
                <ListItems />
              </SandboxBlock>
              <SandboxBlock title='Tooltips'>
                <Tooltips />
              </SandboxBlock>
              <SandboxBlock title='Banners'>
                <Banners />
              </SandboxBlock>
              <SandboxBlock title='BottomSheets'>
                <BottomSheetsButton
                  onPress={() => bottomSheetFlatListsRef.current?.present()}
                />
                <BottomSheetsButton
                  onPress={() => bottomSheetDynamicSizeRef.current?.present()}
                />
              </SandboxBlock>
              <SandboxBlock title='Link'>
                <Links />
              </SandboxBlock>
              <SandboxBlock title='Dividers'>
                <Dividers />
              </SandboxBlock>
              <SandboxBlock title='Gradients' hideDivider>
                <Gradients />
              </SandboxBlock>
            </Box>
          </ScrollView>
          <Box
            lx={{
              position: 'absolute',
              bottom: 's20',
              width: 'full',
              paddingHorizontal: 's24',
            }}
          >
            <ExampleTabBar />
          </Box>
          <BottomSheetFlatLists ref={bottomSheetFlatListsRef} />
          <BottomSheetDynamicSize ref={bottomSheetDynamicSizeRef} />
          <GlobalTooltipBottomSheet />
          <GlobalSelectBottomSheet />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default App;
