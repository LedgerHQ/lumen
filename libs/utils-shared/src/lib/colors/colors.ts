import { hashString } from '../string';

/**
 * The set of semantic color keys an Avatar can use when no image is available.
 * Each platform resolves these to its own color representation.
 */
export const AVATAR_COLOR_KEYS = [
  'orange',
  'green',
  'blue',
  'purple',
  'red',
  'yellow',
  'turquoise',
  'pink',
] as const;

export type AvatarColorKey = (typeof AVATAR_COLOR_KEYS)[number];

/**
 * Resolves a stable identifier (e.g. a user id) to one of the {@link AVATAR_COLOR_KEYS}.
 * The same identifier always resolves to the same key.
 *
 * @internal Use the platform-specific `resolveAvatarColor` from `ui-react` or
 * `ui-rnative` instead. They map the key to the correct color value.
 */
export function resolveAvatarColorKey(identifier: string): AvatarColorKey {
  const hash = hashString(identifier);

  const index =
    ((hash % AVATAR_COLOR_KEYS.length) + AVATAR_COLOR_KEYS.length) %
    AVATAR_COLOR_KEYS.length;

  return AVATAR_COLOR_KEYS[index];
}
