import { getObjectPath } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type {
  LumenStyleSheetTheme,
  LumenTextStyle,
  LumenViewStyle,
} from '../types';
import { VIEW_PROP_CONFIG, TEXT_PROP_CONFIG } from './resolveConfig';

/**
 * Unified style resolver
 * Config-driven: single loop resolves all props via provided config
 */
const resolveStyle = <T extends ViewStyle | TextStyle>(
  theme: LumenStyleSheetTheme,
  lx: LumenViewStyle | LumenTextStyle,
  config: typeof VIEW_PROP_CONFIG | typeof TEXT_PROP_CONFIG,
): T => {
  const resolved: Record<string, unknown> = {};

  for (const [prop, value] of Object.entries(lx)) {
    const propConfig = config[prop as keyof typeof config];
    if (!propConfig) continue;

    // Passthrough (no path)
    if (!propConfig.path) {
      resolved[prop] = value;
      continue;
    }

    // Token lookup
    const resolvedValue = getObjectPath(theme, [
      ...propConfig.path,
      value as string,
    ]);

    resolved[prop] = resolvedValue;
  }

  return resolved as T;
};

/**
 * Transform lx props to StyleSheet style object for View
 */
export const useResolveViewStyle = (
  lx: LumenViewStyle,
  bareStyle?: StyleProp<ViewStyle>,
): ViewStyle => {
  const { theme } = useTheme();
  const resolvedStyle = resolveStyle<ViewStyle>(theme, lx, VIEW_PROP_CONFIG);
  return StyleSheet.flatten([bareStyle, resolvedStyle]);
};

/**
 * Transform lx props to StyleSheet style object for Text
 */
export const useResolveTextStyle = (
  lx: LumenTextStyle,
  bareStyle?: StyleProp<TextStyle>,
): TextStyle => {
  const { theme } = useTheme();
  const resolvedStyle = resolveStyle<TextStyle>(theme, lx, TEXT_PROP_CONFIG);
  return StyleSheet.flatten([bareStyle, resolvedStyle]);
};
