import { hashString } from '../string';

/**
 * The set of fallback background colors an Avatar can use when no image is
 * available. Each value maps to a `bg-avatar-letter-*` design token.
 */

// TODO: update with actual tokens here
export const AVATAR_COLORS = [
  '#f8b89b',
  '#aed09c',
  '#afc6fe',
  '#e2b9eb',
  '#ffb2b4',
  '#fbd98d',
  '#96dde9',
  '#f3b4db',
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
