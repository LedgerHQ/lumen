import { cssVar, type CSSVarRef } from '@ledgerhq/lumen-design-core';
import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';

const AVATAR_COLOR_TOKENS: Record<AvatarColorKey, CSSVarRef> = {
  orange: cssVar('var(--background-avatar-orange)'),
  green: cssVar('var(--background-avatar-green)'),
  blue: cssVar('var(--background-avatar-blue)'),
  purple: cssVar('var(--background-avatar-purple)'),
  red: cssVar('var(--background-avatar-red)'),
  yellow: cssVar('var(--background-avatar-yellow)'),
  turquoise: cssVar('var(--background-avatar-turquoise)'),
  pink: cssVar('var(--background-avatar-pink)'),
};

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * color tokens. The same identifier always resolves to the same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={resolveAvatarColor(id)} />`.
 */
export function resolveAvatarColor(identifier: string): CSSVarRef {
  return AVATAR_COLOR_TOKENS[resolveAvatarColorKey(identifier)];
}
