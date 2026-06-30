import { Box, useBottomSheetRef } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ScrollView } from 'react-native';
import {
  AmountDisplays,
  AmountInputs,
  Animations,
  Avatars,
  Banners,
  BottomSheetDynamicSize,
  BottomSheetFlatLists,
  BottomSheetWithGradient,
  BottomSheetsButton,
  Buttons,
  CardButtons,
  Cards,
  Checkboxes,
  ContentBanners,
  DescriptionLists,
  Dividers,
  DotCounts,
  DotIcons,
  DotIndicators,
  DotSymbols,
  ExampleTabBar,
  Gradients,
  IconButtons,
  InteractiveIcons,
  LineCharts,
  Links,
  ListItems,
  MediaBanners,
  MediaButtons,
  MediaCards,
  MediaImages,
  MediaTags,
  NavBars,
  OptionLists,
  PageIndicators,
  SegmentedControls,
  Skeletons,
  Spots,
  Steppers,
  Subheaders,
  Switches,
  Tags,
  TextInputs,
  Tiles,
  ToggleLocaleSwitch,
  ToggleThemeSwitch,
  Tooltips,
  Trends,
} from '../components/blocks';
import { SandboxBlock } from '../components/SandboxBlock';
import { useThemeControls } from '../components/ThemeControls';

export default function SandboxScreen() {
  const { theme } = useTheme();
  const { locale, colorScheme, setLocale, setColorScheme } = useThemeControls();
  const bottomSheetFlatListsRef = useBottomSheetRef();
  const bottomSheetDynamicSizeRef = useBottomSheetRef();
  const bottomSheetGradientBugRef = useBottomSheetRef();

  return (
    <>
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
            <BottomSheetsButton
              onPress={() => bottomSheetGradientBugRef.current?.present()}
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
          <SandboxBlock title='DescriptionLists'>
            <DescriptionLists />
          </SandboxBlock>
          <SandboxBlock title='Dividers'>
            <Dividers />
          </SandboxBlock>
          <SandboxBlock title='DotCounts'>
            <DotCounts />
          </SandboxBlock>
          <SandboxBlock title='DotIcons'>
            <DotIcons />
          </SandboxBlock>
          <SandboxBlock title='DotIndicators'>
            <DotIndicators />
          </SandboxBlock>
          <SandboxBlock title='DotSymbols'>
            <DotSymbols />
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
          <SandboxBlock title='Line Charts'>
            <LineCharts />
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
          <SandboxBlock title='MediaButtons'>
            <MediaButtons />
          </SandboxBlock>
          <SandboxBlock title='MediaCards'>
            <MediaCards />
          </SandboxBlock>
          <SandboxBlock title='MediaImages'>
            <MediaImages />
          </SandboxBlock>
          <SandboxBlock title='MediaTags'>
            <MediaTags />
          </SandboxBlock>
          <SandboxBlock title='NavBars'>
            <NavBars />
          </SandboxBlock>
          <SandboxBlock title='OptionLists'>
            <OptionLists />
          </SandboxBlock>
          <SandboxBlock title='PageIndicators'>
            <PageIndicators />
          </SandboxBlock>
          <SandboxBlock title='SegmentedControl'>
            <SegmentedControls />
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
          <SandboxBlock title='Trends'>
            <Trends />
          </SandboxBlock>
        </Box>
      </ScrollView>
      <BottomSheetFlatLists ref={bottomSheetFlatListsRef} />
      <BottomSheetDynamicSize ref={bottomSheetDynamicSizeRef} />
      <BottomSheetWithGradient ref={bottomSheetGradientBugRef} />
    </>
  );
}
