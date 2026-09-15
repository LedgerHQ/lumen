import {
  capitalize,
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';
import { useTheme, type LumenStyleSheetTheme } from '../../../../styles';

type DecorativeBgKey = keyof LumenStyleSheetTheme['colors']['bg'];

const decorativeBgKey = (key: AvatarColorKey): DecorativeBgKey =>
  `decorative${capitalize(key)}` as DecorativeBgKey;

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * colors for the current theme. The same identifier always resolves to the
 * same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={useResolveAvatarColor(id)} />`.
 */
export function useResolveAvatarColor(identifier: string): string {
  const { theme } = useTheme();

  return theme.colors.bg[decorativeBgKey(resolveAvatarColorKey(identifier))];
}
