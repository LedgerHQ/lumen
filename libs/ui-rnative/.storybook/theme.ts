import type { ThemeVars } from 'storybook/theming';
import { create } from 'storybook/theming/create';
import logoUrl from './docs/lumen.svg';

const theme: ThemeVars = create({
  base: 'light',
  brandTarget: '_self',
  brandImage: logoUrl,
  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appBorderRadius: 8,

  textColor: '#1a1a1a',
  textInverseColor: '#ffffff',

  colorPrimary: '#2563eb',
  colorSecondary: '#7e4ea5',
  barBg: '#f8fafc',
  barHoverColor: '#d4a0ff',
});

export default theme;
