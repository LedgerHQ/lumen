import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { ThemeVars } from 'storybook/theming';
import { create } from 'storybook/theming/create';
import darkLogoUrl from './components/lumen.dark.svg';
import lightLogoUrl from './components/lumen.light.svg';

const light = ledgerLiveThemes.light.colors;
const dark = ledgerLiveThemes.dark.colors;

export const lightTheme: ThemeVars = create({
  base: 'light',
  brandTarget: '_self',
  brandImage: lightLogoUrl,
  appBg: light.bg.canvasMuted,
  appPreviewBg: light.bg.canvasSheet,
  appContentBg: light.bg.canvasMuted,
  appBorderRadius: 8,

  textColor: light.text.mutedPressed,
  textInverseColor: light.text.onInteractive,

  colorPrimary: light.bg.accent,
  colorSecondary: light.bg.accentPressed,
  barBg: light.bg.surface,
  barHoverColor: light.bg.accentHover,
});

export const darkTheme: ThemeVars = create({
  base: 'dark',
  brandTarget: '_self',
  brandImage: darkLogoUrl,
  appBg: dark.bg.canvasSheet,
  appPreviewBg: dark.bg.canvasSheet,
  appContentBg: dark.bg.canvasSheet,
  appBorderRadius: 8,

  textColor: dark.text.mutedPressed,
  textInverseColor: dark.text.onInteractive,

  colorPrimary: dark.bg.accent,
  colorSecondary: dark.bg.accentPressed,
  barBg: dark.bg.surface,
  barHoverColor: dark.bg.accentHover,
});
