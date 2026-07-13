import { hashString } from '../string';

/**
 * The set of fallback background colors an Avatar can use when no image is
 * available.
 */

export const AVATAR_COLORS = [
  'var(--color-background-avatar-orange)',
  'var(--color-background-avatar-green)',
  'var(--color-background-avatar-blue)',
  'var(--color-background-avatar-purple)',
  'var(--color-background-avatar-red)',
  'var(--color-background-avatar-yellow)',
  'var(--color-background-avatar-turquoise)',
  'var(--color-background-avatar-pink)',
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
