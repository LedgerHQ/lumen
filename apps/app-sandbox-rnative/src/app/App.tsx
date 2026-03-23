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
  Animations,
  BottomSheetDynamicSize,
  BottomSheetFlatLists,
  BottomSheetsButton,
  Buttons,
  Checkboxes,
  Cards,
  Dividers,
  IconButtons,
  Links,
  NavBars,
  SegmentedControls,
  Selects,
  Skeletons,
  Spots,
  Steppers,
  Switches,
  Tags,
  TextInputs,
  Tiles,
  ToggleLocaleSwitch,
  ToggleThemeSwitch,
  InteractiveIcons,
  Banners,
  CardButtons,
  ContentBanners,
  MediaCards,
  Tooltips,
  ListItems,
  Gradients,
  ExampleTabBar,
  Subheaders,
  Avatars,
  PageIndicators,
  MediaBanners,
} from './blocks';
import { SandboxBlock } from './SandboxBlock';
import { SandboxProvider } from './SandboxContext';
import { SandboxTopBar } from './SandboxTopBar';

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
      <SandboxProvider>
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
              <SandboxTopBar
                colorScheme={colorScheme}
                setColorScheme={setColorScheme}
              />

              <Box
                lx={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 's8',
                  paddingVertical: 's40',
                }}
              >
                <SandboxBlock title='Amount displays'>
                  <AmountDisplays />
                </SandboxBlock>
                <SandboxBlock title='Amount inputs'>
                  <AmountInputs />
                </SandboxBlock>
                <SandboxBlock title='Animations'>
                  <Animations />
                </SandboxBlock>
                <SandboxBlock title='Avatar'>
                  <Avatars />
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
                <SandboxBlock title='Buttons'>
                  <Buttons />
                </SandboxBlock>
                <SandboxBlock title='CardButtons'>
                  <CardButtons />
                </SandboxBlock>
                <SandboxBlock title='Cards'>
                  <Cards />
                </SandboxBlock>
                <SandboxBlock title='Checkboxes'>
                  <Checkboxes />
                </SandboxBlock>
                <SandboxBlock title='ContentBanners'>
                  <ContentBanners />
                </SandboxBlock>
                <SandboxBlock title='Dividers'>
                  <Dividers />
                </SandboxBlock>
                <SandboxBlock title='Gradients'>
                  <Gradients />
                </SandboxBlock>
                <SandboxBlock title='IconButtons'>
                  <IconButtons />
                </SandboxBlock>
                <SandboxBlock title='InteractiveIcons'>
                  <InteractiveIcons />
                </SandboxBlock>
                <SandboxBlock title='Link'>
                  <Links />
                </SandboxBlock>
                <SandboxBlock title='ListItems'>
                  <ListItems />
                </SandboxBlock>
                <SandboxBlock title='MediaBanners'>
                  <MediaBanners />
                </SandboxBlock>
                <SandboxBlock title='MediaCards'>
                  <MediaCards />
                </SandboxBlock>
                <SandboxBlock title='NavBars'>
                  <NavBars />
                </SandboxBlock>
                <SandboxBlock title='PageIndicators'>
                  <PageIndicators />
                </SandboxBlock>
                <SandboxBlock title='SegmentedControl'>
                  <SegmentedControls />
                </SandboxBlock>
                <SandboxBlock title='Select'>
                  <Selects />
                </SandboxBlock>
                <SandboxBlock title='Skeletons'>
                  <Skeletons />
                </SandboxBlock>
                <SandboxBlock title='Spots'>
                  <Spots />
                </SandboxBlock>
                <SandboxBlock title='Steppers'>
                  <Steppers />
                </SandboxBlock>
                <SandboxBlock title='Subheaders'>
                  <Subheaders />
                </SandboxBlock>
                <SandboxBlock title='Switches'>
                  <Switches />
                </SandboxBlock>
                <SandboxBlock title='TabBar'>
                  <ExampleTabBar />
                </SandboxBlock>
                <SandboxBlock title='Tags'>
                  <Tags />
                </SandboxBlock>
                <SandboxBlock title='Text inputs'>
                  <TextInputs />
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
                <SandboxBlock title='Tooltips'>
                  <Tooltips />
                </SandboxBlock>
              </Box>
            </ScrollView>
            <BottomSheetFlatLists ref={bottomSheetFlatListsRef} />
            <BottomSheetDynamicSize ref={bottomSheetDynamicSizeRef} />
            <GlobalTooltipBottomSheet />
            <GlobalSelectBottomSheet />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </SandboxProvider>
    </SafeAreaView>
  );
};

export default App;
