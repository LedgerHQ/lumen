import { cssVar, type CSSVarRef } from '@ledgerhq/lumen-design-core';
import {
  resolveAvatarColorKey,
  type AvatarColorKey,
} from '@ledgerhq/lumen-utils-shared';

const AVATAR_COLOR_TOKENS: Record<AvatarColorKey, CSSVarRef> = {
  orange: cssVar('var(--background-decorative-orange)'),
  green: cssVar('var(--background-decorative-green)'),
  blue: cssVar('var(--background-decorative-blue)'),
  purple: cssVar('var(--background-decorative-purple)'),
  red: cssVar('var(--background-decorative-red)'),
  yellow: cssVar('var(--background-decorative-yellow)'),
  turquoise: cssVar('var(--background-decorative-turquoise)'),
  pink: cssVar('var(--background-decorative-pink)'),
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
