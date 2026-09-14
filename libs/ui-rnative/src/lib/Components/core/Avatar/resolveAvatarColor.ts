import { primitiveColorTokens } from '@ledgerhq/lumen-design-core';
import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';
import { useTheme } from '../../../../styles';

const buildAvatarColorTokens = (
  decorative: Record<AvatarColorKey, Record<string, string>>,
  shade: '300' | '400',
): Record<AvatarColorKey, string> =>
  Object.fromEntries(
    Object.entries(decorative).map(([color, shades]) => [color, shades[shade]]),
  ) as Record<AvatarColorKey, string>;

const AVATAR_COLOR_TOKENS: Record<
  'light' | 'dark',
  Record<AvatarColorKey, string>
> = {
  light: buildAvatarColorTokens(primitiveColorTokens.light.decorative, '300'),
  dark: buildAvatarColorTokens(primitiveColorTokens.dark.decorative, '400'),
};

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * colors for the current theme. The same identifier always resolves to the
 * same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={useResolveAvatarColor(id)} />`.
 */
export function useResolveAvatarColor(identifier: string): string {
  const { colorScheme } = useTheme();

  return AVATAR_COLOR_TOKENS[colorScheme ?? 'light'][
    resolveAvatarColorKey(identifier)
  ];
}
