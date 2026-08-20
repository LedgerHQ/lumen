import { primitiveColorTokens } from '@ledgerhq/lumen-design-core';
import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';

const AVATAR_COLOR_TOKENS: Record<AvatarColorKey, string> = {
  orange: primitiveColorTokens.light.decorative.orange['300'],
  green: primitiveColorTokens.light.decorative.green['300'],
  blue: primitiveColorTokens.light.decorative.blue['300'],
  purple: primitiveColorTokens.light.decorative.purple['300'],
  red: primitiveColorTokens.light.decorative.red['300'],
  yellow: primitiveColorTokens.light.decorative.yellow['300'],
  turquoise: primitiveColorTokens.light.decorative.turquoise['300'],
  pink: primitiveColorTokens.light.decorative.pink['300'],
};

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * colors. The same identifier always resolves to the same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={resolveAvatarColor(id)} />`.
 */
export function resolveAvatarColor(identifier: string): string {
  return AVATAR_COLOR_TOKENS[resolveAvatarColorKey(identifier)];
}
