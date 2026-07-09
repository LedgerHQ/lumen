import { hashString } from '../string';

/**
 * The set of fallback background colors an Avatar can use when no image is
 * available. Each value maps to a `bg-avatar-letter-*` design token.
 */
export const AVATAR_COLORS = [
  'bg-avatar-letter-orange',
  'bg-avatar-letter-green',
  'bg-avatar-letter-blue',
  'bg-avatar-letter-purple',
  'bg-avatar-letter-red',
  'bg-avatar-letter-yellow',
  'bg-avatar-letter-turquoise',
  'bg-avatar-letter-pink',
] as const;

export type AvatarColor = (typeof AVATAR_COLORS)[number];

/**
 * Resolves a stable identifier (e.g. a user id) to one of the {@link AVATAR_COLORS}.
 * The same identifier always resolves to the same color.
 */
export function resolveAvatarColor(identifier: string): AvatarColor {
  const hash = hashString(identifier);

  const index =
    ((hash % AVATAR_COLORS.length) + AVATAR_COLORS.length) %
    AVATAR_COLORS.length;

  return AVATAR_COLORS[index];
}
