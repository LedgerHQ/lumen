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

const AVATAR_TEXT_COLOR_TOKENS: Record<AvatarColorKey, CSSVarRef> = {
  orange: cssVar('var(--text-decorative-strong-orange)'),
  green: cssVar('var(--text-decorative-strong-green)'),
  blue: cssVar('var(--text-decorative-strong-blue)'),
  purple: cssVar('var(--text-decorative-strong-purple)'),
  red: cssVar('var(--text-decorative-strong-red)'),
  yellow: cssVar('var(--text-decorative-strong-yellow)'),
  turquoise: cssVar('var(--text-decorative-strong-turquoise)'),
  pink: cssVar('var(--text-decorative-strong-pink)'),
};

const AVATAR_TEXT_COLOR_BY_BACKGROUND: Partial<Record<CSSVarRef, CSSVarRef>> =
  Object.fromEntries(
    (Object.keys(AVATAR_COLOR_TOKENS) as AvatarColorKey[]).map((key) => [
      AVATAR_COLOR_TOKENS[key],
      AVATAR_TEXT_COLOR_TOKENS[key],
    ]),
  );

const DEFAULT_FALLBACK_TEXT_COLOR: CSSVarRef = cssVar('var(--text-base)');

/**
 * Resolves a stable identifier (e.g. a user id) to one of the avatar pastel
 * color tokens. The same identifier always resolves to the same color.
 *
 * Pass the result directly to `<Avatar fallbackColor={resolveAvatarColor(id)} />`.
 */
export function resolveAvatarColor(identifier: string): CSSVarRef {
  return AVATAR_COLOR_TOKENS[resolveAvatarColorKey(identifier)];
}

/**
 * Resolves the fallback text/icon color matching a `fallbackColor` produced
 * by {@link resolveAvatarColor}. Falls back to `--text-base` when
 * `fallbackColor` is unset or isn't one of the known avatar color tokens.
 *
 * @internal
 */
export function getAvatarFallbackTextColor(fallbackColor?: string): CSSVarRef {
  return (
    (fallbackColor &&
      AVATAR_TEXT_COLOR_BY_BACKGROUND[fallbackColor as CSSVarRef]) ||
    DEFAULT_FALLBACK_TEXT_COLOR
  );
}
