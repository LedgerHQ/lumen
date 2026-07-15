import { primitiveColorTokens } from '@ledgerhq/lumen-design-core';
import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';

const AVATAR_COLOR_TOKENS: Record<AvatarColorKey, string> =
  primitiveColorTokens.light.avatar;

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * colors. The same identifier always resolves to the same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={resolveAvatarColor(id)} />`.
 */
export function resolveAvatarColor(identifier: string): string {
  return AVATAR_COLOR_TOKENS[resolveAvatarColorKey(identifier)];
}
