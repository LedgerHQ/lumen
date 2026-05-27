import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import type { ThemeVars } from 'storybook/theming';
import { create } from 'storybook/theming/create';
import darkLogoUrl from './docs/lumen.dark.svg';
import lightLogoUrl from './docs/lumen.light.svg';

const light = ledgerLiveThemes.light.colors;
const dark = ledgerLiveThemes.dark.colors;

export const lightTheme: ThemeVars = create({
  base: 'light',
  brandTarget: '_self',
  brandImage: lightLogoUrl,
  appBg: light.bg.surface,
  appPreviewBg: light.bg.muted,
  appContentBg: light.bg.surface,
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
  appBg: dark.bg.surface,
  appPreviewBg: dark.bg.muted,
  appContentBg: dark.bg.surface,
  appBorderRadius: 8,

  textColor: dark.text.mutedPressed,
  textInverseColor: dark.text.onInteractive,

  colorPrimary: dark.bg.accent,
  colorSecondary: dark.bg.accentPressed,
  barBg: dark.bg.surface,
  barHoverColor: dark.bg.accentHover,
});
